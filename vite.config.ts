import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
const BASE_URL = '/oxfordignite/';
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()]  .filter(Boolean),base: BASE_URL,
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));


