import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

const KakaoCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      axios
        .post(
          "http://localhost:8080/user-service/oauth/kakao",
          { code },
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          console.log("✅ 응답:", res.data);
          localStorage.setItem("token", res.data.accessToken);
          console.log("🔥 토큰 저장 완료, now navigating...");
          // navigate("/mountain");
          window.location.href = "/mountain"; // ← 얘로 바꿔서 테스트
        })

        .catch((err) => {
          console.error("❌ 로그인 실패:", err);
          console.log("❌ 응답 상세:", err.response?.data || err.message);
          navigate("/login");
        });
    }
  }, [searchParams, navigate]);

  return <div>로그인 처리 중...</div>;
};

export default KakaoCallback;
