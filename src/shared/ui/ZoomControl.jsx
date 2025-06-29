import { useState } from "react";
import SoftButton from "shared/ui/SoftButton";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import { useTheme, useMediaQuery } from "@mui/material";

const ZoomControl = ({
  onZoomIn,
  onZoomOut,
  onZoomChange,
  currentZoom,
  onLocationClick,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [sliderValue, setSliderValue] = useState(currentZoom || 7);
  const [isLocating, setIsLocating] = useState(false);

  const handleZoomInClick = () => {
    const newValue = Math.max(1, sliderValue - 1);
    setSliderValue(newValue);
    onZoomIn?.();
    onZoomChange?.(newValue);
  };

  const handleZoomOutClick = () => {
    const newValue = Math.min(14, sliderValue + 1);
    setSliderValue(newValue);
    onZoomOut?.();
    onZoomChange?.(newValue);
  };

  const handleLocationClick = () => {
    if (isLocating) return;

    setIsLocating(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          onLocationClick?.(latitude, longitude);
          setIsLocating(false);
        },
        (error) => {
          console.error("위치 정보를 가져올 수 없습니다:", error);
          alert(
            "위치 정보를 가져올 수 없습니다. 브라우저 설정에서 위치 권한을 허용해주세요."
          );
          setIsLocating(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    } else {
      alert("이 브라우저에서는 위치 정보를 지원하지 않습니다.");
      setIsLocating(false);
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        bottom: "40px",
        right: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "12px",
        zIndex: 10,
        ...(isMobile && {
          bottom: "20px",
          right: "20px",
          gap: "8px",
        }),
      }}
    >
      {/* 데스크탑에서 +/- 버튼 */}
      {!isMobile && (
        <>
          <SoftButton
            variant="contained"
            size="large"
            onClick={(e) => {
              handleZoomInClick();
              e.currentTarget.blur();
            }}
            sx={{
              backgroundColor: "#ffffffcc", // 기본 연둣빛
              color: "#000000",
              fontWeight: "bold",
              border: "1px solid #ccc",
              borderRadius: "8px",
              boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)",
              "&:focus": {
                outline: "none",
              },
              "&:hover": {
                backgroundColor: "#c4dabec5", // 마우스 올렸을 때
                border: "1px solid #ccc",
              },
              "&:active": {
                backgroundColor: "#afc2a9c6",
                border: "1px solid #ccc", // 누를 때 (더 진한 연둣빛)
              },
            }}
          >
            +
          </SoftButton>

          <SoftButton
            variant="contained"
            size="large"
            onClick={(e) => {
              handleZoomOutClick();
              e.currentTarget.blur(); // 버튼 포커스 제거
            }}
            sx={{
              backgroundColor: "#ffffffcc", // 기본 연둣빛
              color: "#000000",
              fontWeight: "bold",
              border: "1px solid #ccc",
              borderRadius: "8px",
              boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)",
              "&:focus": {
                outline: "none",
              },
              "&:hover": {
                backgroundColor: "#c4dabec5", // 마우스 올렸을 때
                border: "1px solid #ccc",
              },
              "&:active": {
                backgroundColor: "#afc2a9c6",
                border: "1px solid #ccc", // 누를 때 (더 진한 연둣빛)
              },
            }}
          >
            −
          </SoftButton>
        </>
      )}

      {/* 데스크탑에서 GPS 버튼을 +/- 버튼 아래에 배치 */}
      {!isMobile && (
        <SoftButton
          variant="contained"
          size="large"
          onClick={handleLocationClick}
          disabled={isLocating}
          sx={{
            backgroundColor: isLocating ? "#cccccc" : "#ffffffcc",
            color: "#000000",
            fontWeight: "bold",
            border: "1px solid #ccc",
            borderRadius: "8px",
            boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)",
            width: "40px",
            height: "40px",
            minWidth: "40px",
            minHeight: "40px",
            maxWidth: "40px",
            maxHeight: "40px",
            padding: "0 !important",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            "&:focus": {
              outline: "none",
            },
            "&:hover": {
              backgroundColor: isLocating ? "#cccccc" : "#c4dabec5",
              border: "1px solid #ccc",
            },
            "&:active": {
              backgroundColor: isLocating ? "#cccccc" : "#afc2a9c6",
              border: "1px solid #ccc",
            },
          }}
        >
          <MyLocationIcon
            sx={{
              fontSize: "1.1rem",
              animation: isLocating ? "pulse 1.5s infinite" : "none",
              "@keyframes pulse": {
                "0%": { opacity: 1 },
                "50%": { opacity: 0.5 },
                "100%": { opacity: 1 },
              },
            }}
          />
        </SoftButton>
      )}

      {/* 모바일에서 +/- 버튼 작게 표시 */}
      {isMobile && (
        <>
          <SoftButton
            variant="contained"
            size="small"
            onClick={(e) => {
              handleZoomInClick();
              e.currentTarget.blur();
            }}
            sx={{
              backgroundColor: "#ffffffcc",
              color: "#000000",
              fontWeight: "bold",
              border: "1px solid #ccc",
              borderRadius: "6px",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              width: "32px",
              height: "32px",
              minWidth: "32px",
              minHeight: "32px",
              maxWidth: "32px",
              maxHeight: "32px",
              padding: "0 !important",
              fontSize: "0.9rem",
              "&:focus": { outline: "none" },
              "&:hover": {
                backgroundColor: "#c4dabec5",
                border: "1px solid #ccc",
              },
              "&:active": {
                backgroundColor: "#afc2a9c6",
                border: "1px solid #ccc",
              },
            }}
          >
            +
          </SoftButton>

          <SoftButton
            variant="contained"
            size="small"
            onClick={(e) => {
              handleZoomOutClick();
              e.currentTarget.blur();
            }}
            sx={{
              backgroundColor: "#ffffffcc",
              color: "#000000",
              fontWeight: "bold",
              border: "1px solid #ccc",
              borderRadius: "6px",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              width: "32px",
              height: "32px",
              minWidth: "32px",
              minHeight: "32px",
              maxWidth: "32px",
              maxHeight: "32px",
              padding: "0 !important",
              fontSize: "0.9rem",
              "&:focus": { outline: "none" },
              "&:hover": {
                backgroundColor: "#c4dabec5",
                border: "1px solid #ccc",
              },
              "&:active": {
                backgroundColor: "#afc2a9c6",
                border: "1px solid #ccc",
              },
            }}
          >
            −
          </SoftButton>
        </>
      )}

      {/* GPS 버튼 - 모바일에서만 표시 */}
      {isMobile && (
        <SoftButton
          variant="contained"
          size="large"
          onClick={handleLocationClick}
          disabled={isLocating}
          sx={{
            backgroundColor: isLocating ? "#cccccc" : "#ffffffcc",
            color: "#000000",
            fontWeight: "bold",
            border: "1px solid #ccc",
            borderRadius: "8px",
            boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)",
            width: "32px",
            height: "32px",
            minWidth: "32px",
            minHeight: "32px",
            maxWidth: "32px",
            maxHeight: "32px",
            padding: "0 !important",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            "&:focus": {
              outline: "none",
            },
            "&:hover": {
              backgroundColor: isLocating ? "#cccccc" : "#c4dabec5",
              border: "1px solid #ccc",
            },
            "&:active": {
              backgroundColor: isLocating ? "#cccccc" : "#afc2a9c6",
              border: "1px solid #ccc",
            },
          }}
        >
          <MyLocationIcon
            sx={{
              fontSize: "0.9rem",
              animation: isLocating ? "pulse 1.5s infinite" : "none",
              "@keyframes pulse": {
                "0%": { opacity: 1 },
                "50%": { opacity: 0.5 },
                "100%": { opacity: 1 },
              },
            }}
          />
        </SoftButton>
      )}
    </div>
  );
};

export default ZoomControl;
