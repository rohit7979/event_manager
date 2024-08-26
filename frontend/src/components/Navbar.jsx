import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../contexts/SocketContext";
import Notifications from "./Notifications";

const Navbar = () => {
  const navigate = useNavigate();

  const socket = useSocket();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);


  useEffect(() => {
    if (!socket) return;

    const handleNotification = () => {
      setNotificationCount((prevCount) => prevCount + 1);
    };

    socket.on('notification', handleNotification);

    return () => {
      socket.off('notification', handleNotification);
    };
  }, [socket]);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8080/user/logout", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      if (response.ok) {
        // Clear tokens and user data
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        navigate("/");
      } else {
        
        console.error("Failed to logout");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };




  return (
    <nav className="navbar">
         <div className="navbar-brand">Event Manager</div>
      
      <div style={{ position: "relative" }}>
        <button onClick={() => setShowNotifications(!showNotifications)} className="navbar-button">
          Notifications ({notificationCount})
        </button>
        
        {showNotifications && <Notifications />} {/* Display Notifications component when showNotifications is true */}
      </div>
      <button onClick={handleLogout} style={{ background: "#f44336", color: "#fff", border: "none", padding: "10px", cursor: "pointer" }}>
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
