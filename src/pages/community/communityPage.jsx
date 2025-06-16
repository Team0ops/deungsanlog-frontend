import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import KingOfMountainWidget from "widgets/community/Rank/KingOfMountainWidget";
import HotMountainList from "widgets/community/HotMountain/HotMountainList";
import FreeBoardBanner from "widgets/community/board/FreeBoardBanner";
import { getUserInfo } from "shared/lib/auth";

const CommunityPage = () => {
  const [previewPosts, setPreviewPosts] = useState([]);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

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
    axios
      .get("http://localhost:8080/community-service/posts/preview")
      .then((res) => setPreviewPosts(res.data))
      .catch(() => setPreviewPosts([]));
  }, []);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "1.5rem",
        boxSizing: "border-box",
      }}
    >
      {/* 자유게시판 배너 - 상단 한 줄 전체 */}
      <div style={{ marginBottom: "2rem" }}>
        <FreeBoardBanner onClick={handleNavigate} previewPosts={previewPosts} />
      </div>

      {/* 랭킹 / Hot 산 - 가로 배치 (작아지면 세로) */}
      <div
        className="community-bottom-widgets"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1.5rem",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            flex: "1 1 300px",
            minWidth: "280px",
          }}
        >
          <KingOfMountainWidget userId={userId} />
        </div>

        <div
          style={{
            flex: "1 1 300px",
            minWidth: "280px",
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
