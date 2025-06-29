import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WelcomePopup from "shared/components/WelcomePopup";
import axiosInstance from "shared/lib/axiosInstance";

const LoginPage = () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [loading, setLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState(null);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  // 페이지 로드 시 URL에서 토큰 체크 (OAuth 콜백 처리)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const error = urlParams.get("error");

    if (token) {
      // 토큰이 있으면 저장하고 환영 팝업 표시
      localStorage.setItem("X-AUTH-TOKEN", token);
      console.log("로그인 성공! 토큰 저장됨");

      // 사용자 정보에서 userId 추출하고 닉네임 가져오기
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const userId =
          payload.userId || payload.id || payload.sub || payload.user_id;

        if (userId) {
          // API에서 사용자 정보 가져오기
          axiosInstance
            .get(`/user-service/${userId}`, {
              headers: { "X-AUTH-TOKEN": token },
            })
            .then((response) => {
              const nickname = response.data.nickname || "등산러";
              setUserName(nickname);
              setShowWelcomePopup(true);
            })
            .catch((error) => {
              console.error("사용자 정보 조회 실패:", error);
              setUserName("등산러");
              setShowWelcomePopup(true);
            });
        } else {
          setUserName("등산러");
          setShowWelcomePopup(true);
        }
      } catch (error) {
        console.error("사용자 정보 추출 실패:", error);
        setUserName("등산러");
        setShowWelcomePopup(true);
      }

      // URL 파라미터 제거
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (error) {
      // 에러가 있으면 알림
      alert("로그인 실패: " + error);
      // URL 파라미터 제거
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [navigate, showWelcomePopup]);

  // 환영 팝업이 표시된 후 5초 타이머 시작
  useEffect(() => {
    if (showWelcomePopup) {
      const timer = setTimeout(() => {
        setShowWelcomePopup(false);
        navigate("/mountain");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [showWelcomePopup, navigate]);

  const handleWelcomeClose = () => {
    setShowWelcomePopup(false);
    navigate("/mountain");
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    setLoadingProvider("google");
    window.location.href = `${BASE_URL}/auth/google`; // 환경별 자동 적용
  };

  const handleNaverLogin = () => {
    setLoading(true);
    setLoadingProvider("naver");
    window.location.href = `${BASE_URL}/auth/naver`; // 환경별 자동 적용
  };

  const handleKakaoLogin = () => {
    setLoading(true);
    setLoadingProvider("kakao");
    window.location.href = `${BASE_URL}/auth/kakao`; // 환경별 자동 적용
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          padding: "2rem",
          minHeight: 0, // 전체화면 아님
          height: "auto", // 전체화면 아님
        }}
      >
        {/* 메인 로그인 영역 */}
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            padding: "clamp(2rem, 4vw, 3.5rem)",
            borderRadius: "clamp(1rem, 2vw, 1.5rem)",
            boxShadow: "0 0.5rem 2rem rgba(0, 0, 0, 0.15)",
            textAlign: "center",
            width: "clamp(25rem, 90vw, 35rem)",
            maxWidth: "90vw",
            backdropFilter: "blur(0.625rem)",
          }}
        >
          {/* 로고 */}
          <div
            style={{
              marginBottom: "clamp(1.5rem, 4vw, 2rem)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src="/images/logo_mountain.png"
              alt="등산로그 로고"
              style={{
                width: "clamp(4rem, 8vw, 6rem)",
                height: "auto",
                marginBottom: "1rem",
              }}
            />
          </div>

          <p
            style={{
              marginBottom: "clamp(0.5rem, 2vw, 1rem)",
              color: "#7f8c8d",
              fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)",
              lineHeight: "1.5",
              margin: "0 auto",
              maxWidth: "80%",
              whiteSpace: "pre-line",
            }}
          >
            등산 이야기에 오신 것을{"\n"}환영합니다.
          </p>
          <p
            style={{
              marginBottom: "clamp(4rem, 8vw, 5rem)",
              color: "#7f8c8d",
              fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)",
              lineHeight: "1.5",
              margin: "0 auto",
              maxWidth: "80%",
              whiteSpace: "pre-line",
            }}
          >
            소셜 로그인으로 간편하게 시작해보세요!
          </p>

          {/* 구글 로그인 버튼 */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            style={{
              width: "100%",
              padding: "clamp(0.8rem, 2vw, 1.2rem) clamp(1rem, 3vw, 1.5rem)",
              backgroundColor:
                loading && loadingProvider === "google" ? "#95a5a6" : "#4285f4",
              color: "white",
              border: "none",
              borderRadius: "clamp(0.5rem, 1vw, 0.75rem)",
              fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "clamp(0.5rem, 1.5vw, 0.8rem)",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.1)",
              minHeight: "3rem",
              marginBottom: "clamp(0.8rem, 2vw, 1rem)",
            }}
            onMouseOver={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = "#3367d6";
                e.target.style.transform = "translateY(-0.125rem)";
              }
            }}
            onMouseOut={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = "#4285f4";
                e.target.style.transform = "translateY(0)";
              }
            }}
          >
            <svg
              width="clamp(1.2rem, 3vw, 1.5rem)"
              height="clamp(1.2rem, 3vw, 1.5rem)"
              viewBox="0 0 24 24"
              style={{ flexShrink: 0 }}
            >
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span style={{ whiteSpace: "nowrap" }}>
              {loading && loadingProvider === "google"
                ? "Google 로그인 중..."
                : "Google로 로그인"}
            </span>
          </button>

          {/* 네이버 로그인 버튼 */}
          <button
            type="button"
            onClick={handleNaverLogin}
            disabled={loading}
            style={{
              width: "100%",
              padding: "clamp(0.8rem, 2vw, 1.2rem) clamp(1rem, 3vw, 1.5rem)",
              backgroundColor:
                loading && loadingProvider === "naver" ? "#95a5a6" : "#03C75A",
              color: "white",
              border: "none",
              borderRadius: "clamp(0.5rem, 1vw, 0.75rem)",
              fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "clamp(0.5rem, 1.5vw, 0.8rem)",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.1)",
              minHeight: "3rem",
              marginBottom: "clamp(0.8rem, 2vw, 1rem)",
            }}
            onMouseOver={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = "#02B651";
                e.target.style.transform = "translateY(-0.125rem)";
              }
            }}
            onMouseOut={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = "#03C75A";
                e.target.style.transform = "translateY(0)";
              }
            }}
          >
            {/* 네이버 로고 (N 아이콘) */}
            <div
              style={{
                width: "clamp(1.2rem, 3vw, 1.5rem)",
                height: "clamp(1.2rem, 3vw, 1.5rem)",
                backgroundColor: "white",
                borderRadius: "clamp(0.1rem, 0.2vw, 0.15rem)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  color: "#03C75A",
                  fontWeight: "bold",
                  fontSize: "clamp(0.8rem, 2vw, 1rem)",
                }}
              >
                N
              </span>
            </div>
            <span style={{ whiteSpace: "nowrap" }}>
              {loading && loadingProvider === "naver"
                ? "네이버 로그인 중..."
                : "네이버로 로그인"}
            </span>
          </button>

          {/* 카카오 로그인 버튼 */}
          <button
            type="button"
            onClick={handleKakaoLogin}
            disabled={loading}
            style={{
              width: "100%",
              padding: "clamp(0.8rem, 2vw, 1.2rem) clamp(1rem, 3vw, 1.5rem)",
              backgroundColor:
                loading && loadingProvider === "kakao" ? "#95a5a6" : "#FEE500",
              color:
                loading && loadingProvider === "kakao" ? "white" : "#000000",
              border: "none",
              borderRadius: "clamp(0.5rem, 1vw, 0.75rem)",
              fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "clamp(0.5rem, 1.5vw, 0.8rem)",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.1)",
              minHeight: "3rem",
            }}
            onMouseOver={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = "#FFD700";
                e.target.style.transform = "translateY(-0.125rem)";
              }
            }}
            onMouseOut={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = "#FEE500";
                e.target.style.transform = "translateY(0)";
              }
            }}
          >
            {/* 카카오 로고 */}
            <svg
              width="clamp(1.2rem, 3vw, 1.5rem)"
              height="clamp(1.2rem, 3vw, 1.5rem)"
              viewBox="0 0 24 24"
              style={{ flexShrink: 0 }}
            >
              <path
                fill="currentColor"
                d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3Z"
              />
            </svg>
            <span style={{ whiteSpace: "nowrap" }}>
              {loading && loadingProvider === "kakao"
                ? "카카오 로그인 중..."
                : "카카오로 로그인"}
            </span>
          </button>

          {loading && (
            <div
              style={{
                marginTop: "clamp(1rem, 3vw, 1.5rem)",
                color: "#7f8c8d",
                fontSize: "clamp(0.8rem, 2vw, 0.9rem)",
                lineHeight: "1.4",
              }}
            >
              잠시만 기다려주세요...
            </div>
          )}
        </div>
      </div>

      {/* 환영 팝업 */}
      <WelcomePopup
        isOpen={showWelcomePopup}
        onClose={handleWelcomeClose}
        userName={userName}
      />
    </>
  );
};

export default LoginPage;
