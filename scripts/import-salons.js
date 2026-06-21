// scripts/import-salons.js
// 既存サロンデータをContentfulに自動インポート
// 実行: node scripts/import-salons.js

require('dotenv').config({ path: '.env.local' });
const https = require('https');

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const MGMT_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN;

if (!SPACE_ID || !MGMT_TOKEN) {
  console.error('ERROR: CONTENTFUL_SPACE_ID and CONTENTFUL_MANAGEMENT_TOKEN required in .env.local');
  process.exit(1);
}

// ── HTTP helper ──────────────────────────────────────────────────────────────
function request(method, path, body, extraHeaders = {}) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const options = {
      hostname: 'api.contentful.com',
      path,
      method,
      headers: {
        'Authorization': `Bearer ${MGMT_TOKEN}`,
        'Content-Type': 'application/vnd.contentful.management.v1+json',
        ...extraHeaders,
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
      },
    };
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (c) => body += c);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (res.statusCode >= 400) {
            console.error(`    HTTP ${res.statusCode}:`, parsed.message || '');
            resolve(null);
          } else {
            resolve({ data: parsed, version: res.headers['x-contentful-version'] });
          }
        } catch { resolve({ data: body }); }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── Area slug classification ──────────────────────────────────────────────────
function getAreaSlug(area) {
  const a = area.toLowerCase();
  if (a.includes('williamsburg')) return 'williamsburg';
  if (a.includes('brooklyn')) return 'brooklyn';
  if (a.includes('long island city') || a.includes('queens')) return 'long-island-city';
  if (a.includes('soho') || a.includes('west village')) return 'soho';
  if (a.includes('tribeca')) return 'tribeca';
  if (a.includes('lower east side')) return 'lower-east-side';
  if (a.includes('lower manhattan') || a.includes('chinatown')) return 'lower-manhattan';
  if (a.includes('nomad')) return 'nomad';
  if (a.includes('chelsea') || a.includes('flatiron')) return 'chelsea';
  if (a.includes('union square')) return 'union-square';
  if (a.includes('murray hill')) return 'midtown-east';
  if (a.includes('midtown east')) return 'midtown-east';
  if (a.includes('k-town') || a.includes('ktown') || a.includes('k town')) return 'k-town';
  if (a.includes('midtown') || a.includes('fifth ave') || a.includes('rockefeller') || a.includes('garment')) return 'midtown';
  if (a.includes('upper west')) return 'upper-west-side';
  if (a.includes('upper east') || a.includes('ues')) return 'upper-east-side';
  if (a.includes('east village')) return 'east-village';
  return 'manhattan';
}

// ── Parse price details ───────────────────────────────────────────────────────
function parsePriceDetails(raw) {
  if (!raw) return [];
  const items = raw.split('||').map(s => {
    const parts = s.split('::');
    return { service: (parts[0] || '').trim(), price: (parts[1] || '').trim() };
  }).filter(i => i.service);
  return items.length ? [{ category: 'Services', items }] : [];
}

// ── Slug generator ────────────────────────────────────────────────────────────
function toSlug(name) {
  return name.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// ── Salon data ────────────────────────────────────────────────────────────────
const SALONS = [
  // NAILS
  { name: 'Mellow Bar', category: 'nails', area: 'SoHo / West Village', tags: ['Japanese gel','HEMA-free','Simple','Very clean','Beginner friendly','Great value','Multiple locations'], ig: 'mellowbarnyc', book: 'https://www.mellow-bar.com/#book-now', price: 'From $70', lang: 'Japanese-speaking', priceRaw: 'Japanese Gel Manicure::From $70||Japanese Gel Pedicure::From $93||Nail Art Add-on::From $30||Extensions::From $124', verified: true, featured: true, notes: 'Two locations: SoHo (120 Sullivan St) and West Village (406 6th Ave). HEMA-free TPO-free in-house gel.' },
  { name: 'TOMOKO Nail NYC', category: 'nails', area: 'Williamsburg', tags: ['Japanese gel','Japanese speaking','Simple','Very clean','Beginner friendly','Private studio'], ig: 'tomokonailnyc', book: 'https://book.squareup.com/appointments/fvei91f3z8fdzb/location/L50D3QC614RF5/services', price: 'From $80', lang: 'Japanese-speaking', priceRaw: 'Gel Manicure::From $80||Custom Nail Art::Inquire via IG', verified: true, featured: true, notes: 'Japanese nail educator licensed. Private studio in Williamsburg. Uses Presto and Nail Parfait gel.' },
  { name: 'Kirei House', category: 'nails', area: 'Midtown / Fifth Ave', tags: ['Japanese gel','Kokoist','Elegant','Pricey but worth it','Special occasion','Very clean','Quiet','Award-winning'], ig: 'kireihousenyc', book: 'https://www.kirei-house.com/book', price: 'Premium', lang: '', priceRaw: 'Kokoist Soft Gel Manicure::From $85||Perfect Fill-In::From $75||Nail Art Add-on::$20+', verified: true, featured: true, notes: 'Inside The Core Club, 711 Fifth Ave. Best Japanese Gel Manicure by Modern Luxury Manhattan.' },
  { name: 'Yukie Natori NY', category: 'nails', area: 'Midtown', tags: ['Japanese gel','Kokoist','ParaGel','Elegant','Pricey but worth it','NYFW','Special occasion'], ig: 'yukiebeautyspa', book: 'https://yukienatori-newyork.com/#contact-form', price: 'From $130', lang: 'Japanese-speaking', priceRaw: 'Japanese Gel Manicure::From $130||Extensions::$130-$210||Shellac Gel Polish::Inquire', verified: true, featured: false, notes: 'Uses Kokoist and ParaGel. NYFW and Paris Fashion Week backstage experience.' },
  { name: 'AKIKO Nails', category: 'nails', area: 'Lower East Side', tags: ['Japanese gel','Bold design','Trendy','Nail art','Custom design','LES'], ig: 'akikonails_nyc', book: 'https://www.akikonailsnyc.com/how-to-book', price: 'Mid-range', lang: '', priceRaw: 'Gel Manicure::From $60||Custom Nail Art::Inquire via website', verified: true, featured: true, notes: '135 Eldridge St. Artists trained in Japanese nail art technique.' },
  { name: 'Peach Bling', category: 'nails', area: 'Tribeca / Long Island City', tags: ['Japanese gel','HEMA-free','Cat-eye','Elegant','Quiet','Special occasion','Structured gel'], ig: 'peach.bling.nyc', book: 'https://book.squareup.com/appointments/1jqqrzh5yumja7/location/L52T5RGZ9D6T7/services', price: 'From $38', lang: '', priceRaw: 'Clean Manicure::$38||Structured Gel Mani::Price varies||Flush Fit Gel-X::Price varies', verified: true, featured: true, notes: 'Tribeca (106 Reade St) and LIC. Structured gel and cat-eye specialist. HEMA-free.' },
  { name: 'M&M Studio NYC', category: 'nails', area: 'NoMad', tags: ['Japanese gel','Simple','Natural','Great value','Japanese speaking','Affordable'], ig: 'mmstudionyc', book: 'https://www.mmstudionyc.com', price: 'From $60', lang: 'Japanese-speaking', priceRaw: 'Gel Manicure::From $60||Gel Pedicure::$70||Extensions::From $120', verified: true, featured: false, notes: '45 W 29th St. One of most affordable Japanese gel options in Manhattan.' },
  { name: 'Art Up Nail Studio NYC', category: 'nails', area: 'Murray Hill', tags: ['Japanese gel','Vetro','Kokoist','Presto','Nail art','Japanese-trained','NYFW'], ig: 'artupnailnyc', book: 'https://www.vagaro.com/artupnailstudionyc1', price: 'Mid-range', lang: '', priceRaw: 'Japanese Gel Manicure::Check Vagaro||3D Nail Art::Check Vagaro||Free Hand Design::Check Vagaro', verified: true, featured: false, notes: '222 E 34th St. Certified Advanced Japan Nail Artist. NYFW 2018-2019 backstage.' },
  { name: 'Upper West Spa', category: 'nails', area: 'Upper West Side', tags: ['Japanese gel','Kokoist','Semi-hard gel','Natural','Healthy nails','UWS'], ig: 'upperwestspa', book: 'https://upperwestspa.com', price: 'Check website', lang: '', priceRaw: 'Japanese Semi-Hard Gel Manicure::Check website||Pedicure::Check website', verified: true, featured: false, notes: 'Uses Kokoist semi-hard gel. Zero chipping for 3+ weeks reported.' },
  { name: 'Shizuka New York Day Spa', category: 'nails', area: 'Midtown / Rockefeller Center', tags: ['Japanese gel','Presto LED','Day spa','Luxury','Japanese speaking','Midtown'], ig: 'shizukanewyork', book: 'https://shizukany.com/services/nails/', price: 'Check website', lang: 'Japanese-speaking', priceRaw: 'Presto LED Gel Manicure::Check website||LED Gel Pedicure::Check website', verified: true, featured: false, notes: "Near Rockefeller Center. NYC's exclusive carrier of Presto LED Gel. Non-UV, non-acid, odorless." },
  { name: 'Artonus Nails Room', category: 'nails', area: 'K-Town / Midtown', tags: ['Japanese-inspired','Korean-inspired','Structured gel','Hand-painted','Nail art','K-Town','Non-toxic'], ig: 'artonusnailsroom', book: 'https://www.artonusnailsroom.com', price: 'Mid-range', lang: '', priceRaw: 'Structured Gel Manicure::Check website||Hand-painted Nail Art::Check website', verified: true, featured: false, notes: '38 W 32nd St Suite 1011. Small K-Town studio. Non-toxic gel.' },
  { name: 'We Nail Brooklyn', category: 'nails', area: 'Brooklyn', tags: ['Japanese gel','Kokoist','Natural','Brooklyn','Structured gel','Great value'], ig: 'wenailbrooklyn', book: 'https://wenail.setmore.com/', price: 'From $55', lang: '', priceRaw: 'Japanese Kokoist Gel Manicure::Check website||Hard Gel Overlay::Check website', verified: true, featured: false, notes: 'Brooklyn. Uses Japanese Kokoist gel. Ideal for thin, flexible nails.' },
  { name: '1995 Nailz', category: 'nails', area: 'Flatiron', tags: ['Japanese gel','Kokoist certified','Private studio','Gel-X','Flatiron'], ig: '1995nailz', book: 'https://www.instagram.com/1995nailz', price: 'Check Instagram', lang: '', priceRaw: 'Kokoist Gel Manicure::Check Instagram||Gel-X Extensions::Check Instagram', verified: true, featured: false, notes: 'Flatiron District. Private nail studio. Kokoist Level 2 certified.' },
  { name: 'Mari Nails Branche', category: 'nails', area: 'Manhattan', tags: ['Japanese gel','ParaGel','Fill-in specialist','Natural nail care','Japanese speaking'], ig: 'marinails___branche', book: 'https://www.instagram.com/marinails___branche/', price: 'Check Instagram', lang: 'Japanese-speaking', priceRaw: 'ParaGel Manicure::Check Instagram||Fill-In::Check Instagram', verified: true, featured: false, notes: 'Specializes in natural nail care and fill-in technique using ParaGel.' },
  { name: 'Viblissimo Beauty', category: 'nails', area: 'East Village', tags: ['Japanese-inspired','Nail art','East Village','Custom design','Hand-painted'], ig: 'viblissimobeauty', book: 'https://www.viblissimobeauty.com', price: 'Check website', lang: '', priceRaw: 'Japanese Gel Manicure::Check website||Custom Hand-painted Art::Check website', verified: true, featured: false, notes: '35 E 1st St. East Village. Japanese gel and custom hand-painted nail art.' },
  { name: 'Toka Salon NYC', category: 'nails', area: 'Midtown East / Madison Ave', tags: ['Japanese-inspired','Elegant','Midtown East','Hard gel','High-end','Madison Ave'], ig: 'tokasalonnyc', book: 'https://www.fresha.com', price: 'From $130', lang: '', priceRaw: 'Hard Gel Manicure::From $130||Gel Extensions::Check website', verified: true, featured: false, notes: '601 Madison Ave. High-end salon. Consistently 5-star reviewed.' },
  // LASHES
  { name: 'Gee Glow Beauty', category: 'lashes', area: 'Lower Manhattan', tags: ['Korean lash lift','Natural','Happy hour Tue-Fri','Bestie deal','2000+ clients','Brow lamination'], ig: 'geeglowbeauty', book: 'https://geeglowbeauty.as.me/schedule/3a2b24ce', price: 'From $112 (happy hour)', lang: '', priceRaw: 'Korean Lash Lift & Tint::$140||Happy Hour (Tue-Fri 11am-3pm)::$112||Top + Bottom Lift Combo::$195||Lash Lift + Brow Lamination::$205||Bestie Deal (per person)::$120', verified: true, featured: true, notes: '230 Grand St Suite 402. Korean Lash Lift specialist. 2000+ clients.' },
  { name: 'BKO Studios', category: 'lashes', area: 'Midtown / Garment District', tags: ['Korean lash lift','Wispies','Manhua lash','Brow lamination','13K followers','Midtown'], ig: 'bkostudios', book: 'https://bkostudios.square.site/', price: 'From $150', lang: '', priceRaw: 'Korean Lash Lift::Check website||Wispy Lash Extensions::From $150||Manhua Lash Set::Check website||Brow Lamination::Check website', verified: true, featured: false, notes: '330 W 38th St Rm 1200. 13K IG followers. Run by Vicki, Korean lash lift educator.' },
  { name: 'Beauty Artist Studio NYC', category: 'lashes', area: 'Midtown East', tags: ['Korean lash lift','Glue-free','Brow lamination','Cashmere lash','Midtown','Top-rated'], ig: 'beautyartistny', book: 'https://www.vagaro.com/beautyartistny', price: 'From $150', lang: '', priceRaw: 'Korean Glue-free Lash Lift + Tint::Check Vagaro||Ultimate Blowout Combo::$225 (was $325)||Premium Cashmere Set::From $150||Brow Lamination::Check Vagaro', verified: true, featured: false, notes: '12 E 44th St. Korean glue-free lash lift specialist. Lasts 3+ months for some clients.' },
  { name: 'Lome Beauty Studio', category: 'lashes', area: 'Williamsburg', tags: ['Korean lash lift','Williamsburg','Brooklyn','Brow lift','Natural'], ig: 'lomebeautystudio', book: 'https://www.lomebeautystudio.com/lash-brow-treatments', price: 'Check website', lang: '', priceRaw: 'Korean Lash Lift::Check website||Brow Lift::Check website||Lash + Brow Combo::Check website', verified: true, featured: false, notes: 'Korean Lash Lift and Brow Lift specialist. Williamsburg, Brooklyn.' },
  { name: 'Yoshi Eyelash', category: 'lashes', area: 'Union Square', tags: ['Japanese lash','Lash extension','Lash lift','Japanese speaking','Very clean','Natural','State certified'], ig: 'yoshieyelash', book: 'https://www.jewellhouse.nyc/booking-yoshieyelash', price: 'From $126 (first timer)', lang: 'Japanese-speaking', priceRaw: 'Flat Lash 100pc::$150||Flat Lash 120pc::$160||Volume Set::$200+||Keratin Lash Lift (first)::$126||Keratin Lash Lift (recurring)::$140||Lash Tint Add-on::$20', verified: true, featured: true, notes: '46 E 21st St 3F. State certified. All products imported from Japan. Text booking: +1 646-932-1227.' },
  { name: 'Lash Bar Foula', category: 'lashes', area: 'Chelsea', tags: ['Japanese lash','Vegan','Sensitive friendly','Tokyo-based','First visit discount','Cashmere'], ig: 'lashbar_foula', book: 'https://www.fresha.com/a/lash-bar-foula-new-york-120-west-25th-street-8p3fremk', price: 'From $120 (new client)', lang: '', priceRaw: 'Mink Single Set::$200 (new: $120)||Cashmere Single Set::$290 (new: $188.50)||Cashmere Volume Set::$465 (new: $372)||Keratin Lash Lift::$80||Retouch 2-3 weeks::From $100', verified: true, featured: true, notes: '120 W 25th St. Tokyo-based. Vegan hypoallergenic glue. Fresha Best in Class 2025. 4.9 stars.' },
  { name: 'MASTERPIECE (Lashes by Chito)', category: 'lashes', area: 'Williamsburg / Upper East Side', tags: ['Japanese lash','Lash lift','Vegan','Sensitive friendly','Quiet','Very clean','Williamsburg','UES'], ig: 'masterpiece.bk', book: 'https://www.lashesbychito.com/policies', price: 'From $180', lang: 'Japanese-speaking', priceRaw: 'Plump Lash Lift (upper only)::$180||Plump Lash Lift + Tint::$210||Natural Lash Extension Set::From $190', verified: true, featured: true, notes: 'Founded 2019. Williamsburg (37 Broadway) and UES (166 E 63rd St). Vegan cysteamine-based products.' },
  { name: 'Lashnista', category: 'lashes', area: 'NoMad', tags: ['Japanese lash','Lash lift','Lash extension','Natural','Elegant','Very clean','Keratin'], ig: 'lashnista.by.s', book: 'https://www.vagaro.com/lashnista', price: 'From $140', lang: 'Japanese-speaking', priceRaw: 'Classic Set (Certified Artist)::$140||Classic Set (Studio Owner)::$220||Keratin Lash Lift (first visit)::$200||Keratin Lash Lift (recurring)::$140', verified: true, featured: true, notes: '135 W 29th St #506. Japanese lash technique. Two pricing tiers.' },
  { name: 'Glam by Dang', category: 'lashes', area: 'Chelsea / Flatiron', tags: ['Korean-inspired','Lash lift','Lash extension','Brow lamination','Luxury','Chelsea','5-star'], ig: 'glambydang', book: 'https://www.fresha.com', price: 'From $175', lang: '', priceRaw: 'Keratin Lash Lift::$175||Classic Full Set::$200||Hybrid Full Set::$250||Brow Lamination::$150', verified: true, featured: false, notes: '37 W 26th St #808. 5.0 stars on Fresha. Luxury lash studio.' },
  // HEAD SPA
  { name: 'Yukie Natori Head Spa', category: 'both', area: 'Midtown', tags: ['Head spa','Japanese speaking','Luxury','Midtown','Scalp care'], ig: 'yukiebeautyspa', book: 'https://yukienatori-newyork.com/#contact-form', price: 'From $135', lang: 'Japanese-speaking', priceRaw: 'Signature Head Spa::From $135||Scalp Treatment::Check website', verified: true, featured: false, notes: '39 W 56th St. Also offers nails and facial.' },
];

// ── Create salon entry ────────────────────────────────────────────────────────
async function createSalon(salon) {
  const slug = toSlug(salon.name);
  const areaSlug = getAreaSlug(salon.area);
  const priceDetails = parsePriceDetails(salon.priceRaw);

  const fields = {
    name:            { 'en-US': salon.name },
    slug:            { 'en-US': slug },
    category:        { 'en-US': salon.category },
    area:            { 'en-US': salon.area },
    areaSlug:        { 'en-US': areaSlug },
    tags:            { 'en-US': salon.tags },
    instagramHandle: { 'en-US': salon.ig },
    bookingUrl:      { 'en-US': salon.book },
    priceRange:      { 'en-US': salon.price || '' },
    language:        { 'en-US': salon.lang || '' },
    priceDetails:    { 'en-US': priceDetails },
    verified:        { 'en-US': salon.verified },
    featured:        { 'en-US': salon.featured },
    notes:           { 'en-US': salon.notes || '' },
  };

  // Create entry
  const res = await request(
    'POST',
    `/spaces/${SPACE_ID}/environments/master/entries`,
    { fields },
    { 'X-Contentful-Content-Type': 'salon' }
  );

  if (!res || !res.data || !res.data.sys) {
    console.log(`  ✗ Failed to create: ${salon.name}`);
    return;
  }

  const entryId = res.data.sys.id;
  const version = res.data.sys.version;

  // Publish
  await request(
    'PUT',
    `/spaces/${SPACE_ID}/environments/master/entries/${entryId}/published`,
    null,
    { 'X-Contentful-Version': String(version) }
  );

  console.log(`  ✓ ${salon.name} (${slug})`);
  await sleep(300); // Rate limit protection
}

// ── Create area entries ───────────────────────────────────────────────────────
const AREAS = [
  { name: 'SoHo / West Village', slug: 'soho', bigArea: 'manhattan' },
  { name: 'Lower East Side',     slug: 'lower-east-side', bigArea: 'manhattan' },
  { name: 'Tribeca',             slug: 'tribeca', bigArea: 'manhattan' },
  { name: 'Lower Manhattan',     slug: 'lower-manhattan', bigArea: 'manhattan' },
  { name: 'NoMad',               slug: 'nomad', bigArea: 'manhattan' },
  { name: 'Chelsea / Flatiron',  slug: 'chelsea', bigArea: 'manhattan' },
  { name: 'Union Square',        slug: 'union-square', bigArea: 'manhattan' },
  { name: 'Midtown',             slug: 'midtown', bigArea: 'manhattan' },
  { name: 'K-Town / Midtown',    slug: 'k-town', bigArea: 'manhattan' },
  { name: 'Midtown East / Murray Hill', slug: 'midtown-east', bigArea: 'manhattan' },
  { name: 'Upper East Side',     slug: 'upper-east-side', bigArea: 'manhattan' },
  { name: 'Upper West Side',     slug: 'upper-west-side', bigArea: 'manhattan' },
  { name: 'East Village',        slug: 'east-village', bigArea: 'manhattan' },
  { name: 'Williamsburg',        slug: 'williamsburg', bigArea: 'brooklyn' },
  { name: 'Brooklyn',            slug: 'brooklyn', bigArea: 'brooklyn' },
  { name: 'Long Island City',    slug: 'long-island-city', bigArea: 'queens' },
];

async function createArea(area) {
  const res = await request(
    'POST',
    `/spaces/${SPACE_ID}/environments/master/entries`,
    { fields: {
      name:    { 'en-US': area.name },
      slug:    { 'en-US': area.slug },
      bigArea: { 'en-US': area.bigArea },
    }},
    { 'X-Contentful-Content-Type': 'area' }
  );
  if (!res?.data?.sys) { console.log(`  ✗ Failed: ${area.name}`); return; }
  await request('PUT', `/spaces/${SPACE_ID}/environments/master/entries/${res.data.sys.id}/published`, null, { 'X-Contentful-Version': String(res.data.sys.version) });
  console.log(`  ✓ ${area.name}`);
  await sleep(200);
}

// ── Create service entries ────────────────────────────────────────────────────
const SERVICES = [
  { name: 'Japanese Gel Nails', slug: 'japanese-gel-nails', short: 'Minimal designs, long-lasting gel, and technicians trained in Japanese technique — across Manhattan and Williamsburg.', tags: ['Japanese gel'] },
  { name: 'Korean Lash Lift', slug: 'korean-lash-lift', short: 'Natural curl-up lift that lasts 6–8 weeks. No extensions needed. The most popular lash service in NYC.', tags: ['Korean lash lift'] },
  { name: 'Lash Extensions', slug: 'lash-extensions', short: 'Classic, hybrid, and volume sets. Japanese and Korean lash techniques available.', tags: ['Lash extension'] },
  { name: 'Brow Lamination', slug: 'brow-lamination', short: 'Fluffy, shaped brows that last up to 8 weeks. Often combined with lash lift.', tags: ['Brow lamination'] },
  { name: 'Head Spa', slug: 'head-spa', short: 'Japanese scalp care and head massage. A growing category in NYC led by Japanese-trained specialists.', tags: ['Head spa'] },
  { name: 'Gel-X Extensions', slug: 'gel-x-extensions', short: 'Soft gel nail extensions. No drilling, no damage. Great for thin or weak natural nails.', tags: ['Gel-X'] },
];

async function createService(svc) {
  const res = await request(
    'POST',
    `/spaces/${SPACE_ID}/environments/master/entries`,
    { fields: {
      name:             { 'en-US': svc.name },
      slug:             { 'en-US': svc.slug },
      shortDescription: { 'en-US': svc.short },
      tags:             { 'en-US': svc.tags },
    }},
    { 'X-Contentful-Content-Type': 'service' }
  );
  if (!res?.data?.sys) { console.log(`  ✗ Failed: ${svc.name}`); return; }
  await request('PUT', `/spaces/${SPACE_ID}/environments/master/entries/${res.data.sys.id}/published`, null, { 'X-Contentful-Version': String(res.data.sys.version) });
  console.log(`  ✓ ${svc.name}`);
  await sleep(200);
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('=== Glowlist NYC — Data Import ===\n');

  console.log('Importing Areas...');
  for (const area of AREAS) await createArea(area);

  console.log('\nImporting Services...');
  for (const svc of SERVICES) await createService(svc);

  console.log('\nImporting Salons...');
  for (const salon of SALONS) await createSalon(salon);

  console.log('\n=== Import Complete ===');
  console.log(`Areas: ${AREAS.length}`);
  console.log(`Services: ${SERVICES.length}`);
  console.log(`Salons: ${SALONS.length}`);
  console.log('\nNext step: node scripts/generate-blog-templates.js');
}

main().catch(console.error);
