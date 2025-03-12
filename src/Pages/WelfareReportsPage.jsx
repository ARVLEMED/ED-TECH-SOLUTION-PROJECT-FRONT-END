import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaBars, FaSignOutAlt } from "react-icons/fa";
import WelfarePage from "./ParentWelfare"; // Assuming this is the correct import
import "../Styles/WelfareReports.css";

const WelfareReportsPage = () => {
  const [selectedReport, setSelectedReport] = useState("academic");
  const navigate = useNavigate();
  const { studentId } = useParams();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!localStorage.getItem("token") || user.role !== "parent") {
      navigate("/login");
    }
    // No additional API call needed here; WelfarePage handles student ownership
  }, [navigate, studentId]);

  const AcademicWelfare = () => <WelfarePage category="Academic" />;
  const HealthWelfare = () => <WelfarePage category="Health" />;
  const DisciplineWelfare = () => <WelfarePage category="Discipline" />;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!localStorage.getItem("token") || JSON.parse(localStorage.getItem("user") || "{}").role !== "parent") {
    navigate("/login");
    return null;
  }

  return (
    <div className="welfare-reports">
      <header className="welfare-header">
        <FaBars
          className="nav-icon"
          onClick={() => navigate(`/student-profile/${studentId}`)}
        />
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
        <FaSignOutAlt className="nav-icon" onClick={handleLogout} />
      </header>
      <div className="welfare-content">
        {selectedReport === "academic" && <AcademicWelfare />}
        {selectedReport === "health" && <HealthWelfare />}
        {selectedReport === "discipline" && <DisciplineWelfare />}
      </div>
    </div>
  );
};

export default WelfareReportsPage;