import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "shared/lib/axiosInstance";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import GreenButton from "shared/ui/greenButton";
import { getUserInfo } from "shared/lib/auth";
import NicknameWithBadge from "widgets/user/NicknameWithBadge";

const meetingMessages = [
  "함께한 모임들이 쌓여가고 있어요! 🏔️",
  "새로운 사람들과의 만남이 기다리고 있어요 👥",
  "모임을 통해 더 많은 산을 정복해보세요! 🥾",
  "함께 걷는 즐거움을 느껴보세요! 👣",
  "새로운 모임에 참가해보는 건 어때요? 💬",
  "모임을 통해 더 많은 이야기를 만들어보세요! 📖",
  "함께하는 등산이 더욱 특별해요! ✨",
  "새로운 친구들과의 만남을 기대해보세요! 🤝",
];

const MyMeetingHeader = () => {
  const [meetingCount, setMeetingCount] = useState(0);
  const randomMessage =
    meetingMessages[Math.floor(Math.random() * meetingMessages.length)];
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const userInfo = getUserInfo();

  useEffect(() => {
    const fetchMeetingCount = async () => {
      if (!userInfo?.userId) return;

      try {
        const response = await axiosInstance.get(
          `/meeting-service/my-meeting-ids?userId=${userInfo.userId}`
        );
        setMeetingCount(response.data.length);
      } catch (error) {
        console.error("모임 개수 불러오기 실패", error);
        setMeetingCount(0);
      }
    };

    fetchMeetingCount();
  }, [userInfo?.userId]);

  return (
    <Box
      width="100%"
      maxWidth="1000px"
      mx="auto"
      mt={isMobile ? 2 : 4}
      px={isMobile ? 1 : 2}
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
        {/* 메시지/통계 박스 (왼쪽) */}
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
            fontWeight={900}
            mb={isMobile ? 1 : 2}
            sx={{
              color: "#4b8161",
              background: isMobile
                ? "none"
                : "linear-gradient(transparent 60%, #fff7c9 60%)",
              borderRadius: 0,
              display: "inline-block",
              boxDecorationBreak: "clone",
              WebkitBoxDecorationBreak: "clone",
              fontSize: isMobile ? "1rem" : "inherit",
              lineHeight: isMobile ? 1.4 : 1.6,
              px: 0.5,
            }}
          >
            {randomMessage}
          </Typography>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexWrap="wrap"
            gap={isMobile ? 0.5 : 1}
            mb={isMobile ? 0.5 : 1}
          >
            <Typography
              fontSize={isMobile ? "1rem" : "1.2rem"}
              component="span"
              sx={{ whiteSpace: "nowrap" }}
            >
              <NicknameWithBadge
                userId={userInfo?.userId}
                style={{
                  fontSize: isMobile ? "1rem" : "1.2rem",
                  color: "#4c7559",
                  fontWeight: 600,
                }}
              />{" "}
              님은
            </Typography>
            <Typography
              fontSize={isMobile ? "1rem" : "1.2rem"}
              component="span"
              sx={{
                lineHeight: isMobile ? 1.3 : 1.5,
                wordBreak: "keep-all",
              }}
            >
              지금까지{" "}
              <Box
                component="span"
                sx={{ fontWeight: "bold", color: "#4c7559" }}
              >
                {meetingCount}개의 모임
              </Box>
              에 참여했어요!
            </Typography>
          </Box>
          <Typography
            fontSize={isMobile ? "1rem" : "1.2rem"}
            variant="body1"
            sx={{ lineHeight: isMobile ? 1.3 : 1.5 }}
          >
            새로운 모임에 참가해보는 건 어때요? 🎯
          </Typography>
        </Box>

        {/* 구분선 */}
        {!isMobile && (
          <Box
            width="2px"
            height="auto"
            bgcolor="#e0e0e0"
            mx={2}
            my={0}
            borderRadius={1}
            display={{ xs: "block", md: "block" }}
          />
        )}

        {/* 버튼 (오른쪽) */}
        <Box
          flex={isMobile ? "none" : 1}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          gap={isMobile ? 1.5 : 2}
          width={isMobile ? "100%" : "auto"}
        >
          <GreenButton
            onClick={() => navigate("/meeting")}
            style={{
              height: isMobile ? "45px" : "50px",
              width: "100%",
              color: "#4c7559",
              fontWeight: "bold",
              fontSize: isMobile ? "1rem" : "1.1rem",
              background: "#fdfdfd",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            모임 둘러보기
          </GreenButton>
          <GreenButton
            onClick={() => navigate("/meeting/create")}
            style={{
              height: isMobile ? "45px" : "50px",
              width: "100%",
              color: "#4c7559",
              fontWeight: "bold",
              fontSize: isMobile ? "1rem" : "1.1rem",
              background: "#fdfdfd",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            새 모임 만들기
          </GreenButton>
        </Box>
      </Box>
    </Box>
  );
};

export default MyMeetingHeader;
