// import React from "react";
// import { useNavigate } from "react-router-dom"; // Import useNavigate
// import "../Styles/Profile.css";
// import { FaBars, FaSignOutAlt } from "react-icons/fa"; // Import icons
// import face1 from "../assets/face1.jpg";

// const StudentProfile = () => {
//   const navigate = useNavigate(); // Initialize navigation

//   return (
//     <div className="student-profile">
//       {/* Header */}
//       <header className="header">
//         <FaBars className="menu-icon" onClick={() => navigate("/home")} />{" "}
//         {/* Navigate to Home */}
//         <FaSignOutAlt
//           className="logout-icon"
//           onClick={() => navigate("/login")}
//         />{" "}
//         {/* Navigate to Login */}
//       </header>

//       {/* Main Content */}
//       <main className="profile-container">
//         <div className="profile-card">
//           <img src={face1} alt="Student Profile" className="profile-picture" />
//           <div className="profile-details">
//             <p>
//               <strong>Student Name:</strong> Student One
//             </p>
//             <p>
//               <strong>Admission Number:</strong> 1001
//             </p>
//             <p>
//               <strong>Class:</strong> Form 2 East
//             </p>
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="button-container">
//           <button className="btn" onClick={() => navigate("/results")}>
//             RESULTS
//           </button>
//           <button className="btn" onClick={() => navigate("/welfare-reports")}>
//             WELFARE
//           </button>
//         </div>
//       </main>

//       {/* Footer */}
//       <footer className="footer">
//         Class Teacher’s Email: <span className="email">njoroge@gmail.com</span>
//       </footer>
//     </div>
//   );
// };

// export default StudentProfile;

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Import useParams to get student ID from the URL
import "../Styles/Profile.css";
import { FaBars, FaSignOutAlt } from "react-icons/fa"; // Import icons
import face1 from "../assets/face1.jpg";

const StudentProfile = () => {
  const navigate = useNavigate(); // Initialize navigation
  const { studentId } = useParams(); // Get student ID from the URL
  const [student, setStudent] = useState(null); // State to store student data
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(null); // State to handle errors

  // Fetch student data from the backend
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/api/students/${studentId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch student data");
        }
        const data = await response.json();
        setStudent(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [studentId]);

  if (loading) {
    return <div>Loading...</div>; // Display loading message
  }

  if (error) {
    return <div>Error: {error}</div>; // Display error message
  }

  return (
    <div className="student-profile">
      {/* Header */}
      <header className="header">
        <FaBars className="menu-icon" onClick={() => navigate("/home")} />{" "}
        {/* Navigate to Home */}
        <FaSignOutAlt
          className="logout-icon"
          onClick={() => navigate("/login")}
        />{" "}
        {/* Navigate to Login */}
      </header>

      {/* Main Content */}
      <main className="profile-container">
        <div className="profile-card">
          <img
            src={student.image || face1} // Use student's image or a fallback
            alt="Student Profile"
            className="profile-picture"
          />
          <div className="profile-details">
            <p>
              <strong>Student Name:</strong> {student.name}
            </p>
            <p>
              <strong>Admission Number:</strong> {student.admission_number}
            </p>
            <p>
              <strong>Class:</strong> {student.class_name}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="button-container">
          <button
            className="btn"
            onClick={() => navigate(`/results/${studentId}`)}
          >
            RESULTS
          </button>
          <button
            className="btn"
            onClick={() => navigate(`/welfare-reports/${studentId}`)}
          >
            WELFARE
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        Class Teacher’s Email: <span className="email">njoroge@gmail.com</span>
      </footer>
    </div>
  );
};

export default StudentProfile;
