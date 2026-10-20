/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    target: "es2022",
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Draggable stays with the lazily loaded desktop chunk.
          if (id.includes("node_modules/gsap") && id.includes("Draggable")) return undefined;
          if (id.includes("node_modules/gsap") || id.includes("node_modules/@gsap")) return "gsap";
          if (id.includes("node_modules/react")) return "react";
        },
      },
    },
  },
  test: {
    include: ["src/**/*.test.ts"],
    environment: "node",
  },
});
