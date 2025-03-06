import { useState, useEffect } from "react";
import axios from "axios";

export default function ExamResultEntry() {
  const [students, setStudents] = useState([]);
  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [formData, setFormData] = useState({
    studentId: "",
    examId: "",
    subjectId: "",
    score: "",
  });

  useEffect(() => {
    axios.get("/api/students").then((res) => setStudents(res.data));
    axios.get("/api/exams").then((res) => setExams(res.data));
    axios.get("/api/subjects").then((res) => setSubjects(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/exam_result", formData);
      alert("Result submitted successfully!");
    } catch (error) {
      console.error("Error uploading result", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Upload Exam Results</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Select Student */}
        <select
          className="border p-2 rounded w-full"
          value={formData.studentId}
          onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
          required
        >
          <option value="">Select Student</option>
          {students.map((student) => (
            <option key={student.id} value={student.id}>{student.name}</option>
          ))}
        </select>

        {/* Select Exam */}
        <select
          className="border p-2 rounded w-full"
          value={formData.examId}
          onChange={(e) => setFormData({ ...formData, examId: e.target.value })}
          required
        >
          <option value="">Select Exam</option>
          {exams.map((exam) => (
            <option key={exam.id} value={exam.id}>{exam.name}</option>
          ))}
        </select>

        {/* Select Subject */}
        <select
          className="border p-2 rounded w-full"
          value={formData.subjectId}
          onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
          required
        >
          <option value="">Select Subject</option>
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>{subject.name}</option>
          ))}
        </select>

        {/* Enter Score */}
        <input
          type="number"
          placeholder="Score"
          className="border p-2 rounded w-full"
          value={formData.score}
          onChange={(e) => setFormData({ ...formData, score: e.target.value })}
          required
        />

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Submit Result
        </button>
      </form>
    </div>
  );
}
