import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Added for navigation
import { FaSearch, FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";
import './StudentManagement.css';
import { getToken } from "./Auth";

const StudentManagement = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [parents, setParents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [addingStudent, setAddingStudent] = useState(false);
  const [welfareReports, setWelfareReports] = useState([]);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch data on mount with auth check
  useEffect(() => {
    const token = getToken();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!token || user.role !== "admin") {
      setMessage("Unauthorized access. Please log in as an admin.");
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      await fetchClasses();
      console.log("Classes after fetch:", classes);
      await fetchStudents();
      console.log("Students after fetch:", students);
      await fetchParents();
      await fetchSubjects();
    };
    fetchData();
  }, [navigate]);

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const token = getToken();
      const response = await fetch("http://127.0.0.1:5000/api/students", {
        headers: {
          "Authorization": `Bearer ${token}`, // Add token
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        if (response.status === 401) throw new Error("Unauthorized");
        throw new Error("Failed to fetch students");
      }
      const data = await response.json();
      console.log("Fetched Students:", data);

      const studentsWithDefaults = await Promise.all(data.map(async (student) => {
        console.log(`Student ${student.name} - school_class_id: ${student.school_class_id}, class_name: ${student.class_name}`);
        const studentSubjects = await fetchStudentSubjects(student.id);
        return {
          ...student,
          class_name: student.class_name || "Unknown Class",
          subjects: studentSubjects,
        };
      }));
      setStudents(studentsWithDefaults);
    } catch (error) {
      console.error("Error fetching students:", error);
      setMessage(error.message);
      if (error.message === "Unauthorized") navigate("/login");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const token = getToken();
      const response = await fetch("http://127.0.0.1:5000/api/classes", {
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (!response.ok) {
        if (response.status === 401) throw new Error("Unauthorized");
        throw new Error("Failed to fetch classes");
      }
      const data = await response.json();
      console.log("Fetched Classes:", data);
      const simplifiedClasses = data.map(cls => ({ id: cls.id, name: cls.name }));
      setClasses(simplifiedClasses);
    } catch (error) {
      console.error("Error fetching classes:", error);
      setMessage(error.message);
      if (error.message === "Unauthorized") navigate("/login");
    }
  };

  const fetchParents = async () => {
    try {
      const token = getToken();
      const response = await fetch("http://127.0.0.1:5000/api/users/by-role?role=parent", {
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (!response.ok) {
        if (response.status === 401) throw new Error("Unauthorized");
        throw new Error("Failed to fetch parents");
      }
      const data = await response.json();
      console.log("Fetched Parents:", data);
      setParents(data);
    } catch (error) {
      console.error("Error fetching parents:", error);
      setMessage(error.message);
      if (error.message === "Unauthorized") navigate("/login");
    }
  };

  const fetchSubjects = async () => {
    try {
      const token = getToken();
      const response = await fetch("http://127.0.0.1:5000/api/subjects", {
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (!response.ok) {
        if (response.status === 401) throw new Error("Unauthorized");
        throw new Error("Failed to fetch subjects");
      }
      const data = await response.json();
      setSubjects(data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      setMessage(error.message);
      if (error.message === "Unauthorized") navigate("/login");
    }
  };

  const fetchStudentSubjects = async (studentId) => {
    try {
      const token = getToken();
      const response = await fetch(`http://127.0.0.1:5000/api/students/${studentId}/subjects`, {
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (!response.ok) {
        if (response.status === 401) throw new Error("Unauthorized");
        throw new Error("Failed to fetch subjects for student");
      }
      const data = await response.json();
      return data.map(subject => subject.name) || [];
    } catch (error) {
      console.error("Error fetching student subjects:", error);
      if (error.message === "Unauthorized") navigate("/login");
      return [];
    }
  };

  const fetchWelfareReports = async (studentId) => {
    try {
      const token = getToken();
      const response = await fetch(`http://127.0.0.1:5000/api/students/${studentId}/welfare_reports`, {
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (!response.ok) {
        if (response.status === 401) throw new Error("Unauthorized");
        throw new Error("Failed to fetch welfare reports");
      }
      const data = await response.json();
      setWelfareReports(data);
    } catch (error) {
      console.error("Error fetching welfare reports:", error);
      setMessage(error.message);
      if (error.message === "Unauthorized") navigate("/login");
    }
  };

  const fetchResults = async (studentId, retries = 3) => {
    setIsLoading(true);
    try {
      const token = getToken();
      const response = await fetch(`http://127.0.0.1:5000/api/students/${studentId}/results`, {
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (!response.ok) {
        if (response.status === 401) throw new Error("Unauthorized");
        if (response.status === 404) throw new Error("Student not found");
        else if (response.status === 500) throw new Error("Internal server error");
        throw new Error("Failed to fetch results");
      }
      const data = await response.json();
      const validResults = data.filter(result => 
        result.student_id && result.subject_id && result.exam_id && !isSoftDeletedResult(result)
      );
      setResults(validResults);
      if (validResults.length === 0) {
        setMessage("No results found for this student.");
      } else {
        setMessage("");
      }
    } catch (error) {
      if (error.message === "Unauthorized") {
        navigate("/login");
        return;
      }
      if (retries > 0) {
        console.log(`Retrying... ${retries} attempts left`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return fetchResults(studentId, retries - 1);
      } else {
        console.error("Error fetching results:", error);
        setMessage(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isSoftDeletedResult = (result) => {
    return result.deleted_at !== undefined && result.deleted_at !== null;
  };

  const viewStudentDetails = async (student) => {
    setSelectedStudent(student);
    await fetchWelfareReports(student.id);
    await fetchResults(student.id);
    const studentSubjects = await fetchStudentSubjects(student.id);
    setSelectedStudent(prev => ({ ...prev, subjects: studentSubjects }));
    setEditingStudent(null);
    setAddingStudent(false);
  };

  const handleEdit = (student) => {
    setEditingStudent({
      ...student,
      selectedSubjects: student.subjects || [],
      currentSubject: "",
    });
    setSelectedStudent(null);
    setAddingStudent(false);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingStudent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addEditSubject = () => {
    if (editingStudent.currentSubject && !editingStudent.selectedSubjects.includes(editingStudent.currentSubject)) {
      setEditingStudent((prev) => ({
        ...prev,
        selectedSubjects: [...prev.selectedSubjects, prev.currentSubject],
        currentSubject: "",
      }));
    }
  };

  const removeEditSubject = (subject) => {
    setEditingStudent((prev) => ({
      ...prev,
      selectedSubjects: prev.selectedSubjects.filter((s) => s !== subject),
    }));
  };

  const handleSaveEdit = async () => {
    try {
      const token = getToken();
      const parent = parents.find((p) => p.email.toLowerCase() === editingStudent.parent_email.toLowerCase());
      if (!parent) {
        alert("Parent email not found. Please register the parent first.");
        return;
      }

      const response = await fetch(`http://127.0.0.1:5000/api/students/${editingStudent.id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`, // Add token
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editingStudent.name,
          admission_number: editingStudent.admission_number,
          school_class_id: editingStudent.class_id,
          parent_id: parent.id,
          subjects: editingStudent.selectedSubjects,
        }),
      });
      if (!response.ok) {
        if (response.status === 401) throw new Error("Unauthorized");
        throw new Error(`Failed to update student: ${response.statusText}`);
      }
      const updatedStudent = await response.json();
      updatedStudent.class_name = updatedStudent.class_name || getClassNameById(updatedStudent.school_class_id);
      updatedStudent.subjects = editingStudent.selectedSubjects;
      updatedStudent.parent_email = parent.email;
      setStudents((prev) => prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s)));
      setEditingStudent(null);
      setMessage("Student updated successfully.");
    } catch (error) {
      console.error("Error updating student:", error);
      setMessage(error.message);
      if (error.message === "Unauthorized") navigate("/login");
    }
  };

  const handleCancelEdit = () => {
    setEditingStudent(null);
  };

  const handleDelete = async (studentId) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        const token = getToken();
        const response = await fetch(`http://127.0.0.1:5000/api/students/${studentId}`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${token}` },
        });
        if (!response.ok) {
          if (response.status === 401) throw new Error("Unauthorized");
          throw new Error(`Failed to delete student: ${response.statusText}`);
        }
        setStudents((prev) => prev.filter((student) => student.id !== studentId));
        setMessage("Student soft-deleted successfully.");
      } catch (error) {
        console.error("Error deleting student:", error);
        setMessage(error.message);
        if (error.message === "Unauthorized") navigate("/login");
      }
    }
  };

  const openAddStudentForm = () => {
    setAddingStudent({
      name: "",
      admission_number: "",
      class_id: "",
      selectedSubjects: [],
      currentSubject: "",
      parent_email: "",
    });
    setEditingStudent(null);
    setSelectedStudent(null);
  };

  const handleNewStudentChange = (e) => {
    const { name, value } = e.target;
    setAddingStudent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addStudentSubject = () => {
    if (addingStudent.currentSubject && !addingStudent.selectedSubjects.includes(addingStudent.currentSubject)) {
      setAddingStudent((prev) => ({
        ...prev,
        selectedSubjects: [...prev.selectedSubjects, prev.currentSubject],
        currentSubject: "",
      }));
    }
  };

  const removeStudentSubject = (subject) => {
    setAddingStudent((prev) => ({
      ...prev,
      selectedSubjects: prev.selectedSubjects.filter((s) => s !== subject),
    }));
  };

  const handleAddStudent = async () => {
    if (!addingStudent.name || !addingStudent.admission_number || !addingStudent.class_id || !addingStudent.parent_email) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const token = getToken();
      const parent = parents.find((p) => p.email.toLowerCase() === addingStudent.parent_email.toLowerCase());
      if (!parent) {
        alert("Parent email not found. Please register the parent first.");
        return;
      }

      const studentData = {
        name: addingStudent.name,
        admission_number: addingStudent.admission_number,
        school_class_id: addingStudent.class_id,
        parent_email: addingStudent.parent_email,
        subjects: addingStudent.selectedSubjects,
      };

      const response = await fetch("http://127.0.0.1:5000/api/students", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`, // Add token
          "Content-Type": "application/json",
        },
        body: JSON.stringify(studentData),
      });
      if (!response.ok) {
        if (response.status === 401) throw new Error("Unauthorized");
        throw new Error(`Failed to add student: ${response.statusText}`);
      }
      const newStudent = await response.json();
      newStudent.class_name = newStudent.class_name || getClassNameById(newStudent.school_class_id);
      newStudent.subjects = addingStudent.selectedSubjects;
      newStudent.parent_email = addingStudent.parent_email;
      setStudents((prev) => [...prev, newStudent]);
      setAddingStudent(false);
      setMessage("Student added successfully.");
    } catch (error) {
      console.error("Error adding student:", error);
      setMessage(error.message);
      if (error.message === "Unauthorized") navigate("/login");
    }
  };

  const handleCancelAdd = () => {
    setAddingStudent(false);
  };

  const getClassNameById = (classId) => {
    if (!classId && classId !== 0) return "Unknown Class";
    const classObj = classes.find((cls) => cls.id === Number(classId));
    return classObj ? classObj.name : "Unknown Class";
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Redirect if not authenticated on render
  const token = getToken();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (!token || user.role !== "admin") {
    navigate("/login");
    return null;
  }

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
            onChange={handleSearch}
          />
          <FaSearch className="search-icon" />
        </div>
        <button className="add-student-btn" onClick={openAddStudentForm}>
          <FaPlus /> Add Student
        </button>
      </div>

      {/* Student List - Table Layout */}
      <div className="student-table-container">
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
                  s.class_name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((student) => {
                  console.log("Student Data:", student);
                  return (
                    <tr key={student.id} onClick={() => viewStudentDetails(student)}>
                      <td>{student.name}</td>
                      <td>{student.admission_number}</td>
                      <td>{student.class_name}</td>
                      <td>{(student.subjects || []).join(", ") || "None"}</td>
                      <td>
                        <button className="edit-button" onClick={(e) => { e.stopPropagation(); handleEdit(student); }}>
                          <FaEdit />
                        </button>
                        <button className="delete-button" onClick={(e) => { e.stopPropagation(); handleDelete(student.id); }}>
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  );
                })
            ) : (
              isLoading ? (
                <tr>
                  <td colSpan="5">Loading...</td>
                </tr>
              ) : (
                <tr>
                  <td colSpan="5">No students found.</td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      {/* Student Details - Results & Welfare Reports */}
      {selectedStudent && (
        <>
          <div className="modal-overlay" onClick={() => setSelectedStudent(null)}></div>
          <div className="student-details-container">
            <div className="student-details-header">
              <h3>Student Details</h3>
              <button className="close-button" onClick={() => setSelectedStudent(null)}>
                <FaTimes />
              </button>
            </div>
            <div className="student-details-content">
              <p><strong>Name:</strong> {selectedStudent.name}</p>
              <p><strong>Admission Number:</strong> {selectedStudent.admission_number}</p>
              <p><strong>Class:</strong> {selectedStudent.class_name}</p>
              <p><strong>Subjects:</strong> {selectedStudent.subjects.join(", ") || "None"}</p>
              <p><strong>Parent Email:</strong> {selectedStudent.parent_email || "N/A"}</p>

              <h4>Welfare Reports</h4>
              {welfareReports.length > 0 ? (
                <ul className="welfare-reports-list">
                  {welfareReports.map((report) => (
                    <li key={report.id} className="welfare-report-item">
                      <strong>Category:</strong> {report.category} | <strong>Remarks:</strong> {report.remarks} | <strong>Date:</strong> {new Date(report.created_at).toLocaleDateString()}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No welfare reports found.</p>
              )}

              <h4>Results</h4>
              {results.length > 0 ? (
                <ul className="results-list">
                  {results.map((result) => (
                    <li key={result.id} className="result-item">
                      <strong>Subject:</strong> {result.subject_name} | <strong>Score:</strong> {result.score} | <strong>Exam:</strong> {result.exam_name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No results found.</p>
              )}
            </div>
          </div>
        </>
      )}

      {/* Add Student Form (Modal) */}
      {addingStudent && (
        <>
          <div className="modal-overlay" onClick={(e) => { e.stopPropagation(); handleCancelAdd(); }}></div>
          <div className="add-student-container" onClick={(e) => e.stopPropagation()}>
            <h3>Add Student</h3>
            <label>Name:</label>
            <input type="text" name="name" value={addingStudent.name} onChange={handleNewStudentChange} />

            <label>Admission Number:</label>
            <input type="text" name="admission_number" value={addingStudent.admission_number} onChange={handleNewStudentChange} />

            <label>Class:</label>
            <select name="class_id" value={addingStudent.class_id} onChange={handleNewStudentChange}>
              <option value="">Select Class</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>

            <label>Subjects:</label>
            <div className="subject-selector">
              <select
                name="currentSubject"
                value={addingStudent.currentSubject}
                onChange={handleNewStudentChange}
              >
                <option value="">Select a subject</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.name}>
                    {subject.name}
                  </option>
                ))}
              </select>
              <button className="add-subject-btn" onClick={addStudentSubject}>
                <FaPlus />
              </button>
            </div>
            <div className="selected-subjects">
              {addingStudent.selectedSubjects.map((subject) => (
                <div key={subject} className="subject-item">
                  {subject}
                  <button className="remove-subject-btn" onClick={() => removeStudentSubject(subject)}>
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>

            <label>Parent Email:</label>
            <input type="email" name="parent_email" value={addingStudent.parent_email} onChange={handleNewStudentChange} />

            <div className="edit-actions">
              <button className="save-button" onClick={handleAddStudent} disabled={isLoading}>
                <FaSave /> {isLoading ? "Saving..." : "Save"}
              </button>
              <button className="cancel-button" onClick={handleCancelAdd}>
                <FaTimes /> Cancel
              </button>
            </div>
          </div>
        </>
      )}

      {/* Edit Student Form (Modal) */}
      {editingStudent && (
        <>
          <div className="modal-overlay" onClick={(e) => { e.stopPropagation(); handleCancelEdit(); }}></div>
          <div className="edit-student-container" onClick={(e) => e.stopPropagation()}>
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

            <label>Subjects:</label>
            <div className="subject-selector">
              <select
                name="currentSubject"
                value={editingStudent.currentSubject}
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
              {editingStudent.selectedSubjects.map((subject) => (
                <div key={subject} className="subject-item">
                  {subject}
                  <button className="remove-subject-btn" onClick={() => removeEditSubject(subject)}>
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>

            <label>Parent Email:</label>
            <input type="email" name="parent_email" value={editingStudent.parent_email} onChange={handleEditChange} />

            <div className="edit-actions">
              <button className="save-button" onClick={handleSaveEdit} disabled={isLoading}>
                <FaSave /> {isLoading ? "Saving..." : "Save"}
              </button>
              <button className="cancel-button" onClick={handleCancelEdit}>
                <FaTimes /> Cancel
              </button>
            </div>
          </div>
        </>
      )}

      {isLoading && <p className="loading-msg">Loading...</p>}
      {message && <p className={message.includes("error") || message.includes("failed") ? "error-msg" : "success-msg"}>{message}</p>}
    </div>
  );
};

export default StudentManagement;