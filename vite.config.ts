import react from "@vitejs/plugin-react-swc";
import path, { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const isDemoMode = mode === "demo";
  console.log(`Running in ${isDemoMode ? "demo" : "production"} mode`);
  return {
    plugins: [
      tsconfigPaths(),
      react(),
      dts({
        include: ["lib"],
        insertTypesEntry: true,
        copyDtsFiles: true,
        exclude: ["node_modules"],
      }), // export types on build
    ],

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "~": path.resolve(__dirname, "./lib"),
      },
    },

    // activate library mode
    build: isDemoMode
      ? {}
      : {
          copyPublicDir: false,
          lib: {
            entry: resolve(__dirname, "lib/main.ts"),
            formats: ["es"],
          },
        },
  };
});
