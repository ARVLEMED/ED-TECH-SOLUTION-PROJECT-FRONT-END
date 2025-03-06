import { useState, useEffect } from "react"; // Added useEffect
import { Routes, Route, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import "../Styles/TeacherDashboard.css";
import { getToken } from "../../components/Auth"; // Ensure path is correct

// Importing pages
import TeacherStudentspage from './TeacherStudentspage';
import TeacherExamspage from "./TeacherExamspage";
import TeacherWelfare from "./TeacherWelfare";

function TeacherDashboard() {
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // Check authentication on mount
    useEffect(() => {
        const token = getToken();
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (!token || user.role !== "teacher") {
            console.log("Unauthorized access attempt. Redirecting to login.");
            navigate("/login");
        }
    }, [navigate]);

    // Handle logout
    const handleLogout = () => {
        console.log("User logged out");
        localStorage.removeItem("token"); // Clear token
        localStorage.removeItem("user");  // Clear user data
        navigate("/login"); // Redirect to login page
    };

    // Render-time auth check
    const token = getToken();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!token || user.role !== "teacher") {
        navigate("/login");
        return null;
    }

    return (
        <div className="dashboard-container">
            {/* Top Navbar */}
            <nav className="top-navbar">
                <button className="menu-button md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>

                <h1 className="logo" style={{ color: "orange" }}>Teacher Portal</h1>

                {/* Desktop Navigation */}
                <ul className="nav-links md:flex hidden">
                    <li><NavLink to="/teacher/students" className={({ isActive }) => isActive ? "active-link" : ""}>Students</NavLink></li>
                    <li><NavLink to="/teacher/exams" className={({ isActive }) => isActive ? "active-link" : ""}>Exams</NavLink></li>
                    <li><NavLink to="/teacher/welfare" className={({ isActive }) => isActive ? "active-link" : ""}>Welfare</NavLink></li>
                </ul>

                {/* Logout Icon */}
                <button className="logout-button" onClick={handleLogout}>
                    <LogOut size={28} color="#f97316" />
                </button>
            </nav>

            {/* Mobile Dropdown Menu */}
            {menuOpen && (
                <ul className="mobile-nav md:hidden">
                    <li><NavLink to="/teacher/students" onClick={() => setMenuOpen(false)}>Students</NavLink></li>
                    <li><NavLink to="/teacher/exams" onClick={() => setMenuOpen(false)}>Exams</NavLink></li>
                    <li><NavLink to="/teacher/welfare" onClick={() => setMenuOpen(false)}>Welfare</NavLink></li>
                </ul>
            )}

            {/* Main Content */}
            <div className="content-area">
                {/* Show welcome message only on "/teacher" */}
                {location.pathname === "/teacher" && (
                    <h1 className="dashboard-title">Welcome to the Teacher's Dashboard</h1>
                )}

                <Routes>
                    <Route path="students" element={<TeacherStudentspage />} />
                    <Route path="exams" element={<TeacherExamspage />} />
                    <Route path="welfare" element={<TeacherWelfare />} />
                </Routes>
            </div>
        </div>
    );
}

export default TeacherDashboard;