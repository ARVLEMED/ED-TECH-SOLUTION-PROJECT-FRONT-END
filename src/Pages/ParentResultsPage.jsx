import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaBars, FaSignOutAlt, FaHome } from "react-icons/fa";
import "../Styles/ParentResultsPage.css";
import { getToken } from "../../components/Auth";

// Function to calculate grade based on score
const calculateGrade = (score) => {
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  if (score >= 60) return "C";
  if (score >= 50) return "D";
  return "E";
};

const ResultsPage = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();

  const [selectedForm, setSelectedForm] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("");
  const [forms, setForms] = useState([]);
  const [terms] = useState(["Term 1", "Term 2", "Term 3"]);
  const [resultsData, setResultsData] = useState([]);
  const [classAttended, setClassAttended] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch student details and available forms with authentication
  const fetchFormsAndDefaults = async (studentId) => {
    try {
      const token = getToken();
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      if (!token || user.role !== "parent") {
        throw new Error("Unauthorized: Must be logged in as a parent");
      }

      const response = await fetch(`https://ed-tech-solution-project-back-end.onrender.com/api/students/${studentId}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) throw new Error("Unauthorized");
        throw new Error("Failed to fetch student details");
      }

      const data = await response.json();
      console.log("Student Details Response:", data);

      const currentForm = data.class_name ? data.class_name.split(" ")[0] : "Form 1";
      setSelectedForm(currentForm);
      setForms(["Form 1", "Form 2", "Form 3", "Form 4"]);
      setClassAttended({
        class_name: data.class_name || "Unknown",
        class_teacher: data.class_teacher_email || "N/A",
      });
      setSelectedTerm("Term 3");
    } catch (error) {
      console.error("Error fetching student details:", error);
      setError(error.message);
      if (error.message === "Unauthorized") navigate("/login");
    }
  };

  // Fetch results based on form and term with authentication
  const fetchResults = async (studentId, form, term) => {
    try {
      const token = getToken();
      console.log(`Fetching results for student ${studentId}, form: ${form}, term: ${term}`);
      const response = await fetch(
        `https://ed-tech-solution-project-back-end.onrender.com/api/students/${studentId}/results?form=${encodeURIComponent(form)}&term=${encodeURIComponent(term)}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Fetch results failed:", response.status, errorText);
        if (response.status === 401) throw new Error("Unauthorized");
        throw new Error(errorText || "Failed to fetch results");
      }

      const data = await response.json();
      console.log("Fetched Results:", data);
      setResultsData(data);
    } catch (error) {
      console.error("Error fetching results:", error);
      setError(error.message);
      setResultsData([]);
      if (error.message === "Unauthorized") navigate("/login");
    }
  };

  // Initial data fetch with auth check
  useEffect(() => {
    const token = getToken();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!token || user.role !== "parent") {
      setError("Unauthorized access. Please log in as a parent.");
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!studentId) {
          throw new Error("No student ID provided");
        }
        await fetchFormsAndDefaults(studentId);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [studentId, navigate]);

  // Fetch results when form or term changes
  useEffect(() => {
    if (selectedForm && selectedTerm && !loading) {
      const fetchResultsData = async () => {
        setLoading(true);
        setError(null);
        try {
          await fetchResults(studentId, selectedForm, selectedTerm);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };
      fetchResultsData();
    }
  }, [studentId, selectedForm, selectedTerm]);

  // Calculate summary data
  const totalSubjects = resultsData.length;
  const averageScore =
    totalSubjects > 0
      ? resultsData.reduce((sum, result) => sum + (result.score || 0), 0) / totalSubjects
      : 0;
  const overallGrade = calculateGrade(averageScore);

  // Navigation handlers
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleHome = () => {
    navigate(`/student-profile/${studentId}`); // Changed to go back to profile
  };

  const handleMenu = () => {
    navigate(`/student-profile/${studentId}`);
  };

  // Render-time auth check
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
        <div className="error-actions">
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
      </div>
    );
  }

  return (
    <div className="results-page">
      <header className="navbar">
        <FaBars className="nav-icon" onClick={handleMenu} />
        <h2 className="navbar-title">Student Results</h2>
        <div>
          <FaSignOutAlt className="nav-icon" onClick={handleLogout} />
        </div>
      </header>

      <div className="selectors">
        <div className="form-selector">
          <label>Select Form:</label>
          <select value={selectedForm} onChange={(e) => setSelectedForm(e.target.value)}>
            {forms.map((form) => (
              <option key={form} value={form}>
                {form}
              </option>
            ))}
          </select>
        </div>
        <div className="term-selector">
          <label>Select Term:</label>
          <select value={selectedTerm} onChange={(e) => setSelectedTerm(e.target.value)}>
            {terms.map((term) => (
              <option key={term} value={term}>
                {term}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="results-table">
        <h3>
          Results for {selectedForm} - {selectedTerm}
        </h3>
        {resultsData.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>No.</th>
                <th>Subject</th>
                <th>Exam</th>
                <th>Score</th>
                <th>Grade</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {resultsData.map((result, index) => (
                <tr key={result.id || index}>
                  <td>{index + 1}</td>
                  <td>{result.subject_name || "N/A"}</td>
                  <td>{result.exam_name || "N/A"}</td>
                  <td>{result.score !== undefined ? result.score.toFixed(2) : "N/A"}</td>
                  <td>{result.score !== undefined ? calculateGrade(result.score) : "N/A"}</td>
                  <td>{result.created_at ? new Date(result.created_at).toLocaleDateString() : "N/A"}</td>
                </tr>
              ))}
              <tr className="summary-row">
                <td colSpan="3"><strong>Total Subjects: {totalSubjects}</strong></td>
                <td><strong>Average: {averageScore.toFixed(2)}</strong></td>
                <td><strong>Overall Grade: {overallGrade}</strong></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p>No results found for this form and term.</p>
        )}
      </div>

      <div className="classes-attended">
        <h3>Class Attended</h3>
        {classAttended ? (
          <p>
            <strong>{classAttended.class_name || "Unknown Class"}</strong> (Teacher: {classAttended.class_teacher || "N/A"})
          </p>
        ) : (
          <p>No class attended recorded.</p>
        )}
      </div>
    </div>
  );
};

export default ResultsPage;