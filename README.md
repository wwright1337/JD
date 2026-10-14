# Just Drink

A designated-driver app: a driver comes to you and drives your own car home.
This is a real, deployable starting point — free hosting, free backend, no
app store fees.

## 1. Run it locally

```
npm install
cp .env.example .env
```

Leave `.env` with placeholder values for now — the app runs and the UI
works without Supabase connected; you'll only need real values once you
want authorizations to actually save (step 3).

```
npm run dev
```

Open the printed localhost URL.

## 2. Put it on GitHub

```
git init
git add .
git commit -m "Just Drink starter"
```

Create a new empty repo on github.com, then follow the push instructions
it shows you.

## 3. Set up the backend (Supabase, free tier)

1. Create a project at supabase.com (free tier, no card required).
2. In the SQL Editor, paste and run everything in `supabase/schema.sql`.
   This creates the `trips`, `drivers`, and `vehicle_authorizations`
   tables with row-level security, so riders can only see their own data.
3. Go to Authentication > Providers and turn on **Anonymous sign-ins**.
   This lets someone use the app without creating an account first — you
   can add real email/phone login later without changing the schema.
4. Go to Project Settings > API and copy the **Project URL** and
   **anon public key** into your `.env` file.

## 4. Deploy the frontend (Vercel or Netlify, free tier)

1. Go to vercel.com (or netlify.com) and connect your GitHub repo.
2. It will auto-detect Vite. Add the same two environment variables from
   your `.env` file in the project's dashboard settings
   (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
3. Deploy. You'll get a live `https://your-app.vercel.app` URL — that's
   your app, live, with no server for you to run.

## 5. Install it like a native app

Because of `vite-plugin-pwa`, once deployed, visiting the URL on a phone
and choosing "Add to Home Screen" (iOS Safari) or the install prompt
(Android Chrome) installs it like a real app — no App Store or Play
Store submission needed.

You'll need to add your own `public/icon-192.png` and
`public/icon-512.png` (simple square logo images) for the install
prompt to look right — any square PNG works as a placeholder.

## What's real vs. still a placeholder

- **Real**: the consent flow writes actual rows to your Supabase
  database (`trips` + `vehicle_authorizations`), with the signature
  saved as a PNG data URL and row-level security so riders only see
  their own trips.
- **Placeholder**: driver matching is instant and fake ("Jordan T." is
  hardcoded) — there's no real pool of drivers yet. The `drivers` table
  in the schema is ready for that; it just isn't wired into the UI.
- **Not included**: payments, driver background checks, live GPS
  tracking, push notifications. Each is addable incrementally without
  restructuring what's here.

## Before this handles real people and real cars

Free hosting solves the software cost. It doesn't solve for insurance,
driver background checks, or local for-hire-driver licensing — those
are usually the actual legal requirement for a service like this to
operate, and they vary by state and city.
