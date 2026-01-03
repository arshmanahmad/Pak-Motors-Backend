"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./src/app");
const env_1 = require("./src/config/env");
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = require("./src/models/user.model");
const app = (0, app_1.createApp)();
// Connect to MongoDB
mongoose_1.default
    .connect(env_1.env.MONGO_URL)
    .then(async () => {
    console.log("Connected to MongoDB");
    // Drop old username index if it exists (from previous schema version)
    await (0, user_model_1.dropUsernameIndex)();
    app.listen(env_1.env.PORT, () => {
        // eslint-disable-next-line no-console
        console.log(`Server running on port ${env_1.env.PORT} in ${env_1.env.NODE_ENV} mode`);
    });
})
    .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
});
