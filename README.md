# Global Product Hub — Version 1.0 starter

Premium Editorial Shopping · Global audience · Affiliate first · Smart-link-ready

## What is included
- Next.js App Router + TypeScript + Tailwind CSS foundation
- Editorial-style responsive homepage and sample product catalogue
- Dynamic product detail pages
- Server-side `/go/[slug]` affiliate redirect endpoint with HTTPS validation
- Admin dashboard visual foundation (demo-only; not authenticated)
- Affiliate disclosure, privacy and terms placeholder pages
- Product data model designed for later Firebase integration
- `.env.example` and Vercel-ready project structure

## Important implementation status
This is an implementation starter, **not yet a production-ready live commerce system**.
- Sample product images are abstract CSS artwork, not actual product photography.
- Sample prices and compare-at prices are illustrative. Do not publish them as verified offers.
- Affiliate URLs are intentionally `null`, so BUY NOW/retailer routing returns HTTP 503 until a verified affiliate URL is configured.
- Admin route is not protected. Do not expose it as an operational admin console.
- Firebase, persistent click tracking, conversion imports, consent management, ad network tags, and Smart Link providers are not connected.
- Privacy and Terms pages are placeholders and need jurisdiction-appropriate review.
- No ad is loaded and no user is asked to click ads.

## Run locally
Requirements: Node.js 20.9+ and npm.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

Production build:
```bash
npm run build
npm run start
```

## Deploy to Vercel
1. Create a GitHub repository and push this project.
2. In Vercel, import the repository.
3. Framework preset: Next.js. Build command: `npm run build`.
4. Deploy using the free `*.vercel.app` domain initially.
5. Add environment variables only after Firebase is configured.

## Final master specification

### Product principles
1. Affiliate-first monetization.
2. Editorial product discovery; no deceptive urgency or fabricated discounts.
3. Affiliate links and paid placements must be clearly disclosed.
4. Smart Link remains disabled until an approved provider, permitted traffic source and destination rules are verified.
5. Advertisements remain visually separate from product purchase actions.
6. No forced ad clicks, accidental-click layouts, cloaking, or undisclosed redirects.

### Application modules
- Public: Home, categories, search, product detail, offers, disclosure, privacy, terms.
- Product: canonical product record, variants, merchant, price currency, availability, source timestamp, image rights, status.
- Affiliate: per-product/per-country link records, tracking IDs, redirect validation, click events, network conversion imports.
- Ads: provider adapter, explicit ad slots, consent-aware rendering, placement status.
- Smart Link: provider adapter interface, allowlist, country/traffic eligibility, disabled feature flag by default.
- Admin: authentication, role-based access, product CRUD, category CRUD, link management, ad slots, analytics, settings.
- Analytics: clicks, outbound redirects, imported conversions, revenue reports; distinguish clicks from confirmed sales.

### Recommended production data collections
`products`, `categories`, `merchants`, `affiliate_links`, `click_events`, `conversions`, `ad_slots`, `ad_providers`, `smartlink_providers`, `campaigns`, `admin_users`, `site_settings`, `consent_records`.

### Security requirements before public launch
- Firebase Auth with verified admin allowlist and server-side role checks.
- Firestore Security Rules deny-by-default.
- Server-only Firebase Admin credentials.
- Redirect destination validation against approved HTTPS merchant domains.
- Rate limiting and bot/spam controls for redirect endpoints.
- Input validation, audit logs, backup and restore process.
- Consent and privacy controls before non-essential analytics/ad scripts.
- No secrets in `NEXT_PUBLIC_*` variables.
- Security, accessibility, performance and mobile QA.

### Launch acceptance criteria
- All public routes render and pass mobile/desktop checks.
- Every product has verified current price, currency, availability, merchant and source.
- Every affiliate destination is tested and approved by its network.
- Tracking records outbound clicks without claiming those clicks are purchases.
- Admin routes are inaccessible to non-admin users.
- Legal disclosures and consent behavior are reviewed and published.
- No Smart Link redirect is enabled without provider approval and policy review.
- Production build and smoke tests pass.

## Next implementation phase
Connect Firebase Auth/Firestore, protect admin routes, move product records to Firestore, persist click events, and import conversions from the chosen affiliate network.
