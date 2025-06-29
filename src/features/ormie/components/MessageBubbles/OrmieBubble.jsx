const OrmieBubble = ({ text, children }) => {
  const isOnlyChildren = !text && children;

  return (
    <div
      style={{ display: "flex", alignItems: "flex-start", margin: "10px 0" }}
    >
      <div
        style={{ fontSize: "1.4rem", marginRight: "0.6rem", marginTop: "2px" }}
      >
        🤖
      </div>
      {/* text용 일반 말풍선 */}
      {text && (
        <div
          style={{
            background: "#eaf6ef",
            borderRadius: "18px",
            padding: "12px 16px",
            color: "#234d36",
            fontSize: "1.02rem",
            lineHeight: 1.6,
            maxWidth: "75%",
            whiteSpace: "pre-wrap",
            boxShadow: "0 2px 6px rgba(76, 129, 97, 0.06)",
            border: "none",
            position: "relative",
            ...(window.innerWidth <= 600 ? { fontSize: "0.95rem" } : {}),
          }}
        >
          {text}
        </div>
      )}

      {/* 버튼용 children 전용 레이아웃 */}
      {isOnlyChildren && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            background: "transparent",
            borderRadius: "18px",
            padding: "16px 16px 12px 16px",
            border: "none",
            position: "relative",
            minWidth: "200px",
            ...(window.innerWidth <= 600 ? { fontSize: "0.95rem" } : {}),
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default OrmieBubble;
