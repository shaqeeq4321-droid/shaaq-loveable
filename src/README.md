# Shaaq Trading Limited — website

Custom garment specification site (shirts, t-shirts, trousers, tuxedos) plus an
Automotive tab for car listings. Built with TanStack Start, React, Tailwind and
Supabase.

## Database

Create a Supabase project, open SQL Editor and run `supabase/setup.sql` once.
It creates the tables, security rules and storage buckets.

## Run locally

    npm install
    npm run dev

Copy `.env.example` to `.env` and fill in the Supabase values first.

## Deploy on Vercel

- Install command: `npm install`
- Build command: `NITRO_PRESET=vercel npm run build` (already set in `vercel.json`)
- Add the seven variables from `.env.example` under Settings -> Environment Variables.

## Car admin

Visit `/auto/manage` and sign in. The first account to sign in becomes the owner.
