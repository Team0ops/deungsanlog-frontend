import React from "react";

/* 아이콘·색상 매핑 */
const STYLE_MAP = {
  comment: { icon: "💬", color: "#007bff", label: "댓글" },
  like: { icon: "❤️", color: "#e74c3c", label: "좋아요" },
  fire_risk: { icon: "🔥", color: "#ff6b35", label: "산불경보" },
  weather_alert: { icon: "🌧️", color: "#3498db", label: "날씨경보" },
  meeting_apply: { icon: "👥", color: "#8e44ad", label: "모임신청" },
  meeting_accepted: { icon: "✅", color: "#27ae60", label: "모임수락" },
  meeting_full: { icon: "🎯", color: "#f39c12", label: "모임마감" },
  meeting_closed: { icon: "🔒", color: "#95a5a6", label: "모임종료" },
  system: { icon: "⚙️", color: "#95a5a6", label: "시스템" },
  default: { icon: "📱", color: "#2c3e50", label: "알림" },
};

const NotificationItem = ({
  notification,
  onClick,
  onMarkAsRead,
  onDelete,
  isMobile = false,
}) => {
  const { icon, color, label } =
    STYLE_MAP[notification.type] ?? STYLE_MAP.default;

  /* 시간 표시 */
  const prettyTime = (() => {
    const d = new Date(notification.createdAt);
    const diff = Date.now() - d;
    const min = ~~(diff / 60000);
    const hr = ~~(diff / 3600000);
    const day = ~~(diff / 86400000);
    if (min < 1) return "방금 전";
    if (min < 60) return `${min}분 전`;
    if (hr < 24) return `${hr}시간 전`;
    if (day < 7) return `${day}일 전`;
    return d.toLocaleDateString("ko-KR", { month: "short", day: "numeric" });
  })();

  return (
    <div
      className="notification-item"
      style={{
        ...getItemBoxStyle(isMobile),
        background: notification.isRead ? "#fff" : "#f8f9ff",
        borderLeft: `4px solid ${notification.isRead ? "#e0e0e0" : color}`,
      }}
      onClick={onClick}
    >
      {/* 아이콘 */}
      <div style={{ ...getIconBoxStyle(isMobile), background: color }}>
        <span style={getIconStyle(isMobile)}>{icon}</span>
      </div>

      {/* 내용 */}
      <div style={getContentBoxStyle(isMobile)}>
        <div style={{ ...getTypeBadgeStyle(isMobile), background: color }}>
          {isMobile ? label.substring(0, 2) : label}
        </div>
        <div style={getTextStyle(isMobile)}>{notification.content}</div>
        <div style={getMetaBoxStyle(isMobile)}>
          <span style={getTimeStyle(isMobile)}>{prettyTime}</span>
          {!notification.isRead && <span style={getUnreadDotStyle(isMobile)} />}
        </div>
      </div>

      {/* 액션 */}
      <div style={getActionColStyle(isMobile)}>
        {!notification.isRead && (
          <button
            className="mark-read-btn"
            style={getActionBtnBlueStyle(isMobile)}
            onClick={(e) => {
              e.stopPropagation();
              onMarkAsRead(notification.id);
            }}
            title="읽음으로 표시"
          >
            ✓
          </button>
        )}
        <button
          style={getActionBtnRedStyle(isMobile)}
          onClick={(e) => {
            e.stopPropagation();
            if (window.confirm("이 알림을 삭제하시겠습니까?"))
              onDelete(notification.id);
          }}
          title="삭제"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

/* ---------- 모바일 대응 스타일 함수들 ---------- */
const getItemBoxStyle = (isMobile) => ({
  display: "flex",
  gap: isMobile ? 12 : 16,
  padding: isMobile ? "0.8rem" : "clamp(1rem,2vw,1.5rem)",
  borderRadius: isMobile ? 8 : 12,
  border: "1px solid #e9ecef",
  cursor: "pointer",
  transition: "transform .15s, box-shadow .15s",
});

const getIconBoxStyle = (isMobile) => ({
  width: isMobile ? 36 : 44,
  height: isMobile ? 36 : 44,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
});

const getIconStyle = (isMobile) => ({
  fontSize: isMobile ? 16 : 20,
  color: "#fff",
});

const getContentBoxStyle = (isMobile) => ({
  flex: 1,
  minWidth: 0,
  paddingRight: isMobile ? 4 : 0,
});

const getTypeBadgeStyle = (isMobile) => ({
  display: "inline-block",
  color: "#fff",
  fontSize: isMobile ? 10 : 12,
  padding: isMobile ? "0.1rem 0.4rem" : "0.15rem 0.5rem",
  borderRadius: isMobile ? 6 : 8,
  marginBottom: isMobile ? 4 : 6,
  fontWeight: 600,
});

const getTextStyle = (isMobile) => ({
  fontSize: isMobile ? 13 : 14,
  lineHeight: 1.5,
  color: "#2c3e50",
  marginBottom: isMobile ? 4 : 6,
  wordBreak: "break-word",
});

const getMetaBoxStyle = (isMobile) => ({
  display: "flex",
  alignItems: "center",
  gap: isMobile ? 6 : 8,
});

const getTimeStyle = (isMobile) => ({
  fontSize: isMobile ? 11 : 12,
  color: "#95a5a6",
});

const getUnreadDotStyle = (isMobile) => ({
  width: isMobile ? 6 : 8,
  height: isMobile ? 6 : 8,
  background: "#007bff",
  borderRadius: "50%",
});

const getActionColStyle = (isMobile) => ({
  display: "flex",
  flexDirection: "column",
  gap: isMobile ? 6 : 8,
  alignItems: "center",
});

const getBaseBtnStyle = (isMobile) => ({
  width: isMobile ? 24 : 28,
  height: isMobile ? 24 : 28,
  borderRadius: "50%",
  border: "1px solid",
  background: "#fff",
  fontSize: isMobile ? 10 : 12,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all .15s",
});

const getActionBtnBlueStyle = (isMobile) => ({
  ...getBaseBtnStyle(isMobile),
  borderColor: "#007bff",
  color: "#007bff",
});

const getActionBtnRedStyle = (isMobile) => ({
  ...getBaseBtnStyle(isMobile),
  borderColor: "#dc3545",
  color: "#dc3545",
});

/* 전역 hover·액션 효과 (한 번만 삽입) */
if (!document.getElementById("notification-item-hover")) {
  const styleTag = document.createElement("style");
  styleTag.id = "notification-item-hover";
  styleTag.textContent = `
    .notification-item:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,0,0,.08); }
    .mark-read-btn:hover   { background:#007bff!important; color:#fff!important; }
    
    /* 모바일 터치 최적화 */
    @media (max-width: 768px) {
      .notification-item:active { transform: scale(0.98); }
    }
  `;
  document.head.appendChild(styleTag);
}

export default NotificationItem;
