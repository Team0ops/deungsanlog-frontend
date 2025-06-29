import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  // iOS Safari 호환성을 위한 설정
  timeout: 30000, // 30초 타임아웃
  headers: {
    "Content-Type": "application/json",
    // iOS Safari에서 캐시 문제 방지
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
  },
});

// iOS Safari 특화 인터셉터 추가
axiosInstance.interceptors.request.use(
  (config) => {
    // iOS Safari에서 발생할 수 있는 문제 방지
    if (
      navigator.userAgent.includes("iPhone") ||
      navigator.userAgent.includes("iPad")
    ) {
      // iOS에서는 추가 헤더 설정
      config.headers["X-Requested-With"] = "XMLHttpRequest";

      // iOS Safari에서 CORS 문제 방지
      if (config.method === "post" || config.method === "put") {
        config.headers["Content-Type"] =
          config.headers["Content-Type"] || "application/json";
      }
    }

    console.log(`🌐 API 요청: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("❌ 요청 인터셉터 오류:", error);
    return Promise.reject(error);
  }
);

// 에러 처리 추가
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`✅ API 응답: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const isIOS =
      navigator.userAgent.includes("iPhone") ||
      navigator.userAgent.includes("iPad");

    // iOS Safari 특화 오류 처리
    if (isIOS) {
      console.log("📱 iOS Safari 오류 감지:", error.message);

      // 네트워크 연결 문제인 경우
      if (!navigator.onLine) {
        console.warn("📱 iOS: 오프라인 상태입니다");
        return Promise.reject(new Error("네트워크 연결을 확인해주세요"));
      }

      // CORS 오류인 경우
      if (
        error.message.includes("CORS") ||
        error.message.includes("cross-origin")
      ) {
        console.warn("📱 iOS: CORS 오류 발생");
        return Promise.reject(new Error("브라우저 설정을 확인해주세요"));
      }
    }

    switch (status) {
      case 400:
        console.warn("⚠️ 잘못된 요청입니다 (400)");
        break;
      case 401:
        console.warn("🔒 인증되지 않은 요청입니다 (401)");
        break;
      case 403:
        console.warn("⛔ 권한이 없습니다 (403)");
        break;
      case 404:
        console.warn("❓ 요청한 리소스를 찾을 수 없습니다 (404)");
        break;
      case 500:
        console.error("🔥 서버 오류 발생 (500)");
        break;
      default:
        console.error("🚨 알 수 없는 오류 발생:", error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
