-- Run this in the Supabase SQL editor (Project > SQL Editor > New query)

create table drivers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  name text not null,
  rating numeric default 5.0,
  trip_count integer default 0,
  is_online boolean default false,
  lat double precision,
  lng double precision,
  created_at timestamptz default now()
);

create table trips (
  id uuid primary key default gen_random_uuid(),
  rider_id uuid references auth.users not null,
  driver_id uuid references drivers,
  pickup_lat double precision,
  pickup_lng double precision,
  dropoff_lat double precision,
  dropoff_lng double precision,
  status text not null default 'requested'
    check (status in ('requested','matched','awaiting_authorization','active','completed','cancelled')),
  fare_cents integer,
  requested_at timestamptz default now(),
  completed_at timestamptz
);

create table vehicle_authorizations (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid references trips not null,
  make text not null,
  model text not null,
  plate text not null,
  insurer text,
  insured_confirmed boolean not null default false,
  roadworthy_confirmed boolean not null default false,
  authorization_confirmed boolean not null default false,
  signature_svg text not null,
  signed_at timestamptz default now()
);

alter table drivers enable row level security;
alter table trips enable row level security;
alter table vehicle_authorizations enable row level security;

-- Riders can see and manage only their own trips
create policy "riders manage own trips" on trips
  for all using (auth.uid() = rider_id);

-- Riders can create/view authorizations only for their own trips
create policy "riders manage own authorizations" on vehicle_authorizations
  for all using (
    exists (select 1 from trips where trips.id = trip_id and trips.rider_id = auth.uid())
  );

-- Anyone signed in can see online drivers (needed for matching)
create policy "read online drivers" on drivers
  for select using (is_online = true or user_id = auth.uid());

create policy "drivers manage own row" on drivers
  for all using (auth.uid() = user_id);
