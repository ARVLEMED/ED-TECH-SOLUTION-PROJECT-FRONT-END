import { useState, useEffect } from "react";
import { Pencil, Trash, X, Search } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import "./TeacherManagement.css";

const TeacherManagement = () => {
    const [teachers, setTeachers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTeacher, setCurrentTeacher] = useState(null);
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Fetch all teachers from the API
    useEffect(() => {
        const fetchTeachers = async () => {
            setLoading(true);
            setError("");
            try {
                const response = await fetch("http://127.0.0.1:5000/api/teachers");
                if (!response.ok) throw new Error("Failed to fetch teachers");
                const data = await response.json();
                setTeachers(data || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTeachers();
    }, []);

    // Open modal for adding/editing a teacher
    const openModal = (teacher = null) => {
        setCurrentTeacher(teacher);
        setFormData(teacher || { name: "", email: "", password: "" });
        setIsModalOpen(true);
    };

    // Close modal
    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentTeacher(null);
        setFormData({ name: "", email: "", password: "" });
    };

    // Handle input changes in the form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Save or update a teacher
    const handleSave = async () => {
        if (!formData.name || !formData.email || (!currentTeacher && !formData.password)) {
            setError("Name, email, and password are required.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const url = currentTeacher
                ? `http://127.0.0.1:5000/api/teachers/${currentTeacher.id}`
                : "http://127.0.0.1:5000/api/teachers";
            const method = currentTeacher ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: formData.name,
                    email: formData.email,
                    password: formData.password,
                }),
            });

            if (!response.ok) throw new Error(`Failed to ${currentTeacher ? "update" : "create"} teacher`);

            const savedTeacher = await response.json();

            if (currentTeacher) {
                setTeachers(teachers.map((t) => (t.id === currentTeacher.id ? savedTeacher : t)));
            } else {
                setTeachers([...teachers, savedTeacher]);
            }

            closeModal();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Delete a teacher
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this teacher?")) {
            setLoading(true);
            setError("");

            try {
                const response = await fetch(`http://127.0.0.1:5000/api/teachers/${id}`, {
                    method: "DELETE",
                });

                if (!response.ok) throw new Error("Failed to delete teacher");

                setTeachers(teachers.filter((t) => t.id !== id));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
    };

    // Filter teachers based on search query
    const filteredTeachers = teachers.filter(
        (teacher) =>
            teacher.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            teacher.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="teacher-management-container">
            <h2>Teacher Management</h2>

            {error && <p className="error-msg">{error}</p>}

            {/* Search and Add Teacher */}
            <div className="search-add-container">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                        id="search-teacher"
                        name="search-teacher"
                    />
                    <Search className="search-icon" size={20} />
                </div>
                <button onClick={() => openModal()} className="add-teacher-btn">
                    <FontAwesomeIcon icon={faUserPlus} className="icon" /> Add Teacher
                </button>
            </div>

            {/* Display Teachers */}
            <ul className="teacher-list">
                {filteredTeachers.map((teacher) => (
                    <li key={teacher.id} className="teacher-item">
                        <span>
                            {teacher.username} - {teacher.email}
                        </span>
                        <div className="action-buttons">
                            <button onClick={() => openModal(teacher)} className="edit-button">
                                <Pencil size={16} />
                            </button>
                            <button onClick={() => handleDelete(teacher.id)} className="delete-button">
                                <Trash size={16} />
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            {/* Add/Edit Teacher Modal */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>{currentTeacher ? "Edit Teacher" : "Add Teacher"}</h3>
                            <button onClick={closeModal} className="close-button">
                                <X size={24} />
                            </button>
                        </div>
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="modal-input"
                            id="teacher-name"
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="modal-input"
                            id="teacher-email"
                        />
                        {!currentTeacher && (
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="modal-input"
                                id="teacher-password"
                            />
                        )}
                        <button onClick={handleSave} className="save-button" disabled={loading}>
                            {loading ? "Saving..." : "Save"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherManagement;