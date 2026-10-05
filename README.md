# Wanna Date App

This project creates a romantic date-planner page with a shareable link and live response tracking.

## What it includes
- A romantic multi-step date planner
- A unique shareable link per invite (`?linkId=...`)
- A live Supabase-backed response store when credentials are added
- A local backup using `localStorage` if Supabase is not configured yet
- An admin page to view all saved replies

## Files
- `index.html` — the date planner page
- `app.js` — save logic and share-link logic
- `admin.html` — view saved response data
- `config.js` — Supabase credentials

## Setup
1. Create a free Supabase project at https://supabase.com
2. In the Supabase SQL editor, create this table:

```sql
create table public.responses (
  id uuid default gen_random_uuid() primary key,
  link_id text not null unique,
  person_name text,
  date text,
  activity text,
  ride text,
  breakfast text,
  lunch text,
  snacks text,
  reply_summary text,
  created_at timestamptz default now()
);

alter table public.responses enable row level security;

create policy "Allow public insert" on public.responses
for insert with check (true);

create policy "Allow public select" on public.responses
for select using (true);
```

3. Open `config.js` and replace the placeholders with your real values.
4. Upload the project to GitHub Pages, Netlify, Vercel, or any static host.
5. Share links in the format:
   `https://wannadate.site/?linkId=your-name`
6. View replies here:
   `https://your-site-url/admin.html?linkId=your-name`

## Note
The app is already set up to work with a custom domain like `wannadate.site` once your hosting is pointing there. The actual domain must be configured by your DNS/hosting provider.

## Important
If no real Supabase URL and anon key are present, the app falls back to `localStorage` only.
