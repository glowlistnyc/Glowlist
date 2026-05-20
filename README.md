# Glowlist NYC

A curated guide to Asian-inspired nails, lashes, and beauty spots in New York.

## Tech Stack

- **Next.js 14** (App Router) — フロントエンド
- **Contentful** — コンテンツ管理（サロン・ブログ・エリア・サービス）
- **Vercel** — ホスティング・自動デプロイ
- **TypeScript** — 型安全
- **CSS Modules** — スタイリング

## Site Structure

```
/                          Top page (LP)
/salon/[slug]              Individual salon pages
/area/                     Area index
/area/[slug]               Area pages (e.g. /area/williamsburg)
/service/                  Service index
/service/[slug]            Service pages (e.g. /service/japanese-gel-nails)
/blog/                     Blog index
/blog/[slug]               Blog post pages
/sitemap.xml               Auto-generated sitemap
/robots.txt                Auto-generated robots.txt
```

## Local Development

```bash
# 1. Clone
git clone https://github.com/YOUR_USERNAME/glowlist-nyc.git
cd glowlist-nyc

# 2. Install
npm install

# 3. Set up environment variables
cp .env.local.example .env.local
# .env.local を編集してContentfulのキーを入力

# 4. Run
npm run dev
# http://localhost:3000 で確認
```

## Deployment

### GitHub → Vercel (推奨)

1. GitHubにpush
2. vercel.com でプロジェクトをインポート
3. Environment variablesを設定
4. Deploy

### Environment Variables (Vercelに設定)

| Key | Where to get |
|---|---|
| `CONTENTFUL_SPACE_ID` | Contentful > Settings > API keys |
| `CONTENTFUL_ACCESS_TOKEN` | Contentful > Settings > API keys |
| `CONTENTFUL_PREVIEW_TOKEN` | Contentful > Settings > API keys |
| `NEXT_PUBLIC_GA_ID` | Google Analytics > Admin > Data streams |
| `NEXT_PUBLIC_SITE_URL` | `https://glowlistnyc.com` |

## Content Management

→ **CONTENTFUL_SETUP.md** を参照

## Adding Salons / Blog Posts

すべてContentfulのGUI上から操作可能。エンジニア不要。

1. contentful.com にログイン
2. Content → Add entry
3. Publish → Vercelが自動リビルド（約1分）

## SEO Features

- 各ページ個別のmeta title / description
- Open Graph / Twitter Card
- Schema.org 構造化データ（LocalBusiness, Article, ItemList）
- 自動生成サイトマップ (`/sitemap.xml`)
- robots.txt
- Next.js Image Optimization（Core Web Vitals対応）
