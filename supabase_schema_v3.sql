-- RuangPilih Product Intelligence / Customer 360 / Affiliate Intelligence foundation
-- Apply only in a dedicated Supabase project after reviewing RLS/auth roles.
create extension if not exists pgcrypto;

create table if not exists rp_brands (
  id uuid primary key default gen_random_uuid(), name text not null unique, official_site text,
  reputation_status text not null default 'PENDING_VERIFICATION', created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists rp_categories (
  id uuid primary key default gen_random_uuid(), name text not null unique, slug text not null unique,
  parent_id uuid references rp_categories(id), active boolean not null default true
);
create table if not exists rp_products (
  id uuid primary key default gen_random_uuid(), product_id text not null unique, entity_type text not null default 'product',
  brand_id uuid references rp_brands(id), name text not null, model text, category_id uuid references rp_categories(id),
  description text, status text not null default 'PENDING_VERIFICATION', editorial_status text not null default 'DRAFT',
  currency text not null default 'IDR', created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists rp_product_use_cases (
  id uuid primary key default gen_random_uuid(), product_id uuid not null references rp_products(id) on delete cascade,
  use_case text not null
);
create table if not exists rp_product_claims (
  id uuid primary key default gen_random_uuid(), product_id uuid not null references rp_products(id) on delete cascade,
  claim text not null, source_url text, source_label text, captured_at timestamptz not null default now(),
  confidence text not null default 'LOW', verified boolean not null default false
);
create table if not exists rp_marketplaces (
  id uuid primary key default gen_random_uuid(), name text not null unique, country text not null default 'ID',
  integration_status text not null default 'NOT_CONNECTED', enabled boolean not null default false
);
create table if not exists rp_sellers (
  id uuid primary key default gen_random_uuid(), marketplace_id uuid references rp_marketplaces(id),
  seller_name text not null, official_store boolean, rating numeric, status text not null default 'PENDING_VERIFICATION'
);
create table if not exists rp_listings (
  id uuid primary key default gen_random_uuid(), product_id uuid not null references rp_products(id) on delete cascade,
  seller_id uuid references rp_sellers(id), source_url text not null, price numeric, currency text default 'IDR',
  stock_status text, rating numeric, review_count integer, captured_at timestamptz not null default now(),
  status text not null default 'PENDING_VERIFICATION'
);
create table if not exists rp_affiliate_programs (
  id uuid primary key default gen_random_uuid(), network text not null, merchant text, region text default 'ID',
  terms_url text, status text not null default 'PENDING_SETUP', connector_key text unique
);
create table if not exists rp_affiliate_offers (
  id uuid primary key default gen_random_uuid(), program_id uuid references rp_affiliate_programs(id),
  listing_id uuid references rp_listings(id), commission_type text, commission_value numeric,
  valid_from timestamptz, valid_until timestamptz, restrictions jsonb, status text not null default 'PENDING_VERIFICATION'
);
create table if not exists rp_affiliate_links (
  id uuid primary key default gen_random_uuid(), offer_id uuid references rp_affiliate_offers(id),
  destination_url text not null, tracking_template text, generated_at timestamptz default now(),
  last_checked_at timestamptz, health_status text not null default 'UNKNOWN'
);
create table if not exists rp_product_scores (
  id uuid primary key default gen_random_uuid(), product_id uuid not null references rp_products(id) on delete cascade,
  fit numeric, quality numeric, trust numeric, practical_proof numeric, value numeric, freshness numeric,
  economics numeric, total_score numeric, methodology_version text not null default 'v1', calculated_at timestamptz not null default now()
);
create table if not exists rp_recommendations (
  id uuid primary key default gen_random_uuid(), query text not null, intent jsonb,
  candidate_ids uuid[], ranking jsonb, explanation jsonb, live_research boolean not null default false,
  methodology_version text not null default 'v1', created_at timestamptz not null default now()
);
create table if not exists rp_evidence (
  id uuid primary key default gen_random_uuid(), product_id uuid references rp_products(id), recommendation_id uuid references rp_recommendations(id),
  source_url text not null, fact text not null, source_type text, captured_at timestamptz not null default now(), confidence text not null default 'LOW', verified boolean not null default false
);
create table if not exists rp_users (
  id uuid primary key default gen_random_uuid(), auth_user_id uuid unique, email text unique, display_name text,
  country text default 'ID', consent_marketing boolean not null default false, consent_personalization boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists rp_customer_profiles (
  user_id uuid primary key references rp_users(id) on delete cascade, age_band text, household_type text,
  budget_band text, interests jsonb, category_affinity jsonb, preference_profile jsonb, updated_at timestamptz not null default now()
);
create table if not exists rp_events (
  id uuid primary key default gen_random_uuid(), event_name text not null, session_id text, user_id uuid references rp_users(id),
  product_id uuid references rp_products(id), metadata jsonb, occurred_at timestamptz not null default now()
);
create table if not exists rp_saved_items (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references rp_users(id) on delete cascade,
  product_id uuid references rp_products(id), recommendation_id uuid references rp_recommendations(id), created_at timestamptz not null default now(),
  unique(user_id, product_id)
);
create table if not exists rp_partners (
  id uuid primary key default gen_random_uuid(), partner_type text not null, name text not null, website text, status text not null default 'PROSPECT', notes text, created_at timestamptz default now()
);
create table if not exists rp_connectors (
  id uuid primary key default gen_random_uuid(), connector_key text not null unique, name text not null, type text not null,
  enabled boolean not null default false, health_status text not null default 'UNKNOWN', last_checked_at timestamptz,
  metadata jsonb
);
create table if not exists rp_research_jobs (
  id uuid primary key default gen_random_uuid(), query text not null, status text not null default 'QUEUED',
  started_at timestamptz, completed_at timestamptz, result_summary jsonb, error_message text
);
create table if not exists rp_content (
  id uuid primary key default gen_random_uuid(), content_type text not null, slug text not null unique, title text not null,
  excerpt text, body text, status text not null default 'DRAFT', category_id uuid references rp_categories(id),
  seo_title text, seo_description text, published_at timestamptz, updated_at timestamptz default now()
);
create table if not exists rp_audit_log (
  id uuid primary key default gen_random_uuid(), actor_user_id uuid references rp_users(id), action text not null,
  entity_type text, entity_id text, before_data jsonb, after_data jsonb, created_at timestamptz not null default now()
);

create index if not exists idx_rp_events_name_time on rp_events(event_name, occurred_at desc);
create index if not exists idx_rp_listings_product on rp_listings(product_id);
create index if not exists idx_rp_evidence_product on rp_evidence(product_id);
create index if not exists idx_rp_content_status on rp_content(status, published_at desc);

-- Basic RLS posture: public product/content reads can be exposed selectively later; all write paths should use authenticated/admin/service roles.
alter table rp_products enable row level security;
alter table rp_content enable row level security;
alter table rp_events enable row level security;
alter table rp_users enable row level security;
alter table rp_customer_profiles enable row level security;
alter table rp_saved_items enable row level security;
alter table rp_audit_log enable row level security;
