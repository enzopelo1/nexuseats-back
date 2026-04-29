import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  optimizeDeps: {
    noDiscovery: true,
    include: [],
  },
  // localhost uniquement : évite les soucis réseau / pare-feu liés à host: true (0.0.0.0)
  server: { port: 5174, strictPort: true, host: "localhost" },
});
