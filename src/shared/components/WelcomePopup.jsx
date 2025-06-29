import React from "react";
import { useTheme, useMediaQuery } from "@mui/material";
import GreenButton from "shared/ui/greenButton";

const WelcomePopup = ({ isOpen, onClose, userName }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // 랜덤 환영 메시지 배열
  const welcomeMessages = [
    `${userName}님!\n등산이야기를 찾아주셔서 감사해요!~`,
    `${userName}님!\n오늘도 좋은 하루 보내세요! 🏔️`,
    `${userName}님!\n등산의 즐거움을 함께 나눠요! 👋`,
    `${userName}님!\n환영합니다!\n멋진 등산 여행을 시작해보세요! ✨`,
    `${userName}님!\n등산 커뮤니티에 오신 것을 환영해요! 🌟`,
    `${userName}님!\n오늘도 산으로 떠나볼까요? 🚶‍♂️`,
    `${userName}님!\n등산 이야기와 함께\n특별한 추억을 만들어요! 📸`,
    `${userName}님!\n새로운 등산 파트너를\n만나보세요! 👥`,
  ];

  // 랜덤 메시지 선택
  const randomMessage =
    welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 20000,
        padding: isMobile ? "1rem" : "2rem",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#f0f8f5",
          borderRadius: "24px",
          boxShadow:
            "0 8px 32px rgba(0,0,0,0.2), inset 0 0 0 2px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: isMobile ? "100%" : "500px",
          padding: isMobile ? "2rem" : "3rem",
          textAlign: "center",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 환영 메시지 */}
        <div
          style={{
            marginBottom: isMobile ? "1.5rem" : "2rem",
          }}
        >
          <h2
            style={{
              color: "#2b5f3e",
              fontSize: isMobile ? "1.3rem" : "1.6rem",
              fontWeight: "700",
              marginBottom: "1rem",
              lineHeight: "1.4",
              whiteSpace: "pre-line",
            }}
          >
            {randomMessage}
          </h2>
          <p
            style={{
              color: "#666",
              fontSize: isMobile ? "1rem" : "1.1rem",
              lineHeight: "1.6",
              margin: 0,
            }}
          >
            등산 이야기에서 다양한 기능들을 즐겨보세요!
          </p>
        </div>

        {/* 시작하기 버튼 */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <GreenButton
            onClick={onClose}
            style={{
              padding: isMobile ? "0.8rem 2rem" : "1rem 3rem",
              fontSize: isMobile ? "1.1rem" : "1.2rem",
              fontWeight: "600",
              borderRadius: "12px",
              background: "#4b8161",
              color: "#ffffff",
              border: "none",
              boxShadow: "0 4px 12px rgba(75, 129, 97, 0.3)",
            }}
          >
            🚀 시작하기
          </GreenButton>
        </div>
      </div>
    </div>
  );
};

export default WelcomePopup;
