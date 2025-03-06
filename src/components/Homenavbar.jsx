import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import "../Styles/HomePage.css";

const Homenavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("User logged out");
    navigate("/"); // Redirect to Login page
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <img src={logo} alt="School Logo" />
        <span>Tusome High School</span>
      </div>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
};

export default Homenavbar;
