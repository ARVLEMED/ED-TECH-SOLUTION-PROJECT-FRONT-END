import React from "react";
import Navbar from "../components/Homenavbar";
import StudentList from "../components/StudentList";
import "../Styles/HomePage.css";

const HomePage = () => {
  return (
    <div>
      <Navbar />
      <div className="content">
        <StudentList />
      </div>
    </div>
  );
};

export default HomePage;
