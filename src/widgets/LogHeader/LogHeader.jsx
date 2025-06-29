import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "shared/lib/axiosInstance";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import mountainMessages from "shared/constants/mountainMessages";
import GreenButton from "shared/ui/greenButton";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";

const LogHeader = ({ userId, sortOption, setSortOption }) => {
  const [badgeInfo, setBadgeInfo] = useState(null);
  const randomMessage =
    mountainMessages[Math.floor(Math.random() * mountainMessages.length)];
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchBadgeInfo = async () => {
      try {
        const response = await axiosInstance.get(
          `/record-service/users/${userId}/badge-profile`
        );
        setBadgeInfo(response.data);
      } catch (error) {
        console.error("배지 정보 불러오기 실패", error);
      }
    };

    fetchBadgeInfo();
  }, [userId]);

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
        {/* 메시지/배지 박스 (왼쪽) */}
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
          {/* (i) 아이콘 버튼 추가 */}
          <Box display="flex" justifyContent="flex-end" width="100%">
            <IconButton
              size="small"
              onClick={() => navigate("/log/badge-info")}
              sx={{
                color: "#4b8161",
                fontSize: isMobile ? 20 : 25,
                outline: "none",
                "&:focus": { outline: "none" },
                "&:active": { outline: "none" },
              }}
              aria-label="배지 단계 설명"
              disableFocusRipple
              disableRipple
              tabIndex={0}
            >
              <InfoOutlinedIcon sx={{ fontSize: isMobile ? 28 : 32 }} />
            </IconButton>
          </Box>
          {!badgeInfo ? (
            <Typography fontSize={isMobile ? "0.9rem" : "1rem"}>
              🧭 배지를 찾는 중... 조금만 기다려주세요!
            </Typography>
          ) : (
            <>
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
                <Box display="flex" alignItems="center">
                  <Box
                    component="img"
                    src={`/assets/badges/Badge_0${badgeInfo.stage}.svg`}
                    alt="등산 배지"
                    sx={{
                      width: isMobile ? 20 : 24,
                      height: isMobile ? 20 : 24,
                      mr: "3px",
                      transform: "translateY(-2px)",
                    }}
                  />
                  <Typography
                    fontSize={isMobile ? "1rem" : "1.2rem"}
                    component="span"
                    sx={{ whiteSpace: "nowrap" }}
                  >
                    {badgeInfo.nickname} 님의
                  </Typography>
                </Box>
                <Typography
                  fontSize={isMobile ? "1rem" : "1.2rem"}
                  component="span"
                  sx={{
                    lineHeight: isMobile ? 1.3 : 1.5,
                    wordBreak: "keep-all",
                  }}
                >
                  발걸음이 쌓여{" "}
                  <Box
                    component="span"
                    sx={{ fontWeight: "bold", color: "#4c7559" }}
                  >
                    {badgeInfo.title}
                  </Box>
                  가 되었어요!
                </Typography>
              </Box>
              <Typography
                fontSize={isMobile ? "1rem" : "1.2rem"}
                variant="body1"
                sx={{ lineHeight: isMobile ? 1.3 : 1.5 }}
              >
                오늘도 멋진 기록 남겨볼까요? ✨
              </Typography>
            </>
          )}
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

        {/* 버튼/셀렉트 박스 (오른쪽) */}
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
            onClick={() => {
              localStorage.removeItem("logWriteForm");
              navigate("/log/write");
            }}
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
            기록하기
          </GreenButton>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            style={{
              height: isMobile ? "45px" : "50px",
              width: "100%",
              padding: "0 1rem",
              borderRadius: "12px",
              border: "1px solid #d0d0d0",
              background: "#fdfdfd",
              fontWeight: "bold",
              fontSize: isMobile ? "0.9rem" : "1rem",
              color: "#4c7559",
              outline: "none",
              cursor: "pointer",
              appearance: "none",
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg fill='Green' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>\")",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 1rem center",
              backgroundSize: "16px 16px",
            }}
          >
            <option value="latest">최신순</option>
            <option value="oldest">오래된순</option>
          </select>
        </Box>
      </Box>
    </Box>
  );
};

export default LogHeader;
