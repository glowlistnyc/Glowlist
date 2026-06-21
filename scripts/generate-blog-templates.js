// scripts/generate-blog-templates.js
// ブログ記事のテンプレートをContentfulに自動作成
// 実行: node scripts/generate-blog-templates.js

require('dotenv').config({ path: '.env.local' });
const https = require('https');

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const MGMT_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN;

if (!SPACE_ID || !MGMT_TOKEN) {
  console.error('ERROR: CONTENTFUL_SPACE_ID and CONTENTFUL_MANAGEMENT_TOKEN required in .env.local');
  process.exit(1);
}

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
          resolve(res.statusCode >= 400 ? null : { data: parsed, version: res.headers['x-contentful-version'] });
        } catch { resolve(null); }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// Rich text paragraph helper
function para(text) {
  return {
    nodeType: 'paragraph',
    data: {},
    content: [{ nodeType: 'text', value: text, marks: [], data: {} }]
  };
}

function heading2(text) {
  return {
    nodeType: 'heading-2',
    data: {},
    content: [{ nodeType: 'text', value: text, marks: [], data: {} }]
  };
}

function richText(...nodes) {
  return {
    nodeType: 'document',
    data: {},
    content: nodes
  };
}

// ── Blog templates ────────────────────────────────────────────────────────────
// These are SEO-optimized templates. Fill in the [PLACEHOLDER] sections in Contentful.
const BLOG_TEMPLATES = [
  {
    title: 'Best Japanese Gel Nail Salons in NYC (2025 Curated Guide)',
    slug: 'best-japanese-gel-nail-salons-nyc',
    excerpt: 'Finding Japanese gel nails in NYC is harder than it should be. We curated the best salons by technique, products used, and community recommendations — not just star ratings.',
    tags: ['Japanese gel', 'Nails', 'NYC Guide', 'Best of'],
    body: richText(
      para('If you\'ve tried to find authentic Japanese gel nails in New York, you know the problem: Google gives you a list of salons with 4.5 stars, but no way to tell if they actually do the soft, minimal, long-lasting gel you\'re used to from Japan.'),
      para('We curated this list based on technique, products (Kokoist, ParaGel, Presto, Vetro), language support, and real community recommendations.'),
      heading2('What Makes Japanese Gel Different'),
      para('Japanese gel nails prioritize nail health over thickness. The gel is typically softer, more flexible, and easier to remove without damage. Popular Japanese brands like Kokoist, ParaGel, and Presto are designed to be gentle on natural nails.'),
      heading2('Our Top Picks'),
      para('[Add your top salon picks here with details from the Glowlist database. Each salon should include: name, area, specialty, price range, and why it made the list.]'),
      heading2('What to Look For When Booking'),
      para('Ask what gel brand they use. Kokoist, ParaGel, Presto, Vetro, and Nail Parfait are all Japanese brands associated with high-quality technique. If a salon can\'t tell you what products they use, that\'s a red flag.'),
      heading2('Price Guide'),
      para('Japanese gel manicures in NYC typically range from $60 for basics at a small studio to $130+ at luxury locations. The price difference usually reflects the quality of products and the technician\'s training — not just the neighborhood.'),
      para('→ Browse all Japanese gel nail salons on Glowlist')
    ),
  },
  {
    title: 'Korean Lash Lift in NYC: Everything You Need to Know (2025)',
    slug: 'korean-lash-lift-nyc-guide',
    excerpt: 'Korean lash lifts are taking over NYC. Here\'s what makes them different from a regular lash lift, how to find a specialist, and what to expect at your first appointment.',
    tags: ['Korean lash lift', 'Lashes', 'NYC Guide', 'Beginners'],
    body: richText(
      para('Korean lash lifts have become the most-requested lash service in New York — and for good reason. The technique gives you a soft, natural curl that lasts 6–8 weeks without the maintenance of extensions.'),
      heading2('Korean Lash Lift vs. Regular Lash Lift'),
      para('The key difference is the rod and technique. Korean lash lift uses smaller silicone pads positioned closer to the lash line, creating a more dramatic "lifted from the root" effect. The result looks more open-eyed and natural compared to a traditional lash perm.'),
      heading2('What to Expect at Your Appointment'),
      para('[Describe the appointment process: timing (~60-90 min), what happens during the service, aftercare instructions for the first 24-48 hours.]'),
      heading2('How to Find a Korean Lash Lift Specialist in NYC'),
      para('Not every salon that offers a "lash lift" is using Korean technique. Look for salons that specifically mention Korean lash lift, use silicone pads (not foam rods), and show before/after photos of natural-looking results.'),
      heading2('Price Guide'),
      para('Korean lash lifts in NYC range from $112 (happy hour pricing) to $175+ at luxury studios. Most include a tint. First-time client discounts are common.'),
      para('→ Browse Korean lash lift specialists on Glowlist')
    ),
  },
  {
    title: 'Japanese Gel Nails in Williamsburg, Brooklyn: Where to Go',
    slug: 'japanese-gel-nails-williamsburg-brooklyn',
    excerpt: 'Williamsburg has a small but growing scene for Japanese gel nails. Here are the spots worth knowing about — from private studios to neighborhood salons.',
    tags: ['Japanese gel', 'Williamsburg', 'Brooklyn', 'Nails'],
    body: richText(
      para('Williamsburg has quietly become one of the best neighborhoods in NYC for Japanese-style nail art. The area attracts artists and beauty professionals who bring a detail-oriented aesthetic that pairs well with the Japanese nail philosophy.'),
      heading2('What to Expect in Williamsburg'),
      para('Most Japanese gel studios in Williamsburg are small — often one or two technicians, appointment-only, with a calm atmosphere very different from the open-floor salons of Midtown.'),
      heading2('Our Picks'),
      para('[Add Williamsburg-specific salon recommendations here. Include TOMOKO Nail NYC and any others in the Glowlist database for this area.]'),
      heading2('How to Book'),
      para('Many Williamsburg nail studios are appointment-only and book through Instagram DM or Square. Booking 1–2 weeks in advance is recommended, especially on weekends.'),
      para('→ See all Williamsburg beauty spots on Glowlist')
    ),
  },
  {
    title: 'Head Spa NYC: Where to Get a Japanese Scalp Treatment',
    slug: 'head-spa-nyc-japanese-scalp-treatment',
    excerpt: 'Head spas are having a moment in NYC. Here\'s what a Japanese head spa actually involves, which salons do it well, and what you\'ll pay.',
    tags: ['Head spa', 'Japanese', 'Scalp treatment', 'NYC Guide'],
    body: richText(
      para('The Japanese head spa trend has arrived in New York City. If you\'ve seen the videos online — someone lying back while a technician methodically massages their scalp with oils and serums — that\'s exactly what it is. And it\'s worth it.'),
      heading2('What Is a Japanese Head Spa?'),
      para('A Japanese head spa is a scalp care treatment that combines deep cleansing, scalp analysis, hot oil or serum application, and massage. Sessions typically run 60–90 minutes and leave your scalp feeling clean and your hair visibly shinier.'),
      heading2('Benefits'),
      para('[Describe the benefits: stress relief, improved scalp health, hair growth stimulation, relaxation. Keep it factual — don\'t make medical claims.]'),
      heading2('Where to Go in NYC'),
      para('[Add head spa salon recommendations from Glowlist database. Include Shizuka New York, Yukie Natori, and any others.]'),
      heading2('What to Expect: Price & Time'),
      para('Japanese head spas in NYC start around $135 for a basic session and go up to $200+ for premium treatments. Book in advance — availability is limited at most studios.'),
      para('→ Browse head spa spots on Glowlist')
    ),
  },
  {
    title: 'HEMA-Free Gel Nails in NYC: Why It Matters and Where to Find Them',
    slug: 'hema-free-gel-nails-nyc',
    excerpt: 'If you\'ve ever had an allergic reaction to gel nails, HEMA might be the reason. Here\'s what HEMA-free gel is, why it matters, and which NYC salons use it.',
    tags: ['HEMA-free', 'Japanese gel', 'Sensitive', 'Nail health', 'NYC Guide'],
    body: richText(
      para('HEMA (hydroxyethyl methacrylate) is a chemical found in most gel nail products. For most people it\'s fine — but for those who develop a sensitivity, it can cause anything from itchy cuticles to a full allergic reaction that makes gel nails impossible.'),
      heading2('What Is HEMA and Why Does It Matter?'),
      para('HEMA is used in gel formulas to help the product adhere to the nail. The problem is that repeated exposure can trigger sensitization — your immune system starts treating HEMA as an allergen. Once sensitized, you may react to gel products for life.'),
      heading2('What to Look For'),
      para('HEMA-free gels replace HEMA with alternative adhesion molecules that are less likely to cause sensitization. Look for salons that explicitly mention HEMA-free formulas, and don\'t be afraid to ask.'),
      heading2('HEMA-Free Salons in NYC'),
      para('[Add HEMA-free salon recommendations here — Mellow Bar, Peach Bling, and any others in the Glowlist database with HEMA-free tags.]'),
      para('→ Browse HEMA-free salons on Glowlist')
    ),
  },
  {
    title: 'Lash Extensions vs. Lash Lift: Which Is Right for You?',
    slug: 'lash-extensions-vs-lash-lift-nyc',
    excerpt: 'Both lash extensions and lash lifts give you longer-looking lashes — but they work completely differently. Here\'s how to decide which is right for you.',
    tags: ['Lash extensions', 'Lash lift', 'Lashes', 'Beginners', 'NYC Guide'],
    body: richText(
      para('If you\'re new to lash services, the choice between extensions and a lift can be confusing. Both give you better lashes — but the commitment, maintenance, and results are very different.'),
      heading2('Lash Extensions'),
      para('Extensions are individual synthetic lashes glued to your natural lashes. They add length, volume, and curl beyond what your natural lashes can do. The result is dramatic or natural depending on the style you choose.'),
      para('Maintenance: every 2–4 weeks for fills. Time: 2 hours for a full set, 1 hour for fills. Cost: $120–$300+ for a full set in NYC.'),
      heading2('Lash Lift'),
      para('A lash lift curls your natural lashes from the root. No extensions added — just your own lashes, lifted. The result is more natural but still noticeably open-eyed. Korean lash lifts create an especially clean, root-lifted effect.'),
      para('Maintenance: once every 6–8 weeks. Time: 45–75 minutes. Cost: $112–$175 in NYC.'),
      heading2('Which Should You Choose?'),
      para('[Add a simple decision framework: natural lashes you\'re happy with → lift. Want more length/volume → extensions. Low maintenance → lift. Don\'t mind refills → extensions.]'),
      para('→ Browse lash specialists on Glowlist')
    ),
  },
];

// ── Create blog post ──────────────────────────────────────────────────────────
async function createBlogPost(post) {
  const res = await request(
    'POST',
    `/spaces/${SPACE_ID}/environments/master/entries`,
    { fields: {
      title:       { 'en-US': post.title },
      slug:        { 'en-US': post.slug },
      excerpt:     { 'en-US': post.excerpt },
      body:        { 'en-US': post.body },
      tags:        { 'en-US': post.tags },
      publishedAt: { 'en-US': new Date().toISOString() },
    }},
    { 'X-Contentful-Content-Type': 'blogPost' }
  );

  if (!res?.data?.sys) {
    console.log(`  ✗ Failed: ${post.title}`);
    return;
  }

  // Save as draft (don't publish yet — review before publishing)
  console.log(`  ✓ Draft created: ${post.title}`);
  console.log(`    Edit in Contentful before publishing → /blog/${post.slug}`);
  await sleep(300);
}

async function main() {
  console.log('=== Glowlist NYC — Blog Template Generator ===\n');
  console.log('Creating blog post DRAFTS (not published — review before publishing)...\n');

  for (const post of BLOG_TEMPLATES) {
    await createBlogPost(post);
  }

  console.log(`\n=== Done: ${BLOG_TEMPLATES.length} drafts created ===`);
  console.log('\nNext steps:');
  console.log('1. Go to contentful.com → Content → Blog Post');
  console.log('2. Open each draft');
  console.log('3. Fill in [placeholder] sections');
  console.log('4. Publish when ready');
  console.log('\nTarget: publish 2 posts per week');
}

main().catch(console.error);
