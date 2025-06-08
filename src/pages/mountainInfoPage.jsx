import { useEffect, useRef, useState } from "react";
import SoftInput from "shared/ui/SoftInput";
import SearchIcon from "@mui/icons-material/Search";
import { loadKakaoMap } from "shared/lib/kakaoMap";
import ZoomControl from "shared/ui/ZoomControl"; // 상대 경로에 맞게 조정 필요

const kakaoApiKey = import.meta.env.VITE_KAKAOMAP_API_KEY;

const MountainInfoPage = () => {
  const mapRef = useRef(null); // 카카오맵 객체 저장용
  const [mapLoaded, setMapLoaded] = useState(false);

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
      <div
        style={{
          position: "absolute",
          top: "32px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          width: "500px",
        }}
      >
        <SoftInput
          placeholder="산 이름을 검색하세요"
          icon={{ component: <SearchIcon />, direction: "right" }}
          size="large"
          style={{
            fontSize: "1.2rem",
            py: 2,
            px: 3,
          }}
          fullWidth
        />
      </div>
      {mapLoaded && (
        <div
          style={{
            position: "fixed", // 화면 기준으로 고정
            bottom: "10px", // 하단 여백
            right: "32px", // 우측 여백
            zIndex: 10, // 맵보다 위에 뜨도록
          }}
        >
          <ZoomControl onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} />
        </div>
      )}
    </>
  );
};

export default MountainInfoPage;
