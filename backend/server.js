import express from 'express';
import pkg from 'pg';
import dotenv from 'dotenv';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const { Pool } = pkg;
const backendDirectory = dirname(fileURLToPath(import.meta.url));

// Carga configuración local del backend y, como alternativa, la del frontend.
dotenv.config({ path: resolve(backendDirectory, '.env') });
dotenv.config({ path: resolve(backendDirectory, '..', '.env') });

const app = express();
const port = process.env.PORT || 5000;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

app.use(express.json({ limit: '64kb' }));

// Valida tokens de Supabase y expone el ID autenticado a rutas protegidas.
async function requireUser(req, res, next) {
  const token = req.get('authorization')?.match(/^Bearer\s+(.+)$/i)?.[1];
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  if (!token) return res.status(401).json({ error: 'Se requiere iniciar sesión.' });
  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({
      error: 'Falta la URL y la clave pública de Supabase para validar la sesión. DATABASE_URL sigue usando PostgreSQL.',
    });
  }

  try {
    const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) return res.status(401).json({ error: 'La sesión no es válida o expiró.' });

    const user = await response.json();
    if (typeof user.id !== 'string') {
      return res.status(401).json({ error: 'No se pudo validar el usuario.' });
    }

    req.userId = user.id;
    return next();
  } catch (error) {
    return next(error);
  }
}

app.get('/api/health', async (_req, res) => {
  const result = await pool.query('SELECT NOW()');
  res.json({ status: 'ok', dbTime: result.rows[0].now });
});

// Catálogo educativo: laboratorios, temas, prácticas y preguntas.
app.get('/api/labs', async (_req, res) => {
  res.json((await pool.query('SELECT * FROM labs ORDER BY id')).rows);
});

app.get('/api/labs/:id', async (req, res) => {
  res.json((await pool.query('SELECT * FROM labs WHERE id=$1', [req.params.id])).rows[0] ?? null);
});

app.post('/api/labs/:id/start', requireUser, async (req, res) => {
  const result = await pool.query(
    `UPDATE labs
     SET estatus = 'COMENZADO'
     WHERE id = $1
     RETURNING *`,
    [req.params.id]
  );
  if (!result.rows[0]) return res.status(404).json({ error: 'Laboratorio no encontrado.' });
  res.json(result.rows[0]);
});

app.get('/api/labs/:id/topics', async (req, res) => {
  res.json((await pool.query('SELECT * FROM topics WHERE lab_id=$1 ORDER BY id', [req.params.id])).rows);
});

app.get('/api/topics/:id', async (req, res) => {
  res.json((await pool.query('SELECT * FROM topics WHERE id=$1', [req.params.id])).rows[0] ?? null);
});

app.get('/api/topics/:id/practices', async (req, res) => {
  res.json((await pool.query(
    'SELECT * FROM practices WHERE topic_id=$1 ORDER BY orden, id',
    [req.params.id]
  )).rows);
});

app.get('/api/practices/:id', async (req, res) => {
  res.json((await pool.query('SELECT * FROM practices WHERE id=$1', [req.params.id])).rows[0] ?? null);
});

app.get('/api/questions', async (req, res) => {
  const { practice_id: practiceId } = req.query;
  if (typeof practiceId !== 'string' || !practiceId) {
    return res.status(400).json({ error: 'Se requiere practice_id.' });
  }

  res.json((await pool.query(
    'SELECT * FROM questions WHERE practice_id=$1 ORDER BY random()',
    [practiceId]
  )).rows);
});

// Datos del dashboard limitados al usuario autenticado.
app.get('/api/dashboard/topics', requireUser, async (req, res) => {
  const { lab_id: labId } = req.query;
  if (typeof labId !== 'string' || !labId) {
    return res.status(400).json({ error: 'Se requiere lab_id.' });
  }

  const result = await pool.query(
    `WITH practice_totals AS (
       SELECT pr.topic_id,
              count(*) AS total,
              count(*) FILTER (WHERE pp.completada) AS hechas
       FROM practices pr
       LEFT JOIN practice_progress pp
         ON pp.practice_id = pr.id AND pp.user_id = $1
       GROUP BY pr.topic_id
     ),
     quiz_best AS (
       SELECT topic_id, max(puntaje) AS mejor_puntaje
       FROM quiz_attempts
       WHERE user_id = $1
       GROUP BY topic_id
     )
     SELECT t.id AS topic_id,
            t.titulo,
            t.nivel,
            round(
              100.0 * (
                coalesce(pt.hechas, 0) +
                CASE WHEN coalesce(qb.mejor_puntaje, 0) >= 70 THEN 1 ELSE 0 END
              ) / (coalesce(pt.total, 0) + 1)
            )::int AS progreso,
            qb.mejor_puntaje
     FROM topics t
     LEFT JOIN practice_totals pt ON pt.topic_id = t.id
     LEFT JOIN quiz_best qb ON qb.topic_id = t.id
     WHERE t.lab_id = $2
     ORDER BY
       CASE t.nivel
         WHEN 'PRINCIPIANTE' THEN 1
         WHEN 'INTERMEDIO' THEN 2
         WHEN 'AVANZADO' THEN 3
         ELSE 4
       END,
       t.id`,
    [req.userId, labId]
  );
  res.json(result.rows);
});

app.get('/api/dashboard/practices', requireUser, async (req, res) => {
  const { topic_id: topicId } = req.query;
  if (typeof topicId !== 'string' || !topicId) {
    return res.status(400).json({ error: 'Se requiere topic_id.' });
  }

  const result = await pool.query(
    `SELECT pr.id AS practice_id,
            pr.topic_id,
            pr.titulo,
            pr.orden,
            coalesce(
              round(
                100.0 * cardinality(pp.objetivos_completados) /
                nullif(jsonb_array_length(pr.objetivos), 0)
              )::int,
              0
            ) AS progreso,
            coalesce(pp.completada, false) AS completada
     FROM practices pr
     LEFT JOIN practice_progress pp
       ON pp.practice_id = pr.id AND pp.user_id = $1
     WHERE pr.topic_id = $2
     ORDER BY pr.orden, pr.id`,
    [req.userId, topicId]
  );
  res.json(result.rows);
});

app.get('/api/dashboard/quiz-history', requireUser, async (req, res) => {
  const { practice_id: practiceId } = req.query;
  if (typeof practiceId !== 'string' || !practiceId) {
    return res.status(400).json({ error: 'Se requiere practice_id.' });
  }

  const result = await pool.query(
    `SELECT id,
            row_number() OVER (ORDER BY creado_en, id)::int AS intento,
            puntaje,
            correctas,
            total,
            to_char(creado_en AT TIME ZONE 'UTC', 'YYYY-MM-DD') AS fecha
     FROM quiz_attempts
     WHERE user_id = $1 AND practice_id = $2
     ORDER BY creado_en, id`,
    [req.userId, practiceId]
  );
  res.json(result.rows);
});

// Guardado de progreso y resultados de evaluaciones.
app.put('/api/practices/:id/progress', requireUser, async (req, res) => {
  const { objetivos_completados: completedObjectives, completada } = req.body ?? {};
  if (
    !Array.isArray(completedObjectives) ||
    !completedObjectives.every(Number.isSafeInteger) ||
    new Set(completedObjectives).size !== completedObjectives.length ||
    typeof completada !== 'boolean'
  ) {
    return res.status(400).json({ error: 'El avance de la práctica no tiene un formato válido.' });
  }

  const practiceResult = await pool.query(
    'SELECT objetivos FROM practices WHERE id=$1',
    [req.params.id]
  );
  const practice = practiceResult.rows[0];
  if (!practice) return res.status(404).json({ error: 'Práctica no encontrada.' });

  const validIds = new Set(practice.objetivos.map((objective) => objective.id));
  if (completedObjectives.some((objectiveId) => !validIds.has(objectiveId))) {
    return res.status(400).json({ error: 'El avance contiene objetivos que no pertenecen a la práctica.' });
  }
  if (completada && [...validIds].some((objectiveId) => !completedObjectives.includes(objectiveId))) {
    return res.status(400).json({ error: 'No se puede marcar como completada una práctica con objetivos pendientes.' });
  }

  const result = await pool.query(
    `INSERT INTO practice_progress
       (user_id, practice_id, objetivos_completados, completada, completada_en)
     VALUES ($1, $2, $3, $4, CASE WHEN $4 THEN now() ELSE NULL END)
     ON CONFLICT (user_id, practice_id) DO UPDATE
       SET objetivos_completados = EXCLUDED.objetivos_completados,
           completada = EXCLUDED.completada,
           completada_en = CASE
             WHEN EXCLUDED.completada
               THEN coalesce(practice_progress.completada_en, now())
             ELSE NULL
           END
     RETURNING practice_id, objetivos_completados, completada, completada_en, actualizado_en`,
    [req.userId, req.params.id, completedObjectives, completada]
  );
  res.json(result.rows[0]);
});

app.post('/api/practices/:id/quiz-attempts', requireUser, async (req, res) => {
  const { respuestas } = req.body ?? {};
  if (
    !Array.isArray(respuestas) ||
    !respuestas.every((answer) =>
      answer &&
      typeof answer.pregunta === 'string' &&
      Number.isSafeInteger(answer.elegida)
    )
  ) {
    return res.status(400).json({ error: 'Las respuestas del quiz no tienen un formato válido.' });
  }

  const practiceResult = await pool.query(
    'SELECT topic_id FROM practices WHERE id=$1',
    [req.params.id]
  );
  const practice = practiceResult.rows[0];
  if (!practice) return res.status(404).json({ error: 'Práctica no encontrada.' });

  const questionResult = await pool.query(
    'SELECT id, correcta, jsonb_array_length(opciones) AS opciones_count FROM questions WHERE practice_id=$1',
    [req.params.id]
  );
  const questions = questionResult.rows;
  if (!questions.length) return res.status(422).json({ error: 'La práctica no tiene preguntas.' });
  if (respuestas.length !== questions.length) {
    return res.status(400).json({ error: 'Se deben responder todas las preguntas del quiz.' });
  }

  const answerByQuestion = new Map();
  for (const answer of respuestas) {
    if (answerByQuestion.has(answer.pregunta)) {
      return res.status(400).json({ error: 'Hay preguntas respondidas más de una vez.' });
    }
    answerByQuestion.set(answer.pregunta, answer.elegida);
  }

  if (questions.some((question) => {
    const choice = answerByQuestion.get(question.id);
    return !Number.isSafeInteger(choice) || choice < 0 || choice >= question.opciones_count;
  })) {
    return res.status(400).json({ error: 'Las respuestas no corresponden a las preguntas de esta práctica.' });
  }

  const correctas = questions.filter(
    (question) => answerByQuestion.get(question.id) === question.correcta
  ).length;
  const puntaje = Math.round((correctas / questions.length) * 100);
  const normalizedAnswers = questions.map((question) => ({
    pregunta: question.id,
    elegida: answerByQuestion.get(question.id),
  }));

  const result = await pool.query(
    `INSERT INTO quiz_attempts
       (user_id, practice_id, topic_id, puntaje, correctas, total, respuestas)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id,
               practice_id,
               topic_id,
               puntaje,
               correctas,
               total,
               to_char(creado_en AT TIME ZONE 'UTC', 'YYYY-MM-DD') AS fecha`,
    [
      req.userId,
      req.params.id,
      practice.topic_id,
      puntaje,
      correctas,
      questions.length,
      JSON.stringify(normalizedAnswers),
    ]
  );
  res.status(201).json(result.rows[0]);
});

// Manejo común de errores de API y arranque del servidor.
app.use((error, _req, res, next) => {
  console.error(error);
  if (res.headersSent) return next(error);
  if (error.code === '42703' || error.code === '42P01') {
    return res.status(503).json({
      error: 'Faltan columnas de seguimiento en PostgreSQL. Ejecuta scriptsql/migrate_user_progress.sql en tu base local y reinicia el backend.',
    });
  }
  res.status(500).json({ error: 'Ocurrió un error interno al procesar la solicitud.' });
});

app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`);
});
