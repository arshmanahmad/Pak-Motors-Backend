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
├─ .env                  # Environment variables (single file for all environments)
├─ tsconfig.json         # TypeScript configuration
└─ package.json          # Scripts and dependencies
```

- `index.ts` at root: single entrypoint that starts the server
- `src/app.ts`: creates and configures the Express app (no network I/O)
- `controllers` vs `routes`: routes wire URL paths to controllers and compose middleware; controllers hold the request handling logic
- `config/env.ts`: loads `.env` file and exposes typed config object
- `.env`: single environment file used for all environments

## Environment Setup

Create a `.env` file in the root directory with your configuration:

```bash
cp env.example .env
```

Then update the values in `.env` with your actual configuration.

### Required Environment Variables

- `HOST` - Server host (default: localhost, use 0.0.0.0 for production)
- `PORT` - Server port (default: 3000)
- `CORS_ORIGIN` - Allowed CORS origins (semicolon-separated for multiple)
- `MONGO_URL` - MongoDB connection string
- `JWT_SECRET_KEY` - Secret key for JWT token signing
- `JWT_EXPIRES_IN` - JWT token expiration (e.g., "1d", "7d")
- `BCRYPT_SALT_ROUNDS` - Salt rounds for password hashing (default: 10)
- `EMAIL_USER` - Email address for sending OTPs
- `EMAIL_PASSWORD` - App-specific password for email account

See `env.example` for a complete template.

## Scripts

- `npm run dev`: run with hot-reload (watches for file changes)
- `npm run start`: run the server

## Health check

- GET `/api/health` → `{ "status": "ok", "uptime": <seconds> }`
