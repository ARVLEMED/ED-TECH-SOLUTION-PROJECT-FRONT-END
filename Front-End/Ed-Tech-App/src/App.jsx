import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import StudentsPage from "./Studentspage";
import ExamsPage from "./Examspage";
import WelfarePage from "./Welfare";

function App() {
  return (
    <Router>
      <Routes>
        {/* Directly load the dashboard as the home page */}
        <Route path="/" element={<Dashboard />}>
          <Route index element={<h1 className="text-2xl font-bold">Teacher's Dashboard</h1>} />
          <Route path="students" element={<StudentsPage />} />
          <Route path="exams" element={<ExamsPage />} />
          <Route path="welfare" element={<WelfarePage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
