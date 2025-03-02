import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import "./assets/styles/Dashboard.css";
function Dashboard() {
  const location = useLocation();

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="content-area">
        {/* Show welcome message only when at "/dashboard" */}
        {location.pathname === "/dashboard" && (
          <h1 className="dashboard-title">Welcome to the Teacher's Dashboard</h1>
        )}
        <Outlet />
      </div>
    </div>
  );
}

export default Dashboard;
