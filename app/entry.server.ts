import { app } from "@orange-js/orange/server";

import * as serverBuild from "virtual:orange/server-bundle";
export * from "virtual:orange/durable-objects";

export default app(serverBuild);