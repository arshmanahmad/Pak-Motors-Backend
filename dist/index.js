"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./src/app");
const env_1 = require("./src/config/env");
const app = (0, app_1.createApp)();
app.listen(env_1.env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on port ${env_1.env.port} in ${env_1.env.nodeEnv} mode`);
});
