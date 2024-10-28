import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useState } from 'react';
import { auth, db } from '../firebase/config';
import { doc, setDoc } from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import { setUser } from '@/features/user/userSlice';

interface SignupProps {
  email: string;
  password: string;
  displayName: string;
}

export const useSignup = () => {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState<boolean>(false);
  const dispatch = useDispatch();

  const signup = async ({ email, password, displayName }: SignupProps) => {
    setError(null);
    setIsPending(true);

    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);

      if (!response) {
        throw new Error('Не получилось создать пользователя');
      }

      await updateProfile(response.user, { displayName });

      await setDoc(doc(db, 'users', response.user.uid), {
        online: true,
        displayName,
      });

      dispatch(setUser(response.user));
      return response;
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsPending(false);
    }
  };

  return { error, isPending, signup };
};