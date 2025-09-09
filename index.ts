import { createApp } from "./src/app";
import { env } from "./src/config/env";

const app = createApp();

app.listen(env.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${env.port} in ${env.nodeEnv} mode`);
});


