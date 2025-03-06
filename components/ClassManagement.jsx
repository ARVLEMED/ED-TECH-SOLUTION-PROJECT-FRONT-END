import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faTrash,
  faMagnifyingGlass,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import "./ClassManagement.css";
import { getToken } from "./Auth";

function ClassManagement() {
  const [classes, setClasses] = useState([]);
  const [forms, setForms] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newClass, setNewClass] = useState({ name: "", form_id: "", class_teacher_id: "" });
  const [editingClass, setEditingClass] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    const user = JSON.parse(localStorage.getItem("user"));
    if (!token || !user || user.role !== "admin") {
      setError("Unauthorized access. Please log in as an admin.");
      navigate("/login");
      return;
    }

    fetchClasses();
    fetchForms();
    fetchTeachers();
  }, [navigate]);

  const fetchClasses = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const token = getToken();
      const response = await fetch("http://127.0.0.1:5000/api/classes", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        if (response.status === 401) throw new Error("Unauthorized");
        throw new Error("Failed to fetch classes");
      }
      const data = await response.json();
      const transformedClasses = data.map((cls) => {
        const teacher = teachers.find((t) => t.id === cls.class_teacher_id);
        return {
          ...cls,
          teacher_name: teacher ? teacher.username : cls.class_teacher_email || "N/A",
        };
      });
      setClasses(transformedClasses || []);
    } catch (err) {
      setError(err.message);
      if (err.message === "Unauthorized") navigate("/login");
    } finally {
      setLoading(false);
    }
  }, [teachers, navigate]);

  const fetchForms = useCallback(async () => {
    try {
      const token = getToken();
      const response = await fetch("http://127.0.0.1:5000/api/forms", {
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch forms");
      const data = await response.json();
      setForms(data || []);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const fetchTeachers = useCallback(async () => {
    try {
      const token = getToken();
      const response = await fetch("http://127.0.0.1:5000/api/teachers", {
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch teachers");
      const data = await response.json();
      const transformedTeachers = data.map((teacher) => ({
        id: teacher.id,
        username: teacher.username || "Unknown",
        email: teacher.email || "No email",
      }));
      setTeachers(transformedTeachers || []);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const handleInputChange = (e) => {
    setNewClass((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredClasses = classes.filter(
    (cls) =>
      cls.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.teacher_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.form_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setShowForm(false);
    setEditingClass(null);
    setNewClass({ name: "", form_id: "", class_teacher_id: "" });
  };

  const addOrUpdateClass = async () => {
    if (!newClass.name || !newClass.form_id || !newClass.class_teacher_id) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const token = getToken();
      const url = editingClass
        ? `http://127.0.0.1:5000/api/classes/${editingClass.id}`
        : "http://127.0.0.1:5000/api/classes";
      const method = editingClass ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newClass.name,
          form_id: parseInt(newClass.form_id),
          class_teacher_id: parseInt(newClass.class_teacher_id),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) throw new Error("Unauthorized");
        throw new Error(errorData.message || "Failed to save class");
      }

      await fetchClasses();
      resetForm();
      alert(editingClass ? "Class updated successfully!" : "Class added successfully!");
    } catch (err) {
      setError(err.message);
      if (err.message === "Unauthorized") navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const deleteClass = async (id) => {
    if (!window.confirm("Are you sure you want to delete this class?")) return;
    setLoading(true);
    setError("");
    try {
      const token = getToken();
      const response = await fetch(`http://127.0.0.1:5000/api/classes/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (!response.ok) {
        if (response.status === 401) throw new Error("Unauthorized");
        throw new Error("Failed to delete class");
      }
      await fetchClasses();
    } catch (err) {
      setError(err.message);
      if (err.message === "Unauthorized") navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  // Added editClass function
  const editClass = (cls) => {
    console.log("Editing class:", cls); // Debug log
    setEditingClass(cls);
    setNewClass({
      name: cls.name || "",
      form_id: cls.form_id?.toString() || "",
      class_teacher_id: cls.class_teacher_id?.toString() || "",
    });
    setShowForm(true);
  };

  // Redirect to login if not authenticated on render
  if (!getToken()) {
    navigate("/login");
    return null;
  }

  return (
    <div className="class-container">
      <h2 className="class-title">Class Management</h2>

      {error && <p className="error-msg">{error}</p>}

      <div className="search-container">
        <input
          type="text"
          placeholder="Search Class..."
          value={searchTerm}
          onChange={handleSearchChange}
          aria-label="Search classes"
        />
        <button className="search-btn">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
      </div>

      <button className="add-class-btn" onClick={() => setShowForm(true)}>
        Add Class
      </button>

      {showForm && (
        <>
          <div className="modal-overlay" onClick={resetForm}></div>
          <div className="class-form">
            <input
              type="text"
              name="name"
              placeholder="Class Name (e.g., Form 1 North)"
              value={newClass.name}
              onChange={handleInputChange}
              required
              aria-label="Class name"
            />
            <select
              name="form_id"
              value={newClass.form_id}
              onChange={handleInputChange}
              required
              aria-label="Form"
            >
              <option value="">Select Form</option>
              {forms.map((form) => (
                <option key={form.id} value={form.id}>
                  {form.name}
                </option>
              ))}
            </select>
            <select
              name="class_teacher_id"
              value={newClass.class_teacher_id}
              onChange={handleInputChange}
              required
              aria-label="Class teacher"
            >
              <option value="">Select Teacher</option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.username}
                </option>
              ))}
            </select>

            <div className="form-buttons">
              <button
                className="form-btn save-btn"
                onClick={addOrUpdateClass}
                disabled={loading}
                aria-label={editingClass ? "Update Class" : "Save Class"}
              >
                {loading ? (
                  <FontAwesomeIcon icon={faSpinner} spin />
                ) : editingClass ? (
                  "Update Class"
                ) : (
                  "Save Class"
                )}
              </button>
              <button className="form-btn cancel-btn" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </div>
        </>
      )}

      {loading && <p className="loading-msg">Loading...</p>}

      <ul className="class-list">
        {filteredClasses.length > 0 ? (
          filteredClasses.map((cls) => (
            <li key={cls.id} className="class-item">
              <div>
                <strong>{cls.name}</strong> <br />
                <small>Form: {cls.form_name}</small> <br />
                <small>Class Teacher: {cls.teacher_name}</small>
              </div>
              <div className="class-actions">
                <button
                  className="edit-btn"
                  onClick={() => editClass(cls)}
                  aria-label="Edit class"
                >
                  <FontAwesomeIcon icon={faPenToSquare} />
                </button>
                <button
                  className="delete-btn"
                  onClick={() => deleteClass(cls.id)}
                  aria-label="Delete class"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </li>
          ))
        ) : (
          <li>No classes found.</li>
        )}
      </ul>
    </div>
  );
}

export default ClassManagement;