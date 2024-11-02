import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { useState } from 'react';
import { auth, db } from '../firebase/config';
import { doc } from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import { setUser } from '@/features/user/userSlice';

export const useLogin = () => {
  const [error, setError] = useState<string>('');
  const [isPending, setIsPending] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const dispatch = useDispatch();

  const login = async (email: string, password: string) => {
    setError('');
    setIsPending(true);

    if (!email || !password) {
      setError('Пожалуйста, введите email и пароль');
      setIsPending(false);
      return;
    }

    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      if (response) {
        const userDoc = doc(db, 'users', response.user.uid);
        dispatch(setUser(response.user));
        return response;
      } else {
        setError('Не удалось войти');
      }
    } catch (err: any) {
      console.error('Ошибка входа:', err);
      setError(err.message);
    } finally {
      setIsPending(false);
    }
  };

  const resetPassword = async (email: string) => {
    setError('');
    setIsPending(true);

    try {
      await sendPasswordResetEmail(auth, email);
      console.log('Письмо для сброса пароля отправлено на:', email); // Выводим в консоль
      alert('Письмо для сброса пароля отправлено!'); // Уведомляем пользователя
      setIsResettingPassword(false);
    } catch (err: any) {
      console.error('Ошибка сброса пароля:', err);
      setError(err.message);
    } finally {
      setIsPending(false);
    }
  };

  return { 
    error, 
    isPending, 
    login, 
    resetPassword, 
    isResettingPassword, 
    setIsResettingPassword 
  };
};
