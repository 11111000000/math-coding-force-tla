import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: false,
    include: ["./**/*.test.ts", "./**/*.test.tsx"],
    setupFiles: ["./setup.ts"],
    testTimeout: 10000,
  },
});