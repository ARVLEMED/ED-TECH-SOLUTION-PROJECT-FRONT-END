import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./PromoteStudents.css";
import { getToken } from "./Auth";

const PromoteStudents = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [targetForm, setTargetForm] = useState("");
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all students and forms with auth check
  useEffect(() => {
    const token = getToken();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!token || user.role !== "admin") {
      setError("Unauthorized access. Please log in as an admin.");
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch students
        const studentsResponse = await fetch("https://ed-tech-solution-project-back-end.onrender.com/api/students", {
          headers: {
            "Authorization": `Bearer ${token}`, // Add token to headers
            "Content-Type": "application/json",
          },
        });
        if (!studentsResponse.ok) {
          if (studentsResponse.status === 401) throw new Error("Unauthorized");
          throw new Error("Failed to fetch students");
        }
        const studentsData = await studentsResponse.json();
        setStudents(studentsData);

        // Fetch forms
        const formsResponse = await fetch("https://ed-tech-solution-project-back-end.onrender.com/api/forms", {
          headers: { "Authorization": `Bearer ${token}` },
        });
        if (!formsResponse.ok) {
          if (formsResponse.status === 401) throw new Error("Unauthorized");
          throw new Error("Failed to fetch forms");
        }
        const formsData = await formsResponse.json();
        setForms(formsData);
        setTargetForm(formsData[1]?.name || ""); // Default to Form 2
      } catch (err) {
        setError(err.message);
        if (err.message === "Unauthorized") navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  // Handle student selection
  const handleStudentSelect = (studentId) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  // Handle promotion
  const handlePromote = async () => {
    if (selectedStudents.length === 0) {
      setError("Please select at least one student.");
      return;
    }
    if (!targetForm) {
      setError("Please select a target form.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = getToken();
      const response = await fetch("https://ed-tech-solution-project-back-end.onrender.com/api/students/promote", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`, // Add token
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          student_ids: selectedStudents,
          target_form: targetForm,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) throw new Error("Unauthorized");
        throw new Error(errorData.message || "Failed to promote students");
      }

      const data = await response.json();
      console.log("Promotion successful:", data);
      alert(`Students promoted to ${targetForm} successfully!`);
      setSelectedStudents([]); // Clear selection

      // Refresh students list
      const studentsResponse = await fetch("https://ed-tech-solution-project-back-end.onrender.com/api/students", {
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (!studentsResponse.ok) throw new Error("Failed to refresh students list");
      setStudents(await studentsResponse.json());
    } catch (err) {
      setError(err.message);
      if (err.message === "Unauthorized") navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  // Redirect if not authenticated on render
  const token = getToken();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (!token || user.role !== "admin") {
    navigate("/login");
    return null;
  }

  if (loading) return <div className="loading-message">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="promote-students-page">
      <h2>Promote Students</h2>
      <div className="form-selector">
        <label>Select Target Form:</label>
        <select
          value={targetForm}
          onChange={(e) => setTargetForm(e.target.value)}
        >
          <option value="">-- Select Form --</option>
          {forms.map((form) => (
            <option key={form.id} value={form.name}>
              {form.name}
            </option>
          ))}
        </select>
      </div>

      <div className="student-list">
        <h3>Select Students to Promote</h3>
        <table>
          <thead>
            <tr>
              <th>Select</th>
              <th>Name</th>
              <th>Current Class</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(student.id)}
                    onChange={() => handleStudentSelect(student.id)}
                  />
                </td>
                <td>{student.name}</td>
                <td>{student.class_name || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button onClick={handlePromote} disabled={loading}>
        {loading ? "Promoting..." : "Promote Selected Students"}
      </button>
    </div>
  );
};

export default PromoteStudents;