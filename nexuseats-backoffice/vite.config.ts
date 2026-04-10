import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  // localhost uniquement : évite les soucis réseau / pare-feu liés à host: true (0.0.0.0)
  server: { port: 5174, strictPort: true, host: "localhost" },
});
