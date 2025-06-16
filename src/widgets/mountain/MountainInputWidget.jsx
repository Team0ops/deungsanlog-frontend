import { useState } from "react";
import { Box } from "@mui/material";
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
    <Box display="flex" alignItems="center" width="100%">
      <GreenInput
        value={
          directInput
            ? tempValue
            : typeof value === "object"
            ? value?.name
            : value
        }
        onChange={directInput ? (e) => setTempValue(e.target.value) : undefined}
        readOnly={!directInput} // ✅ 여기로 변경
        error={error}
        errorMessage={errorMessage}
        placeholder="산 이름을 입력하세요."
        style={{
          width: "100%",
          height: "2.7rem",
          marginBottom: "1.0rem",
          fontSize: "1.0rem",
          flex: 1,
          border: `2px solid ${error ? "#dc3545" : "#70a784"}`,
        }}
      />
      <Box width="1.5rem" />
      {!directInput ? (
        <>
          <GreenButton
            type="button"
            style={{
              height: "2.7rem",
              fontSize: "1rem",
              padding: "0 1.2rem",
              marginBottom: "1.0rem",
              background: "#70a784",
              color: "#ffffff",
              whiteSpace: "nowrap",
            }}
            onClick={onSearchClick}
          >
            산 검색
          </GreenButton>
          <Box width="1.5rem" />
          <GreenButton
            type="button"
            style={{
              height: "2.7rem",
              fontSize: "1rem",
              padding: "0 1.2rem",
              marginBottom: "1.0rem",
              background: "#72927f",
              color: "#ffffff",
              whiteSpace: "nowrap",
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
              height: "2.7rem",
              fontSize: "1rem",
              padding: "0 1.2rem",
              marginBottom: "1.0rem",
              background: "#72927f",
              color: "#fff",
              whiteSpace: "nowrap",
            }}
            onClick={handleCancel}
          >
            취소
          </GreenButton>
          <Box width="1.5rem" />
          <GreenButton
            type="button"
            style={{
              height: "2.7rem",
              fontSize: "1rem",
              padding: "0 1.2rem",
              marginBottom: "1.0rem",
              background: "#70a784",
              color: "#fff",
              whiteSpace: "nowrap",
            }}
            onClick={handleApply}
            disabled={!tempValue.trim()}
          >
            적용
          </GreenButton>
        </>
      )}
    </Box>
  );
};

export default MountainInputWidget;
