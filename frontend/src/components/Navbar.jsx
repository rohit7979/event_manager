import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

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
        navigate("/"); // Redirect to signup page
      } else {
        // Handle error
        console.error("Failed to logout");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <nav style={{ padding: "10px", borderBottom: "1px solid #ddd", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        {/* <span style={{ fontWeight: "bold" }}>Welcome, {user.username}</span> */}
        {/* <span style={{ marginLeft: "10px", color: "#555" }}>{user.email}</span> */}
      </div>
      <button onClick={handleLogout} style={{ background: "#f44336", color: "#fff", border: "none", padding: "10px", cursor: "pointer" }}>
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
