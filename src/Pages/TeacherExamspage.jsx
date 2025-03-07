import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../Styles/TeacherExamsPage.css";
import { getToken } from "../../components/Auth";

function TeacherExamspage() {
  const navigate = useNavigate();
  const [examName, setExamName] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [admissionNumber, setAdmissionNumber] = useState("");
  const [marks, setMarks] = useState("");
  const [examRecords, setExamRecords] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [exams, setExams] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
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

      const resultsResponse = await axios.get("https://ed-tech-solution-project-back-end.onrender.com/api/results", config);
      setExamRecords(resultsResponse.data);

      const studentsResponse = await axios.get("https://ed-tech-solution-project-back-end.onrender.com/api/students", config);
      setStudents(studentsResponse.data);

      const subjectsResponse = await axios.get("https://ed-tech-solution-project-back-end.onrender.com/api/subjects", config);
      setSubjects(subjectsResponse.data);

      const examsResponse = await axios.get("https://ed-tech-solution-project-back-end.onrender.com/api/exams", config);
      setExams(examsResponse.data);

      setError(null);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setError(err.message || "Failed to load data");
      if (err.message === "Unauthorized") navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = getToken();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!token || user.role !== "teacher") {
      setError("Unauthorized access. Please log in as a teacher.");
      navigate("/login");
      return;
    }

    fetchData();
  }, [navigate]);

  const getStudentName = (studentId) => {
    const student = students.find((s) => s.id === studentId);
    return student ? student.name : "Unknown Student";
  };

  const getSubjectName = (subjectId) => {
    const subject = subjects.find((s) => s.id === subjectId);
    return subject ? subject.name : "Unknown Subject";
  };

  const getExamName = (examId) => {
    const exam = exams.find((e) => e.id === examId);
    return exam ? exam.name : "Unknown Exam";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!examName || !subjectName || !admissionNumber || !marks) {
      alert("Please fill out all fields.");
      return;
    }

    const selectedExam = exams.find((exam) => exam.name === examName);
    const selectedSubject = subjects.find((subject) => subject.name === subjectName);
    const selectedStudent = students.find((student) => student.name === admissionNumber);

    if (!selectedExam || !selectedSubject || !selectedStudent) {
      alert("Invalid selection. Please check your inputs.");
      return;
    }

    const token = getToken();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    console.log("DEBUG: User:", user);
    console.log("DEBUG: Token:", token);

    try {
      const teacherResponse = await axios.get("https://ed-tech-solution-project-back-end.onrender.com/api/me/teacher", {
        headers: { "Authorization": `Bearer ${token}` },
      });
      console.log("DEBUG: Teacher Response:", teacherResponse.data);
      const teacher = teacherResponse.data;
      if (!teacher || !teacher.id) {
        console.error("No teacher profile found for user ID:", user.id);
        alert("Teacher profile not found for this user.");
        return;
      }
      console.log("DEBUG: Selected Teacher:", teacher);

      const newRecord = {
        student_id: selectedStudent.id,
        subject_id: selectedSubject.id,
        exam_id: selectedExam.id,
        score: parseFloat(marks),
        teacher_id: teacher.id,
      };

      console.log("Sending data to backend:", newRecord);

      const config = {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      let response;
      if (editingRecord) {
        response = await axios.put(
          `https://ed-tech-solution-project-back-end.onrender.com/api/results/${editingRecord.id}`,
          newRecord,
          config
        );
        console.log("Update response:", response.data);
        setExamRecords(examRecords.map((record) =>
          record.id === editingRecord.id ? response.data : record
        ));
      } else {
        console.log("DEBUG: Sending POST to /api/results");
        response = await axios.post("https://ed-tech-solution-project-back-end.onrender.com/api/results", newRecord, config);
        console.log("Create response:", response.data);
        setExamRecords([...examRecords, response.data]);
      }

      setExamName("");
      setSubjectName("");
      setAdmissionNumber("");
      setMarks("");
      setEditingRecord(null);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to save exam result:", err.response ? err.response.data : err.message);
      if (err.response?.status === 401) {
        navigate("/login");
      } else {
        alert("Failed to save exam result: " + (err.response?.data?.message || err.message || "Unknown error"));
      }
    }
  };

  const handleEdit = (record) => {
    const selectedExam = exams.find((exam) => exam.id === record.exam_id);
    const selectedSubject = subjects.find((subject) => subject.id === record.subject_id);
    const selectedStudent = students.find((student) => student.id === record.student_id);

    setExamName(selectedExam ? selectedExam.name : "");
    setSubjectName(selectedSubject ? selectedSubject.name : "");
    setAdmissionNumber(selectedStudent ? selectedStudent.name : "");
    setMarks(record.score);
    setEditingRecord(record);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      const token = getToken();
      const config = {
        headers: { "Authorization": `Bearer ${token}` },
      };
      await axios.delete(`https://ed-tech-solution-project-back-end.onrender.com/api/results/${id}`, config);
      setExamRecords(examRecords.filter((record) => record.id !== id));
    } catch (err) {
      console.error("Failed to delete exam result:", err);
      if (err.response?.status === 401) {
        navigate("/login");
      } else {
        alert("Failed to delete exam result");
      }
    }
  };

  const token = getToken();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (!token || user.role !== "teacher") {
    navigate("/login");
    return null;
  }

  if (loading) {
    return <div className="loading-message">Loading exam data...</div>;
  }

  if (error) {
    return (
      <div className="error-message">
        <p>Error: {error}</p>
        <button onClick={fetchData} className="retry-button">Retry</button>
      </div>
    );
  }

  return (
    <div className="exam-wrapper">
      <div className="exam-container">
        <h2 className="title">Enter Exam Results</h2>

        <form onSubmit={handleSubmit} className="exam-form">
          <div className="form-group">
            <label>Exam Name:</label>
            <select value={examName} onChange={(e) => setExamName(e.target.value)} required>
              <option value="">Select Exam</option>
              {exams.map((exam) => (
                <option key={exam.id} value={exam.name}>{exam.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Subject:</label>
            <select value={subjectName} onChange={(e) => setSubjectName(e.target.value)} required>
              <option value="">Select Subject</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.name}>{subject.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Student:</label>
            <select value={admissionNumber} onChange={(e) => setAdmissionNumber(e.target.value)} required>
              <option value="">Select Student</option>
              {students.map((student) => (
                <option key={student.id} value={student.name}>{student.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Marks:</label>
            <input type="number" value={marks} onChange={(e) => setMarks(e.target.value)} required />
          </div>
          <button type="submit" className="submit-btn">
            {editingRecord ? "Update" : "Submit"}
          </button>
        </form>

        <h3 className="subtitle">Exam Records</h3>
        {examRecords.length === 0 ? (
          <p className="no-records">No exam records found.</p>
        ) : (
          <ul className="exam-records-list">
            {examRecords.map((record) => {
              const examName = getExamName(record.exam_id);
              const subjectName = getSubjectName(record.subject_id);
              const studentName = getStudentName(record.student_id);

              return (
                <li key={record.id} className="exam-record-item">
                  <div className="record-info">
                    <span><strong>Exam:</strong> {examName}</span>
                    <span><strong>Subject:</strong> {subjectName}</span>
                    <span><strong>Student:</strong> {studentName}</span>
                    <span><strong>Marks:</strong> {record.score}</span>
                  </div>
                  <div className="record-actions">
                    <button onClick={() => handleEdit(record)} className="edit-btn">Edit</button>
                    <button onClick={() => handleDelete(record.id)} className="delete-btn">Delete</button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Edit Exam Result</h3>
              <form onSubmit={handleSubmit} className="exam-form">
                <div className="form-group">
                  <label>Exam Name:</label>
                  <select value={examName} onChange={(e) => setExamName(e.target.value)} required>
                    <option value="">Select Exam</option>
                    {exams.map((exam) => (
                      <option key={exam.id} value={exam.name}>{exam.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Subject:</label>
                  <select value={subjectName} onChange={(e) => setSubjectName(e.target.value)} required>
                    <option value="">Select Subject</option>
                    {subjects.map((subject) => (
                      <option key={subject.id} value={subject.name}>{subject.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Student:</label>
                  <select value={admissionNumber} onChange={(e) => setAdmissionNumber(e.target.value)} required>
                    <option value="">Select Student</option>
                    {students.map((student) => (
                      <option key={student.id} value={student.name}>{student.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Marks:</label>
                  <input type="number" value={marks} onChange={(e) => setMarks(e.target.value)} required />
                </div>
                <button type="submit" className="submit-btn">Update</button>
                <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TeacherExamspage;