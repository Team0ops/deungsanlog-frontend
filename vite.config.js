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
        // ✅ 커스텀 SW 사용
        strategies: 'injectManifest',
        srcDir: 'public',
        filename: 'sw.js',
        
        // ✅ 자동 업데이트 유지
        registerType: "autoUpdate",
        
        // ✅ 정적 파일들 + manifest.json 포함
        includeAssets: [
          "favicon.svg", 
          "robots.txt", 
          "apple-touch-icon.png", 
          "manifest.json"  // ← 기존 manifest.json 사용
        ],
        
        // ✅ manifest 설정 제거 (manifest.json 사용)
        // manifest: { ... } ← 삭제됨
        
        // ✅ workbox 설정 제거 (sw.js에서 처리)
        // workbox: { ... } ← 삭제됨
        
        // ✅ 커스텀 SW 설정
        injectManifest: {
          injectionPoint: undefined
        }
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