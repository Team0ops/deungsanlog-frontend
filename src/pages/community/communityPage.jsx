import { useNavigate } from "react-router-dom";
import KingOfMountainWidget from "widgets/community/Rank/KingOfMountainWidget";
import HotMountainList from "widgets/community/HotMountain/HotMountainList";
import GreenButton from "shared/ui/greenButton";

const userId = 11;

const CommunityPage = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/community/free");
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "2rem",
        width: "100%",
        alignItems: "flex-start",
        flexWrap: "wrap",
      }}
    >
      <div
        style={{
          minWidth: "90%",
          maxWidth: "100%",
          minHeight: "40vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "none",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          borderRadius: "20px",
          padding: "clamp(1rem, 4vw, 1.5rem)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3
            style={{
              fontWeight: "bold",
              fontSize: "1.5rem",
            }}
          >
            📢 자유게시판입니다!
          </h3>

          <GreenButton
            onClick={handleNavigate}
            style={{
              fontSize: "1.08rem",
              background: "#4b8161",
              padding: "0.6rem 1.5rem",
              borderRadius: "0.7rem",
            }}
          >
            전체 글 보기 ↗
          </GreenButton>
        </div>
        <p
          style={{
            color: "#555",
            fontSize: "0.95rem",
            lineHeight: 1.5,
            marginTop: "0.4rem",
          }}
        >
          최신 게시글과 등산러들의 다양한 산 이야기를 구경하세요 !
        </p>
      </div>

      <KingOfMountainWidget userId={userId} />
      <HotMountainList />

      <style>
        {`
        @media (max-width: 900px) {
          .community-main, .community-side {
            max-width: 100% !important;
            flex-basis: 100% !important;
          }
        }
      `}
      </style>
    </div>
  );
};

export default CommunityPage;
