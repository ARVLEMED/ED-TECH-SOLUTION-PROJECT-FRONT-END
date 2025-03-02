import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faTrash,
  faMagnifyingGlass,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import "./ClassManagement.css";

function ClassManagement() {
  const [classes, setClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newClass, setNewClass] = useState({ name: "", teacher_name: "" });
  const [editingClass, setEditingClass] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://127.0.0.1:5000/api/classes");
      if (!response.ok) throw new Error("Failed to fetch classes");
      const data = await response.json();
      setClasses(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setNewClass({ ...newClass, [e.target.name]: e.target.value });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredClasses = classes.filter(
    (cls) =>
      cls.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.teacher_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addOrUpdateClass = async () => {
    if (!newClass.name || !newClass.teacher_name) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const url = editingClass
        ? `http://127.0.0.1:5000/api/classes/${editingClass.id}`
        : "http://127.0.0.1:5000/api/classes";

      const method = editingClass ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newClass),
      });

      if (!response.ok) throw new Error("Failed to save class");

      fetchClasses(); // Refresh list
      cancelForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const editClass = (cls) => {
    setEditingClass(cls);
    setNewClass({ name: cls.name, teacher_name: cls.teacher_name });
    setShowForm(true);
  };

  const deleteClass = async (id) => {
    if (!window.confirm("Are you sure you want to delete this class?")) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/classes/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete class");
      fetchClasses();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingClass(null);
    setNewClass({ name: "", teacher_name: "" });
  };

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
        />
        <button className="search-btn">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
      </div>

      <button className="add-class-btn" onClick={() => setShowForm(true)}>
        Add Class
      </button>

      {showForm && (
        <div className="class-form">
          <input
            type="text"
            name="name"
            placeholder="Class Name"
            value={newClass.name}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="teacher_name"
            placeholder="Teacher Name"
            value={newClass.teacher_name}
            onChange={handleInputChange}
            required
          />

          <div className="form-buttons">
            <button
              className="form-btn save-btn"
              onClick={addOrUpdateClass}
              disabled={loading}
            >
              {loading ? (
                <FontAwesomeIcon icon={faSpinner} spin />
              ) : editingClass ? (
                "Update Class"
              ) : (
                "Save Class"
              )}
            </button>
            <button className="form-btn cancel-btn" onClick={cancelForm}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading && <p className="loading-msg">Loading...</p>}

      <ul className="class-list">
        {filteredClasses.length > 0 ? (
          filteredClasses.map((cls) => (
            <li key={cls.id} className="class-item">
              <div>
                <strong>{cls.name}</strong> <br />
                <small>Class Teacher: {cls.teacher_name}</small>
              </div>
              <div className="class-actions">
                <button className="edit-btn" onClick={() => editClass(cls)}>
                  <FontAwesomeIcon icon={faPenToSquare} />
                </button>
                <button className="delete-btn" onClick={() => deleteClass(cls.id)}>
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