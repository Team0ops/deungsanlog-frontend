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
          // ✅ 한국 전체 영토가 보이도록 변경
          const map = loadKakaoMap({ 
            containerId: "map",
            ...DEFAULT_MAP_SETTINGS.KOREA_FULL_VIEW
          });
          mapRef.current = map;
          setMapLoaded(true);
          console.log('🗺️ 지도 초기화 완료 - 한국 전체 영토 보기');
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
      // ✅ 유틸리티 함수 사용
      createMountainMarkers(mapRef.current, mountains, handleMarkerClick);
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

  // 🎨 커스텀 산 마커 생성
  const createCustomMountainMarkers = () => {
    mountains.forEach((mountain) => {
      if (mountain.latitude && mountain.longitude) {
        const markerPosition = new window.kakao.maps.LatLng(
          mountain.latitude,
          mountain.longitude
        );

        // 🏔️ 커스텀 마커 이미지 생성
        const customMarkerImage = createCustomMarkerImage(mountain);

        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
          title: mountain.name,
          image: customMarkerImage, // 🎨 커스텀 이미지 적용
        });

        marker.setMap(mapRef.current);

        // 마커 클릭 이벤트
        window.kakao.maps.event.addListener(marker, "click", () => {
          handleMarkerClick(mountain);
        });

        // 🏷️ 산 이름 라벨 추가 (선택사항)
        if (mountain.elevation > 1000) {
          // 1000m 이상만 라벨 표시
          createMountainLabel(mountain, markerPosition);
        }
      }
    });
  };

  // 🎨 커스텀 마커 이미지 생성 함수
  const createCustomMarkerImage = (mountain) => {
    let imageSrc, imageSize, imageOption;

    // 🏔️ 산의 높이에 따라 다른 마커 사용
    if (mountain.elevation >= 1500) {
      // 고산 (1500m 이상) - 큰 산 아이콘
      imageSrc = "/images/mountain-high.png";
      imageSize = new window.kakao.maps.Size(40, 40);
    } else if (mountain.elevation >= 1000) {
      // 중산 (1000-1499m) - 중간 산 아이콘
      imageSrc = "/images/mountain-medium.png";
      imageSize = new window.kakao.maps.Size(32, 32);
    } else {
      // 저산 (1000m 미만) - 작은 산 아이콘
      imageSrc = "/images/mountain-small.png";
      imageSize = new window.kakao.maps.Size(24, 24);
    }

    // 🎯 마커 이미지 옵션 (클릭 영역 설정)
    imageOption = {
      offset: new window.kakao.maps.Point(
        imageSize.width / 2,
        imageSize.height
      ), // 하단 중앙이 좌표점
    };

    return new window.kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);
  };

  // 🏷️ 산 이름 라벨 생성 (선택사항)
  const createMountainLabel = (mountain, position) => {
    const labelContent = `
      <div style="
        background: rgba(255, 255, 255, 0.9);
        border: 1px solid #ccc;
        border-radius: 4px;
        padding: 2px 6px;
        font-size: 11px;
        font-weight: bold;
        color: #333;
        text-align: center;
        box-shadow: 0 1px 3px rgba(0,0,0,0.3);
      ">
        ${mountain.name}<br>
        <span style="color: #666; font-size: 10px;">${mountain.elevation}m</span>
      </div>
    `;

    const customOverlay = new window.kakao.maps.CustomOverlay({
      position: position,
      content: labelContent,
      yAnchor: 1.3, // 마커 위쪽에 표시
      clickable: false,
    });

    customOverlay.setMap(mapRef.current);
  };

  // 🏔️ 마커 클릭 처리
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

      {/* 🎨 마커 범례 (선택사항) */}
      <div style={legendStyle}>
        <h3 style={legendTitleStyle}>산 높이 구분</h3>
        <div style={legendItemStyle}>
          <img
            src="/images/mountain-high.png"
            alt="고산"
            style={legendIconStyle}
          />
          <span>1500m 이상</span>
        </div>
        <div style={legendItemStyle}>
          <img
            src="/images/mountain-medium.png"
            alt="중산"
            style={legendIconStyle}
          />
          <span>1000-1499m</span>
        </div>
        <div style={legendItemStyle}>
          <img
            src="/images/mountain-small.png"
            alt="저산"
            style={legendIconStyle}
          />
          <span>1000m 미만</span>
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
        <MountainInfoPopup 
          mountain={selectedMountain} 
          onClose={closePopup}
        />
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
              <span style={{ fontSize: "clamp(2rem, 6vw, 3rem)" }}>{gradeInfo.icon}</span>
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
          <h2 style={mountainNameStyle}>{gradeInfo.icon} {mountain.name}</h2>

          {/* ✅ 고도별 등급 표시 */}
          <div style={{...gradeTagStyle, backgroundColor: gradeInfo.color}}>
            {gradeInfo.type} - {mountain.elevation}m
          </div>

          <div style={detailsStyle}>
            <div style={detailItemStyle}>
              <span style={labelStyle}>📍 위치:</span>
              <span style={valueStyle}>{mountain.location}</span>
            </div>
            <div style={detailItemStyle}>
              <span style={labelStyle}>⛰️ 높이:</span>
              <span style={valueStyle}>{mountain.elevation}m</span>
            </div>
            <div style={detailItemStyle}>
              <span style={labelStyle}>🏔️ 등급:</span>
              <span style={valueStyle}>{gradeInfo.description}</span>
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

// ✅ 범례 스타일들 - 오른쪽 상단
const legendContainerStyle = {
  position: 'fixed',
  top: 'clamp(1rem, 2vw, 1.5rem)',
  right: 'clamp(1rem, 2vw, 1.5rem)', // ✅ 오른쪽 상단으로 변경
  zIndex: 100,
};

const legendStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  borderRadius: 'clamp(0.5rem, 1vw, 0.8rem)',
  padding: 'clamp(0.8rem, 1.5vw, 1rem)',
  boxShadow: '0 0.2rem 0.5rem rgba(0,0,0,0.1)',
  maxWidth: 'clamp(12rem, 25vw, 15rem)',
  fontSize: 'clamp(0.7rem, 1.3vw, 0.8rem)',
};

const legendTitleStyle = {
  margin: '0 0 clamp(0.5rem, 1vw, 0.8rem) 0',
  fontSize: 'clamp(0.9rem, 1.8vw, 1rem)',
  fontWeight: 'bold',
  color: '#333',
};

const legendItemsStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'clamp(0.2rem, 0.5vw, 0.3rem)',
  marginBottom: 'clamp(0.5rem, 1vw, 0.8rem)',
};

const legendItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 'clamp(0.3rem, 0.6vw, 0.5rem)',
};

const legendIconStyle = {
  width: 'clamp(1rem, 2vw, 1.2rem)',
  height: 'clamp(1rem, 2vw, 1.2rem)',
};

const mapGuideStyle = {
  margin: 'clamp(0.5rem, 1vw, 0.8rem) 0 0 0',
  fontSize: 'clamp(0.6rem, 1.2vw, 0.7rem)',
  color: '#666',
  fontStyle: 'italic',
};

const gradeTagStyle = {
  display: 'inline-block',
  padding: 'clamp(0.2rem, 0.5vw, 0.3rem) clamp(0.6rem, 1.2vw, 0.8rem)',
  borderRadius: 'clamp(0.8rem, 1.5vw, 1rem)',
  color: 'white',
  fontSize: 'clamp(0.7rem, 1.3vw, 0.8rem)',
  fontWeight: 'bold',
  textAlign: 'center',
  marginBottom: 'clamp(0.4rem, 0.8vw, 0.5rem)',
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
