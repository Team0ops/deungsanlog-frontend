import React from 'react';

/* 아이콘·색상 매핑 */
const STYLE_MAP = {
  comment       : { icon: '💬', color: '#007bff', label: '댓글' },
  like          : { icon: '❤️', color: '#e74c3c', label: '좋아요' },
  fire_risk     : { icon: '🔥', color: '#ff6b35', label: '산불경보' },
  weather_alert : { icon: '🌧️', color: '#3498db', label: '날씨경보' },
  system        : { icon: '⚙️', color: '#95a5a6', label: '시스템' },
  default       : { icon: '📱', color: '#2c3e50', label: '알림' }
};

const NotificationItem = ({ notification, onClick, onMarkAsRead, onDelete }) => {
  const { icon, color, label } = STYLE_MAP[notification.type] ?? STYLE_MAP.default;

  /* 시간 표시 */
  const prettyTime = (() => {
    const d = new Date(notification.createdAt);
    const diff = Date.now() - d;
    const min  = ~~(diff / 60000);
    const hr   = ~~(diff / 3600000);
    const day  = ~~(diff / 86400000);
    if (min < 1)      return '방금 전';
    if (min < 60)     return `${min}분 전`;
    if (hr  < 24)     return `${hr}시간 전`;
    if (day < 7)      return `${day}일 전`;
    return d.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
  })();

  return (
    <div
      className="notification-item"
      style={{
        ...itemBox,
        background: notification.isRead ? '#fff' : '#f8f9ff',
        borderLeft: `4px solid ${notification.isRead ? '#e0e0e0' : color}`
      }}
      onClick={onClick}
    >
      {/* 아이콘 */}
      <div style={{ ...iconBox, background: color }}>
        <span style={iconStyle}>{icon}</span>
      </div>

      {/* 내용 */}
      <div style={contentBox}>
        <div style={{ ...typeBadge, background: color }}>{label}</div>
        <div style={textStyle}>{notification.content}</div>
        <div style={metaBox}>
          <span style={timeStyle}>{prettyTime}</span>
          {!notification.isRead && <span style={unreadDot} />}
        </div>
      </div>

      {/* 액션 */}
      <div style={actionCol}>
        {!notification.isRead && (
          <button
            className="mark-read-btn"
            style={actionBtnBlue}
            onClick={(e) => { e.stopPropagation(); onMarkAsRead(notification.id); }}
            title="읽음으로 표시"
          >
            ✓
          </button>
        )}
        <button
          style={actionBtnRed}
          onClick={(e) => {
            e.stopPropagation();
            if (window.confirm('이 알림을 삭제하시겠습니까?')) onDelete(notification.id);
          }}
          title="삭제"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

/* ---------- 스타일 ---------- */
const itemBox   = { display: 'flex', gap: 16, padding: 'clamp(1rem,2vw,1.5rem)', borderRadius: 12, border: '1px solid #e9ecef', cursor: 'pointer', transition: 'transform .15s, box-shadow .15s' };
const iconBox   = { width: 44, height: 44, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 };
const iconStyle = { fontSize: 20, color: '#fff' };
const contentBox= { flex: 1, minWidth: 0 };
const typeBadge = { display: 'inline-block', color: '#fff', fontSize: 12, padding: '0.15rem 0.5rem', borderRadius: 8, marginBottom: 6, fontWeight: 600 };
const textStyle = { fontSize: 14, lineHeight: 1.5, color: '#2c3e50', marginBottom: 6, wordBreak: 'break-word' };
const metaBox   = { display: 'flex', alignItems: 'center', gap: 8 };
const timeStyle = { fontSize: 12, color: '#95a5a6' };
const unreadDot = { width: 8, height: 8, background: '#007bff', borderRadius: '50%' };
const actionCol = { display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' };

const baseBtn   = { width: 28, height: 28, borderRadius: '50%', border: '1px solid', background: '#fff', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .15s' };
const actionBtnBlue = { ...baseBtn, borderColor: '#007bff', color: '#007bff' };
const actionBtnRed  = { ...baseBtn, borderColor: '#dc3545', color: '#dc3545' };

/* 전역 hover·액션 효과 (한 번만 삽입) */
if (!document.getElementById('notification-item-hover')) {
  const styleTag = document.createElement('style');
  styleTag.id = 'notification-item-hover';
  styleTag.textContent = `
    .notification-item:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,0,0,.08); }
    .mark-read-btn:hover   { background:#007bff!important; color:#fff!important; }
  `;
  document.head.appendChild(styleTag);
}

export default NotificationItem;
