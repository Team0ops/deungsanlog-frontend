import { Box, Typography, Chip } from "@mui/material";
import { useEffect, useState } from "react";
import axiosInstance from "shared/lib/axiosInstance";

const statusMap = {
  OPEN: { label: "모집중", color: "success" },
  FULL: { label: "정원마감", color: "warning" },
  CLOSED: { label: "마감", color: "default" },
  CANCELLED: { label: "취소", color: "error" },
};

const MeetingCard = ({ meeting }) => {
  const [memberCount, setMemberCount] = useState(null);

  useEffect(() => {
    if (!meeting) return;
    let ignore = false;
    axiosInstance
      .get(`/meeting-service/${meeting.id}/members`)
      .then((res) => {
        if (ignore) return;
        const joinedCount = Array.isArray(res.data)
          ? res.data.filter((m) => m.status === "JOINED").length
          : 1;
        setMemberCount(joinedCount);
      })
      .catch(() => setMemberCount(1));
    return () => {
      ignore = true;
    };
  }, [meeting?.id]);

  if (!meeting) return null;

  const status = statusMap[meeting.status] || {
    label: meeting.status,
    color: "default",
  };

  return (
    <Box
      sx={{
        border: "1px solid #e0e0e0",
        borderRadius: 3,
        p: 2.5,
        width: "100%",
        bgcolor: "#fff",
        boxShadow: 1,
        display: "flex",
        alignItems: "center",
        gap: 2,
        mb: 1.5,
        transition: "all 0.3s ease",
        cursor: "pointer",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 6px 12px rgba(76, 117, 89, 0.18)",
          borderColor: "#87ac96",
          background: "linear-gradient(135deg, #fdfdfd 100%)",
        },
      }}
    >
      {/* 상태 뱃지 */}
      <Chip
        label={status.label}
        color={status.color}
        size="small"
        sx={{ fontWeight: 600, fontSize: "0.95rem", minWidth: 70 }}
      />

      {/* 제목 및 산 이름 */}
      <Box
        flex={1}
        minWidth={0}
        ml={2}
        display="flex"
        flexDirection="column"
        gap={0.5}
      >
        <Typography variant="h6" fontWeight={700} noWrap>
          {meeting.title}
        </Typography>
        {/* description */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 0.5 }}
          noWrap
        >
          {meeting.description}
        </Typography>
        <Typography variant="body2" color="primary" fontWeight={600} noWrap>
          {meeting.mountain_name}
        </Typography>
      </Box>

      {/* 일정/마감일 */}
      <Box minWidth={120} textAlign="center">
        <Typography variant="body2" color="text.secondary">
          진행일: {meeting.scheduled_date || meeting.scheduledDate}{" "}
          {meeting.scheduled_time?.slice(0, 5) ||
            meeting.scheduledTime?.slice(0, 5)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          모집마감일: {meeting.deadline_date || meeting.deadlineDate}
        </Typography>
      </Box>

      {/* 인원/집결지 */}
      <Box minWidth={110} textAlign="center">
        <Typography variant="body2" color="text.secondary">
          인원: {memberCount !== null ? memberCount : "…"}/
          {meeting.max_participants}명
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {meeting.gather_location}
        </Typography>
      </Box>
    </Box>
  );
};

export default MeetingCard;
