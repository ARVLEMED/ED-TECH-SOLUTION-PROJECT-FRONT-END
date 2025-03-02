// import React from "react";
// import WelfarePage from "../components/Welfare";

// const HealthWelfarePage = () => {
//   const student = {
//     name: "Aron Kipkorir",
//     class: "4N",
//     comments:
//       "Aron has maintained good health throughout the term. No major medical issues reported, but he is advised to stay hydrated and maintain a balanced diet.",
//   };

//   return <WelfarePage title="HEALTH WELFARE" student={student} />;
// };

// export default HealthWelfarePage;

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Import useParams to get studentId
import WelfarePage from "../components/Welfare";

const HealthWelfarePage = () => {
  const { studentId } = useParams(); // Get studentId from the URL
  const [student, setStudent] = useState(null); // State to store student data
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(null); // State to handle errors

  // Fetch health welfare data from the backend
  useEffect(() => {
    const fetchHealthWelfare = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/api/students/${studentId}/welfare_reports?category=Health`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch health welfare data");
        }
        const data = await response.json();
        setStudent(data[0]); // Assuming the response is an array with one object
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHealthWelfare();
  }, [studentId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <WelfarePage
      title="HEALTH WELFARE"
      student={student || { name: "", class: "", comments: "" }}
    />
  );
};

export default HealthWelfarePage;
