# Supabase Reviews — Local setup and operation

## 1. Required `.env.local` values

Keep the existing Contentful values and add:

```env
NEXT_PUBLIC_SUPABASE_URL=https://pkqjgspxgziytazrweel.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_key

SUPABASE_URL=https://pkqjgspxgziytazrweel.supabase.co
SUPABASE_SECRET_KEY=your_secret_key
```

Never commit `.env.local` or put the secret key in a `NEXT_PUBLIC_` variable.

## 2. Prepare the `salons` table for Contentful sync

Run once in Supabase SQL Editor:

```sql
alter table public.salons
  add column if not exists contentful_entry_id text,
  add column if not exists updated_at timestamptz not null default now();

create unique index if not exists salons_contentful_entry_id_unique
on public.salons (contentful_entry_id)
where contentful_entry_id is not null;
```

## 3. Sync all published Contentful salons

```bash
npm run sync:salons
```

Mapping:

- `salon.fields.slug` → `public.salons.id`
- `salon.fields.name` → `public.salons.name`
- `salon.sys.id` → `public.salons.contentful_entry_id`

The script upserts new/changed salons. It does not delete or deactivate missing salons.

## 4. Review flow

1. A visitor opens `Write a review` on a salon page.
2. The Tally URL receives `salon_id`, `salon_name`, and `source` as hidden fields.
3. The existing Edge Function saves the review as `pending`.
4. Review it in Supabase Table Editor.
5. Set `status` to `approved` and `published_at` to the current time.
6. Refresh the salon page. Only approved reviews are shown.

## 5. Instagram posts in Contentful

Content model → Salon → Add field:

- Type: Short text, list
- Field name: Instagram Post URLs
- Field ID: `instagramPostUrls`

Add up to 2–3 permitted public Instagram post URLs to each salon and Publish.
