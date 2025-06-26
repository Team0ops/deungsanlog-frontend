import React, { useEffect, useState } from "react";

const years = [2025, 2026]; // 년도 2025, 2026만 선택 가능
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
  const [year, setYear] = useState();
  const [month, setMonth] = useState();
  const [day, setDay] = useState();

  // 외부 value가 변경되면 내부 상태 업데이트
  useEffect(() => {
    if (value) {
      const [y, m, d] = value.split("-").map(Number);
      setYear(y);
      setMonth(m);
      setDay(d);
    } else {
      setYear(undefined);
      setMonth(undefined);
      setDay(undefined);
    }
  }, [value]);

  // 날짜 선택 시 조합해서 전달
  const updateDate = (y, m, d) => {
    if (y && m && d) {
      const dateStr = `${y.toString().padStart(4, "0")}-${m
        .toString()
        .padStart(2, "0")}-${d.toString().padStart(2, "0")}`;
      onChange(dateStr);
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
      <select
        value={year || ""}
        onChange={(e) => {
          const y = Number(e.target.value);
          setYear(y);
          updateDate(y, month, day);
        }}
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
        onChange={(e) => {
          const m = Number(e.target.value);
          setMonth(m);
          updateDate(year, m, day);
        }}
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
        onChange={(e) => {
          const d = Number(e.target.value);
          setDay(d);
          updateDate(year, month, d);
        }}
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
