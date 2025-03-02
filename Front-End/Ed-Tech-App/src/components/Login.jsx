import React from "react";
import { Link, useNavigate } from "react-router-dom";
import LandingNavbar from "../components/LandingNavbar"; // Import the reusable navbar
import "../Styles/Authentication.css";
import logo from "../assets/logo.png";

const Login = () => {
  const navigate = useNavigate(); // Initialize navigation

  const handleLogin = (e) => {
    e.preventDefault(); // Prevent form submission reload
    navigate("/home"); // Redirect to HomePage
  };

  return (
    <div className="auth-container">
      {/* Add the LandingNavbar */}
      <LandingNavbar />

      <div className="auth-box">
        {/* School Logo at the top */}
        <div className="logo-container">
          <img src={logo} alt="School Logo" className="school-logo" />
        </div>

        {/* Ensure this paragraph is present */}
        <p>Please enter your email and password to login.</p>

        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <button type="submit">Login</button>
        </form>

        <p className="bottom">
          Don't have an account?
          <Link to="/register" className="link-text">
            {" "}
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
