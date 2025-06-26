const ConfirmModal = ({
  isOpen,
  message,
  onCancel,
  onConfirm,
  cancelText = "취소",
  confirmText = "삭제",
}) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "#f0f8f5",
          padding: "2rem 1.5rem",
          borderRadius: "20px",
          boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
          width: "90%",
          maxWidth: "360px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            whiteSpace: "pre-line",
            color: "#3b5f47",
            marginBottom: "1.5rem",
            fontSize: "1rem",
            lineHeight: 1.6,
          }}
        >
          {message}
        </p>
        <div
          style={{ display: "flex", justifyContent: "center", gap: "0.8rem" }}
        >
          <button
            onClick={onCancel}
            style={{
              padding: "0.55rem 1.3rem",
              background: "#d9eae1",
              color: "#355f4e",
              border: "none",
              borderRadius: "8px",
              fontWeight: 500,
              fontSize: "0.95rem",
              cursor: "pointer",
              transition: "all 0.25s ease",
              outline: "none",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#cde2d8")}
            onMouseOut={(e) => (e.currentTarget.style.background = "#d9eae1")}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: "0.55rem 1.3rem",
              background: "#5c9475",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontWeight: 500,
              fontSize: "0.95rem",
              cursor: "pointer",
              transition: "all 0.25s ease",
              outline: "none",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#4e7f64")}
            onMouseOut={(e) => (e.currentTarget.style.background = "#5c9475")}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
