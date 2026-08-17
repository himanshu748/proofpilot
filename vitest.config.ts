import { defineConfig } from "vitest/config";
import path from "path";

const templateRoot = path.resolve(import.meta.dirname);
const runLiveIntegrationTests = process.env.RUN_LIVE_INTEGRATION_TESTS === "true";

export default defineConfig({
  root: templateRoot,
  resolve: {
    alias: {
      "@": path.resolve(templateRoot, "client", "src"),
      "@shared": path.resolve(templateRoot, "shared"),
      "@assets": path.resolve(templateRoot, "attached_assets"),
    },
  },
  test: {
    environment: "node",
    include: runLiveIntegrationTests
      ? ["server/**/*.live.test.ts"]
      : ["server/**/*.test.ts", "server/**/*.spec.ts"],
    exclude: runLiveIntegrationTests ? [] : ["server/**/*.live.test.ts"],
  },
});
