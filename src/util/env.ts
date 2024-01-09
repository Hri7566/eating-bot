import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  isServer: true,
  runtimeEnv: process.env,
  server: {
    MPPCLONE_TOKEN: z.string(),
  },
});

export default env;
