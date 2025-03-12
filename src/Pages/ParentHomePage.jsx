import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import logo from "../assets/logo.png";
import studentImage from "../assets/face1.jpg";
import "../Styles/ParentHomePage.css";
import { fetchWithAuth } from "../src/utils/api"; // Import fetchWithAuth

const HomePage = () => {
  const navigate = useNavigate();
  const [studentsData, setStudentsData] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStudents = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user.id || user.role !== "parent") {
        throw new Error("User not authenticated as a parent");
      }

      const parentId = user.id;
      const data = await fetchWithAuth(`parents/${parentId}/students`);
      setStudentsData(data);
      setFilteredStudents(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching students:", error);
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

    fetchStudents();
  }, [navigate]);

  const handleSearchResults = (results) => {
    setFilteredStudents(results);
  };

  const handleViewProfile = (studentId) => {
    navigate(`/student-profile/${studentId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    fetchStudents();
  };

  if (!localStorage.getItem("token") || JSON.parse(localStorage.getItem("user") || "{}").role !== "parent") {
    navigate("/login");
    return null;
  }

  return (
    <div className="homepage">
      <nav className="navbar">
        <div className="logo">
          <img src={logo} alt="School Logo" />
          <span>Tusome High School</span>
        </div>
        <button className="logout-button" onClick={handleLogout}>
          <LogOut size={28} color="#f97316" />
        </button>
      </nav>

      <div className="content">
        <div className="search-filter-container">
          <input
            type="text"
            placeholder="Search student by name..."
            onChange={(e) => {
              const value = e.target.value;
              const filtered = studentsData.filter((student) =>
                student.name.toLowerCase().includes(value.toLowerCase())
              );
              handleSearchResults(filtered);
            }}
          />
        </div>

        {loading && <div className="loading-message">Loading students...</div>}

        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={handleRetry} className="retry-button">
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="student-list-container">
            <div className="student-list">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <div className="student-card" key={student.id}>
                    <img src={studentImage} alt={student.name} />
                    <div className="student-details">
                      <h3>{student.name}</h3>
                      <p>Admission Number: {student.admission_number}</p>
                      <p>Class: {student.class_name}</p>
                    </div>
                    <button
                      className="view-button"
                      onClick={() => handleViewProfile(student.id)}
                    >
                      View Student
                    </button>
                  </div>
                ))
              ) : (
                <p className="no-students-message">No students found</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;