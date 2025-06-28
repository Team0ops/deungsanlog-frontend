import {
  Box,
  Typography,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useState } from "react";
import axiosInstance from "shared/lib/axiosInstance";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
import { useNavigate } from "react-router-dom";
import NicknameWithBadge from "widgets/user/NicknameWithBadge";
import LoginRequiredModal from "shared/components/LoginRequiredModal";
import { getUserInfo } from "shared/lib/auth";

dayjs.locale("ko");
dayjs.extend(weekday);
dayjs.extend(localeData);

const formatDateTime = (date, time) => {
  if (!date || !time) return "-";
  const dt = dayjs(`${date}T${time}`);
  const dayOfWeek = dt.format("dd");
  return dt.format(`YYYY년 M월 D일 (${dayOfWeek}) A h시 m분`);
};

const statusMap = {
  OPEN: { label: "모집중", color: "success" },
  FULL: { label: "정원마감", color: "warning" },
  CLOSED: { label: "마감", color: "default" },
  CANCELLED: { label: "취소", color: "error" },
};

const MeetingCard = ({ meeting }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const [memberCount, setMemberCount] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const userInfo = getUserInfo();
  const isLoggedIn = !!userInfo?.userId;

  useEffect(() => {
    if (!meeting) return;
    let ignore = false;
    axiosInstance
      .get(`/meeting-service/${meeting.id}/accepted-members`)
      .then((res) => {
        if (ignore) return;
        console.log(`🔍 모임 ${meeting.id} 참여자 조회:`, res.data);
        const joinedCount = Array.isArray(res.data) ? res.data.length : 1;
        setMemberCount(joinedCount);
        console.log(
          `✅ 모임 ${meeting.id} 참여자 수: ${joinedCount}/${meeting.maxParticipants}`
        );
      })
      .catch((error) => {
        console.error(`❌ 모임 ${meeting.id} 참여자 조회 실패:`, error);
        setMemberCount(1);
      });
    return () => {
      ignore = true;
    };
  }, [meeting?.id]);

  if (!meeting) return null;

  const status = statusMap[meeting.status] || {
    label: meeting.status,
    color: "default",
  };

  const bgColor = theme.palette[status.color]?.main || theme.palette.grey[400];

  const handleCardClick = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
    } else {
      navigate(`/meeting/detail/${meeting.id}`);
    }
  };

  const handleLogin = () => {
    setShowLoginModal(false);
    navigate("/login");
  };

  const handleCloseModal = () => {
    setShowLoginModal(false);
  };

  return (
    <>
      <Box
        sx={{
          borderRadius: 4,
          border: "1px solid #e0e0e0",
          p: isMobile ? 2 : 3,
          width: "100%",
          bgcolor: "#fcfcfa",
          boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
          mb: isMobile ? 1.5 : 2,
          transition: "0.25s ease",
          cursor: "pointer",
          "&:hover": {
            boxShadow: "0 8px 20px rgba(76, 117, 89, 0.2)",
            transform: "translateY(-3px)",
            borderColor: "#c8e0d0",
            background: "linear-gradient(135deg, #ffffff 0%, #f7fbf9 100%)",
          },
        }}
        onClick={handleCardClick}
      >
        {/* 상단 - 제목 & 상태 */}
        <Box
          display="flex"
          flexDirection={isMobile ? "column" : "row"}
          justifyContent="space-between"
          alignItems={isMobile ? "flex-start" : "flex-start"}
          gap={isMobile ? 1 : 0}
        >
          <Box flex={1} minWidth={0}>
            <Typography
              variant={isMobile ? "body2" : "subtitle2"}
              fontWeight={700}
              noWrap
              sx={{
                display: "inline",
                background: "linear-gradient(transparent 60%, #fffaad 60%)",
                boxDecorationBreak: "clone",
                WebkitBoxDecorationBreak: "clone",
                color: "#3b5f47",
                fontSize: isMobile ? "clamp(0.8rem, 3vw, 0.9rem)" : "inherit",
              }}
            >
              {meeting.mountainName}
            </Typography>
            <Typography
              variant={isMobile ? "subtitle1" : "h6"}
              fontWeight={800}
              color="#2c2c2c"
              noWrap
              sx={{
                fontSize: isMobile ? "clamp(1rem, 4vw, 1.2rem)" : "inherit",
                lineHeight: 1.3,
              }}
            >
              {meeting.title}
            </Typography>
            <Typography
              variant="body2"
              color="#666"
              mt={isMobile ? 0.3 : 0.5}
              sx={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                fontSize: isMobile ? "clamp(0.8rem, 3vw, 0.9rem)" : "inherit",
                lineHeight: 1.4,
              }}
            >
              {meeting.description}
            </Typography>
          </Box>

          {/* 모집 상태 + 인원 현황을 하나의 박스에 */}
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              mt: isMobile ? 0 : 0.5,
              px: isMobile ? 1 : 1.5,
              py: isMobile ? 0.3 : 0.4,
              borderRadius: 2,
              backgroundColor: `${bgColor}10`,
              border: `1px solid ${bgColor}`,
              color: bgColor,
              fontSize: isMobile ? "clamp(0.7rem, 2.5vw, 0.8rem)" : "0.8rem",
              fontWeight: 600,
              alignSelf: isMobile ? "flex-start" : "center",
            }}
          >
            <span>{status.label}</span>
            {memberCount !== null && meeting.status !== "CANCELLED" && (
              <span style={{ fontWeight: 500 }}>
                {memberCount}/{meeting.maxParticipants}
              </span>
            )}
          </Box>
        </Box>

        <Divider sx={{ my: isMobile ? 1 : 1.5 }} />

        {/* 하단 - 날짜 & 기타 정보 */}
        <Box display="flex" flexDirection="column" gap={1}>
          {meeting.hostUserId && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                fontSize: isMobile
                  ? "clamp(0.75rem, 2.5vw, 0.8rem)"
                  : "inherit",
                lineHeight: 1.4,
              }}
            >
              👤 개설자:{" "}
              <NicknameWithBadge
                userId={meeting.hostUserId}
                style={{
                  fontSize: isMobile
                    ? "clamp(0.75rem, 2.5vw, 0.8rem)"
                    : "inherit",
                  color: "#4c7559",
                  fontWeight: 600,
                }}
              />
            </Typography>
          )}

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              fontSize: isMobile ? "clamp(0.75rem, 2.5vw, 0.8rem)" : "inherit",
              lineHeight: 1.4,
            }}
          >
            📅 일정:{" "}
            {formatDateTime(meeting.scheduledDate, meeting.scheduledTime)}
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              fontSize: isMobile ? "clamp(0.75rem, 2.5vw, 0.8rem)" : "inherit",
              lineHeight: 1.4,
            }}
          >
            ⏰ 모집 마감:{" "}
            {formatDateTime(meeting.deadlineDate, meeting.scheduledTime)}
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
            noWrap
            sx={{
              fontSize: isMobile ? "clamp(0.75rem, 2.5vw, 0.8rem)" : "inherit",
              lineHeight: 1.4,
            }}
          >
            📍 {meeting.gatherLocation}
          </Typography>
        </Box>
      </Box>

      {/* 로그인 필요 모달 */}
      <LoginRequiredModal
        isOpen={showLoginModal}
        onClose={handleCloseModal}
        onLogin={handleLogin}
        title="모임 상세보기"
        message={`모임 상세 정보를 보려면\n로그인이 필요해요!`}
      />
    </>
  );
};

export default MeetingCard;
