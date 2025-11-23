import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '@/services/AuthService';
import { getMe } from '@/services/UserService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user])

  useEffect(() => {
  const stored = localStorage.getItem('user');
  if (!stored) return;

  (async () => {
    try {
      const me = await getMe();
      setUser(me);
    } catch (err) {
      setUser(null);
      localStorage.removeItem('user');
      navigate('/');
    }
  })();
}, []);

  const login = async (email, password) => {
    try {
      const userData = await loginUser(email, password)
        .then(() => {
          return getMe();
        });
      setUser(userData);
    } catch (error) {
      setUser(null);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    navigate('/');
  };

  const value = { user, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
