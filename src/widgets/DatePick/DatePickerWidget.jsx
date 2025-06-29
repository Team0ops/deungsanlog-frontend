import GreenInput from "shared/ui/greenInput";
import { useTheme, useMediaQuery } from "@mui/material";

const DatePickerWidget = ({
  label,
  value,
  onChange,
  required = false,
  error = false,
  errorMessage,
  sx = {},
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <GreenInput
      type="date"
      value={value}
      onChange={onChange}
      error={error}
      errorMessage={errorMessage}
      placeholder={label}
      style={{
        width: "100%",
        height: isMobile ? "2.5rem" : "2.7rem",
        marginBottom: isMobile ? "0.8rem" : "1.0rem",
        fontSize: isMobile ? "0.95rem" : "1.0rem",
        fontFamily: "inherit",
        flex: 1,
        border: `2px solid ${error ? "#dc3545" : "#70a784"}`,
        color: value ? "#222" : "#6e6e6e",
        padding: isMobile ? "0.6rem 0.8rem" : "0.75rem 1rem",
        borderRadius: isMobile ? "10px" : "12px",
        // 모바일에서 날짜 선택기 최적화
        ...(isMobile && {
          // iOS Safari에서 날짜 선택기 스타일 개선
          WebkitAppearance: "none",
          MozAppearance: "none",
          appearance: "none",
          // 모바일에서 터치 영역 확대
          minHeight: "44px",
          // 모바일에서 포커스 시 줌 방지
          fontSize: "16px",
        }),
        ...sx,
      }}
      required={required}
    />
  );
};

export default DatePickerWidget;
