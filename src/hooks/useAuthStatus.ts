import { useState, useEffect } from "react";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";

export const useAuthStatus = () => {
  const [authStatus, setAuthStatus] = useState({
    isLoggedIn: false,
    userType: null, // Can be 'admin', 'student', etc.
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
              userType: userData.userType || null,
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
