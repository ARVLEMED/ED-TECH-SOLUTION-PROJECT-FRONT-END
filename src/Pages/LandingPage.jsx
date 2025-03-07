import React from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import "../Styles/LandingPage.css";
import logo from "../assets/logo.png";
import graduation from "../assets/graduation.jpeg";

const LandingPage = () => {
  return (
    <div className="landing-page">
      <header className="navbar">
        <img src={logo} alt="School Logo" className="logo" />
        <div className="nav-links">
          <Link to="/login" className="nav-link">
            Login
          </Link>
          <Link to="/register" className="nav-link">
            Sign Up
          </Link>
        </div>
      </header>
      <main className="hero-section">
        <img src={graduation} alt="Graduation" className="hero-image" />
      </main>
      <footer className="footer">
        <div className="contact-info">
          <div className="contact-item">
            <FaEnvelope className="contact-icon" />
            <a href="mailto:tusomeschool@gmail.com">tusomeschool@gmail.com</a>
          </div>
          <div className="contact-item">
            <FaPhone className="contact-icon" />
            <span>0712345678</span>
          </div>
          <div className="contact-item">
            <FaMapMarkerAlt className="contact-icon" />
            <span>P.O. BOX 1234 - 00100, NAIROBI</span>
          </div>
        </div>
        <div className="copyright">
          © 2025 Tusome High School. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
