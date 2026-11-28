# Copilot instructions for TecLab

## Project layout

- `src/` is the React 19 + TypeScript + Vite client.
- `backend/server.js` is the standalone Express 5 REST API and PostgreSQL access layer.
- `supabase/` contains profile policies and the `login-numero-control` Edge Function.
- `scriptsql/` contains the PostgreSQL application schema and migration scripts.
- `public/` contains browser assets; `dist/` is generated and ignored.

The app is a client-server SPA. React/Supabase handle authentication and profile data, Express validates Supabase bearer tokens and queries PostgreSQL, and practice simulators run in the browser while persisting and synchronizing progress.

## Setup and run

Frontend dependencies and scripts run from the repository root:

```powershell
npm install
npm run dev
```

Backend dependencies and scripts run separately:

```powershell
cd backend
npm install
npm run dev
```

Use `npm start` in `backend/` for one normal Node process. The frontend Vite proxy sends `/api` to `http://localhost:5000`; the backend can be checked with `GET /api/health`.

Configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the root `.env`. Copy `backend/.env.example` to `backend/.env` and set `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and optionally `PORT`.

Do not commit `.env` files or credentials.

## Build, test, and lint

From the repository root:

- `npm run build` - runs strict TypeScript checking (`tsc --noEmit`) and creates `dist/` with Vite.
- `npm test` - runs the full Vitest suite once.
- `npx vitest run src/services/wikipediaService.test.ts` - runs one test file. Replace the path to run another test file.
- `npm run preview` - serves the generated production build locally.

There is no configured frontend ESLint or Prettier command. There is also no backend test suite: `backend/npm test` is a placeholder and fails.

No database migration command is configured. Apply the SQL files manually to the appropriate PostgreSQL or Supabase database as described in `README.md`; never infer that a migration should run automatically.

## Architecture and data flow

- `src/main.tsx` initializes the auth store before mounting `BrowserRouter`.
- `src/routes/AppRouter.tsx` owns route composition. `ProtectedRoute` waits for auth restoration and redirects anonymous users to `/login`.
- `src/pages/` contains route screens. `src/components/` contains layout, dashboard, quiz, terminal, and practice UI.
- `src/api/catalog.ts` is the shared HTTP client for `/api`. It obtains the current Supabase session and attaches its access token as `Authorization: Bearer ...`.
- `backend/server.js` exposes `/api/*`, verifies protected routes through Supabase's `/auth/v1/user` endpoint, sets `req.userId`, and uses parameterized `pg` queries.
- Supabase Auth owns identity; `src/services/authService.ts` also loads the profile from the `profiles` table and the number-control login invokes the `login-numero-control` Edge Function.
- PostgreSQL stores catalog, practice objectives, practice progress, and quiz attempts. Do not treat `localStorage` practice state as authoritative for authenticated progress.

The route hierarchy is laboratory -> topic -> practice; route parameters are passed through `LabDetail`, `TopicDetail`, and `PracticeRunner`. Quiz routes use `/evaluacion/:practiceId`.

## Practice engine conventions

Practice behavior is split from React presentation:

- `src/utils/practiceEngines/index.ts` maps database practice IDs (`dsl`, `ssh`, `proxmox`) to implementations.
- `PracticeEngine` in `src/types/practice.ts` defines device state, terminal output, objective updates, completion, prompt rendering, and optional timer events.
- `src/store/practiceStore.ts` persists sessions under the `teclab-practicas` localStorage key. Session keys are `${userId}:${practiceId}`.
- `src/hooks/usePracticeSession.ts` combines the persisted simulator state with authenticated backend synchronization. It queues practice-progress saves and should remain the integration point for that flow.
- Adding a new practice ID requires coordinating the practice registry, the React view map in `PracticeRunner`, the database practice row, and the practice engine component implementation.

Keep `DeviceState` primitive so it remains serializable. Preserve bounded terminal/command history limits in the practice store rather than storing unbounded UI state.

## Code conventions

- TypeScript is strict and `noEmit` is used during builds; keep public interfaces explicit where they describe API/store/domain data.
- React components and exported data types use TypeScript/TSX. Zustand stores are used for auth and practice state.
- API calls go through `src/api/catalog.ts` rather than adding ad hoc `fetch` calls from pages. It centralizes bearer-token and HTTP error handling.
- Protected API routes use `requireUser`; user-specific writes and reads must use `req.userId` rather than trusting a client-supplied user ID.
- SQL route handlers return JSON and validate request shape before database writes. Preserve the existing Spanish API validation/error text unless a compatibility change is intentional.
- Supabase Edge Function code is Deno/TypeScript and is configured for the Deno formatter/linter by `.vscode/settings.json`.
- Existing source comments and user-facing strings are primarily Spanish. Keep IDs and database field names consistent with the existing snake_case schema and practice/catalog naming.
