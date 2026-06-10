# Locate

Consent-based location sharing built with Next.js and PostgreSQL.

## Setup

1. Copy `.env.example` to `.env` and set `DATABASE_URL` and `JWT_SECRET`.
2. Install dependencies: `npm install`
3. Push schema: `npm run db:push`
4. Run dev server: `npm run dev`

Optional: set `NEXT_PUBLIC_APP_URL` and `NEXT_PUBLIC_CONTACT_EMAIL` for production.

## AdSense readiness

Before applying at [google.com/adsense](https://www.google.com/adsense):

1. Deploy with a real domain and HTTPS
2. Set `NEXT_PUBLIC_CONTACT_EMAIL` to your real support email
3. After approval, set `NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT` and `NEXT_PUBLIC_GOOGLE_ADSENSE_SLOT`
4. Update `public/ads.txt` with your publisher ID
5. Set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` from Google Search Console (optional)

Ads only load after cookie consent and never on consent/location screens (`/l/*`, `/results/dashboard`, `/create/success`).

## Flow

1. **Create** — Enter name, purpose, destination URL, accept terms, optionally share your location.
2. **Share** — Send the `/l/{slug}` link to recipients.
3. **Consent** — Recipients see disclosure, accept or decline, then browser GPS runs once.
4. **Results** — Enter your private access code to view the consent log.
