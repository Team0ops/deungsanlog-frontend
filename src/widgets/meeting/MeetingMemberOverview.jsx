import { useEffect, useState } from "react";
import { Box, Typography, Button, Avatar } from "@mui/material";
import axiosInstance from "shared/lib/axiosInstance";
import NicknameWithBadge from "widgets/user/NicknameWithBadge";

const MeetingMemberOverview = ({ meetingId }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

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
    <Box sx={{ mb: 2, p: 2, bgcolor: "transparent", borderRadius: 2 }}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={1}
      >
        <Typography fontWeight={700}>모임원 현황</Typography>
        <Button size="small" onClick={fetchMembers} disabled={loading}>
          새로고침
        </Button>
      </Box>
      {loading ? (
        <Typography color="text.secondary" fontSize="0.95rem">
          불러오는 중...
        </Typography>
      ) : (
        <Box display="flex" flexWrap="wrap" gap={1}>
          {members.length === 0 ? (
            <Typography color="text.secondary" fontSize="0.95rem">
              아직 모임원이 없습니다.
            </Typography>
          ) : (
            members.map((m) => (
              <Box
                key={m.userId}
                display="flex"
                alignItems="center"
                gap={1}
                p={0.5}
              >
                <NicknameWithBadge userId={m.userId} />
              </Box>
            ))
          )}
        </Box>
      )}
    </Box>
  );
};

export default MeetingMemberOverview;
