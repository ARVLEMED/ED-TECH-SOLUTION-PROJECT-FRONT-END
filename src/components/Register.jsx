import React, { useState, useEffect } from "react"; // Added useEffect
import { Link, useNavigate } from "react-router-dom";
import LandingNavbar from "../components/LandingNavbar";
import "../Styles/Authentication.css";
import logo from "../assets/logo.png";

const Register = () => {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (token && user.role) {
      navigate("/"); // Redirect to home or role-specific page if already logged in
    }
  }, [navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!username || !role || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("https://ed-tech-solution-project-back-end.onrender.com/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          password,
          role,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Registration failed." }));
        throw new Error(errorData.message || "Registration failed. Please try again.");
      }

      await response.json(); // Process response but don’t store token (not typically returned)
      navigate("/login"); // Redirect to login after successful registration
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <LandingNavbar />
      <div className="auth-box">
        <div className="logo-container">
          <img src={logo} alt="School Logo" className="school-logo" />
        </div>
        <h2 className="auth-title">Register</h2>
        <p>
          Already have an account?{" "}
          <Link to="/login" className="link-text">
            Login
          </Link>
        </p>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleRegister}>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={isLoading}
          />
          <label htmlFor="role">Role</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            disabled={isLoading}
          >
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="parent">Parent</option>
            <option value="teacher">Teacher</option>
          </select>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;