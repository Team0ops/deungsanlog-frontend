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
        elevation={2}
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
          width: "100%",
          maxWidth: 900,
          margin: "0 auto",
          p: 4,
          borderRadius: 4,
          minHeight: 400,
        }}
      >
        {/* 왼쪽: 모임 정보 */}
        <Box flex={2} minWidth={0}>
          <Typography variant="h4" fontWeight={700} mb={2}>
            {meeting.title}
          </Typography>
          <Typography variant="subtitle1" color="primary" mb={1}>
            {meeting.mountainName}
          </Typography>
          <Typography variant="body1" mb={2}>
            {meeting.description}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" color="text.secondary" mb={1}>
            🗓️ 일정: {meeting.scheduledDate} {meeting.scheduledTime}
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={1}>
            ⏰ 모집 마감: {meeting.deadlineDate}
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={1}>
            📍 집결지: {meeting.gatherLocation}
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={1}>
            👥 최대 인원: {meeting.maxParticipants}명
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={1}>
            🔗 오픈채팅:{" "}
            {meeting.chatLink ? (
              <a
                href={meeting.chatLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                {meeting.chatLink}
              </a>
            ) : (
              "없음"
            )}
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={1}>
            상태: {meeting.status}
          </Typography>
        </Box>

        {/* 오른쪽: 모임원/상태 현황 컴포넌트 분리 */}
        <MeetingMemberStatusBox meetingId={meetingId} meeting={meeting} />
      </Paper>
    </Box>
  );
};

export default MeetingDetailPage;
