import React from "react";

const MountainSafetyInfo = ({ weatherInfo, fireRiskInfo, sunInfoList }) => {
  // 날씨 상태에 따른 아이콘 반환 함수
  const getWeatherIcon = (weather) => {
    if (!weather) return "🌤️";

    if (weather.includes("맑음")) return "☀️";
    if (weather.includes("구름많음")) return "⛅";
    if (weather.includes("흐림")) return "☁️";
    if (weather.includes("비")) return "🌧️";
    if (weather.includes("눈")) return "❄️";
    if (weather.includes("안개")) return "🌫️";

    return "🌤️"; // 기본값
  };

  // 날씨 상태에 따른 색상 반환 함수
  const getWeatherColor = (weather) => {
    if (!weather) return "#007bff";

    if (weather.includes("맑음")) return "#ffc107"; // 노란색
    if (weather.includes("구름많음")) return "#6c757d"; // 회색
    if (weather.includes("흐림")) return "#495057"; // 진한 회색
    if (weather.includes("비")) return "#6c757d"; // 회색
    if (weather.includes("눈")) return "#17a2b8"; // 하늘색
    if (weather.includes("안개")) return "#adb5bd"; // 연한 회색

    return "#007bff"; // 기본 파란색
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = [
      "일요일",
      "월요일",
      "화요일",
      "수요일",
      "목요일",
      "금요일",
      "토요일",
    ][date.getDay()];
    return `${year}년 ${month}월 ${day}일, ${dayOfWeek}`;
  };

  // 시간 포맷팅 함수
  const formatTime = (timeStr) => {
    if (!timeStr) return "-";
    const [hours, minutes] = timeStr.split(":");
    const hour = parseInt(hours);
    const minute = parseInt(minutes);
    const period = hour < 12 ? "오전" : "오후";
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${period} ${displayHour}시 ${minute}분`;
  };

  // 요일 포맷팅 함수 (간단한 형태)
  const formatDayOfWeek = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    const dayOfWeek = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}/${day} (${dayOfWeek})`;
  };

  const realtimeCardsStyle = {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(clamp(12rem, 20vw, 16rem), 1fr))",
    gap: "clamp(0.8rem, 1.5vw, 1rem)",
    marginBottom: "clamp(1rem, 2vw, 1.5rem)",
  };

  const cardStyle = {
    backgroundColor: "#ffffff",
    borderRadius: "0.8rem",
    padding: "clamp(0.8rem, 1.5vw, 1rem)",
    boxShadow: "0 0.1rem 0.5rem rgba(0,0,0,0.08)",
    border: "0.1rem solid #e9ecef",
  };

  const cardTitleStyle = {
    fontSize: "clamp(1rem, 1.8vw, 1.2rem)",
    fontWeight: "600",
    marginBottom: "clamp(0.5rem, 1vw, 0.8rem)",
    color: "#2c3e50",
  };

  const todayCardStyle = {
    backgroundColor: "#f8f9fa",
    borderRadius: "0.6rem",
    padding: "0.8rem",
    marginBottom: "0.8rem",
    border: "1px solid #e9ecef",
  };

  const todayTitleStyle = {
    fontSize: "clamp(0.8rem, 1.3vw, 0.9rem)",
    fontWeight: "600",
    color: "#4c7559",
    marginBottom: "0.4rem",
  };

  const todayTimeStyle = {
    fontSize: "clamp(1rem, 1.5vw, 1.1rem)",
    fontWeight: "700",
    color: "#2c3e50",
  };

  const tableContainerStyle = {
    overflowX: "auto",
    maxWidth: "100%",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "clamp(0.7rem, 1.1vw, 0.8rem)",
  };

  const thStyle = {
    backgroundColor: "#f8f9fa",
    padding: "0.4rem 0.6rem",
    textAlign: "center",
    borderBottom: "1px solid #dee2e6",
    fontWeight: "600",
    color: "#495057",
  };

  const tdStyle = {
    padding: "0.4rem 0.6rem",
    textAlign: "center",
    borderBottom: "1px solid #dee2e6",
    color: "#6c757d",
  };

  // 일출/일몰 데이터가 배열인지 확인하고 처리
  const sunDataArray = Array.isArray(sunInfoList) ? sunInfoList : [];
  const dayLabels = ["오늘", "내일", "모레", "글피", "그글피", "사흘", "나흘"];

  // 1주일치 날씨 데이터 확인
  const weeklyWeather = weatherInfo?.weeklyWeather || [];

  return (
    <div>
      <div style={realtimeCardsStyle}>
        {/* 날씨 카드 (실시간 + 1주일 예보 통합) */}
        <div style={cardStyle}>
          <h3 style={cardTitleStyle}>
            {getWeatherIcon(weatherInfo?.currentWeather?.weather)} 날씨 정보
          </h3>

          {/* 실시간 날씨 */}
          {weatherInfo?.currentWeather && !weatherInfo.error ? (
            <div style={{ marginBottom: "1rem" }}>
              <div
                style={{
                  fontSize: "clamp(1.5rem, 3vw, 2rem)",
                  fontWeight: "700",
                  color: getWeatherColor(weatherInfo.currentWeather.weather),
                }}
              >
                {weatherInfo.currentWeather.temperature}
              </div>
              <div
                style={{
                  fontSize: "clamp(1rem, 1.5vw, 1.1rem)",
                  fontWeight: "600",
                  color: getWeatherColor(weatherInfo.currentWeather.weather),
                  marginBottom: "0.5rem",
                }}
              >
                {weatherInfo.currentWeather.weather}
              </div>
              <div
                style={{
                  fontSize: "clamp(0.8rem, 1.3vw, 0.9rem)",
                  color: "#6c757d",
                }}
              >
                <div>습도: {weatherInfo.currentWeather.humidity}</div>
                <div>바람: {weatherInfo.currentWeather.windSpeed}</div>
                <div>
                  강수:{" "}
                  {weatherInfo.currentWeather.precipitation === "0" ||
                  weatherInfo.currentWeather.precipitation === 0
                    ? "없음"
                    : `${weatherInfo.currentWeather.precipitation}mm`}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ color: "#6c757d", marginBottom: "1rem" }}>
              날씨 정보 없음
            </div>
          )}

          {/* 1주일치 날씨 예보 */}
          {weeklyWeather.length > 0 && (
            <div>
              <div
                style={{
                  fontSize: "clamp(0.9rem, 1.4vw, 1rem)",
                  fontWeight: "600",
                  color: "#495057",
                  marginBottom: "0.5rem",
                  borderTop: "1px solid #e9ecef",
                  paddingTop: "0.5rem",
                }}
              >
                📅 1주일 예보
              </div>
              <div style={tableContainerStyle}>
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th style={thStyle}>날짜</th>
                      <th style={thStyle}>날씨</th>
                      <th style={thStyle}>기온</th>
                      <th style={thStyle}>강수</th>
                    </tr>
                  </thead>
                  <tbody>
                    {weeklyWeather.map((day, index) => (
                      <tr key={index}>
                        <td style={tdStyle}>{formatDayOfWeek(day.date)}</td>
                        <td style={tdStyle}>
                          <span style={{ fontSize: "1.2rem" }}>
                            {getWeatherIcon(day.weather)}
                          </span>
                          <br />
                          <span style={{ fontSize: "0.7rem" }}>
                            {day.weather}
                          </span>
                        </td>
                        <td style={tdStyle}>
                          <span
                            style={{
                              fontWeight: "600",
                              color: getWeatherColor(day.weather),
                            }}
                          >
                            {day.temperature}
                          </span>
                        </td>
                        <td style={tdStyle}>
                          {day.precipitation === "0" || day.precipitation === 0
                            ? "없음"
                            : `${day.precipitation}mm`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* 산불위험도 카드 */}
        <div style={cardStyle}>
          <h3 style={cardTitleStyle}>🔥 산불위험예보</h3>
          {fireRiskInfo && !fireRiskInfo.error ? (
            <div>
              <div
                style={{
                  fontSize: "clamp(1.2rem, 2.5vw, 1.5rem)",
                  fontWeight: "700",
                  color:
                    fireRiskInfo.riskLevelCode === "1"
                      ? "#28a745"
                      : fireRiskInfo.riskLevelCode === "2"
                      ? "#ffc107"
                      : "#dc3545",
                }}
              >
                {fireRiskInfo.riskLevel}
              </div>
              <div
                style={{
                  fontSize: "clamp(0.8rem, 1.3vw, 0.9rem)",
                  color: "#6c757d",
                }}
              >
                {fireRiskInfo.description}
              </div>
            </div>
          ) : (
            <div style={{ color: "#6c757d" }}>산불정보 없음</div>
          )}
        </div>

        {/* 일출/일몰 카드 */}
        <div style={cardStyle}>
          <h3 style={cardTitleStyle}>🌅 일출/일몰</h3>
          {sunDataArray && sunDataArray.length > 0 ? (
            <div>
              {/* 오늘 날짜 - 크게 표시 */}
              <div style={todayCardStyle}>
                <div style={todayTitleStyle}>
                  오늘_
                  {formatDate(sunDataArray[0]?.date)
                    .replace("년 ", "년")
                    .replace("월 ", "월")
                    .replace("일 ", "일 ")
                    .replace(")", "")}
                </div>
                <div style={todayTimeStyle}>
                  <div>🌅일출: {formatTime(sunDataArray[0]?.sunriseTime)}</div>
                  <div>🌇일몰: {formatTime(sunDataArray[0]?.sunsetTime)}</div>
                </div>
              </div>

              {/* 나머지 6일 - 테이블로 표시 */}
              {sunDataArray.length > 1 && (
                <div style={tableContainerStyle}>
                  <table style={tableStyle}>
                    <thead>
                      <tr>
                        <th style={thStyle}>날짜</th>
                        <th style={thStyle}>일출</th>
                        <th style={thStyle}>일몰</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sunDataArray.slice(1).map((day, index) => (
                        <tr key={index + 1}>
                          <td style={tdStyle}>
                            {dayLabels[index + 1]}
                            <br />
                            <span
                              style={{ fontSize: "0.7rem", color: "#adb5bd" }}
                            >
                              {formatDate(day.date)}
                            </span>
                          </td>
                          <td style={tdStyle}>{formatTime(day.sunriseTime)}</td>
                          <td style={tdStyle}>{formatTime(day.sunsetTime)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <div style={{ color: "#6c757d" }}>일출/일몰 정보 없음</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MountainSafetyInfo;
