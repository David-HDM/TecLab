BEGIN;

-- El estado compartido de labs no permite determinar qué usuario inició el curso.
-- Los estados existentes se dejan sin asignar; cada usuario empezará sin cursos iniciados.
CREATE TABLE IF NOT EXISTS user_labs (
  user_id uuid NOT NULL,
  lab_id text NOT NULL REFERENCES labs (id) ON DELETE CASCADE,
  iniciado_en timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, lab_id)
);

COMMIT;
