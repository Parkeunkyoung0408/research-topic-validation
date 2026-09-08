import { defineConfig } from "vitest/config";

export default defineConfig({
  oxc: { jsx: { runtime: "automatic" } },
  test: { environment: "jsdom", include: ["features/**/*.test.tsx"] },
});
