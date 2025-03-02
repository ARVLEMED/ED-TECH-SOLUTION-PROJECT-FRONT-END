import React from "react";

const ResultsTable = ({ results }) => {
  // Function to calculate overall grade based on average marks
  const calculateOverallGrade = (average) => {
    if (average >= 80) return "A";
    if (average >= 70) return "B";
    if (average >= 60) return "C";
    if (average >= 50) return "D";
    return "E";
  };

  // Calculate total marks, average, and overall grade
  const totalMarks = results.reduce((sum, result) => sum + result.marks, 0);
  const averageMarks = (totalMarks / results.length).toFixed(2);
  const overallGrade = calculateOverallGrade(averageMarks);

  return (
    <div className="results-table">
      <table>
        <thead>
          <tr>
            <th>No.</th>
            <th>Subject</th>
            <th>Marks</th>
            <th>Grade</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{result.subject}</td>
              <td>{result.marks}</td>
              <td>{result.grade}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="2">Total Subjects: {results.length}</td>
            <td>Average: {averageMarks}</td>
            <td>Overall Grade: {overallGrade}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default ResultsTable;
