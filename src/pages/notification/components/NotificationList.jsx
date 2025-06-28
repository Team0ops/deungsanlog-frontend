import React from 'react';
import NotificationItem from './NotificationItem';

const NotificationList = ({ notifications, onNotificationClick, onMarkAsRead, onDeleteNotification }) => {
  if (!notifications || notifications.length === 0) {
    return null;
  }

  return (
    <div style={listContainerStyle}>
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClick={() => onNotificationClick(notification)}
          onMarkAsRead={() => onMarkAsRead(notification.id)}
          onDelete={() => onDeleteNotification(notification.id)}
        />
      ))}
    </div>
  );
};

const listContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
};

export default NotificationList;