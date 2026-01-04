import { createApp } from "./src/app";
import { env } from "./src/config/env";
import mongoose from "mongoose";
import { dropUsernameIndex } from "./src/models/user.model";

const app = createApp();

// Connect to MongoDB
mongoose
  .connect(env.MONGO_URL)
  .then(async () => {
    console.log("Connected to MongoDB");

    // Drop old username index if it exists (from previous schema version)
    await dropUsernameIndex();

    app.listen(env.PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Server running on port ${env.PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });
