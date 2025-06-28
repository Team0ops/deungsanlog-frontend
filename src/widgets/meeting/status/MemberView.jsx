import { Box, Typography, Divider } from "@mui/material";
import MeetingMemberOverview from "../MeetingMemberOverview";

const MemberView = ({ meeting, members, meetingId }) => {
  const accepted = members.filter(
    (m) => m.status === "ACCEPTED" && m.userId !== meeting.hostUserId
  );
  const host = members.find((m) => m.userId === meeting.hostUserId);

  return (
    <Box>
      <MeetingMemberOverview meetingId={meetingId} />
      <Typography fontWeight={600} mb={1}>
        개설자
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        {host ? host.nickname || host.userId : "정보 없음"}
      </Typography>
      <Divider sx={{ my: 1 }} />

      <Typography fontWeight={600} mb={1}>
        참가자
      </Typography>
      <Typography variant="body2" color="primary" fontWeight={700} mb={0.5}>
        (나)
      </Typography>
      {accepted.length > 0 ? (
        accepted.map((m) => (
          <Typography key={m.userId} variant="body2" color="text.secondary">
            {m.nickname || m.userId}
          </Typography>
        ))
      ) : (
        <Typography variant="body2" color="text.secondary">
          없음
        </Typography>
      )}
    </Box>
  );
};
export default MemberView;
