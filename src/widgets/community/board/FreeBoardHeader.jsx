import { useNavigate } from "react-router-dom";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import GreenButton from "shared/ui/greenButton";
import LoginRequiredModal from "shared/components/LoginRequiredModal";
import { getUserInfo } from "shared/lib/auth";

const messages = [
  "오늘은 어떤 이야기를 나눠볼까요?",
  "등산 후기도 좋고, 아무 이야기나 환영이에요!",
  "커뮤니티에서 함께 소통해요 😊",
];

const FreeBoardHeader = ({
  showLoginModal,
  setShowLoginModal,
  modalAction,
  setModalAction,
}) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];

  // 로그인 상태 확인
  const userInfo = getUserInfo();
  const isLoggedIn = !!userInfo?.userId;

  const handleButtonClick = (action) => {
    if (!isLoggedIn) {
      setModalAction(action);
      setShowLoginModal(true);
    } else {
      if (action === "write") {
        navigate("/community/free/write");
      } else if (action === "my") {
        navigate("/community/free/my");
      }
    }
  };

  const handleLogin = () => {
    setShowLoginModal(false);
    navigate("/login");
  };

  const handleCloseModal = () => {
    setShowLoginModal(false);
    setModalAction("");
  };

  return (
    <>
      <Box
        width="100%"
        maxWidth="100%"
        mx="auto"
        mt={{ xs: 2, md: 4 }}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Box
          width="100%"
          display="flex"
          flexDirection={{ xs: "column", md: "row" }}
          gap={{ xs: 2, md: 3 }}
          bgcolor="#fdfdfd"
          borderRadius={3}
          boxShadow="0 4px 12px rgba(0, 0, 0, 0.1)"
          p={{ xs: 2, md: 3 }}
          alignItems="stretch"
        >
          {/* 메시지 박스 */}
          <Box
            flex={isMobile ? "none" : 2}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            px={{ xs: 1, md: 2 }}
            py={{ xs: 1, md: 1 }}
            textAlign="center"
          >
            <Typography
              variant={isMobile ? "h6" : "h5"}
              fontWeight={600}
              mb={{ xs: 1, md: 2 }}
              sx={{
                color: "#2e2e2e",
                background: isMobile
                  ? "none"
                  : "linear-gradient(transparent 60%, #d4f1db 60%)",
                borderRadius: 0,
                display: "inline",
                boxDecorationBreak: "clone",
                fontSize: { xs: "1.1rem", md: "1.5rem" },
              }}
            >
              {randomMessage}
            </Typography>
            <Typography
              variant="body1"
              mt={1}
              sx={{
                fontSize: { xs: "0.9rem", md: "1rem" },
                lineHeight: { xs: 1.4, md: 1.5 },
              }}
            >
              당신의 글이 다른 사람에게 힘이 될 수 있어요 ✨
            </Typography>
          </Box>

          {/* 구분선 - 데스크탑에서만 표시 */}
          <Box
            width="2px"
            bgcolor="#e0e0e0"
            mx={2}
            borderRadius={1}
            display={{ xs: "none", md: "block" }}
          />

          {/* 버튼 영역 */}
          <Box
            flex={isMobile ? "none" : 1}
            display="flex"
            flexDirection={{ xs: "column", md: "column" }}
            justifyContent="center"
            alignItems="center"
            gap={{ xs: 1, md: 2 }}
            width={isMobile ? "100%" : "auto"}
          >
            <GreenButton
              onClick={() => handleButtonClick("write")}
              style={{
                height: isMobile ? "48px" : "55px",
                width: "100%",
                color: "#4c7559",
                background: "#fdfdfd",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                fontSize: isMobile ? "0.95rem" : "1rem",
                fontWeight: 600,
              }}
            >
              글쓰기
            </GreenButton>
            <GreenButton
              onClick={() => handleButtonClick("my")}
              style={{
                height: isMobile ? "48px" : "55px",
                width: "100%",
                color: "#4c7559",
                background: "#fdfdfd",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                fontSize: isMobile ? "0.95rem" : "1rem",
                fontWeight: 600,
              }}
            >
              나의 게시물
            </GreenButton>
          </Box>
        </Box>
      </Box>

      {/* 로그인 안내 모달 */}
      <LoginRequiredModal
        isOpen={showLoginModal}
        onClose={handleCloseModal}
        onLogin={handleLogin}
        title="로그인이 필요한 서비스입니다"
        message={
          modalAction === "write"
            ? "게시글을 작성하려면 로그인이 필요해요!"
            : "나의 게시물을 확인하려면 로그인이 필요해요!"
        }
      />
    </>
  );
};

export default FreeBoardHeader;
