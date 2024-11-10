import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export const useAuthStatus = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<string | null>(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true); // добавлено

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        // здесь логика для получения userType
        setUserType(user.email?.includes("admin") ? "admin" : "user"); // пример
      } else {
        setIsLoggedIn(false);
        setUserType(null);
      }
      setIsCheckingStatus(false); // после проверки статуса обновляем флаг
    });

    return () => unsubscribe();
  }, []);

  return { isLoggedIn, userType, isCheckingStatus }; // теперь isCheckingStatus возвращается
};
