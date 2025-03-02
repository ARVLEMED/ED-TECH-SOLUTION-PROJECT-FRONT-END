import React from "react";
import { Link } from "react-router-dom";
import LandingNavbar from "../components/LandingNavbar"; // Import the reusable navbar
import "../Styles/Authentication.css";
import logo from "../assets/logo.png";

const Register = () => {
  return (
    <div className="auth-container">
      {/* Add the LandingNavbar */}
      <LandingNavbar />

      <div className="auth-box">
        {/* School Logo at the top */}
        <div className="logo-container">
          <img src={logo} alt="School Logo" className="school-logo" />
        </div>

        <p>
          Already have an account?
          <Link to="/login" className="link-text">
            {" "}
            Login
          </Link>{" "}
          {/* Use Link to navigate to the Login page */}
        </p>

        <form>
          <select required>
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="user">Parent</option>
          </select>
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <input type="password" placeholder="Confirm Password" required />
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
