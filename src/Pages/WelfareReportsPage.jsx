import React, { useState, useEffect } from "react"; // Added useEffect
import { useNavigate, useParams } from "react-router-dom";
import { FaBars, FaSignOutAlt } from "react-icons/fa";
import WelfarePage from "./ParentWelfare"; // Assuming this is the correct import
import "../Styles/WelfareReports.css";
import { getToken } from "../../components/Auth"; // Ensure path is correct

const WelfareReportsPage = () => {
  const [selectedReport, setSelectedReport] = useState("academic");
  const navigate = useNavigate();
  const { studentId } = useParams();

  // Check authentication on mount
  useEffect(() => {
    const token = getToken();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!token || user.role !== "parent") {
      console.log("Unauthorized access attempt. Redirecting to login.");
      navigate("/login");
    } else {
      // Optionally verify student ownership here with an API call if needed
      // For simplicity, we rely on WelfarePage to handle this
    }
  }, [navigate, studentId]);

  // Component definitions with studentId passed to WelfarePage
  const AcademicWelfare = () => <WelfarePage category="Academic" studentId={studentId} />;
  const HealthWelfare = () => <WelfarePage category="Health" studentId={studentId} />;
  const DisciplineWelfare = () => <WelfarePage category="Discipline" studentId={studentId} />;

  // Handle logout
  const handleLogout = () => {
    console.log("User logged out");
    localStorage.removeItem("token"); // Clear token
    localStorage.removeItem("user");  // Clear user data
    navigate("/login");
  };

  // Render-time auth check
  const token = getToken();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (!token || user.role !== "parent") {
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