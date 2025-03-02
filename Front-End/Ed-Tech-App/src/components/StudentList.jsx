// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import SearchFilter from "./SearchFilter";
// import "../Styles/HomePage.css";
// import face1 from "../assets/face1.jpg";
// import face2 from "../assets/face2.avif";

// const StudentList = () => {
//   const navigate = useNavigate();

//   const studentsData = [
//     {
//       id: 1,
//       name: "John Doe",
//       admissionNumber: "S12345",
//       class: "Grade 10",
//       image: face2,
//     },
//     {
//       id: 2,
//       name: "Jane Smith",
//       admissionNumber: "S67890",
//       class: "Grade 12",
//       image: face1,
//     },
//     {
//       id: 3,
//       name: "Michael Johnson",
//       admissionNumber: "S13579",
//       class: "Grade 11",
//       image: face2,
//     },
//   ];

//   const [filteredStudents, setFilteredStudents] = useState(studentsData);

//   return (
//     <div className="student-list-container">
//       {/* ✅ Search Field - Ensures only ONE search input */}
//       <SearchFilter
//         students={studentsData}
//         onSearchResults={setFilteredStudents}
//       />

//       <div className="student-list">
//         {filteredStudents.length > 0 ? (
//           filteredStudents.map((student) => (
//             <div className="student-card" key={student.id}>
//               <img src={student.image} alt={student.name} />
//               <div className="student-details">
//                 <h3>{student.name}</h3>
//                 <p>Admission Number: {student.admissionNumber}</p>
//                 <p>Class: {student.class}</p>
//               </div>
//               <button
//                 className="view-button"
//                 onClick={() => navigate(`/student/${student.id}`)}
//               >
//                 View Student
//               </button>
//             </div>
//           ))
//         ) : (
//           <p>No students found</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default StudentList;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import SearchFilter from "./SearchFilter";
import "../Styles/HomePage.css";

const StudentList = () => {
  const navigate = useNavigate(); // Initialize navigation

  // State for storing students data
  const [studentsData, setStudentsData] = useState([]);
  // State for filtered students
  const [filteredStudents, setFilteredStudents] = useState([]);
  // State for loading and error handling
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch students data from the backend
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/students");
        if (!response.ok) {
          throw new Error("Failed to fetch students");
        }
        const data = await response.json();
        setStudentsData(data);
        setFilteredStudents(data); // Initialize filtered students with all students
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Handle search results
  const handleSearchResults = (results) => {
    setFilteredStudents(results);
  };

  // Handle navigation to student profile
  const handleViewProfile = (studentId) => {
    navigate(`/student-profile/${studentId}`); // Navigate to StudentProfilePage with studentId
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="student-list-container">
      {/* Search Field */}
      <SearchFilter
        students={studentsData}
        onSearchResults={handleSearchResults}
      />

      <div className="student-list">
        {filteredStudents.length > 0 ? (
          filteredStudents.map((student) => (
            <div className="student-card" key={student.id}>
              <img
                src={student.image || "https://via.placeholder.com/150"} // Fallback image if no image is provided
                alt={student.name}
              />
              <div className="student-details">
                <h3>{student.name}</h3>
                <p>Admission Number: {student.admission_number}</p>
                <p>Class: {student.class_name}</p>
              </div>
              <button
                className="view-button"
                onClick={() => handleViewProfile(student.id)} // Pass student.id to handleViewProfile
              >
                View Student
              </button>
            </div>
          ))
        ) : (
          <p>No students found</p>
        )}
      </div>
    </div>
  );
};

export default StudentList;
