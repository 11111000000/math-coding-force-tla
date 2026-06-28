import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: false,
    include: ["implementation/**/*.test.ts", "implementation/**/*.test.tsx"],
    setupFiles: ["implementation/setup.ts"],
    testTimeout: 10000,
  },
});
