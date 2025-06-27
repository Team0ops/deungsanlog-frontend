import { useNavigate } from "react-router-dom";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import GreenButton from "shared/ui/greenButton";

const messages = [
  "오늘은 어떤 이야기를 나눠볼까요?",
  "등산 후기도 좋고, 아무 이야기나 환영이에요!",
  "커뮤니티에서 함께 소통해요 😊",
];

const FreeBoardHeader = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];

  return (
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
              background: "linear-gradient(transparent 60%, #d4f1db 60%)",
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
            onClick={() => navigate("/community/free/write")}
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
            onClick={() => navigate("/community/free/my")}
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
  );
};

export default FreeBoardHeader;
