import dotenv from "dotenv";
import { cleanEnv, host, num, port, str, testOnly, url } from "envalid";
import fs from "fs";
import path from "path";

const nodeEnvironment = process.env.NODE_ENV || "development";

// Try to load environment-specific .env file first
const envPath = path.resolve(process.cwd(), `.env.${nodeEnvironment}`);

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
  console.log(`Loaded environment file: .env.${nodeEnvironment}`);
} else {
  console.warn(`Environment file .env.${nodeEnvironment} not found`);
  // Fallback to plain .env file if environment-specific file doesn't exist
  const defaultEnvPath = path.resolve(process.cwd(), ".env");
  if (fs.existsSync(defaultEnvPath)) {
    dotenv.config({ path: defaultEnvPath });
    console.log(`Loaded fallback environment file: .env`);
  } else {
    console.error(
      `No environment file found: tried .env.${nodeEnvironment} and .env`
    );
  }
}

export const env = cleanEnv(process.env, {
  NODE_ENV: str({
    devDefault: testOnly("test"),
    choices: ["development", "production", "production.local", "test"],
  }),
  HOST: host({ devDefault: testOnly("localhost") }),
  PORT: port({ devDefault: testOnly(3000) }),
  CORS_ORIGIN: str({
    devDefault: testOnly("http://localhost:3001;http://localhost:3000"),
  }),
  COMMON_RATE_LIMIT_MAX_REQUESTS: num({ devDefault: testOnly(1000) }),
  COMMON_RATE_LIMIT_WINDOW_MS: num({ devDefault: testOnly(1000) }),
  MONGO_URL: url({
    devDefault: testOnly("mongodb://localhost:27017/wrytify-db"),
  }),
  JWT_SECRET_KEY: str({ devDefault: testOnly("mySecret") }),
  JWT_EXPIRES_IN: str({ devDefault: testOnly("1d") }),
  BCRYPT_SALT_ROUNDS: num({ devDefault: testOnly(10) }),

  EMAIL_USER: str({ devDefault: testOnly("arshman@gmail.com") }),
  EMAIL_PASSWORD: str({ devDefault: testOnly("124345$arsh") }),
});
