import { Navigate } from "react-router-dom";
import { isLoggedIn, isAdmin } from "../utils/auth";
import React from "react"; // ✅ required for React.memo
/**
 * ProtectedRoute component
 * 
 * @param {JSX.Element} children - The component to render if authorized
 * @param {boolean} adminOnly - Whether this route is only for admin users
 */
function ProtectedRoute({ children, adminOnly = false }) {
  // 1️⃣ Check if user is logged in
  if (!isLoggedIn()) {
    return <Navigate to="/signin" replace />;
  }

  // 2️⃣ If route is admin-only but user is not admin
  if (adminOnly && !isAdmin()) {
    return <Navigate to="/productpage" replace />;
  }

  // 3️⃣ Otherwise allow access
  return children;
}

export default React.memo(ProtectedRoute);
