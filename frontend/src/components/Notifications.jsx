import React, { useState, useEffect } from 'react';
import { useSocket } from '../contexts/SocketContext';


const Notifications = () => {
  const socket = useSocket();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!socket) return;

    const handleNotification = (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    };

    socket.on('notification', handleNotification);

    return () => {
      socket.off('notification', handleNotification);
    };
  }, [socket]);

  return (
    <div className="notifications">
      {notifications.length > 0 ? (
        notifications.map((notification, index) => (
          <div key={index} className="notification">
            {notification.message}
          </div>
        ))
      ) : (
        <div>No new notifications</div>
      )}
    </div>
  );
};

export default Notifications;
