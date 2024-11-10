import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStatus } from "./hooks/useAuthStatus";

// Define props type for ProtectedRoute
interface ProtectedRouteProps {
  children: ReactNode;
  allowedUserType: string;
}

const ProtectedRoute = ({ children, allowedUserType }: ProtectedRouteProps) => {
  const { isLoggedIn, userType } = useAuthStatus();

  // Redirect if user is not logged in
  if (!isLoggedIn) {
    return <Navigate to="/main" />;
  }

  // Redirect if user type does not match allowed type
  if (userType !== allowedUserType) {
    return <Navigate to="#" />;
  }

  return <>{children}</>; // Return children if checks pass
};

export default ProtectedRoute;
