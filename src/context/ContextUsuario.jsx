import { createContext, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import api from '../api/axiosConfig';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage('currentUser', null);

  const isLoggedIn = !!user;

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user: userData, token } = response.data;
      setUser({ ...userData, token });

      return { success: true, user: userData };

    } catch (error) {
      const msg = error.response?.data?.message || "Error al conectar con el servidor";
      throw new Error(msg);
    }
  };

  const register = async (name, email, password) => {

    try {
      const response = await api.post('/auth/register', { name, email, password })
      const { user: userData, token } = response.data;
      setUser({ ...userData, token });
      return { success: true, user: userData };
    } catch (error) {
      const msg = error.response?.data?.message || "Error en el registro";
      throw new Error(msg);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = (data) => {
    setUser(currentUser => (currentUser ? { ...currentUser, ...data } : null));
  };

  const value = useMemo(() => ({
    user,
    isLoggedIn,
    login,
    register,
    logout,
    updateUser,
  }), [user, isLoggedIn]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;