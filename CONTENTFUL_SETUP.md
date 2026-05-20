# Contentful セットアップガイド

## 1. アカウント作成

1. https://www.contentful.com にアクセス
2. 「Start for free」でアカウント作成
3. 新しいSpaceを作成（名前: "Glowlist NYC"）

---

## 2. API Keysの取得

1. ContentfulダッシュボードにログインしたSpaceを開く
2. 上部メニュー「Settings」→「API keys」
3. 「Add API key」をクリック
4. 以下をコピーして `.env.local` に貼る：
   - **Space ID** → `CONTENTFUL_SPACE_ID`
   - **Content Delivery API - access token** → `CONTENTFUL_ACCESS_TOKEN`
   - **Content Preview API - access token** → `CONTENTFUL_PREVIEW_TOKEN`

---

## 3. コンテンツモデルの作成

「Content model」タブで以下を順番に作成してください。

---

### モデル 1: Salon（サロン）

Content type ID: `salon`

| フィールド名 | Field ID | 型 | 必須 | 説明 |
|---|---|---|---|---|
| Name | `name` | Short text | ✓ | サロン名 |
| Slug | `slug` | Short text | ✓ | URLスラッグ（例: mellow-bar）Unique validation推奨 |
| Category | `category` | Short text | ✓ | nails / lashes / both |
| Area | `area` | Short text | ✓ | 表示エリア名（例: SoHo / West Village） |
| Area Slug | `areaSlug` | Short text | ✓ | エリアスラッグ（例: soho）|
| Tags | `tags` | Short text, list | ✓ | タグ一覧（例: Japanese gel, Kokoist） |
| Instagram Handle | `instagramHandle` | Short text | ✓ | @なしのIG handle（例: mellowbarnyc） |
| Booking URL | `bookingUrl` | Short text | ✓ | 予約URL |
| Price Range | `priceRange` | Short text | | 例: From $70 |
| Language | `language` | Short text | | 例: Japanese-speaking |
| Price Details | `priceDetails` | JSON object | | 料金表（下記フォーマット参照）|
| Verified | `verified` | Boolean | ✓ | 確認済みか |
| Notes | `notes` | Short text | | メモ・特記事項 |
| Hero Image | `heroImage` | Media | | サロントップ画像 |
| Photos | `photos` | Media, many | | サロン写真（複数）|
| SEO Title | `seoTitle` | Short text | | SEOタイトル（空白でも可）|
| SEO Description | `seoDescription` | Long text | | SEO説明文（空白でも可）|
| Featured | `featured` | Boolean | ✓ | Community Picksに表示するか |

**Price Details のJSON フォーマット例:**
```json
[
  {
    "category": "Manicure",
    "items": [
      { "service": "Japanese Gel Manicure", "price": "From $70" },
      { "service": "Dazzle Dry Polish", "price": "$32" }
    ]
  },
  {
    "category": "Pedicure",
    "items": [
      { "service": "Japanese Gel Pedicure", "price": "$93" }
    ]
  }
]
```

---

### モデル 2: Area（エリア）

Content type ID: `area`

| フィールド名 | Field ID | 型 | 必須 |
|---|---|---|---|
| Name | `name` | Short text | ✓ |
| Slug | `slug` | Short text | ✓ |
| Big Area | `bigArea` | Short text | ✓ | manhattan / brooklyn / queens |
| Description | `description` | Rich text | |
| Hero Image | `heroImage` | Media | |
| SEO Title | `seoTitle` | Short text | |
| SEO Description | `seoDescription` | Long text | |

---

### モデル 3: Service（サービス）

Content type ID: `service`

| フィールド名 | Field ID | 型 | 必須 |
|---|---|---|---|
| Name | `name` | Short text | ✓ |
| Slug | `slug` | Short text | ✓ |
| Short Description | `shortDescription` | Short text | ✓ |
| Description | `description` | Rich text | |
| Hero Image | `heroImage` | Media | |
| Tags | `tags` | Short text, list | ✓ | 対応するサロンタグ |
| SEO Title | `seoTitle` | Short text | |
| SEO Description | `seoDescription` | Long text | |

---

### モデル 4: Blog Post（ブログ）

Content type ID: `blogPost`

| フィールド名 | Field ID | 型 | 必須 |
|---|---|---|---|
| Title | `title` | Short text | ✓ |
| Slug | `slug` | Short text | ✓ |
| Excerpt | `excerpt` | Long text | ✓ |
| Body | `body` | Rich text | ✓ |
| Cover Image | `coverImage` | Media | |
| Published At | `publishedAt` | Date & time | ✓ |
| Tags | `tags` | Short text, list | |
| Related Salons | `relatedSalons` | References, many | | Salon参照 |
| SEO Title | `seoTitle` | Short text | |
| SEO Description | `seoDescription` | Long text | |

---

## 4. 最初のサロンを追加する

1. 「Content」タブ → 「Add entry」→「Salon」を選択
2. 各フィールドを入力して「Publish」

**Slugのルール（重要）:**
- 小文字・ハイフンのみ
- 例: `mellow-bar`, `tomoko-nails-nyc`, `yoshi-eyelash`

---

## 5. 初期エリアを追加する（Area entries）

以下を追加してください：

| Name | Slug | Big Area |
|---|---|---|
| SoHo / West Village | soho | manhattan |
| Lower East Side | lower-east-side | manhattan |
| Tribeca | tribeca | manhattan |
| NoMad | nomad | manhattan |
| Chelsea / Flatiron | chelsea | manhattan |
| Union Square | union-square | manhattan |
| Midtown | midtown | manhattan |
| K-Town / Midtown | k-town | manhattan |
| Midtown East / Murray Hill | midtown-east | manhattan |
| Upper East Side | upper-east-side | manhattan |
| Upper West Side | upper-west-side | manhattan |
| Lower Manhattan | lower-manhattan | manhattan |
| Williamsburg | williamsburg | brooklyn |
| Brooklyn | brooklyn | brooklyn |
| Long Island City | long-island-city | queens |

---

## 6. 最初のServiceを追加する

| Name | Slug | Tags |
|---|---|---|
| Japanese Gel Nails | japanese-gel-nails | Japanese gel |
| Korean Lash Lift | korean-lash-lift | Korean lash lift |
| Lash Extensions | lash-extensions | Lash extensions |
| Brow Lamination | brow-lamination | Brow lamination |
| Head Spa | head-spa | Head spa |

---

## 7. VercelへのEnvironment Variables設定

Vercelダッシュボード → プロジェクト → Settings → Environment Variables で以下を追加：

```
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_ACCESS_TOKEN=your_delivery_token
CONTENTFUL_PREVIEW_TOKEN=your_preview_token
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SITE_URL=https://glowlistnyc.com
```

---

## 8. 日常の運用フロー

### サロンを追加したい時
1. Contentful → Content → Add entry → Salon
2. 必要項目を入力してPublish
3. Vercelが自動でリビルド → 数分でサイトに反映

### ブログを書きたい時
1. Contentful → Content → Add entry → Blog Post
2. Rich textエディタで記事を書いてPublish
3. 自動反映

### 写真を更新したい時
1. 該当サロンのentryを開く
2. Photos / Hero Imageを差し替えてPublish

**エンジニア不要で全部できます。**
