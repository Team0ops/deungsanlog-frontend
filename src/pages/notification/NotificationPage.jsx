import React, { useState, useEffect } from "react";
import { getToken, isAuthenticated } from "shared/lib/auth";
import axiosInstance from "shared/lib/axiosInstance";
import NotificationList from "./components/NotificationList";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import GreenButton from "shared/ui/greenButton";

/** ✅ 공통 prefix 한 곳에 모아두면 오타를 줄일 수 있습니다 */
const BASE = "/notification-service";

// 로그인하지 않은 사용자를 위한 안내 컴포넌트
const NotLoggedIn = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="60vh"
      width="100%"
      maxWidth="600px"
      mx="auto"
      bgcolor="#f8f9fa"
      borderRadius={5}
      p={isMobile ? 3 : 4}
      boxShadow="0 2px 8px rgba(0,0,0,0.1)"
      border="1px solid #e9ecef"
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        maxWidth="400px"
        width="100%"
      >
        <Box
          sx={{
            color: "#495057",
            fontWeight: 500,
            fontSize: isMobile ? "1.1rem" : "1.3rem",
            mb: 3,
            lineHeight: 1.6,
            whiteSpace: isMobile ? "pre-line" : "normal",
          }}
        >
          {isMobile ? (
            <>
              로그인을 하면 중요한 알림을{"\n"}받을 수 있어요!
              <br />
              모임 알림, 댓글 알림 등{"\n"}소식을 놓치지 마세요 🔔
            </>
          ) : (
            <>
              로그인을 하면 중요한 알림을 받을 수 있어요!
              <br />
              모임 알림, 댓글 알림 등 소식을 놓치지 마세요 🔔
            </>
          )}
        </Box>
        <GreenButton
          onClick={() => (window.location.href = "/login")}
          style={{
            color: "#8cac7f",
            fontSize: isMobile ? "1rem" : "1.2rem",
            background: "#f5f5f5",
            padding: isMobile ? "0.8rem 2rem" : "1rem 2.5rem",
            whiteSpace: "nowrap",
            border: "1px solid #dee2e6",
            borderRadius: "8px",
            fontWeight: "600",
          }}
        >
          로그인 하러가기
        </GreenButton>
      </Box>
    </Box>
  );
};

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [markingAllAsRead, setMarkingAllAsRead] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  /* ------------------------- 목록 조회 ------------------------- */
  const fetchNotifications = async (page = 0) => {
    if (!isAuthenticated()) {
      setError("로그인이 필요합니다.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const token = getToken();

      const { data } = await axiosInstance.get(`${BASE}/list`, {
        params: { page, size: isMobile ? 15 : 20 }, // 모바일에서는 더 적은 개수
        headers: { "X-AUTH-TOKEN": token },
      });

      const {
        content,
        totalPages: total,
        currentPage: cur,
        unreadCount: unread,
      } = data;

      setNotifications(content ?? []);
      setTotalPages(total ?? 0);
      setCurrentPage(cur ?? 0);
      setUnreadCount(unread ?? 0);
      setError(null);
    } catch (err) {
      console.error("❌ 알림 목록 조회 실패:", err);
      if (err.response?.status === 401) {
        setError("로그인이 만료되었습니다. 다시 로그인해주세요.");
      } else {
        setError("알림을 불러오는 중 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  /* ------------------------- 읽음 처리 ------------------------- */
  const markAsRead = async (id) => {
    try {
      const token = getToken();
      await axiosInstance.put(
        `${BASE}/${id}/read`,
        {},
        { headers: { "X-AUTH-TOKEN": token } }
      );

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("❌ 읽음 처리 실패:", err);
    }
  };

  /* ------------------------- 모든 알림 읽음 처리 ------------------------- */
  const markAllAsRead = async () => {
    if (unreadCount === 0) return;

    setMarkingAllAsRead(true);

    try {
      const token = getToken();
      await axiosInstance.put(
        `${BASE}/read-all`,
        {},
        { headers: { "X-AUTH-TOKEN": token } }
      );

      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      console.log("✅ 모든 알림 읽음 처리 완료");
    } catch (err) {
      console.error("❌ 모든 알림 읽음 처리 실패:", err);
      alert("모든 알림 읽음 처리에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setMarkingAllAsRead(false);
    }
  };

  /* ------------------------- 삭제 ------------------------- */
  const deleteNotification = async (id) => {
    try {
      const token = getToken();
      await axiosInstance.delete(`${BASE}/${id}`, {
        headers: { "X-AUTH-TOKEN": token },
      });
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error("❌ 알림 삭제 실패:", err);
    }
  };

  /* ------------------------- 클릭 핸들러 ------------------------- */
  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.isRead) await markAsRead(notification.id); // 1) 읽음
      await deleteNotification(notification.id); // 2) 삭제

      // 3) 라우팅
      if (["comment", "like"].includes(notification.type)) {
        const postId =
          notification.postId || extractPostIdFromContent(notification.content);
        window.location.href = postId
          ? `/community/post/${postId}`
          : "/community";
      } else if (["fire_risk", "weather_alert"].includes(notification.type)) {
        const mountain =
          notification.mountainName ||
          extractMountainNameFromContent(notification.content);
        window.location.href = mountain
          ? `/mountain/detail/${encodeURIComponent(mountain)}`
          : "/mountain";
      } else if (
        [
          "meeting_apply",
          "meeting_accepted",
          "meeting_full",
          "meeting_closed",
        ].includes(notification.type)
      ) {
        // 모임 관련 알림 처리
        const meetingId = extractMeetingIdFromContent(
          notification.content,
          notification
        );
        window.location.href = meetingId
          ? `/meeting/detail/${meetingId}`
          : "/meeting";
      } else if (notification.type === "system") {
        window.location.href = "/";
      }
    } catch (err) {
      console.error("❌ 알림 처리 중 오류:", err);
    }
  };

  /* ------------------------- 유틸  ------------------------- */
  const extractPostIdFromContent = (c) =>
    (c.match(/게시글.*?#(\d+)|postId.*?(\d+)|post.*?(\d+)/i) ?? [])[1] || null;

  const extractMountainNameFromContent = (c) =>
    (c.match(/\[(.*?)\]|산\s*:\s*(.*?)\s|(\w+산)/) ?? [])[1] || null;

  const extractMeetingIdFromContent = (c, notification) => {
    // 알림에 meetingId 필드가 있으면 그것을 사용
    if (notification.meetingId) {
      return notification.meetingId;
    }

    // 모임 제목에서 ID를 추출하는 정규식 (필요시 수정)
    const match = c.match(/\[(.*?)\]/);
    if (match) {
      // 모임 제목이 있다면 해당 제목으로 모임을 찾을 수 있도록 처리
      // 현재는 기본적으로 모임 목록 페이지로 이동
      return null;
    }
    return null;
  };

  const handlePageChange = (p) => {
    if (p >= 0 && p < totalPages) {
      setCurrentPage(p);
      fetchNotifications(p);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  /* ------------------------- 렌더 ------------------------- */
  if (!isAuthenticated()) return <NotLoggedIn />;
  if (loading) return <Loader isMobile={isMobile} />;
  if (error) return <ErrorView message={error} isMobile={isMobile} />;

  return (
    <div style={getContainerStyle(isMobile)}>
      {/* 헤더 */}
      <div style={getHeaderStyle(isMobile)}>
        <h1 style={getTitleStyle(isMobile)}>📱 알림</h1>
        <div style={getHeaderRightStyle(isMobile)}>
          {unreadCount > 0 && (
            <div style={getBadgeStyle(isMobile)}>
              {isMobile
                ? `${unreadCount}개`
                : `${unreadCount}개의 읽지 않은 알림`}
            </div>
          )}
          <button
            onClick={markAllAsRead}
            disabled={unreadCount === 0 || markingAllAsRead}
            style={{
              ...getMarkAllReadButtonStyle(isMobile),
              opacity: unreadCount > 0 && !markingAllAsRead ? 1 : 0.5,
            }}
          >
            {markingAllAsRead
              ? "처리 중..."
              : isMobile
              ? "모두 읽기"
              : "한 번에 읽기"}
          </button>
        </div>
      </div>

      {/* 목록 */}
      <NotificationList
        notifications={notifications}
        onNotificationClick={handleNotificationClick}
        onMarkAsRead={markAsRead}
        onDeleteNotification={deleteNotification}
        isMobile={isMobile}
      />

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <Pagination
          current={currentPage}
          total={totalPages}
          onPageChange={handlePageChange}
          isMobile={isMobile}
        />
      )}

      {/* 빈 상태 */}
      {notifications.length === 0 && <EmptyState isMobile={isMobile} />}
    </div>
  );
};

/* ===== 공통 컴포넌트들 (깔끔하게 분리) ===== */
const Loader = ({ isMobile }) => (
  <div style={getCenterStyle(isMobile)}>
    <div style={getSpinnerStyle(isMobile)} />
    <p style={{ fontSize: isMobile ? "0.9rem" : "1rem" }}>
      알림을 불러오는 중...
    </p>
  </div>
);

const ErrorView = ({ message, isMobile }) => (
  <div style={{ ...getCenterStyle(isMobile), color: "#e74c3c" }}>
    <div
      style={{ fontSize: isMobile ? "1.5rem" : "2rem", marginBottom: "1rem" }}
    >
      ⚠️
    </div>
    <p style={{ fontSize: isMobile ? "0.9rem" : "1rem", textAlign: "center" }}>
      {message}
    </p>
    <button
      style={getBtnStyle(isMobile)}
      onClick={() => window.location.reload()}
    >
      다시 시도
    </button>
  </div>
);

const EmptyState = ({ isMobile }) => (
  <div
    style={{
      textAlign: "center",
      padding: isMobile ? "2rem 1rem" : "3rem 1rem",
      color: "#666",
    }}
  >
    <div
      style={{ fontSize: isMobile ? "2.5rem" : "3rem", marginBottom: "1rem" }}
    >
      📪
    </div>
    <h3
      style={{
        fontSize: isMobile ? "1.2rem" : "1.5rem",
        marginBottom: "0.5rem",
      }}
    >
      알림이 없습니다
    </h3>
    <p style={{ fontSize: isMobile ? "0.9rem" : "1rem" }}>
      새로운 알림이 도착하면 여기에 표시됩니다.
    </p>
  </div>
);

const Pagination = ({ current, total, onPageChange, isMobile }) => (
  <div style={getPaginationStyle(isMobile)}>
    <button
      style={{ ...getPageBtnStyle(isMobile), opacity: current === 0 ? 0.5 : 1 }}
      disabled={current === 0}
      onClick={() => onPageChange(current - 1)}
    >
      이전
    </button>
    <span style={getPageInfoStyle(isMobile)}>
      {current + 1} / {total}
    </span>
    <button
      style={{
        ...getPageBtnStyle(isMobile),
        opacity: current >= total - 1 ? 0.5 : 1,
      }}
      disabled={current >= total - 1}
      onClick={() => onPageChange(current + 1)}
    >
      다음
    </button>
  </div>
);

/* ===== 모바일 대응 스타일 함수들 ===== */
const getContainerStyle = (isMobile) => ({
  width: "100%",
  maxWidth: isMobile ? "100%" : 800,
  margin: "0 auto",
  padding: isMobile ? "0.8rem" : "clamp(1rem,3vw,2rem)",
});

const getHeaderStyle = (isMobile) => ({
  display: "flex",
  flexDirection: isMobile ? "column" : "row",
  justifyContent: isMobile ? "flex-start" : "space-between",
  alignItems: isMobile ? "flex-start" : "center",
  marginBottom: isMobile ? "1rem" : "1.5rem",
  paddingBottom: isMobile ? "0.8rem" : "1rem",
  borderBottom: "1px solid #e0e0e0",
  gap: isMobile ? "0.8rem" : 0,
});

const getTitleStyle = (isMobile) => ({
  fontSize: isMobile ? "1.5rem" : "clamp(1.8rem,4vw,2.5rem)",
  fontWeight: 700,
  color: "#2c3e50",
  margin: 0,
});

const getBadgeStyle = (isMobile) => ({
  background: "#ff4757",
  color: "#fff",
  padding: isMobile ? "0.4rem 0.8rem" : "0.5rem 1rem",
  borderRadius: 16,
  fontSize: isMobile ? "0.75rem" : "clamp(0.8rem,1.3vw,0.9rem)",
  fontWeight: 600,
});

const getCenterStyle = (isMobile) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: isMobile ? "40vh" : "50vh",
  color: "#666",
});

const getSpinnerStyle = (isMobile) => ({
  width: isMobile ? 24 : 32,
  height: isMobile ? 24 : 32,
  border: "4px solid #f3f3f3",
  borderTop: "4px solid #007bff",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
  marginBottom: isMobile ? 12 : 16,
});

const getBtnStyle = (isMobile) => ({
  padding: isMobile ? "0.6rem 1.2rem" : "0.8rem 1.5rem",
  background: "#007bff",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  fontSize: isMobile ? "0.9rem" : 16,
});

const getPaginationStyle = (isMobile) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: isMobile ? 12 : 16,
  marginTop: isMobile ? 24 : 32,
});

const getPageBtnStyle = (isMobile) => ({
  padding: isMobile ? "0.5rem 1rem" : "0.6rem 1.2rem",
  background: "#007bff",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  fontWeight: 600,
  cursor: "pointer",
  fontSize: isMobile ? "0.85rem" : "1rem",
});

const getPageInfoStyle = (isMobile) => ({
  fontWeight: 600,
  color: "#666",
  fontSize: isMobile ? "0.85rem" : "1rem",
});

const getHeaderRightStyle = (isMobile) => ({
  display: "flex",
  alignItems: "center",
  gap: isMobile ? 8 : 16,
  flexWrap: isMobile ? "wrap" : "nowrap",
});

const getMarkAllReadButtonStyle = (isMobile) => ({
  background: "#43b95e",
  color: "#fff",
  outline: "none",
  padding: isMobile ? "0.4rem 0.8rem" : "0.5rem 1rem",
  borderRadius: 16,
  fontSize: isMobile ? "0.75rem" : "clamp(0.8rem,1.3vw,0.9rem)",
  fontWeight: 600,
  border: "none",
  cursor: "pointer",
  transition: "background-color 0.2s ease",
  whiteSpace: "nowrap",
});

/* ➜ 전역 keyframes 한 번만 삽입 */
if (!document.getElementById("notification-spin-keyframe")) {
  const styleTag = document.createElement("style");
  styleTag.id = "notification-spin-keyframe";
  styleTag.textContent = `@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`;
  document.head.appendChild(styleTag);
}

export default NotificationPage;
