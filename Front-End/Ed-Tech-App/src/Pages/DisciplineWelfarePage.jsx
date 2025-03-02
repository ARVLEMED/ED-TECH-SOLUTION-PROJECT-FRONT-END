// import React from "react";
// import WelfarePage from "../components/Welfare";

// const DisciplineWelfarePage = () => {
//   const student = {
//     name: "Aron Kipkorir",
//     class: "4N",
//     comments:
//       "Aron has displayed commendable discipline and respect towards teachers and fellow students. No major disciplinary cases have been reported.",
//   };

//   return <WelfarePage title="DISCIPLINE WELFARE" student={student} />;
// };

// export default DisciplineWelfarePage;

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Import useParams to get studentId
import WelfarePage from "../components/Welfare";

const DisciplineWelfarePage = () => {
  const { studentId } = useParams(); // Get studentId from the URL
  const [student, setStudent] = useState(null); // State to store student data
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(null); // State to handle errors

  // Fetch discipline welfare data from the backend
  useEffect(() => {
    const fetchDisciplineWelfare = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/api/students/${studentId}/welfare_reports?category=Discipline`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch discipline welfare data");
        }
        const data = await response.json();
        setStudent(data[0]); // Assuming the response is an array with one object
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDisciplineWelfare();
  }, [studentId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <WelfarePage
      title="DISCIPLINE WELFARE"
      student={student || { name: "", class: "", comments: "" }}
    />
  );
};

export default DisciplineWelfarePage;
