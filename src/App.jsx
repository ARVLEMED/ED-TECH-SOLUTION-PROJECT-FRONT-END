import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./Pages/LandingPage";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import ParentHomePage from "./Pages/ParentHomePage";
import ParentStudentProfilePage from "./Pages/ParentStudentProfilePage";
import WelfareReportsPage from "./Pages/WelfareReportsPage";
import ParentResultsPage from "./Pages/ParentResultsPage";
import Dashboard from "../components/Dashboard";
import TeacherDashboard from "./Pages/TeacherDashboard";
import ProtectedRoute from "../components/ProtectedRoutes";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Parent Routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute allowedRoles={["parent"]}>
              <ParentHomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student-profile/:studentId"
          element={
            <ProtectedRoute allowedRoles={["parent"]}>
              <ParentStudentProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/parent/results/:studentId"
          element={
            <ProtectedRoute allowedRoles={["parent"]}>
              <ParentResultsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/parent/welfare-reports/:studentId"
          element={
            <ProtectedRoute allowedRoles={["parent"]}>
              <WelfareReportsPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Teacher Routes */}
        <Route
          path="/teacher/*"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />

        {/* Redirect unknown routes to Landing Page */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;