-- Crear la tabla "profiles" para almacenar la información de los usuarios autenticados (auth.users)

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nombres text not null,
  apellido_paterno text not null,
  apellido_materno text not null,
  carrera text not null,
  semestre smallint not null check (semestre between 1 and 15),
  numero_control text not null unique,
  creado_en timestamptz not null default now()
);

-- Registra intentos fallidos para aplicar límites por cuenta e IP en el login.
create table public.login_attempts (
  id bigint generated always as identity primary key,
  numero_control text not null,
  ip text not null,
  created_at timestamptz not null default now()
);

create index login_attempts_account_created_idx
  on public.login_attempts (numero_control, created_at);

create index login_attempts_ip_created_idx
  on public.login_attempts (ip, created_at);

alter table public.login_attempts enable row level security;
