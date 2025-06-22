import { Box, Typography } from "@mui/material";
import GreenButton from "shared/ui/GreenButton";

const messages = [
  "오늘 어떤 모임을 찾고 계신가요?",
  "함께 걷는 즐거움을 느껴보세요! 👣",
  "새로운 사람들과의 만남을 기대해요 💬",
];

const MeetingHeader = () => {
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
            함께하는 모임이 기다리고 있어요 🥾
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

        {/* 버튼 & 셀렉트 박스 (기능 없이 시각적으로만) */}
        <Box
          flex={1}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          gap={2}
        >
          <GreenButton
            style={{
              height: "55px",
              width: "100%",
              color: "#4c7559",
              background: "#fdfdfd",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            새로운 모임 만들기
          </GreenButton>

          <select
            style={{
              height: "48px",
              width: "100%",
              padding: "0 1rem",
              borderRadius: "12px",
              border: "1px solid #d0d0d0",
              background: "#fdfdfd",
              fontWeight: "bold",
              fontSize: "1rem",
              color: "#4c7559",
              outline: "none",
              cursor: "default",
              appearance: "none",
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg fill='Green' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>\")",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 1rem center",
              backgroundSize: "16px 16px",
            }}
            disabled
          >
            <option>정렬 기준</option>
          </select>
        </Box>
      </Box>
    </Box>
  );
};

export default MeetingHeader;
