// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom"; // Import navigation
// import { FaBars, FaSignOutAlt } from "react-icons/fa"; // Import icons
// import FormSelector from "../components/FormSelector";
// import TermSelector from "../components/TermSelector";
// import ResultsTable from "../components/ResultsTable";
// import "../Styles/ResultsPage.css";

// const ResultsPage = () => {
//   const [selectedForm, setSelectedForm] = useState("Form 2"); // Default to Form 2
//   const [selectedTerm, setSelectedTerm] = useState("Term 3"); // Default to Term 3
//   const navigate = useNavigate(); // Navigation hook

//   // Sample data for results
//   const resultsData = {
//     "Form 1": {
//       "Term 1": [
//         { subject: "Mathematics", marks: 85, grade: "A" },
//         { subject: "English", marks: 78, grade: "B+" },
//         { subject: "Kiswahili", marks: 82, grade: "A-" },
//         { subject: "Physics", marks: 88, grade: "A" },
//         { subject: "Chemistry", marks: 75, grade: "B" },
//         { subject: "Biology", marks: 80, grade: "A-" },
//         { subject: "History", marks: 70, grade: "B" },
//         { subject: "Geography", marks: 85, grade: "A" },
//       ],
//       "Term 2": [
//         { subject: "Mathematics", marks: 88, grade: "A" },
//         { subject: "English", marks: 82, grade: "A-" },
//         { subject: "Kiswahili", marks: 85, grade: "A" },
//         { subject: "Physics", marks: 90, grade: "A+" },
//         { subject: "Chemistry", marks: 78, grade: "B+" },
//         { subject: "Biology", marks: 83, grade: "A-" },
//         { subject: "History", marks: 72, grade: "B" },
//         { subject: "Geography", marks: 87, grade: "A" },
//       ],
//       "Term 3": [
//         { subject: "Mathematics", marks: 90, grade: "A+" },
//         { subject: "English", marks: 85, grade: "A" },
//         { subject: "Kiswahili", marks: 88, grade: "A" },
//         { subject: "Physics", marks: 92, grade: "A+" },
//         { subject: "Chemistry", marks: 80, grade: "A-" },
//         { subject: "Biology", marks: 85, grade: "A" },
//         { subject: "History", marks: 75, grade: "B+" },
//         { subject: "Geography", marks: 89, grade: "A" },
//       ],
//     },
//     "Form 2": {
//       "Term 1": [
//         { subject: "Mathematics", marks: 80, grade: "A-" },
//         { subject: "English", marks: 75, grade: "B" },
//         { subject: "Kiswahili", marks: 78, grade: "B+" },
//         { subject: "Physics", marks: 85, grade: "A" },
//         { subject: "Chemistry", marks: 70, grade: "B" },
//         { subject: "Biology", marks: 82, grade: "A-" },
//         { subject: "History", marks: 68, grade: "C+" },
//         { subject: "Geography", marks: 84, grade: "A" },
//       ],
//       "Term 2": [
//         { subject: "Mathematics", marks: 85, grade: "A" },
//         { subject: "English", marks: 80, grade: "A-" },
//         { subject: "Kiswahili", marks: 83, grade: "A-" },
//         { subject: "Physics", marks: 88, grade: "A" },
//         { subject: "Chemistry", marks: 75, grade: "B" },
//         { subject: "Biology", marks: 85, grade: "A" },
//         { subject: "History", marks: 72, grade: "B" },
//         { subject: "Geography", marks: 87, grade: "A" },
//       ],
//       "Term 3": [
//         { subject: "Mathematics", marks: 92, grade: "A+" },
//         { subject: "English", marks: 88, grade: "A" },
//         { subject: "Kiswahili", marks: 85, grade: "A" },
//         { subject: "Physics", marks: 90, grade: "A+" },
//         { subject: "Chemistry", marks: 78, grade: "B+" },
//         { subject: "Biology", marks: 87, grade: "A" },
//         { subject: "History", marks: 75, grade: "B+" },
//         { subject: "Geography", marks: 89, grade: "A" },
//       ],
//     },
//     // Add data for Form 3 and Form 4
//   };

//   return (
//     <div className="results-page">
//       {/* Navbar */}
//       <header className="navbar">
//         <FaBars
//           className="nav-icon"
//           onClick={() => navigate("/student-profile")}
//         />
//         <h2 className="navbar-title">Student Results</h2>
//         <FaSignOutAlt className="nav-icon" onClick={() => navigate("/login")} />
//       </header>

//       {/* Form and Term Selectors */}
//       <div className="selectors">
//         <FormSelector
//           selectedForm={selectedForm}
//           setSelectedForm={setSelectedForm}
//         />
//         <TermSelector
//           selectedTerm={selectedTerm}
//           setSelectedTerm={setSelectedTerm}
//         />
//       </div>

//       {/* Results Table */}
//       <ResultsTable results={resultsData[selectedForm]?.[selectedTerm] || []} />
//     </div>
//   );
// };

// export default ResultsPage;

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Import useParams to get studentId
import { FaBars, FaSignOutAlt } from "react-icons/fa"; // Import icons
import FormSelector from "../components/FormSelector";
import TermSelector from "../components/TermSelector";
import ResultsTable from "../components/ResultsTable";
import "../Styles/ResultsPage.css";

const ResultsPage = () => {
  const { studentId } = useParams(); // Get studentId from the URL
  const [selectedForm, setSelectedForm] = useState("Form 2"); // Default to Form 2
  const [selectedTerm, setSelectedTerm] = useState("Term 3"); // Default to Term 3
  const [resultsData, setResultsData] = useState(null); // State to store results data
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(null); // State to handle errors
  const navigate = useNavigate(); // Navigation hook

  // Fetch results data from the backend
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/api/students/${studentId}/results`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch results");
        }
        const data = await response.json();
        setResultsData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [studentId]);

  if (loading) {
    return <div>Loading...</div>; // Display loading message
  }

  if (error) {
    return <div>Error: {error}</div>; // Display error message
  }

  return (
    <div className="results-page">
      {/* Navbar */}
      <header className="navbar">
        <FaBars
          className="nav-icon"
          onClick={() => navigate(`/student-profile/${studentId}`)} // Navigate back to student profile
        />
        <h2 className="navbar-title">Student Results</h2>
        <FaSignOutAlt className="nav-icon" onClick={() => navigate("/login")} />
      </header>

      {/* Form and Term Selectors */}
      <div className="selectors">
        <FormSelector
          selectedForm={selectedForm}
          setSelectedForm={setSelectedForm}
        />
        <TermSelector
          selectedTerm={selectedTerm}
          setSelectedTerm={setSelectedTerm}
        />
      </div>

      {/* Results Table */}
      <ResultsTable
        results={resultsData?.[selectedForm]?.[selectedTerm] || []} // Use fetched data
      />
    </div>
  );
};

export default ResultsPage;
