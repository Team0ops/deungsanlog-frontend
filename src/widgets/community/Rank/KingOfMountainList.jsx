// KingOfMountainList.jsx
const medalEmoji = (rank) => {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  if (rank <= 10) return "🏅";
  return "⛰️";
};

const RankingList = ({ topRankers, myRank, loading }) => (
  <div
    style={{
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      borderRadius: "1rem",
      padding: "1.2rem 0.5rem",
      maxHeight: "220px",
      overflowY: "auto",
      marginTop: "1rem",
      marginBottom: "1.5rem",
    }}
  >
    <ol
      style={{
        margin: 0,
        padding: 0,
        listStyle: "none",
        minWidth: "250px",
      }}
    >
      {loading
        ? Array.from({ length: 5 }).map((_, i) => (
            <li
              key={i}
              style={{
                margin: "0.6rem 0",
                height: "2.4rem",
                background: "linear-gradient(90deg, #eee, #f5f5f5, #eee)",
                backgroundSize: "200% 100%",
                animation: "skeleton 1.2s ease-in-out infinite",
                borderRadius: "0.7rem",
              }}
            />
          ))
        : topRankers.map((r) => (
            <li
              key={r.userId}
              style={{
                margin: "0.6rem 0",
                fontWeight: myRank && r.userId === myRank.userId ? 800 : 500,
                color:
                  myRank && r.userId === myRank.userId ? "#144218" : "#2d3436",
                background:
                  myRank && r.userId === myRank.userId
                    ? "#c7e0d4c8"
                    : "rgba(39, 174, 96, 0.04)",
                borderRadius: "0.7rem",
                padding: "0.5rem 0.7rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: "0.7rem",
                fontSize: "1.08rem",
                boxShadow:
                  myRank && r.userId === myRank.userId
                    ? "0 0 0 2px #a8cfa8ae"
                    : undefined,
              }}
            >
              <span style={{ minWidth: 28, fontWeight: 700 }}>{r.rank}위</span>
              <span
                style={{
                  fontSize: "1.3rem",
                  width: 32,
                  display: "inline-block",
                }}
              >
                {medalEmoji(r.rank)}
              </span>
              <span style={{ flex: 1, textAlign: "left" }}>{r.nickname}</span>
              <span style={{ color: "#969696", fontWeight: 400 }}>
                {r.recordCount}회
              </span>
            </li>
          ))}
    </ol>
  </div>
);

export default RankingList;
