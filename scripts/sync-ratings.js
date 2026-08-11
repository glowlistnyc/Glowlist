// scripts/sync-ratings.js
// Google Places API + Yelp Fusion API からサロン評価を取得し、Contentfulに保存する
//
// 必要な環境変数（.env.localに追加）:
//   GOOGLE_PLACES_API_KEY=...   ← Google Cloud Console > APIs & Services > Credentials
//   YELP_API_KEY=...            ← https://www.yelp.com/developers/v3/manage_app
//   CONTENTFUL_SPACE_ID=...     （既存）
//   CONTENTFUL_MANAGEMENT_TOKEN=... （既存）
//
// 実行方法:
//   npm run sync:ratings
//
// 推奨: 週1回程度の実行（API利用制限のため）

require('dotenv').config({ path: '.env.local' });
const https = require('https');

const SPACE_ID   = process.env.CONTENTFUL_SPACE_ID;
const MGMT_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
const GOOGLE_KEY = process.env.GOOGLE_PLACES_API_KEY;
const YELP_KEY   = process.env.YELP_API_KEY;

if (!SPACE_ID || !MGMT_TOKEN) {
  console.error('ERROR: CONTENTFUL_SPACE_ID and CONTENTFUL_MANAGEMENT_TOKEN are required.');
  process.exit(1);
}
if (!GOOGLE_KEY && !YELP_KEY) {
  console.error('ERROR: At least one of GOOGLE_PLACES_API_KEY or YELP_API_KEY is required.');
  process.exit(1);
}

// ── HTTP helper ──────────────────────────────────────────────────────────────
function request(method, hostname, path, headers = {}, body = null) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const opts = {
      hostname, path, method,
      headers: { 'Content-Type': 'application/json', ...headers,
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}) },
    };
    const req = https.request(opts, (res) => {
      let b = '';
      res.on('data', c => b += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(b) }); }
        catch { resolve({ status: res.statusCode, data: b }); }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── Contentful: 全サロン取得 ────────────────────────────────────────────────
async function getContentfulSalons() {
  const res = await request('GET', 'api.contentful.com',
    `/spaces/${SPACE_ID}/environments/master/entries?content_type=salon&limit=200`,
    { 'Authorization': `Bearer ${MGMT_TOKEN}` }
  );
  if (res.status !== 200) throw new Error('Contentful fetch failed: ' + res.status);
  return res.data.items || [];
}

// ── Contentful: サロンエントリ更新 ─────────────────────────────────────────
async function updateContentfulSalon(entryId, version, updates) {
  const fields = {};
  for (const [key, val] of Object.entries(updates)) {
    fields[key] = { 'en-US': val };
  }
  const res = await request('PATCH', 'api.contentful.com',
    `/spaces/${SPACE_ID}/environments/master/entries/${entryId}`,
    {
      'Authorization': `Bearer ${MGMT_TOKEN}`,
      'Content-Type': 'application/vnd.contentful.management.v1+json',
      'X-Contentful-Version': String(version),
    },
    { fields }
  );
  if (res.status >= 400) {
    console.error(`  Contentful update failed (${res.status}):`, res.data?.message || '');
    return null;
  }
  // Publish
  await request('PUT', 'api.contentful.com',
    `/spaces/${SPACE_ID}/environments/master/entries/${entryId}/published`,
    {
      'Authorization': `Bearer ${MGMT_TOKEN}`,
      'Content-Type': 'application/vnd.contentful.management.v1+json',
      'X-Contentful-Version': String(res.data.sys.version),
    }
  );
  return res.data;
}

// ── Google Places API ───────────────────────────────────────────────────────
async function fetchGoogleRating(salonName, address) {
  if (!GOOGLE_KEY) return null;
  const query = encodeURIComponent(`${salonName} ${address || 'New York NY'}`);
  const path = `/maps/api/place/findplacefromtext/json?input=${query}&inputtype=textquery&fields=rating,user_ratings_total,place_id&key=${GOOGLE_KEY}`;
  const res = await request('GET', 'maps.googleapis.com', path);
  if (res.status !== 200 || !res.data.candidates?.length) return null;
  const place = res.data.candidates[0];
  if (!place.rating) return null;
  return {
    rating: place.rating,
    count: place.user_ratings_total || 0,
    placeId: place.place_id || '',
  };
}

// ── Yelp Fusion API ─────────────────────────────────────────────────────────
async function fetchYelpRating(salonName, address) {
  if (!YELP_KEY) return null;
  const term = encodeURIComponent(salonName);
  const location = encodeURIComponent(address || 'New York, NY');
  const path = `/v3/businesses/search?term=${term}&location=${location}&limit=1`;
  const res = await request('GET', 'api.yelp.com', path, {
    'Authorization': `Bearer ${YELP_KEY}`,
  });
  if (res.status !== 200 || !res.data.businesses?.length) return null;
  const biz = res.data.businesses[0];
  if (!biz.rating) return null;
  return {
    rating: biz.rating,
    count: biz.review_count || 0,
    businessId: biz.id || '',
  };
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('=== Glowlist NYC — Sync Ratings ===');
  console.log(`Google API: ${GOOGLE_KEY ? '✓' : '✗ not set'}`);
  console.log(`Yelp API:   ${YELP_KEY   ? '✓' : '✗ not set'}`);
  console.log('');

  const salons = await getContentfulSalons();
  console.log(`Found ${salons.length} salons\n`);

  let updated = 0, skipped = 0, errors = 0;

  for (const salon of salons) {
    const name    = salon.fields?.name?.['en-US'];
    const address = salon.fields?.address?.['en-US'] || '';
    const entryId = salon.sys.id;
    const version = salon.sys.version;

    if (!name) { skipped++; continue; }

    process.stdout.write(`  ${name}... `);

    const [google, yelp] = await Promise.all([
      fetchGoogleRating(name, address),
      fetchYelpRating(name, address),
    ]);

    if (!google && !yelp) {
      console.log('no ratings found');
      skipped++;
      await sleep(500);
      continue;
    }

    const updates = { ratingsLastSynced: new Date().toISOString() };
    if (google) {
      updates.googleRating = google.rating;
      updates.googleReviewCount = google.count;
      if (google.placeId) updates.googlePlaceId = google.placeId;
    }
    if (yelp) {
      updates.yelpRating = yelp.rating;
      updates.yelpReviewCount = yelp.count;
      if (yelp.businessId) updates.yelpBusinessId = yelp.businessId;
    }

    const result = await updateContentfulSalon(entryId, version, updates);
    if (result) {
      const parts = [];
      if (google) parts.push(`G:${google.rating}★(${google.count})`);
      if (yelp)   parts.push(`Y:${yelp.rating}★(${yelp.count})`);
      console.log(parts.join(' '));
      updated++;
    } else {
      console.log('update failed');
      errors++;
    }

    // API rate limit: 1秒待機
    await sleep(1000);
  }

  console.log('\n=== Complete ===');
  console.log(`Updated: ${updated} | Skipped: ${skipped} | Errors: ${errors}`);
  console.log('\nNext: Vercel will revalidate pages within 5 minutes (revalidate=300).');
}

main().catch(err => { console.error(err); process.exit(1); });
