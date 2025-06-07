import { useState } from "react";
import { ChatInput, ChatMessageList } from "features/ormie";
import useOrmieChat from "features/ormie/hooks/useOrmieChat";
import { OnboardingChat } from "../../features/ormie";

const OrmiePage = () => {
  const { messages, handleSend, setUserProfile } = useOrmieChat();
  const [profile, setProfile] = useState(null);

  const handleOnboardingComplete = (answers) => {
    setProfile(answers);
    setUserProfile(answers);
  };

  return (
    <div
      style={{
        position: "fixed", // 전체 화면 기준
        top: 0,
        left: 0,
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          height: "90vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          borderRadius: "20px",
          padding: "1.5rem",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        }}
      >
        {!profile ? (
          <OnboardingChat onComplete={handleOnboardingComplete} />
        ) : (
          <>
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                marginTop: "1rem",
                marginBottom: "1rem",
              }}
            >
              <ChatMessageList messages={messages} />
            </div>
            <ChatInput onSend={(text) => handleSend(text)} />
          </>
        )}
      </div>
    </div>
  );
};

export default OrmiePage;
