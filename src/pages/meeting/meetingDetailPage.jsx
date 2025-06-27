import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
        padding: "clamp(1rem, 4vw, 1.5rem)",
        position: "relative",
        height: "calc(100vh - 40px)",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1.2fr 1fr" },
          gap: 6,
          width: "100%",
          maxWidth: 900,
          margin: "0 auto",
          p: 5,
          borderRadius: "24px",
          minHeight: 420,
          background: "#fff",
        }}
      >
        {/* 왼쪽: 모임 정보 */}
        <Box flex={2} minWidth={0}>
          {/* 상태 뱃지 + 산이름 뱃지 가로 배치 */}
          <Box display="flex" alignItems="center" mb={2.5} gap={1.5}>
            <SoftBadge
              color={statusInfo.color}
              size="md"
              variant="contained"
              sx={{
                borderRadius: "999px",
                fontWeight: 700,
                fontFamily: "'GmarketSansTTFBold', 'Pretendard', sans-serif",
                fontSize: "1.08rem",
                px: 2.5,
                py: 1,
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
                fontSize: "1.05rem",
                px: 2.5,
                py: 1,
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
            mb={2.5}
            mt={0}
            sx={{
              fontFamily: "'GmarketSansTTFBold', 'Pretendard', sans-serif",
              textShadow: "0 2px 8px #e0f7fa",
              color: "#4b8161",
              fontSize: "1.18rem",
            }}
          >
            {meeting.title}
          </Typography>
          <Typography variant="body1" mb={3} sx={{ fontSize: "1.07rem" }}>
            {meeting.description}
          </Typography>
          <Divider sx={{ my: 3 }} />
          <Typography
            variant="body2"
            color="text.secondary"
            mb={2}
            sx={{ fontSize: "1.02rem" }}
          >
            🗓️ 일정: {meeting.scheduledDate} {meeting.scheduledTime}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            mb={2}
            sx={{ fontSize: "1.02rem" }}
          >
            ⏰ 모집 마감: {meeting.deadlineDate}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            mb={2}
            sx={{ fontSize: "1.02rem" }}
          >
            📍 집결지: {meeting.gatherLocation}
          </Typography>
        </Box>

        {/* 오른쪽: 모임원/상태 현황 컴포넌트 분리 */}
        <MeetingMemberStatusBox meetingId={meetingId} meeting={meeting} />
      </Paper>
    </Box>
  );
};

export default MeetingDetailPage;
