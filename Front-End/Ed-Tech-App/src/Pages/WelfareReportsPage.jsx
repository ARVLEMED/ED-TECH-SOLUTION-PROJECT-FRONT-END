import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import { FaBars, FaSignOutAlt } from "react-icons/fa"; // Importing icons
import HealthWelfare from "../Pages/HealthWelfarePage";
import DisciplineWelfare from "../Pages/DisciplineWelfarePage";
import AcademicWelfare from "../Pages/AcademicWelfarePage";
import "../Styles/WelfareReports.css"; // Ensure CSS is correctly linked

const WelfareReportsPage = () => {
  const [selectedReport, setSelectedReport] = useState("academic"); // Default to Academic Welfare
  const navigate = useNavigate(); // React Router navigation

  return (
    <div className="welfare-reports">
      {/* Navbar */}
      <header className="welfare-header">
        {/* Hamburger Icon (Left) - Navigates to Student Profile */}
        <FaBars
          className="nav-icon"
          onClick={() => navigate("/student-profile")}
        />

        {/* Navbar Buttons */}
        <div className="welfare-buttons">
          <button
            className={selectedReport === "academic" ? "active" : ""}
            onClick={() => setSelectedReport("academic")}
          >
            Academic Welfare
          </button>
          <button
            className={selectedReport === "health" ? "active" : ""}
            onClick={() => setSelectedReport("health")}
          >
            Health Welfare
          </button>
          <button
            className={selectedReport === "discipline" ? "active" : ""}
            onClick={() => setSelectedReport("discipline")}
          >
            Discipline Welfare
          </button>
        </div>

        {/* Logout Icon (Right) - Navigates to Login Page */}
        <FaSignOutAlt className="nav-icon" onClick={() => navigate("/login")} />
      </header>

      {/* Show the selected welfare report */}
      <div className="welfare-content">
        {selectedReport === "academic" && <AcademicWelfare />}
        {selectedReport === "health" && <HealthWelfare />}
        {selectedReport === "discipline" && <DisciplineWelfare />}
      </div>
    </div>
  );
};

export default WelfareReportsPage;
