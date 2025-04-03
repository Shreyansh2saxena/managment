import React from "react";

const LogoutButton = () => {
  const handleLogout = () => {
    localStorage.removeItem("employee"); // Clear stored session
    alert("Logged out successfully!");
    window.location.href = "/"; // Redirect to login
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
