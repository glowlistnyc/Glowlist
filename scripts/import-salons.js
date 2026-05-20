require('dotenv').config({ path: '.env.local' });
const https = require('https');
const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const MGMT_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
if (!SPACE_ID || !MGMT_TOKEN) { console.error('ERROR: Check .env.local'); process.exit(1); }
function request(method, path, body, extra={}) {
  return new Promise((resolve,reject) => {
    const data = body ? JSON.stringify(body) : null;
    const opts = { hostname:'api.contentful.com', path, method, headers:{ 'Authorization':`Bearer ${MGMT_TOKEN}`, 'Content-Type':'application/vnd.contentful.management.v1+json', ...extra, ...(data?{'Content-Length':Buffer.byteLength(data)}:{}) }};
    const req = https.request(opts, res => { let b=''; res.on('data',c=>b+=c); res.on('end',()=>{ try { const p=JSON.parse(b); resolve(res.statusCode>=400?null:{data:p,ver:res.headers['x-contentful-version']}); } catch{resolve(null);} }); });
    req.on('error',reject); if(data) req.write(data); req.end();
  });
}
function sleep(ms){return new Promise(r=>setTimeout(r,ms));}
function slug(n){return n.toLowerCase().replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-').replace(/-+/g,'-').replace(/^-|-$/g,'');}
function areaSlug(a){const s=a.toLowerCase();if(s.includes('williamsburg'))return 'williamsburg';if(s.includes('brooklyn'))return 'brooklyn';if(s.includes('long island'))return 'long-island-city';if(s.includes('soho')||s.includes('west village'))return 'soho';if(s.includes('tribeca'))return 'tribeca';if(s.includes('lower east'))return 'lower-east-side';if(s.includes('lower manhattan')||s.includes('chinatown'))return 'lower-manhattan';if(s.includes('nomad'))return 'nomad';if(s.includes('chelsea')||s.includes('flatiron'))return 'chelsea';if(s.includes('union square'))return 'union-square';if(s.includes('murray hill'))return 'midtown-east';if(s.includes('midtown east'))return 'midtown-east';if(s.includes('k-town')||s.includes('ktown'))return 'k-town';if(s.includes('midtown')||s.includes('fifth ave')||s.includes('garment')||s.includes('rockefeller'))return 'midtown';if(s.includes('upper west'))return 'upper-west-side';if(s.includes('upper east')||s.includes('ues'))return 'upper-east-side';if(s.includes('east village'))return 'east-village';return 'manhattan';}
function parsePrices(r){if(!r)return[];const items=r.split('||').map(s=>{const p=s.split('::');return{service:(p[0]||'').trim(),price:(p[1]||'').trim()};}).filter(i=>i.service);return items.length?[{category:'Services',items}]:[];}
const AREAS=[
  {name:'SoHo / West Village',slug:'soho',bigArea:'manhattan'},{name:'Lower East Side',slug:'lower-east-side',bigArea:'manhattan'},
  {name:'Tribeca',slug:'tribeca',bigArea:'manhattan'},{name:'Lower Manhattan',slug:'lower-manhattan',bigArea:'manhattan'},
  {name:'NoMad',slug:'nomad',bigArea:'manhattan'},{name:'Chelsea / Flatiron',slug:'chelsea',bigArea:'manhattan'},
  {name:'Union Square',slug:'union-square',bigArea:'manhattan'},{name:'Midtown',slug:'midtown',bigArea:'manhattan'},
  {name:'K-Town / Midtown',slug:'k-town',bigArea:'manhattan'},{name:'Midtown East / Murray Hill',slug:'midtown-east',bigArea:'manhattan'},
  {name:'Upper East Side',slug:'upper-east-side',bigArea:'manhattan'},{name:'Upper West Side',slug:'upper-west-side',bigArea:'manhattan'},
  {name:'East Village',slug:'east-village',bigArea:'manhattan'},{name:'Williamsburg',slug:'williamsburg',bigArea:'brooklyn'},
  {name:'Brooklyn',slug:'brooklyn',bigArea:'brooklyn'},{name:'Long Island City',slug:'long-island-city',bigArea:'queens'},
];
const SERVICES=[
  {name:'Japanese Gel Nails',slug:'japanese-gel-nails',short:'Minimal designs, long-lasting gel, and technicians trained in Japanese technique.',tags:['Japanese gel']},
  {name:'Korean Lash Lift',slug:'korean-lash-lift',short:'Natural curl-up lift that lasts 6-8 weeks. No extensions needed.',tags:['Korean lash lift']},
  {name:'Lash Extensions',slug:'lash-extensions',short:'Classic, hybrid, and volume sets. Japanese and Korean techniques available.',tags:['Lash extension']},
  {name:'Brow Lamination',slug:'brow-lamination',short:'Fluffy, shaped brows that last up to 8 weeks.',tags:['Brow lamination']},
  {name:'Head Spa',slug:'head-spa',short:'Japanese scalp care and head massage.',tags:['Head spa']},
  {name:'Gel-X Extensions',slug:'gel-x-extensions',short:'Soft gel nail extensions. No drilling, no damage.',tags:['Gel-X']},
];
const SALONS=[
  {name:'Mellow Bar',cat:'nails',area:'SoHo / West Village',tags:['Japanese gel','HEMA-free','Simple','Very clean','Beginner friendly'],ig:'mellowbarnyc',book:'https://www.mellow-bar.com/#book-now',price:'From $70',lang:'Japanese-speaking',pr:'Japanese Gel Manicure::From $70||Pedicure::From $93||Nail Art::From $30',ver:true,feat:true,notes:'Two locations: SoHo and West Village. HEMA-free TPO-free gel.'},
  {name:'TOMOKO Nail NYC',cat:'nails',area:'Williamsburg',tags:['Japanese gel','Japanese speaking','Simple','Very clean','Private studio'],ig:'tomokonailnyc',book:'https://book.squareup.com/appointments/fvei91f3z8fdzb/location/L50D3QC614RF5/services',price:'From $80',lang:'Japanese-speaking',pr:'Gel Manicure::From $80||Custom Nail Art::Inquire via IG',ver:true,feat:true,notes:'Japanese nail educator. Private studio in Williamsburg.'},
  {name:'Kirei House',cat:'nails',area:'Midtown / Fifth Ave',tags:['Japanese gel','Kokoist','Elegant','Very clean','Award-winning'],ig:'kireihousenyc',book:'https://www.kirei-house.com/book',price:'Premium',lang:'',pr:'Kokoist Soft Gel::From $85||Fill-In::From $75||Nail Art::$20+',ver:true,feat:true,notes:'Inside The Core Club, 711 Fifth Ave.'},
  {name:'Yukie Natori NY',cat:'nails',area:'Midtown',tags:['Japanese gel','Kokoist','ParaGel','Elegant','NYFW'],ig:'yukiebeautyspa',book:'https://yukienatori-newyork.com/#contact-form',price:'From $130',lang:'Japanese-speaking',pr:'Japanese Gel Manicure::From $130||Extensions::$130-$210',ver:true,feat:false,notes:'Uses Kokoist and ParaGel. NYFW backstage experience.'},
  {name:'AKIKO Nails',cat:'nails',area:'Lower East Side',tags:['Japanese gel','Bold design','Trendy','Nail art','Custom design'],ig:'akikonails_nyc',book:'https://www.akikonailsnyc.com/how-to-book',price:'Mid-range',lang:'',pr:'Gel Manicure::From $60||Custom Nail Art::Inquire via website',ver:true,feat:true,notes:'135 Eldridge St. Japanese nail art technique.'},
  {name:'Peach Bling',cat:'nails',area:'Tribeca',tags:['Japanese gel','HEMA-free','Cat-eye','Elegant','Structured gel'],ig:'peach.bling.nyc',book:'https://book.squareup.com/appointments/1jqqrzh5yumja7/location/L52T5RGZ9D6T7/services',price:'From $38',lang:'',pr:'Clean Manicure::$38||Structured Gel::Price varies',ver:true,feat:true,notes:'Tribeca and LIC. Structured gel specialist. HEMA-free.'},
  {name:'M&M Studio NYC',cat:'nails',area:'NoMad',tags:['Japanese gel','Simple','Natural','Great value','Japanese speaking'],ig:'mmstudionyc',book:'https://www.mmstudionyc.com',price:'From $60',lang:'Japanese-speaking',pr:'Gel Manicure::From $60||Gel Pedicure::$70',ver:true,feat:false,notes:'45 W 29th St. Affordable Japanese gel in Manhattan.'},
  {name:'Art Up Nail Studio NYC',cat:'nails',area:'Murray Hill',tags:['Japanese gel','Vetro','Kokoist','Nail art','Japanese-trained'],ig:'artupnailnyc',book:'https://www.vagaro.com/artupnailstudionyc1',price:'Mid-range',lang:'',pr:'Japanese Gel Manicure::Check Vagaro||3D Nail Art::Check Vagaro',ver:true,feat:false,notes:'222 E 34th St. NYFW 2018-2019 backstage.'},
  {name:'Upper West Spa',cat:'nails',area:'Upper West Side',tags:['Japanese gel','Kokoist','Semi-hard gel','Natural','Healthy nails'],ig:'upperwestspa',book:'https://upperwestspa.com',price:'Check website',lang:'',pr:'Japanese Semi-Hard Gel::Check website',ver:true,feat:false,notes:'Uses Kokoist semi-hard gel.'},
  {name:'Shizuka New York Day Spa',cat:'nails',area:'Midtown',tags:['Japanese gel','Presto LED','Day spa','Luxury','Japanese speaking'],ig:'shizukanewyork',book:'https://shizukany.com/services/nails/',price:'Check website',lang:'Japanese-speaking',pr:'Presto LED Gel Manicure::Check website',ver:true,feat:false,notes:"NYC exclusive carrier of Presto LED Gel. Near Rockefeller Center."},
  {name:'Artonus Nails Room',cat:'nails',area:'K-Town / Midtown',tags:['Japanese-inspired','Korean-inspired','Structured gel','Non-toxic'],ig:'artonusnailsroom',book:'https://www.artonusnailsroom.com',price:'Mid-range',lang:'',pr:'Structured Gel::Check website||Nail Art::Check website',ver:true,feat:false,notes:'38 W 32nd St Suite 1011. K-Town studio.'},
  {name:'We Nail Brooklyn',cat:'nails',area:'Brooklyn',tags:['Japanese gel','Kokoist','Natural','Brooklyn','Great value'],ig:'wenailbrooklyn',book:'https://wenail.setmore.com/',price:'From $55',lang:'',pr:'Japanese Kokoist Gel::Check website',ver:true,feat:false,notes:'Brooklyn. Uses Japanese Kokoist gel.'},
  {name:'1995 Nailz',cat:'nails',area:'Flatiron',tags:['Japanese gel','Kokoist certified','Private studio','Gel-X'],ig:'1995nailz',book:'https://www.instagram.com/1995nailz',price:'Check Instagram',lang:'',pr:'Kokoist Gel::Check Instagram||Gel-X::Check Instagram',ver:true,feat:false,notes:'Flatiron District. Kokoist Level 2 certified.'},
  {name:'Mari Nails Branche',cat:'nails',area:'Manhattan',tags:['Japanese gel','ParaGel','Fill-in specialist','Japanese speaking'],ig:'marinails___branche',book:'https://www.instagram.com/marinails___branche/',price:'Check Instagram',lang:'Japanese-speaking',pr:'ParaGel Manicure::Check Instagram',ver:true,feat:false,notes:'Specializes in natural nail care using ParaGel.'},
  {name:'Viblissimo Beauty',cat:'nails',area:'East Village',tags:['Japanese-inspired','Nail art','East Village','Custom design'],ig:'viblissimobeauty',book:'https://www.viblissimobeauty.com',price:'Check website',lang:'',pr:'Japanese Gel::Check website||Custom Art::Check website',ver:true,feat:false,notes:'35 E 1st St. East Village.'},
  {name:'Toka Salon NYC',cat:'nails',area:'Midtown East',tags:['Japanese-inspired','Elegant','Hard gel','High-end','Madison Ave'],ig:'tokasalonnyc',book:'https://www.fresha.com',price:'From $130',lang:'',pr:'Hard Gel Manicure::From $130',ver:true,feat:false,notes:'601 Madison Ave. Consistently 5-star reviewed.'},
  {name:'Gee Glow Beauty',cat:'lashes',area:'Lower Manhattan',tags:['Korean lash lift','Natural','Happy hour','Brow lamination','2000+ clients'],ig:'geeglowbeauty',book:'https://geeglowbeauty.as.me/schedule/3a2b24ce',price:'From $112',lang:'',pr:'Korean Lash Lift & Tint::$140||Happy Hour Tue-Fri::$112||Top+Bottom Lift::$195||Lash+Brow Combo::$205||Bestie Deal::$120',ver:true,feat:true,notes:'230 Grand St Suite 402. 2000+ clients.'},
  {name:'BKO Studios',cat:'lashes',area:'Midtown',tags:['Korean lash lift','Wispies','Brow lamination','Midtown'],ig:'bkostudios',book:'https://bkostudios.square.site/',price:'From $150',lang:'',pr:'Korean Lash Lift::Check website||Wispy Lash::From $150||Brow Lamination::Check website',ver:true,feat:false,notes:'330 W 38th St Rm 1200. Korean lash lift educator.'},
  {name:'Beauty Artist Studio NYC',cat:'lashes',area:'Midtown East',tags:['Korean lash lift','Glue-free','Brow lamination','Top-rated'],ig:'beautyartistny',book:'https://www.vagaro.com/beautyartistny',price:'From $150',lang:'',pr:'Korean Glue-free Lash Lift::Check Vagaro||Ultimate Blowout::$225||Brow Lamination::Check Vagaro',ver:true,feat:false,notes:'12 E 44th St. Korean glue-free lash lift. Lasts 3+ months.'},
  {name:'Lome Beauty Studio',cat:'lashes',area:'Williamsburg',tags:['Korean lash lift','Williamsburg','Brooklyn','Natural'],ig:'lomebeautystudio',book:'https://www.lomebeautystudio.com/lash-brow-treatments',price:'Check website',lang:'',pr:'Korean Lash Lift::Check website||Brow Lift::Check website',ver:true,feat:false,notes:'Williamsburg, Brooklyn.'},
  {name:'Yoshi Eyelash',cat:'lashes',area:'Union Square',tags:['Japanese lash','Lash extension','Lash lift','Japanese speaking','Very clean'],ig:'yoshieyelash',book:'https://www.jewellhouse.nyc/booking-yoshieyelash',price:'From $126',lang:'Japanese-speaking',pr:'Flat Lash 100pc::$150||Flat Lash 120pc::$160||Volume Set::$200+||Keratin Lift (first)::$126||Keratin Lift (recurring)::$140',ver:true,feat:true,notes:'46 E 21st St 3F. State certified. All products from Japan.'},
  {name:'Lash Bar Foula',cat:'lashes',area:'Chelsea',tags:['Japanese lash','Vegan','Sensitive friendly','First visit discount','Cashmere'],ig:'lashbar_foula',book:'https://www.fresha.com/a/lash-bar-foula-new-york-120-west-25th-street-8p3fremk',price:'From $120',lang:'',pr:'Mink Single Set::$200 (new: $120)||Cashmere Set::$290 (new: $188)||Cashmere Volume::$465 (new: $372)||Keratin Lift::$80',ver:true,feat:true,notes:'120 W 25th St. Tokyo-based. Vegan glue. Fresha Best in Class 2025.'},
  {name:'MASTERPIECE (Lashes by Chito)',cat:'lashes',area:'Williamsburg',tags:['Japanese lash','Lash lift','Vegan','Sensitive friendly','Very clean'],ig:'masterpiece.bk',book:'https://www.lashesbychito.com/policies',price:'From $180',lang:'Japanese-speaking',pr:'Plump Lash Lift::$180||Plump Lift + Tint::$210||Natural Lash Set::From $190',ver:true,feat:true,notes:'Williamsburg and UES. Vegan cysteamine-based products.'},
  {name:'Lashnista',cat:'lashes',area:'NoMad',tags:['Japanese lash','Lash lift','Natural','Elegant','Very clean','Keratin'],ig:'lashnista.by.s',book:'https://www.vagaro.com/lashnista',price:'From $140',lang:'Japanese-speaking',pr:'Classic Set::$140||Studio Owner Set::$220||Keratin Lift (first)::$200||Keratin Lift (recurring)::$140',ver:true,feat:true,notes:'135 W 29th St #506. Japanese lash technique.'},
  {name:'Glam by Dang',cat:'lashes',area:'Chelsea',tags:['Korean-inspired','Lash lift','Lash extension','Brow lamination','Luxury'],ig:'glambydang',book:'https://www.fresha.com',price:'From $175',lang:'',pr:'Keratin Lash Lift::$175||Classic Full Set::$200||Hybrid Set::$250||Brow Lamination::$150',ver:true,feat:false,notes:'37 W 26th St #808. 5.0 stars on Fresha.'},
];
async function createEntry(type, fields) {
  const r = await request('POST',`/spaces/${SPACE_ID}/environments/master/entries`,{fields},{'X-Contentful-Content-Type':type});
  if(!r?.data?.sys) return null;
  await request('PUT',`/spaces/${SPACE_ID}/environments/master/entries/${r.data.sys.id}/published`,null,{'X-Contentful-Version':String(r.data.sys.version)});
  return r.data.sys.id;
}
async function main() {
  console.log('=== Importing data to Contentful ===\n');
  console.log('Areas...');
  for(const a of AREAS){ await createEntry('area',{name:{'en-US':a.name},slug:{'en-US':a.slug},bigArea:{'en-US':a.bigArea}}); console.log(`  + ${a.name}`); await sleep(250); }
  console.log('\nServices...');
  for(const s of SERVICES){ await createEntry('service',{name:{'en-US':s.name},slug:{'en-US':s.slug},shortDescription:{'en-US':s.short},tags:{'en-US':s.tags}}); console.log(`  + ${s.name}`); await sleep(250); }
  console.log('\nSalons...');
  for(const s of SALONS){ await createEntry('salon',{name:{'en-US':s.name},slug:{'en-US':slug(s.name)},category:{'en-US':s.cat},area:{'en-US':s.area},areaSlug:{'en-US':areaSlug(s.area)},tags:{'en-US':s.tags},instagramHandle:{'en-US':s.ig},bookingUrl:{'en-US':s.book},priceRange:{'en-US':s.price},language:{'en-US':s.lang||''},priceDetails:{'en-US':parsePrices(s.pr)},verified:{'en-US':s.ver},featured:{'en-US':s.feat},notes:{'en-US':s.notes||''}}); console.log(`  + ${s.name}`); await sleep(300); }
  console.log(`\n=== Done! Areas:${AREAS.length} Services:${SERVICES.length} Salons:${SALONS.length} ===`);
}
main().catch(console.error);
