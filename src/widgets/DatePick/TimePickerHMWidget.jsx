import React from "react";

const hours = Array.from({ length: 24 }, (_, i) => i);
const minutes = Array.from({ length: 60 }, (_, i) => i);

const TimePickerHMWidget = ({
  value,
  onChange,
  required = false,
  error = false,
  errorMessage = "",
}) => {
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

  return (
    <div
      style={{
        display: "flex",
        gap: "0.7rem",
        alignItems: "center",
        marginBottom: "1rem",
      }}
    >
      <select
        value={h !== "" ? h : ""}
        onChange={(e) => handleChange("hour", e.target.value)}
        required={required}
        style={{
          border: `2px solid ${error ? "#dc3545" : "#70a784"}`,
          borderRadius: 8,
          padding: "0.4em 0.7em",
          fontSize: "1.05rem",
        }}
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
        style={{
          border: `2px solid ${error ? "#dc3545" : "#70a784"}`,
          borderRadius: 8,
          padding: "0.4em 0.7em",
          fontSize: "1.05rem",
        }}
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
            fontSize: "0.97rem",
            marginLeft: "0.7rem",
          }}
        >
          {errorMessage}
        </span>
      )}
    </div>
  );
};

export default TimePickerHMWidget;
