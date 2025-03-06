import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Added for navigation
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash, faMagnifyingGlass, faSpinner } from '@fortawesome/free-solid-svg-icons';
import '../src/Styles/ExamManagement.css';
import { getToken } from './Auth';

function ExamManagement() {
    const [exams, setExams] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [newExam, setNewExam] = useState({ name: "", form_name: "", term: "", date: "" });
    const [editingExam, setEditingExam] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [forms, setForms] = useState([]);
    const navigate = useNavigate(); // For redirecting on auth failure

    // Fetch exams and forms on mount with auth check
    useEffect(() => {
        const token = getToken();
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (!token || user.role !== "admin") {
            setError("Unauthorized access. Please log in as an admin.");
            navigate("/login");
            return;
        }

        fetchExams();
        fetchForms();
    }, [navigate]);

    const fetchExams = async () => {
        setLoading(true);
        setError("");
        try {
            const token = getToken();
            const response = await fetch("http://127.0.0.1:5000/api/exams", {
                headers: {
                    "Authorization": `Bearer ${token}`, // Add token to headers
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                if (response.status === 401) throw new Error("Unauthorized");
                throw new Error("Failed to fetch exams");
            }
            const data = await response.json();
            setExams(data || []);
        } catch (err) {
            setError(err.message);
            if (err.message === "Unauthorized") navigate("/login");
        } finally {
            setLoading(false);
        }
    };

    const fetchForms = async () => {
        try {
            const token = getToken();
            const response = await fetch("http://127.0.0.1:5000/api/forms", {
                headers: { "Authorization": `Bearer ${token}` },
            });
            if (!response.ok) {
                if (response.status === 401) throw new Error("Unauthorized");
                throw new Error("Failed to fetch forms");
            }
            const data = await response.json();
            setForms(data || []);
        } catch (err) {
            setError(err.message);
            if (err.message === "Unauthorized") navigate("/login");
        }
    };

    const handleInputChange = (e) => {
        setNewExam({ ...newExam, [e.target.name]: e.target.value });
    };

    const addOrUpdateExam = async () => {
        if (!newExam.name || !newExam.form_name || !newExam.term || !newExam.date) {
            setError("All fields are required.");
            return;
        }

        setLoading(true);
        setError("");
        try {
            const token = getToken();
            const url = editingExam
                ? `http://127.0.0.1:5000/api/exams/${editingExam.id}`
                : "http://127.0.0.1:5000/api/exams";
            const method = editingExam ? "PUT" : "POST";

            const payload = {
                name: newExam.name,
                form_name: newExam.form_name,
                term: newExam.term,
                date: new Date(newExam.date).toISOString(),
            };

            const response = await fetch(url, {
                method,
                headers: {
                    "Authorization": `Bearer ${token}`, // Add token
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                if (response.status === 401) throw new Error("Unauthorized");
                throw new Error(errorData.message || "Failed to save exam");
            }

            fetchExams();
            cancelForm();
        } catch (err) {
            setError(err.message);
            if (err.message === "Unauthorized") navigate("/login");
        } finally {
            setLoading(false);
        }
    };

    const editExam = (exam) => {
        setEditingExam(exam);
        setNewExam({
            name: exam.name,
            form_name: exam.form_name || "",
            term: exam.term || "",
            date: exam.date ? exam.date.split('T')[0] : "",
        });
        setShowForm(true);
    };

    const deleteExam = async (id) => {
        if (!window.confirm("Are you sure you want to delete this exam?")) return;
        setLoading(true);
        setError("");
        try {
            const token = getToken();
            const response = await fetch(`http://127.0.0.1:5000/api/exams/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` },
            });
            if (!response.ok) {
                if (response.status === 401) throw new Error("Unauthorized");
                throw new Error("Failed to delete exam");
            }
            fetchExams();
        } catch (err) {
            setError(err.message);
            if (err.message === "Unauthorized") navigate("/login");
        } finally {
            setLoading(false);
        }
    };

    const cancelForm = () => {
        setShowForm(false);
        setEditingExam(null);
        setNewExam({ name: "", form_name: "", term: "", date: "" });
    };

    // Redirect if not authenticated on render
    const token = getToken();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!token || user.role !== "admin") {
        navigate("/login");
        return null;
    }

    return (
        <div className="exam-container">
            <h2 className="exam-title">Exam Management</h2>

            {error && <p className="error-msg">{error}</p>}

            <div className="search-container">
                <input type="text" placeholder="Search Exam..." />
                <button className="search-btn">
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                </button>
            </div>

            <button className="add-exam-btn" onClick={() => setShowForm(true)}>
                Add Exam
            </button>

            {showForm && (
                <div className="exam-form">
                    <input
                        type="text"
                        name="name"
                        placeholder="Exam Name (e.g., CAT 1, Midterm, End Term)"
                        value={newExam.name}
                        onChange={handleInputChange}
                        required
                    />
                    <select
                        name="form_name"
                        value={newExam.form_name}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Select Form</option>
                        {forms.map((form) => (
                            <option key={form.id} value={form.name}>
                                {form.name}
                            </option>
                        ))}
                    </select>
                    <input
                        type="text"
                        name="term"
                        placeholder="Term (e.g., Term 1)"
                        value={newExam.term}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        type="date"
                        name="date"
                        value={newExam.date || ""}
                        onChange={handleInputChange}
                        required
                    />

                    <div className="form-buttons">
                        <button
                            className="form-btn save-btn"
                            onClick={addOrUpdateExam}
                            disabled={loading}
                        >
                            {loading ? (
                                <FontAwesomeIcon icon={faSpinner} spin />
                            ) : editingExam ? (
                                "Update Exam"
                            ) : (
                                "Save Exam"
                            )}
                        </button>
                        <button className="form-btn cancel-btn" onClick={cancelForm}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {loading && <p className="loading-msg">Loading...</p>}

            <ul className="exam-list">
                {exams.length > 0 ? (
                    exams.map((exam) => (
                        <li key={exam.id} className="exam-item">
                            <div>
                                <strong>{exam.form_name} {exam.name}</strong> <br />
                                <small>Term: {exam.term}</small> <br />
                                <small>Created on: {new Date(exam.created_at).toLocaleDateString()}</small>
                            </div>
                            <div className="exam-actions">
                                <button className="edit-btn" onClick={() => editExam(exam)}>
                                    <FontAwesomeIcon icon={faPenToSquare} />
                                </button>
                                <button className="delete-btn" onClick={() => deleteExam(exam.id)}>
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </div>
                        </li>
                    ))
                ) : (
                    <li>No exams found.</li>
                )}
            </ul>
        </div>
    );
}

export default ExamManagement;