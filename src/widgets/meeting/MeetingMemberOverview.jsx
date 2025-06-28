import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Avatar,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import axiosInstance from "shared/lib/axiosInstance";
import NicknameWithBadge from "widgets/user/NicknameWithBadge";

const MeetingMemberOverview = ({ meetingId, meeting }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `/meeting-service/${meetingId}/accepted-members`
      );
      setMembers(res.data);
    } catch {
      setMembers([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMembers();
    // eslint-disable-next-line
  }, [meetingId]);

  return (
    <Box
      sx={{
        mb: isMobile ? 1.5 : 2,
        bgcolor: "transparent",
        borderRadius: 2,
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={1}
      >
        <Typography
          fontWeight={700}
          fontSize={isMobile ? "0.9rem" : "1rem"}
          color="#4b8161"
        >
          모임원 현황 {members.length}/{meeting?.maxParticipants || 0}
        </Typography>
        <Button
          size={isMobile ? "small" : "small"}
          onClick={fetchMembers}
          disabled={loading}
          sx={{
            minWidth: "auto",
            p: isMobile ? 1 : 1.5,
            color: "#70a784",
            outline: "none",
            "&:focus": {
              outline: "none",
            },
            "&:hover": {
              backgroundColor: "rgba(112, 167, 132, 0.1)",
            },
            "&:disabled": {
              color: "#ccc",
            },
          }}
        >
          <RefreshIcon sx={{ fontSize: isMobile ? "1.2rem" : "1.5rem" }} />
        </Button>
      </Box>
      {loading ? (
        <Typography
          color="text.secondary"
          fontSize={isMobile ? "0.85rem" : "0.95rem"}
        >
          불러오는 중...
        </Typography>
      ) : (
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            maxHeight: isMobile ? 100 : 120,
            overflowY: "auto",
            pr: { xs: 0.5, sm: 1 },
            bgcolor: "#fff",
            borderRadius: 3,
            p: isMobile ? 1 : 1.5,
          }}
        >
          {members.length === 0 ? (
            <Typography
              color="text.secondary"
              fontSize={isMobile ? "0.85rem" : "0.95rem"}
            >
              아직 모임원이 없습니다.
            </Typography>
          ) : (
            members.map((m) => (
              <Box
                key={m.userId}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mb={1}
                sx={{
                  backgroundColor: "rgba(165,216,110,0.08)",
                  border: "none",
                  borderRadius: "10px",
                  minHeight: { xs: 28, sm: 40 },
                  boxShadow: "0 2px 8px 0 rgba(165,216,110,0.02)",
                  p: isMobile ? 0.5 : 1,
                }}
              >
                <Box
                  maxWidth={isMobile ? 100 : 120}
                  overflow="hidden"
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                >
                  <NicknameWithBadge userId={m.userId} />
                </Box>
              </Box>
            ))
          )}
        </Box>
      )}
    </Box>
  );
};

export default MeetingMemberOverview;
