import { useNavigate } from "react-router-dom";
import GreenButton from "shared/ui/greenButton";

const MyRankingBox = ({ myRank, loading }) => {
  const navigate = useNavigate();
  return (
    <div
      style={{
        background: "#ecf5e8",
        borderRadius: "1rem",
        padding: "1.1rem 1rem",
        fontWeight: 600,
        fontSize: "1.08rem",
        color: "#8b8b8b",
        boxShadow: "0 2px 8px #d1f2eb33",
        minHeight: "3.2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {loading ? (
        <span style={{ color: "#4b8161", fontWeight: 500 }}>
          🏔️ 내 등산 랭킹을 불러오는 중입니다...
        </span>
      ) : myRank ? (
        <span>
          <b style={{ color: "#696969" }}>{myRank.nickname}</b>님, 꾸준한
          기록으로 <b style={{ color: "#696969" }}>{myRank.rank}위</b>에
          올랐어요! 🔥
        </span>
      ) : (
        <>
          <div
            style={{
              marginBottom: "0.7rem",
              fontWeight: 200,
              fontSize: "1.02rem",
              color: "#7a7a7a",
            }}
          >
            <b>👟 아직 랭킹에 없어요! 지금 로그인하고 함께 올라봐요~</b>
          </div>
          <GreenButton
            onClick={() => navigate("/login")}
            style={{
              fontSize: "1.08rem",
              background: "#4b8161",
              padding: "0.6rem 1.5rem",
              borderRadius: "0.7rem",
            }}
          >
            로그인 하러 가기
          </GreenButton>
        </>
      )}
    </div>
  );
};

export default MyRankingBox;
