BEGIN;

-- Los registros antiguos quedan sin usuario porque no se puede inferir su propietario.
ALTER TABLE practice_progress
  ADD COLUMN IF NOT EXISTS user_id uuid;

ALTER TABLE quiz_attempts
  ADD COLUMN IF NOT EXISTS user_id uuid;

ALTER TABLE quiz_attempts
  ADD COLUMN IF NOT EXISTS practice_id text REFERENCES practices (id) ON DELETE CASCADE;

ALTER TABLE practice_progress
  DROP CONSTRAINT IF EXISTS practice_progress_practice_id_key;

CREATE UNIQUE INDEX IF NOT EXISTS practice_progress_user_practice_uidx
  ON practice_progress (user_id, practice_id);

DROP INDEX IF EXISTS quiz_attempts_user_topic_idx;

CREATE INDEX quiz_attempts_user_topic_idx
  ON quiz_attempts (user_id, topic_id, creado_en DESC);

CREATE INDEX IF NOT EXISTS quiz_attempts_user_practice_idx
  ON quiz_attempts (user_id, practice_id, creado_en);

DROP VIEW IF EXISTS topic_progress;

CREATE VIEW topic_progress
WITH (security_invoker = true) AS
SELECT
  u.user_id,
  t.id AS topic_id,
  t.titulo,
  t.nivel,
  round(100.0 * (coalesce(p.hechas, 0) + coalesce(q.aprobada, 0))
        / (coalesce(p.total, 0) + 1))::int AS progreso,
  q.mejor_puntaje
FROM (
  SELECT user_id FROM practice_progress WHERE user_id IS NOT NULL
  UNION
  SELECT user_id FROM quiz_attempts WHERE user_id IS NOT NULL
) u
CROSS JOIN topics t
LEFT JOIN LATERAL (
  SELECT count(*) AS total,
         count(*) FILTER (WHERE pp.completada) AS hechas
  FROM practices pr
  LEFT JOIN practice_progress pp
    ON pp.practice_id = pr.id
   AND pp.user_id = u.user_id
  WHERE pr.topic_id = t.id
) p ON true
LEFT JOIN LATERAL (
  SELECT max(qa.puntaje) AS mejor_puntaje,
         (max(qa.puntaje) >= 70)::int AS aprobada
  FROM quiz_attempts qa
  WHERE qa.topic_id = t.id
    AND qa.user_id = u.user_id
) q ON true;

COMMIT;
