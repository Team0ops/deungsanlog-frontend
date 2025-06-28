import { Box, Typography, Button, Divider } from "@mui/material";
import NicknameWithBadge from "widgets/user/NicknameWithBadge";
import MeetingMemberOverview from "../MeetingMemberOverview";

const HostView = ({
  accepted = [],
  applicants = [],
  onAccept,
  onReject,
  meetingId,
}) => {
  return (
    <Box p={2}>
      <MeetingMemberOverview meetingId={meetingId} />
      <Box display="flex" flexDirection="column" gap={2}>
        {/* 참가자 목록 */}
        <Box
          flex={1}
          minHeight={0}
          maxHeight={200}
          display="flex"
          flexDirection="column"
        >
          <Typography fontWeight={700} mb={1} fontSize="1rem" color="#4b8161">
            참가자 목록
          </Typography>
          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              maxHeight: 120,
              overflowY: "auto",
              pr: { xs: 0.5, sm: 1 },
              bgcolor: "#fff",
              borderRadius: 3,
            }}
          >
            {accepted.length > 0 ? (
              accepted.map((m) => (
                <Box
                  key={m.userId}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  mb={1}
                  sx={{
                    backgroundColor: "rgba(165,216,110,0.08)",
                    border: "none",
                    borderRadius: "10px",
                    minHeight: { xs: 32, sm: 40 },
                    boxShadow: "0 2px 8px 0 rgba(165,216,110,0.02)",
                  }}
                >
                  <Box
                    maxWidth={120}
                    overflow="hidden"
                    textOverflow="ellipsis"
                    whiteSpace="nowrap"
                  >
                    <NicknameWithBadge userId={m.userId} />
                  </Box>
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary" mb={2}>
                아직 참가자가 없어요 🥲
              </Typography>
            )}
          </Box>
        </Box>
        {/* 신청자 목록 */}
        <Box
          flex={1}
          minHeight={0}
          maxHeight={200}
          display="flex"
          flexDirection="column"
        >
          <Typography fontWeight={700} mb={1} fontSize="1rem" color="#4b8161">
            신청자 목록
          </Typography>
          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              maxHeight: 120,
              overflowY: "auto",
              pr: { xs: 0.5, sm: 1 },
              bgcolor: "#fff",
              borderRadius: 3,
            }}
          >
            {applicants.length > 0 ? (
              applicants.map((m) => (
                <Box
                  key={m.userId}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  mb={1}
                  sx={{
                    backgroundColor: "rgba(165,216,110,0.08)",
                    border: "none",
                    borderRadius: "10px",
                    minHeight: { xs: 32, sm: 40 },
                    mb: 1,
                    boxShadow: "0 2px 8px 0 rgba(165,216,110,0.02)",
                  }}
                >
                  {/* 닉네임 */}
                  <Box
                    maxWidth={120}
                    overflow="hidden"
                    textOverflow="ellipsis"
                    whiteSpace="nowrap"
                    padding={0.5}
                  >
                    <NicknameWithBadge userId={m.userId} />
                  </Box>

                  {/* 버튼 덩어리 */}
                  <Box display="flex" alignItems="center" ml={2}>
                    <Button
                      size="small"
                      variant="outlined"
                      sx={{
                        minWidth: "auto",
                        px: 2,
                        borderRadius: "8px",
                        fontWeight: 600,
                        color: "#4caf50",
                        borderColor: "#4caf50",
                        whiteSpace: "nowrap",
                        "&:hover": {
                          backgroundColor: "rgba(76, 175, 80, 0.1)",
                          borderColor: "#43a047",
                        },
                      }}
                      onClick={() => onAccept(m.userId)}
                    >
                      수락
                    </Button>

                    <Button
                      size="small"
                      variant="outlined"
                      sx={{
                        ml: 1,
                        minWidth: "auto",
                        px: 2,
                        borderRadius: "8px",
                        fontWeight: 600,
                        color: "#f44336",
                        borderColor: "#f44336",
                        whiteSpace: "nowrap",
                        "&:hover": {
                          backgroundColor: "rgba(244, 67, 54, 0.1)",
                          borderColor: "#d32f2f",
                        },
                      }}
                      onClick={() => onReject(m.userId)}
                    >
                      거절
                    </Button>
                  </Box>
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                아직 신청자가 없어요 🫥
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default HostView;
