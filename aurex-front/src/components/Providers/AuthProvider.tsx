import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/Auth/useAuth';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { reLogin, loading } = useAuth();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          await reLogin();
        }
      } catch (error) {
        console.log('No valid session found');
      } finally {
        setInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  if (!initialized && loading) {
    return <div>Loading...</div>; // O tu componente de loading
  }

  return <>{children}</>;
};