import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStatus } from "./hooks/useAuthStatus";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedUserType?: string; // "admin" or "student"
  requiredAccess?: "gitareAccess" | "vocalAccess"; // Required access attribute for students
}

const ProtectedRoute = ({
  children,
  allowedUserType,
  requiredAccess,
}: ProtectedRouteProps) => {
  const { isLoggedIn, userType, gitareAccess, vocalAccess, loading } =
    useAuthStatus();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }

  if (userType === "admin") {
    return <>{children}</>; // Admin has access to all routes
  }

  if (allowedUserType === "student" && userType === "student") {
    if (requiredAccess === "gitareAccess" && !gitareAccess) {
      return <Navigate to="/account" />;
    }
    if (requiredAccess === "vocalAccess" && !vocalAccess) {
      return <Navigate to="/account" />;
    }
  }

  // Prevent students from accessing /account-admin
  if (allowedUserType === "admin" && userType === "student") {
    return <Navigate to="/account" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
