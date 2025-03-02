import { useState } from "react";
import "./assets/styles/ExamsPage.css";

function ExamsPage() {
  const [examName, setExamName] = useState("");
  const [subject, setSubject] = useState("");
  const [admissionNumber, setAdmissionNumber] = useState("");
  const [marks, setMarks] = useState("");
  const [examRecords, setExamRecords] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newRecord = { examName, subject, admissionNumber, marks };
    
    if (editingIndex !== null) {
      const updatedRecords = [...examRecords];
      updatedRecords[editingIndex] = newRecord;
      setExamRecords(updatedRecords);
      setEditingIndex(null);
    } else {
      setExamRecords([...examRecords, newRecord]);
    }
    
    setExamName("");
    setSubject("");
    setAdmissionNumber("");
    setMarks("");
  };

  const handleEdit = (index) => {
    const record = examRecords[index];
    setExamName(record.examName);
    setSubject(record.subject);
    setAdmissionNumber(record.admissionNumber);
    setMarks(record.marks);
    setEditingIndex(index);
  };

  return (
    <div className="exam-wrapper">
      <div className="exam-container">
        <h2 className="title">Enter Exam Results</h2>
        
        <form onSubmit={handleSubmit} className="exam-form">
          <div className="form-group">
            <label>Exam Name:</label>
            <input type="text" value={examName} onChange={(e) => setExamName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Admission Number:</label>
            <input type="text" value={admissionNumber} onChange={(e) => setAdmissionNumber(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Subject:</label>
            <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Marks:</label>
            <input type="number" value={marks} onChange={(e) => setMarks(e.target.value)} required />
          </div>

          <button type="submit" className="submit-btn">
            {editingIndex !== null ? "Update" : "Submit"}
          </button>
        </form>

        <h3 className="subtitle">Exam Records</h3>
        <table className="exam-records">
          <thead>
            <tr>
              <th>Exam Name</th>
              <th>Subject</th>
              <th>Admission Number</th>
              <th>Marks</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {examRecords.map((record, index) => (
              <tr key={index}>
                <td>{record.examName}</td>
                <td>{record.subject}</td>
                <td>{record.admissionNumber}</td>
                <td>{record.marks}</td>
                <td>
                  <button onClick={() => handleEdit(index)} className="edit-btn">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ExamsPage;
