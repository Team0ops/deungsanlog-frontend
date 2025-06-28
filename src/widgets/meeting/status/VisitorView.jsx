import { Box, Button } from "@mui/material";
import MeetingMemberOverview from "../MeetingMemberOverview";

const VisitorView = ({ onApply, meetingId }) => {
  return (
    <Box>
      <MeetingMemberOverview meetingId={meetingId} />
      <Button
        size="large"
        variant="contained"
        color="primary"
        onClick={onApply}
        sx={{
          outline: "none",
          boxShadow: "none",
          "&:focus": { outline: "none" },
        }}
      >
        참가 신청하기
      </Button>
    </Box>
  );
};

export default VisitorView;
