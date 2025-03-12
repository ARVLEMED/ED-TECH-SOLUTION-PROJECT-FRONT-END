import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./PromoteStudents.css";
import { fetchWithAuth } from "../src/utils/api"; // Import fetchWithAuth

const PromoteStudents = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [targetForm, setTargetForm] = useState("");
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!localStorage.getItem("token") || user.role !== "admin") {
      setError("Unauthorized access. Please log in as an admin.");
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const studentsData = await fetchWithAuth("students");
        setStudents(studentsData);

        const formsData = await fetchWithAuth("forms");
        setForms(formsData);
        setTargetForm(formsData[1]?.name || ""); // Default to Form 2
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleStudentSelect = (studentId) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

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
      await fetchWithAuth("students/promote", {
        method: "POST",
        body: JSON.stringify({
          student_ids: selectedStudents,
          target_form: targetForm,
        }),
      });

      alert(`Students promoted to ${targetForm} successfully!`);
      setSelectedStudents([]); // Clear selection

      const refreshedStudents = await fetchWithAuth("students");
      setStudents(refreshedStudents);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!localStorage.getItem("token") || JSON.parse(localStorage.getItem("user") || "{}").role !== "admin") {
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