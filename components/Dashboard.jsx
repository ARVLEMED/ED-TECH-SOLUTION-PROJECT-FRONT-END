import { useState, useEffect } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
import './dashboard.css';
import { getToken } from './Auth';

// Importing pages
import ExamManagement from './Exammanagement';
import WelfareManagement from './WelfareManagement';
import TeacherManagement from './TeacherManagement';
import StudentManagement from './StudentManagement';
import ClassManagement from './ClassManagement';
import PromoteStudents from './PromoteStudents';

function Dashboard() {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    // Check authentication on mount
    useEffect(() => {
        const token = getToken();
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (!token || user.role !== "admin") {
            navigate('/login'); // Redirect to login if not authenticated or not admin
        }
    }, [navigate]);

    // Logout handler
    const handleLogout = () => {
        localStorage.removeItem('token'); // Clear token
        localStorage.removeItem('user');  // Clear user data
        navigate('/login'); // Redirect to login page
    };

    // Redirect if not authenticated on render
    const token = getToken();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!token || user.role !== "admin") {
        return null; // Render nothing while redirecting
    }

    return (
        <div className="dashboard-container">
            {/* Top Navbar */}
            <nav className="top-navbar">
                <button className="menu-button md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>

                <h1 className="logo">Admin Portal</h1>

                {/* Desktop Navigation */}
                <ul className="nav-links md:flex hidden">
                    <li><NavLink to="/admin/exams" className="active">Exams</NavLink></li>
                    <li><NavLink to="/admin/welfare" className="active">Welfare Management</NavLink></li>
                    <li><NavLink to="/admin/teachers" className="active">Teachers</NavLink></li>
                    <li><NavLink to="/admin/students" className="active">Students</NavLink></li>
                    <li><NavLink to="/admin/classes" className="active">Classes</NavLink></li>
                    <li><NavLink to="/admin/promote-students" className="active">Promote Students</NavLink></li>
                </ul>

                {/* Logout Icon */}
                <button className="logout-button" onClick={handleLogout}>
                    <LogOut size={28} color="#f97316" />
                </button>
            </nav>

            {/* Mobile Dropdown Menu */}
            {menuOpen && (
                <ul className="mobile-nav md:hidden">
                    <li><NavLink to="/admin/exams" onClick={() => setMenuOpen(false)}>Exams</NavLink></li>
                    <li><NavLink to="/admin/welfare" onClick={() => setMenuOpen(false)}>Welfare Management</NavLink></li>
                    <li><NavLink to="/admin/teachers" onClick={() => setMenuOpen(false)}>Teachers</NavLink></li>
                    <li><NavLink to="/admin/students" onClick={() => setMenuOpen(false)}>Students</NavLink></li>
                    <li><NavLink to="/admin/classes" onClick={() => setMenuOpen(false)}>Classes</NavLink></li>
                    <li><NavLink to="/admin/promote-students" onClick={() => setMenuOpen(false)}>Promote Students</NavLink></li>
                </ul>
            )}

            {/* Main Content */}
            <main className="main-content">
                <Routes>
                    <Route path="exams" element={<ExamManagement />} />
                    <Route path="welfare" element={<WelfareManagement />} />
                    <Route path="teachers" element={<TeacherManagement />} />
                    <Route path="students" element={<StudentManagement />} />
                    <Route path="classes" element={<ClassManagement />} />
                    <Route path="promote-students" element={<PromoteStudents />} />
                </Routes>
            </main>
        </div>
    );
}

export default Dashboard;