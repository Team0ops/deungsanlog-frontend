import React, { useState, useEffect } from "react";
import { getToken, getUserInfo, isAuthenticated } from "shared/lib/auth"; // ✅ 인증 유틸 추가
import axiosInstance from "shared/lib/axiosInstance";

const MountainBasicInfo = ({ mountain, description }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  // ✅ 인증 유틸을 사용하여 사용자 정보 추출
  useEffect(() => {
    console.log("🔍 사용자 인증 정보 확인 시작");
    
    if (isAuthenticated()) {
      const userInfo = getUserInfo();
      console.log("👤 사용자 정보:", userInfo);
      
      if (userInfo && userInfo.userId) {
        setUserId(userInfo.userId);
        console.log("✅ userId 설정 완료:", userInfo.userId);
      } else {
        console.log("⚠️ JWT에서 userId를 추출할 수 없음");
      }
    } else {
      console.log("❌ 로그인하지 않은 사용자");
    }
  }, []);

  // ✅ 즐겨찾기 여부 확인 (axios 방식으로 수정)
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!userId || !mountain?.id) {
        console.log("⏳ userId 또는 mountainId 없음:", { userId, mountainId: mountain?.id });
        return;
      }

      try {
        console.log("📡 즐겨찾기 상태 확인 API 호출:", { userId, mountainId: mountain.id });
        
        const token = getToken();
        
        const response = await axiosInstance.get(
          `/user-service/${userId}/favorites/${mountain.id}/check`,
          {
            headers: { "X-AUTH-TOKEN": token },
          }
        );

        console.log("✅ 즐겨찾기 상태 확인 성공:", response.data);
        setIsFavorite(response.data.isFavorite);

      } catch (error) {
        console.error("❌ 즐겨찾기 상태 확인 오류:", error);
        
        if (error.response) {
          console.error('응답 오류:', error.response.status, error.response.data);
        } else if (error.request) {
          console.error('요청 오류:', error.request);
        } else {
          console.error('설정 오류:', error.message);
        }
      }
    };

    checkFavoriteStatus();
  }, [userId, mountain?.id]);

  // ✅ 즐겨찾기 토글 (axios 방식으로 수정)
  const handleFavoriteToggle = async () => {
    console.log("🚀 즐겨찾기 버튼 클릭됨!");

    // 로그인하지 않은 경우 로그인 페이지로 이동
    if (!userId) {
      console.log("❌ 사용자 로그인 안됨");
      if (
        window.confirm(
          "즐겨찾기 기능을 사용하려면 로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?"
        )
      ) {
        window.location.href = "/login";
      }
      return;
    }

    if (!mountain?.id || isLoading) {
      console.log("❌ 산 ID 없음 또는 로딩 중:", {
        mountainId: mountain?.id,
        isLoading,
      });
      return;
    }

    console.log("📡 즐겨찾기 토글 API 호출 시작:", {
      userId,
      mountainId: mountain.id,
      currentFavorite: isFavorite
    });

    setIsLoading(true);
    try {
      const token = getToken();

      console.log("🔑 사용할 토큰:", token ? token.substring(0, 20) + "..." : "null");

      // ✅ 올바른 경로로 수정 (/user-services/ → /user-service/)
      const response = await axiosInstance.post(
        `/user-service/${userId}/favorites/${mountain.id}/toggle`,
        {}, // POST body (비어있음)
        {
          headers: { "X-AUTH-TOKEN": token },
        }
      );

      console.log("✅ 즐겨찾기 토글 성공:", response.data);

      // ✅ axios에서는 response.data로 접근
      setIsFavorite(response.data.isAdded);

      // 성공 메시지 표시
      if (response.data.isAdded) {
        alert("즐겨찾기에 추가되었습니다! ⭐");
      } else {
        alert("즐겨찾기에서 삭제되었습니다.");
      }

    } catch (error) {
      console.error("❌ 즐겨찾기 토글 오류:", error);
      
      if (error.response) {
        console.error('토글 실패:', error.response.status, error.response.data);
        alert(`즐겨찾기 처리 실패: ${error.response.status}`);
      } else if (error.request) {
        console.error('요청 오류:', error.request);
        alert("서버에 연결할 수 없습니다.");
      } else {
        console.error('설정 오류:', error.message);
        alert("즐겨찾기 처리 중 오류가 발생했습니다.");
      }
    } finally {
      console.log("🏁 즐겨찾기 토글 완료");
      setIsLoading(false);
    }
  };

  if (!mountain) return null;

  const headerStyle = {
    marginBottom: "clamp(1rem, 2vw, 1.5rem)",
    borderBottom: "0.1rem solid #e0e0e0",
    paddingBottom: "clamp(0.8rem, 1.5vw, 1rem)",
  };

  // 산 이름과 즐겨찾기 버튼을 나란히 배치
  const titleContainerStyle = {
    display: "flex",
    alignItems: "center",
    gap: "clamp(0.8rem, 2vw, 1.2rem)",
    marginBottom: "clamp(0.3rem, 0.8vw, 0.5rem)",
  };

  const mountainNameStyle = {
    fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
    fontWeight: "700",
    color: "#2c3e50",
    margin: 0,
  };

  // 즐겨찾기 버튼 스타일
  const favoriteButtonStyle = {
    background: isFavorite ? "#fff3cd" : "#f8f9fa",
    border: "2px solid #ffc107",
    fontSize: "clamp(1.5rem, 3vw, 2rem)",
    cursor: isLoading ? "not-allowed" : "pointer",
    padding: "clamp(0.5rem, 1vw, 0.8rem)",
    borderRadius: "50%",
    transition: "all 0.2s ease",
    opacity: isLoading ? 0.6 : 1,
    transform: "scale(1)",
    minWidth: "clamp(2.5rem, 4vw, 3rem)",
    minHeight: "clamp(2.5rem, 4vw, 3rem)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  };

  const basicInfoStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: "clamp(0.5rem, 1vw, 0.8rem)",
    marginBottom: "clamp(0.8rem, 1.5vw, 1rem)",
    fontSize: "clamp(0.8rem, 1.3vw, 0.9rem)",
  };

  const badgeStyle = {
    backgroundColor: "#f8f9fa",
    padding: "clamp(0.3rem, 0.8vw, 0.5rem) clamp(0.6rem, 1.2vw, 0.8rem)",
    borderRadius: "0.4rem",
    border: "0.1rem solid #dee2e6",
    color: "#495057",
  };

  const summaryBoxStyle = {
    backgroundColor: "#ffffff",
    borderRadius: "1rem",
    padding: "clamp(1rem, 2vw, 1.5rem)",
    boxShadow: "0 0.2rem 1rem rgba(0,0,0,0.1)",
    marginTop: "clamp(1rem, 2vw, 1.5rem)",
  };

  const summaryGridStyle = {
    display: "grid",
    gap: "clamp(0.5rem, 1vw, 0.8rem)",
  };

  const summaryItemStyle = {
    display: "grid",
    gridTemplateColumns: "1fr 2fr",
    alignItems: "center",
    padding: "clamp(0.3rem, 0.8vw, 0.5rem) 0",
    borderBottom: "0.1rem solid #f1f3f4",
  };

  return (
    <header style={headerStyle}>
      {/* ✅ 디버깅 정보 (개발용) */}
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '5px',
        fontSize: '10px',
        borderRadius: '3px',
        zIndex: 1000
      }}>
        <div>🔍 Debug:</div>
        <div>userId: {userId || '없음'}</div>
        <div>mountainId: {mountain?.id || '없음'}</div>
        <div>즐겨찾기: {isFavorite ? '★' : '☆'}</div>
        <div>토큰: {getToken() ? '있음' : '없음'}</div>
      </div>

      <div>
        {/* 산 이름과 즐겨찾기 버튼 */}
        <div style={titleContainerStyle}>
          <h1 style={mountainNameStyle}>{mountain.name}</h1>
          {/* 즐겨찾기 버튼 */}
          <button
            style={favoriteButtonStyle}
            onClick={handleFavoriteToggle}
            disabled={isLoading}
            title={
              !userId
                ? "로그인 후 즐겨찾기 사용 가능"
                : isFavorite
                ? "즐겨찾기 해제"
                : "즐겨찾기 추가"
            }
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.target.style.transform = "scale(1.1)";
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "scale(1)";
            }}
          >
            {isLoading ? "⏳" : !userId ? "🔒" : isFavorite ? "★" : "☆"}
          </button>
        </div>

        <div style={basicInfoStyle}>
          <span style={badgeStyle}>📍 {mountain.location}</span>
          <span style={badgeStyle}>⛰️ {mountain.elevation}m</span>
          <span style={badgeStyle}>
            🎯 {description?.difficulty || "정보 없음"}
          </span>
        </div>

        {/* 산 요약 정보 */}
        <div style={summaryBoxStyle}>
          <h3
            style={{
              fontSize: "clamp(1.1rem, 2vw, 1.3rem)",
              marginBottom: "clamp(1rem, 2vw, 1.5rem)",
            }}
          >
            산 요약
          </h3>
          <div style={summaryGridStyle}>
            <div style={summaryItemStyle}>
              <span style={{ fontWeight: "600", color: "#495057" }}>
                산 이름:
              </span>
              <span>{mountain.name}</span>
            </div>
            <div style={summaryItemStyle}>
              <span style={{ fontWeight: "600", color: "#495057" }}>위치:</span>
              <span>{mountain.location}</span>
            </div>
            <div style={summaryItemStyle}>
              <span style={{ fontWeight: "600", color: "#495057" }}>고도:</span>
              <span>{mountain.elevation}m</span>
            </div>
            <div style={summaryItemStyle}>
              <span style={{ fontWeight: "600", color: "#495057" }}>
                난이도:
              </span>
              <span>{description?.difficulty || "정보 없음"}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default MountainBasicInfo;