import { useState } from "react";
import SoftBox from "shared/ui/SoftBox";
import { ChatInput, ChatMessageList } from "features/ormie";
import useOrmieChat from "features/ormie/hooks/useOrmieChat";
import OnboardingChat from "features/ormie/OnboardingChat";

const OrmiePage = () => {
  const { messages, handleSend, setUserProfile } = useOrmieChat();
  const [profile, setProfile] = useState(null);

  const handleOnboardingComplete = (answers) => {
    setProfile(answers);
    setUserProfile(answers);
  };

  return (
    <SoftBox p={4} maxWidth={600} mx="auto" mt={6}>
      <h2>오르미 🐾</h2>

      {!profile ? (
        <OnboardingChat onComplete={handleOnboardingComplete} />
      ) : (
        <>
          <ChatMessageList messages={messages} />
          <ChatInput onSend={(text) => handleSend(text)} />
        </>
      )}
    </SoftBox>
  );
};

export default OrmiePage;
