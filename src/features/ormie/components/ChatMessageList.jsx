import "../../../app/styles/App.css";
import OrmieBubble from "./MessageBubbles/OrmieBubble";
import UserBubble from "./MessageBubbles/UserBubble";

const recommendedQuestions = [
  "오늘 등산하기 좋은 산 추천해줘",
  "100대 명산 중 하나 알려줘",
  "서울 근교 가벼운 코스 있을까?",
];

const ChatMessageList = ({ messages, onSend }) => {
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
      {/* ✅ 추천 질문 버블 (채팅 시작 시 상단에) */}
      {messages.length === 0 && (
        <OrmieBubble>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            <div style={{ marginBottom: "0.5rem" }}></div>
            {recommendedQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => onSend(q)}
                style={{
                  backgroundColor: "#eaf6ef",
                  border: "1px solid #4b8161",
                  color: "#4b8161",
                  padding: "0.5rem 1rem",
                  borderRadius: "1rem",
                  textAlign: "left",
                  cursor: "pointer",
                  fontSize: "0.95rem",
                  transition: "background 0.2s",
                }}
              >
                {q}
              </button>
            ))}
          </div>
        </OrmieBubble>
      )}

      {/* 기존 채팅 메시지 렌더링 */}
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
