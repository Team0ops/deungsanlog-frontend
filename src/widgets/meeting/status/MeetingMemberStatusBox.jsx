import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import axiosInstance from "shared/lib/axiosInstance";
import HostView from "./HostView";
import MemberView from "./MemberView";
import ApplicantView from "./ApplicantView";
import VisitorView from "./VisitorView";

const MeetingMemberStatusBox = ({ meetingId, meeting }) => {
  const [accepted, setAccepted] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [members, setMembers] = useState([]);
  const myId = 11; // ✅ 임시 하드코딩
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
    try {
      await axiosInstance.patch(
        `/meeting-service/${meetingId}/members/${userId}/accept`
      );
      alert("수락 완료");
      window.location.reload();
    } catch (e) {
      console.error("수락 실패:", e);
      alert("수락 실패");
    }
  };

  const handleReject = async (userId) => {
    try {
      await axiosInstance.patch(
        `/meeting-service/${meetingId}/members/${userId}/reject`
      );
      alert("거절 완료");
      window.location.reload();
    } catch (e) {
      console.error("거절 실패:", e);
      alert("거절 실패");
    }
  };

  const handleCancel = async () => {
    try {
      await axiosInstance.delete(`/meeting-service/${meetingId}/cancel`, {
        params: { userId: myId },
      });
      alert("신청 취소 완료");
      window.location.reload();
    } catch (e) {
      console.error("신청 취소 실패:", e);
      alert("신청 취소 실패");
    }
  };

  const handleApply = async () => {
    try {
      await axiosInstance.post(`/meeting-service/${meetingId}/apply`, null, {
        params: { userId: myId },
      });
      alert("참가 신청 완료");
      window.location.reload();
    } catch (e) {
      console.error("신청 실패:", e);
      alert("신청 실패");
    }
  };

  // 분기 렌더링
  if (String(myId) === String(hostId)) {
    return (
      <Box sx={boxStyle}>
        <HostView
          meeting={meeting}
          members={members}
          accepted={accepted}
          applicants={applicants}
          onAccept={handleAccept}
          onReject={handleReject}
        />
      </Box>
    );
  } else if (accepted.some((m) => String(m.userId) === String(myId))) {
    return (
      <Box sx={boxStyle}>
        <Typography variant="h6" fontWeight={700} mb={2}>
          참가자
        </Typography>
        <MemberView meeting={meeting} members={members} accepted={accepted} />
      </Box>
    );
  } else if (applicants.some((m) => String(m.userId) === String(myId))) {
    return (
      <Box sx={boxStyleCenter}>
        <ApplicantView onCancel={handleCancel} />
      </Box>
    );
  } else {
    return (
      <Box sx={boxStyleCenter}>
        <VisitorView onApply={handleApply} />
      </Box>
    );
  }
};

const boxStyle = {
  flex: 1,
  minWidth: 220,
  bgcolor: "#f7faf7",
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
