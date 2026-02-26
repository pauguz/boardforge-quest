import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  //Esto causa las 4 ips y el uso del puerto 8080, incluso si lo borras y actualizas, el puerto seguira en 8080
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  }, ////
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
