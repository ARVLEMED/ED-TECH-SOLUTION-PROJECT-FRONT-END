import { useState } from 'react';
import './WelfareManagement.css';

function WelfareManagement() {
    const [studentQuery, setStudentQuery] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [welfareReports, setWelfareReports] = useState([]);
    const [newRemark, setNewRemark] = useState('');
    const [remarkCategory, setRemarkCategory] = useState('Discipline');
    const [activeCategory, setActiveCategory] = useState('All'); // Default to show all reports

    const handleSearchStudent = () => {
        // Mock search: In actual implementation, fetch from API
        setSelectedStudent({ id: 1, name: studentQuery });
        setWelfareReports([
            { category: 'Discipline', remark: 'Late to class' },
            { category: 'Academic', remark: 'Excellent in Mathematics' },
            { category: 'Health', remark: 'Needs a medical checkup' }
        ]);
    };

    const handleAddRemark = () => {
        if (newRemark.trim()) {
            setWelfareReports([...welfareReports, { category: remarkCategory, remark: newRemark }]);
            setNewRemark('');
        }
    };

    // Filter reports based on active category
    const filteredReports = activeCategory === 'All' 
        ? welfareReports 
        : welfareReports.filter(report => report.category === activeCategory);

    return (
        <div className="welfare-container">
            <h2 className="welfare-title">Welfare Management</h2>
            
            {/* Student Search */}
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search student by name..."
                    value={studentQuery}
                    onChange={(e) => setStudentQuery(e.target.value)}
                />
                <button className="search-btn" onClick={handleSearchStudent}>Search</button>
            </div>
            
            {/* Display Student Reports */}
            {selectedStudent && (
                <div className="student-reports">
                    <h3>Welfare Reports for {selectedStudent.name}</h3>
                    
                    {/* Interactive Welfare Categories */}
                    <div className="welfare-categories">
                        <button 
                            className={`welfare-category ${activeCategory === 'All' ? 'active' : ''}`} 
                            onClick={() => setActiveCategory('All')}
                        >
                            All
                        </button>
                        <button 
                            className={`welfare-category ${activeCategory === 'Discipline' ? 'active' : ''}`} 
                            onClick={() => setActiveCategory('Discipline')}
                        >
                            Discipline
                        </button>
                        <button 
                            className={`welfare-category ${activeCategory === 'Academic' ? 'active' : ''}`} 
                            onClick={() => setActiveCategory('Academic')}
                        >
                            Academic
                        </button>
                        <button 
                            className={`welfare-category ${activeCategory === 'Health' ? 'active' : ''}`} 
                            onClick={() => setActiveCategory('Health')}
                        >
                            Health
                        </button>
                    </div>

                    {/* Display Filtered Welfare Reports */}
                    <ul className="welfare-list">
                        {filteredReports.length > 0 ? (
                            filteredReports.map((report, index) => (
                                <li key={index} className="welfare-item">
                                    <span><strong>{report.category}:</strong> {report.remark}</span>
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
                        >
                            <option value="Discipline">Discipline</option>
                            <option value="Academic">Academic</option>
                            <option value="Health">Health</option>
                        </select>
                        <input
                            type="text"
                            placeholder="Enter remark..."
                            value={newRemark}
                            onChange={(e) => setNewRemark(e.target.value)}
                        />
                        <button className="add-remark-btn" onClick={handleAddRemark}>Add Remark</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default WelfareManagement;
