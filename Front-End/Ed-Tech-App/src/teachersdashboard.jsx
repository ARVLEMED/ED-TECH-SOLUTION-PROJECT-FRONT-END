import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import StudentsPage from "./Studentspage";
import ExamsPage from "./Examspage";
import WelfarePage from "./Welfare";

function TeacherDashboard() {
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/path-to-your-uploaded-image.jpg')" }}>
      {/* Navbar */}
      <nav className="bg-blue-900 text-yellow-400 p-4 flex justify-between items-center shadow-md">
        {/* Menu Button for Mobile */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-xl font-bold md:hidden">☰</button>
        
        {/* Logo / Branding */}
        <h1 className="text-lg font-bold">EDU-TECH</h1>
        
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search Student..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 rounded-md text-black w-1/3"
        />
        
        {/* Profile & Logout */}
        <div className="flex items-center gap-4">
          <span className="hidden md:block">Teacher</span>
          <button className="bg-red-500 px-3 py-1 rounded-lg">Logout</button>
        </div>
        <div className="bg-blue-500 text-white p-4 text-lg">
  Tailwind is working!
</div>

      </nav>

      {/* Sidebar Navigation (for mobile) */}
      {menuOpen && (
        <div className="bg-blue-800 text-white p-4 flex flex-col gap-4 md:hidden">
          <Link to="/students" className="hover:bg-blue-700 p-2 rounded">Students</Link>
          <Link to="/exams" className="hover:bg-blue-700 p-2 rounded">Exams</Link>
          <Link to="/welfare" className="hover:bg-blue-700 p-2 rounded">Welfare</Link>
        </div>
      )}
    </div>
  );
}
 
export default TeacherDashboard;
