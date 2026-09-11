/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { sentryVitePlugin } from "@sentry/vite-plugin";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // Upload source maps to Sentry in production builds
    sentryVitePlugin({
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
    }),
  ],
  define: {
    "import.meta.env.VITE_APP_ENV": JSON.stringify(
      process.env.VITE_APP_ENV ||
        (process.env.CF_PAGES_BRANCH === "main" ? "prod" : "dev"),
    ),
  },
  build: {
    sourcemap: true, // Generate source maps for Sentry
  },
  test: {
    environment: "jsdom",
    globals: true,
    testTimeout: 15000,
    setupFiles: "./src/vitest.setup.ts",
    env: {
      VITE_SUPABASE_URL: "https://test.supabase.co",
      VITE_SUPABASE_ANON_KEY: "test-key",
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "https://api.govnix.net",
        changeOrigin: true,
      },
    },
  },
});
