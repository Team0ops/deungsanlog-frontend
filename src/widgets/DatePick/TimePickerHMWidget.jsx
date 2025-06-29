import React from "react";
import { useTheme, useMediaQuery } from "@mui/material";

const hours = Array.from({ length: 24 }, (_, i) => i);
const minutes = Array.from({ length: 60 }, (_, i) => i);

const TimePickerHMWidget = ({
  value,
  onChange,
  required = false,
  error = false,
  errorMessage = "",
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [h, m] = value
    ? value.split(":").map((v) => (v === "" ? "" : Number(v)))
    : ["", ""];

  const handleChange = (type, val) => {
    let hour = h;
    let min = m;

    if (type === "hour") hour = val === "" ? "" : Number(val);
    if (type === "minute") min = val === "" ? "" : Number(val);

    // 시 또는 분 중 하나만 있어도 반영
    const formatted =
      (hour !== "" ? hour.toString().padStart(2, "0") : "--") +
      ":" +
      (min !== "" ? min.toString().padStart(2, "0") : "--");

    onChange(formatted);
  };

  const selectStyle = {
    border: `2px solid ${error ? "#dc3545" : "#70a784"}`,
    borderRadius: isMobile ? "12px" : "8px",
    padding: isMobile ? "0.8em 1em" : "0.4em 0.7em",
    fontSize: isMobile ? "clamp(1rem, 4vw, 1.1rem)" : "1.05rem",
    width: isMobile ? "100%" : "auto",
    minHeight: isMobile ? "48px" : "auto",
    cursor: "pointer",
    backgroundColor: "#fdfdfd",
    outline: "none",
    appearance: "none",
    backgroundImage:
      "url(\"data:image/svg+xml;utf8,<svg fill='Green' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>\")",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 1rem center",
    backgroundSize: "16px 16px",
  };

  return (
    <div
      style={{
        display: "flex",
        gap: isMobile ? "0.5rem" : "0.7rem",
        alignItems: "center",
        marginBottom: "1rem",
        flexDirection: isMobile ? "column" : "row",
        width: "100%",
      }}
    >
      <select
        value={h !== "" ? h : ""}
        onChange={(e) => handleChange("hour", e.target.value)}
        required={required}
        style={selectStyle}
      >
        <option value="">시</option>
        {hours.map((hour) => (
          <option key={hour} value={hour}>
            {hour}시
          </option>
        ))}
      </select>

      <select
        value={m !== "" ? m : ""}
        onChange={(e) => handleChange("minute", e.target.value)}
        required={required}
        style={selectStyle}
      >
        <option value="">분</option>
        {minutes.map((min) => (
          <option key={min} value={min}>
            {min}분
          </option>
        ))}
      </select>

      {error && (
        <span
          style={{
            color: "#dc3545",
            fontSize: isMobile ? "clamp(0.9rem, 3vw, 0.97rem)" : "0.97rem",
            marginLeft: isMobile ? "0" : "0.7rem",
            marginTop: isMobile ? "0.5rem" : "0",
            textAlign: isMobile ? "center" : "left",
            width: "100%",
          }}
        >
          {errorMessage}
        </span>
      )}
    </div>
  );
};

export default TimePickerHMWidget;
