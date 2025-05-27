import { useEffect } from "react";
import SoftInput from "shared/ui/SoftInput";
import SearchIcon from "@mui/icons-material/Search";
import { loadKakaoMap } from "shared/lib/kakaoMap";

const kakaoApiKey = import.meta.env.VITE_KAKAOMAP_API_KEY;

const MountainInfoPage = () => {
  useEffect(() => {
    const initMap = () => {
      if (window.kakao?.maps) {
        window.kakao.maps.load(() => {
          loadKakaoMap({ containerId: "map" });
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
    </>
  );
};

export default MountainInfoPage;
