# TecLab

TecLab es una plataforma web de laboratorios virtuales para el aprendizaje guiado de tecnología. El proyecto pertenece al Instituto Tecnológico Superior de San Luis Potosí, Capital (TecNM).

## Funcionalidades

- Registro con datos académicos, validación de campos y confirmación de correo.
- Inicio de sesión con número de control y contraseña, cierre de sesión y recuperación/restablecimiento de contraseña.
- Catálogo para explorar laboratorios y área personal para continuar los ya iniciados.
- Laboratorios de Redes y Telecomunicaciones, Desarrollo de Software, Inteligencia Artificial y Microcontroladores y Electrónica.
- Ficha de laboratorio con temas, descripción y resúmenes breves de artículos de Wikipedia buscados con las palabras clave del laboratorio.
- Temas con prácticas disponibles y navegación de regreso entre laboratorio, tema y simulador.
- Simuladores guiados para las prácticas `dsl`, `ssh` y `proxmox`:
  - Consola interactiva con historial de comandos y retroalimentación.
  - Objetivos de práctica y topología de red visual con estado de dispositivos y enlaces.
  - Reinicio de práctica y modo de pantalla completa.
- Evaluaciones por práctica con preguntas en orden aleatorio, puntaje, historial de intentos y conceptos por reforzar.
- Dashboard con progreso por laboratorio, nivel, tema y práctica, además del historial de evaluaciones.
- Avance de simuladores guardado localmente por usuario y sincronizado con el backend al iniciar sesión.

## Tecnologías

| Área | Tecnología |
| --- | --- |
| Interfaz | React 19, TypeScript y Vite |
| Estilos | Tailwind CSS 4 |
| Navegación | React Router |
| Estado local | Zustand |
| Autenticación | Supabase Auth |
| API de la aplicación | Node.js, Express y PostgreSQL (`pg`) |
| Gráficas | Recharts |
| Topologías | React Flow |
| Tablas | TanStack Table |
| Artículos relacionados | API de búsqueda de Wikipedia en español |

## Requisitos

- Node.js 20.19+ o 22.12+
- npm
- Proyecto de Supabase para autenticación y perfiles
- PostgreSQL accesible por el backend

## Instalación y ejecución local

Instala las dependencias del frontend desde la raíz:

```bash
npm install
```

Configura las variables descritas en [Variables de entorno](#variables-de-entorno). Inicia el backend en una terminal:

```bash
cd backend
npm install
npm run dev
```

En otra terminal, inicia Vite desde la raíz del proyecto:

```bash
npm run dev
```

Vite sirve la interfaz y reenvía `/api` a `http://localhost:5000`. El backend también puede iniciarse en modo normal con `npm start` desde `backend/`.

## Variables de entorno

No subas archivos `.env` ni claves al repositorio.

En el archivo `.env` de la raíz, configura las variables públicas que consume el cliente de Supabase:

```dotenv
VITE_SUPABASE_URL=https://<proyecto>.supabase.co
VITE_SUPABASE_ANON_KEY=<clave-publica-de-supabase>
```

Crea `backend/.env` a partir de [`backend/.env.example`](./backend/.env.example) y configura:

```dotenv
DATABASE_URL=postgresql://<usuario>:<contraseña>@<host>:5432/<base>
SUPABASE_URL=https://<proyecto>.supabase.co
SUPABASE_ANON_KEY=<clave-publica-de-supabase>
PORT=5000
```

`PORT` es opcional; el backend usa `5000` por defecto. El backend carga primero `backend/.env` y después el `.env` de la raíz. Para comprobar la conexión, el servidor expone `GET /api/health`.

## Base de datos y autenticación

La aplicación usa Supabase Auth para las cuentas y un backend Express que consulta PostgreSQL con `DATABASE_URL`.

Para preparar la base de datos:

1. En Supabase, configura Auth y aplica [`supabase/schema.sql`](./supabase/schema.sql) para crear `profiles`.
2. Aplica [`supabase/policies.sql`](./supabase/policies.sql) para habilitar las políticas de acceso al perfil.
3. En la base PostgreSQL conectada al backend, ejecuta [`scriptsql/script.sql`](./scriptsql/script.sql) una sola vez para crear laboratorios, temas, prácticas, preguntas, progreso, intentos de evaluación y sus índices.
4. Si actualizas una base anterior que ya tenía el esquema de seguimiento, revisa [`scriptsql/migrate_user_progress.sql`](./scriptsql/migrate_user_progress.sql) antes de ejecutarlo. No es necesario para una base nueva.
5. En una base existente, ejecuta [`scriptsql/migrate_user_labs.sql`](./scriptsql/migrate_user_labs.sql) para guardar por usuario los laboratorios iniciados. Los estados globales antiguos de `labs.estatus` no se pueden atribuir a un usuario, por lo que se ignoran.
6. La columna `labs.palabras_clave` se crea como JSON con un arreglo de cadenas (por ejemplo, `["redes", "direccionamiento IP"]`) y se usa para consultar Wikipedia. En una base existente que todavía no la tenga, ejecuta:

   ```sql
   ALTER TABLE labs
     ADD COLUMN IF NOT EXISTS palabras_clave jsonb NOT NULL DEFAULT '[]'::jsonb;
   ```

El endpoint de inicio de sesión por número de control está implementado como función de Supabase en `supabase/functions/login-numero-control`. La tabla `login_attempts` se define en `supabase/schema.sql`. Al desplegar la función (`supabase functions deploy login-numero-control`), configura `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` y `ALLOWED_ORIGINS` como secretos. Para el registro, configura en Supabase el mecanismo que crea el perfil con los metadatos de Auth; el login busca allí el número de control asociado a la cuenta.

## Rutas de la aplicación

| Ruta | Acceso | Contenido |
| --- | --- | --- |
| `/login` | Público | Inicio de sesión |
| `/registro` | Público | Registro de usuario |
| `/recuperar` | Público | Solicitud de recuperación |
| `/restablecer-contrasena` | Público con sesión de recuperación | Cambio de contraseña |
| `/dashboard` | Protegido | Progreso e historial |
| `/mis-laboratorios` | Protegido | Laboratorios iniciados |
| `/explorar` | Protegido | Laboratorios disponibles |
| `/:labId` | Protegido | Detalle del laboratorio o sus temas |
| `/:labId/:topicId` | Protegido | Detalle del tema y prácticas |
| `/:labId/:topicId/:practiceId` | Protegido | Simulador de práctica |
| `/evaluacion/:practiceId` | Protegido | Evaluación y reforzamiento |

## Scripts

Desde la raíz:

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Inicia Vite en desarrollo |
| `npm run build` | Verifica TypeScript y genera `dist/` |
| `npm run preview` | Sirve localmente el build de producción |
| `npm test` | Ejecuta las pruebas con Vitest |

Desde `backend/`:

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Inicia Express con recarga al cambiar archivos |
| `npm start` | Inicia Express |

## Estructura

```text
src/
├── api/                 Cliente HTTP para el backend
├── components/          Componentes de layout, interfaz, dashboard, simuladores y quiz
├── config/              Enlaces y opciones compartidas
├── hooks/               Acceso a autenticación y sesión de práctica
├── pages/               Pantallas de la aplicación
├── routes/              Rutas y protección de sesión
├── services/            Supabase, autenticación y Wikipedia
├── store/               Estado global y persistencia local
├── types/               Modelos de datos de TypeScript
└── utils/               Validaciones y motores de simulación
backend/
└── server.js            API Express y consultas PostgreSQL
scriptsql/               Esquema de la aplicación y migración de progreso
supabase/                Configuración, políticas y función de inicio de sesión
public/                  Imágenes, iconos y recursos de marca
```

## Despliegue

- **Frontend:** configura `npm run build` como comando de compilación y `dist` como directorio de salida. Define `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` en el proveedor y configura el fallback de rutas del cliente a `index.html`.
- **Backend:** despliega `backend/` en un servicio Node.js, instala sus dependencias y configura `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_ANON_KEY` y `PORT`. El frontend y el backend deben compartir origen o el proveedor debe reenviar `/api` al backend; el proxy de Vite solo se aplica en desarrollo.
- **Supabase:** configura Auth, las políticas y los secretos requeridos por la función `login-numero-control`. Restringe `ALLOWED_ORIGINS` a los orígenes reales del frontend.

## Licencia

Consulta al equipo del proyecto para conocer las condiciones de uso y distribución.
