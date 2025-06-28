import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import GreenButton from "shared/ui/greenButton";
import { useNavigate } from "react-router-dom";

const messages = [
  "오늘 어떤 모임을 찾고 계신가요?",
  "함께 걷는 즐거움을 느껴보세요! 👣",
  "새로운 사람들과의 만남을 기대해요 💬",
];

const MeetingHeader = () => {
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      width="100%"
      maxWidth="100%"
      mx="auto"
      mt={isMobile ? 2 : 4}
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        width="100%"
        display="flex"
        flexDirection={isMobile ? "column" : "row"}
        gap={isMobile ? 2 : 3}
        bgcolor="#fdfdfd"
        borderRadius={3}
        boxShadow="0 4px 12px rgba(0, 0, 0, 0.1)"
        p={isMobile ? 2 : 3}
        alignItems="stretch"
      >
        {/* 메시지 박스 (왼쪽) */}
        <Box
          flex={isMobile ? "none" : 2}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          px={isMobile ? 1 : 2}
          py={isMobile ? 1 : 1}
          textAlign="center"
        >
          <Typography
            variant={isMobile ? "h6" : "h5"}
            fontWeight={600}
            mb={isMobile ? 1 : 2}
            sx={{
              color: "#2e2e2e",
              background: "linear-gradient(transparent 60%, #d4f1db 60%)",
              borderRadius: 0,
              display: "inline",
              boxDecorationBreak: "clone",
              fontSize: isMobile ? "clamp(1rem, 4vw, 1.2rem)" : "inherit",
              lineHeight: 1.3,
            }}
          >
            {randomMessage}
          </Typography>
          <Typography
            variant="body1"
            mt={isMobile ? 0.5 : 1}
            sx={{
              fontSize: isMobile ? "clamp(0.85rem, 3vw, 1rem)" : "inherit",
              lineHeight: 1.4,
            }}
          >
            함께하는 모임이 기다리고 있어요 🥾
          </Typography>
        </Box>

        {/* 구분선 */}
        <Box
          width={isMobile ? "100%" : "2px"}
          height={isMobile ? "2px" : "auto"}
          bgcolor="#e0e0e0"
          mx={isMobile ? 0 : 2}
          my={isMobile ? 1 : 0}
          borderRadius={1}
        />

        {/* 버튼들 */}
        <Box
          flex={isMobile ? "none" : 1}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          gap={isMobile ? 1.5 : 2}
        >
          <GreenButton
            style={{
              height: isMobile ? "48px" : "55px",
              width: "100%",
              color: "#4c7559",
              background: "#fdfdfd",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              fontSize: isMobile ? "clamp(0.9rem, 3vw, 1rem)" : "inherit",
              fontWeight: "500",
            }}
            onClick={() => navigate("/meeting/create")}
          >
            새로운 모임 만들기
          </GreenButton>
          <GreenButton
            style={{
              height: isMobile ? "48px" : "55px",
              width: "100%",
              color: "#4c7559",
              background: "#fdfdfd",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              fontSize: isMobile ? "clamp(0.9rem, 3vw, 1rem)" : "inherit",
              fontWeight: "500",
            }}
            onClick={() => navigate("/meeting/my")}
          >
            나의 모임 참여 현황
          </GreenButton>
        </Box>
      </Box>
    </Box>
  );
};

export default MeetingHeader;
