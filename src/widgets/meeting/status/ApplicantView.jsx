import {
  Typography,
  Button,
  useTheme,
  useMediaQuery,
  Divider,
  Box,
} from "@mui/material";
import MeetingMemberOverview from "../MeetingMemberOverview";

const ApplicantView = ({ onCancel, meetingId, meeting }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // 마감된 모임인지 확인
  const isClosed = meeting?.status === "CLOSED";
  // 취소된 모임인지 확인
  const isCanceled = meeting?.status === "CANCELED";

  return (
    <>
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

      {/* 마감된 모임일 때 */}
      {isClosed && !isCanceled && (
        <>
          <Divider sx={{ my: isMobile ? 1 : 1.5 }} />
          <Typography
            fontWeight={500}
            fontSize={isMobile ? "0.85rem" : "0.95rem"}
            color="text.secondary"
            textAlign="center"
            sx={{ fontStyle: "italic" }}
          >
            해당 모임은 마감되었습니다. 😔
            <br />
            다음 기회를 노려보세요!
          </Typography>
        </>
      )}

      {/* 마감되지 않고 취소되지 않은 모임일 때 */}
      {!isClosed && !isCanceled && (
        <>
          <Typography
            fontWeight={500}
            fontSize={isMobile ? "0.85rem" : "0.95rem"}
            color="text.secondary"
            mb={1}
          >
            ✨ 신청 대기 중입니다 ✨
          </Typography>
          <Box>
            <Button
              variant="outlined"
              onClick={onCancel}
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
              신청 취소
            </Button>
          </Box>
        </>
      )}
    </>
  );
};

export default ApplicantView;
