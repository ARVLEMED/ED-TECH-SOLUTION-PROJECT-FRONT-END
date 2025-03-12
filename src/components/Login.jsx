import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import LandingNavbar from "../components/LandingNavbar";
import "../Styles/Authentication.css";
import logo from "../assets/logo.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginData, setLoginData] = useState(null);
  const navigate = useNavigate();

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (token && user.role) {
      redirectByRole(user.role.toLowerCase());
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("https://ed-tech-solution-project-back-end.onrender.com/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Invalid email or password." }));
        throw new Error(errorData.message || "Login failed. Please try again.");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setLoginData(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const redirectByRole = (role) => {
    switch (role) {
      case "parent":
        navigate("/home");
        break;
      case "teacher":
        navigate("/teacher");
        break;
      case "admin":
        navigate("/admin/exams");
        break;
      default:
        navigate("/");
    }
  };

  useEffect(() => {
    if (loginData) {
      redirectByRole(loginData.user.role.toLowerCase());
    }
  }, [loginData]);

  return (
    <div className="auth-container">
      <LandingNavbar />
      <div className="auth-box">
        <div className="logo-container">
          <img src={logo} alt="School Logo" className="school-logo" />
        </div>
        <h2 className="auth-title">Login</h2>
        <p>Please enter your email and password to login.</p>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleLogin}>
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
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="bottom">
          Don't have an account?{" "}
          <Link to="/register" className="link-text">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;