# Basel Music Scene

A mobile-first web app that aggregates Basel's live and electronic music
events into one calendar, so you don't have to piece it together from
venue websites, Instagram, and word of mouth.

## Features

- **Event list** — filterable by date range, genre tag, venue, and
  neighborhood, with free-text search. Grouped by day.
- **Event detail page** — full details, a map pin, and an "add to
  calendar" `.ics` download.
- **Submission form** — anyone (promoters, venues, punters) can submit an
  event. Submissions land as `pending` until reviewed.
- **Moderation view** (`/moderate`) — a password-gated page to approve,
  edit, or reject pending submissions.
- **Map view** (`/map`) — every venue plotted with Leaflet + OpenStreetMap
  (no API key needed), each with its upcoming events.
- **iCal export** — a per-event `.ics` file, and a subscribe-to-all feed
  at `/api/feed.ics` for calendar apps.

## Tech stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript, [Tailwind CSS](https://tailwindcss.com)
- [Prisma](https://www.prisma.io) + Postgres (via the `pg` driver adapter — works with any
  Postgres host: [Neon](https://neon.tech), [Supabase](https://supabase.com), etc.)
- [Leaflet](https://leafletjs.com) / [react-leaflet](https://react-leaflet.js.org) for maps
- [ics](https://www.npmjs.com/package/ics) for calendar file generation
- [zod](https://zod.dev) for form validation

## Getting started

You'll need a Postgres database — the free tier of [Neon](https://neon.tech) or
[Supabase](https://supabase.com) works fine, or Vercel's own Storage → Marketplace →
Neon integration if you're deploying there anyway.

```bash
npm install
cp .env.example .env       # then set DATABASE_URL to your Postgres connection string,
                            # and edit MODERATION_PASSWORD / MODERATION_SECRET
npx prisma migrate deploy  # applies the schema
npx prisma db seed         # seeds known Basel venues + a few sample events
npm run dev
```

Visit `http://localhost:3000`. To review submissions, go to `/moderate`
and sign in with the password you set in `.env`. That page also has a
"Seed sample venues & events" button, in case you ever need to (re)seed
a database you can't reach a terminal for (e.g. seeding straight from a
Vercel deployment).

## Data model

- **Venue** — name, address, neighborhood, website, typical genres, lat/lng.
- **Event** — title, description, date, start/end time, venue, genre
  tags, price, ticket/info URL, image URL, promoter (optional),
  moderation status (`pending` / `approved` / `rejected`), and the
  submitter's name + email.
- **Tag** — open-ended genre/scene labels (techno, house, punk, indie,
  jazz, experimental, DIY, …) rather than a fixed list — new tags are
  created on the fly when someone submits or edits an event.

## Seed data

The seed script (`prisma/seed.ts`) adds six Basel venues that were
verified active as of writing: Kaserne Basel, Nordstern, Kaschemme,
Hirscheneck, Volkshaus Basel, and Das Viertel (the club formerly known
as Hinterhof — it was rebranded in 2017, so only the current name is
seeded). Each comes with a handful of sample events dated a few days out
so the calendar isn't empty on first run.

There's no scraper against Instagram, Facebook, or Resident Advisor —
that's fragile and ToS-risky. The submission form is the intended
ongoing input mechanism, with an admin adding events manually through
`/moderate` as a backstop.

## Environment variables

See `.env.example`. `MODERATION_PASSWORD` gates `/moderate`; without it
set, moderation is disabled entirely (the login form will say so).
`MODERATION_SECRET` signs the moderator session cookie — set it to a
long random string in production.

## Deploying

Designed to deploy as a single app to [Vercel](https://vercel.com) with no extra
infrastructure beyond a Postgres database (Vercel's Storage tab can provision one
via its Neon or Supabase marketplace integration in a couple of clicks). Set
`DATABASE_URL`, `MODERATION_PASSWORD`, and `MODERATION_SECRET` as environment
variables on the project, then deploy — the `build` script runs
`prisma migrate deploy` before `next build`, so the schema is applied
automatically on every deploy. Seed the venues/events once by logging into
`/moderate` and clicking "Seed sample venues & events".

## Out of scope for v1 (later)

User accounts/logins for regular visitors, ticketing/payments, a native
mobile app, and multi-city expansion are intentionally left out. A
nice-to-have for a future version: let venues supply an iCal feed URL
that gets polled periodically, for the ones that already publish their
own calendar.
