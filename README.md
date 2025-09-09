# Pak Motors Backend

## Folder structure (why this layout)

```
.
├─ index.ts              # Single entrypoint kept at root for easy process start
├─ src/
│  ├─ app.ts             # Creates and configures the Express app (no network I/O)
│  ├─ controllers/
│  │  └─ health.controller.ts  # Request handlers (business logic per endpoint)
│  ├─ routes/
│  │  └─ health.route.ts       # Route definitions and middleware composition
│  └─ config/
│     └─ env.ts          # Centralized environment configuration
├─ tsconfig.json         # Compiles both root index.ts and src/**/* to dist/
└─ package.json          # Scripts for dev/build/start
```

- `index.ts` at root: clean separation between app creation (`src/app.ts`) and process concerns (port, env, listening). Keeping it at root makes deployment/PM2/Docker commands straightforward and keeps `src/` purely application code.
- `src/app.ts`: builds and returns an Express app. No `listen()` here, so the app can be reused in tests or serverless if needed.
- `controllers` vs `routes`: routes wire URL paths to controllers and compose middleware; controllers hold the request handling logic for clarity and testability.
- `config/env.ts`: loads `.env` once and exposes a typed config object so the rest of the code imports config instead of touching `process.env` everywhere.

## Environment

Create a `.env` file (use this template):

```
NODE_ENV=development
PORT=3000
```

## Scripts

- `npm run dev`: run with hot-reload via ts-node-dev
- `npm run build`: compile to `dist/`
- `npm start`: run compiled build from `dist/`

## Health check

- GET `/api/health` → `{ "status": "ok", "uptime": <seconds> }`
