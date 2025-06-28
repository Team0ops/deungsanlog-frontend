import { Typography, Button, useTheme, useMediaQuery } from "@mui/material";
import MeetingMemberOverview from "../MeetingMemberOverview";

const ApplicantView = ({ onCancel, meetingId, meeting }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <>
      <MeetingMemberOverview meetingId={meetingId} meeting={meeting} />
      <Typography
        fontWeight={500}
        fontSize={isMobile ? "0.85rem" : "0.95rem"}
        color="text.secondary"
        mb={1}
      >
        ✨ 신청 대기 중입니다 ✨
      </Typography>
      <Button
        size={isMobile ? "small" : "small"}
        variant="outlined"
        onClick={onCancel}
        sx={{
          backgroundColor: "white",
          borderColor: "grey.300",
          color: "error.main",
          outline: "none",
          fontSize: isMobile ? "0.8rem" : "inherit",
          px: isMobile ? 1.5 : 2,
          py: isMobile ? 0.5 : 1,
          "&:hover": {
            borderColor: "#4caf50",
            backgroundColor: "#f6fff6",
          },
          "&:focus": {
            outline: "none",
            boxShadow: "none",
          },
          transition: "all 0.2s ease",
          borderRadius: 2,
        }}
      >
        신청 취소
      </Button>
    </>
  );
};

export default ApplicantView;
