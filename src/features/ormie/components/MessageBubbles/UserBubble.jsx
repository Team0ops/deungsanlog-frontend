const UserBubble = ({ text }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "flex-end",
      margin: "10px 0",
    }}
  >
    <div
      style={{
        backgroundColor: "#fff9d1",
        borderRadius: "18px",
        padding: "12px 16px",
        color: "#333",
        fontSize: "1.02rem",
        lineHeight: 1.6,
        maxWidth: "75%",
        whiteSpace: "pre-wrap",
        boxShadow: "0 2px 6px rgba(200, 180, 80, 0.06)",
        border: "none",
      }}
    >
      {text}
    </div>
    <span
      style={{
        fontSize: "2rem",
        marginLeft: "0.5rem",
        alignSelf: "flex-end",
      }}
    >
      🙋‍
    </span>
  </div>
);

export default UserBubble;
