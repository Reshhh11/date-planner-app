# Adithya & Reshma - Let's Plan Our Date

A romantic date-planning website for Adithya and Reshma with a shareable link and reply tracking.

## What it does
- Multi-step playful date planning flow
- Shareable link with `?linkId=...`
- Response saving in localStorage by default
- Optional live saving via Supabase when credentials are added
- Admin page to see the saved choices

## Setup
1. Create a free Supabase project at https://supabase.com
2. Run this SQL in the Supabase SQL editor:

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

3. Replace the placeholders in `config.js` with your actual Supabase URL and anon key.
4. Deploy the site on GitHub Pages, Netlify, or Vercel.
5. Share a link like:
   `https://your-site-url/?linkId=reshma`
6. Open the admin page here:
   `https://your-site-url/admin.html?linkId=reshma`

## Notes
- If you do not add Supabase credentials, the app will keep using localStorage for saving responses.
- The site is already styled and personalized to Adithya & Reshma.
