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
          short_name: "등산이야기",
          description: "등산 기록과 모임을 위한 플랫폼",
          theme_color: "#ffffff",
        },
        workbox: {
          // 🔥 API 경로는 SW가 처리하지 않도록 제외
          navigateFallbackDenylist: [
            /^\/auth/, // /auth로 시작하는 모든 경로
            /^\/api/, // /api로 시작하는 모든 경로 (추가 보안)
            /^\/community-service/, // 커뮤니티 서비스
            /^\/record-service/, // 기록 서비스
            /^\/user-service/, // 유저 서비스
            /^\/meeting-service/, // 모임 서비스
            /^\/mountain-service/, // 산 서비스
            /^\/notification-service/, // 알림 서비스
            /^\/ormie-service/, // 오르미 서비스
          ],
          // iOS Safari 호환성을 위한 추가 설정
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/.*\/api\/.*/,
              handler: "NetworkOnly", // API 요청은 항상 네트워크에서 가져오기
              options: {
                cacheName: "api-cache",
                expiration: {
                  maxEntries: 0, // 캐시하지 않음
                },
              },
            },
            {
              urlPattern: /^https:\/\/.*\/community-service\/.*/,
              handler: "NetworkOnly",
              options: {
                cacheName: "community-api-cache",
                expiration: {
                  maxEntries: 0,
                },
              },
            },
            {
              urlPattern: /^https:\/\/.*\/record-service\/.*/,
              handler: "NetworkOnly",
              options: {
                cacheName: "record-api-cache",
                expiration: {
                  maxEntries: 0,
                },
              },
            },
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
