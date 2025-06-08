import { useState } from "react";
import SoftButton from "shared/ui/SoftButton";

const ZoomControl = ({ onZoomIn, onZoomOut, onZoomChange, currentZoom }) => {
  const [sliderValue, setSliderValue] = useState(currentZoom || 7);

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
      }}
    >
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
    </div>
  );
};

export default ZoomControl;
