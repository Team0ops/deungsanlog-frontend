import { Box, Typography, Divider, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import axiosInstance from "shared/lib/axiosInstance";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";

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

  const bgColor = theme.palette[status.color]?.main || theme.palette.grey[400];

  return (
    <Box
      sx={{
        borderRadius: 4,
        border: "1px solid #e0e0e0",
        p: 3,
        width: "100%",
        bgcolor: "#fcfcfa",
        boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
        mb: 2,
        transition: "0.25s ease",
        "&:hover": {
          boxShadow: "0 8px 20px rgba(76, 117, 89, 0.2)",
          transform: "translateY(-3px)",
          borderColor: "#c8e0d0",
          background: "linear-gradient(135deg, #ffffff 0%, #f7fbf9 100%)",
        },
      }}
    >
      {/* 상단 - 제목 & 상태 */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <Box flex={1} minWidth={0}>
          <Typography
            variant="subtitle2"
            fontWeight={700}
            noWrap
            sx={{
              display: "inline",
              background: "linear-gradient(transparent 60%, #fffaad 60%)",
              boxDecorationBreak: "clone",
              WebkitBoxDecorationBreak: "clone",
              color: "#3b5f47",
            }}
          >
            {meeting.mountainName}
          </Typography>
          <Typography variant="h6" fontWeight={800} color="#2c2c2c" noWrap>
            {meeting.title}
          </Typography>
          <Typography
            variant="body2"
            color="#666"
            mt={0.5}
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
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
            mt: 0.5,
            px: 1.5,
            py: 0.4,
            borderRadius: 2,
            backgroundColor: `${bgColor}10`, // or '08'
            border: `1px solid ${bgColor}`,
            color: bgColor,
            fontSize: "0.8rem",
            fontWeight: 600,
          }}
        >
          <span>{status.label}</span>
          {memberCount !== null && (
            <span style={{ fontWeight: 500 }}>
              {memberCount}/{meeting.maxParticipants}
            </span>
          )}
        </Box>
      </Box>

      <Divider sx={{ my: 1.5 }} />
      {/* 하단 - 날짜 & 기타 정보 */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={1}
      >
        <Typography variant="caption" color="text.secondary">
          📅 일정:{" "}
          {formatDateTime(meeting.scheduledDate, meeting.scheduledTime)}
        </Typography>

        <Typography variant="caption" color="text.secondary">
          ⏰ 모집 마감:{" "}
          {formatDateTime(meeting.deadlineDate, meeting.scheduledTime)}
        </Typography>

        <Typography variant="caption" color="text.secondary" noWrap>
          📍 {meeting.gatherLocation}
        </Typography>
      </Box>
    </Box>
  );
};

export default MeetingCard;
