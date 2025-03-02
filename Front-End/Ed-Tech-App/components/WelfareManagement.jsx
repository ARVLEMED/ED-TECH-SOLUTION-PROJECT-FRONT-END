import { useState, useEffect } from 'react';
import './WelfareManagement.css';

function WelfareManagement() {
    const [studentQuery, setStudentQuery] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [welfareReports, setWelfareReports] = useState([]);
    const [newRemark, setNewRemark] = useState('');
    const [remarkCategory, setRemarkCategory] = useState('Discipline');
    const [activeCategory, setActiveCategory] = useState('All');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [students, setStudents] = useState([]);

    // Fetch all students from the backend
    useEffect(() => {
        const fetchStudents = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await fetch("http://127.0.0.1:5000/api/students");
                if (!response.ok) throw new Error("Failed to fetch students");
                const data = await response.json();
                setStudents(data || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    // Fetch welfare reports when a student is selected
    useEffect(() => {
        if (selectedStudent) {
            fetchWelfareReports(selectedStudent.id);
        }
    }, [selectedStudent]);

    // Handle student search
    const handleSearchStudent = () => {
        if (!studentQuery.trim()) {
            setError("Please enter a student name.");
            setSelectedStudent(null);
            setWelfareReports([]);
            return;
        }

        const foundStudent = students.find(student =>
            student.name.toLowerCase().includes(studentQuery.toLowerCase())
        );

        if (!foundStudent) {
            setError("Student not found.");
            setSelectedStudent(null);
            setWelfareReports([]);
            return;
        }

        setSelectedStudent(foundStudent);
    };

    // Fetch welfare reports for the selected student
    const fetchWelfareReports = async (studentId) => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch(`http://127.0.0.1:5000/api/students/${studentId}/welfare_reports`);
            if (!response.ok) throw new Error("Failed to fetch welfare reports");
            const data = await response.json();
            setWelfareReports(data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Handle adding a new welfare report
    const handleAddRemark = async () => {
        if (!newRemark.trim() || !selectedStudent) {
            setError("Please enter a remark and select a student.");
            return;
        }

        setLoading(true);
        setError('');
        try {
            const response = await fetch("http://127.0.0.1:5000/api/welfare_reports", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    student_id: selectedStudent.id,
                    teacher_id: 1, // Replace with the actual teacher ID
                    remarks: newRemark,
                    category: remarkCategory,
                }),
            });

            if (!response.ok) throw new Error("Failed to add welfare report");

            // Refresh the welfare reports
            fetchWelfareReports(selectedStudent.id);
            setNewRemark('');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Filter reports based on active category
    const filteredReports = activeCategory === 'All'
        ? welfareReports
        : welfareReports.filter(report => report.category === activeCategory);

    return (
        <div className="welfare-container">
            <h2 className="welfare-title">Welfare Management</h2>

            {error && <p className="error-msg">{error}</p>}

            {/* Student Search */}
            <div className="search-container">
                <input
                    type="text"
                    name='search-container'
                    placeholder="Search student by name..."
                    value={studentQuery}
                    onChange={(e) => setStudentQuery(e.target.value)}
                    disabled={loading}
                />
                <button className="search-btn" onClick={handleSearchStudent} disabled={loading}>
                    {loading ? "Searching..." : "Search"}
                </button>
            </div>

            {/* Display Student Reports */}
            {selectedStudent ? (
                <div className="student-reports">
                    <h3>Welfare Reports for {selectedStudent.name}</h3>

                    {/* Interactive Welfare Categories */}
                    <div className="welfare-categories">
                        {['All', 'Discipline', 'Academic', 'Health'].map((category) => (
                            <button
                                key={category}
                                className={`welfare-category ${activeCategory === category ? 'active' : ''}`}
                                onClick={() => setActiveCategory(category)}
                                disabled={loading}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Display Filtered Welfare Reports */}
                    <ul className="welfare-list">
                        {filteredReports.length > 0 ? (
                            filteredReports.map((report, index) => (
                                <li key={index} className="welfare-item">
                                    <span><strong>{report.category}:</strong> {report.remarks}</span>
                                </li>
                            ))
                        ) : (
                            <p className="no-reports">No reports available for this category.</p>
                        )}
                    </ul>

                    {/* Add New Remark */}
                    <div className="welfare-form">
                        <select
                            value={remarkCategory}
                            onChange={(e) => setRemarkCategory(e.target.value)}
                            disabled={loading}
                        >
                            <option value="Discipline">Discipline</option>
                            <option value="Academic">Academic</option>
                            <option value="Health">Health</option>
                        </select>
                        <input
                            type="text"
                            name='enter-remark'
                            placeholder="Enter remark..."
                            value={newRemark}
                            onChange={(e) => setNewRemark(e.target.value)}
                            disabled={loading}
                        />
                        <button className="add-remark-btn" onClick={handleAddRemark} disabled={loading}>
                            {loading ? "Adding..." : "Add Remark"}
                        </button>
                    </div>
                </div>
            ) : (
                <p className="no-student">No student selected.</p>
            )}
        </div>
    );
}

export default WelfareManagement;