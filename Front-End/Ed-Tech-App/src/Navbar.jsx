import React, { useState } from "react";
import "./assets/styles/Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>☰</div>
      <div className="navbar-center">Teachers Dashboard</div>
      <div className={`navbar-links-container ${menuOpen ? "active" : ""}`}>
        <ul className={`navbar-links ${menuOpen ? "active" : ""}`}>
          <li><a href="/exams">Exams</a></li>
          <li><a href="/welfare">Welfare Management</a></li>
          <li><a href="/students">Students</a></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
