import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStatus } from "./hooks/useAuthStatus";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedUserType?: string; // "admin" or "student"
  requiredAccess?: "guitarAccess" | "vocalAccess"; // Required access attribute for students
  loading?: boolean;
  userUid?: string;
  userType?: string;
  guitarAccess?: boolean;
  vocalAccess?: boolean;
}

const ProtectedRoute = ({
  children,
  allowedUserType,
  requiredAccess,
}: ProtectedRouteProps) => {
  const { isLoggedIn, userType, guitarAccess, vocalAccess, loading } =
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
    if (requiredAccess === "guitarAccess" && !guitarAccess) {
      return <Navigate to="/main" />;
    }
    if (requiredAccess === "vocalAccess" && !vocalAccess) {
      return <Navigate to="/main" />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
