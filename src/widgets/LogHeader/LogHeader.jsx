import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, Typography } from "@mui/material";
import mountainMessages from "shared/constants/mountainMessages";
import GreenButton from "shared/ui/GreenButton";

const LogHeader = ({ userId, sortOption, setSortOption }) => {
  const [badgeInfo, setBadgeInfo] = useState(null);
  const randomMessage =
    mountainMessages[Math.floor(Math.random() * mountainMessages.length)];
  const navigate = useNavigate();

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
      display="flex"
      justifyContent="center"
      alignItems="stretch"
      gap={3}
      width="100%"
      maxWidth="1000px"
      mx="auto"
      mt={4}
      px={2}
      ml={-1}
    >
      {/* 기존 헤더 박스 */}
      <Box
        flex={1}
        maxWidth="700px"
        textAlign="center"
        px={2}
        py={3}
        borderRadius={3}
        bgcolor="#f5f5f5"
        boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)"
        height="100%"
      >
        {!badgeInfo ? (
          <Typography>🧭 배지를 찾는 중... 조금만 기다려주세요!</Typography>
        ) : (
          <>
            <Typography
              variant="h5"
              fontWeight={900}
              mb={2}
              sx={{
                color: "#4b8161",
                background: "linear-gradient(transparent 60%, #fff7c9 60%)",
                borderRadius: 0,
                display: "inline",
                px: 0,
                py: 0,
                boxDecorationBreak: "clone",
              }}
            >
              {randomMessage}
            </Typography>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="stretch"
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

      {/* 오른쪽 버튼 2개 세로 박스 */}
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        gap={1}
        bgcolor="transparent"
        p={2}
        borderRadius={3}
        height="100%"
        width="20%"
        mt={-1}
      >
        <GreenButton
          onClick={() => navigate("/log/write")}
          style={{
            height: "65px",
            width: "100%",
            color: "#4c7559",
            background: "#f5f5f5",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          기록하기
        </GreenButton>
        <Box height="20%"></Box>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          style={{
            height: "65px",
            width: "100%",
            padding: "0 1rem",
            borderRadius: "12px",
            border: "1px solid #d0d0d0",
            background: "#f5f5f5",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            fontWeight: "bold",
            color: "#4c7559",
            fontSize: "1rem",
            outline: "none",
            cursor: "pointer",
            appearance: "none",
            WebkitAppearance: "none",
            MozAppearance: "none",
            textAlignLast: "center",
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg fill='Green' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>\")",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 1rem center",
            backgroundSize: "16px 16px",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
          }}
        >
          <option value="latest">최신순</option>
          <option value="oldest">오래된순</option>
        </select>
      </Box>
    </Box>
  );
};

export default LogHeader;
