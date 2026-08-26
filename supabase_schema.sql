-- RuangPilih Product Intelligence Database v3 foundation
-- Supabase/PostgreSQL-ready schema. Run only after reviewing RLS policies and auth roles.

create extension if not exists pgcrypto;

create table if not exists brands (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  official_site text,
  reputation_status text default 'PENDING_VERIFICATION',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  parent_id uuid references categories(id),
  active boolean not null default true
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  product_id text not null unique,
  brand_id uuid references brands(id),
  name text not null,
  model text,
  category_id uuid references categories(id),
  description text,
  status text not null default 'PENDING_VERIFICATION',
  editorial_status text default 'DRAFT',
  currency text default 'IDR',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists product_claims (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  claim text not null,
  source_url text,
  source_label text,
  captured_at timestamptz default now(),
  confidence text not null default 'LOW',
  verified boolean not null default false
);

create table if not exists marketplaces (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  country text default 'ID',
  integration_status text default 'NOT_CONNECTED'
);

create table if not exists listings (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  marketplace_id uuid references marketplaces(id),
  seller_name text,
  official_store boolean,
  source_url text not null,
  price numeric,
  currency text default 'IDR',
  stock_status text,
  rating numeric,
  review_count integer,
  captured_at timestamptz default now(),
  status text default 'PENDING_VERIFICATION'
);

create table if not exists affiliate_programs (
  id uuid primary key default gen_random_uuid(),
  network text not null,
  merchant text,
  region text default 'ID',
  status text default 'PENDING_VERIFICATION',
  terms_url text,
  created_at timestamptz default now()
);

create table if not exists affiliate_offers (
  id uuid primary key default gen_random_uuid(),
  program_id uuid references affiliate_programs(id),
  listing_id uuid references listings(id),
  commission_type text,
  commission_value numeric,
  valid_from timestamptz,
  valid_until timestamptz,
  restrictions jsonb,
  status text default 'PENDING_VERIFICATION',
  created_at timestamptz default now()
);

create table if not exists affiliate_links (
  id uuid primary key default gen_random_uuid(),
  offer_id uuid references affiliate_offers(id),
  destination_url text not null,
  tracking_template text,
  generated_at timestamptz default now(),
  last_checked_at timestamptz,
  health_status text default 'UNKNOWN'
);

create table if not exists recommendations (
  id uuid primary key default gen_random_uuid(),
  query text not null,
  intent jsonb,
  candidate_ids uuid[],
  ranking jsonb,
  methodology_version text not null default 'v1',
  created_at timestamptz default now()
);

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  session_id text,
  product_id uuid references products(id),
  metadata jsonb,
  created_at timestamptz default now()
);
