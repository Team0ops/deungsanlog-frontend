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
        style={{
          backgroundColor: "#ffffffcc",
          color: "#111",
          fontWeight: "bold",
          border: "1px solid #ccc",
          borderRadius: "8px",
          boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)",
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
        style={{
          backgroundColor: "#ffffffcc",
          color: "#000000",
          fontWeight: "bold",
          border: "1px solid #ddd",
          borderRadius: "8px",
        }}
      >
        −
      </SoftButton>
    </div>
  );
};

export default ZoomControl;
