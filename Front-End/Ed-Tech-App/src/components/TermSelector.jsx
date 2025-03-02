import React from "react";

const TermSelector = ({ selectedTerm, setSelectedTerm }) => {
  const terms = ["Term 1", "Term 2", "Term 3"];

  return (
    <div className="term-selector">
      <label>Select Term:</label>
      <select
        value={selectedTerm}
        onChange={(e) => setSelectedTerm(e.target.value)}
      >
        {terms.map((term) => (
          <option key={term} value={term}>
            {term}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TermSelector;
