import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { auth, db } from '../firebase/config';
import { doc, updateDoc } from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import { setUser } from '@/features/user/userSlice';

export const useLogin = () => {
  const [error, setError] = useState<string>('');
  const [isPending, setIsPending] = useState(false);
  const dispatch = useDispatch();

  const login = async (email: string, password: string) => {
    setError('');
    setIsPending(true);

    try {
      const response = await signInWithEmailAndPassword(auth, email, password);

      if (!response) {
        setError('Не получилось создать пользователя');
      }

      const userDoc = doc(db, 'users', response.user.uid);


      dispatch(setUser(response.user));

      return response;
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsPending(false);
    }
  };

  return { error, isPending, login };
};
