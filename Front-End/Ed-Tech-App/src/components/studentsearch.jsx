import { FaSearch } from "react-icons/fa"; // Install react-icons if not installed

const StudentSearch = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search Student..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-bar"
      />
      <button className="search-icon" onClick={() => console.log("Searching:", searchQuery)}>
        <FaSearch />
      </button>
    </div>
  );
};

export default StudentSearch;
