import { useState } from "react";
import { Pencil, Trash, X, Search } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import "./TeacherManagement.css";

const TeacherManagement = () => {
    const [teachers, setTeachers] = useState([
        { id: 1, name: "John Doe", email: "john@example.com", subjects: ["Math"], classes: ["Grade 5"] },
        { id: 2, name: "Jane Smith", email: "jane@example.com", subjects: ["English"], classes: ["Grade 6", "Grade 7"] }
    ]);

    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTeacher, setCurrentTeacher] = useState(null);
    const [formData, setFormData] = useState({ name: "", email: "", subjects: [], classes: [] });

    const subjectsList = ["Math", "Science", "English", "History", "Physics", "Chemistry"];
    const classList = ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8"];

    const openModal = (teacher = null) => {
        setCurrentTeacher(teacher);
        setFormData(teacher || { name: "", email: "", subjects: [], classes: [] });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentTeacher(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubjectAdd = () => {
        const subject = document.getElementById("subjectInput").value.trim();
        if (subject && !formData.subjects.includes(subject)) {
            setFormData({ ...formData, subjects: [...formData.subjects, subject] });
        }
        document.getElementById("subjectInput").value = "";
    };

    const handleClassAdd = () => {
        const selectedClass = document.getElementById("classInput").value.trim();
        if (selectedClass && !formData.classes.includes(selectedClass)) {
            setFormData({ ...formData, classes: [...formData.classes, selectedClass] });
        }
        document.getElementById("classInput").value = "";
    };

    const handleSubjectRemove = (subject) => {
        setFormData({ ...formData, subjects: formData.subjects.filter((s) => s !== subject) });
    };

    const handleClassRemove = (selectedClass) => {
        setFormData({ ...formData, classes: formData.classes.filter((c) => c !== selectedClass) });
    };

    const handleSave = () => {
        if (currentTeacher) {
            setTeachers(teachers.map((t) => (t.id === currentTeacher.id ? { ...formData, id: t.id } : t)));
        } else {
            setTeachers([...teachers, { ...formData, id: Date.now() }]);
        }
        closeModal();
    };

    return (
        <div className="teacher-management-container">
            <h2>Teacher Management</h2>
            <div className="search-add-container">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                    <Search className="search-icon" size={20} />
                </div>
                <button onClick={() => openModal()} className="add-teacher-btn">
                    <FontAwesomeIcon icon={faUserPlus} className="icon" /> Add Teacher
                </button>
            </div>
            <ul className="teacher-list">
                {teachers.map((teacher) => (
                    <li key={teacher.id} className="teacher-item">
                        <span>{teacher.name} - {teacher.email} ({teacher.subjects.join(", ")}) - Classes: {teacher.classes.join(", ")}</span>
                        <div className="action-buttons">
                            <button onClick={() => openModal(teacher)} className="edit-button">
                                <Pencil size={16} />
                            </button>
                            <button className="delete-button">
                                <Trash size={16} />
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>{currentTeacher ? "Edit Teacher" : "Add Teacher"}</h3>
                            <button onClick={closeModal} className="close-button"><X size={24} /></button>
                        </div>
                        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleInputChange} className="modal-input" />
                        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} className="modal-input" />
                        
                        {/* Subjects */}
                        <div className="subject-container">
                            <input list="subjectsList" id="subjectInput" className="modal-input" placeholder="Add Subject" />
                            <datalist id="subjectsList">
                                {subjectsList.map((subject) => (
                                    <option key={subject} value={subject} />
                                ))}
                            </datalist>
                            <button className="add-btn" onClick={handleSubjectAdd}>+</button>
                        </div>
                        <div className="selected-subjects">
                            {formData.subjects.map((subject) => (
                                <span key={subject} className="subject-tag">{subject} <X size={14} onClick={() => handleSubjectRemove(subject)} /></span>
                            ))}
                        </div>

                        {/* Classes */}
                        <div className="class-container">
                            <input list="classList" id="classInput" className="modal-input" placeholder="Add Class" />
                            <datalist id="classList">
                                {classList.map((cls) => (
                                    <option key={cls} value={cls} />
                                ))}
                            </datalist>
                            <button className="add-btn" onClick={handleClassAdd}>+</button>
                        </div>
                        <div className="selected-classes">
                            {formData.classes.map((cls) => (
                                <span key={cls} className="class-tag">{cls} <X size={14} onClick={() => handleClassRemove(cls)} /></span>
                            ))}
                        </div>

                        <button onClick={handleSave} className="save-button">Save</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherManagement;
