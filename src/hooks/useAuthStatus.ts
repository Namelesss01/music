import { useEffect, useState } from "react";
import { auth, db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";

export const useAuthStatus = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setIsLoggedIn(true);
        // Fetch the user type from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        setUserType(userDoc.data()?.userType || null);
      } else {
        setIsLoggedIn(false);
        setUserType(null);
      }
    });
    return unsubscribe;
  }, []);

  return { isLoggedIn, userType };
};
