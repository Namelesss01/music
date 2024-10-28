import { signOut } from 'firebase/auth';
import { useState } from 'react';
import { auth, db } from '../firebase/config';
import { doc, updateDoc } from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import { setUser } from '@/features/user/userSlice';

export const useLogout = () => {
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const dispatch = useDispatch();

  const logout = async () => {
    setError(null);
    setIsPending(true);

    try {
      const { uid } = auth.currentUser as any;

      const userDoc = doc(db, 'users', uid);

      await updateDoc(userDoc, { online: false });
      await signOut(auth);

      dispatch(setUser(null));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsPending(false);
    }
  };

  return { error, isPending, logout };
};
