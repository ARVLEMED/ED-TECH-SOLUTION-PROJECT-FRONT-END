import React, { useState, useEffect } from "react";
import { FaSearch, FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";
import "./StudentManagement.css";

const StudentManagement = () => {
  const [students, setStudents] = useState([]); // Initialize with an empty array
  const [classes, setClasses] = useState([]); // State for classes
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [addingStudent, setAddingStudent] = useState(false);
  const [welfareReports, setWelfareReports] = useState([]); // State for welfare reports
  const [results, setResults] = useState([]); // State for results
  const [isLoading, setIsLoading] = useState(false); // Add this line
  const [message, setMessage] = useState(""); // Add this line

  // Fetch students and classes from the API when the component mounts
  useEffect(() => {
    fetchStudents();
    fetchClasses();
  }, []);

  // Fetch all students from the API
  const fetchStudents = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/students");
      if (!response.ok) {
        throw new Error("Failed to fetch students");
      }
      const data = await response.json();
      // Ensure each student has a subjects property
      const studentsWithDefaults = data.map((student) => ({
        ...student,
        subjects: student.subjects || [], // Default to an empty array if subjects is missing
      }));
      setStudents(studentsWithDefaults);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  // Fetch all classes from the API
  const fetchClasses = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/classes");
      if (!response.ok) {
        throw new Error("Failed to fetch classes");
      }
      const data = await response.json();
      setClasses(data);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  // Fetch welfare reports for a specific student
  const fetchWelfareReports = async (studentId) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/students/${studentId}/welfare_reports`);
      if (!response.ok) {
        throw new Error("Failed to fetch welfare reports");
      }
      const data = await response.json();
      setWelfareReports(data);
    } catch (error) {
      console.error("Error fetching welfare reports:", error);
    }
  };

  // Fetch results for a specific student
  const fetchResults = async (studentId, retries = 3) => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/students/${studentId}/results`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Student not found");
        } else if (response.status === 500) {
          throw new Error("Internal server error");
        } else {
          throw new Error("Failed to fetch results");
        }
      }
      const data = await response.json();

      if (data.length === 0) {
        console.log("No results found for this student.");
        setResults([]);
        setMessage("No results found for this student.");
      } else {
        setResults(data);
      }
    } catch (error) {
      if (retries > 0) {
        console.log(`Retrying... ${retries} attempts left`);
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second before retrying
        return fetchResults(studentId, retries - 1);
      } else {
        console.error("Error fetching results:", error);
        setMessage(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // View student details, welfare reports, and results
  const viewStudentDetails = async (student) => {
    setSelectedStudent(student);
    await fetchWelfareReports(student.id);
    await fetchResults(student.id);
    setEditingStudent(null);
    setAddingStudent(false);
  };

  // Handle edit button click
  const handleEdit = (student) => {
    setEditingStudent({
      ...student,
      subjects: student.subjects || [], // Default to an empty array if subjects is missing
    });
    setSelectedStudent(null);
    setAddingStudent(false);
  };

  // Handle changes in the edit form
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingStudent((prev) => ({
      ...prev,
      [name]: name === "subjects" ? value.split(",").map((s) => s.trim()) : value,
    }));
  };

  // Save edited student data to the API
  const handleSaveEdit = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/students/${editingStudent.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingStudent),
      });
      if (!response.ok) {
        throw new Error("Failed to update student");
      }
      const updatedStudent = await response.json();
      setStudents((prev) =>
        prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
      );
      setEditingStudent(null);
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingStudent(null);
  };

  // Delete a student from the API
  const handleDelete = async (studentId) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        const response = await fetch(`http://127.0.0.1:5000/api/students/${studentId}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Failed to delete student");
        }
        setStudents((prev) => prev.filter((student) => student.id !== studentId));
      } catch (error) {
        console.error("Error deleting student:", error);
      }
    }
  };

  // Open the add student form
  const openAddStudentForm = () => {
    setAddingStudent({
      name: "",
      admission_number: "", // Use admission_number consistently
      class_id: "", // Use class_id instead of class
      subjects: [], // Initialize subjects as an empty array
    });
    setEditingStudent(null);
    setSelectedStudent(null);
  };

  // Handle changes in the add student form
  const handleNewStudentChange = (e) => {
    const { name, value } = e.target;
    setAddingStudent((prev) => ({
      ...prev,
      [name]: name === "subjects" ? value.split(",").map((s) => s.trim()) : value,
    }));
  };

  // Add a new student to the API
  const handleAddStudent = async () => {
    if (!addingStudent.name || !addingStudent.admission_number || !addingStudent.class_id || !addingStudent.subjects) {
      alert("Please fill in all fields.");
      return;
    }
    try {
      const response = await fetch("http://127.0.0.1:5000/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(addingStudent),
      });
      if (!response.ok) {
        throw new Error("Failed to add student");
      }
      const newStudent = await response.json();
      setStudents((prev) => [...prev, newStudent]);
      setAddingStudent(false);
    } catch (error) {
      console.error("Error adding student:", error);
    }
  };

  // Cancel adding a new student
  const handleCancelAdd = () => {
    setAddingStudent(false);
  };

  // Get class name by ID
  const getClassNameById = (classId) => {
    const classObj = classes.find((cls) => cls.id === classId);
    return classObj ? classObj.name : "Unknown Class";
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
                s.admission_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                getClassNameById(s.class_id).toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((student) => (
                <tr key={student.id} onClick={() => viewStudentDetails(student)}>
                  <td>{student.name}</td>
                  <td>{student.admission_number}</td>
                  <td>{getClassNameById(student.class_id)}</td>
                  <td>{(student.subjects || []).join(", ")}</td>
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
      {selectedStudent && (
        <div className="student-details-container">
          <div className="student-details-header">
            <h3>Student Details</h3>
            <button className="close-button" onClick={() => setSelectedStudent(null)}>
              <FaTimes />
            </button>
          </div>
          <p><strong>Name:</strong> {selectedStudent.name}</p>
          <p><strong>Admission Number:</strong> {selectedStudent.admission_number}</p>
          <p><strong>Class:</strong> {getClassNameById(selectedStudent.class_id)}</p>
          <p><strong>Subjects:</strong> {selectedStudent.subjects.join(", ")}</p>

          {/* Welfare Reports Section */}
          <h4>Welfare Reports</h4>
          {welfareReports.length > 0 ? (
            <ul>
              {welfareReports.map((report) => (
                <li key={report.id}>
                  <strong>Category:</strong> {report.category} | <strong>Remarks:</strong> {report.remarks} | <strong>Date:</strong> {new Date(report.date).toLocaleDateString()}
                </li>
              ))}
            </ul>
          ) : (
            <p>No welfare reports found.</p>
          )}

          {/* Results Section */}
          <h4>Results</h4>
          {results.length > 0 ? (
            <ul>
              {results.map((result) => (
                <li key={result.id}>
                  <strong>Subject:</strong> {result.subject_name} | <strong>Score:</strong> {result.score} | <strong>Exam:</strong> {result.exam_name}
                </li>
              ))}
            </ul>
          ) : (
            <p>No results found.</p>
          )}
        </div>
      )}

      {/* Add Student Form */}
      {addingStudent && (
        <div className="add-student-container">
          <h3>Add Student</h3>
          <label>Name:</label>
          <input type="text" name="name" onChange={handleNewStudentChange} />

          <label>Admission Number:</label>
          <input type="text" name="admission_number" onChange={handleNewStudentChange} />

          <label>Class:</label>
          <select name="class_id" onChange={handleNewStudentChange}>
            <option value="">Select Class</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>

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
          <input type="text" name="admission_number" value={editingStudent.admission_number} onChange={handleEditChange} />

          <label>Class:</label>
          <select name="class_id" value={editingStudent.class_id} onChange={handleEditChange}>
            <option value="">Select Class</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>

          <label>Subjects (comma-separated):</label>
          <input type="text" name="subjects" value={editingStudent.subjects.join(", ")} onChange={handleEditChange} />

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