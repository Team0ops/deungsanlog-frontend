import React, { useState, useEffect } from "react";
import { getToken } from "shared/lib/auth";
import axiosInstance from "shared/lib/axiosInstance";

const FavoriteSection = ({ userId }) => {
  const [favoriteMountains, setFavoriteMountains] = useState([]);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removingId, setRemovingId] = useState(null);

  // 즐겨찾기 데이터 조회
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!userId) return;

      try {
        // ✅ 인증 유틸 사용
        const token = getToken();

        if (!token) {
          setError("로그인이 필요합니다.");
          setLoading(false);
          return;
        }

        const idsResponse = await axiosInstance.get(
          `/user-service/api/users/${userId}/favorites/ids`,
          {
            headers: {
              "X-AUTH-TOKEN": token,
            },
          }
        );

        const countResponse = await axiosInstance.get(
          `/user-service/api/users/${userId}/favorites/count`,
          {
            headers: {
              "X-AUTH-TOKEN": token,
            },
          }
        );

        if (idsResponse.ok && countResponse.ok) {
          const idsData = await idsResponse.json();
          const countData = await countResponse.json();

          const mountainIds = idsData.favoriteIds || [];
          setFavoriteCount(countData.count || 0);

          // 3. 각 산의 상세 정보 조회
          if (mountainIds.length > 0) {
            await fetchMountainDetails(mountainIds);
          }
        } else {
          setError("즐겨찾기 정보를 불러올 수 없습니다.");
        }
      } catch (error) {
        console.error("즐겨찾기 조회 오류:", error);
        setError("즐겨찾기 조회 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [userId]);

  // 산 상세 정보 배치 조회
  const fetchMountainDetails = async (mountainIds) => {
    try {
      const mountainPromises = mountainIds.map(async (mountainId) => {
        try {
          const response = await axiosInstance.get("/mountain-service/search", {
            params: { name: mountainId },
          });

          return response.data.mountain;
        } catch (error) {
          console.error(`산 정보 조회 실패: ${mountainId}`, error);
          return null;
        }
      });

      const mountains = await Promise.all(mountainPromises);
      const validMountains = mountains.filter((mountain) => mountain !== null);
      setFavoriteMountains(validMountains);
    } catch (error) {
      console.error("산 정보 배치 조회 오류:", error);
    }
  };

  // 즐겨찾기 삭제
  const handleRemoveFavorite = async (mountainId, mountainName) => {
    if (
      !window.confirm(`'${mountainName}'을(를) 즐겨찾기에서 삭제하시겠습니까?`)
    ) {
      return;
    }

    setRemovingId(mountainId);
    try {
      const token = getToken();

      await axiosInstance.delete(
        `/user-service/api/users/${userId}/favorites/${mountainId}`,
        {
          headers: {
            "X-AUTH-TOKEN": token,
          },
        }
      );

      // UI 업데이트
      setFavoriteMountains((prev) =>
        prev.filter((mountain) => mountain.id !== mountainId)
      );
      setFavoriteCount((prev) => prev - 1);
      alert("즐겨찾기에서 삭제되었습니다.");
    } catch (error) {
      console.error("즐겨찾기 삭제 오류:", error);
      alert("즐겨찾기 삭제 중 오류가 발생했습니다.");
    } finally {
      setRemovingId(null);
    }
  };

  // 산 상세 페이지로 이동
  const handleViewMountain = (mountainName) => {
    window.location.href = `/mountain/detail/${encodeURIComponent(
      mountainName
    )}`;
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
        <div style={favoritesGridStyle}>
          {favoriteMountains.map((mountain) => (
            <div key={mountain.id} style={favoriteCardStyle}>
              {/* 산 이미지 */}
              <div style={mountainImageStyle}>
                {mountain.thumbnailImgUrl ? (
                  <img
                    src={mountain.thumbnailImgUrl}
                    alt={mountain.name}
                    style={mountainImageImgStyle}
                  />
                ) : (
                  <div style={mountainImagePlaceholderStyle}>
                    <span>🏔️</span>
                  </div>
                )}
              </div>

              {/* 산 정보 */}
              <div style={mountainInfoStyle}>
                <h3 style={mountainNameStyle}>{mountain.name}</h3>
                <div style={mountainDetailsStyle}>
                  <span style={detailItemStyle}>📍 {mountain.location}</span>
                  <span style={detailItemStyle}>⛰️ {mountain.elevation}m</span>
                </div>
              </div>

              {/* 액션 버튼들 */}
              <div style={actionButtonsStyle}>
                <button
                  onClick={() => handleViewMountain(mountain.name)}
                  style={{ ...actionButtonStyle, ...viewButtonStyle }}
                >
                  👁️ 상세보기
                </button>
                <button
                  onClick={() =>
                    handleRemoveFavorite(mountain.id, mountain.name)
                  }
                  disabled={removingId === mountain.id}
                  style={{
                    ...actionButtonStyle,
                    ...removeButtonStyle,
                    opacity: removingId === mountain.id ? 0.6 : 1,
                  }}
                >
                  {removingId === mountain.id ? "⏳" : "🗑️"} 삭제
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
      {favoriteCount > 0 && (
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
// 스타일 정의 (rem + vw 기반)
// ============================================

const sectionStyle = {
  backgroundColor: "#ffffff",
  borderRadius: "1rem",
  padding: "clamp(1.5rem, 3vw, 2rem)",
  boxShadow: "0 0.2rem 1rem rgba(0,0,0,0.1)",
  border: "0.1rem solid #e9ecef",
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
  backgroundColor: "#e3f2fd",
  color: "#1976d2",
  padding: "clamp(0.4rem, 0.8vw, 0.6rem) clamp(0.8rem, 1.5vw, 1rem)",
  borderRadius: "1.5rem",
  fontSize: "clamp(0.8rem, 1.3vw, 0.9rem)",
  fontWeight: "600",
};

const favoritesGridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(clamp(18rem, 30vw, 24rem), 1fr))",
  gap: "clamp(1.2rem, 2.5vw, 1.8rem)",
};

const favoriteCardStyle = {
  backgroundColor: "#f8f9fa",
  borderRadius: "1rem",
  padding: "clamp(1rem, 2vw, 1.5rem)",
  border: "0.1rem solid #e9ecef",
  display: "flex",
  flexDirection: "column",
  gap: "clamp(1rem, 2vw, 1.5rem)",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
};

const mountainImageStyle = {
  width: "100%",
  height: "clamp(10rem, 18vw, 14rem)",
  borderRadius: "0.8rem",
  overflow: "hidden",
};

const mountainImageImgStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const mountainImagePlaceholderStyle = {
  width: "100%",
  height: "100%",
  backgroundColor: "#e9ecef",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "clamp(3rem, 6vw, 4rem)",
};

const mountainInfoStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "clamp(0.5rem, 1vw, 0.8rem)",
};

const mountainNameStyle = {
  fontSize: "clamp(1.2rem, 2.2vw, 1.4rem)",
  fontWeight: "700",
  color: "#2c3e50",
  margin: 0,
};

const mountainDetailsStyle = {
  display: "flex",
  gap: "clamp(0.8rem, 1.5vw, 1rem)",
  flexWrap: "wrap",
};

const detailItemStyle = {
  fontSize: "clamp(0.8rem, 1.3vw, 0.9rem)",
  color: "#6c757d",
  backgroundColor: "#ffffff",
  padding: "clamp(0.3rem, 0.6vw, 0.5rem) clamp(0.6rem, 1.2vw, 0.8rem)",
  borderRadius: "0.4rem",
  border: "0.1rem solid #dee2e6",
};

const actionButtonsStyle = {
  display: "flex",
  gap: "clamp(0.6rem, 1.2vw, 0.8rem)",
  marginTop: "auto",
};

const actionButtonStyle = {
  flex: 1,
  padding: "clamp(0.6rem, 1.2vw, 0.8rem)",
  border: "none",
  borderRadius: "0.5rem",
  fontSize: "clamp(0.8rem, 1.3vw, 0.9rem)",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.3s ease",
};

const viewButtonStyle = {
  backgroundColor: "#007bff",
  color: "#ffffff",
};

const removeButtonStyle = {
  backgroundColor: "#dc3545",
  color: "#ffffff",
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
};

export default FavoriteSection;
