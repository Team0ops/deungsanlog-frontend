import { useEffect, useRef, useState } from "react";
import SoftInput from "shared/ui/SoftInput";
import SearchIcon from "@mui/icons-material/Search";
import { loadKakaoMap } from "shared/lib/KakaoMap";
import ZoomControl from "shared/ui/ZoomControl";
import MountainSearchModal from "./MountainSearchModal";
import axiosInstance from "shared/lib/axiosInstance";

const kakaoApiKey = import.meta.env.VITE_KAKAOMAP_API_KEY;

const MountainInfoPage = () => {
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // 🏔️ 산 마커 관련 상태
  const [mountains, setMountains] = useState([]);
  const [selectedMountain, setSelectedMountain] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  // ✅ 검색 관련 상태 추가
  const [searchKeyword, setSearchKeyword] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    const initMap = () => {
      if (window.kakao?.maps) {
        window.kakao.maps.load(() => {
          const map = loadKakaoMap({ containerId: "map" });
          mapRef.current = map;
          setMapLoaded(true);
        });
      }
    };

    const existingScript = document.querySelector("script[src*='kakao.com']");
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoApiKey}&autoload=false`;
      script.async = true;
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      if (window.kakao?.maps) {
        initMap();
      } else {
        existingScript.addEventListener("load", initMap);
      }
    }
  }, []);

  // 🏔️ 산 데이터 가져오기
  useEffect(() => {
    fetchAllMountains();
  }, []);

  // 🏔️ 마커 생성 (맵이 로드된 후에만)
  useEffect(() => {
    if (mapRef.current && mountains.length > 0 && mapLoaded) {
      createMountainMarkers();
    }
  }, [mapRef.current, mountains, mapLoaded]);

  // 🏔️ 산 데이터 조회
  const fetchAllMountains = async () => {
    try {
      const response = await axiosInstance.get("/mountain-service/all");
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.data;

      console.log("📍 가져온 산 데이터:", data?.length, "개");
      setMountains(data || []);
    } catch (error) {
      console.error("산 데이터 조회 오류:", error);
    }
  };

  // 🏔️ 마커 생성
  const createMountainMarkers = () => {
    mountains.forEach((mountain) => {
      if (mountain.latitude && mountain.longitude) {
        const markerPosition = new window.kakao.maps.LatLng(
          mountain.latitude,
          mountain.longitude
        );

        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
          title: mountain.name,
        });

        marker.setMap(mapRef.current);

        // 마커 클릭 이벤트
        window.kakao.maps.event.addListener(marker, "click", () => {
          handleMarkerClick(mountain);
        });
      }
    });
  };

  // 🏔️ 마커 클릭 처리
  const handleMarkerClick = (mountain) => {
    console.log("🏔️ 마커 클릭:", mountain.name);
    setSelectedMountain(mountain);
    setShowPopup(true);

    // 지도 중심 이동
    const moveLatLon = new window.kakao.maps.LatLng(
      mountain.latitude,
      mountain.longitude
    );
    mapRef.current.setCenter(moveLatLon);
    mapRef.current.setLevel(6);
  };

  // 🏔️ 팝업 닫기
  const closePopup = () => {
    setShowPopup(false);
    setSelectedMountain(null);
  };

  // ✅ 검색어 변경 핸들러
  const handleSearchChange = (event) => {
    const keyword = event.target.value;
    setSearchKeyword(keyword);
    setShowSearchResults(keyword.length > 0);
  };

  // ✅ 검색 결과에서 산 선택 시 - 상세 페이지로 이동
  const handleSelectMountain = (mountain) => {
    console.log("🔍 검색에서 산 선택:", mountain.name);

    // 상세 페이지로 이동 (가리산 → /mountain/detail/가리산)
    window.location.href = `/mountain/detail/${encodeURIComponent(
      mountain.name
    )}`;
  };

  // ✅ 검색창 외부 클릭 시 검색 결과 닫기
  const handleSearchBlur = () => {
    // 약간의 지연을 두어 검색 결과 클릭이 먼저 처리되도록 함
    setTimeout(() => {
      setShowSearchResults(false);
    }, 200);
  };

  const handleZoomIn = () => {
    if (mapRef.current) {
      const currentLevel = mapRef.current.getLevel();
      mapRef.current.setLevel(currentLevel - 1);
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current) {
      const currentLevel = mapRef.current.getLevel();
      mapRef.current.setLevel(currentLevel + 1);
    }
  };

  return (
    <>
      {/* 지도 */}
      <div
        id="map"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 0,
        }}
      />

      {/* 검색창 */}
      <div
        style={{
          position: "absolute",
          top: "clamp(1rem, 3vw, 2rem)",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          width: "clamp(20rem, 60vw, 31.25rem)",
        }}
      >
        <div style={{ position: "relative" }}>
          <SoftInput
            placeholder="산 이름을 검색하세요"
            icon={{ component: <SearchIcon />, direction: "right" }}
            size="large"
            value={searchKeyword}
            onChange={handleSearchChange}
            onBlur={handleSearchBlur}
            style={{
              fontSize: "clamp(1rem, 2vw, 1.2rem)",
              py: "clamp(0.8rem, 1.5vw, 2rem)",
              px: "clamp(1rem, 2vw, 3rem)",
            }}
            fullWidth
          />

          {/* ✅ 검색 결과 모달 */}
          {showSearchResults && (
            <MountainSearchModal
              searchKeyword={searchKeyword}
              onSelect={handleSelectMountain}
            />
          )}
        </div>
      </div>

      {/* 줌 컨트롤 */}
      {mapLoaded && (
        <div
          style={{
            position: "fixed",
            bottom: "clamp(0.6rem, 1.5vw, 0.625rem)",
            right: "clamp(1rem, 3vw, 2rem)",
            zIndex: 10,
          }}
        >
          <ZoomControl onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} />
        </div>
      )}

      {/* 🏔️ 산 정보 팝업 */}
      {showPopup && selectedMountain && (
        <MountainInfoPopup mountain={selectedMountain} onClose={closePopup} />
      )}
    </>
  );
};

// 🏔️ 산 정보 팝업 컴포넌트
const MountainInfoPopup = ({ mountain, onClose }) => {
  return (
    <div style={popupOverlayStyle}>
      <div style={popupContentStyle}>
        <button onClick={onClose} style={closeButtonStyle}>
          ✕
        </button>

        <div style={imageContainerStyle}>
          {mountain.thumbnailImgUrl ? (
            <img
              src={mountain.thumbnailImgUrl}
              alt={mountain.name}
              style={mountainImageStyle}
            />
          ) : (
            <div style={noImageStyle}>
              <span style={{ fontSize: "clamp(2rem, 6vw, 3rem)" }}>🏔️</span>
              <p
                style={{
                  fontSize: "clamp(0.8rem, 1.5vw, 0.9rem)",
                  margin: "clamp(0.5rem, 1vw, 0.8rem) 0 0 0",
                }}
              >
                이미지 없음
              </p>
            </div>
          )}
        </div>

        <div style={infoContainerStyle}>
          <h2 style={mountainNameStyle}>🏔️ {mountain.name}</h2>

          <div style={detailsStyle}>
            <div style={detailItemStyle}>
              <span style={labelStyle}>📍 위치:</span>
              <span style={valueStyle}>{mountain.location}</span>
            </div>
            <div style={detailItemStyle}>
              <span style={labelStyle}>⛰️ 높이:</span>
              <span style={valueStyle}>{mountain.elevation}m</span>
            </div>
          </div>

          <div style={actionButtonsStyle}>
            <button
              onClick={() =>
                (window.location.href = `/mountain/detail/${encodeURIComponent(
                  mountain.name
                )}`)
              }
              style={detailButtonStyle}
            >
              🔍 상세보기
            </button>
            <button
              onClick={() => (window.location.href = "/log/write")}
              style={recordButtonStyle}
            >
              📝 등산기록
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 🎨 스타일들 (기존과 동일)
const popupOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
};

const popupContentStyle = {
  backgroundColor: "white",
  borderRadius: "clamp(0.8rem, 1.5vw, 1rem)",
  padding: "clamp(1rem, 2.5vw, 1.5rem)",
  maxWidth: "clamp(18rem, 50vw, 25rem)",
  width: "clamp(16rem, 90vw, 22rem)",
  maxHeight: "80vh",
  overflow: "auto",
  position: "relative",
  boxShadow: "0 0.25rem 1.25rem rgba(0, 0, 0, 0.15)",
  zIndex: 10000,
};

const closeButtonStyle = {
  position: "absolute",
  top: "clamp(0.8rem, 1.5vw, 1rem)",
  right: "clamp(0.8rem, 1.5vw, 1rem)",
  background: "none",
  border: "none",
  fontSize: "clamp(1.2rem, 2.5vw, 1.5rem)",
  cursor: "pointer",
  color: "#666",
  width: "clamp(1.5rem, 3vw, 2rem)",
  height: "clamp(1.5rem, 3vw, 2rem)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const imageContainerStyle = {
  width: "100%",
  height: "clamp(10rem, 25vw, 12.5rem)",
  marginBottom: "clamp(0.8rem, 1.5vw, 1rem)",
  borderRadius: "clamp(0.3rem, 0.8vw, 0.5rem)",
  overflow: "hidden",
};

const mountainImageStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const noImageStyle = {
  width: "100%",
  height: "100%",
  backgroundColor: "#f8f9fa",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  color: "#666",
};

const infoContainerStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "clamp(0.8rem, 1.5vw, 1rem)",
};

const mountainNameStyle = {
  fontSize: "clamp(1.2rem, 2.5vw, 1.5rem)",
  fontWeight: "bold",
  color: "#2c3e50",
  margin: 0,
  lineHeight: 1.2,
};

const detailsStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "clamp(0.4rem, 0.8vw, 0.5rem)",
};

const detailItemStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "clamp(0.5rem, 1vw, 0.6rem) clamp(0.6rem, 1.2vw, 0.8rem)",
  backgroundColor: "#f8f9fa",
  borderRadius: "clamp(0.2rem, 0.5vw, 0.3rem)",
};

const labelStyle = {
  fontWeight: "600",
  color: "#495057",
  fontSize: "clamp(0.8rem, 1.5vw, 0.9rem)",
};

const valueStyle = {
  color: "#2c3e50",
  fontSize: "clamp(0.8rem, 1.5vw, 0.9rem)",
  fontWeight: "500",
};

const actionButtonsStyle = {
  display: "flex",
  gap: "clamp(0.4rem, 1vw, 0.5rem)",
  marginTop: "clamp(0.8rem, 1.5vw, 1rem)",
};

const detailButtonStyle = {
  flex: 1,
  padding: "clamp(0.6rem, 1.2vw, 0.8rem) clamp(0.8rem, 1.5vw, 1rem)",
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "clamp(0.3rem, 0.8vw, 0.5rem)",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "clamp(0.8rem, 1.5vw, 0.9rem)",
  transition: "all 0.3s ease",
};

const recordButtonStyle = {
  flex: 1,
  padding: "clamp(0.6rem, 1.2vw, 0.8rem) clamp(0.8rem, 1.5vw, 1rem)",
  backgroundColor: "#28a745",
  color: "white",
  border: "none",
  borderRadius: "clamp(0.3rem, 0.8vw, 0.5rem)",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "clamp(0.8rem, 1.5vw, 0.9rem)",
  transition: "all 0.3s ease",
};

export default MountainInfoPage;
