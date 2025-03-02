import React from "react";
import { useNavigate } from "react-router-dom";
import { FaBars, FaSignOutAlt } from "react-icons/fa";
import "../Styles/Navbar.css"; // Make sure the CSS file exists

const Navbar = ({ title }) => {
  const navigate = useNavigate();

  return (
    <header className="navbar">
      {/* Hamburger Icon (Navigates to Student Profile) */}
      <FaBars
        className="nav-icon"
        onClick={() => navigate("/student-profile")}
      />

      {/* Page Title */}
      <h2 className="navbar-title">{title}</h2>

      {/* Logout Icon (Navigates to Login Page) */}
      <FaSignOutAlt className="nav-icon" onClick={() => navigate("/login")} />
    </header>
  );
};

export default Navbar;
