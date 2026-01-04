import dotenv from "dotenv";
import { cleanEnv, host, num, port, str, url } from "envalid";
import fs from "fs";
import path from "path";

// Always load .env file
const envPath = path.resolve(process.cwd(), ".env");

// Load the .env file
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
  console.log(`Loaded environment file: .env`);
} else {
  console.warn(`Environment file .env not found`);
}

export const env = cleanEnv(process.env, {
  HOST: host({ default: "localhost" }),
  PORT: port({ default: 3000 }),
  CORS_ORIGIN: str({
    default: "http://localhost:3001;http://localhost:3000",
  }),
  COMMON_RATE_LIMIT_MAX_REQUESTS: num({ default: 1000 }),
  COMMON_RATE_LIMIT_WINDOW_MS: num({ default: 1000 }),
  MONGO_URL: url({
    default: "mongodb://localhost:27017/pak-motors-db",
  }),
  JWT_SECRET_KEY: str({ default: "mySecret" }),
  JWT_EXPIRES_IN: str({ default: "1d" }),
  BCRYPT_SALT_ROUNDS: num({ default: 10 }),

  EMAIL_USER: str({ default: "your-email@gmail.com" }),
  EMAIL_PASSWORD: str({ default: "your-app-password" }),
});
