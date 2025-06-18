const OrmieBubble = ({ text, children }) => {
  const isOnlyChildren = !text && children;

  return (
    <div style={{ display: "flex", alignItems: "flex-start", margin: "8px 0" }}>
      <div style={{ fontSize: "1.2rem", marginRight: "0.5rem" }}>🤖</div>
      {/* text용 일반 말풍선 */}
      {text && (
        <div
          style={{
            backgroundColor: "#F1F0F0",
            borderRadius: "0px 16px 16px 16px",
            padding: "10px 15px",
            color: "#333",
            fontSize: "0.95rem",
            lineHeight: 1.4,
            maxWidth: "75%",
            whiteSpace: "pre-wrap",
            boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
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
            backgroundColor: "#F1F0F0",
            borderRadius: "0px 16px 16px 16px",
            padding: "12px 15px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default OrmieBubble;
