-- ============================================================
--  ScholarSafe — Supabase Schema
--  Stack: Next.js (App Router) · Tailwind · Shadcn/UI · Supabase
--  Safety-First Student Housing Platform
-- ============================================================

-- ─────────────────────────────────────────
-- 0. EXTENSIONS
-- ─────────────────────────────────────────
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm";   -- fuzzy search on university names


-- ─────────────────────────────────────────
-- 1. ENUMS
-- ─────────────────────────────────────────
create type user_role        as enum ('student', 'landlord', 'admin');
create type listing_status   as enum ('active', 'pending', 'rented', 'archived');
create type review_category  as enum ('safety', 'landlord', 'noise', 'cleanliness', 'value');
create type match_status     as enum ('pending', 'accepted', 'declined');


-- ─────────────────────────────────────────
-- 2. PROFILES  (extends auth.users)
-- ─────────────────────────────────────────
-- Automatically created on signup via trigger (see section 7).
-- Every Supabase auth user gets exactly one profile row.
create table public.profiles (
  id                  uuid        primary key references auth.users(id) on delete cascade,

  -- Identity
  full_name           text        not null,
  avatar_url          text,
  role                user_role   not null default 'student',

  -- .edu enforcement (also enforced at the auth level via trigger)
  email               text        not null unique,

  -- Academic info
  university          text        not null,
  graduation_year     smallint    check (graduation_year between 2024 and 2035),
  major               text,

  -- Verified student flag (set to true once .edu email confirmed)
  is_verified         boolean     not null default false,

  -- Roommate / lifestyle matching
  -- Expected keys:
  --   sleep_schedule:   "early_bird" | "night_owl" | "flexible"
  --   cleanliness:      "very_clean" | "moderate" | "relaxed"
  --   noise_level:      "quiet" | "moderate" | "lively"
  --   guests:           "rarely" | "sometimes" | "often"
  --   smoking:          boolean
  --   pets:             boolean
  --   study_habits:     "library" | "home" | "mixed"
  --   budget_min:       number (USD/month per person)
  --   budget_max:       number
  --   move_in_date:     ISO date string
  lifestyle_preferences  jsonb    not null default '{}',

  -- Social / contact
  bio                 text,
  instagram_handle    text,
  phone_visible       boolean     not null default false,

  -- Timestamps
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- Index for university lookups + fuzzy search
create index idx_profiles_university on public.profiles using gin (university gin_trgm_ops);
create index idx_profiles_role       on public.profiles(role);
create index idx_profiles_verified   on public.profiles(is_verified);


-- ─────────────────────────────────────────
-- 3. LISTINGS
-- ─────────────────────────────────────────
create table public.listings (
  id                  uuid          primary key default uuid_generate_v4(),
  landlord_id         uuid          not null references public.profiles(id) on delete cascade,

  -- Basic info
  title               text          not null,
  description         text,
  status              listing_status not null default 'pending',

  -- Address (structured for map rendering)
  street_address      text          not null,
  city                text          not null,
  state               text          not null,
  zip_code            text          not null,
  lat                 numeric(9,6),
  lng                 numeric(9,6),

  -- Pricing
  price_per_person    numeric(8,2)  not null check (price_per_person > 0),
  utilities_included  boolean       not null default false,
  deposit_amount      numeric(8,2),

  -- Unit details
  bedrooms            smallint      not null check (bedrooms >= 0),
  bathrooms           numeric(3,1)  not null check (bathrooms > 0),
  total_occupants     smallint      not null default 1,
  available_spots     smallint      not null default 1,
  available_from      date          not null,
  lease_length_months smallint,     -- null = month-to-month

  -- Safety (1–100; computed & manually curated)
  -- Sourced from: public crime APIs + student reports + admin review
  safety_score        smallint      not null default 50
                                    check (safety_score between 1 and 100),
  safety_score_day    smallint      check (safety_score_day between 1 and 100),
  safety_score_night  smallint      check (safety_score_night between 1 and 100),
  safety_notes        text,         -- human-readable safety context

  -- Proximity
  distance_to_campus_mi  numeric(5,2),
  nearby_campus       text,         -- primary campus this listing serves

  -- Amenities (JSONB for flexibility)
  -- e.g. { "wifi": true, "parking": true, "laundry": "in-unit", "gym": false }
  amenities           jsonb         not null default '{}',

  -- Media
  image_urls          text[]        not null default '{}',

  -- Aggregated review stats (denormalized for perf)
  avg_rating          numeric(3,2)  default null,
  review_count        integer       not null default 0,

  -- Timestamps
  created_at          timestamptz   not null default now(),
  updated_at          timestamptz   not null default now()
);

-- Indexes for common query patterns
create index idx_listings_landlord    on public.listings(landlord_id);
create index idx_listings_status      on public.listings(status);
create index idx_listings_campus      on public.listings(nearby_campus);
create index idx_listings_safety      on public.listings(safety_score desc);
create index idx_listings_price       on public.listings(price_per_person);
create index idx_listings_location    on public.listings(lat, lng);
create index idx_listings_amenities   on public.listings using gin (amenities);


-- ─────────────────────────────────────────
-- 4. REVIEWS  (students only, one per listing)
-- ─────────────────────────────────────────
create table public.reviews (
  id              uuid          primary key default uuid_generate_v4(),
  listing_id      uuid          not null references public.listings(id) on delete cascade,
  author_id       uuid          not null references public.profiles(id) on delete cascade,

  -- One verified review per student per listing
  unique (listing_id, author_id),

  -- Ratings (1–5 each)
  rating_overall      smallint  not null check (rating_overall between 1 and 5),
  rating_safety       smallint  not null check (rating_safety between 1 and 5),
  rating_landlord     smallint  not null check (rating_landlord between 1 and 5),
  rating_noise        smallint  not null check (rating_noise between 1 and 5),
  rating_cleanliness  smallint  not null check (rating_cleanliness between 1 and 5),
  rating_value        smallint  not null check (rating_value between 1 and 5),

  -- Content
  title           text          not null,
  body            text          not null check (char_length(body) >= 50),

  -- Safety-specific fields (ScholarSafe differentiator)
  felt_safe_day   boolean,
  felt_safe_night boolean,
  safety_comment  text,

  -- Landlord responsiveness
  landlord_response_days  smallint, -- avg days to get a reply

  -- Helpfulness voting
  helpful_count   integer       not null default 0,

  -- Moderation
  is_flagged      boolean       not null default false,
  is_published    boolean       not null default true,

  -- Timestamps
  created_at      timestamptz   not null default now(),
  updated_at      timestamptz   not null default now()
);

create index idx_reviews_listing   on public.reviews(listing_id);
create index idx_reviews_author    on public.reviews(author_id);
create index idx_reviews_published on public.reviews(is_published);


-- ─────────────────────────────────────────
-- 5. ROOMMATE MATCHES
-- ─────────────────────────────────────────
create table public.roommate_matches (
  id              uuid          primary key default uuid_generate_v4(),
  requester_id    uuid          not null references public.profiles(id) on delete cascade,
  recipient_id    uuid          not null references public.profiles(id) on delete cascade,

  -- Prevent duplicate pairs
  unique (requester_id, recipient_id),
  check (requester_id <> recipient_id),

  status          match_status  not null default 'pending',

  -- Compatibility score (0–100), computed by app logic
  compatibility_score  smallint check (compatibility_score between 0 and 100),

  -- Optional target listing
  listing_id      uuid          references public.listings(id) on delete set null,

  message         text,         -- intro message from requester
  created_at      timestamptz   not null default now(),
  updated_at      timestamptz   not null default now()
);

create index idx_matches_requester on public.roommate_matches(requester_id);
create index idx_matches_recipient on public.roommate_matches(recipient_id);
create index idx_matches_status    on public.roommate_matches(status);


-- ─────────────────────────────────────────
-- 6. WAITLIST
-- ─────────────────────────────────────────
create table public.waitlist (
  id              uuid          primary key default uuid_generate_v4(),
  first_name      text          not null,
  last_name       text          not null,
  email           text          not null unique,
  university      text          not null,
  graduation_year smallint,
  role            user_role     not null default 'student',
  semester_needed text,         -- e.g. "Fall 2025"
  message         text,
  position        integer       generated always as identity,
  created_at      timestamptz   not null default now()
);

create index idx_waitlist_email on public.waitlist(email);


-- ─────────────────────────────────────────
-- 7. TRIGGERS & FUNCTIONS
-- ─────────────────────────────────────────

-- 7a. Auto-create profile on auth.users insert
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  -- Enforce .edu email at DB level (belt-and-suspenders with app validation)
  if new.email not like '%.edu' then
    raise exception 'ScholarSafe requires a .edu email address. Got: %', new.email;
  end if;

  insert into public.profiles (id, email, full_name, university, is_verified)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'university', ''),
    -- Mark verified once Supabase confirms the email
    (new.email_confirmed_at is not null)
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 7b. Keep is_verified in sync when email confirmed
create or replace function public.handle_email_confirmed()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  if new.email_confirmed_at is not null and old.email_confirmed_at is null then
    update public.profiles
    set is_verified = true, updated_at = now()
    where id = new.id;
  end if;
  return new;
end;
$$;

create trigger on_email_confirmed
  after update on auth.users
  for each row execute procedure public.handle_email_confirmed();


-- 7c. Auto-update updated_at timestamps
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

create trigger set_listings_updated_at
  before update on public.listings
  for each row execute procedure public.set_updated_at();

create trigger set_reviews_updated_at
  before update on public.reviews
  for each row execute procedure public.set_updated_at();

create trigger set_matches_updated_at
  before update on public.roommate_matches
  for each row execute procedure public.set_updated_at();


-- 7d. Recalculate listing avg_rating + review_count after every review change
create or replace function public.refresh_listing_stats()
returns trigger
language plpgsql security definer set search_path = public
as $$
declare
  target_listing_id uuid;
begin
  target_listing_id := coalesce(new.listing_id, old.listing_id);

  update public.listings
  set
    avg_rating   = (
      select round(avg(rating_overall)::numeric, 2)
      from public.reviews
      where listing_id = target_listing_id and is_published = true
    ),
    review_count = (
      select count(*)
      from public.reviews
      where listing_id = target_listing_id and is_published = true
    ),
    updated_at   = now()
  where id = target_listing_id;

  return coalesce(new, old);
end;
$$;

create trigger on_review_change
  after insert or update or delete on public.reviews
  for each row execute procedure public.refresh_listing_stats();


-- ─────────────────────────────────────────
-- 8. ROW LEVEL SECURITY (RLS)
-- ─────────────────────────────────────────

-- Enable RLS on all tables
alter table public.profiles         enable row level security;
alter table public.listings         enable row level security;
alter table public.reviews          enable row level security;
alter table public.roommate_matches enable row level security;
alter table public.waitlist         enable row level security;


-- ── Profiles ──
-- Anyone can read public profiles
create policy "profiles: public read"
  on public.profiles for select
  using (true);

-- Users can only edit their own profile
create policy "profiles: owner update"
  on public.profiles for update
  using (auth.uid() = id);


-- ── Listings ──
-- Public can browse active listings
create policy "listings: public read active"
  on public.listings for select
  using (status = 'active');

-- Landlords can insert their own listings
create policy "listings: landlord insert"
  on public.listings for insert
  with check (
    auth.uid() = landlord_id
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'landlord' and is_verified = true
    )
  );

-- Landlords can update/delete their own listings
create policy "listings: landlord manage"
  on public.listings for update
  using (auth.uid() = landlord_id);

create policy "listings: landlord delete"
  on public.listings for delete
  using (auth.uid() = landlord_id);


-- ── Reviews ──
-- Anyone can read published reviews
create policy "reviews: public read published"
  on public.reviews for select
  using (is_published = true);

-- Only verified students can create reviews
create policy "reviews: verified student insert"
  on public.reviews for insert
  with check (
    auth.uid() = author_id
    and exists (
      select 1 from public.profiles
      where id = auth.uid()
        and role = 'student'
        and is_verified = true
    )
  );

-- Authors can edit their own reviews
create policy "reviews: author update"
  on public.reviews for update
  using (auth.uid() = author_id);

create policy "reviews: author delete"
  on public.reviews for delete
  using (auth.uid() = author_id);


-- ── Roommate Matches ──
-- Users can only see matches they are part of
create policy "matches: participant read"
  on public.roommate_matches for select
  using (auth.uid() = requester_id or auth.uid() = recipient_id);

-- Verified students can initiate matches
create policy "matches: student insert"
  on public.roommate_matches for insert
  with check (
    auth.uid() = requester_id
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'student' and is_verified = true
    )
  );

-- Either participant can update status
create policy "matches: participant update"
  on public.roommate_matches for update
  using (auth.uid() = requester_id or auth.uid() = recipient_id);


-- ── Waitlist ──
-- Anyone can join (pre-auth surface)
create policy "waitlist: public insert"
  on public.waitlist for insert
  with check (true);

-- Admins only for reads (add admin role check as needed)
create policy "waitlist: admin read"
  on public.waitlist for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );


-- ─────────────────────────────────────────
-- 9. HELPFUL VIEWS
-- ─────────────────────────────────────────

-- Safe listing feed: active listings with landlord display name
create or replace view public.listing_feed as
select
  l.id,
  l.title,
  l.description,
  l.street_address,
  l.city,
  l.state,
  l.zip_code,
  l.lat,
  l.lng,
  l.price_per_person,
  l.utilities_included,
  l.bedrooms,
  l.bathrooms,
  l.available_spots,
  l.available_from,
  l.lease_length_months,
  l.safety_score,
  l.safety_score_day,
  l.safety_score_night,
  l.distance_to_campus_mi,
  l.nearby_campus,
  l.amenities,
  l.image_urls,
  l.avg_rating,
  l.review_count,
  l.created_at,
  p.full_name    as landlord_name,
  p.avatar_url   as landlord_avatar
from public.listings l
join public.profiles p on p.id = l.landlord_id
where l.status = 'active';


-- Roommate discovery feed: verified students with lifestyle data
create or replace view public.roommate_feed as
select
  p.id,
  p.full_name,
  p.avatar_url,
  p.university,
  p.graduation_year,
  p.major,
  p.bio,
  p.lifestyle_preferences
from public.profiles p
where p.role = 'student'
  and p.is_verified = true;


-- ─────────────────────────────────────────
-- 10. STORAGE BUCKETS (run in Supabase dashboard or via API)
-- ─────────────────────────────────────────
-- Uncomment and run these if using Supabase Storage:

-- insert into storage.buckets (id, name, public) values ('avatars',  'avatars',  true);
-- insert into storage.buckets (id, name, public) values ('listings', 'listings', true);

-- Storage RLS example for avatars:
-- create policy "avatars: owner upload"
--   on storage.objects for insert
--   with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

-- create policy "avatars: public read"
--   on storage.objects for select
--   using (bucket_id = 'avatars');


-- ─────────────────────────────────────────
-- END OF SCHEMA
-- ─────────────────────────────────────────
