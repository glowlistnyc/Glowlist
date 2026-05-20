require('dotenv').config({ path: '.env.local' });
const https = require('https');
const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const MGMT_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
if (!SPACE_ID || !MGMT_TOKEN) { console.error('ERROR: Check .env.local'); process.exit(1); }
function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const options = { hostname: 'api.contentful.com', path, method, headers: { 'Authorization': `Bearer ${MGMT_TOKEN}`, 'Content-Type': 'application/vnd.contentful.management.v1+json', ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}) } };
    const req = https.request(options, (res) => { let b = ''; res.on('data', c => b += c); res.on('end', () => { try { const p = JSON.parse(b); resolve(res.statusCode >= 400 ? null : p); } catch { resolve(null); } }); });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}
async function createCT(id, name, fields) {
  console.log(`Creating ${name}...`);
  const r = await request('PUT', `/spaces/${SPACE_ID}/environments/master/content_types/${id}`, { name, displayField: 'name', fields });
  if (!r) { console.log('  Skipped (may exist)'); return; }
  await request('PUT', `/spaces/${SPACE_ID}/environments/master/content_types/${id}/published`, null);
  console.log(`  Done: ${name}`);
}
function f(id, name, type, required, extra) { return { id, name, type, required: !!required, localized: false, validations: [], ...extra }; }
async function main() {
  console.log('=== Setting up Contentful models ===');
  await createCT('salon', 'Salon', [
    f('name','Name','Symbol',true), f('slug','Slug','Symbol',true), f('category','Category','Symbol',true,{validations:[{in:['nails','lashes','both']}]}),
    f('area','Area','Symbol',true), f('areaSlug','Area Slug','Symbol',true), f('tags','Tags','Array',true,{items:{type:'Symbol',validations:[]}}),
    f('instagramHandle','Instagram Handle','Symbol',true), f('bookingUrl','Booking URL','Symbol',true),
    f('priceRange','Price Range','Symbol',false), f('language','Language','Symbol',false), f('priceDetails','Price Details','Object',false),
    f('verified','Verified','Boolean',true), f('featured','Featured','Boolean',true), f('notes','Notes','Symbol',false),
    f('seoTitle','SEO Title','Symbol',false), f('seoDescription','SEO Description','Text',false),
    f('heroImage','Hero Image','Link',false,{linkType:'Asset'}), f('photos','Photos','Array',false,{items:{type:'Link',linkType:'Asset',validations:[]}}),
  ]);
  await createCT('area', 'Area', [
    f('name','Name','Symbol',true), f('slug','Slug','Symbol',true), f('bigArea','Big Area','Symbol',true,{validations:[{in:['manhattan','brooklyn','queens']}]}),
    f('seoTitle','SEO Title','Symbol',false), f('seoDescription','SEO Description','Text',false),
  ]);
  await createCT('service', 'Service', [
    f('name','Name','Symbol',true), f('slug','Slug','Symbol',true), f('shortDescription','Short Description','Symbol',true),
    f('tags','Tags','Array',true,{items:{type:'Symbol',validations:[]}}),
    f('seoTitle','SEO Title','Symbol',false), f('seoDescription','SEO Description','Text',false),
  ]);
  await createCT('blogPost', 'Blog Post', [
    f('title','Title','Symbol',true), f('slug','Slug','Symbol',true), f('excerpt','Excerpt','Text',true),
    f('body','Body','RichText',true), f('publishedAt','Published At','Date',true),
    f('tags','Tags','Array',false,{items:{type:'Symbol',validations:[]}}),
    f('coverImage','Cover Image','Link',false,{linkType:'Asset'}),
    f('seoTitle','SEO Title','Symbol',false), f('seoDescription','SEO Description','Text',false),
  ]);
  console.log('\n=== Done! Run: node scripts/import-salons.js ===');
}
main().catch(console.error);
