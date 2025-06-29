import { useState } from "react";
import GreenButton from "../../../shared/ui/greenButton";
import GreenInput from "../../../shared/ui/greenInput";

const ChatInput = ({ onSend }) => {
  const [value, setValue] = useState("");

  const handleSend = () => {
    if (value.trim()) {
      onSend(value);
      setValue("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && value.trim()) {
      onSend(value);
      setValue("");
    }
  };

  return (
    <div style={{ display: "flex", gap: "0.5rem", width: "100%" }}>
      <div style={{ flexGrow: 1 }}>
        <GreenInput
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="오르미에게 질문하세요 !"
          style={{ width: "100%" }}
        />
      </div>
      <GreenButton onClick={handleSend}>전송</GreenButton>
    </div>
  );
};

export default ChatInput;
