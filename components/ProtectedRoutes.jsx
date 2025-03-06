import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getToken } from "./Auth";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const location = useLocation();
  const token = getToken();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  console.log("ProtectedRoute raw token:", token); // Raw token value
  console.log("ProtectedRoute check:", { token: !!token, role: user.role, allowedRoles, stateToken: location.state?.token });

  if (!token || !user.role || !allowedRoles.includes(user.role)) {
    console.log("Redirecting to /login");
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;