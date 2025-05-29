const ProfileStep = ({ question, options, onSelect }) => {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <p style={{ marginBottom: "0.5rem" }}>{question}</p>
      {options.map((option) => (
        <button
          key={option}
          style={{
            margin: "0.25rem",
            padding: "8px 12px",
            borderRadius: "8px",
            backgroundColor: "#e0f7fa",
            border: "none",
            cursor: "pointer",
          }}
          onClick={() => onSelect(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default ProfileStep;
