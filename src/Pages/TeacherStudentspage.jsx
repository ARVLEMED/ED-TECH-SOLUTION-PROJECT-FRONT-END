import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Added for navigation
import "../Styles/TeacherStudentsPage.css";
import { FaSearch, FaTimes } from "react-icons/fa";
import axios from "axios";
import { getToken } from "../../components/Auth"; // Ensure path is correct

function TeacherStudentspage() {
  const navigate = useNavigate();
  const [studentsData, setStudentsData] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch students from the backend with authentication
  const fetchStudents = async () => {
    try {
      const token = getToken();
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      if (!token || user.role !== "teacher") {
        throw new Error("Unauthorized: Must be logged in as a teacher");
      }

      const config = {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      const response = await axios.get("https://ed-tech-solution-project-back-end.onrender.com/api/students", config);
      setStudentsData(response.data);
      setError("");
    } catch (err) {
      console.error("Failed to fetch students:", err);
      setError(err.response?.data?.message || "Failed to fetch students. Please try again later.");
      if (err.message === "Unauthorized" || err.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch students on mount with auth check
  useEffect(() => {
    const token = getToken();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!token || user.role !== "teacher") {
      setError("Unauthorized access. Please log in as a teacher.");
      navigate("/login");
      return;
    }

    fetchStudents();
  }, [navigate]);

  const filteredStudents = studentsData.filter((student) =>
    student.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleClearSearch = () => {
    setSearch("");
  };

  const handleCloseDetails = () => {
    setSelectedStudent(null);
  };

  // Render-time auth check
  const token = getToken();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (!token || user.role !== "teacher") {
    navigate("/login");
    return null;
  }

  if (loading) {
    return <div className="loading">Loading students...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <button onClick={fetchStudents} className="retry-button">Retry</button>
      </div>
    );
  }

  return (
    <div className="students-container">
      <h2 className="title">Students List</h2>

      {/* Search Bar with Icon and Clear Button */}
      <div className="search-container">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search Student..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-bar"
        />
        {search && (
          <button className="clear-search-btn" onClick={handleClearSearch}>
            <FaTimes />
          </button>
        )}
      </div>

      {/* Student List */}
      <ul className="student-list">
        {filteredStudents.length > 0 ? (
          filteredStudents.map((student) => (
            <li
              key={student.id}
              className="student-item"
              onClick={() => setSelectedStudent(student)}
            >
              <div className="student-info">
                <span className="student-name">{student.name}</span>
                <span className="admission-number">({student.admission_number})</span>
                <span className="class-name">Class: {student.class_name}</span>
              </div>
              <button className="view-details-btn">View Details</button>
            </li>
          ))
        ) : (
          <li className="no-students">No students found matching your search.</li>
        )}
      </ul>

      {/* Student Details Modal */}
      {selectedStudent && (
        <div className="student-details-modal">
          <div className="student-details-content">
            <button className="close-details-btn" onClick={handleCloseDetails}>
              <FaTimes />
            </button>
            <h3 className="student-name">{selectedStudent.name}</h3>
            <p className="admission-number">Admission Number: {selectedStudent.admission_number}</p>
            <p className="class-name">Class: {selectedStudent.class_name}</p>
            <h4 className="subjects-title">Subjects:</h4>
            <ul className="subjects-list">
              {selectedStudent.subjects && selectedStudent.subjects.length > 0 ? (
                selectedStudent.subjects.map((subject, index) => (
                  <li key={index} className="subject-item">
                    {typeof subject === "string" ? subject : subject.name || "Unknown Subject"}
                  </li>
                ))
              ) : (
                <li>No subjects assigned</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeacherStudentspage;