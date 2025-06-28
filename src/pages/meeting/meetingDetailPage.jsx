import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTheme, useMediaQuery } from "@mui/material";
import axiosInstance from "shared/lib/axiosInstance";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Divider,
  Paper,
} from "@mui/material";
import MeetingMemberStatusBox from "widgets/meeting/status/MeetingMemberStatusBox";
import SoftBadge from "shared/ui/SoftBadge";

const MeetingDetailPage = () => {
  const { meetingId } = useParams();
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // 날짜를 사용자 친화적으로 포맷팅하는 함수
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}년 ${month}월 ${day}일`;
  };

  // 시간을 사용자 친화적으로 포맷팅하는 함수
  const formatTime = (timeString) => {
    if (!timeString) return "";
    // "HH:MM" 형식으로 가정
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "오후" : "오전";
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const minuteText = minutes === "00" ? "" : ` ${minutes}분`;
    return `${ampm} ${displayHour}시${minuteText}`;
  };

  useEffect(() => {
    axiosInstance
      .get(`/meeting-service/${meetingId}`)
      .then((res) => setMeeting(res.data))
      .finally(() => setLoading(false));
  }, [meetingId]);

  if (loading) return <CircularProgress />;
  if (!meeting) return <Typography>모임 정보를 불러올 수 없습니다.</Typography>;

  // 상태 한글 변환 및 색상 매핑
  const statusMap = {
    OPEN: { label: "모집중", color: "info" },
    FULL: { label: "정원마감", color: "warning" },
    CLOSED: { label: "마감", color: "secondary" },
    CANCELLED: { label: "취소", color: "error" },
  };
  const statusInfo = statusMap[meeting.status] || {
    label: meeting.status,
    color: "dark",
  };

  return (
    <Box
      sx={{
        minWidth: "90%",
        maxWidth: "100%",
        minHeight: "40vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "transparent",
        borderRadius: "20px",
        padding: isMobile
          ? "clamp(0.8rem, 3vw, 1rem)"
          : "clamp(1rem, 4vw, 1.5rem)",
        position: "relative",
        height: "calc(100vh - 40px)",
        overflowY: "auto",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1.2fr 1fr" },
          gap: isMobile ? 3 : 6,
          width: "100%",
          maxWidth: 900,
          margin: "0 auto",
          p: isMobile ? 3 : 5,
          borderRadius: "24px",
          minHeight: isMobile ? 300 : 420,
          background: "#fff",
          overflow: "hidden",
        }}
      >
        {/* 왼쪽: 모임 정보 */}
        <Box
          flex={2}
          minWidth={0}
          sx={{
            overflowY: "auto",
            maxHeight: "100%",
            pr: 1,
          }}
        >
          {/* 상태 뱃지 + 산이름 뱃지 가로 배치 */}
          <Box
            display="flex"
            mb={isMobile ? 2 : 2.5}
            gap={isMobile ? 1 : 1.5}
            flexDirection={isMobile ? "column" : "row"}
            alignItems={isMobile ? "flex-start" : "center"}
          >
            <SoftBadge
              color={statusInfo.color}
              size="md"
              variant="contained"
              sx={{
                borderRadius: "999px",
                fontWeight: 700,
                fontFamily: "'GmarketSansTTFBold', 'Pretendard', sans-serif",
                fontSize: isMobile ? "0.95rem" : "1.08rem",
                px: isMobile ? 2 : 2.5,
                py: isMobile ? 0.8 : 1,
                backgroundColor: "#e0f7fa",
                color: "#4b8161",
                boxShadow: "0 2px 8px 0 rgba(76, 129, 97, 0.08)",
              }}
            >
              {statusInfo.label}
            </SoftBadge>
            <SoftBadge
              color="success"
              size="md"
              variant="contained"
              sx={{
                borderRadius: "999px",
                fontWeight: 700,
                fontFamily: "'GmarketSansTTFBold', 'Pretendard', sans-serif",
                fontSize: isMobile ? "0.9rem" : "1.05rem",
                px: isMobile ? 2 : 2.5,
                py: isMobile ? 0.8 : 1,
                backgroundColor: "#d2f5c7",
                color: "#3a5d2c",
                boxShadow: "0 2px 8px 0 rgba(58, 93, 44, 0.08)",
                display: "inline-block",
              }}
            >
              🏔️ {meeting.mountainName}
            </SoftBadge>
          </Box>
          <Typography
            variant="h5"
            fontWeight={700}
            mb={isMobile ? 2 : 2.5}
            mt={0}
            sx={{
              fontFamily: "'GmarketSansTTFBold', 'Pretendard', sans-serif",
              textShadow: "0 2px 8px #e0f7fa",
              color: "#4b8161",
              fontSize: isMobile ? "1.1rem" : "1.18rem",
            }}
          >
            {meeting.title}
          </Typography>
          <Typography
            variant="body1"
            mb={isMobile ? 2 : 3}
            sx={{
              fontSize: isMobile ? "1rem" : "1.07rem",
              lineHeight: 1.5,
            }}
          >
            {meeting.description}
          </Typography>
          <Divider sx={{ my: isMobile ? 2 : 3 }} />
          <Typography
            variant="body2"
            color="text.secondary"
            mb={isMobile ? 1.5 : 2}
            sx={{
              fontSize: isMobile ? "0.95rem" : "1.02rem",
              lineHeight: 1.4,
            }}
          >
            🗓️ 일정: {formatDate(meeting.scheduledDate)}{" "}
            {formatTime(meeting.scheduledTime)}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            mb={isMobile ? 1.5 : 2}
            sx={{
              fontSize: isMobile ? "0.95rem" : "1.02rem",
              lineHeight: 1.4,
            }}
          >
            ⏰ 모집 마감: {formatDate(meeting.deadlineDate)}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            mb={isMobile ? 1.5 : 2}
            sx={{
              fontSize: isMobile ? "0.95rem" : "1.02rem",
              lineHeight: 1.4,
            }}
          >
            📍 집결지: {meeting.gatherLocation}
          </Typography>
        </Box>

        {/* 오른쪽: 모임원/상태 현황 컴포넌트 분리 */}
        <Box
          sx={{
            overflowY: "auto",
            maxHeight: "100%",
            pl: 1,
          }}
        >
          <MeetingMemberStatusBox meetingId={meetingId} meeting={meeting} />
        </Box>
      </Paper>
    </Box>
  );
};

export default MeetingDetailPage;
