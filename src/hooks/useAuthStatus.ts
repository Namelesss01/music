import { useState, useEffect } from "react";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";

interface AuthStatus {
  isLoggedIn: boolean;
  userType: string | null; // Can be 'admin', 'student', etc., or null if not available
  userUid: string | null;
  loading: boolean;
  guitarAccess: boolean;
  vocalAccess: boolean;
}

export const useAuthStatus = () => {
  const [authStatus, setAuthStatus] = useState<AuthStatus>({
    isLoggedIn: false,
    userType: null, // Initial value is null
    userUid: null,
    loading: true,
    guitarAccess: false,
    vocalAccess: false,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), async (user) => {
      if (user) {
        const uid = user.uid;

        try {
          // Fetch user details from Firestore
          const userDoc = await getDoc(doc(db, "users", uid));

          if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log("User Data:", userData); // Debug fetched data

            setAuthStatus({
              isLoggedIn: true,
              userType: userData.userType || null, // Ensures userType is either string or null
              userUid: uid,
              loading: false,
              guitarAccess: userData.guitarAccess || false,
              vocalAccess: userData.vocalAccess || false,
            });
          } else {
            console.error("User document not found in Firestore.");
            setAuthStatus({
              isLoggedIn: false,
              userType: null,
              userUid: null,
              loading: false,
              guitarAccess: false,
              vocalAccess: false,
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setAuthStatus((prev) => ({
            ...prev,
            loading: false,
          }));
        }
      } else {
        setAuthStatus({
          isLoggedIn: false,
          userType: null,
          userUid: null,
          loading: false,
          guitarAccess: false,
          vocalAccess: false,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return authStatus;
};
