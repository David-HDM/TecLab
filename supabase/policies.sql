-- Politicas aplicadas a la tabla profiles

alter table public.profiles enable row level security;

create policy "Ver su propio perfil"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Crear su propio perfil"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Actualizar su propio perfil"
  on public.profiles for update
  using (auth.uid() = id);