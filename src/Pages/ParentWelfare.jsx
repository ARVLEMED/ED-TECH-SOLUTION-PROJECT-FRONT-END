import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaBars, FaSignOutAlt } from "react-icons/fa";
import "../Styles/Welfare.css";
import { fetchWithAuth } from "../src/utils/api"; // Import fetchWithAuth

const WelfarePage = ({ category = "Discipline" }) => {
  const navigate = useNavigate();
  const { studentId } = useParams(); // Use useParams to get studentId from URL
  const [welfareReports, setWelfareReports] = useState([]);
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWelfareData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user.id || user.role !== "parent") {
        throw new Error("Unauthorized: Must be logged in as a parent");
      }

      if (!studentId) {
        throw new Error("No student ID provided");
      }

      // Fetch student data to validate parent ownership
      const student = await fetchWithAuth(`students/${studentId}`);
      if (student.parent_id !== user.id) {
        throw new Error("You are not authorized to view this student's welfare reports");
      }
      setStudentData(student);

      // Fetch welfare reports
      const data = await fetchWithAuth(
        `students/${studentId}/welfare_reports?category=${encodeURIComponent(category)}`
      );
      if (!data || data.length === 0) {
        setWelfareReports([]);
      } else {
        const validReports = data.filter((report) => report && !report.deleted_at);
        if (category === "Health") {
          const latestReport = validReports.reduce((latest, report) =>
            new Date(report.created_at) > new Date(latest.created_at) ? report : latest
          );
          setWelfareReports([latestReport]);
        } else {
          setWelfareReports(validReports);
        }
      }
    } catch (error) {
      console.error("Error fetching welfare data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!localStorage.getItem("token") || user.role !== "parent") {
      setError("Unauthorized access. Please log in as a parent.");
      navigate("/login");
      return;
    }

    fetchWelfareData();
  }, [studentId, category, navigate]);

  const WelfareCard = ({ title, student, report }) => (
    <div className="welfare-page">
      <header className="header">
        <FaBars
          className="menu-icon"
          onClick={() => navigate(`/student-profile/${studentId}`)}
        />
        <h1 className="title">{title}</h1>
        <FaSignOutAlt
          className="logout-icon"
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login");
          }}
        />
      </header>
      <main className="welfare-container">
        <label>Name:</label>
        <input type="text" value={student.name} readOnly />
        <label>Class:</label>
        <input type="text" value={student.class_name} readOnly />
        <label>Teacher's Comments:</label>
        <div className="comments-box">{report.remarks || "No remarks available"}</div>
      </main>
    </div>
  );

  if (!localStorage.getItem("token") || JSON.parse(localStorage.getItem("user") || "{}").role !== "parent") {
    navigate("/login");
    return null;
  }

  if (loading) {
    return <div className="loading-message">Loading {category.toLowerCase()} welfare reports...</div>;
  }

  if (error) {
    return (
      <div className="error-message">
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()} className="retry-button">
          Retry
        </button>
        <button
          onClick={() => navigate(`/student-profile/${studentId}`)}
          className="back-button"
        >
          Back to Profile
        </button>
      </div>
    );
  }

  return (
    <div className={`${category.toLowerCase()}-welfare-page`}>
      <h1 className="page-title">{category} Welfare Reports</h1>
      {welfareReports.length > 0 ? (
        welfareReports.map((report) => (
          <WelfareCard
            key={report.id}
            title={`${category} Welfare`}
            student={{
              name: studentData?.name || "Unknown Student",
              class_name: studentData?.class_name || "N/A",
            }}
            report={report}
          />
        ))
      ) : (
        <p className="no-reports-message">
          No {category.toLowerCase()} welfare reports found for this student.
        </p>
      )}
    </div>
  );
};

export default WelfarePage;