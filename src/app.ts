import express from "express";
import healthRouter from "./routes/health.route";

export const createApp = () => {
  const app = express();

  app.use(express.json());

  app.use("/api", healthRouter);

  app.get("/", (_req, res) => {
    res.json({ name: "Pak Motors API" });
  });

  return app;
};


