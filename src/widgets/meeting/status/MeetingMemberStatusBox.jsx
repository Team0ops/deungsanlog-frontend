import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import axiosInstance from "shared/lib/axiosInstance";
import HostView from "./HostView";
import MemberView from "./MemberView";
import ApplicantView from "./ApplicantView";
import VisitorView from "./VisitorView";

const MeetingMemberStatusBox = ({ meetingId, meeting }) => {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    if (!meetingId) return;
    axiosInstance
      .get(`/meeting-service/${meetingId}/members`)
      .then((res) => setMembers(res.data))
      .catch(() => setMembers([]));
  }, [meetingId]);

  // 역할 분기
  const myId = meeting?.myUserId;
  const hostId = meeting?.hostUserId;
  const accepted = members.filter((m) => m.status === "ACCEPTED");
  const applicants = members.filter((m) => m.status === "PENDING");

  // 핸들러(실제 구현 필요)
  const handleAccept = (userId) => {
    // TODO: 수락 API 호출
    alert(`${userId} 수락`);
  };
  const handleReject = (userId) => {
    // TODO: 거절 API 호출
    alert(`${userId} 거절`);
  };
  const handleCancel = () => {
    // TODO: 신청 취소 API 호출
    alert("신청 취소");
  };
  const handleApply = () => {
    // TODO: 참가 신청 API 호출
    alert("참가 신청");
  };

  // 분기 렌더링
  if (myId === hostId) {
    return (
      <Box
        flex={1}
        minWidth={220}
        bgcolor="#f7faf7"
        borderRadius={3}
        p={3}
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        justifyContent="flex-start"
        boxShadow={0}
      >
        <Typography variant="h6" fontWeight={700} mb={2}>
          모임 관리 (개설자)
        </Typography>
        <HostView
          meeting={meeting}
          members={members}
          onAccept={handleAccept}
          onReject={handleReject}
        />
      </Box>
    );
  } else if (accepted.some((m) => m.userId === myId)) {
    return (
      <Box
        flex={1}
        minWidth={220}
        bgcolor="#f7faf7"
        borderRadius={3}
        p={3}
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        justifyContent="flex-start"
        boxShadow={0}
      >
        <Typography variant="h6" fontWeight={700} mb={2}>
          참가자
        </Typography>
        <MemberView meeting={meeting} members={members} />
      </Box>
    );
  } else if (applicants.some((m) => m.userId === myId)) {
    return (
      <Box
        flex={1}
        minWidth={220}
        bgcolor="#f7faf7"
        borderRadius={3}
        p={3}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        boxShadow={0}
      >
        <ApplicantView onCancel={handleCancel} />
      </Box>
    );
  } else {
    return (
      <Box
        flex={1}
        minWidth={220}
        bgcolor="#f7faf7"
        borderRadius={3}
        p={3}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        boxShadow={0}
      >
        <VisitorView onApply={handleApply} />
      </Box>
    );
  }
};

export default MeetingMemberStatusBox;
