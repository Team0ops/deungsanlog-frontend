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
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
              alignItems: "flex-start",
              width: "100%",
            }}
          >
            <div
              style={{
                fontWeight: "bold",
                color: "#bfa100",
                fontSize: "1.05rem",
                marginBottom: "0.25rem",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              <span style={{ fontSize: "1.2rem" }}>💡</span> 추천 질문
            </div>
            {recommendedQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => onSend(q)}
                style={{
                  background: "#fff9d1",
                  border: "1.5px solid #e6c200",
                  color: "#bfa100",
                  padding: "0.7rem 1.2rem",
                  borderRadius: "2em",
                  fontWeight: "500",
                  fontSize: "1rem",
                  boxShadow: "0 2px 8px rgba(200,180,80,0.08)",
                  cursor: "pointer",
                  transition: "background 0.2s, box-shadow 0.2s",
                  outline: "none",
                  margin: 0,
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background = "#ffeeb0")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.background = "#fff9d1")
                }
                onMouseDown={(e) =>
                  (e.currentTarget.style.boxShadow =
                    "0 1px 2px rgba(200,180,80,0.12)")
                }
                onMouseUp={(e) =>
                  (e.currentTarget.style.boxShadow =
                    "0 2px 8px rgba(200,180,80,0.08)")
                }
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
