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
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        padding: "2rem 0 2rem 8vw",
        minHeight: "70vh",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          minHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          borderRadius: "20px",
          padding: "clamp(1rem, 4vw, 1.5rem)",
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
                minHeight: 0,
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
