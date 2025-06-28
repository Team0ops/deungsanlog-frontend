import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MountainBasicInfo from "./components/MountainBasicInfo";
import MountainImage from "./components/MountainImage";
import MountainDescription from "./components/MountainDescription";
import MountainSafetyInfo from "./components/MountainSafetyInfo";
import axiosInstance from "shared/lib/axiosInstance";

const MountainDetailPage = () => {
  const { mountainName } = useParams();
  const [mountainData, setMountainData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 산 정보 조회
  useEffect(() => {
    const fetchMountainData = async () => {
      const startTime = Date.now();
      try {
        console.log("🏔️ 산 정보 조회 시작:", mountainName);

        const token = localStorage.getItem("X-AUTH-TOKEN");

        // ✅ axios 방식으로 수정
        const response = await axiosInstance.get("/mountain-service/search", {
          params: { name: mountainName },
          headers: token ? { "X-AUTH-TOKEN": token } : {},
        });

        console.log("✅ 산 정보 조회 성공:", response.data);
        setMountainData(response.data);
        setError(null);
      } catch (error) {
        console.error("❌ API 호출 오류:", error);

        if (error.response) {
          // 서버 응답이 있는 경우 (4xx, 5xx)
          console.error("응답 상태:", error.response.status);
          console.error("응답 데이터:", error.response.data);
          setError(`산 정보 조회 실패: ${error.response.status}`);
        } else if (error.request) {
          // 요청은 전송되었으나 응답이 없는 경우
          console.error("요청 오류:", error.request);
          setError("서버에 연결할 수 없습니다.");
        } else {
          // 기타 오류
          console.error("오류:", error.message);
          setError(`오류: ${error.message}`);
        }
      } finally {
        const elapsed = Date.now() - startTime;
        const minLoading = 1500; // 1.5초
        if (elapsed < minLoading) {
          setTimeout(() => setLoading(false), minLoading - elapsed);
        } else {
          setLoading(false);
        }
      }
    };

    if (mountainName) {
      fetchMountainData();
    } else {
      setError("산 이름이 제공되지 않았습니다.");
      setLoading(false);
    }
  }, [mountainName]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
          fontSize: "clamp(1.1rem, 2vw, 1.3rem)",
          color: "#132c1d",
          background: "rgba(234, 246, 239, 0.3)",
          borderRadius: "1.5rem",
          margin: "2rem",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: "2.5rem",
            marginBottom: "1rem",
            animation: "bounce 1.2s infinite",
          }}
        >
          🐻‍❄️⛰️
        </div>
        <div>오르미가 산 정보를 찾고 있어요!</div>
        <div style={{ fontSize: "0.9rem", color: "#999", marginTop: "1rem" }}>
          조회 중인 산: <b>{mountainName}</b>
        </div>
        <style>
          {`
            @keyframes bounce {
              0%, 100% { transform: translateY(0);}
              50% { transform: translateY(-10px);}
            }
          `}
        </style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={errorStyle}>
        <div>{error}</div>
        <div style={{ fontSize: "0.8rem", color: "#666", marginTop: "1rem" }}>
          요청한 산: {mountainName}
        </div>
        <button
          onClick={() => (window.location.href = "/mountain")}
          style={backButtonStyle}
        >
          산 목록으로 돌아가기
        </button>
      </div>
    );
  }

  if (!mountainData) {
    return (
      <div style={errorStyle}>
        <div>산 정보를 찾을 수 없습니다.</div>
        <div style={{ fontSize: "0.8rem", color: "#666", marginTop: "1rem" }}>
          요청한 산: {mountainName}
        </div>
      </div>
    );
  }

  const { mountain, description, sunInfoList, weatherInfo, fireRiskInfo } =
    mountainData;

  return (
    <div style={containerStyle}>
      <MountainBasicInfo mountain={mountain} description={description} />
      <MountainImage mountain={mountain} />
      <main>
        <div style={contentLayoutStyle}>
          <div style={{ flex: "2", minWidth: "0" }}>
            <MountainDescription description={description} />
          </div>

          <div style={{ flex: "1", minWidth: "300px" }}>
            <MountainSafetyInfo
              weatherInfo={weatherInfo}
              fireRiskInfo={fireRiskInfo}
              sunInfoList={sunInfoList}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

// 스타일 정의들...
const containerStyle = {
  width: "100%",
  maxWidth: "1200px",
  margin: "0",
  padding: "clamp(0.5rem, 1.5vw, 1rem)",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  minHeight: "100vh",
  overflowX: "hidden",
};

const contentLayoutStyle = {
  display: "flex",
  flexDirection: window.innerWidth <= 768 ? "column" : "row",
  gap: "clamp(1rem, 2vw, 2rem)",
  alignItems: "flex-start",
  width: "100%",
  maxWidth: "100%",
};

const errorStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  height: "50vh",
  fontSize: "clamp(1rem, 2vw, 1.2rem)",
  color: "#e74c3c",
  gap: "1rem",
};

const backButtonStyle = {
  padding: "0.8rem 1.5rem",
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "0.5rem",
  cursor: "pointer",
  fontSize: "clamp(0.9rem, 1.5vw, 1rem)",
};

export default MountainDetailPage;
