import react from "@vitejs/plugin-react-swc";
import path, { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({ include: ["lib"] }), // export types on build
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // activate library mode
  build: {
    copyPublicDir: false,
    lib: {
      entry: resolve(__dirname, "lib/main.ts"),
      formats: ["es"],
    },
  },
});
