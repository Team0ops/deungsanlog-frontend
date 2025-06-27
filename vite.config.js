import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname);

  return {
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
        workbox: {
          // 🔥 auth 경로는 SW가 처리하지 않도록 제외
          navigateFallbackDenylist: [
            /^\/auth/, // /auth로 시작하는 모든 경로
            /^\/api/, // /api로 시작하는 모든 경로 (추가 보안)
          ],
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
        pages: path.resolve(__dirname, "src/pages"),
      },
    },
    server: {
      proxy: {
        "/ormie-service": {
          target: env.VITE_API_PROXY_TARGET,
          changeOrigin: true,
        },
      },
    },
    optimizeDeps: {
      include: ["dayjs", "dayjs/plugin/localeData", "dayjs/plugin/weekday"],
    },
  };
});
