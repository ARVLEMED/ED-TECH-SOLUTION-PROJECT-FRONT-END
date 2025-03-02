// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import LandingPage from "./Pages/LandingPage"; // Import the LandingPage component
// import LoginPage from "./Pages/LoginPage";
// import RegisterPage from "./Pages/RegisterPage";
// import HomePage from "./Pages/HomePage";
// import StudentProfilePage from "./Pages/StudentProfilePage";
// import WelfareReportsPage from "./Pages/WelfareReportsPage";
// import ResultsPage from "./Pages/ResultsPage";

// const App = () => {
//   return (
//     <Router>
//       <Routes>
//         {/* Landing Page */}
//         <Route path="/" element={<LandingPage />} /> {/* Add this route */}
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/register" element={<RegisterPage />} />
//         <Route path="/home" element={<HomePage />} />
//         <Route path="/student-profile" element={<StudentProfilePage />} />
//         <Route path="/welfare-reports" element={<WelfareReportsPage />} />
//         <Route path="/results" element={<ResultsPage />} />
//       </Routes>
//     </Router>
//   );
// };

// export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./Pages/LandingPage"; // Import the LandingPage component
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import HomePage from "./Pages/HomePage";
import StudentProfilePage from "./Pages/StudentProfilePage";
import WelfareReportsPage from "./Pages/WelfareReportsPage";
import ResultsPage from "./Pages/ResultsPage";

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
      </Routes>
    </Router>
  );
};

export default App;
