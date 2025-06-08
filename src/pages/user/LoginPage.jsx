const KAKAO_CLIENT_ID = "370ccf13b865a87e27f75286111f761e";
const REDIRECT_URI = "http://localhost:5173/oauth/kakao/callback";
const LOGOUT_REDIRECT_URI = "http://localhost:5173/login";

const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;

// ✅ 진짜 로그아웃 URL (accounts.kakao.com까지 포함)
const realKakaoLogoutUrl = `https://accounts.kakao.com/logout?continue=${encodeURIComponent(
  `https://kauth.kakao.com/oauth/logout?client_id=${KAKAO_CLIENT_ID}&logout_redirect_uri=${LOGOUT_REDIRECT_URI}`
)}`;

const LoginPage = () => {
  const handleLogin = () => {
    window.location.href = kakaoAuthUrl;
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // 내 앱 로그아웃
    window.location.href = realKakaoLogoutUrl; // 카카오 계정 + OAuth 세션 모두 로그아웃
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>로그인</h2>
      <button
        onClick={handleLogin}
        style={{ marginRight: "10px", padding: "10px 20px" }}
      >
        카카오 로그인
      </button>
      <button
        onClick={handleLogout}
        style={{ padding: "10px 20px", backgroundColor: "#ddd" }}
      >
        로그아웃
      </button>
    </div>
  );
};

export default LoginPage;
