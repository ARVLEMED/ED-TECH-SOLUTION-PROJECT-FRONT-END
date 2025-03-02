import React, { useState } from "react";

const SearchFilter = ({ students, onSearchResults }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (value) => {
    setSearchTerm(value);
    const filteredStudents = students.filter((student) =>
      student.name.toLowerCase().includes(value.toLowerCase())
    );
    onSearchResults(filteredStudents);
  };

  return (
    <div className="search-filter-container">
      <input
        type="text"
        placeholder="Search student by name..."
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  );
};

export default SearchFilter;
