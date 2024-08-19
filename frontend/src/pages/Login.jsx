import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const Login = () => {
  const [user, setUser] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const submitHandler = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:8080/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("access_token", data.access_token);
        navigate("/events"); // Redirect to Events page after successful login
      } else {
        console.error(data.message);
        alert(data.message); // Show error message
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="form">
      <h1>Login</h1>
      <input
        type="email"
        name="email"
        placeholder="email"
        onChange={submitHandler}
      />
      <br />
      <input
        type="password"
        name="password"
        placeholder="password"
        onChange={submitHandler}
      />
      <br />
      <button onClick={handleLogin}>
        Login
      </button>
      <Link className="nav-link nav-anchor" to="/">
        Create an account
      </Link>
    </div>
  );
};
