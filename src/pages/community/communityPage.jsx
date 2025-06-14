import KingOfMountainWidget from "widgets/community/Rank/KingOfMountainWidget";

const userId = null;
const CommunityPage = () => {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        padding: "2rem 0 2rem",
        minHeight: "70vh",
        boxSizing: "border-box",
      }}
    >
      <KingOfMountainWidget userId={userId} />
    </div>
  );
};
export default CommunityPage;
