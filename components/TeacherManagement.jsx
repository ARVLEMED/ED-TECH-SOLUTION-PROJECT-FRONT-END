import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";
import "./TeacherManagement.css";
import { fetchWithAuth } from "../src/utils/api"; // Import fetchWithAuth

// Error Boundary Component
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong.</h2>
          <p>{this.state.error.message}</p>
          <button onClick={() => this.setState({ hasError: false })}>Try Again</button>
        </div>
      );
    }
    return this.props.children;
  }
}

const TeacherManagement = () => {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [addingTeacher, setAddingTeacher] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!localStorage.getItem("token") || user.role !== "admin") {
      setMessage("Unauthorized access. Please log in as an admin.");
      navigate("/login");
      return;
    }

    fetchTeachers();
    fetchClasses();
    fetchSubjects();
  }, [navigate]);

  const fetchTeachers = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchWithAuth("teachers");
      const transformedTeachers = data.map((teacher) => ({
        id: teacher.id,
        username: teacher.username || "Unknown",
        email: teacher.email || "No email",
        subjects: teacher.subjects || [],
        managedClass: teacher.managed_class
          ? { id: teacher.managed_class.id, name: teacher.managed_class.name }
          : null,
      }));
      setTeachers(transformedTeachers);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchClasses = useCallback(async () => {
    try {
      const data = await fetchWithAuth("classes");
      setClasses(data);
    } catch (error) {
      setMessage(error.message);
    }
  }, []);

  const fetchSubjects = useCallback(async () => {
    try {
      const data = await fetchWithAuth("subjects");
      setSubjects(data);
    } catch (error) {
      setMessage(error.message);
    }
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const viewTeacherDetails = (teacher) => {
    setSelectedTeacher(teacher);
    setEditingTeacher(null);
    setAddingTeacher(false);
  };

  const handleEdit = (teacher) => {
    const safeTeacher = {
      ...teacher,
      selectedSubjects: Array.isArray(teacher.subjects) ? teacher.subjects : [],
      currentSubject: "",
    };
    setEditingTeacher(safeTeacher);
    setSelectedTeacher(null);
    setAddingTeacher(false);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingTeacher((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addEditSubject = () => {
    if (editingTeacher.currentSubject && !editingTeacher.selectedSubjects.includes(editingTeacher.currentSubject)) {
      setEditingTeacher((prev) => ({
        ...prev,
        selectedSubjects: [...prev.selectedSubjects, prev.currentSubject],
        currentSubject: "",
      }));
    }
  };

  const removeEditSubject = (subject) => {
    setEditingTeacher((prev) => ({
      ...prev,
      selectedSubjects: prev.selectedSubjects.filter((s) => s !== subject),
    }));
  };

  const handleSaveEdit = async () => {
    try {
      const updatedTeacher = await fetchWithAuth(`teachers/${editingTeacher.id}`, {
        method: "PUT",
        body: JSON.stringify({
          username: editingTeacher.username,
          email: editingTeacher.email,
          subjects: editingTeacher.selectedSubjects.join(", "),
        }),
      });
      const transformedTeacher = {
        id: updatedTeacher.id,
        username: updatedTeacher.username,
        email: updatedTeacher.email,
        subjects: updatedTeacher.subjects || [],
        managedClass: updatedTeacher.managed_class
          ? { id: updatedTeacher.managed_class.id, name: updatedTeacher.managed_class.name }
          : null,
      };
      setTeachers((prev) => prev.map((t) => (t.id === transformedTeacher.id ? transformedTeacher : t)));
      setEditingTeacher(null);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleCancelEdit = () => {
    setEditingTeacher(null);
  };

  const handleDelete = async (teacherId) => {
    if (window.confirm("Are you sure you want to delete this teacher?")) {
      try {
        await fetchWithAuth(`teachers/${teacherId}`, { method: "DELETE" });
        setTeachers((prev) => prev.filter((t) => t.id !== teacherId));
      } catch (error) {
        setMessage(error.message);
      }
    }
  };

  const openAddTeacherForm = () => {
    setAddingTeacher({
      username: "",
      email: "",
      password: "",
      selectedSubjects: [],
      currentSubject: "",
    });
    setEditingTeacher(null);
    setSelectedTeacher(null);
  };

  const handleNewTeacherChange = (e) => {
    const { name, value } = e.target;
    setAddingTeacher((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addTeacherSubject = () => {
    if (addingTeacher.currentSubject && !addingTeacher.selectedSubjects.includes(addingTeacher.currentSubject)) {
      setAddingTeacher((prev) => ({
        ...prev,
        selectedSubjects: [...prev.selectedSubjects, prev.currentSubject],
        currentSubject: "",
      }));
    }
  };

  const removeTeacherSubject = (subject) => {
    setAddingTeacher((prev) => ({
      ...prev,
      selectedSubjects: prev.selectedSubjects.filter((s) => s !== subject),
    }));
  };

  const handleAddTeacher = async () => {
    if (!addingTeacher.username || !addingTeacher.email || !addingTeacher.password) {
      alert("Please fill in all required fields (Username, Email, Password).");
      return;
    }
    try {
      const newTeacher = await fetchWithAuth("teachers", {
        method: "POST",
        body: JSON.stringify({
          username: addingTeacher.username,
          email: addingTeacher.email,
          password: addingTeacher.password,
          subjects: addingTeacher.selectedSubjects.join(", "),
        }),
      });
      const transformedTeacher = {
        id: newTeacher.id,
        username: newTeacher.username,
        email: newTeacher.email,
        subjects: newTeacher.subjects || [],
        managedClass: newTeacher.managed_class
          ? { id: newTeacher.managed_class.id, name: newTeacher.managed_class.name }
          : null,
      };
      setTeachers((prev) => [...prev, transformedTeacher]);
      setAddingTeacher(false);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleCancelAdd = () => {
    setAddingTeacher(false);
  };

  const getManagedClass = (teacherId) => {
    const managedClass = classes.find((cls) => cls.class_teacher_id === teacherId);
    return managedClass ? managedClass.name : null;
  };

  if (!localStorage.getItem("token") || JSON.parse(localStorage.getItem("user") || "{}").role !== "admin") {
    navigate("/login");
    return null;
  }

  return (
    <ErrorBoundary>
      <div className="teacher-management-container">
        {/* Search & Add Section */}
        <div className="search-add-container">
          <div className="relative">
            <input
              type="text"
              placeholder="Search teachers..."
              className="search-input wider-search"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <FaSearch className="search-icon" />
          </div>
          <button className="add-teacher-btn" onClick={openAddTeacherForm}>
            <FaPlus /> Add Teacher
          </button>
        </div>

        {/* Teacher List */}
        <ul className="teacher-list">
          {teachers.length > 0 ? (
            teachers
              .filter((t) =>
                t.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                t.email?.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((teacher) => (
                <li key={teacher.id} className="teacher-item" onClick={() => viewTeacherDetails(teacher)}>
                  <div>
                    <strong>{teacher.username}</strong> <br />
                    <small>{teacher.email}</small>
                  </div>
                  <div className="action-buttons">
                    <button className="edit-button" onClick={(e) => { e.stopPropagation(); handleEdit(teacher); }}>
                      <FaEdit />
                    </button>
                    <button className="delete-button" onClick={(e) => { e.stopPropagation(); handleDelete(teacher.id); }}>
                      <FaTrash />
                    </button>
                  </div>
                </li>
              ))
          ) : (
            <li>No teachers found.</li>
          )}
        </ul>

        {/* Teacher Details (Modal) */}
        {selectedTeacher && (
          <>
            <div className="modal-overlay" onClick={() => setSelectedTeacher(null)}></div>
            <div className="teacher-details-container">
              <div className="teacher-details-header">
                <h3>Teacher Details</h3>
                <button className="close-button" onClick={() => setSelectedTeacher(null)}>
                  <FaTimes />
                </button>
              </div>
              <div className="teacher-details-content">
                <p><strong>Username:</strong> {selectedTeacher.username}</p>
                <p><strong>Email:</strong> {selectedTeacher.email}</p>
                <p><strong>Subjects:</strong> {selectedTeacher.subjects?.join(", ") || "None"}</p>
                {selectedTeacher.managedClass && (
                  <p><strong>Managed Class:</strong> {selectedTeacher.managedClass.name}</p>
                )}
              </div>
            </div>
          </>
        )}

        {/* Add Teacher Form (Modal) */}
        {addingTeacher && (
          <>
            <div className="modal-overlay" onClick={(e) => { e.stopPropagation(); handleCancelAdd(); }}></div>
            <div className="add-teacher-container" onClick={(e) => e.stopPropagation()}>
              <h3>Add Teacher</h3>
              <label>Username:</label>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={addingTeacher.username}
                onChange={handleNewTeacherChange}
              />
              <label>Email:</label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={addingTeacher.email}
                onChange={handleNewTeacherChange}
              />
              <label>Password:</label>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={addingTeacher.password}
                onChange={handleNewTeacherChange}
              />
              <label>Subjects:</label>
              <div className="subject-selector">
                <select
                  name="currentSubject"
                  value={addingTeacher.currentSubject}
                  onChange={handleNewTeacherChange}
                >
                  <option value="">Select a subject</option>
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.name}>
                      {subject.name}
                    </option>
                  ))}
                </select>
                <button className="add-subject-btn" onClick={addTeacherSubject}>
                  <FaPlus />
                </button>
              </div>
              <div className="selected-subjects">
                {addingTeacher.selectedSubjects.map((subject) => (
                  <div key={subject} className="subject-item">
                    {subject}
                    <button className="remove-subject-btn" onClick={() => removeTeacherSubject(subject)}>
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
              <div className="edit-actions">
                <button className="save-button" onClick={handleAddTeacher}>
                  <FaSave /> Save
                </button>
                <button className="cancel-button" onClick={handleCancelAdd}>
                  <FaTimes /> Cancel
                </button>
              </div>
            </div>
          </>
        )}

        {/* Edit Teacher Form (Modal) */}
        {editingTeacher && (
          <>
            <div className="modal-overlay" onClick={(e) => { e.stopPropagation(); handleCancelEdit(); }}></div>
            <div className="edit-teacher-container" onClick={(e) => e.stopPropagation()}>
              <h3>Edit Teacher</h3>
              <label>Username:</label>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={editingTeacher.username}
                onChange={handleEditChange}
              />
              <label>Email:</label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={editingTeacher.email}
                onChange={handleEditChange}
              />
              <label>Subjects:</label>
              <div className="subject-selector">
                <select
                  name="currentSubject"
                  value={editingTeacher.currentSubject}
                  onChange={handleEditChange}
                >
                  <option value="">Select a subject</option>
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.name}>
                      {subject.name}
                    </option>
                  ))}
                </select>
                <button className="add-subject-btn" onClick={addEditSubject}>
                  <FaPlus />
                </button>
              </div>
              <div className="selected-subjects">
                {editingTeacher.selectedSubjects.map((subject) => (
                  <div key={subject} className="subject-item">
                    {subject}
                    <button className="remove-subject-btn" onClick={() => removeEditSubject(subject)}>
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
              <div className="edit-actions">
                <button className="save-button" onClick={handleSaveEdit}>
                  <FaSave /> Save
                </button>
                <button className="cancel-button" onClick={handleCancelEdit}>
                  <FaTimes /> Cancel
                </button>
              </div>
            </div>
          </>
        )}

        {isLoading && <p className="loading-msg">Loading...</p>}
        {message && <p className="error-msg">{message}</p>}
      </div>
    </ErrorBoundary>
  );
};

export default TeacherManagement;