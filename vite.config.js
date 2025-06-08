import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "robots.txt", "apple-touch-icon.png"],
      manifest: {
        name: "등산 이야기",
        short_name: "등산",
        description: "등산 기록과 모임을 위한 플랫폼",
        theme_color: "#ffffff",
      },
    }),
  ],
  resolve: {
    alias: {
      theme: path.resolve(__dirname, "src/app/styles/theme"),
      assets: path.resolve(__dirname, "src/shared/assets"),
      shared: path.resolve(__dirname, "src/shared"),
      widgets: path.resolve(__dirname, "src/widgets"),
      context: path.resolve(__dirname, "src/shared/context"),
      features: path.resolve(__dirname, "src/features"),
    },
  },
  server: {
    proxy: {
      "/ormie-service": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});
