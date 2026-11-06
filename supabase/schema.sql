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