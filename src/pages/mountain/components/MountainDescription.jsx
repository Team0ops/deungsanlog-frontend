import React, { useState } from "react";

const MountainDescription = ({ description }) => {
  const [selectedTab, setSelectedTab] = useState("basic");

  const tabNavigationStyle = {
    display: "flex",
    borderBottom: "0.1rem solid #dee2e6",
    marginBottom: "clamp(0.8rem, 1.5vw, 1rem)",
    overflowX: "auto",
  };

  const tabButtonStyle = (isActive) => ({
    padding: "clamp(0.8rem, 1.5vw, 1rem) clamp(1rem, 2vw, 1.5rem)",
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    borderRadius: "0",
    outline: "none",
    fontSize: "clamp(0.9rem, 1.5vw, 1rem)",
    fontWeight: isActive ? "600" : "400",
    color: isActive ? "#074623" : "#6c757d",
    borderBottom: isActive
      ? "0.2rem solid #0d3d15"
      : "0.2rem solid transparent",
    transition: "all 0.3s ease",
    whiteSpace: "nowrap",
  });

  const detailSectionStyle = {
    backgroundColor: "#ffffff",
    borderRadius: "1rem",
    padding: "clamp(1.5rem, 3vw, 2rem)",
    boxShadow: "0 0.2rem 1rem rgba(0,0,0,0.1)",
  };

  const contentTextStyle = {
    fontSize: "clamp(0.9rem, 1.5vw, 1rem)",
    lineHeight: "1.6",
    color: "#495057",
    marginBottom: "clamp(1rem, 2vw, 1.5rem)",
  };

  // 문장을 '.' 기준으로 나누어 줄바꿈 추가하는 함수
  const formatTextWithLineBreaks = (text) => {
    if (!text) return "";
    return text.replace(/\. /g, ".<br>").replace(/\.$/g, ".<br>");
  };

  // 표 스타일을 위한 CSS 추가
  const tableStyles = `
    <style>
      table {
        border-collapse: collapse;
        width: 100%;
        margin: 1rem 0;
        background: #fff;
        border-radius: 0.5rem;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      }
      th, td {
        border: none;
        padding: 0.8rem 1rem;
        text-align: left;
        vertical-align: top;
      }
      th {
        background-color: #f8f9fa;
        font-weight: 600;
        color: #495057;
        border-bottom: 2px solid #dee2e6;
      }
      tr {
        border-bottom: 1px solid #e9ecef;
      }
      tr:last-child {
        border-bottom: none;
      }
      tr:nth-child(even) {
        background-color: #f8f9fa;
      }
      .table-container {
        overflow-x: auto;
        margin: 1rem 0;
      }
      p {
        white-space: pre-line;
        line-height: 1.8;
        margin-bottom: 0.8rem;
      }
      p:last-child {
        margin-bottom: 0;
      }
    </style>
  `;

  return (
    <div>
      {/* 탭 네비게이션 */}
      <nav style={tabNavigationStyle}>
        <button
          style={tabButtonStyle(selectedTab === "basic")}
          onClick={() => setSelectedTab("basic")}
        >
          기본정보
        </button>
        <button
          style={tabButtonStyle(selectedTab === "course")}
          onClick={() => setSelectedTab("course")}
        >
          등산코스
        </button>
        <button
          style={tabButtonStyle(selectedTab === "transport")}
          onClick={() => setSelectedTab("transport")}
        >
          교통정보
        </button>
        <button
          style={tabButtonStyle(selectedTab === "nearby")}
          onClick={() => setSelectedTab("nearby")}
        >
          주변관광
        </button>
      </nav>

      {/* 상세 정보 섹션 */}
      <section style={detailSectionStyle}>
        {selectedTab === "basic" && (
          <div>
            <h3
              style={{
                fontSize: "clamp(1.3rem, 2.5vw, 1.5rem)",
                marginBottom: "clamp(1rem, 2vw, 1.5rem)",
              }}
            >
              산 정보
            </h3>
            <div style={contentTextStyle}>
              {description?.summary ||
                description?.fullDescription ||
                "상세 정보가 없습니다."}
            </div>

            {description?.hikingPointInfo && (
              <>
                <h3
                  style={{
                    fontSize: "clamp(1.1rem, 2vw, 1.3rem)",
                    marginBottom: "clamp(0.8rem, 1.5vw, 1rem)",
                  }}
                >
                  이 산의 매력
                </h3>
                <div
                  style={contentTextStyle}
                  dangerouslySetInnerHTML={{
                    __html: formatTextWithLineBreaks(
                      description.hikingPointInfo
                    ),
                  }}
                />
              </>
            )}
          </div>
        )}

        {selectedTab === "course" && (
          <div>
            <h2
              style={{
                fontSize: "clamp(1.3rem, 2.5vw, 1.5rem)",
                marginBottom: "clamp(1rem, 2vw, 1.5rem)",
              }}
            >
              등산 코스
            </h2>
            <div
              style={contentTextStyle}
              dangerouslySetInnerHTML={{
                __html:
                  tableStyles +
                    formatTextWithLineBreaks(description?.hikingCourseInfo) ||
                  "<p>등산 코스 정보가 없습니다.</p>",
              }}
            />
          </div>
        )}

        {selectedTab === "transport" && (
          <div>
            <h2
              style={{
                fontSize: "clamp(1.3rem, 2.5vw, 1.5rem)",
                marginBottom: "clamp(1rem, 2vw, 1.5rem)",
              }}
            >
              교통 정보
            </h2>
            <div
              style={contentTextStyle}
              dangerouslySetInnerHTML={{
                __html:
                  tableStyles +
                    formatTextWithLineBreaks(description?.transportInfo) ||
                  "<p>교통 정보가 없습니다.</p>",
              }}
            />
          </div>
        )}

        {selectedTab === "nearby" && (
          <div>
            <h2
              style={{
                fontSize: "clamp(1.3rem, 2.5vw, 1.5rem)",
                marginBottom: "clamp(1rem, 2vw, 1.5rem)",
              }}
            >
              주변 관광지
            </h2>
            <div
              style={contentTextStyle}
              dangerouslySetInnerHTML={{
                __html:
                  tableStyles +
                    formatTextWithLineBreaks(description?.nearbyTourInfo) ||
                  "<p>주변 관광 정보가 없습니다.</p>",
              }}
            />
          </div>
        )}
      </section>
    </div>
  );
};

export default MountainDescription;
