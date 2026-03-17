-- profiles table
create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  company_name text,
  created_at timestamptz default now()
);

-- vendors table
create table if not exists vendors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  phone text,
  token text unique not null default encode(gen_random_bytes(32), 'hex'),
  status text not null default 'blocked' check (status in ('blocked','partial','approved','overdue')),
  deadline timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- requirements table
create table if not exists requirements (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid references vendors(id) on delete cascade,
  type text not null check (type in ('w9','coi','terms','bank','license')),
  required boolean default true,
  status text not null default 'pending' check (status in ('pending','submitted','approved','rejected')),
  file_url text,
  metadata jsonb default '{}',
  submitted_at timestamptz,
  reviewed_at timestamptz,
  created_at timestamptz default now()
);

-- mcp_usage table
create table if not exists mcp_usage (
  id uuid primary key default gen_random_uuid(),
  tool text,
  input jsonb,
  output jsonb,
  user_id uuid,
  created_at timestamptz default now()
);

-- Enable RLS
alter table profiles enable row level security;
alter table vendors enable row level security;
alter table requirements enable row level security;

-- RLS policies
create policy "users can view own profile" on profiles for select using (auth.uid() = user_id);
create policy "users can insert own profile" on profiles for insert with check (auth.uid() = user_id);
create policy "users can update own profile" on profiles for update using (auth.uid() = user_id);

create policy "users can view own vendors" on vendors for select using (auth.uid() = user_id);
create policy "users can insert own vendors" on vendors for insert with check (auth.uid() = user_id);
create policy "users can update own vendors" on vendors for update using (auth.uid() = user_id);
create policy "users can delete own vendors" on vendors for delete using (auth.uid() = user_id);
create policy "public can view vendors by token" on vendors for select using (true);

create policy "users can view requirements for own vendors" on requirements for select using (
  exists (select 1 from vendors where vendors.id = requirements.vendor_id and vendors.user_id = auth.uid())
);
create policy "public can view requirements by vendor" on requirements for select using (true);
create policy "public can insert requirements" on requirements for insert with check (true);
create policy "public can update requirements" on requirements for update using (true);
create policy "users can manage requirements" on requirements for all using (
  exists (select 1 from vendors where vendors.id = requirements.vendor_id and vendors.user_id = auth.uid())
);
