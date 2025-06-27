import { Box, Typography, Divider, Button } from "@mui/material";
const HostView = ({ meeting, members, onAccept, onReject }) => {
  const applicants = members.filter((m) => m.status === "PENDING");
  const accepted = members.filter(
    (m) => m.status === "ACCEPTED" && m.userId !== meeting.hostUserId
  );
  const host = members.find((m) => m.userId === meeting.hostUserId);

  return (
    <Box>
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
      <Divider sx={{ my: 1 }} />

      <Typography fontWeight={600} mb={1}>
        신청자
      </Typography>
      {applicants.length > 0 ? (
        applicants.map((m) => (
          <Box key={m.userId} display="flex" alignItems="center" mb={0.5}>
            <Typography variant="body2" color="text.secondary">
              {m.nickname || m.userId}
            </Typography>
            <Button
              size="small"
              variant="outlined"
              color="success"
              sx={{ ml: 1 }}
              onClick={() => onAccept(m.userId)}
            >
              수락
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="error"
              sx={{ ml: 1 }}
              onClick={() => onReject(m.userId)}
            >
              거절
            </Button>
          </Box>
        ))
      ) : (
        <Typography variant="body2" color="text.secondary">
          없음
        </Typography>
      )}
    </Box>
  );
};
export default HostView;
