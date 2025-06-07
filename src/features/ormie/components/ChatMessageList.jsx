import "../../../app/styles/App.css";
import OrmieBubble from "./MessageBubbles/OrmieBubble";
import UserBubble from "./MessageBubbles/UserBubble";

const ChatMessageList = ({ messages }) => {
  return (
    <div
      className="chat-scroll-area"
      style={{
        flex: 1,
        overflowY: "auto",
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {messages.map((msg, i) =>
        msg.from === "user" ? (
          <UserBubble key={i} text={msg.text} />
        ) : (
          <OrmieBubble key={i} text={msg.text} />
        )
      )}
    </div>
  );
};

export default ChatMessageList;
