import React from "react";

const years = Array.from(
  { length: 100 },
  (_, i) => new Date().getFullYear() - i
);
const months = Array.from({ length: 12 }, (_, i) => i + 1);

function getDays(year, month) {
  if (!year || !month) return [];
  const last = new Date(year, month, 0).getDate();
  return Array.from({ length: last }, (_, i) => i + 1);
}

const DatePickerYMDWidget = ({
  value,
  onChange,
  required = false,
  error = false,
  errorMessage = "",
  minYear,
  maxYear,
}) => {
  const [year, month, day] = value
    ? value.split("-").map(Number)
    : [undefined, undefined, undefined];

  const handleChange = (type, val) => {
    let y = year,
      m = month,
      d = day;
    if (type === "year") y = Number(val);
    if (type === "month") m = Number(val);
    if (type === "day") d = Number(val);
    if (y && m && d) {
      onChange(
        `${y.toString().padStart(4, "0")}-${m.toString().padStart(2, "0")}-${d
          .toString()
          .padStart(2, "0")}`
      );
    } else {
      onChange("");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "0.7rem",
        marginBottom: "1rem",
        alignItems: "center",
      }}
    >
      {/* <label style={{ minWidth: 40, fontWeight: 600 }}>{label}</label> */}
      <select
        value={year || ""}
        onChange={(e) => handleChange("year", e.target.value)}
        required={required}
        style={{
          border: `2px solid ${error ? "#dc3545" : "#70a784"}`,
          borderRadius: 8,
          padding: "0.4em 0.7em",
          fontSize: "1.05rem",
        }}
      >
        <option value="">년도</option>
        {years
          .filter(
            (y) => (!minYear || y >= minYear) && (!maxYear || y <= maxYear)
          )
          .map((y) => (
            <option key={y} value={y}>
              {y}년
            </option>
          ))}
      </select>
      <select
        value={month || ""}
        onChange={(e) => handleChange("month", e.target.value)}
        required={required}
        style={{
          border: `2px solid ${error ? "#dc3545" : "#70a784"}`,
          borderRadius: 8,
          padding: "0.4em 0.7em",
          fontSize: "1.05rem",
        }}
      >
        <option value="">월</option>
        {months.map((m) => (
          <option key={m} value={m}>
            {m}월
          </option>
        ))}
      </select>
      <select
        value={day || ""}
        onChange={(e) => handleChange("day", e.target.value)}
        required={required}
        style={{
          border: `2px solid ${error ? "#dc3545" : "#70a784"}`,
          borderRadius: 8,
          padding: "0.4em 0.7em",
          fontSize: "1.05rem",
        }}
      >
        <option value="">일</option>
        {getDays(year, month).map((d) => (
          <option key={d} value={d}>
            {d}일
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

export default DatePickerYMDWidget;
