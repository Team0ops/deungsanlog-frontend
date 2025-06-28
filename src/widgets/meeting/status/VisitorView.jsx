import { Box, Button, useTheme, useMediaQuery } from "@mui/material";
import MeetingMemberOverview from "../MeetingMemberOverview";

const VisitorView = ({ onApply, meetingId, meeting }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box>
      <MeetingMemberOverview meetingId={meetingId} meeting={meeting} />
      <Button
        size={isMobile ? "medium" : "large"}
        variant="contained"
        color="primary"
        onClick={onApply}
        sx={{
          outline: "none",
          boxShadow: "none",
          fontSize: isMobile ? "0.9rem" : "inherit",
          px: isMobile ? 2 : 3,
          py: isMobile ? 1 : 1.5,
          "&:focus": { outline: "none" },
        }}
      >
        참가 신청하기
      </Button>
    </Box>
  );
};

export default VisitorView;
