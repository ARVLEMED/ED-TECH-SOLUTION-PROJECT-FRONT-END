import React from "react";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa"; // Icons for contact details
import "../Styles/LandingPage.css"; // Import CSS file
import logo from "../assets/logo.png";
import graduation from "../assets/graduation.jpeg";
const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Header */}
      <header className="navbar">
        <img src={logo} alt="School Logo" className="logo" />
        <div className="nav-links">
          <a href="/login" className="nav-link">
            Login
          </a>
          <a href="/register" className="nav-link">
            Sign Up
          </a>
        </div>
      </header>

      {/* Main Section - Hero Image */}
      <main className="hero-section">
        <img src={graduation} alt="Graduation" className="hero-image" />
      </main>

      {/* Footer */}
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
