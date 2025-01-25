import react from "@vitejs/plugin-react-swc";
import path, { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

// https://vite.dev/config/
export default defineConfig(({command, mode}) => {
  const isDemoMode = mode === 'demo'
  console.log(`Running in ${isDemoMode ? 'demo' : 'production'} mode`)
  return {
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
    build: isDemoMode ? {} : {
      copyPublicDir: false,
      lib: {
        entry: resolve(__dirname, "lib/main.ts"),
        formats: ["es"],
      },
    },
  };
});
