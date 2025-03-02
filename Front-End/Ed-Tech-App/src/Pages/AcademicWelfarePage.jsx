// import React from "react";
// import WelfarePage from "../components/Welfare";

// const AcademicWelfarePage = () => {
//   const student = {
//     name: "Aron Kipkorir",
//     class: "4N",
//     comments:
//       "Aron has been a decent student academically. His best subject is Physics, and with continued performance, he will achieve his dream of being an Engineer.",
//   };

//   return <WelfarePage title="ACADEMIC WELFARE" student={student} />;
// };

// export default AcademicWelfarePage;

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Import useParams to get studentId
import WelfarePage from "../components/Welfare";

const AcademicWelfarePage = () => {
  const { studentId } = useParams(); // Get studentId from the URL
  const [student, setStudent] = useState(null); // State to store student data
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(null); // State to handle errors

  // Fetch academic welfare data from the backend
  useEffect(() => {
    const fetchAcademicWelfare = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/api/students/${studentId}/welfare_reports?category=Academic`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch academic welfare data");
        }
        const data = await response.json();
        setStudent(data[0]); // Assuming the response is an array with one object
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAcademicWelfare();
  }, [studentId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <WelfarePage
      title="ACADEMIC WELFARE"
      student={student || { name: "", class: "", comments: "" }}
    />
  );
};

export default AcademicWelfarePage;
