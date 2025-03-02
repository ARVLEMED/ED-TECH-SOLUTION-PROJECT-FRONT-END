
import Dashboard from "./Dashboard";
import StudentsPage from "./Studentspage";
import ExamsPage from "./Examspage";
import WelfarePage from "./Welfare";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./Pages/LandingPage"; // Import the LandingPage component
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import HomePage from "./Pages/HomePage";
import StudentProfilePage from "./Pages/StudentProfilePage";
import WelfareReportsPage from "./Pages/WelfareReportsPage";
import ResultsPage from "./Pages/ResultsPage";
import Dashboard from '../components/Dashboard';


const App = () => {
  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} /> {/* Add this route */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<HomePage />} />
        {/* Student Profile Page with studentId parameter */}
  {/* Directly load the dashboard as the home page */}
        <Route path="/" element={<Dashboard />}>
          <Route index element={<h1 className="text-2xl font-bold">Teacher's Dashboard</h1>} />
          <Route path="students" element={<StudentsPage />} />
          <Route path="exams" element={<ExamsPage />} />
          <Route path="welfare" element={<WelfarePage />} />
        <Route
          path="/student-profile/:studentId"
          element={<StudentProfilePage />}
        />
        {/* Welfare Reports Page with studentId parameter */}
        <Route
          path="/welfare-reports/:studentId"
          element={<WelfareReportsPage />}
        />
        {/* Results Page with studentId parameter */}
        <Route path="/results/:studentId" element={<ResultsPage />} />
        {/* Redirect from "/" to "/admin" */}
        <Route path="/" element={<Navigate to="/admin" />} />
                <Route path="/admin/*" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};
export default App;
