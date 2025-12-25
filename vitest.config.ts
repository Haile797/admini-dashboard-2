import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",

    // ✅ CHỈ chạy unit tests
    include: ["__tests__/**/*.test.ts"],

    // 🚫 LOẠI BỎ E2E
    exclude: [
      "e2e/**",
      "**/e2e/**",
      "node_modules/**",
      ".next/**",
    ],
  },
});
