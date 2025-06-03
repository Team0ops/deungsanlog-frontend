const ProfileStep = ({ question, options, onSelect }) => {
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          textAlign: "center",
          maxWidth: "400px",
          padding: "1rem",
        }}
      >
        <p
          style={{
            fontSize: "1.2rem",
            fontWeight: "bold",
            marginBottom: "1.2rem",
            color: "#333",
            whiteSpace: "pre-line",
          }}
        >
          {question}
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "0.75rem",
          }}
        >
          {options.map((option) => (
            <button
              key={option}
              onClick={() => onSelect(option)}
              style={{
                padding: "0.6rem 1.2rem",
                fontSize: "1rem",
                fontWeight: "bold",
                borderRadius: "12px",
                border: "none",
                background: "linear-gradient(135deg, #4b8161, #2c5c46)",
                color: "white",
                cursor: "pointer",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
              }}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileStep;
