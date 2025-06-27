import { useState } from "react";
import { ChatInput, ChatMessageList } from "features/ormie";
import useOrmieChat from "features/ormie/hooks/useOrmieChat";
import { OnboardingChat } from "../../features/ormie";
import styled from "@emotion/styled";

const PageWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 8vw;
  min-height: 70vh;
  box-sizing: border-box;

  @media (max-width: 600px) {
    padding: 1rem 0.5rem;
    align-items: center;
  }
`;

const ChatContainer = styled.div`
  width: 100%;
  max-width: 800px;
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: clamp(1rem, 4vw, 1.5rem);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  margin: 0 auto;

  @media (max-width: 600px) {
    max-width: 100%;
    min-height: 70vh;
    padding: 1rem 0.5rem;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    margin: 0;
  }
`;

const MessageListWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-top: 1rem;
  margin-bottom: 1rem;
  min-height: 0;

  @media (max-width: 600px) {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }
`;

const OrmiePage = () => {
  const { messages, handleSend, setUserProfile } = useOrmieChat();
  const [profile, setProfile] = useState(null);

  const handleOnboardingComplete = (answers) => {
    setProfile(answers);
    setUserProfile(answers);
  };

  return (
    <PageWrapper>
      <ChatContainer>
        {!profile ? (
          <OnboardingChat onComplete={handleOnboardingComplete} />
        ) : (
          <>
            <MessageListWrapper>
              <ChatMessageList messages={messages} onSend={handleSend} />
            </MessageListWrapper>
            <ChatInput onSend={(text) => handleSend(text)} />
          </>
        )}
      </ChatContainer>
    </PageWrapper>
  );
};

export default OrmiePage;
