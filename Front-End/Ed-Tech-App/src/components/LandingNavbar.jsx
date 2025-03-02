import React from "react";
import "../Styles/LandingNavbar.css";
import logo from "../assets/logo.png";

const LandingNavbar = () => {
  return (
    <header className="navbar">
      <img src={logo} alt="School Logo" className="logo" />
      <div className="nav-links">
        <a href="/login" className="nav-link">
          Login
        </a>
        <a href="/register" className="nav-link">
          Sign Up
        </a>
      </div>
    </header>
  );
};

export default LandingNavbar;
