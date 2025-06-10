import { Box } from "@mui/material";
import GreenButton from "shared/ui/greenButton";
import GreenInput from "shared/ui/greenInput";

const MountainInputWidget = ({
  value,
  onChange,
  onSearchClick,
  error,
  errorMessage,
}) => (
  <Box display="flex" alignItems="center" width="100%">
    <GreenInput
      value={value}
      onChange={onChange}
      error={error}
      errorMessage={errorMessage}
      placeholder="산을 검색하거나 입력해주세요."
      style={{
        width: "100%",
        height: "2.7rem",
        marginBottom: "1.0rem",
        fontSize: "1.0rem",
        flex: 1,
        border: `2px solid ${error ? "#dc3545" : "#70a784"}`,
      }}
    />
    <Box width="2.5rem" /> {/* Placeholder for spacing */}
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

export default MountainInputWidget;
