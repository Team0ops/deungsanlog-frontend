import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../shared/lib/axiosInstance";
import KingOfMountainWidget from "widgets/community/Rank/KingOfMountainWidget";
import HotMountainList from "widgets/community/HotMountain/HotMountainList";
import FreeBoardBanner from "widgets/community/board/FreeBoardBanner";
import { getUserInfo } from "shared/lib/auth";
import { useTheme, useMediaQuery } from "@mui/material";

const CommunityPage = () => {
  const [previewPosts, setPreviewPosts] = useState([]);
  const [userId, setUserId] = useState(null);
  const [refreshKing, setRefreshKing] = useState(false); // 추가
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // iOS Safari 디버깅
  useEffect(() => {
    const isIOS =
      navigator.userAgent.includes("iPhone") ||
      navigator.userAgent.includes("iPad");
    if (isIOS) {
      console.log("📱 iOS Safari 감지됨");
      console.log("📱 User Agent:", navigator.userAgent);
      console.log("📱 온라인 상태:", navigator.onLine);
      console.log("📱 API Base URL:", import.meta.env.VITE_API_BASE_URL);
    }
  }, []);

  // 로그인 여부만 체크해서 userId만 저장
  useEffect(() => {
    const userInfo = getUserInfo();
    if (userInfo?.userId) {
      setUserId(userInfo.userId);
    } else {
      setUserId(null); // 비로그인 시 null
    }
  }, []);

  const handleNavigate = () => {
    navigate("/community/free", { state: { userId } });
  };

  useEffect(() => {
    const isIOS =
      navigator.userAgent.includes("iPhone") ||
      navigator.userAgent.includes("iPad");

    console.log("🌐 커뮤니티 미리보기 데이터 요청 시작");

    axiosInstance
      .get("/community-service/posts/preview")
      .then((res) => {
        console.log("✅ 커뮤니티 미리보기 데이터 성공:", res.data.length, "개");
        setPreviewPosts(res.data);
      })
      .catch((error) => {
        console.error("❌ 커뮤니티 미리보기 데이터 실패:", error);
        if (isIOS) {
          console.log("📱 iOS Safari 오류 상세:", {
            message: error.message,
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
          });
        }
        setPreviewPosts([]);
      });
  }, []);

  // 등산왕 위젯 mount 시 강제 리프레시 트리거
  useEffect(() => {
    setRefreshKing(true);
    const timer = setTimeout(() => setRefreshKing(false), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        maxWidth: isMobile ? "95vw" : "70vw",
        margin: "0 auto",
        padding: isMobile ? "0.7rem 0.5rem" : "1.5rem",
        boxSizing: "border-box",
        overflowX: "hidden",
      }}
    >
      {/* 자유게시판 배너 - 상단 한 줄 전체 */}
      <div style={{ marginBottom: isMobile ? "1.2rem" : "2rem" }}>
        <FreeBoardBanner
          onClick={handleNavigate}
          previewPosts={previewPosts}
          isMobile={isMobile}
        />
      </div>

      {/* 랭킹 / Hot 산 - 가로 배치 (작아지면 세로) */}
      <div
        className="community-bottom-widgets"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: isMobile ? "0.8rem" : "1.5rem",
          justifyContent: isMobile ? "center" : "space-between",
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "stretch" : undefined,
        }}
      >
        <div
          style={{
            flex: "1 1 300px",
            minWidth: isMobile ? "0" : "280px",
            width: isMobile ? "100%" : undefined,
          }}
        >
          {/* key에 refreshKing을 넣어 mount 트리거 */}
          <KingOfMountainWidget
            userId={userId}
            key={refreshKing ? "refresh" : "normal"}
          />
        </div>

        <div
          style={{
            flex: "1 1 300px",
            minWidth: isMobile ? "0" : "280px",
            width: isMobile ? "100%" : undefined,
          }}
        >
          <HotMountainList />
        </div>
      </div>

      <style>
        {`
        @media (max-width: 768px) {
          .community-bottom-widgets {
            flex-direction: column;
            align-items: stretch;
          }
        }
      `}
      </style>
    </div>
  );
};

export default CommunityPage;
