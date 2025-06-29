import {
  Box,
  Typography,
  Divider,
  useTheme,
  useMediaQuery,
  Button,
} from "@mui/material";
import MeetingMemberOverview from "../MeetingMemberOverview";

const MemberView = ({ meeting, meetingId }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // 취소된 모임인지 확인
  const isCanceled = meeting?.status === "CANCELED";

  return (
    <Box>
      <MeetingMemberOverview meetingId={meetingId} meeting={meeting} />

      {/* 취소된 모임일 때 안내 메시지 */}
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

      {/* 취소되지 않은 모임일 때만 기존 기능 표시 */}
      {!isCanceled && (
        <>
          {/* 모임 채팅 참여하기 버튼 */}
          {meeting?.chatLink && (
            <Box display="flex" gap={1} mb={isMobile ? 1.5 : 2}>
              <Button
                variant="outlined"
                onClick={() => window.open(meeting.chatLink, "_blank")}
                sx={{
                  flex: 1,
                  borderColor: "#FEE500",
                  color: "#3C1E1E",
                  backgroundColor: "#FEE500",
                  fontWeight: 600,
                  fontSize: isMobile ? "0.9rem" : "1rem",
                  py: isMobile ? 0.8 : 1,
                  "&:hover": {
                    borderColor: "#E6CF00",
                    backgroundColor: "#E6CF00",
                  },
                }}
              >
                모임 채팅 참여하기
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  navigator.clipboard.writeText(meeting.chatLink);
                  alert("URL이 클립보드에 복사되었습니다!");
                }}
                sx={{
                  minWidth: "auto",
                  px: isMobile ? 1.5 : 2,
                  borderColor: "#70a784",
                  color: "#70a784",
                  fontWeight: 600,
                  fontSize: isMobile ? "0.8rem" : "0.9rem",
                  py: isMobile ? 0.8 : 1,
                  "&:hover": {
                    borderColor: "#5a8a6a",
                    backgroundColor: "rgba(112, 167, 132, 0.1)",
                  },
                }}
              >
                📋
              </Button>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};
export default MemberView;
