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

The application uses environment-specific configuration files based on `NODE_ENV`:

- `.env.development` - for development environment
- `.env.production` - for production environment
- `.env.production.local` - for local production testing

### Setup

1. Copy the example file based on your environment:

   ```bash
   # For development
   cp .env.development.example .env.development

   # For production
   cp .env.production.example .env.production
   ```

2. Update the values in your `.env.{NODE_ENV}` file with your actual configuration.

### Required Environment Variables

- `NODE_ENV` - Environment name (development, production, production.local, test)
- `HOST` - Server host (default: localhost)
- `PORT` - Server port (default: 3000)
- `CORS_ORIGIN` - Allowed CORS origins (semicolon-separated for multiple)
- `MONGO_URL` - MongoDB connection string
- `JWT_SECRET_KEY` - Secret key for JWT token signing
- `JWT_EXPIRES_IN` - JWT token expiration (e.g., "1d", "7d")
- `BCRYPT_SALT_ROUNDS` - Salt rounds for password hashing (default: 10)
- `EMAIL_USER` - Email address for sending OTPs
- `EMAIL_PASSWORD` - App-specific password for email account

See `.env.example` for a complete list of all available environment variables.

## Scripts

- `npm run dev`: run with hot-reload via ts-node-dev
- `npm run build`: compile to `dist/`
- `npm start`: run compiled build from `dist/`

## Health check

- GET `/api/health` → `{ "status": "ok", "uptime": <seconds> }`
