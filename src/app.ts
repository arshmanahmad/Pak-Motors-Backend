import express from "express";
import healthRouter from "./routes/health.route";
import { authRouter } from "./routes/auth.route";
import { purchaseRouter } from "./routes/purchase.route";
import { companyRouter } from "./routes/company.route";
import { carModelRouter } from "./routes/car-model.route";
import { personRouter } from "./routes/person.route";
import { env } from "./config/env";
import cors from "cors";

export const createApp = () => {
  const app = express();

  app.use(express.json());

  // Parse CORS_ORIGIN - handle semicolon-separated origins or single origin
  // In development, allow all origins for easier testing
  const corsOptions =
    env.NODE_ENV === "development"
      ? { origin: true, credentials: true } // Allow all origins in development
      : {
          origin: env.CORS_ORIGIN.includes(";")
            ? env.CORS_ORIGIN.split(";").map((origin) => origin.trim())
            : env.CORS_ORIGIN,
          credentials: true,
        };

  app.use(cors(corsOptions));
  app.use("/api", healthRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/purchases", purchaseRouter);
  app.use("/api/companies", companyRouter);
  app.use("/api/models", carModelRouter);
  app.use("/api/persons", personRouter);

  app.get("/", (_req, res) => {
    res.json({ name: "Pak Motors API" });
  });

  return app;
};
