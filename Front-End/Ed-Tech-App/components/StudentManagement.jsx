import React, { useState } from "react";
import { FaSearch, FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";
import "./StudentManagement.css";

const StudentManagement = () => {
  const [students, setStudents] = useState([
    {
      id: 1,
      name: "John Doe",
      admissionNumber: "A123",
      class: "Grade 1",
      subjects: ["Mathematics", "English"],
      results: { Mathematics: "A", English: "B" },
      welfare: { Discipline: "Good", Academic: "Excellent", Health: "Healthy" },
    },
    {
      id: 2,
      name: "Jane Smith",
      admissionNumber: "B456",
      class: "Grade 2",
      subjects: ["Science", "History"],
      results: { Science: "B", History: "A" },
      welfare: { Discipline: "Average", Academic: "Good", Health: "Needs Attention" },
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [addingStudent, setAddingStudent] = useState(false);

  const viewStudentDetails = (student) => {
    setSelectedStudent(student);
    setEditingStudent(null);
    setAddingStudent(false);
  };

  const handleEdit = (student) => {
    setEditingStudent({ ...student });
    setSelectedStudent(null);
    setAddingStudent(false);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingStudent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = () => {
    setStudents((prev) => prev.map((s) => (s.id === editingStudent.id ? editingStudent : s)));
    setEditingStudent(null);
  };

  const handleCancelEdit = () => {
    setEditingStudent(null);
  };

  const handleDelete = (studentId) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      setStudents(students.filter((student) => student.id !== studentId));
    }
  };

  const openAddStudentForm = () => {
    setAddingStudent(true);
    setEditingStudent(null);
    setSelectedStudent(null);
  };

  const handleNewStudentChange = (e) => {
    const { name, value } = e.target;
    setAddingStudent((prev) => ({
      ...prev,
      [name]: name === "subjects" ? value.split(",").map((s) => s.trim()) : value,
    }));
  };

  const handleAddStudent = () => {
    if (!addingStudent.name || !addingStudent.admissionNumber || !addingStudent.class || !addingStudent.subjects) {
      alert("Please fill in all fields.");
      return;
    }
    setStudents((prev) => [
      ...prev,
      { id: Date.now(), ...addingStudent, results: {}, welfare: {} },
    ]);
    setAddingStudent(false);
  };

  const handleCancelAdd = () => {
    setAddingStudent(false);
  };

  return (
    <div className="student-management-container">
      {/* Search & Add Section */}
      <div className="search-add-container">
        <div className="relative">
          <input
            type="text"
            placeholder="Search students..."
            className="search-input wider-search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="search-icon" />
        </div>
        <button className="add-student-btn" onClick={openAddStudentForm}>
          <FaPlus /> Add Student
        </button>
      </div>

      {/* Student List - Table Layout */}
      <table className="student-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Admission No.</th>
            <th>Class</th>
            <th>Subjects</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 ? (
            students
              .filter((s) =>
                s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.class.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((student) => (
                <tr key={student.id} onClick={() => viewStudentDetails(student)}>
                  <td>{student.name}</td>
                  <td>{student.admissionNumber}</td>
                  <td>{student.class}</td>
                  <td>{student.subjects.join(", ")}</td>
                  <td>
                    <button className="edit-button" onClick={(e) => { e.stopPropagation(); handleEdit(student); }}>
                      <FaEdit />
                    </button>
                    <button className="delete-button" onClick={(e) => { e.stopPropagation(); handleDelete(student.id); }}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
          ) : (
            <tr>
              <td colSpan="5">No students found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Student Details - Results & Welfare Reports */}
     {/* Student Details - Results & Welfare Reports */}
{selectedStudent && (
  <div className="student-details-container">
    <div className="student-details-header">
      <h3>Student Details</h3>
      <button className="close-button" onClick={() => setSelectedStudent(null)}>
        <FaTimes />
      </button>
    </div>
    <p><strong>Name:</strong> {selectedStudent.name}</p>
    <p><strong>Admission Number:</strong> {selectedStudent.admissionNumber}</p>
    <p><strong>Class:</strong> {selectedStudent.class}</p>

    <h4>Academic Results</h4>
    <ul>
      {Object.entries(selectedStudent.results).map(([subject, grade]) => (
        <li key={subject}><strong>{subject}:</strong> {grade}</li>
      ))}
    </ul>

    <h4>Welfare Reports</h4>
    <ul>
      <li><strong>Discipline:</strong> {selectedStudent.welfare.Discipline}</li>
      <li><strong>Academic:</strong> {selectedStudent.welfare.Academic}</li>
      <li><strong>Health:</strong> {selectedStudent.welfare.Health}</li>
    </ul>
  </div>
)}


      {/* Add Student Form */}
      {addingStudent && (
        <div className="add-student-container">
          <h3>Add Student</h3>
          <label>Name:</label>
          <input type="text" name="name" onChange={handleNewStudentChange} />

          <label>Admission Number:</label>
          <input type="text" name="admissionNumber" onChange={handleNewStudentChange} />

          <label>Class:</label>
          <input type="text" name="class" onChange={handleNewStudentChange} />

          <label>Subjects (comma-separated):</label>
          <input type="text" name="subjects" onChange={handleNewStudentChange} />

          <div className="edit-actions">
            <button className="save-button" onClick={handleAddStudent}>
              <FaSave /> Save
            </button>
            <button className="cancel-button" onClick={handleCancelAdd}>
              <FaTimes /> Cancel
            </button>
          </div>
        </div>
      )}

      {/* Edit Student Form */}
      {editingStudent && (
        <div className="edit-student-container">
          <h3>Edit Student</h3>
          <label>Name:</label>
          <input type="text" name="name" value={editingStudent.name} onChange={handleEditChange} />

          <label>Admission Number:</label>
          <input type="text" name="admissionNumber" value={editingStudent.admissionNumber} onChange={handleEditChange} />

          <label>Class:</label>
          <input type="text" name="class" value={editingStudent.class} onChange={handleEditChange} />

          <div className="edit-actions">
            <button className="save-button" onClick={handleSaveEdit}>
              <FaSave /> Save
            </button>
            <button className="cancel-button" onClick={handleCancelEdit}>
              <FaTimes /> Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;
