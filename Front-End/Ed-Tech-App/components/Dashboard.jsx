import { useState } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
import './dashboard.css';

// Importing pages
import ExamManagement from './Exammanagement';
import WelfareManagement from './WelfareManagement';
import TeacherManagement from './TeacherManagement';
import StudentManagement from './StudentManagement';

function Dashboard() {
    const [menuOpen, setMenuOpen] = useState(false);

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
                    <li><NavLink to="/admin/exams" activeClassName="active">Exams</NavLink></li>
                    <li><NavLink to="/admin/welfare" activeClassName="active">Welfare Management</NavLink></li>
                    <li><NavLink to="/admin/teachers" activeClassName="active">Teachers</NavLink></li>
                    <li><NavLink to="/admin/students" activeClassName="active">Students</NavLink></li>
                </ul>

                {/* Logout Icon */}
                <button className="logout-button">
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
                </ul>
            )}

            {/* Main Content */}
            <main className="main-content">
                <Routes>
                    <Route path="exams" element={<ExamManagement />} />
                    <Route path="welfare" element={<WelfareManagement />} />
                    <Route path="teachers" element={<TeacherManagement />} />
                    <Route path="students" element={<StudentManagement />} />
                </Routes>
            </main>
        </div>
    );
}

export default Dashboard;
