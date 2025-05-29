import { useState, useEffect } from "react";
import { sendChatToOrmie } from "../api/ormieApi";

const useOrmieChat = () => {
  const [messages, setMessages] = useState([]);
  const [profile, setProfile] = useState(null);

  const setUserProfile = (newProfile) => {
    setProfile(newProfile);
  };

  useEffect(() => {}, [profile]);

  const handleSend = async (text) => {
    setMessages((prev) => [...prev, { from: "user", text }]);

    try {
      const res = await sendChatToOrmie(text, profile);
      if (!res?.answer) {
        setMessages((prev) => [
          ...prev,
          { from: "ormie", text: "응답을 불러오지 못했어요 😢" },
        ]);
        return;
      }
      setMessages((prev) => [...prev, { from: "ormie", text: res.answer }]);
    } catch (err) {
      console.error("[Ormie Chat Error]", err);
      setMessages((prev) => [
        ...prev,
        { from: "ormie", text: "오류가 발생했어요 😥 다시 시도해주세요." },
      ]);
    }
  };

  return { messages, handleSend, setUserProfile };
};

export default useOrmieChat;
