import React from "react";
import LoginIcon from "@mui/icons-material/Login";

const LoginRequiredModal = ({
  isOpen,
  onClose,
  onLogin,
  title = "로그인이 필요한 서비스입니다",
  message = "해당 기능은 로그인 후에만 이용할 수 있어요!",
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
        zIndex: 20000,
      }}
      onClick={onClose}
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
        onClick={(e) => e.stopPropagation()}
      >
        {/* 아이콘 */}
        <div
          style={{
            width: "60px",
            height: "60px",
            backgroundColor: "#d9eae1",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1rem",
            color: "#355f4e",
          }}
        >
          <LoginIcon style={{ fontSize: "1.8rem" }} />
        </div>

        {/* 제목 */}
        <h3
          style={{
            color: "#3b5f47",
            marginBottom: "0.8rem",
            fontSize: "1.1rem",
            fontWeight: "600",
            lineHeight: 1.3,
          }}
        >
          {title}
        </h3>

        {/* 메시지 */}
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

        {/* 버튼 */}
        <div
          style={{ display: "flex", justifyContent: "center", gap: "0.8rem" }}
        >
          <button
            onClick={onClose}
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
            취소
          </button>
          <button
            onClick={onLogin}
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
            로그인 하러가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginRequiredModal;
