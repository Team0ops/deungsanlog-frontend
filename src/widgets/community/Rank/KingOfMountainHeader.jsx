import RefreshIcon from "@mui/icons-material/Refresh";

const slogans = [
  "산에 진심인 사람들의 랭킹입니다 !",
  "꾸준히 오르면 언젠가 1등도 가능! ",
  "오늘도 정상을 향해, 한 발짝! ",
  "기록은 배신하지 않아요 !",
  "정상을 찍고 싶은 자, 기록하라! ",
];

const getRandomSlogan = () =>
  slogans[Math.floor(Math.random() * slogans.length)];

const Header = ({ onRefresh }) => (
  <>
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
        🏆 등산왕
      </h3>
      <button
        onClick={onRefresh}
        style={{
          padding: "0.4rem 0.6rem",
          border: "none",
          borderRadius: "8px",
          backgroundColor: "#fff",
          color: "#348d59",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s",
          outline: "none",
          boxShadow: "none",
          position: "relative",
          overflow: "hidden",
        }}
        title="새로고침"
      >
        <span className="splash-effect" />
        <RefreshIcon />
      </button>
    </div>
    <p
      style={{
        marginTop: "0.4rem",
        color: "#6c757d",
        fontSize: "1rem",
        fontWeight: 500,
      }}
    >
      {getRandomSlogan()}
    </p>
  </>
);

export default Header;
