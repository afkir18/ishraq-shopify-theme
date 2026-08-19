# Ishraq Shopify Theme

Arabic RTL Shopify theme for **إشراق (Ishraq)** — marine collagen & magnesium glycinate supplements with COD checkout for Morocco.

Built from Shopify Skeleton, styled to match the Ishraq Next.js storefront (`ishraq.ma`).

## What's included

- RTL layout with Cairo font and Ishraq brand colors
- Home page sections: hero, trust pillars, featured products, trust story, benefits, how-it-works, CTA
- Product page with variant offer selector (1 / 2 / 3 packs)
- Header, footer, logo, and home images from the Ishraq brand kit

## Connect GitHub to Shopify

### 1. Install the Shopify GitHub app

1. Open [github.com/apps/shopify](https://github.com/apps/shopify)
2. Click **Install** and authorize access to the `afkir18/ishraq-shopify-theme` repo

### 2. Connect the theme in Shopify Admin

1. **Shopify Admin → Online Store → Themes**
2. Click **Add theme → Connect from GitHub**
3. Select:
   - Organization: `afkir18`
   - Repository: `ishraq-shopify-theme`
   - Branch: `main`
4. Click **Connect theme**

Shopify will sync every push to `main` into a development theme. Publish when ready.

### 3. Local development (optional)

```bash
cd ishraq-shopify-theme
npx @shopify/cli@3.84.1 theme dev --store YOUR-STORE.myshopify.com
```

Use Node 20.17+ or 22+ if the latest CLI fails on older Node versions.

## Store setup checklist

### Products

Create two products with **3 variants each** (pack offers):

| Product | Variants | Prices (MAD) |
|---------|----------|--------------|
| كولاجين بحري محلّل | علبة واحدة / علبتان / 3 علب | 199 / 279 / 349 |
| ماغنيسيوم غليسينات | علبة واحدة / علبتان / 3 علب | 199 / 279 / 349 |

Upload product images from your Ishraq catalog.

### Navigation

**Online Store → Navigation → Main menu**

- الرئيسية → `/`
- منتجاتنا → `/collections/all`
- تواصل معنا → `/pages/contact`

Assign **Main menu** in **Theme settings → Header**.

### Pages

Create pages with handles: `contact`, `faq`, `shipping`.

### Payments — Cash on Delivery

**Settings → Payments → Manual payment methods**

Enable **Cash on Delivery (COD)** for Morocco.

### Shipping

Configure Morocco shipping zones and rates under **Settings → Shipping and delivery**.

### Domain

**Settings → Domains** — connect `ishraq.ma` when ready to go live.

### Analytics

Add TikTok / Meta pixels under **Settings → Customer events**, or paste scripts in **Online Store → Themes → Edit code → theme.liquid** before `</head>`.

## COD & phone confirmation workflow

Shopify checkout collects name, phone, and address natively. For phone confirmation before shipping:

1. Use **Shopify Flow** or an order notification app to flag new orders
2. Or use a Morocco COD app from the Shopify App Store
3. Your previous FastAPI admin (`admin.ishraq.ma`) won't sync automatically — plan order ops in Shopify Admin or via an integration

## Repo structure

```
assets/          Brand CSS, logo, home images
layout/          theme.liquid (RTL)
sections/        Ishraq home + header/footer + product
templates/       index.json home page layout
config/          Theme settings
```

## License

Private theme for Ishraq. Skeleton base theme © Shopify.
