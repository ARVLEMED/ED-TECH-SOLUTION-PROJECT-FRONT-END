import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './WelfareManagement.css';
import { fetchWithAuth } from '../src/utils/api'; // Import fetchWithAuth

function WelfareManagement() {
    const navigate = useNavigate();
    const [studentQuery, setStudentQuery] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [welfareReports, setWelfareReports] = useState([]);
    const [newRemark, setNewRemark] = useState('');
    const [remarkCategory, setRemarkCategory] = useState('Discipline');
    const [activeCategory, setActiveCategory] = useState('Discipline');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [students, setStudents] = useState([]);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (!localStorage.getItem("token") || user.role !== "admin") {
            setError("Unauthorized access. Please log in as an admin.");
            navigate("/login");
            return;
        }

        const fetchStudents = async () => {
            setLoading(true);
            setError('');
            try {
                const data = await fetchWithAuth("students");
                setStudents(data || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, [navigate]);

    useEffect(() => {
        if (selectedStudent) {
            fetchWelfareReports(selectedStudent.id, activeCategory);
        }
    }, [selectedStudent, activeCategory]);

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

    const fetchWelfareReports = async (studentId, category) => {
        setLoading(true);
        setError('');
        try {
            const data = await fetchWithAuth(`students/${studentId}/welfare_reports?category=${encodeURIComponent(category)}`);
            setWelfareReports(data || []);
        } catch (err) {
            console.error("Error fetching welfare reports:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddRemark = async () => {
        if (!newRemark.trim() || !selectedStudent) {
            setError("Please enter a remark and select a student.");
            return;
        }

        setLoading(true);
        setError('');
        try {
            await fetchWithAuth("welfare_reports", {
                method: "POST",
                body: JSON.stringify({
                    student_id: selectedStudent.id,
                    remarks: newRemark,
                    category: remarkCategory,
                    deleted_at: null,
                }),
            });

            fetchWelfareReports(selectedStudent.id, activeCategory);
            setNewRemark('');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!localStorage.getItem("token") || JSON.parse(localStorage.getItem("user") || "{}").role !== "admin") {
        navigate("/login");
        return null;
    }

    return (
        <div className="welfare-container">
            <h2 className="welfare-title">Welfare Management</h2>

            {error && <p className="error-msg">{error}</p>}

            {/* Student Search */}
            <div className="search-container">
                <input
                    type="text"
                    name="search-container"
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
                    <h3 style={{ color: "#004080" }}>Welfare Reports for {selectedStudent.name}</h3>

                    {/* Interactive Welfare Categories */}
                    <div className="welfare-categories">
                        {['Discipline', 'Academic', 'Health'].map((category) => (
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

                    {/* Display Welfare Reports */}
                    <ul className="welfare-list">
                        {welfareReports.length > 0 ? (
                            welfareReports.map((report, index) => (
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
                            name="enter-remark"
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