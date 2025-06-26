import { Box, Typography } from "@mui/material";

const messages = [
  "내가 남긴 이야기들을 한눈에 볼 수 있어요!",
  "나의 자유게시판 활동을 모아봤어요.",
  "내가 쓴 글, 다시 보면 또 새로워요 😊",
];

const FreeBoardMyHeader = () => {
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
            내가 작성한 자유게시판 글 목록입니다.
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
        {/* 오른쪽(버튼 없음, 공간만 맞춤) */}
        <Box
          flex={1}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          gap={2}
        />
      </Box>
    </Box>
  );
};

export default FreeBoardMyHeader;
