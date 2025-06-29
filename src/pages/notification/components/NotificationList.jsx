import React from "react";
import NotificationItem from "./NotificationItem";

const NotificationList = ({
  notifications,
  onNotificationClick,
  onMarkAsRead,
  onDeleteNotification,
  isMobile = false,
}) => {
  if (!notifications || notifications.length === 0) {
    return null;
  }

  return (
    <div style={getListContainerStyle(isMobile)}>
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClick={() => onNotificationClick(notification)}
          onMarkAsRead={() => onMarkAsRead(notification.id)}
          onDelete={() => onDeleteNotification(notification.id)}
          isMobile={isMobile}
        />
      ))}
    </div>
  );
};

const getListContainerStyle = (isMobile) => ({
  display: "flex",
  flexDirection: "column",
  gap: isMobile ? "0.3rem" : "0.5rem",
});

export default NotificationList;
