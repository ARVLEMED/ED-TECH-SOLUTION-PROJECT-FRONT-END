import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/TeacherWelfare.css";
import { getToken } from "../../components/Auth";

function TeacherWelfare() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("Academic");
  const [welfareData, setWelfareData] = useState({
    Academic: "",
    Health: "",
    Discipline: "",
  });
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [welfareReports, setWelfareReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reportId, setReportId] = useState(null);
  const [showPastReports, setShowPastReports] = useState(false);

  const fetchStudents = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = getToken();
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      if (!token || user.role !== "teacher") {
        throw new Error("Unauthorized: Must be logged in as a teacher");
      }

      const config = {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      const response = await fetch(
        `http://127.0.0.1:5000/api/classes?class_teacher_id=${user.id}`,
        config
      );
      if (!response.ok) {
        if (response.status === 401) throw new Error("Unauthorized");
        throw new Error("Failed to fetch classes");
      }
      const classes = await response.json();

      const studentPromises = classes.map((cls) =>
        fetch(`http://127.0.0.1:5000/api/students?school_class_id=${cls.id}`, config).then((res) => res.json())
      );
      const studentResults = await Promise.all(studentPromises);
      const allStudents = studentResults.flat();
      const uniqueStudents = Array.from(
        new Map(allStudents.map((student) => [student.id, student])).values()
      );
      setStudents(uniqueStudents);
    } catch (err) {
      console.error("Error fetching students:", err);
      setError(err.message);
      setStudents([]);
      if (err.message === "Unauthorized") navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = getToken();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!token || user.role !== "teacher") {
      setError("Unauthorized access. Please log in as a teacher.");
      navigate("/login");
      return;
    }

    fetchStudents();
  }, [navigate]);

  const handleViewPastReports = async () => {
    if (!selectedStudentId) {
      alert("Please select a student first.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = getToken();
      const config = {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      const response = await fetch(
        `http://127.0.0.1:5000/api/students/${selectedStudentId}/welfare_reports?category=${selectedTab}`,
        config
      );
      if (!response.ok) {
        if (response.status === 401) throw new Error("Unauthorized");
        throw new Error(`Failed to fetch ${selectedTab} welfare reports`);
      }
      const reports = await response.json();
      console.log(`Fetched past ${selectedTab} reports:`, reports);
      setWelfareReports(reports);
      setShowPastReports(true);
    } catch (err) {
      console.error("Error fetching past reports:", err);
      setError(err.message);
      setWelfareReports([]);
      if (err.message === "Unauthorized") navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleTextareaChange = (e) => {
    setWelfareData({
      ...welfareData,
      [selectedTab]: e.target.value,
    });
  };

  const handleStudentChange = (e) => {
    setSelectedStudentId(e.target.value);
    setWelfareData({ Academic: "", Health: "", Discipline: "" });
    setWelfareReports([]);
    setReportId(null);
    setShowPastReports(false);
  };

  const handleSave = async () => {
    if (!selectedStudentId) {
      alert("Please select a student.");
      return;
    }

    if (!welfareData[selectedTab].trim()) {
      alert("Please enter welfare remarks.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = getToken();
      const config = {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      const payload = {
        student_id: parseInt(selectedStudentId, 10),
        category: selectedTab,
        remarks: welfareData[selectedTab],
      };
      console.log("Saving welfare report with payload:", payload);

      const url = reportId
        ? `http://127.0.0.1:5000/api/welfare_reports/${reportId}`
        : "http://127.0.0.1:5000/api/welfare_reports";
      const method = reportId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        ...config,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Failed to save welfare data: ${response.status} - ${errorText}`);
        if (response.status === 401) throw new Error("Unauthorized");
        throw new Error(errorText || "Failed to save welfare data");
      }

      const result = await response.json();
      console.log("Save response:", result);
      if (method === "POST") {
        setReportId(result.id);
      }
      alert(`${selectedTab} welfare details saved successfully!`);
      setWelfareData((prev) => ({
        ...prev,
        [selectedTab]: "",
      }));
      setReportId(null);
    } catch (err) {
      console.error("Error saving welfare data:", err);
      setError(err.message);
      if (err.message === "Unauthorized") navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowPastReports(false);
  };

  const token = getToken();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (!token || user.role !== "teacher") {
    navigate("/login");
    return null;
  }

  return (
    <div className="welfare-container">
      <h2 className="welfare-title">Student Welfare Reports</h2>

      <div className="student-selector">
        <label>Select Student: </label>
        <select value={selectedStudentId} onChange={handleStudentChange}>
          <option value="">-- Select a Student --</option>
          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.name} ({student.admission_number})
            </option>
          ))}
        </select>
      </div>

      {loading && <p>Loading...</p>}
      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchStudents} className="retry-button">Retry</button>
        </div>
      )}

      <div className="tab-buttons">
        {["Academic", "Health", "Discipline"].map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`tab-button ${selectedTab === tab ? "active" : ""}`}
            disabled={!selectedStudentId}
          >
            {tab}
          </button>
        ))}
      </div>

      <textarea
        className="welfare-textarea"
        placeholder={
          selectedStudentId
            ? `Enter ${selectedTab} welfare details...`
            : "Select a student to add welfare details"
        }
        value={welfareData[selectedTab]}
        onChange={handleTextareaChange}
        disabled={!selectedStudentId || loading}
      ></textarea>

      <div className="button-container">
        <button
          className="save-button"
          onClick={handleSave}
          disabled={loading || !selectedStudentId}
        >
          {loading ? "Saving..." : "Save"}
        </button>
        <button
          className="view-reports-button"
          onClick={handleViewPastReports}
          disabled={loading || !selectedStudentId}
        >
          View Past {selectedTab} Reports
        </button>
      </div>

      {showPastReports && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">Past {selectedTab} Welfare Reports</h3>
            <div className="report-section">
              {welfareReports.length > 0 ? (
                <table className="welfare-table">
                  <thead>
                    <tr>
                      <th>Remarks</th>
                      <th>Created At</th>
                      <th>Updated At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {welfareReports.map((report) => (
                      <tr key={report.id}>
                        <td>{report.remarks}</td>
                        <td>{new Date(report.created_at).toLocaleString()}</td>
                        <td>{report.updated_at ? new Date(report.updated_at).toLocaleString() : "N/A"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="no-reports">No past {selectedTab} reports found.</p>
              )}
            </div>
            <button className="close-button" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeacherWelfare;