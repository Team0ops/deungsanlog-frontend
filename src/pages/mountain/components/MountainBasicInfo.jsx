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
        console.log("⏳ userId 또는 mountainId 없음:", {
          userId,
          mountainId: mountain?.id,
        });
        return;
      }

      try {
        console.log("📡 즐겨찾기 상태 확인 API 호출:", {
          userId,
          mountainId: mountain.id,
        });

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
          console.error(
            "응답 오류:",
            error.response.status,
            error.response.data
          );
        } else if (error.request) {
          console.error("요청 오류:", error.request);
        } else {
          console.error("설정 오류:", error.message);
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
      currentFavorite: isFavorite,
    });

    setIsLoading(true);
    try {
      const token = getToken();

      console.log(
        "🔑 사용할 토큰:",
        token ? token.substring(0, 20) + "..." : "null"
      );

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
        console.error("토글 실패:", error.response.status, error.response.data);
        alert(`즐겨찾기 처리 실패: ${error.response.status}`);
      } else if (error.request) {
        console.error("요청 오류:", error.request);
        alert("서버에 연결할 수 없습니다.");
      } else {
        console.error("설정 오류:", error.message);
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
    paddingBottom: "clamp(0.8rem, 1.5vw, 1rem)",
  };

  // 산 이름과 즐겨찾기 버튼을 나란히 배치
  const titleContainerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "clamp(0.8rem, 2vw, 1.2rem)",
    marginBottom: "1.2rem",
  };

  const mountainNameStyle = {
    fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
    fontWeight: "700",
    color: "#2c3e50",
    margin: 0,
    flex: 1,
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };

  // 즐겨찾기 버튼 스타일 (pill형, 작고 심플, 노란색 강조)
  const favoriteButtonStyle = isFavorite
    ? {
        background: "#fff3cd",
        border: "1.5px solid #ffc107",
        color: "#bfa100",
        fontWeight: 700,
        fontSize: "1.05rem",
        borderRadius: "2em",
        padding: "0.45rem 1.2rem 0.45rem 0.9rem",
        cursor: isLoading ? "not-allowed" : "pointer",
        transition: "all 0.2s",
        opacity: isLoading ? 0.6 : 1,
        boxShadow: "0 2px 8px rgba(200,180,80,0.08)",
        display: "flex",
        alignItems: "center",
        gap: "0.4rem",
        outline: "none",
        minWidth: "unset",
        minHeight: "unset",
      }
    : {
        background: "none",
        border: "1.5px solid #ddd",
        color: "#888",
        fontWeight: 500,
        fontSize: "1.05rem",
        borderRadius: "2em",
        padding: "0.45rem 1.2rem 0.45rem 1.2rem",
        cursor: isLoading ? "not-allowed" : "pointer",
        transition: "all 0.2s",
        opacity: isLoading ? 0.6 : 1,
        boxShadow: "none",
        display: "flex",
        alignItems: "center",
        gap: "0.4rem",
        outline: "none",
        minWidth: "unset",
        minHeight: "unset",
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

  return (
    <header style={headerStyle}>
      <div>
        {/* 산 이름과 즐겨찾기 버튼 */}
        <div style={titleContainerStyle}>
          <h1 style={mountainNameStyle}>{mountain.name}</h1>
          {/* 즐겨찾기 버튼 */}
          <button
            style={favoriteButtonStyle}
            onClick={handleFavoriteToggle}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span style={{ fontSize: "1.1rem", marginRight: "0.3rem" }}>
                  ⏳
                </span>
                추가 중...
              </>
            ) : !userId ? (
              <>
                <span style={{ fontSize: "1.1rem", marginRight: "0.3rem" }}>
                  🔒
                </span>
                로그인 필요
              </>
            ) : isFavorite ? (
              <>
                <span style={{ fontSize: "1.2rem", marginRight: "0.3rem" }}>
                  🌟
                </span>
                즐겨찾는 산
              </>
            ) : (
              <>즐겨찾기 추가</>
            )}
          </button>
        </div>

        <div style={basicInfoStyle}>
          <span style={badgeStyle}>📍 {mountain.location}</span>
          <span style={badgeStyle}>⛰️ {mountain.elevation}m</span>
          <span style={badgeStyle}>
            🎯 {description?.difficulty || "정보 없음"}
          </span>
        </div>
      </div>
    </header>
  );
};

export default MountainBasicInfo;
