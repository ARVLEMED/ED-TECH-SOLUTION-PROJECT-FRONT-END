import React from "react";
import { useNavigate } from "react-router-dom";
import { FaBars, FaSignOutAlt } from "react-icons/fa"; // Import logout icon
import "../Styles/Welfare.css";

const WelfarePage = ({ title, student }) => {
  const navigate = useNavigate(); // Initialize navigation

  return (
    <div className="welfare-page">
      {/* Header */}
      <header className="header">
        <FaBars className="menu-icon" onClick={() => navigate("/home")} />
        <h1 className="title">{title}</h1>
        <FaSignOutAlt
          className="logout-icon"
          onClick={() => navigate("/login")}
        />
      </header>

      {/* Main Content */}
      <main className="welfare-container">
        <label>Name:</label>
        <input type="text" value={student.name} readOnly />

        <label>Class:</label>
        <input type="text" value={student.class} readOnly />

        <label>Teacher's Comments:</label>
        <div className="comments-box">{student.comments}</div>
      </main>
    </div>
  );
};

export default WelfarePage;
