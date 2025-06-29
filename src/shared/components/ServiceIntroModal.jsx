import React, { useState } from "react";
import { useTheme, useMediaQuery } from "@mui/material";
import GreenButton from "shared/ui/greenButton";
import { isAuthenticated } from "shared/lib/auth";

const ServiceIntroModal = ({ isOpen, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isLoggedIn = isAuthenticated();
  const [currentPage, setCurrentPage] = useState(0);

  if (!isOpen) return null;

  const playPageTurnSound = () => {
    try {
      // 효과음 재생
      const audio = new Audio("/sounds/page-flip.mp3");
      audio.volume = 0.3; // 볼륨 조정
      audio.play().catch((error) => {
        console.log("효과음 재생 실패:", error);
      });
    } catch (error) {
      console.log("효과음 로드 실패:", error);
    }
  };

  const handleNext = () => {
    playPageTurnSound();
    setCurrentPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    playPageTurnSound();
    setCurrentPage((prev) => prev - 1);
  };

  const handleClose = () => {
    setCurrentPage(0);
    onClose();
  };

  // 페이지별 콘텐츠 정의
  const pages = [
    // 페이지 1: 환영 메시지
    {
      title: "등산 이야기에 방문하신 것을 환영합니다! 🎉",
      content:
        "등산인들을 위한 종합 커뮤니티 플랫폼입니다.\n산 기록을 남기고, 등산 모임을 만들고,\n다른 등산인들과 소통할 수 있는 공간이에요.",
      showButtons: true,
      nextText: "다음",
      prevText: null,
    },
    // 페이지 2: 산 정보 제공
    {
      title: "🗺️ 산 정보 제공",
      content:
        "전국의 산 정보를 제공합니다. 난이도, 소요시간, 교통편 등 상세한 정보를 확인하세요.",
      showButtons: true,
      nextText: "다음",
      prevText: "이전",
    },
    // 페이지 3: 기록
    {
      title: "📝 기록",
      content: "등산한 산의 기록을 남기고, 사진과 함께 추억을 저장해보세요.",
      showButtons: true,
      nextText: "다음",
      prevText: "이전",
    },
    // 페이지 4: 커뮤니티
    {
      title: "💬 커뮤니티",
      content: "등산 후기, 장비 정보, 산 정보를 공유하고 소통해보세요.",
      showButtons: true,
      nextText: "다음",
      prevText: "이전",
    },
    // 페이지 5: 모임
    {
      title: "👥 모임",
      content:
        "함께 등산할 친구들을 모집하고, 새로운 등산 파트너를 만나보세요.",
      showButtons: true,
      nextText: "다음",
      prevText: "이전",
    },
    // 페이지 6: 오르미
    {
      title: "🤖 오르미",
      content:
        "AI가 등산에 대한 모든 궁금증을 답변해드려요. 등산 팁부터 장비 추천까지!",
      showButtons: true,
      nextText: "다음",
      prevText: "이전",
    },
    // 페이지 7: 알림서비스
    {
      title: "🔔 알림서비스",
      content: "모임 알림, 댓글 알림 등 중요한 소식을 실시간으로 받아보세요.",
      showButtons: true,
      nextText: isLoggedIn ? "시작하기" : "다음",
      prevText: "이전",
    },
    // 페이지 8: 로그인 안내 (로그인하지 않은 사용자만)
    ...(isLoggedIn
      ? []
      : [
          {
            title: "로그인을 하면\n위의 기능을 모두 이용할 수 있어요 !! ✨",
            content: "지금 로그인하고 모든 기능을 체험해보세요!",
            showButtons: true,
            nextText: "로그인 하러가기!",
            prevText: "이전",
          },
        ]),
  ];

  const currentPageData = pages[currentPage];
  const isLastPage = currentPage === pages.length - 1;

  const handleButtonClick = () => {
    if (isLastPage) {
      if (isLoggedIn) {
        handleClose();
      } else {
        onClose();
        window.location.href = "/login";
      }
    } else {
      handleNext();
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: "url('/images/back_paper.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 20000,
          padding: 0,
          width: "100vw",
          height: "100vh",
        }}
        onClick={handleClose}
      >
        <div
          style={{
            background: "transparent",
            borderRadius: "0px",
            boxShadow:
              "0 8px 32px rgba(0,0,0,0.2), inset 0 0 0 2px rgba(0,0,0,0.1)",
            width: "100vw",
            height: "100vh",
            maxWidth: "100vw",
            maxHeight: "100vh",
            overflowY: "auto",
            padding: isMobile ? "2rem" : "3rem",
            position: "relative",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* X버튼 */}
          <button
            onClick={handleClose}
            style={{
              background: "none",
              border: "none",
              fontSize: isMobile ? "1.2rem" : "1.5rem",
              color: "#16351c",
              cursor: "pointer",
              padding: "0.5rem",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: isMobile ? "2rem" : "2.5rem",
              height: isMobile ? "2rem" : "2.5rem",
              outline: "none",
              position: "absolute",
              top: isMobile ? "1rem" : "1.5rem",
              right: isMobile ? "1rem" : "1.5rem",
              zIndex: 1,
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#d4e9d4")}
            onMouseOut={(e) => (e.currentTarget.style.background = "none")}
          >
            ✕
          </button>

          {/* 로고 이미지 */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: isMobile ? "1.5rem" : "2rem",
            }}
          >
            <img
              src="/images/logo_mountain.png"
              alt="등산 이야기 로고"
              style={{
                width: isMobile ? "120px" : "150px",
                height: "auto",
                objectFit: "contain",
              }}
            />
          </div>

          {/* 페이지 콘텐츠 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              textAlign: "center",
              padding: isMobile ? "1rem" : "2rem",
            }}
          >
            <div
              style={{
                background: "rgba(255, 255, 255, 0.95)",
                borderRadius: "16px",
                padding: isMobile ? "2rem" : "3rem",
                boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                maxWidth: isMobile ? "90%" : "600px",
                width: "100%",
                minHeight: isMobile ? "400px" : "350px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <h2
                  key={currentPage}
                  style={{
                    color: "#2b5f3e",
                    fontSize: isMobile ? "1.4rem" : "1.8rem",
                    fontWeight: "700",
                    marginBottom: "1.5rem",
                    lineHeight: "1.4",
                    animation: "slideDown 1.5s ease-out",
                    whiteSpace: "pre-line",
                  }}
                >
                  {currentPageData.title}
                </h2>
                <p
                  style={{
                    color: "#555",
                    fontSize: isMobile ? "1rem" : "1.2rem",
                    lineHeight: "1.6",
                    marginBottom: "2rem",
                    whiteSpace: "pre-line",
                  }}
                >
                  {currentPageData.content}
                </p>
              </div>

              <div>
                {/* 페이지 인디케이터 */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "0.5rem",
                    marginBottom: "2rem",
                  }}
                >
                  {pages.map((_, index) => (
                    <div
                      key={index}
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        backgroundColor:
                          index === currentPage ? "#4b8161" : "#ddd",
                        transition: "background-color 0.3s ease",
                      }}
                    />
                  ))}
                </div>

                {/* 버튼들 */}
                {currentPageData.showButtons && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "1rem",
                      flexWrap: "wrap",
                    }}
                  >
                    {currentPageData.prevText && (
                      <GreenButton
                        onClick={handlePrev}
                        style={{
                          padding: isMobile ? "0.8rem 1.5rem" : "1rem 2rem",
                          fontSize: isMobile ? "1rem" : "1.1rem",
                          fontWeight: "600",
                          borderRadius: "12px",
                          background: "#ffffff",
                          color: "#4b8161",
                          border: "2px solid #4b8161",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        }}
                      >
                        {currentPageData.prevText}
                      </GreenButton>
                    )}
                    <GreenButton
                      onClick={handleButtonClick}
                      style={{
                        padding: isMobile ? "0.8rem 1.5rem" : "1rem 2rem",
                        fontSize: isMobile ? "1rem" : "1.1rem",
                        fontWeight: "600",
                        borderRadius: "12px",
                        background: "#4b8161",
                        color: "#ffffff",
                        border: "none",
                        boxShadow: "0 4px 12px rgba(75, 129, 97, 0.3)",
                      }}
                    >
                      {currentPageData.nextText}
                    </GreenButton>
                    {/* 마지막 페이지에서만 "둘러보기" 버튼 표시 (로그인하지 않은 사용자) */}
                    {isLastPage && !isLoggedIn && (
                      <GreenButton
                        onClick={handleClose}
                        style={{
                          padding: isMobile ? "0.8rem 1.5rem" : "1rem 2rem",
                          fontSize: isMobile ? "1rem" : "1.1rem",
                          fontWeight: "600",
                          borderRadius: "12px",
                          background: "#ffffff",
                          color: "#666666",
                          border: "2px solid #dddddd",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        }}
                      >
                        둘러보기
                      </GreenButton>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ServiceIntroModal;
