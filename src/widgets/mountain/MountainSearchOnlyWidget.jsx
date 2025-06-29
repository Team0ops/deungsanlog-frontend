import { Box } from "@mui/material";
import GreenButton from "shared/ui/greenButton";
import GreenInput from "shared/ui/greenInput";

const MountainSearchOnlyWidget = ({
  value,
  onSearchClick,
  error,
  errorMessage,
}) => {
  return (
    <Box display="flex" alignItems="center" width="100%">
      <GreenInput
        value={typeof value === "object" ? value?.name || "" : value || ""}
        readOnly
        error={error}
        errorMessage={errorMessage}
        placeholder="산 이름을 검색해주세요."
        style={{
          width: "100%",
          height: "2.7rem",
          marginBottom: "1.0rem",
          fontSize: "1.0rem",
          flex: 1,
          border: `2px solid ${error ? "#dc3545" : "#70a784"}`,
          background: "#f4f4f4", // 비활성 느낌을 줄 수 있음
          cursor: "pointer",
        }}
        onClick={onSearchClick}
      />
      <Box width="1.5rem" />
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
    </Box>
  );
};

export default MountainSearchOnlyWidget;
