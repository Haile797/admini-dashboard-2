import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["__tests__/**/*.test.ts"],
    exclude: [
      "e2e/**",
      "**/e2e/**",
      "node_modules/**",
      ".next/**",
    ],
  },
});
