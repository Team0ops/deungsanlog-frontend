const UserBubble = ({ text }) => (
  <div style={{ display: "flex", justifyContent: "flex-end", margin: "8px 0" }}>
    <div
      style={{
        backgroundColor: "#DCF8C6",
        borderRadius: "16px 0px 16px 16px",
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
  </div>
);

export default UserBubble;
