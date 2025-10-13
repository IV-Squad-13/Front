import { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '@/services/AuthService';
import { getMe } from '@/services/UserService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

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
