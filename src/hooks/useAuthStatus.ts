// useAuthStatus hook
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";

export const useAuthStatus = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<string | null>(null); // Can be 'admin', 'student', etc.
  const [userUid, setUserUid] = useState<string | null>(null); // Track user UID
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const userData = userSnap.data();
            setUserType(userData?.userType);
            setUserUid(user.uid);
            setIsLoggedIn(true);
          } else {
            console.error("User document not found for UID:", user.uid);
            setIsLoggedIn(false);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { isLoggedIn, userType, userUid, loading };
};
