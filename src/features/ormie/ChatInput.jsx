import { useState } from "react";

const ChatInput = ({ onSend }) => {
  const [value, setValue] = useState("");

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && value.trim()) {
      onSend(value);
      setValue("");
    }
  };

  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyPress={handleKeyPress}
      placeholder="오르미에게 질문하세요..."
      style={{ width: "100%", padding: "12px", borderRadius: "8px" }}
    />
  );
};

export default ChatInput;
