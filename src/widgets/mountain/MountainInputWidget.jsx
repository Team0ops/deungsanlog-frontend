import { useState } from "react";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import GreenButton from "shared/ui/greenButton";
import GreenInput from "shared/ui/greenInput";

const MountainInputWidget = ({
  value = "",
  onChange,
  onSearchClick,
  error,
  errorMessage,
}) => {
  const [directInput, setDirectInput] = useState(false);
  const [tempValue, setTempValue] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // 직접입력 모드 진입
  const handleDirectInput = () => {
    setTempValue("");
    setDirectInput(true);
  };

  // 직접입력 취소
  const handleCancel = () => {
    setDirectInput(false);
    setTempValue("");
  };

  // 직접입력 적용
  const handleApply = () => {
    onChange({
      target: {
        value: { id: null, name: tempValue, location: "" },
      },
    });
    setDirectInput(false);
  };

  return (
    <Box width="100%">
      <GreenInput
        value={
          directInput
            ? tempValue
            : typeof value === "object"
            ? value?.name
            : value
        }
        onChange={directInput ? (e) => setTempValue(e.target.value) : undefined}
        readOnly={!directInput}
        error={error}
        errorMessage={errorMessage}
        placeholder="산 이름을 입력하세요."
        style={{
          width: "100%",
          height: isMobile ? "2.3rem" : "2.7rem",
          marginBottom: isMobile ? "0.7rem" : "1.0rem",
          fontSize: isMobile ? "0.98rem" : "1.0rem",
          border: `2px solid ${error ? "#dc3545" : "#70a784"}`,
        }}
      />
      <Box
        display="flex"
        flexDirection="row"
        gap={isMobile ? 1 : 2}
        width="100%"
      >
        {!directInput ? (
          <>
            <GreenButton
              type="button"
              style={{
                height: isMobile ? "2.3rem" : "2.7rem",
                fontSize: isMobile ? "0.98rem" : "1rem",
                padding: isMobile ? "0 0.7rem" : "0 1.2rem",
                background: "#70a784",
                color: "#ffffff",
                whiteSpace: "nowrap",
                width: "50%",
              }}
              onClick={onSearchClick}
            >
              산 검색
            </GreenButton>
            <GreenButton
              type="button"
              style={{
                height: isMobile ? "2.3rem" : "2.7rem",
                fontSize: isMobile ? "0.98rem" : "1rem",
                padding: isMobile ? "0 0.7rem" : "0 1.2rem",
                background: "#72927f",
                color: "#ffffff",
                whiteSpace: "nowrap",
                width: "50%",
              }}
              onClick={handleDirectInput}
            >
              직접입력
            </GreenButton>
          </>
        ) : (
          <>
            <GreenButton
              type="button"
              style={{
                height: isMobile ? "2.3rem" : "2.7rem",
                fontSize: isMobile ? "0.98rem" : "1rem",
                padding: isMobile ? "0 0.7rem" : "0 1.2rem",
                background: "#72927f",
                color: "#fff",
                whiteSpace: "nowrap",
                width: "50%",
              }}
              onClick={handleCancel}
            >
              취소
            </GreenButton>
            <GreenButton
              type="button"
              style={{
                height: isMobile ? "2.3rem" : "2.7rem",
                fontSize: isMobile ? "0.98rem" : "1rem",
                padding: isMobile ? "0 0.7rem" : "0 1.2rem",
                background: "#70a784",
                color: "#fff",
                whiteSpace: "nowrap",
                width: "50%",
              }}
              onClick={handleApply}
              disabled={!tempValue.trim()}
            >
              적용
            </GreenButton>
          </>
        )}
      </Box>
    </Box>
  );
};

export default MountainInputWidget;
