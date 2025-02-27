import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import './ExamManagement.css';

function ExamManagement() {
    const [exams, setExams] = useState([
        { id: 1, name: "CAT 1", term: "Term 1", date: "2025-02-23" },
        { id: 2, name: "Mid Term", term: "Term 2", date: "2025-02-23" },
        { id: 3, name: "End of Term", term: "Term 3", date: "2025-02-23" }
    ]);
    
    const [showForm, setShowForm] = useState(false);
    const [newExam, setNewExam] = useState({ name: "", term: "", date: "" });
    const [editingExam, setEditingExam] = useState(null);

    const handleInputChange = (e) => {
        setNewExam({ ...newExam, [e.target.name]: e.target.value });
    };

    const addExam = () => {
        if (editingExam) {
            // Update existing exam
            setExams(exams.map(exam => 
                exam.id === editingExam.id ? { ...exam, ...newExam } : exam
            ));
            setEditingExam(null);
        } else {
            // Add new exam
            setExams([...exams, { id: exams.length + 1, ...newExam }]);
        }
        setShowForm(false);
        setNewExam({ name: "", term: "", date: "" });
    };

    const editExam = (exam) => {
        setEditingExam(exam);
        setNewExam(exam);
        setShowForm(true);
    };

    const deleteExam = (id) => {
        setExams(exams.filter(exam => exam.id !== id));
    };

    return (
        <div className="exam-container">
            <h2 className="exam-title">Exam Management</h2>
            
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
                    <input type="text" name="name" placeholder="Exam Name" value={newExam.name} onChange={handleInputChange} />
                    <input type="text" name="term" placeholder="Term (e.g., Term 1)" value={newExam.term} onChange={handleInputChange} />
                    <input type="date" name="date" value={newExam.date} onChange={handleInputChange} />
                    <button onClick={addExam}>{editingExam ? "Update Exam" : "Save Exam"}</button>
                </div>
            )}

            <ul className="exam-list">
                {exams.map((exam) => (
                    <li key={exam.id} className="exam-item">
                        <div>
                            <strong>{exam.name}</strong> <br />
                            <small>Term: {exam.term}</small> <br />
                            <small>Created on: {exam.date}</small>
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
                ))}
            </ul>
        </div>
    );
}

export default ExamManagement;
