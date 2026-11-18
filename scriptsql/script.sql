create table labs (
  id text primary key,                         -- 'dsl', 'ssh', 'proxmox-cisco'
  titulo text not null,
  descripcion_corta text not null,
  descripcion_larga text not null,
  img_oferta text,
  img_detalle text,
  estatus VARCHAR(20) NOT NULL DEFAULT 'SIN COMENZAR',
    CONSTRAINT estatus_valid_values CHECK (estatus IN ('COMENZADO', 'SIN COMENZAR')),
  creado_en timestamptz not null default now()
);

create table topics (
  id text primary key,
  lab_id text not null references labs (id) on delete cascade,
  titulo text not null,
  descripcion text not null,
  nivel varchar(30) NOT NULL,
   CONSTRAINT nivel_valores_validos CHECK (nivel in ('PRINCIPIANTE','INTERMEDIO','AVANZADO')),
  creado_en timestamptz not null default now()
);

create index topics_lab_id_idx on topics (lab_id);

create table practices (
  id text primary key,
  topic_id text not null references topics (id) on delete cascade,
  titulo text not null,
  descripcion text not null,
  sigla text not null,
  color text not null check (color in ('blue', 'purple', 'emerald')),
  modulo text not null,
  categoria text not null,
  titulo_guiado text not null,
  introduccion text not null,
  titulo_nota text not null,
  informacion jsonb,                           -- { "titulo": "...", "lineas": ["..."] }
  consola jsonb not null,                      -- { "titulo": "...", "detalle": "..." }
  objetivos jsonb not null
    check (jsonb_typeof(objetivos) = 'array'), -- [{ "id": 1, "texto": "...", "comando": "..." }]
  orden smallint not null default 0,
  creado_en timestamptz not null default now()
);

create index practices_topic_id_idx on practices (topic_id);

create table questions (
  id text primary key,
  practice_id text not null references practices (id) on delete cascade,
  concepto text not null,
  enunciado text not null,
  opciones jsonb not null
    check (jsonb_typeof(opciones) = 'array'),  -- ["opción a", "opción b", "opción c"]
  correcta smallint not null check (
  	jsonb_typeof(opciones) = 'array'
  	and correcta >= 0
  	and correcta < jsonb_array_length(opciones)
	),
  explicacion text not null,
  orden smallint not null default 0
);

create index questions_topic_id_idx on questions (practice_id, orden);

create table practice_progress (
  id bigint generated always as identity primary key,
  user_id uuid not null,
  practice_id text not null references practices (id) on delete cascade,
  objetivos_completados smallint[] not null default '{}',
  completada boolean not null default false,
  completada_en timestamptz,
  actualizado_en timestamptz not null default now()
);

create unique index practice_progress_user_practice_uidx
  on practice_progress (user_id, practice_id);

create table quiz_attempts (
  id bigint generated always as identity primary key,
  user_id uuid not null,
  practice_id text not null references practices (id) on delete cascade,
  topic_id text not null references topics (id) on delete cascade,
  puntaje smallint not null check (puntaje between 0 and 100),
  correctas smallint not null check (correctas >= 0),
  total smallint not null check (total > 0),
  respuestas jsonb not null,                   -- [{ "pregunta": "dsl-1", "elegida": 1 }, ...]
  creado_en timestamptz not null default now()
);

create index quiz_attempts_user_topic_idx on quiz_attempts (user_id, topic_id, creado_en desc);
create index quiz_attempts_user_practice_idx on quiz_attempts (user_id, practice_id, creado_en);

create or replace function set_actualizado_en()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.actualizado_en := now();
  return new;
end;
$$;

create trigger practice_progress_actualizado
  before update on practice_progress
  for each row execute function set_actualizado_en();

drop view if exists topic_progress;

create view topic_progress
with (security_invoker = true) as
select
  u.user_id,
  t.id as topic_id,
  t.titulo,
  t.nivel,
  round(100.0 * (coalesce(p.hechas, 0) + coalesce(q.aprobada, 0))
        / (coalesce(p.total, 0) + 1))::int as progreso,
  q.mejor_puntaje
from (
  select user_id from practice_progress where user_id is not null
  union
  select user_id from quiz_attempts where user_id is not null
) u
cross join topics t
left join lateral (
  select count(*) as total,
         count(*) filter (where pp.completada) as hechas
  from practices pr
  left join practice_progress pp
    on pp.practice_id = pr.id
   and pp.user_id = u.user_id
  where pr.topic_id = t.id
) p on true
left join lateral (
  select max(qa.puntaje) as mejor_puntaje,
         (max(qa.puntaje) >= 70)::int as aprobada
  from quiz_attempts qa
  where qa.topic_id = t.id
    and qa.user_id = u.user_id
) q on true;