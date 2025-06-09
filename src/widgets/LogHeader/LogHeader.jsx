import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography } from "@mui/material";
import mountainMessages from "shared/constants/mountainMessages";

const LogHeader = ({ userId }) => {
  const [badgeInfo, setBadgeInfo] = useState(null);
  const randomMessage =
    mountainMessages[Math.floor(Math.random() * mountainMessages.length)];

  useEffect(() => {
    const fetchBadgeInfo = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/record-service/users/${userId}/badge-profile`
        );
        setBadgeInfo(response.data);
        console.log("배지 정보 불러오기 성공", response.data);
      } catch (error) {
        console.error("배지 정보 불러오기 실패", error);
      }
    };

    fetchBadgeInfo();
  }, [userId]);

  return (
    <Box
      position="absolute"
      top="80px"
      left="50%"
      sx={{
        transform: "translateX(-50%)",
        width: "90%",
        maxWidth: "700px",
        textAlign: "center",
        px: 2,
        py: 3,
        borderRadius: 3,
        bgcolor: "#f5f5f5",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}
    >
      {!badgeInfo ? (
        <Typography>
          {" "}
          <br />
          🧭 배지를 찾는 중... 조금만 기다려주세요! <br />
        </Typography>
      ) : (
        <>
          <Typography
            variant="h5"
            fontWeight="bold"
            mb={2}
            sx={{ color: "#4c7559" }}
          >
            {randomMessage}
          </Typography>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexWrap="wrap"
            gap={1}
            mb={1}
          >
            <Box display="flex" alignItems="center">
              <Box
                component="img"
                src={`/assets/badges/Badge_0${badgeInfo.stage}.svg`}
                alt="등산 배지"
                sx={{
                  width: 24,
                  height: 24,
                  mr: "3px",
                  transform: "translateY(-2px)",
                }}
              />
              <Typography fontWeight="bold" component="span">
                {badgeInfo.nickname}
              </Typography>
            </Box>
            <Typography component="span">
              님의 발걸음이 쌓여{" "}
              <Box
                component="span"
                sx={{ fontWeight: "bold", color: "#4c7559" }}
              >
                {badgeInfo.title}
              </Box>
              이 되었어요!
            </Typography>
          </Box>
          <Typography variant="body1">
            오늘도 멋진 기록 남겨볼까요? ✨
          </Typography>
        </>
      )}
    </Box>
  );
};

export default LogHeader;
