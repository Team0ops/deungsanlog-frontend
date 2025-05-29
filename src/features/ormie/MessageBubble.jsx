const MessageBubble = ({ from, text }) => {
  const isUser = from === "user";

  console.log("렌더링할 텍스트:", text);
  return (
    <div
      style={{
        backgroundColor: isUser ? "#e0e0e0" : "#e0f7fa",
        borderRadius: "12px",
        padding: "8px 12px",
        margin: "8px 0",
        alignSelf: isUser ? "flex-end" : "flex-start",
        maxWidth: "80%",
      }}
    >
      {text}
    </div>
  );
};

export default MessageBubble;
