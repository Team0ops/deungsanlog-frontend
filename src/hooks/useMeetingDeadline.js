import { useEffect, useState } from "react";
import dayjs from "dayjs";
import axiosInstance from "shared/lib/axiosInstance";
import { getUserInfo } from "shared/lib/auth";

const useMeetingDeadline = (meeting) => {
  const [isDeadlinePassed, setIsDeadlinePassed] = useState(false);
  const [timeUntilDeadline, setTimeUntilDeadline] = useState(null);
  const userInfo = getUserInfo();

  useEffect(() => {
    if (!meeting) return;

    const checkDeadline = async () => {
      const now = dayjs();
      const deadline = dayjs(
        `${meeting.deadlineDate}T${meeting.scheduledTime}`
      );

      // 마감일이 지났는지 체크
      const passed = now.isAfter(deadline);
      setIsDeadlinePassed(passed);

      // 남은 시간 계산
      if (!passed) {
        const diff = deadline.diff(now, "minute");
        const hours = Math.floor(diff / 60);
        const minutes = diff % 60;

        if (hours > 0) {
          setTimeUntilDeadline(`${hours}시간 ${minutes}분 남음`);
        } else {
          setTimeUntilDeadline(`${minutes}분 남음`);
        }
      } else {
        setTimeUntilDeadline("마감됨");
      }

      // 마감일이 지났고 아직 OPEN 상태이고 호스트인 경우 자동 마감
      if (
        passed &&
        meeting.status === "OPEN" &&
        userInfo?.userId === meeting.hostUserId
      ) {
        try {
          console.log("🕐 마감일이 지나서 자동 마감 처리 중...");
          await axiosInstance.patch(`/meeting-service/${meeting.id}/closed`);
          console.log("✅ 자동 마감 처리 완료");
          // 상태 업데이트를 위해 페이지 새로고침
          window.location.reload();
        } catch (error) {
          console.error("❌ 자동 마감 처리 실패:", error);
        }
      }
    };

    // 초기 체크
    checkDeadline();

    // 1분마다 체크 (실시간 업데이트)
    const interval = setInterval(checkDeadline, 60000);

    return () => clearInterval(interval);
  }, [meeting, userInfo?.userId]);

  return {
    isDeadlinePassed,
    timeUntilDeadline,
    isHost: userInfo?.userId === meeting?.hostUserId,
  };
};

export default useMeetingDeadline;
