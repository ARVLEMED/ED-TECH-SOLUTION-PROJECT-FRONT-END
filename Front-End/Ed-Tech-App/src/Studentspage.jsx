import { useState } from "react";
import "./assets/styles/Students.css";
import { FaSearch } from "react-icons/fa";

const studentsData = [
  { id: 1, name: "John Doe", admissionNumber: "A123", results: { Math: 85, English: 90 } },
  { id: 2, name: "Jane Smith", admissionNumber: "A124", results: { Math: 78, English: 88 } },
  { id: 3, name: "Alice Johnson", admissionNumber: "A125", results: { Math: 92, English: 81 } },
];

function StudentsPage() {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [search, setSearch] = useState("");

  const filteredStudents = studentsData.filter((student) =>
    student.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="students-container">
      <h2 className="title">Students List</h2>

      {/* Search Bar with Icon */}
      <div className="search-container">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search Student..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-bar"
        />
      </div>

      <ul className="student-list">
        {filteredStudents.map((student) => (
          <li
            key={student.id}
            className="student-item"
            onClick={() => setSelectedStudent(student)}
          >
            {student.name} ({student.admissionNumber})
          </li>
        ))}
      </ul>

      {selectedStudent && (
        <div className="student-details">
          <h3 className="student-name">{selectedStudent.name}</h3>
          <p className="admission-number">Admission Number: {selectedStudent.admissionNumber}</p>
          <h4 className="results-title">Results:</h4>
          <ul>
            {Object.entries(selectedStudent.results).map(([subject, marks]) => (
              <li key={subject} className="result-item">
                {subject}: {marks}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default StudentsPage;

