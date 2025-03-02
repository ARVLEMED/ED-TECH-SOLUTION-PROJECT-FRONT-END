import { useState } from 'react';

function CreateExam({ addExam }) {
    const [examName, setExamName] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (examName.trim()) {
            addExam(examName);
            setExamName(""); // Clear input after adding
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input 
                type="text" 
                value={examName} 
                onChange={(e) => setExamName(e.target.value)} 
                placeholder="Enter exam name" 
                required 
            />
            <button type="submit">Add Exam</button>
        </form>
    );
}

export default CreateExam;
