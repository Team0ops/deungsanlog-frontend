import { useEffect, useState } from "react";
import axiosInstance from "shared/lib/axiosInstance";
import HotMountainCard from "./HotMountainCard";

const HotMountainList = () => {
  const [hotMountains, setHotMountains] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/record-service/hot-mountains")
      .then((res) => setHotMountains(res.data || []))
      .catch(() => setHotMountains([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "500px",
        minHeight: "20vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderRadius: "20px",
        padding: "clamp(1rem, 4vw, 1.5rem)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
      }}
    >
      <h3
        style={{
          fontWeight: "bold",
          fontSize: "1.5rem",
          marginBottom: "0rem",
        }}
      >
        🔥 요즘 Hot한 산은 어딜까?!
      </h3>
      <p
        style={{
          marginTop: "0.4rem",
          marginBottom: "2rem",
          color: "#6c757d",
          fontSize: "1rem",
          fontWeight: 500,
        }}
      >
        궁금한 산을 클릭해서 등산 정보를 확인해보세요!
      </p>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
        }}
      >
        {loading ? (
          <span style={{ color: "#27ae60" }}>불러오는 중...</span>
        ) : (
          hotMountains.map((mountain) => (
            <HotMountainCard key={mountain.mountainId} mountain={mountain} />
          ))
        )}
      </div>
    </div>
  );
};

export default HotMountainList;
