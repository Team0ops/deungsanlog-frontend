import { useState, useRef } from "react";

const shakeAnimation = `
@keyframes shake {
  0% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  50% { transform: translateX(5px); }
  75% { transform: translateX(-5px); }
  100% { transform: translateX(0); }
}
`;

const GreenInput = ({
  value,
  onChange,
  placeholder = "",
  error = false,
  errorMessage = "",
  style = {},
  as,
  type = "text",
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef(null);

  const baseStyle = {
    padding: "0.75rem 1rem",
    width: "100%",
    fontSize: "1rem",
    fontWeight: "500",
    borderRadius: "12px",
    border: `2px solid ${error ? "#dc3545" : focused ? "#2c5c46" : "#4b8161"}`,
    outline: "none",
    color: "#1f1f1f",
    background: "#f8fff9",
    boxShadow: focused
      ? "0 6px 12px rgba(0, 0, 0, 0.15)"
      : "0 4px 8px rgba(0, 0, 0, 0.1)",
    transition: "border 0.2s ease, box-shadow 0.2s ease",
    animation: error ? "shake 0.3s" : "none",
    ...style,
  };

  // textarea 자동 높이 조절
  const handleInput = (e) => {
    if (as === "textarea" || type === "textarea") {
      e.target.style.height = "auto";
      e.target.style.height = e.target.scrollHeight + "px";
    }
    if (props.onInput) props.onInput(e);
  };

  return (
    <div style={{ width: "100%" }}>
      <style>{shakeAnimation}</style>
      {as === "textarea" || type === "textarea" ? (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={onChange}
          placeholder={error ? errorMessage : placeholder}
          style={{
            ...baseStyle,
            resize: "vertical",
            minHeight: "5.0rem",
            overflow: "hidden",
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onInput={handleInput}
          {...props}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={error ? errorMessage : placeholder}
          style={baseStyle}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
      )}
    </div>
  );
};

export default GreenInput;
