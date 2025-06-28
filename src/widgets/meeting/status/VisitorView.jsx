import { Box, Button, useTheme, useMediaQuery } from "@mui/material";
import MeetingMemberOverview from "../MeetingMemberOverview";

const VisitorView = ({ onApply, meetingId, meeting }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // 마감된 모임인지 확인
  const isClosed = meeting?.status === "CLOSED";

  return (
    <Box>
      <MeetingMemberOverview meetingId={meetingId} meeting={meeting} />

      {/* 마감되지 않은 모임일 때만 참가 신청 버튼 표시 */}
      {!isClosed && (
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
      )}
    </Box>
  );
};

export default VisitorView;
