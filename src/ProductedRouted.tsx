import { Navigate } from "react-router-dom";
import { useAuthStatus } from "./hooks/useAuthStatus"; // Импортируйте ваш хук для проверки статуса аутентификации

const ProtectedRoute = ({ children, allowedUserType }) => {
  const { isLoggedIn, userType } = useAuthStatus();

  // Если пользователь не вошёл в систему, перенаправьте на страницу входа или главную
  if (!isLoggedIn) {
    return <Navigate to="/main" />;
  }

  // Если тип пользователя не совпадает с разрешённым, перенаправьте
  if (userType !== allowedUserType) {
    return <Navigate to="#" />;
  }

  return children; // Возвращаем детей, если проверка пройдена
};

export default ProtectedRoute;
