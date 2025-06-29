import React, { useState, useEffect } from "react";
import { getUserInfo, getToken, requireAuth } from "shared/lib/auth";
import ProfileSection from "./components/ProfileSection";
import HikingStatsSection from "./components/HikingStatsSection";
import FavoriteSection from "./components/FavoriteSection";
import axiosInstance from "shared/lib/axiosInstance";

const MyPage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ 인증 확인 및 사용자 ID 추출
  useEffect(() => {
    // requireAuth 사용 - 인증 실패 시 자동 리다이렉트
    if (
      !requireAuth(
        "마이페이지를 이용하려면 로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?"
      )
    ) {
      return; // 인증 실패 시 함수 종료
    }

    // JWT에서 사용자 정보 추출
    const extractedUserInfo = getUserInfo();

    if (extractedUserInfo && extractedUserInfo.userId) {
      setUserId(extractedUserInfo.userId);
    } else {
      setError("사용자 ID를 확인할 수 없습니다.");
      setLoading(false);
    }
  }, []);

  // ✅ 사용자 정보 API 조회 (axios 방식으로 수정)
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!userId) {
        return;
      }

      try {
        const token = getToken();

        // ✅ axios 방식으로 수정
        const response = await axiosInstance.get(`/user-service/${userId}`, {
          headers: {
            "X-AUTH-TOKEN": token,
          },
        });

        setUserInfo(response.data);
        setError(null);
      } catch (error) {
        if (error.response) {
          // 서버 응답이 있는 경우 (4xx, 5xx)
          if (error.response.status === 401) {
            // 인증 오류 시 로그아웃 처리
            setError("인증이 만료되었습니다. 다시 로그인해주세요.");
          } else if (error.response.status === 404) {
            setError("사용자 정보를 찾을 수 없습니다.");
          } else {
            setError(`사용자 정보 조회 실패: ${error.response.status}`);
          }
        } else if (error.request) {
          // 요청은 전송되었으나 응답이 없는 경우
          setError("서버에 연결할 수 없습니다.");
        } else {
          // 기타 오류
          setError(`오류: ${error.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [userId]);

  if (loading) {
    return (
      <div style={loadingStyle}>
        <div>마이페이지를 불러오는 중...</div>
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
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div style={errorStyle}>
        <div>사용자 정보를 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
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

// 스타일 정의들 (기존과 동일)
const containerStyle = {
  width: "100%",
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "clamp(1rem, 3vw, 2rem)",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  minHeight: "100vh",
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
