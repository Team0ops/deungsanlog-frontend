import React, { useState, useEffect } from "react";
import {
  getUserInfo,
  getToken,
  isAuthenticated,
  requireAuth,
} from "shared/lib/auth"; // ✅ 추가
import ProfileSection from "./components/ProfileSection";
import HikingStatsSection from "./components/HikingStatsSection";
import FavoriteSection from "./components/FavoriteSection";
import axiosInstance from "shared/lib/axiosInstance";

const MyPage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ 기존 인증 확인 로직을 requireAuth로 교체
  useEffect(() => {
    console.log("🔍 MyPage 인증 확인 시작");

    // ✅ requireAuth 사용 - alert 창으로 확인
    if (
      !requireAuth(
        "마이페이지를 이용하려면 로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?"
      )
    ) {
      return; // 인증 실패 시 함수 종료 (requireAuth가 리다이렉트 처리)
    }

    // JWT에서 사용자 정보 추출
    const extractedUserInfo = getUserInfo();
    console.log("👤 추출된 사용자 정보:", extractedUserInfo);

    if (extractedUserInfo && extractedUserInfo.userId) {
      setUserId(extractedUserInfo.userId);
    } else {
      console.error("❌ JWT에서 userId를 찾을 수 없습니다");
      setError("사용자 ID를 확인할 수 없습니다.");
      setLoading(false);
    }
  }, []);

  // ✅ 사용자 정보 조회 (API 호출)
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!userId) {
        console.log("⏳ userId가 없어서 사용자 정보 조회 대기 중...");
        return;
      }

      try {
        const token = getToken(); // ✅ 인증 유틸 사용

        console.log("📡 사용자 정보 API 호출:", `userId=${userId}`);

        const response = await axiosInstance.get(
          `/user-service/api/users/${userId}`,
          {
            headers: {
              "X-AUTH-TOKEN": token,
            },
          }
        );

        console.log("📡 사용자 정보 API 응답:", response.status);

        if (response.ok) {
          const data = await response.json();
          console.log("✅ 사용자 정보 조회 성공:", data);
          setUserInfo(data);
        } else {
          const errorText = await response.text();
          console.error(
            "❌ 사용자 정보 조회 실패:",
            response.status,
            errorText
          );
          setError("사용자 정보를 불러올 수 없습니다.");
        }
      } catch (error) {
        console.error("❌ 사용자 정보 조회 오류:", error);
        setError("사용자 정보 조회 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [userId]);

  // 🔍 디버깅 정보 표시
  const debugInfo = {
    userId,
    userInfo: userInfo ? { id: userInfo.id, email: userInfo.email } : null,
    loading,
    error,
    isAuth: isAuthenticated(),
    hasToken: !!getToken(),
  };

  if (loading) {
    return (
      <div style={loadingStyle}>
        <div>마이페이지를 불러오는 중...</div>
        <div style={{ fontSize: "0.8rem", color: "#999", marginTop: "1rem" }}>
          Debug: {JSON.stringify(debugInfo)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={errorStyle}>
        <div>{error}</div>
        <button
          onClick={() => (window.location.href = "/login")}
          style={loginButtonStyle}
        >
          로그인하러 가기
        </button>
        <details
          style={{ marginTop: "1rem", fontSize: "0.8rem", color: "#666" }}
        >
          <summary>디버깅 정보</summary>
          <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
        </details>
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div style={errorStyle}>
        <div>사용자 정보를 찾을 수 없습니다.</div>
        <div style={{ fontSize: "0.8rem", color: "#999", marginTop: "1rem" }}>
          Debug: {JSON.stringify(debugInfo)}
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {/* 🔍 디버깅 정보 (개발용) */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          background: "rgba(0,0,0,0.8)",
          color: "white",
          padding: "10px",
          fontSize: "12px",
          zIndex: 9999,
          maxWidth: "300px",
        }}
      >
        <div>🔍 Debug Info:</div>
        <div>userId: {userId}</div>
        <div>userInfo.id: {userInfo?.id}</div>
        <div>토큰: {getToken() ? "존재" : "없음"}</div>
        <div>인증: {isAuthenticated() ? "유효" : "무효"}</div>
      </div>

      {/* 페이지 헤더 */}
      <header style={headerStyle}>
        <h1 style={titleStyle}>마이페이지</h1>
        <p style={subtitleStyle}>{userInfo.nickname}님의 등산 이야기</p>
      </header>

      {/* 메인 컨텐츠 */}
      <main style={mainContentStyle}>
        {/* 1. 프로필 관리 섹션 */}
        <ProfileSection userInfo={userInfo} setUserInfo={setUserInfo} />

        {/* 2. 등산 통계 대시보드 */}
        <HikingStatsSection userId={userId} />

        {/* 3. 즐겨찾기 관리 */}
        <FavoriteSection userId={userId} />

        {/* 4. 커뮤니티 활동 현황 (추후 구현) */}
        <div style={comingSoonSectionStyle}>
          <h2 style={sectionTitleStyle}>📝 커뮤니티 활동</h2>
          <div style={comingSoonContentStyle}>
            <span>🚧 준비 중입니다</span>
            <p>게시글, 댓글, 좋아요 통계가 여기에 표시됩니다.</p>
          </div>
        </div>

        {/* 5. 모임 참여 현황 (추후 구현) */}
        <div style={comingSoonSectionStyle}>
          <h2 style={sectionTitleStyle}>👥 모임 활동</h2>
          <div style={comingSoonContentStyle}>
            <span>🚧 준비 중입니다</span>
            <p>참여한 모임, 주최한 모임 정보가 여기에 표시됩니다.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

// 스타일 정의 (기존과 동일)
const containerStyle = {
  width: "100%",
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "clamp(1rem, 3vw, 2rem)",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  minHeight: "100vh",
};

const headerStyle = {
  textAlign: "center",
  marginBottom: "clamp(2rem, 4vw, 3rem)",
  paddingBottom: "clamp(1rem, 2vw, 1.5rem)",
  borderBottom: "0.1rem solid #e0e0e0",
};

const titleStyle = {
  fontSize: "clamp(2rem, 5vw, 3rem)",
  fontWeight: "700",
  color: "#2c3e50",
  marginBottom: "clamp(0.5rem, 1vw, 0.8rem)",
};

const subtitleStyle = {
  fontSize: "clamp(1rem, 2vw, 1.2rem)",
  color: "#6c757d",
  fontWeight: "400",
};

const mainContentStyle = {
  display: "grid",
  gap: "clamp(2rem, 4vw, 3rem)",
};

const comingSoonSectionStyle = {
  backgroundColor: "#ffffff",
  borderRadius: "1rem",
  padding: "clamp(1.5rem, 3vw, 2rem)",
  boxShadow: "0 0.2rem 1rem rgba(0,0,0,0.1)",
  border: "0.1rem solid #e9ecef",
};

const sectionTitleStyle = {
  fontSize: "clamp(1.3rem, 2.5vw, 1.5rem)",
  fontWeight: "600",
  color: "#2c3e50",
  marginBottom: "clamp(1rem, 2vw, 1.5rem)",
};

const comingSoonContentStyle = {
  textAlign: "center",
  padding: "clamp(2rem, 4vw, 3rem)",
  color: "#6c757d",
};

const loadingStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  height: "50vh",
  fontSize: "clamp(1rem, 2vw, 1.2rem)",
  color: "#666",
};

const errorStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  height: "50vh",
  fontSize: "clamp(1rem, 2vw, 1.2rem)",
  color: "#e74c3c",
  gap: "1rem",
};

const loginButtonStyle = {
  padding: "0.8rem 1.5rem",
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "0.5rem",
  cursor: "pointer",
  fontSize: "clamp(0.9rem, 1.5vw, 1rem)",
};

export default MyPage;
