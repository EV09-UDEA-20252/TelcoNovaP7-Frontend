import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { configDefaults } from "vitest/config";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 3000,
    watch: {
      usePolling: true,
    }
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
    css: false,
    exclude: [...configDefaults.exclude],
    coverage: {
      provider: "v8",
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage'
    }
  }
}));

