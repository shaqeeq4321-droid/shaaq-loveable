# Shaaq Trading Limited — website

Custom garment specification site (shirts, t-shirts, trousers, tuxedos) plus an
Automotive tab for car listings. Built with TanStack Start, React, Tailwind and
Supabase.

## Run locally

    npm install
    npm run dev

Copy `.env.example` to `.env` and fill in the Supabase values first.

## Deploy on Vercel

- Install command: `npm install`
- Build command: `NITRO_PRESET=vercel npm run build` (already set in `vercel.json`)
- Add the six variables from `.env.example` under Settings -> Environment Variables.
