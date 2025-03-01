import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash, faMagnifyingGlass, faSpinner } from '@fortawesome/free-solid-svg-icons';
import './ExamManagement.css';

function ExamManagement() {
    const [exams, setExams] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [newExam, setNewExam] = useState({ name: "", term: "", date: "" }); // Ensure date is initialized as an empty string
    const [editingExam, setEditingExam] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Fetch exams from the backend
    useEffect(() => {
        fetchExams();
    }, []);

    const fetchExams = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await fetch("http://127.0.0.1:5000/api/exams");
            if (!response.ok) throw new Error("Failed to fetch exams");
            const data = await response.json();
            setExams(data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setNewExam({ ...newExam, [e.target.name]: e.target.value });
    };

    const addOrUpdateExam = async () => {
        if (!newExam.name || !newExam.term || !newExam.date) {
            setError("All fields are required.");
            return;
        }

        setLoading(true);
        setError("");
        try {
            const url = editingExam
                ? `http://127.0.0.1:5000/api/exams/${editingExam.id}`
                : "http://127.0.0.1:5000/api/exams";

            const method = editingExam ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newExam),
            });

            if (!response.ok) throw new Error("Failed to save exam");

            fetchExams(); // Refresh list
            cancelForm();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const editExam = (exam) => {
        setEditingExam(exam);
        setNewExam({ ...exam, date: exam.date || "" }); // Ensure date is always defined
        setShowForm(true);
    };

    const deleteExam = async (id) => {
        if (!window.confirm("Are you sure you want to delete this exam?")) return;
        setLoading(true);
        setError("");
        try {
            const response = await fetch(`http://127.0.0.1:5000/api/exams/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete exam");
            fetchExams(); // Refresh list
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const cancelForm = () => {
        setShowForm(false);
        setEditingExam(null);
        setNewExam({ name: "", term: "", date: "" }); // Reset date to an empty string
    };

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
                        placeholder="Exam Name"
                        value={newExam.name}
                        onChange={handleInputChange}
                        required
                    />
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
                        value={newExam.date || ""} // Ensure value is always defined
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
                                <strong>{exam.name}</strong> <br />
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