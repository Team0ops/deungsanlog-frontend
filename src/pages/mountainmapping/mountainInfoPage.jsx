import { useEffect, useRef, useState } from "react";
import SoftInput from "shared/ui/SoftInput";
import SearchIcon from "@mui/icons-material/Search";
import {
  loadKakaoMap,
  moveMapCenter,
  createMountainMarkers,
  getMountainGradeInfo,
  DEFAULT_MAP_SETTINGS,
} from "shared/lib/KakaoMap";
import ZoomControl from "shared/ui/ZoomControl";
import MountainSearchModal from "./MountainSearchModal";
import axiosInstance from "shared/lib/axiosInstance";
import SoftButton from "shared/ui/SoftButton";
import MyLocationIcon from "@mui/icons-material/MyLocation";

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

  // 📍 GPS 위치 마커 관련 상태
  const [userLocationMarker, setUserLocationMarker] = useState(null);

  useEffect(() => {
    const initMap = () => {
      if (window.kakao?.maps) {
        window.kakao.maps.load(() => {
          // ✅ 한국 전체 영토가 보이도록 변경
          const map = loadKakaoMap({
            containerId: "map",
            ...DEFAULT_MAP_SETTINGS.KOREA_FULL_VIEW,
          });
          mapRef.current = map;
          setMapLoaded(true);
          console.log("🗺️ 지도 초기화 완료 - 한국 전체 영토 보기");
        });
      } else {
        alert("window.kakao가 없습니다! 카카오맵 SDK가 로드되지 않았습니다.");
      }
    };

    const existingScript = document.querySelector("script[src*='kakao.com']");
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoApiKey}&autoload=false`;
      script.async = true;
      script.onload = initMap;
      script.onerror = () => alert("카카오맵 스크립트 로드 실패!");
      document.head.appendChild(script);
    } else {
      if (window.kakao?.maps) {
        initMap();
      } else {
        existingScript.addEventListener("load", initMap);
        existingScript.addEventListener("error", () =>
          alert("카카오맵 스크립트 로드 실패!")
        );
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
      // ✅ 유틸리티 함수 사용
      createMountainMarkers(mapRef.current, mountains, handleMarkerClick);
    }
  }, [mapRef.current, mountains, mapLoaded]);

  // 🏔️ 산 데이터 조회
  const fetchAllMountains = async () => {
    try {
      const response = await axiosInstance.get("/mountain-service/all");
      const data = response.data;

      console.log("📍 가져온 산 데이터:", data.length, "개");
      setMountains(data);
    } catch (error) {
      console.error("산 데이터 조회 오류:", error);
    }
  };

  // 🏔️ 마커 클릭 처리 (유틸리티 함수의 콜백으로 사용)
  const handleMarkerClick = (mountain) => {
    console.log("🏔️ 마커 클릭:", mountain.name, `(${mountain.elevation}m)`);
    setSelectedMountain(mountain);
    setShowPopup(true);

    // ✅ 유틸리티 함수 사용 - 적당한 레벨로 확대
    moveMapCenter(mapRef.current, mountain.latitude, mountain.longitude, 8);
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

  // 🗺️ GPS 위치로 이동 및 마커 표시
  const handleLocationClick = (latitude, longitude) => {
    if (mapRef.current) {
      console.log("📍 GPS 위치로 이동:", latitude, longitude);

      // 기존 사용자 위치 마커 제거
      if (userLocationMarker) {
        userLocationMarker.setMap(null);
      }

      // 새로운 사용자 위치 마커 생성
      const marker = new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(latitude, longitude),
        map: mapRef.current,
      });

      // 마커 스타일 설정 (파란색 원형 마커)
      const markerImage = new window.kakao.maps.MarkerImage(
        "data:image/svg+xml;base64," +
          btoa(`
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="8" fill="#4285F4" stroke="white" stroke-width="2"/>
            <circle cx="12" cy="12" r="3" fill="white"/>
          </svg>
        `),
        new window.kakao.maps.Size(24, 24)
      );
      marker.setImage(markerImage);

      // 마커 클릭 시 정보창 표시
      const infowindow = new window.kakao.maps.InfoWindow({
        content: `
          <div style="padding: 8px; text-align: center; font-size: 14px; font-weight: bold; color: #4285F4;">
            📍 현재 위치
          </div>
        `,
      });

      window.kakao.maps.event.addListener(marker, "click", function () {
        infowindow.open(mapRef.current, marker);
      });

      setUserLocationMarker(marker);

      // 지도 중심 이동 - 더 가까이서 보기
      moveMapCenter(mapRef.current, latitude, longitude, 10);
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

      {/* ✅ 범례 추가 - 데스크탑: 오른쪽 상단, 모바일: 오른쪽 상단 */}
      {window.innerWidth >= 600 && (
        <div style={legendContainerStyle}>
          <div style={legendStyle}>
            <h4 style={legendTitleStyle}>🏔️ 산 고도별 구분</h4>
            <div style={legendItemsStyle}>
              <div style={legendItemStyle}>
                <img
                  src="/images/mountain-high.png"
                  alt="고산"
                  style={legendIconStyle}
                />
                <span>고산 (1500m 이상)</span>
              </div>
              <div style={legendItemStyle}>
                <img
                  src="/images/mountain-medium.png"
                  alt="중산"
                  style={legendIconStyle}
                />
                <span>중산 (800m ~ 1500m)</span>
              </div>
              <div style={legendItemStyle}>
                <img
                  src="/images/mountain-small.png"
                  alt="저산"
                  style={legendIconStyle}
                />
                <span>저산 (800m 미만)</span>
              </div>
            </div>
            <p style={mapGuideStyle}>
              📍 마커를 클릭하면 산 정보를 볼 수 있습니다
            </p>
          </div>
        </div>
      )}

      {/* 검색창 */}
      <div
        style={{
          position: "absolute",
          top: "clamp(1rem, 3vw, 2rem)",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          width:
            window.innerWidth < 600 ? "85vw" : "clamp(20rem, 60vw, 31.25rem)",
          maxWidth: "95vw",
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

      {/* 모바일 범례 + 줌 컨트롤 - 우상단에 모두 배치 */}
      {window.innerWidth < 600 && mapLoaded && (
        <div
          style={{
            position: "absolute",
            top: "clamp(5rem, 12vw, 7rem)",
            right: "clamp(1rem, 3vw, 2rem)",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "0.5rem",
          }}
        >
          {/* 모바일 범례 */}
          <div
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              borderRadius: "8px",
              padding: "0.4rem 0.5rem",
              boxShadow: "0 0.2rem 0.5rem rgba(0,0,0,0.1)",
              fontSize: "0.6rem",
              maxWidth: "120px",
            }}
          >
            <h4
              style={{
                margin: "0 0 0.2rem 0",
                fontSize: "0.7rem",
                fontWeight: "bold",
                color: "#333",
                textAlign: "center",
              }}
            >
              🏔️ 산 고도별
            </h4>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.1rem",
                marginBottom: "0.2rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.2rem",
                  justifyContent: "center",
                }}
              >
                <img
                  src="/images/mountain-high.png"
                  alt="고산"
                  style={{ width: "0.6rem", height: "0.6rem" }}
                />
                <span>고산</span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.2rem",
                  justifyContent: "center",
                }}
              >
                <img
                  src="/images/mountain-medium.png"
                  alt="중산"
                  style={{ width: "0.6rem", height: "0.6rem" }}
                />
                <span>중산</span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.2rem",
                  justifyContent: "center",
                }}
              >
                <img
                  src="/images/mountain-small.png"
                  alt="저산"
                  style={{ width: "0.6rem", height: "0.6rem" }}
                />
                <span>저산</span>
              </div>
            </div>
          </div>

          {/* 모바일 줌 컨트롤 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: "0.3rem",
              width: "120px",
            }}
          >
            {/* +/- 버튼 세로로 배치 */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.2rem",
                alignItems: "flex-end",
              }}
            >
              <button
                onClick={handleZoomIn}
                style={{
                  backgroundColor: "#ffffffcc",
                  color: "#000000",
                  fontWeight: "bold",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                  width: "40px",
                  height: "40px",
                  padding: "0",
                  fontSize: "1.2rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  outline: "none",
                }}
              >
                +
              </button>

              <button
                onClick={handleZoomOut}
                style={{
                  backgroundColor: "#ffffffcc",
                  color: "#000000",
                  fontWeight: "bold",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                  width: "40px",
                  height: "40px",
                  padding: "0",
                  fontSize: "1.2rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  outline: "none",
                }}
              >
                −
              </button>
            </div>

            {/* GPS 버튼 - 오른쪽에 붙이기 */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                      (position) => {
                        const { latitude, longitude } = position.coords;
                        handleLocationClick(latitude, longitude);
                      },
                      (error) => {
                        console.error("위치 정보를 가져올 수 없습니다:", error);
                        alert(
                          "위치 정보를 가져올 수 없습니다. 브라우저 설정에서 위치 권한을 허용해주세요."
                        );
                      },
                      {
                        enableHighAccuracy: true,
                        timeout: 10000,
                        maximumAge: 60000,
                      }
                    );
                  } else {
                    alert("이 브라우저에서는 위치 정보를 지원하지 않습니다.");
                  }
                }}
                style={{
                  backgroundColor: "#ffffffcc",
                  color: "#000000",
                  fontWeight: "bold",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)",
                  width: "32px",
                  height: "32px",
                  padding: "0",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  outline: "none",
                }}
              >
                <MyLocationIcon sx={{ fontSize: "1rem" }} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 줌 컨트롤 + GPS 버튼 - 데스크탑만 */}
      {mapLoaded && window.innerWidth >= 600 && (
        <div
          style={{
            position: "fixed",
            bottom: "clamp(0.6rem, 1.5vw, 0.625rem)",
            right: "clamp(1rem, 3vw, 2rem)",
            zIndex: 10,
          }}
        >
          <ZoomControl
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onLocationClick={handleLocationClick}
          />
        </div>
      )}

      {/* 🏔️ 산 정보 팝업 */}
      {showPopup && selectedMountain && (
        <MountainInfoPopup mountain={selectedMountain} onClose={closePopup} />
      )}
    </>
  );
};

// 🏔️ 산 정보 팝업 컴포넌트 - 유틸리티 함수 사용
const MountainInfoPopup = ({ mountain, onClose }) => {
  // ✅ 유틸리티 함수 사용
  const gradeInfo = getMountainGradeInfo(mountain.elevation || 0);

  return (
    <div style={popupOverlayStyle}>
      <div style={popupContentStyle}>
        <button
          onClick={onClose}
          style={closeButtonStyle}
          onMouseOver={(e) => {
            e.target.style.border = "2px solid #d1d5db";
            e.target.style.color = "#333333";
            e.target.style.backgroundColor = "#e4e4e4ac";
          }}
          onMouseOut={(e) => {
            e.target.style.border = "1px solid #e8eaed";
          }}
        >
          ✕
        </button>

        <h2 style={mountainNameStyle}>{mountain.name}</h2>

        <div style={imageContainerStyle}>
          {mountain.thumbnailImgUrl ? (
            <img
              src={mountain.thumbnailImgUrl}
              alt={mountain.name}
              style={mountainImageStyle}
            />
          ) : (
            <div style={noImageStyle}>
              <span style={{ fontSize: "clamp(2rem, 6vw, 3rem)" }}>
                {gradeInfo.icon}
              </span>
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
          <div style={detailsStyle}>
            <div style={detailItemStyle}>
              <span style={labelStyle}>📍 소재지 :</span>
              <span style={valueStyle}>{mountain.location}</span>
            </div>
            <div style={detailItemStyle}>
              <span style={labelStyle}>⛰️ 해발고도:</span>
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
              onMouseOver={(e) => {
                e.target.style.backgroundColor = "#649177";
                e.target.style.color = "white";
                e.target.style.outline = "2px solid #649177";
                e.target.style.boxShadow = "0 4px 12px rgba(100,145,119,0.3)";
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = "#f3f7f4";
                e.target.style.color = "#1f1f1f";
                e.target.style.outline = "2px solid #649177";
                e.target.style.boxShadow = "0 2px 8px rgba(67,226,125,0.15)";
              }}
            >
              상세 페이지 이동
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ✅ 범례 스타일들 - 상단에 작게 배치
const legendContainerStyle = {
  position: "fixed",
  top: "clamp(1rem, 2vw, 1.5rem)",
  right: "clamp(1rem, 2vw, 1.5rem)",
  zIndex: 100,
  width:
    window.innerWidth < 600
      ? "clamp(8rem, 25vw, 12rem)"
      : "clamp(12rem, 25vw, 16rem)",
  minWidth: window.innerWidth < 600 ? "6rem" : "10rem",
  maxWidth: window.innerWidth < 600 ? "80vw" : "18rem",
};

const legendStyle = {
  backgroundColor: "rgba(255, 255, 255, 0.95)",
  borderRadius: "clamp(0.5rem, 1vw, 0.8rem)",
  padding:
    window.innerWidth < 600 ? "0.5rem 0.6rem" : "clamp(0.6rem, 1.2vw, 0.8rem)",
  boxShadow: "0 0.2rem 0.5rem rgba(0,0,0,0.1)",
  maxWidth: "100%",
  fontSize: window.innerWidth < 600 ? "0.7rem" : "clamp(0.6rem, 1.2vw, 0.7rem)",
};

const legendTitleStyle = {
  margin: "0 0 clamp(0.3rem, 0.8vw, 0.5rem) 0",
  fontSize: window.innerWidth < 600 ? "0.8rem" : "clamp(0.8rem, 1.5vw, 0.9rem)",
  fontWeight: "bold",
  color: "#333",
};

const legendItemsStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "clamp(0.1rem, 0.3vw, 0.2rem)",
  marginBottom: "clamp(0.3rem, 0.8vw, 0.5rem)",
};

const legendItemStyle = {
  display: "flex",
  alignItems: "center",
  gap: "clamp(0.2rem, 0.4vw, 0.3rem)",
};

const legendIconStyle = {
  width: "clamp(0.8rem, 1.5vw, 1rem)",
  height: "clamp(0.8rem, 1.5vw, 1rem)",
};

const mapGuideStyle = {
  margin: "clamp(0.3rem, 0.8vw, 0.5rem) 0 0 0",
  fontSize: window.innerWidth < 600 ? "0.6rem" : "clamp(0.5rem, 1vw, 0.6rem)",
  color: "#666",
  fontStyle: "italic",
};

// 기존 팝업 스타일들...
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
  maxHeight: "85vh",
  overflow: "auto",
  position: "relative",
  boxShadow: "0 0.25rem 1.25rem rgba(0, 0, 0, 0.15)",
  zIndex: 10000,
  // 스크롤바 스타일링
  scrollbarWidth: "thin",
  scrollbarColor: "#c1c1c1 #f1f1f1",
  // Webkit 브라우저용 스크롤바 스타일
  "&::-webkit-scrollbar": {
    width: "8px",
  },
  "&::-webkit-scrollbar-track": {
    background: "#f1f1f1",
    borderRadius: "4px",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "#c1c1c1",
    borderRadius: "4px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    background: "#a8a8a8",
  },
};

const closeButtonStyle = {
  position: "absolute",
  top: "clamp(0.8rem, 1.5vw, 1rem)",
  right: "clamp(0.8rem, 1.5vw, 1rem)",
  background: "rgba(255, 255, 255, 0.9)",
  border: "1px solid #e8eaed",
  borderRadius: "50%",
  fontSize: "clamp(1.2rem, 2.5vw, 1.5rem)",
  cursor: "pointer",
  color: "#5f6368",
  width: "clamp(2rem, 3.5vw, 2.5rem)",
  height: "clamp(2rem, 3.5vw, 2.5rem)",
  minWidth: "clamp(2rem, 3.5vw, 2.5rem)",
  minHeight: "clamp(2rem, 3.5vw, 2.5rem)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.2s ease",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  boxSizing: "border-box",
  padding: 0,
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
  marginBottom: "clamp(1rem, 2vw, 1.5rem)",
};

const detailsStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "clamp(0.4rem, 0.8vw, 0.5rem)",
};

const detailItemStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  padding: "clamp(0.5rem, 1vw, 0.6rem) clamp(0.6rem, 1.2vw, 0.8rem)",
  backgroundColor: "#f8f9fa",
  borderRadius: "clamp(0.2rem, 0.5vw, 0.3rem)",
};

const labelStyle = {
  fontWeight: "600",
  color: "#495057",
  fontSize: "clamp(0.8rem, 1.5vw, 0.9rem)",
  whiteSpace: "nowrap",
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
  padding: "clamp(0.7rem, 1.3vw, 0.9rem) clamp(1rem, 1.8vw, 1.2rem)",
  backgroundColor: "#f3f7f4",
  color: "#1f1f1f",
  border: "none",
  outline: "2px solid #649177",
  borderRadius: "clamp(0.5rem, 1vw, 0.7rem)",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "clamp(0.85rem, 1.5vw, 0.95rem)",
  transition: "all 0.2s ease",
  boxShadow: "0 2px 8px rgba(67,226,125,0.15)",
};

export default MountainInfoPage;
