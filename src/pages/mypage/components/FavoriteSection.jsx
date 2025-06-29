import React, { useState, useEffect } from "react";
import { getToken } from "shared/lib/auth";
import axiosInstance from "shared/lib/axiosInstance";

const FavoriteSection = ({ userId }) => {
  const [favoriteMountains, setFavoriteMountains] = useState([]);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removingId, setRemovingId] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);

  // 즐겨찾기 데이터 조회
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!userId) {
        console.log("⏳ userId가 없어서 즐겨찾기 조회 대기 중...");
        return;
      }

      try {
        console.log("⭐ 즐겨찾기 조회 시작:", userId);

        const token = getToken();
        if (!token) {
          setError("로그인이 필요합니다.");
          setLoading(false);
          return;
        }

        // ✅ axios 방식으로 수정 - Promise.all 사용
        const [idsResponse, countResponse] = await Promise.all([
          axiosInstance.get(`/user-service/${userId}/favorites/ids`, {
            headers: { "X-AUTH-TOKEN": token },
          }),
          axiosInstance.get(`/user-service/${userId}/favorites/count`, {
            headers: { "X-AUTH-TOKEN": token },
          }),
        ]);

        console.log("✅ 즐겨찾기 API 응답:", {
          ids: idsResponse.status,
          count: countResponse.status,
        });

        // ✅ axios는 .data로 접근
        const mountainIds = idsResponse.data.favoriteIds || [];
        const count = countResponse.data.count || 0;

        setFavoriteCount(count);
        console.log("📊 즐겨찾기 통계:", {
          count,
          mountainIds: mountainIds.length,
        });

        // 산 상세 정보 조회
        if (mountainIds.length > 0) {
          await fetchMountainDetails(mountainIds);
        } else {
          setFavoriteMountains([]);
        }
      } catch (error) {
        console.error("❌ 즐겨찾기 조회 오류:", error);

        if (error.response) {
          console.error(
            "응답 오류:",
            error.response.status,
            error.response.data
          );
          setError(`즐겨찾기 조회 실패: ${error.response.status}`);
        } else if (error.request) {
          console.error("요청 오류:", error.request);
          setError("서버에 연결할 수 없습니다.");
        } else {
          console.error("설정 오류:", error.message);
          setError(`오류: ${error.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [userId]);

  // ✅ 산 상세 정보 배치 조회 - 실시간 정보 포함 (2단계 조회)
  const fetchMountainDetails = async (mountainIds) => {
    try {
      console.log("🏔️ 산 상세 정보 조회 시작:", mountainIds.length, "개");

      const mountainPromises = mountainIds.map(async (mountainId) => {
        try {
          console.log(`🔍 1단계: mountainId로 기본 정보 조회 - ${mountainId}`);

          // ✅ 1단계: mountainId로 기본 산 정보 조회
          const basicResponse = await axiosInstance.get(
            `/mountain-service/${mountainId}`
          );
          const basicMountain = basicResponse.data;

          if (!basicMountain || !basicMountain.name) {
            console.log(`❌ 기본 정보 없음: ${mountainId}`);
            return null;
          }

          console.log(`✅ 1단계 성공: ${basicMountain.name}`);
          console.log(
            `🔍 2단계: 실시간 정보 조회 시작 - ${basicMountain.name}`
          );

          // ✅ 2단계: 산 이름으로 실시간 정보 포함 상세 조회
          const detailResponse = await axiosInstance.get(
            "/mountain-service/search",
            {
              params: { name: basicMountain.name },
            }
          );

          console.log(`✅ 2단계 성공: ${basicMountain.name} 실시간 정보 포함`);
          console.log("실시간 정보:", {
            sunInfo: !!detailResponse.data.sunInfo,
            fireRiskInfo: !!detailResponse.data.fireRiskInfo,
          });

          // ✅ 기본 정보 + 실시간 정보 결합
          return {
            ...basicMountain,
            sunInfo: detailResponse.data.sunInfo,
            fireRiskInfo: detailResponse.data.fireRiskInfo,
            description: detailResponse.data.description,
            weatherInfo: detailResponse.data.weatherInfo,
          };
        } catch (error) {
          console.error(`❌ 산 정보 조회 실패: ${mountainId}`, error);

          // ✅ fallback: 기본 정보만이라도 조회
          try {
            console.log(`🔄 fallback: 기본 정보만 조회 - ${mountainId}`);
            const fallbackResponse = await axiosInstance.get(
              `/mountain-service/${mountainId}`
            );
            return fallbackResponse.data;
          } catch (fallbackError) {
            console.error(`❌ fallback도 실패: ${mountainId}`, fallbackError);
            return null;
          }
        }
      });

      const mountains = await Promise.all(mountainPromises);
      const validMountains = mountains.filter((mountain) => mountain !== null);

      console.log("✅ 산 정보 조회 완료:", validMountains.length, "개");
      console.log(
        "실시간 정보 포함된 산:",
        validMountains.filter((m) => m.sunInfo || m.fireRiskInfo).length,
        "개"
      );
      setFavoriteMountains(validMountains);
    } catch (error) {
      console.error("❌ 산 정보 배치 조회 오류:", error);
    }
  };

  // ✅ 즐겨찾기 삭제 - axios 방식으로 수정
  const handleRemoveFavorite = async (mountainId, mountainName) => {
    if (
      !window.confirm(`'${mountainName}'을(를) 즐겨찾기에서 삭제하시겠습니까?`)
    ) {
      return;
    }

    setRemovingId(mountainId);
    try {
      const token = getToken();

      console.log("🗑️ 즐겨찾기 삭제 시도:", {
        userId,
        mountainId,
        mountainName,
      });

      await axiosInstance.delete(
        `/user-service/${userId}/favorites/${mountainId}`,
        {
          headers: { "X-AUTH-TOKEN": token },
        }
      );

      console.log("✅ 즐겨찾기 삭제 성공");

      // UI 업데이트
      setFavoriteMountains((prev) =>
        prev.filter((mountain) => mountain.id !== mountainId)
      );
      setFavoriteCount((prev) => prev - 1);
      alert("즐겨찾기에서 삭제되었습니다.");
    } catch (error) {
      console.error("❌ 즐겨찾기 삭제 오류:", error);

      if (error.response) {
        console.error("삭제 실패:", error.response.status, error.response.data);
        alert(`즐겨찾기 삭제 실패: ${error.response.status}`);
      } else {
        alert("즐겨찾기 삭제 중 오류가 발생했습니다.");
      }
    } finally {
      setRemovingId(null);
    }
  };

  // ✅ 산 상세 페이지로 이동 (산 이름 클릭용)
  const handleMountainClick = (mountainName) => {
    console.log("🔍 산 상세 페이지로 이동:", mountainName);
    window.location.href = `/mountain/detail/${encodeURIComponent(
      mountainName
    )}`;
  };

  // ✅ 산불위험도에 따른 색상 반환
  const getFireRiskColor = (riskCode) => {
    switch (riskCode) {
      case "1":
        return "#d4edda"; // 안전 - 초록
      case "2":
        return "#fff3cd"; // 주의 - 노랑
      case "3":
        return "#f8d7da"; // 경보 - 빨강
      default:
        return "#e2e3e5";
    }
  };

  if (loading) {
    return (
      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>⭐ 즐겨찾기 관리</h2>
        <div style={loadingStyle}>
          <span>⭐ 즐겨찾기를 불러오는 중...</span>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>⭐ 즐겨찾기 관리</h2>
        <div style={errorStyle}>
          <span>❌ {error}</span>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: "1rem",
              padding: "0.5rem 1rem",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "0.3rem",
              cursor: "pointer",
            }}
          >
            🔄 다시 시도
          </button>
        </div>
      </section>
    );
  }

  return (
    <section style={sectionStyle}>
      <div style={headerStyle}>
        <h2 style={sectionTitleStyle}>⭐ 즐겨찾기 관리</h2>
        <div style={countBadgeStyle}>총 {favoriteCount}개의 산</div>
      </div>

      {favoriteMountains.length > 0 ? (
        <div style={favoritesListStyle}>
          {favoriteMountains.map((mountain) => (
            <div
              key={mountain.id}
              style={{
                ...favoriteItemStyle,
                transform:
                  hoveredCard === mountain.id
                    ? "translateY(-2px)"
                    : "translateY(0)",
                boxShadow:
                  hoveredCard === mountain.id
                    ? "0 4px 16px rgba(76, 117, 89, 0.15)"
                    : "0 2px 8px rgba(0,0,0,0.06)",
                borderColor:
                  hoveredCard === mountain.id ? "#4c7559" : "#e8f5e8",
              }}
              onMouseEnter={() => setHoveredCard(mountain.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* ✅ 산 정보 - 클릭 가능 */}
              <div
                style={{
                  ...mountainInfoClickableStyle,
                  backgroundColor: "transparent",
                  cursor: "default",
                }}
              >
                <h3
                  style={{
                    ...mountainNameClickableStyle,
                    color: hoveredCard === mountain.id ? "#4c7559" : "#2c3e50",
                  }}
                >
                  {mountain.name}
                </h3>

                <div style={mountainDetailsStyle}>
                  <span
                    style={{
                      ...detailItemStyle,
                      backgroundColor:
                        hoveredCard === mountain.id ? "#e9ecef" : "#f8f9fa",
                      transform:
                        hoveredCard === mountain.id
                          ? "scale(1.02)"
                          : "scale(1)",
                    }}
                  >
                    📍 {mountain.location}
                  </span>
                  <span
                    style={{
                      ...detailItemStyle,
                      backgroundColor:
                        hoveredCard === mountain.id ? "#e9ecef" : "#f8f9fa",
                      transform:
                        hoveredCard === mountain.id
                          ? "scale(1.02)"
                          : "scale(1)",
                    }}
                  >
                    ⛰️ {mountain.elevation}m
                  </span>

                  {/* ✅ 산불위험도 정보 추가 */}
                  {mountain.fireRiskInfo && !mountain.fireRiskInfo.error && (
                    <span
                      style={{
                        ...detailItemStyle,
                        backgroundColor: getFireRiskColor(
                          mountain.fireRiskInfo.riskLevelCode
                        ),
                        fontWeight: "600",
                        transform:
                          hoveredCard === mountain.id
                            ? "scale(1.02)"
                            : "scale(1)",
                      }}
                    >
                      🔥 {mountain.fireRiskInfo.riskLevel}
                    </span>
                  )}
                </div>
              </div>

              {/* 버튼 영역 */}
              <div
                style={{ display: "flex", gap: "0.8rem", alignItems: "center" }}
              >
                {/* 상세보기 버튼 */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // 클릭 이벤트 버블링 방지
                    handleMountainClick(mountain.name);
                  }}
                  onMouseEnter={() => setHoveredButton(`detail-${mountain.id}`)}
                  onMouseLeave={() => setHoveredButton(null)}
                  style={{
                    backgroundColor:
                      hoveredButton === `detail-${mountain.id}`
                        ? "#4c7559"
                        : "#b1ccbd",
                    color: "#133313",
                    border: "none",
                    borderRadius: "0.8rem",
                    padding:
                      "clamp(0.6rem, 1.2vw, 0.8rem) clamp(1rem, 2vw, 1.2rem)",
                    fontSize: "clamp(0.8rem, 1.4vw, 0.9rem)",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    minWidth: "clamp(4rem, 7vw, 5rem)",
                    boxShadow:
                      hoveredButton === `detail-${mountain.id}`
                        ? "0 4px 8px rgba(76, 117, 89, 0.3)"
                        : "0 2px 4px rgba(108, 117, 125, 0.2)",
                    transform:
                      hoveredButton === `detail-${mountain.id}`
                        ? "scale(1.05)"
                        : "scale(1)",
                  }}
                >
                  상세보기
                </button>

                {/* 삭제 버튼 */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // 클릭 이벤트 버블링 방지
                    handleRemoveFavorite(mountain.id, mountain.name);
                  }}
                  disabled={removingId === mountain.id}
                  onMouseEnter={() => setHoveredButton(`delete-${mountain.id}`)}
                  onMouseLeave={() => setHoveredButton(null)}
                  style={{
                    ...removeButtonStyle,
                    opacity: removingId === mountain.id ? 0.6 : 1,
                    backgroundColor:
                      hoveredButton === `delete-${mountain.id}`
                        ? "#ff5252"
                        : "#ff6b6b",
                    transform:
                      hoveredButton === `delete-${mountain.id}`
                        ? "scale(1.05)"
                        : "scale(1)",
                    boxShadow:
                      hoveredButton === `delete-${mountain.id}`
                        ? "0 4px 8px rgba(255, 107, 107, 0.3)"
                        : "0 2px 4px rgba(255, 107, 107, 0.2)",
                  }}
                >
                  {removingId === mountain.id ? "⏳" : "삭제"}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={emptyStateStyle}>
          <div style={emptyIconStyle}>⭐</div>
          <h3 style={emptyTitleStyle}>아직 즐겨찾기한 산이 없습니다</h3>
          <p style={emptyDescStyle}>
            마음에 드는 산을 찾아서 즐겨찾기에 추가해보세요!
          </p>
          <button
            onClick={() => (window.location.href = "/mountain")}
            style={emptyActionButtonStyle}
          >
            🏔️ 산 둘러보기
          </button>
        </div>
      )}

      {/* 즐겨찾기 통계 */}
      {favoriteCount > 0 && favoriteMountains.length > 0 && (
        <div style={statsStyle}>
          <div style={statItemStyle}>
            <span style={statLabelStyle}>총 즐겨찾기</span>
            <span style={statValueStyle}>{favoriteCount}개</span>
          </div>
          <div style={statItemStyle}>
            <span style={statLabelStyle}>평균 고도</span>
            <span style={statValueStyle}>
              {Math.round(
                favoriteMountains.reduce((sum, m) => sum + m.elevation, 0) /
                  favoriteMountains.length
              )}
              m
            </span>
          </div>
        </div>
      )}
    </section>
  );
};

// ============================================
// ✅ 스타일 정의
// ============================================

const sectionStyle = {
  backgroundColor: "#ffffff",
  borderRadius: "1rem",
  padding: "clamp(1.5rem, 3vw, 2rem)",
  boxShadow: "0 0.2rem 1rem rgba(0,0,0,0.1)",
  border: "0.1rem solid #e9ecef",
  position: "relative",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "clamp(1.5rem, 3vw, 2rem)",
  flexWrap: "wrap",
  gap: "clamp(0.8rem, 1.5vw, 1rem)",
};

const sectionTitleStyle = {
  fontSize: "clamp(1.3rem, 2.5vw, 1.5rem)",
  fontWeight: "600",
  color: "#2c3e50",
  margin: 0,
};

const countBadgeStyle = {
  backgroundColor: "#d5e9de",
  color: "#1a471a",
  padding: "clamp(0.4rem, 0.8vw, 0.6rem) clamp(0.8rem, 1.5vw, 1rem)",
  borderRadius: "1.5rem",
  fontSize: "clamp(0.8rem, 1.3vw, 0.9rem)",
  fontWeight: "600",
};

const favoritesListStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "clamp(0.8rem, 1.5vw, 1rem)",
};

const favoriteItemStyle = {
  backgroundColor: "#ffffff",
  borderRadius: "1rem",
  padding: "clamp(1.2rem, 2.5vw, 1.8rem)",
  border: "1px solid #e8f5e8",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  transition: "all 0.3s ease",
  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  position: "relative",
  overflow: "hidden",
  cursor: "default",
};

const mountainInfoClickableStyle = {
  flex: 1,
  cursor: "pointer",
  display: "flex",
  flexDirection: "column",
  gap: "clamp(0.5rem, 1vw, 0.8rem)",
  padding: "clamp(0.3rem, 0.6vw, 0.5rem)",
  borderRadius: "0.8rem",
  transition: "all 0.2s ease",
};

const mountainNameClickableStyle = {
  fontSize: "clamp(1.2rem, 2.2vw, 1.4rem)",
  fontWeight: "700",
  color: "#2c3e50",
  margin: 0,
  transition: "color 0.2s ease",
};

const mountainDetailsStyle = {
  display: "flex",
  gap: "clamp(0.6rem, 1.2vw, 0.8rem)",
  flexWrap: "wrap",
  alignItems: "center",
};

const detailItemStyle = {
  fontSize: "clamp(0.8rem, 1.4vw, 0.9rem)",
  color: "#5a6c7d",
  backgroundColor: "#f8f9fa",
  padding: "clamp(0.3rem, 0.6vw, 0.4rem) clamp(0.6rem, 1.2vw, 0.8rem)",
  borderRadius: "0.6rem",
  border: "1px solid #e9ecef",
  whiteSpace: "nowrap",
  fontWeight: "500",
  transition: "all 0.2s ease",
};

const removeButtonStyle = {
  backgroundColor: "#ff6b6b",
  color: "#ffffff",
  border: "none",
  borderRadius: "0.8rem",
  padding: "clamp(0.6rem, 1.2vw, 0.8rem) clamp(1rem, 2vw, 1.2rem)",
  fontSize: "clamp(0.8rem, 1.4vw, 0.9rem)",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.3s ease",
  minWidth: "clamp(3.5rem, 6vw, 4.5rem)",
  boxShadow: "0 2px 4px rgba(255, 107, 107, 0.2)",
};

const emptyStateStyle = {
  textAlign: "center",
  padding: "clamp(3rem, 6vw, 4rem) clamp(1rem, 2vw, 2rem)",
  color: "#6c757d",
};

const emptyIconStyle = {
  fontSize: "clamp(4rem, 8vw, 6rem)",
  marginBottom: "clamp(1rem, 2vw, 1.5rem)",
};

const emptyTitleStyle = {
  fontSize: "clamp(1.2rem, 2.2vw, 1.4rem)",
  fontWeight: "600",
  color: "#495057",
  marginBottom: "clamp(0.8rem, 1.5vw, 1rem)",
};

const emptyDescStyle = {
  fontSize: "clamp(0.9rem, 1.5vw, 1rem)",
  lineHeight: 1.5,
  marginBottom: "clamp(1.5rem, 3vw, 2rem)",
};

const emptyActionButtonStyle = {
  backgroundColor: "#28a745",
  color: "#ffffff",
  padding: "clamp(0.8rem, 1.5vw, 1rem) clamp(1.5rem, 3vw, 2rem)",
  border: "none",
  borderRadius: "0.5rem",
  fontSize: "clamp(0.9rem, 1.5vw, 1rem)",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.3s ease",
};

const statsStyle = {
  marginTop: "clamp(1.5rem, 3vw, 2rem)",
  display: "flex",
  gap: "clamp(1rem, 2vw, 1.5rem)",
  justifyContent: "center",
  flexWrap: "wrap",
};

const statItemStyle = {
  backgroundColor: "#f8f9fa",
  padding: "clamp(0.8rem, 1.5vw, 1rem) clamp(1.2rem, 2.4vw, 1.5rem)",
  borderRadius: "0.8rem",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "0.3rem",
  border: "0.1rem solid #e9ecef",
};

const statLabelStyle = {
  fontSize: "clamp(0.8rem, 1.3vw, 0.9rem)",
  color: "#6c757d",
};

const statValueStyle = {
  fontSize: "clamp(1.1rem, 2vw, 1.3rem)",
  fontWeight: "700",
  color: "#2c3e50",
};

const loadingStyle = {
  textAlign: "center",
  padding: "clamp(2rem, 4vw, 3rem)",
  color: "#6c757d",
  fontSize: "clamp(1rem, 1.8vw, 1.1rem)",
};

const errorStyle = {
  textAlign: "center",
  padding: "clamp(2rem, 4vw, 3rem)",
  color: "#e74c3c",
  fontSize: "clamp(1rem, 1.8vw, 1.1rem)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

export default FavoriteSection;
