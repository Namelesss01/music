import {
  createUserWithEmailAndPassword,
  updateProfile,
  getAuth,
} from "firebase/auth";
import { useState } from "react";
import { db } from "../firebase/config";
import { doc, setDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { setUser } from "../features/user/userSlice";

interface SignupProps {
  email: string;
  password: string;
  displayName: string;
  userType: string; // Add userType
}

export const useSignup = () => {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState<boolean>(false);
  const dispatch = useDispatch();
  const auth = getAuth();

  const signup = async ({
    email,
    password,
    displayName,
    userType,
  }: SignupProps) => {
    setError(null);
    setIsPending(true);
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (!response) {
        throw new Error("Не получилось создать пользователя");
      }

      await updateProfile(response.user, { displayName });

      // Save user data including userType in Firestore
      await setDoc(doc(db, "users", response.user.uid), {
        online: true,
        displayName,
        userType, // Save userType in Firestore
        uid: response.user.uid, // Optionally save the user ID
      });

      dispatch(setUser(response.user));
      return response; // Return the response for further processing
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsPending(false);
    }
  };

  return { error, isPending, signup };
};
