import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// 에러 처리 추가
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

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
