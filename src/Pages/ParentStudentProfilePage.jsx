import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaBars, FaSignOutAlt, FaHome } from "react-icons/fa";
import face1 from "../assets/face1.jpg";
import "../Styles/ParentStudentProfilePage.css";
import { getToken } from "../../components/Auth";

const ParentStudentProfilePage = () => {
  const navigate = useNavigate();
  const { studentId } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStudentData = async () => {
    try {
      const token = getToken();
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      if (!token || user.role !== "parent") {
        throw new Error("Unauthorized: Must be logged in as a parent");
      }

      console.log("Fetching student data for ID:", studentId);
      const response = await fetch(`https://ed-tech-solution-project-back-end.onrender.com/api/students/${studentId}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) throw new Error("Unauthorized");
        if (response.status === 404) throw new Error("Student not found or not authorized");
        throw new Error("Failed to fetch student data");
      }

      const data = await response.json();
      console.log("Student data:", data);

      if (data.parent_id !== user.id) {
        throw new Error("You are not authorized to view this student's profile");
      }

      setStudent(data);
    } catch (error) {
      console.error("Error fetching student data:", error);
      setError(error.message);
      if (error.message === "Unauthorized") navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = getToken();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!token || user.role !== "parent") {
      setError("Unauthorized access. Please log in as a parent.");
      navigate("/login");
      return;
    }

    fetchStudentData();
  }, [studentId, navigate]);

  const handleLogout = () => {
    console.log("User logged out");
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

  const token = getToken();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (!token || user.role !== "parent") {
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