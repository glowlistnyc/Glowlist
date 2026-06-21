// scripts/setup-contentful.js
// Contentfulにコンテンツモデルを自動作成するスクリプト
// 実行: node scripts/setup-contentful.js

require('dotenv').config({ path: '.env.local' });
const https = require('https');

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const MGMT_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN;

if (!SPACE_ID || !MGMT_TOKEN) {
  console.error('ERROR: CONTENTFUL_SPACE_ID and CONTENTFUL_MANAGEMENT_TOKEN are required in .env.local');
  process.exit(1);
}

// ── HTTP helper ──────────────────────────────────────────────────────────────
function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const options = {
      hostname: 'api.contentful.com',
      path,
      method,
      headers: {
        'Authorization': `Bearer ${MGMT_TOKEN}`,
        'Content-Type': 'application/vnd.contentful.management.v1+json',
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
      },
    };
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (res.statusCode >= 400) {
            console.error(`  HTTP ${res.statusCode}:`, parsed.message || body);
            resolve(null);
          } else {
            resolve(parsed);
          }
        } catch {
          resolve(body);
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function createContentType(id, name, fields) {
  console.log(`\nCreating content type: ${name}...`);

  // Create
  const created = await request(
    'PUT',
    `/spaces/${SPACE_ID}/environments/master/content_types/${id}`,
    { name, displayField: 'name', fields }
  );
  if (!created) { console.log(`  Skipped (may already exist)`); return; }

  // Publish
  await request(
    'PUT',
    `/spaces/${SPACE_ID}/environments/master/content_types/${id}/published`,
    null
  );
  console.log(`  ✓ ${name} created and published`);
}

// ── Content Type Definitions ─────────────────────────────────────────────────

const SALON_FIELDS = [
  { id: 'name',            name: 'Name',             type: 'Symbol',  required: true },
  { id: 'slug',            name: 'Slug',             type: 'Symbol',  required: true },
  { id: 'category',        name: 'Category',         type: 'Symbol',  required: true,
    validations: [{ in: ['nails', 'lashes', 'both'] }] },
  { id: 'area',            name: 'Area',             type: 'Symbol',  required: true },
  { id: 'areaSlug',        name: 'Area Slug',        type: 'Symbol',  required: true },
  { id: 'tags',            name: 'Tags',             type: 'Array',   required: true,
    items: { type: 'Symbol', validations: [] } },
  { id: 'instagramHandle', name: 'Instagram Handle', type: 'Symbol',  required: true },
  { id: 'bookingUrl',      name: 'Booking URL',      type: 'Symbol',  required: true },
  { id: 'priceRange',      name: 'Price Range',      type: 'Symbol',  required: false },
  { id: 'language',        name: 'Language',         type: 'Symbol',  required: false },
  { id: 'priceDetails',    name: 'Price Details',    type: 'Object',  required: false },
  { id: 'verified',        name: 'Verified',         type: 'Boolean', required: true },
  { id: 'notes',           name: 'Notes',            type: 'Symbol',  required: false },
  { id: 'featured',        name: 'Featured',         type: 'Boolean', required: true },
  { id: 'seoTitle',        name: 'SEO Title',        type: 'Symbol',  required: false },
  { id: 'seoDescription',  name: 'SEO Description',  type: 'Text',    required: false },
  { id: 'heroImage',       name: 'Hero Image',       type: 'Link',    required: false,
    linkType: 'Asset' },
  { id: 'photos',          name: 'Photos',           type: 'Array',   required: false,
    items: { type: 'Link', linkType: 'Asset', validations: [] } },
];

const AREA_FIELDS = [
  { id: 'name',           name: 'Name',            type: 'Symbol',  required: true },
  { id: 'slug',           name: 'Slug',            type: 'Symbol',  required: true },
  { id: 'bigArea',        name: 'Big Area',        type: 'Symbol',  required: true,
    validations: [{ in: ['manhattan', 'brooklyn', 'queens'] }] },
  { id: 'seoTitle',       name: 'SEO Title',       type: 'Symbol',  required: false },
  { id: 'seoDescription', name: 'SEO Description', type: 'Text',    required: false },
];

const SERVICE_FIELDS = [
  { id: 'name',             name: 'Name',              type: 'Symbol',  required: true },
  { id: 'slug',             name: 'Slug',              type: 'Symbol',  required: true },
  { id: 'shortDescription', name: 'Short Description', type: 'Symbol',  required: true },
  { id: 'tags',             name: 'Tags',              type: 'Array',   required: true,
    items: { type: 'Symbol', validations: [] } },
  { id: 'seoTitle',         name: 'SEO Title',         type: 'Symbol',  required: false },
  { id: 'seoDescription',   name: 'SEO Description',   type: 'Text',    required: false },
];

const BLOG_FIELDS = [
  { id: 'title',          name: 'Title',          type: 'Symbol',  required: true },
  { id: 'slug',           name: 'Slug',           type: 'Symbol',  required: true },
  { id: 'excerpt',        name: 'Excerpt',        type: 'Text',    required: true },
  { id: 'body',           name: 'Body',           type: 'RichText', required: true },
  { id: 'publishedAt',    name: 'Published At',   type: 'Date',    required: true },
  { id: 'tags',           name: 'Tags',           type: 'Array',   required: false,
    items: { type: 'Symbol', validations: [] } },
  { id: 'coverImage',     name: 'Cover Image',    type: 'Link',    required: false,
    linkType: 'Asset' },
  { id: 'seoTitle',       name: 'SEO Title',      type: 'Symbol',  required: false },
  { id: 'seoDescription', name: 'SEO Description', type: 'Text',   required: false },
];

// ── Field builder ─────────────────────────────────────────────────────────────
function buildField(f) {
  const field = {
    id: f.id,
    name: f.name,
    type: f.type,
    required: f.required ?? false,
    localized: false,
  };
  if (f.validations) field.validations = f.validations;
  if (f.linkType) { field.linkType = f.linkType; field.validations = f.validations || []; }
  if (f.type === 'Array') {
    field.items = f.items;
    field.validations = [];
  }
  return field;
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('=== Glowlist NYC — Contentful Setup ===');
  console.log(`Space ID: ${SPACE_ID}`);

  await createContentType('salon',    'Salon',    SALON_FIELDS.map(buildField));
  await createContentType('area',     'Area',     AREA_FIELDS.map(buildField));
  await createContentType('service',  'Service',  SERVICE_FIELDS.map(buildField));
  await createContentType('blogPost', 'Blog Post', BLOG_FIELDS.map(buildField));

  console.log('\n=== Setup Complete ===');
  console.log('Next step: node scripts/import-salons.js');
}

main().catch(console.error);
