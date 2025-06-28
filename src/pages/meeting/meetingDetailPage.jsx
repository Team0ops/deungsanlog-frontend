import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme, useMediaQuery } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
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
import useMeetingDeadline from "../../hooks/useMeetingDeadline";

const MeetingDetailPage = () => {
  const { meetingId } = useParams();
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // 마감일 체크 훅 사용 (자동 마감 처리만)
  useMeetingDeadline(meeting);

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
        {/* 뒤로가기 버튼 */}
        <Box
          sx={{
            position: "absolute",
            top: isMobile ? "1.5rem" : "2rem",
            left: isMobile ? "1.5rem" : "2rem",
            zIndex: 10,
          }}
        >
          <button
            onClick={() => navigate(-1)}
            style={{
              background: "#f4f8f4",
              border: "none",
              color: "#27ae60",
              fontSize: isMobile ? "1rem" : "1.15rem",
              cursor: "pointer",
              borderRadius: "50%",
              width: isMobile ? "40px" : "44px",
              height: isMobile ? "40px" : "44px",
              minWidth: isMobile ? "40px" : "44px",
              minHeight: isMobile ? "40px" : "44px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 600,
              boxShadow: "0 2px 8px rgba(39,174,96,0.07)",
              transition: "background 0.15s",
              padding: 0,
              gap: "0.3rem",
            }}
            aria-label="뒤로가기"
            onMouseOver={(e) => (e.currentTarget.style.background = "#e6f6ec")}
            onMouseOut={(e) => (e.currentTarget.style.background = "#f4f8f4")}
          >
            <ArrowBackIosNewIcon
              style={{ fontSize: isMobile ? "1rem" : "1.2rem" }}
            />
          </button>
        </Box>

        {/* 왼쪽: 모임 정보 */}
        <Box
          flex={2}
          minWidth={0}
          sx={{
            overflowY: "auto",
            maxHeight: "100%",
            pr: 1,
            pt: isMobile ? 6 : 7,
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
              variant="gradient"
              color={statusInfo.color}
              size="lg"
              badgeContent={statusInfo.label}
              container
            />
            <SoftBadge
              variant="gradient"
              color="success"
              size="lg"
              badgeContent={meeting.mountainName}
              container
            />
          </Box>

          <Typography
            variant={isMobile ? "h5" : "h4"}
            fontWeight={800}
            mb={isMobile ? 1.5 : 2}
            sx={{
              fontSize: isMobile ? "clamp(1.3rem, 5vw, 1.5rem)" : "inherit",
              lineHeight: 1.3,
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
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MeetingMemberStatusBox meetingId={meetingId} meeting={meeting} />
        </Box>
      </Paper>
    </Box>
  );
};

export default MeetingDetailPage;
