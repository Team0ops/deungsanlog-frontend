import Header from "./KingOfMountainHeader";
import RankingList from "./KingOfMountainList";
import MyRankingBox from "./KingOfMountainMyRank";
import useRankingData from "./useRankingData";

const KingOfMountainWidget = ({ userId }) => {
  const { topRankers, myRank, loading, handleManualRefresh } =
    useRankingData(userId);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "600px",
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderRadius: "20px",
        padding: "clamp(1rem, 4vw, 1.5rem)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
      }}
    >
      <Header onRefresh={handleManualRefresh} />
      <RankingList topRankers={topRankers} myRank={myRank} loading={loading} />
      <MyRankingBox myRank={myRank} />
    </div>
  );
};

export default KingOfMountainWidget;
