import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import axiosInstance from "shared/lib/axiosInstance";
import HostView from "./HostView";
import MemberView from "./MemberView";
import ApplicantView from "./ApplicantView";
import VisitorView from "./VisitorView";
import { getUserInfo } from "shared/lib/auth";
import MeetingMemberOverview from "../MeetingMemberOverview";
import ConfirmModal from "widgets/Modal/ConfirmModal";

const MeetingMemberStatusBox = ({ meetingId, meeting }) => {
  const [accepted, setAccepted] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [members, setMembers] = useState([]);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showLastSpotModal, setShowLastSpotModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [pendingAcceptUserId, setPendingAcceptUserId] = useState(null);
  const userInfo = getUserInfo();
  const myId = userInfo?.userId || null;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  useEffect(() => {
    if (!meetingId) return;

    // 전체 멤버(호스트, 상태 등) 조회
    axiosInstance
      .get(`/meeting-service/${meetingId}/members`)
      .then((res) => setMembers(res.data))
      .catch(() => setMembers([]));

    // 참가자(ACCEPTED)만 조회
    axiosInstance
      .get(`/meeting-service/${meetingId}/accepted-members`)
      .then((res) => setAccepted(res.data))
      .catch(() => setAccepted([]));

    // 신청자(PENDING)만 조회
    axiosInstance
      .get(`/meeting-service/${meetingId}/pending-applicants`)
      .then((res) => setApplicants(res.data))
      .catch(() => setApplicants([]));
  }, [meetingId]);

  const hostId = meeting?.hostUserId;

  // ✅ 상태 로그
  console.log("myId:", myId);
  console.log("hostId:", hostId);
  console.log("members:", members);
  console.log("accepted:", accepted);
  console.log("applicants:", applicants);

  // 핸들러
  const handleAccept = async (userId) => {
    // 현재 수락된 인원 수 확인
    const currentAcceptedCount = accepted.length;
    const maxParticipants = meeting?.maxParticipants || 0;

    // 마지막 자리인지 확인
    if (currentAcceptedCount + 1 >= maxParticipants) {
      setPendingAcceptUserId(userId);
      setShowLastSpotModal(true);
      return;
    }

    // 일반적인 수락 처리
    try {
      await axiosInstance.patch(
        `/meeting-service/${meetingId}/members/${userId}/accept`
      );
      setSuccessMessage("수락 완료 🎉");
      setShowSuccessModal(true);
    } catch (e) {
      console.error("수락 실패:", e);
      setSuccessMessage("수락 실패 😢");
      setShowSuccessModal(true);
    }
  };

  const handleReject = async (userId) => {
    try {
      await axiosInstance.patch(
        `/meeting-service/${meetingId}/members/${userId}/reject`
      );
      setSuccessMessage("거절 완료 🎉");
      setShowSuccessModal(true);
    } catch (e) {
      console.error("거절 실패:", e);
      setSuccessMessage("거절 실패 😢");
      setShowSuccessModal(true);
    }
  };

  const handleLastSpotAccept = async () => {
    try {
      await axiosInstance.patch(
        `/meeting-service/${meetingId}/members/${pendingAcceptUserId}/accept`
      );
      setSuccessMessage("수락 완료! 모임이 자동 마감되었습니다 🎉");
      setShowSuccessModal(true);
    } catch (e) {
      console.error("수락 실패:", e);
      setSuccessMessage("수락 실패 😢");
      setShowSuccessModal(true);
    }
    setShowLastSpotModal(false);
    setPendingAcceptUserId(null);
  };

  const handleCancel = () => {
    setShowCancelModal(true);
  };

  const handleApply = () => {
    setShowApplyModal(true);
  };

  const confirmCancel = async () => {
    try {
      await axiosInstance.delete(`/meeting-service/${meetingId}/cancel`, {
        params: { userId: myId },
      });
      setSuccessMessage("신청 취소가 완료되었습니다~! 😊");
      setShowSuccessModal(true);
    } catch (e) {
      console.error("신청 취소 실패:", e);
      setSuccessMessage("신청 취소에 실패했습니다 😢");
      setShowSuccessModal(true);
    }
    setShowCancelModal(false);
  };

  const confirmApply = async () => {
    try {
      await axiosInstance.post(`/meeting-service/${meetingId}/apply`, null, {
        params: { userId: myId },
      });
      setSuccessMessage("참가 신청이 완료되었습니다~! 🎉");
      setShowSuccessModal(true);
    } catch (e) {
      console.error("신청 실패:", e);
      setSuccessMessage("참가 신청에 실패했습니다 😢");
      setShowSuccessModal(true);
    }
    setShowApplyModal(false);
  };

  // 분기 렌더링
  const isCanceled = meeting?.status === "CANCELLED";

  // 취소된 모임일 때는 모든 뷰에서 안내 메시지만 표시
  if (isCanceled) {
    return (
      <>
        <Box
          sx={{
            ...boxStyleCenter,
            p: isMobile ? 2 : 3,
            minWidth: isMobile ? 200 : 220,
          }}
        >
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
        </Box>

        {/* 신청 취소 확인 모달 */}
        <ConfirmModal
          isOpen={showCancelModal}
          message="정말로 신청을 취소하시겠습니까?"
          onCancel={() => setShowCancelModal(false)}
          onConfirm={confirmCancel}
          cancelText="취소"
          confirmText="신청 취소"
        />

        {/* 참가 신청 확인 모달 */}
        <ConfirmModal
          isOpen={showApplyModal}
          message="이 모임에 참가 신청하시겠습니까?"
          onCancel={() => setShowApplyModal(false)}
          onConfirm={confirmApply}
          cancelText="취소"
          confirmText="신청하기"
        />

        {/* 성공 메시지 모달 */}
        <ConfirmModal
          isOpen={showSuccessModal}
          message={successMessage}
          singleButton={true}
          singleButtonText="확인"
          onSingleButtonClick={() => {
            setShowSuccessModal(false);
            window.location.reload();
          }}
        />

        {/* 마지막 자리 확인 모달 */}
        <ConfirmModal
          isOpen={showLastSpotModal}
          message={[
            "모임의 마지막 자리입니다.",
            "해당 모임원을 마지막으로",
            "모임은 자동 마감 처리 됩니다.",
          ]}
          onCancel={() => {
            setShowLastSpotModal(false);
            setPendingAcceptUserId(null);
          }}
          onConfirm={handleLastSpotAccept}
          cancelText="취소"
          confirmText="수락"
        />
      </>
    );
  }

  if (String(myId) === String(hostId)) {
    return (
      <>
        <Box
          sx={{
            ...boxStyle,
            p: isMobile ? 2 : 3,
            minWidth: isMobile ? 200 : 220,
          }}
        >
          <HostView
            meeting={meeting}
            members={members}
            accepted={accepted}
            applicants={applicants}
            onAccept={handleAccept}
            onReject={handleReject}
            meetingId={meetingId}
          />
        </Box>

        {/* 신청 취소 확인 모달 */}
        <ConfirmModal
          isOpen={showCancelModal}
          message="정말로 신청을 취소하시겠습니까?"
          onCancel={() => setShowCancelModal(false)}
          onConfirm={confirmCancel}
          cancelText="취소"
          confirmText="신청 취소"
        />

        {/* 참가 신청 확인 모달 */}
        <ConfirmModal
          isOpen={showApplyModal}
          message="이 모임에 참가 신청하시겠습니까?"
          onCancel={() => setShowApplyModal(false)}
          onConfirm={confirmApply}
          cancelText="취소"
          confirmText="신청하기"
        />

        {/* 성공 메시지 모달 */}
        <ConfirmModal
          isOpen={showSuccessModal}
          message={successMessage}
          singleButton={true}
          singleButtonText="확인"
          onSingleButtonClick={() => {
            setShowSuccessModal(false);
            window.location.reload();
          }}
        />

        {/* 마지막 자리 확인 모달 */}
        <ConfirmModal
          isOpen={showLastSpotModal}
          message={[
            "모임의 마지막 자리입니다.",
            "해당 모임원을 마지막으로",
            "모임은 자동 마감 처리 됩니다.",
          ]}
          onCancel={() => {
            setShowLastSpotModal(false);
            setPendingAcceptUserId(null);
          }}
          onConfirm={handleLastSpotAccept}
          cancelText="취소"
          confirmText="수락"
        />
      </>
    );
  } else if (accepted.some((m) => String(m.userId) === String(myId))) {
    return (
      <>
        <Box
          sx={{
            ...boxStyle,
            p: isMobile ? 2 : 3,
            minWidth: isMobile ? 200 : 220,
          }}
        >
          <Typography variant="h6" fontWeight={700} mb={2}>
            참가자
          </Typography>
          <MemberView
            meeting={meeting}
            members={members}
            accepted={accepted}
            meetingId={meetingId}
          />
        </Box>

        {/* 신청 취소 확인 모달 */}
        <ConfirmModal
          isOpen={showCancelModal}
          message="정말로 신청을 취소하시겠습니까?"
          onCancel={() => setShowCancelModal(false)}
          onConfirm={confirmCancel}
          cancelText="취소"
          confirmText="신청 취소"
        />

        {/* 참가 신청 확인 모달 */}
        <ConfirmModal
          isOpen={showApplyModal}
          message="이 모임에 참가 신청하시겠습니까?"
          onCancel={() => setShowApplyModal(false)}
          onConfirm={confirmApply}
          cancelText="취소"
          confirmText="신청하기"
        />

        {/* 성공 메시지 모달 */}
        <ConfirmModal
          isOpen={showSuccessModal}
          message={successMessage}
          singleButton={true}
          singleButtonText="확인"
          onSingleButtonClick={() => {
            setShowSuccessModal(false);
            window.location.reload();
          }}
        />

        {/* 마지막 자리 확인 모달 */}
        <ConfirmModal
          isOpen={showLastSpotModal}
          message={[
            "모임의 마지막 자리입니다.",
            "해당 모임원을 마지막으로",
            "모임은 자동 마감 처리 됩니다.",
          ]}
          onCancel={() => {
            setShowLastSpotModal(false);
            setPendingAcceptUserId(null);
          }}
          onConfirm={handleLastSpotAccept}
          cancelText="취소"
          confirmText="수락"
        />
      </>
    );
  } else if (applicants.some((m) => String(m.userId) === String(myId))) {
    return (
      <>
        <Box
          sx={{
            ...boxStyleCenter,
            p: isMobile ? 2 : 3,
            minWidth: isMobile ? 200 : 220,
          }}
        >
          <ApplicantView
            onCancel={handleCancel}
            meetingId={meetingId}
            meeting={meeting}
          />
        </Box>

        {/* 신청 취소 확인 모달 */}
        <ConfirmModal
          isOpen={showCancelModal}
          message="정말로 신청을 취소하시겠습니까?"
          onCancel={() => setShowCancelModal(false)}
          onConfirm={confirmCancel}
          cancelText="취소"
          confirmText="신청 취소"
        />

        {/* 참가 신청 확인 모달 */}
        <ConfirmModal
          isOpen={showApplyModal}
          message="이 모임에 참가 신청하시겠습니까?"
          onCancel={() => setShowApplyModal(false)}
          onConfirm={confirmApply}
          cancelText="취소"
          confirmText="신청하기"
        />

        {/* 성공 메시지 모달 */}
        <ConfirmModal
          isOpen={showSuccessModal}
          message={successMessage}
          singleButton={true}
          singleButtonText="확인"
          onSingleButtonClick={() => {
            setShowSuccessModal(false);
            window.location.reload();
          }}
        />

        {/* 마지막 자리 확인 모달 */}
        <ConfirmModal
          isOpen={showLastSpotModal}
          message={[
            "모임의 마지막 자리입니다.",
            "해당 모임원을 마지막으로",
            "모임은 자동 마감 처리 됩니다.",
          ]}
          onCancel={() => {
            setShowLastSpotModal(false);
            setPendingAcceptUserId(null);
          }}
          onConfirm={handleLastSpotAccept}
          cancelText="취소"
          confirmText="수락"
        />
      </>
    );
  } else {
    return (
      <>
        <Box
          sx={{
            ...boxStyleCenter,
            p: isMobile ? 2 : 3,
            minWidth: isMobile ? 200 : 220,
          }}
        >
          <VisitorView
            onApply={handleApply}
            meetingId={meetingId}
            meeting={meeting}
          />
        </Box>

        {/* 신청 취소 확인 모달 */}
        <ConfirmModal
          isOpen={showCancelModal}
          message="정말로 신청을 취소하시겠습니까?"
          onCancel={() => setShowCancelModal(false)}
          onConfirm={confirmCancel}
          cancelText="취소"
          confirmText="신청 취소"
        />

        {/* 참가 신청 확인 모달 */}
        <ConfirmModal
          isOpen={showApplyModal}
          message="이 모임에 참가 신청하시겠습니까?"
          onCancel={() => setShowApplyModal(false)}
          onConfirm={confirmApply}
          cancelText="취소"
          confirmText="신청하기"
        />

        {/* 성공 메시지 모달 */}
        <ConfirmModal
          isOpen={showSuccessModal}
          message={successMessage}
          singleButton={true}
          singleButtonText="확인"
          onSingleButtonClick={() => {
            setShowSuccessModal(false);
            window.location.reload();
          }}
        />

        {/* 마지막 자리 확인 모달 */}
        <ConfirmModal
          isOpen={showLastSpotModal}
          message={[
            "모임의 마지막 자리입니다.",
            "해당 모임원을 마지막으로",
            "모임은 자동 마감 처리 됩니다.",
          ]}
          onCancel={() => {
            setShowLastSpotModal(false);
            setPendingAcceptUserId(null);
          }}
          onConfirm={handleLastSpotAccept}
          cancelText="취소"
          confirmText="수락"
        />
      </>
    );
  }
};

const boxStyle = {
  flex: 1,
  minWidth: 220,
  bgcolor: "#fff",
  border: "1px solid #C8F2B5",
  borderRadius: 3,
  p: 3,
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "flex-start",
  boxShadow: 0,
};

const boxStyleCenter = {
  ...boxStyle,
  alignItems: "center",
  justifyContent: "center",
};

export default MeetingMemberStatusBox;
