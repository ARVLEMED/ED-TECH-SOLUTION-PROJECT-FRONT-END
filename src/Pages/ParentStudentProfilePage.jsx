import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaBars, FaSignOutAlt } from "react-icons/fa"; // Removed FaHome since it’s unused in the UI
import face1 from "../assets/face1.jpg";
import "../Styles/ParentStudentProfilePage.css";
import { fetchWithAuth } from "../src/utils/api"; // Import fetchWithAuth

const ParentStudentProfilePage = () => {
  const navigate = useNavigate();
  const { studentId } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStudentData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user.id || user.role !== "parent") {
        throw new Error("Unauthorized: Must be logged in as a parent");
      }

      const data = await fetchWithAuth(`students/${studentId}`);
      if (data.parent_id !== user.id) {
        throw new Error("You are not authorized to view this student's profile");
      }

      setStudent(data);
    } catch (error) {
      console.error("Error fetching student data:", error);
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

    fetchStudentData();
  }, [studentId, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleHome = () => {
    navigate("/home");
  };

  const handleMenu = () => {
    navigate(`/student-profile/${studentId}`);
  };

  if (!localStorage.getItem("token") || JSON.parse(localStorage.getItem("user") || "{}").role !== "parent") {
    navigate("/login");
    return null;
  }

  if (loading) {
    return <div className="loading-message">Loading...</div>;
  }

  if (error) {
    return (
      <div className="error-message">
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()} className="retry-button">
          Retry
        </button>
        <button onClick={handleHome} className="back-button">
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="student-profile">
      <header className="header">
        <FaBars className="menu-icon" onClick={handleMenu} />
        <FaSignOutAlt className="logout-icon" onClick={handleLogout} />
      </header>

      <main className="profile-container">
        <div className="profile-card">
          <img
            src={face1}
            alt="Student Profile"
            className="profile-picture"
          />
          <div className="profile-details">
            <p>
              <strong>Student Name:</strong> {student.name}
            </p>
            <p>
              <strong>Admission Number:</strong> {student.admission_number}
            </p>
            <p>
              <strong>Class:</strong> {student.class_name}
            </p>
          </div>
        </div>

        <div className="button-container">
          <button
            className="btn"
            onClick={() => navigate(`/parent/results/${studentId}`)}
          >
            RESULTS
          </button>
          <button
            className="btn"
            onClick={() => navigate(`/parent/welfare-reports/${studentId}`)}
          >
            WELFARE
          </button>
        </div>
      </main>

      <footer className="footer">
        Class Teacher’s Email: <span className="email">{student.class_teacher_email || "N/A"}</span>
      </footer>
    </div>
  );
};

export default ParentStudentProfilePage;