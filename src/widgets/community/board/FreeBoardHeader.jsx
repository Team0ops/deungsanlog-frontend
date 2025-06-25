import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import GreenButton from "shared/ui/GreenButton";

const messages = [
  "오늘은 어떤 이야기를 나눠볼까요?",
  "등산 후기도 좋고, 아무 이야기나 환영이에요!",
  "커뮤니티에서 함께 소통해요 😊",
];

const FreeBoardHeader = () => {
  const navigate = useNavigate();
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];

  return (
    <Box
      width="100%"
      maxWidth="100%"
      mx="auto"
      mt={4}
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        width="100%"
        display="flex"
        flexDirection="row"
        gap={3}
        bgcolor="#fdfdfd"
        borderRadius={3}
        boxShadow="0 4px 12px rgba(0, 0, 0, 0.1)"
        p={3}
        alignItems="stretch"
      >
        {/* 메시지 박스 (왼쪽) */}
        <Box
          flex={2}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          px={2}
          py={1}
          textAlign="center"
        >
          <Typography
            variant="h5"
            fontWeight={600}
            mb={2}
            sx={{
              color: "#2e2e2e",
              background: "linear-gradient(transparent 60%, #d4f1db 60%)",
              borderRadius: 0,
              display: "inline",
              boxDecorationBreak: "clone",
            }}
          >
            {randomMessage}
          </Typography>
          <Typography variant="body1" mt={1}>
            당신의 글이 다른 사람에게 힘이 될 수 있어요 ✨
          </Typography>
        </Box>
        {/* 구분선 */}
        <Box
          width="2px"
          bgcolor="#e0e0e0"
          mx={2}
          borderRadius={1}
          display={{ xs: "none", md: "block" }}
        />
        {/* 버튼/셀렉트 박스 (오른쪽) */}
        <Box
          flex={1}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          gap={2}
        >
          <GreenButton
            onClick={() => navigate("/community/free/write")}
            style={{
              height: "55px",
              width: "100%",
              color: "#4c7559",
              background: "#fdfdfd",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            글쓰기
          </GreenButton>
          <GreenButton
            onClick={() => navigate("/community/free/my")}
            style={{
              height: "55px",
              width: "100%",
              color: "#4c7559",
              background: "#fdfdfd",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
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
