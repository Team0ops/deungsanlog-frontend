import MessageBubble from "./MessageBubble";

const ChatMessageList = ({ messages }) => {
  return (
    <div
      style={{ maxHeight: "400px", overflowY: "auto", marginBottom: "1rem" }}
    >
      {messages.map((msg, i) => (
        <MessageBubble key={i} from={msg.from} text={msg.text} />
      ))}
    </div>
  );
};

export default ChatMessageList;
