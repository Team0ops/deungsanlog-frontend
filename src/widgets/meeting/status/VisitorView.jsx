import {
  Box,
  Button,
  useTheme,
  useMediaQuery,
  Typography,
  Divider,
} from "@mui/material";
import MeetingMemberOverview from "../MeetingMemberOverview";

const VisitorView = ({ onApply, meetingId, meeting }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // 마감된 모임인지 확인
  const isClosed = meeting?.status === "CLOSED";
  // 취소된 모임인지 확인
  const isCanceled = meeting?.status === "CANCELED";

  return (
    <Box>
      <MeetingMemberOverview meetingId={meetingId} meeting={meeting} />

      {/* 취소된 모임일 때 */}
      {isCanceled && (
        <>
          <Divider sx={{ my: isMobile ? 1 : 1.5 }} />
          <Typography
            fontWeight={500}
            fontSize={isMobile ? "0.85rem" : "0.95rem"}
            color="text.secondary"
            textAlign="center"
            sx={{ fontStyle: "italic" }}
          >
            해당 모임은 취소된 모임입니다.
            <br />
            다른 모임에 참가해보세요.
          </Typography>
        </>
      )}

      {/* 마감되지 않고 취소되지 않은 모임일 때만 참가 신청 버튼 표시 */}
      {!isClosed && !isCanceled && (
        <Box>
          <Button
            variant="outlined"
            onClick={onApply}
            sx={{
              width: "100%",
              borderColor: "#70a784",
              color: "#70a784",
              fontWeight: 600,
              fontSize: isMobile ? "0.9rem" : "1rem",
              py: isMobile ? 0.8 : 1,
              outline: "none",
              "&:focus": {
                outline: "none",
              },
              "&:hover": {
                borderColor: "#5a8a6a",
                backgroundColor: "rgba(112, 167, 132, 0.1)",
              },
            }}
          >
            신청하기
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default VisitorView;
