import fs from 'node:fs';
import path from 'node:path';
import { createClient as createContentfulClient } from 'contentful';

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;

  const contents = fs.readFileSync(filePath, 'utf8');
  for (const rawLine of contents.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    const separatorIndex = line.indexOf('=');
    if (separatorIndex <= 0) continue;

    const key = line.slice(0, separatorIndex).trim();
    let value = line.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!(key in process.env)) process.env[key] = value;
  }
}

loadEnvFile(path.resolve(process.cwd(), '.env.local'));

function requireEnv(...names) {
  for (const name of names) {
    const value = process.env[name]?.trim();
    if (value) return value;
  }

  throw new Error(`Missing environment variable: ${names.join(' or ')}`);
}

const contentful = createContentfulClient({
  space: requireEnv('CONTENTFUL_SPACE_ID'),
  accessToken: requireEnv('CONTENTFUL_ACCESS_TOKEN'),
  environment: process.env.CONTENTFUL_ENVIRONMENT?.trim() || 'master',
});

const supabaseUrl = requireEnv('SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_URL')
  .replace(/\/$/, '');
const supabaseSecretKey = requireEnv('SUPABASE_SECRET_KEY');

async function getAllSalonEntries() {
  const entries = [];
  const limit = 1000;
  let skip = 0;

  while (true) {
    const response = await contentful.getEntries({
      content_type: 'salon',
      limit,
      skip,
    });

    entries.push(...response.items);
    skip += response.items.length;

    if (response.items.length === 0 || skip >= response.total) break;
  }

  return entries;
}

function readText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

async function upsertBatch(rows) {
  const endpoint = new URL(`${supabaseUrl}/rest/v1/salons`);
  endpoint.searchParams.set('on_conflict', 'id');

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      apikey: supabaseSecretKey,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=representation',
    },
    body: JSON.stringify(rows),
  });

  if (!response.ok) {
    throw new Error(
      `Supabase salon upsert failed (${response.status}): ${await response.text()}`,
    );
  }

  return response.json();
}

async function syncSalons() {
  console.log('Loading published salons from Contentful...');
  const entries = await getAllSalonEntries();
  const seenSlugs = new Set();
  const now = new Date().toISOString();

  const rows = entries.map((entry) => {
    const slug = readText(entry.fields.slug);
    const name = readText(entry.fields.name);

    if (!slug) throw new Error(`Salon ${entry.sys.id} has no slug.`);
    if (!name) throw new Error(`Salon ${entry.sys.id} has no name.`);
    if (seenSlugs.has(slug)) throw new Error(`Duplicate salon slug: ${slug}`);

    seenSlugs.add(slug);

    return {
      id: slug,
      name,
      contentful_entry_id: entry.sys.id,
      is_active: true,
      updated_at: now,
    };
  });

  if (rows.length === 0) {
    console.log('No published salons found. Nothing was changed.');
    return;
  }

  const batchSize = 200;
  let synced = 0;

  for (let index = 0; index < rows.length; index += batchSize) {
    const result = await upsertBatch(rows.slice(index, index + batchSize));
    synced += result.length;
  }

  console.log(`Successfully synced ${synced} salons.`);
  console.log('Contentful slug is used as public.salons.id.');
  console.log('Missing/unpublished Contentful salons were not deleted or deactivated.');
}

syncSalons().catch((error) => {
  console.error('Salon sync failed:');
  console.error(error);
  process.exitCode = 1;
});
