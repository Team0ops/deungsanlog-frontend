import {
  Box,
  Typography,
  Button,
  Divider,
  useTheme,
  useMediaQuery,
  Modal,
} from "@mui/material";
import NicknameWithBadge from "widgets/user/NicknameWithBadge";
import MeetingMemberOverview from "../MeetingMemberOverview";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosInstance from "shared/lib/axiosInstance";
import dayjs from "dayjs";

const HostView = ({
  applicants = [],
  onAccept,
  onReject,
  meetingId,
  meeting,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  // 마감일 체크 및 자동 마감 처리
  useEffect(() => {
    const checkDeadline = async () => {
      if (!meeting || meeting.status !== "OPEN") return;

      const now = dayjs();
      const deadline = dayjs(
        `${meeting.deadlineDate}T${meeting.scheduledTime}`
      );

      // 마감일이 지났고 아직 OPEN 상태라면 자동 마감
      if (now.isAfter(deadline)) {
        try {
          console.log("🕐 마감일이 지나서 자동 마감 처리 중...");
          await axiosInstance.patch(`/meeting-service/${meetingId}/closed`);
          console.log("✅ 자동 마감 처리 완료");
          // 페이지 새로고침으로 상태 업데이트
          window.location.reload();
        } catch (error) {
          console.error("❌ 자동 마감 처리 실패:", error);
        }
      }
    };

    // 페이지 로드 시 체크
    checkDeadline();

    // 1분마다 마감일 체크 (선택사항)
    const interval = setInterval(checkDeadline, 60000);

    return () => clearInterval(interval);
  }, [meeting, meetingId]);

  const handleCloseMeeting = async () => {
    try {
      await axiosInstance.patch(`/meeting-service/${meetingId}/closed`);
      alert("모임 신청이 마감되었습니다.");
      navigate("/meeting");
    } catch (error) {
      console.error("모임 마감 실패:", error);
      alert("모임 마감에 실패했습니다.");
    }
    setConfirmModalOpen(false);
  };

  const handleCancelMeeting = async () => {
    try {
      await axiosInstance.patch(`/meeting-service/${meetingId}/cancelled`);
      alert("모임이 취소되었습니다.");
      navigate("/meeting");
    } catch (error) {
      console.error("모임 취소 실패:", error);
      alert("모임 취소에 실패했습니다.");
    }
    setCancelModalOpen(false);
  };

  const isClosed = meeting?.status === "CLOSED";
  const isCanceled = meeting?.status === "CANCELED";

  // 마감일까지 남은 시간 계산
  const getTimeUntilDeadline = () => {
    if (!meeting || meeting.status !== "OPEN") return null;

    const now = dayjs();
    const deadline = dayjs(`${meeting.deadlineDate}T${meeting.scheduledTime}`);
    const diff = deadline.diff(now, "minute");

    if (diff <= 0) return "마감됨";

    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;

    if (hours > 0) {
      return `${hours}시간 ${minutes}분 남음`;
    } else {
      return `${minutes}분 남음`;
    }
  };

  const timeUntilDeadline = getTimeUntilDeadline();

  return (
    <Box p={isMobile ? 1 : 2}>
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
        <Box display="flex" flexDirection="column" gap={isMobile ? 1.5 : 2}>
          {/* 신청자 목록 - CLOSED 상태가 아닐 때만 표시 */}
          {!isClosed && (
            <Box
              flex={1}
              minHeight={0}
              maxHeight={isMobile ? 150 : 200}
              display="flex"
              flexDirection="column"
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={1}
              >
                <Typography
                  fontWeight={700}
                  fontSize={isMobile ? "0.9rem" : "1rem"}
                  color="#4b8161"
                >
                  신청자 목록
                </Typography>
                {timeUntilDeadline && (
                  <Typography
                    fontSize={isMobile ? "0.8rem" : "0.9rem"}
                    color={
                      timeUntilDeadline === "마감됨" ? "#f44336" : "#ff9800"
                    }
                    fontWeight={600}
                    sx={{
                      backgroundColor:
                        timeUntilDeadline === "마감됨"
                          ? "rgba(244, 67, 54, 0.1)"
                          : "rgba(255, 152, 0, 0.1)",
                      px: 1,
                      py: 0.3,
                      borderRadius: "12px",
                      border: `1px solid ${
                        timeUntilDeadline === "마감됨" ? "#f44336" : "#ff9800"
                      }`,
                    }}
                  >
                    ⏰ {timeUntilDeadline}
                  </Typography>
                )}
              </Box>
              <Box
                sx={{
                  flex: 1,
                  minHeight: 0,
                  maxHeight: isMobile ? 100 : 120,
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
                        minHeight: { xs: 28, sm: 40 },
                        mb: 1,
                        boxShadow: "0 2px 8px 0 rgba(165,216,110,0.02)",
                      }}
                    >
                      {/* 닉네임 */}
                      <Box
                        maxWidth={isMobile ? 100 : 120}
                        overflow="hidden"
                        textOverflow="ellipsis"
                        whiteSpace="nowrap"
                        padding={0.5}
                      >
                        <NicknameWithBadge userId={m.userId} />
                      </Box>

                      {/* 버튼 덩어리 */}
                      <Box
                        display="flex"
                        alignItems="center"
                        ml={isMobile ? 1 : 2}
                      >
                        <Button
                          size="small"
                          variant="outlined"
                          sx={{
                            minWidth: "auto",
                            px: isMobile ? 1 : 1.5,
                            py: isMobile ? 0.3 : 0.5,
                            borderRadius: "6px",
                            fontWeight: 600,
                            color: "#4caf50",
                            borderColor: "#4caf50",
                            whiteSpace: "nowrap",
                            fontSize: isMobile ? "0.7rem" : "0.8rem",
                            height: isMobile ? "24px" : "28px",
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
                            ml: isMobile ? 0.5 : 1,
                            minWidth: "auto",
                            px: isMobile ? 1 : 1.5,
                            py: isMobile ? 0.3 : 0.5,
                            borderRadius: "6px",
                            fontWeight: 600,
                            color: "#f44336",
                            borderColor: "#f44336",
                            whiteSpace: "nowrap",
                            fontSize: isMobile ? "0.7rem" : "0.8rem",
                            height: isMobile ? "24px" : "28px",
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
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontSize={isMobile ? "0.85rem" : "inherit"}
                  >
                    아직 신청자가 없어요 🫥
                  </Typography>
                )}
              </Box>
            </Box>
          )}

          {/* 모임 채팅 참여하기 버튼 */}
          {meeting?.chatLink && (
            <Box display="flex" gap={1}>
              <Button
                variant="outlined"
                onClick={() => window.open(meeting.chatLink, "_blank")}
                sx={{
                  flex: 1,
                  borderColor: "#cbd4a6",
                  color: "#3C1E1E",
                  backgroundColor: "#fff8b6",
                  fontWeight: 600,
                  fontSize: isMobile ? "0.9rem" : "1rem",
                  py: isMobile ? 0.8 : 1,
                  "&:hover": {
                    borderColor: "#e5dd93",
                    backgroundColor: "#FFF59D",
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

          {/* 모임 정보 수정 버튼 */}
          <Box>
            <Button
              variant="outlined"
              onClick={() => navigate(`/meeting/edit/${meetingId}`)}
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
              모임 정보 수정하기
            </Button>
          </Box>

          {/* 모임 신청 마감 버튼 - CLOSED 상태가 아닐 때만 표시 */}
          {!isClosed && (
            <Box>
              <Button
                variant="outlined"
                onClick={() => setConfirmModalOpen(true)}
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
                모임 신청 마감하기
              </Button>
            </Box>
          )}

          {/* 모임 취소하기 버튼 */}
          <Box>
            <Button
              variant="outlined"
              onClick={() => setCancelModalOpen(true)}
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
              모임 취소하기
            </Button>
          </Box>
        </Box>
      )}

      {/* 모임 신청 마감 확인 모달 */}
      <Modal open={confirmModalOpen} onClose={() => setConfirmModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: isMobile ? 3 : 4,
            minWidth: isMobile ? "280px" : "320px",
            maxWidth: isMobile ? "90vw" : "400px",
            textAlign: "center",
          }}
        >
          <Typography
            variant="h6"
            mb={2}
            sx={{
              fontSize: isMobile ? "1.1rem" : "1.25rem",
              lineHeight: 1.4,
              color: "#4b8161",
            }}
          >
            모임 신청을 마감하시겠습니까?
          </Typography>
          <Typography
            variant="body2"
            mb={2}
            sx={{
              fontSize: isMobile ? "0.9rem" : "1rem",
              color: "text.secondary",
            }}
          >
            신청을 마감하면 더 이상 새로운 참가 신청을 받지 않습니다.
            <br />
            기존 참가자들은 그대로 유지됩니다.
          </Typography>
          <Typography
            variant="body2"
            mb={3}
            sx={{
              fontSize: isMobile ? "0.85rem" : "0.95rem",
              color: "#4b8161",
              fontWeight: 600,
            }}
          >
            ⚠️ 주의: 신청 마감 후에는 재오픈이 불가능합니다.
          </Typography>
          <Box
            display="flex"
            gap={isMobile ? 1 : 2}
            justifyContent="center"
            flexDirection={isMobile ? "column" : "row"}
          >
            <Button
              variant="outlined"
              onClick={() => setConfirmModalOpen(false)}
              sx={{
                minWidth: isMobile ? "100%" : 120,
                fontWeight: 600,
                fontSize: isMobile ? "1rem" : "1.08rem",
                borderColor: "#70a784",
                color: "#70a784",
                "&:hover": {
                  borderColor: "#5a8a6a",
                  backgroundColor: "rgba(112, 167, 132, 0.1)",
                },
              }}
            >
              취소
            </Button>
            <Button
              variant="contained"
              onClick={handleCloseMeeting}
              sx={{
                minWidth: isMobile ? "100%" : 120,
                fontWeight: 600,
                color: "#ffffff",
                fontSize: isMobile ? "1rem" : "1.08rem",
                backgroundColor: "#70a784",
                "&:hover": {
                  backgroundColor: "#5a8a6a",
                },
              }}
            >
              신청 마감
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* 모임 취소 확인 모달 */}
      <Modal open={cancelModalOpen} onClose={() => setCancelModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: isMobile ? 3 : 4,
            minWidth: isMobile ? "280px" : "320px",
            maxWidth: isMobile ? "90vw" : "400px",
            textAlign: "center",
          }}
        >
          <Typography
            variant="h6"
            mb={2}
            sx={{
              fontSize: isMobile ? "1.1rem" : "1.25rem",
              lineHeight: 1.4,
              color: "#4b8161",
            }}
          >
            모임을 취소하시겠습니까?
          </Typography>
          <Typography
            variant="body2"
            mb={2}
            sx={{
              fontSize: isMobile ? "0.9rem" : "1rem",
              color: "text.secondary",
            }}
          >
            모임을 취소하면 모임을 진행할 수 없게됩니다.
            <br />이 작업은 되돌릴 수 없습니다.
          </Typography>
          <Typography
            variant="body2"
            mb={3}
            sx={{
              fontSize: isMobile ? "0.85rem" : "0.95rem",
              color: "#4b8161",
              fontWeight: 600,
            }}
          >
            ⚠️ 주의: 모임 취소 후에는 복구가 불가능합니다.
          </Typography>
          <Box
            display="flex"
            gap={isMobile ? 1 : 2}
            justifyContent="center"
            flexDirection={isMobile ? "column" : "row"}
          >
            <Button
              variant="outlined"
              onClick={() => setCancelModalOpen(false)}
              sx={{
                minWidth: isMobile ? "100%" : 120,
                fontWeight: 600,
                fontSize: isMobile ? "1rem" : "1.08rem",
                borderColor: "#70a784",
                color: "#70a784",
                "&:hover": {
                  borderColor: "#5a8a6a",
                  backgroundColor: "rgba(112, 167, 132, 0.1)",
                },
              }}
            >
              취소
            </Button>
            <Button
              variant="contained"
              onClick={handleCancelMeeting}
              sx={{
                minWidth: isMobile ? "100%" : 120,
                fontWeight: 600,
                color: "#ffffff",
                fontSize: isMobile ? "1rem" : "1.08rem",
                backgroundColor: "#70a784",
                "&:hover": {
                  backgroundColor: "#5a8a6a",
                },
              }}
            >
              모임 취소
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default HostView;
