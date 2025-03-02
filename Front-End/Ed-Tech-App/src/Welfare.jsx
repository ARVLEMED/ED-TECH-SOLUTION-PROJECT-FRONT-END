import { useState } from "react";
import "./assets/styles/Welfare.css";

function Welfare() {
  const [selectedTab, setSelectedTab] = useState("Academic");
  const [welfareData, setWelfareData] = useState({
    Academic: "",
    Health: "",
    Discipline: "",
  });

  const [studentInfo, setStudentInfo] = useState({
    name: "",
    admissionNumber: "",
  });

  const handleTextareaChange = (e) => {
    setWelfareData({
      ...welfareData,
      [selectedTab]: e.target.value,
    });
  };

  const handleStudentInfoChange = (e) => {
    setStudentInfo({
      ...studentInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    console.log("Student Info:", studentInfo);
    console.log("Saved Data:", welfareData);
    alert(`${selectedTab} welfare details saved successfully!`);
  };

  return (
    <div className="welfare-container">
      <h2 className="welfare-title">Student's Welfare</h2>

      <div className="student-info">
        <input
          type="text"
          name="name"
          className="editable-field"
          placeholder="Enter Student's Name"
          value={studentInfo.name}
          onChange={handleStudentInfoChange}
        />
        <input
          type="text"
          name="admissionNumber"
          className="editable-field"
          placeholder="Enter Admission Number"
          value={studentInfo.admissionNumber}
          onChange={handleStudentInfoChange}
        />
      </div>

      <div className="tab-buttons">
        {["Academic", "Health", "Discipline"].map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`tab-button ${selectedTab === tab ? "active" : ""}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <textarea
        className="welfare-textarea"
        placeholder={`Enter ${selectedTab} welfare details...`}
        value={welfareData[selectedTab]}
        onChange={handleTextareaChange}
      ></textarea>

      <div className="button-container">
        <button className="save-button" onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
}

export default Welfare;
