# TecLab

Entorno virtual de enseñanza guiada para el aprendizaje de **Redes**, con prácticas interactivas y simuladas paso a paso, y evaluaciones de reforzamiento.

Proyecto del Instituto Tecnológico Superior de San Luis Potosí, Capital · TecNM.

## Funcionalidades

- **Autenticación**: inicio de sesión y registro de usuarios.
- **Dashboard**: progreso general, progreso por tema e historial de puntajes.
- **Temas**: contenido teórico de la categoría Redes.
- **Prácticas** (interactivas, simuladas y guiadas paso a paso):
  1. Direccionamiento IP y subredes.
  2. Topología y enrutamiento.
  3. Consultas DNS y geolocalización.
- **Evaluación de reforzamiento**: cuestionarios por tema que indican los conceptos a repasar.

## Stack

| Capa | Herramienta |
| --- | --- |
| Framework frontend | React + TypeScript |
| Empaquetador | Vite |
| Enrutamiento | React Router |
| Estilos | Tailwind CSS |
| Estado | Zustand |
| Backend en la nube | Supabase (PostgreSQL + Auth) |
| Despliegue | Vercel o Netlify |

### APIs públicas

- Cloudflare DNS over HTTPS: resolución de registros DNS.
- RDAP: consulta de dominios e IPs.
- ipapi.co / ip-api.com: geolocalización de IPs.
- Wikipedia REST API: resúmenes de conceptos.

### Visualización de datos

- Recharts: gráficos del Dashboard.
- React Flow: topologías de red interactivas.
- Leaflet + react-leaflet: mapa interactivo.
- TanStack Table (v8): tablas de resultados, rutas y registros DNS.

## Requisitos

- Node.js 20.19 o superior
- npm
- Una cuenta gratuita en [Supabase](https://supabase.com)

## Instalación

```bash
git clone <url-del-repositorio>
cd red-academy
npm install
```

> `@tanstack/react-table` debe estar en la versión 8 (`npm install @tanstack/react-table@8`). La v9 usa una API distinta.

## Variables de entorno

Crea un archivo `.env` en la raíz (no se versiona):

```dotenv
VITE_SUPABASE_URL=https://<tu-proyecto>.supabase.co
VITE_SUPABASE_ANON_KEY=<tu-clave-anon>
```

Puedes tomar `.env.example` como plantilla. Vite solo expone las variables que empiezan con `VITE_`.

## Base de datos

En el editor SQL de Supabase, ejecuta en este orden los archivos de `supabase/`:

1. `schema.sql`: tablas.
2. `policies.sql`: políticas RLS (cada usuario solo accede a su progreso e intentos).
3. `seed.sql`: temas, prácticas y preguntas iniciales.

Tablas: `profiles`, `topics`, `practices`, `practice_progress`, `quizzes`, `questions`, `quiz_attempts`.

## Scripts

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Servidor de desarrollo con recarga instantánea |
| `npm run build` | Verifica tipos y genera la carpeta `dist/` |
| `npm run preview` | Sirve localmente el resultado del build |

## Estructura del proyecto

```text
src/
├── main.tsx              Punto de entrada (BrowserRouter)
├── App.tsx               Layout: Navbar, Sidebar, contenido y Footer
├── routes/               AppRouter y ProtectedRoute
├── pages/                Una página por ruta
├── components/
│   ├── layout/           Navbar, Sidebar, Footer, PageContainer
│   ├── ui/               Button, Card, ProgressBar, Modal
│   ├── dashboard/        Gráficos y tabla de progreso
│   ├── practices/        Componentes de cada práctica
│   └── quiz/             Preguntas, resultado y reforzamiento
├── services/             Supabase y APIs públicas
├── store/                Estado global (Zustand)
├── hooks/                Hooks personalizados
├── utils/                Lógica de subredes, enrutamiento y puntaje
├── data/                 Pasos de prácticas y datos semilla
├── types/                Tipos de TypeScript
└── config/               Constantes
supabase/                 schema.sql, policies.sql, seed.sql
public/                   Favicons y logos
```

## Rutas

| Ruta | Acceso | Descripción |
| --- | --- | --- |
| `/login` | Público | Inicio de sesión |
| `/registro` | Público | Registro |
| `/dashboard` | Protegido | Progreso del usuario |
| `/temas` | Protegido | Lista de temas |
| `/temas/:topicId` | Protegido | Detalle de un tema |
| `/practicas` | Protegido | Lista de prácticas |
| `/practicas/:practiceId` | Protegido | Ejecución de una práctica |
| `/evaluacion/:topicId` | Protegido | Evaluación de reforzamiento |

## Despliegue

1. Sube el repositorio a GitHub.
2. Importa el proyecto en Vercel o Netlify.
3. Configura el comando de build `npm run build` y el directorio de salida `dist`.
4. Agrega las variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` en el panel del servicio.
5. Si usas rutas del lado del cliente, configura la redirección de todas las rutas a `index.html`.

## Estado del proyecto

- [x] Estructura base, rutas y layouts
- [x] Dashboard, Temas, Prácticas y Evaluación con datos temporales
- [ ] Integración con Supabase (autenticación y persistencia)
- [ ] Práctica 1: Direccionamiento IP y subredes
- [ ] Práctica 2: Topología y enrutamiento
- [ ] Práctica 3: DNS y geolocalización
- [ ] Contenido de los Temas

## Licencia

Por definir.
