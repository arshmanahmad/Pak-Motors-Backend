import { createApp } from "./src/app";
import { env } from "./src/config/env";
import mongoose from "mongoose";

const app = createApp();

// Connect to MongoDB
mongoose.connect(env.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
    
    app.listen(env.PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });


