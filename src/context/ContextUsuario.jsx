import { createContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const UserContext = createContext(null);
const initialUser = { nombre: '', email: '' };

export function UserProvider({ children }) {
  const [user, setUser] = useLocalStorage('pokegamer_usuario', initialUser);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(initialUser);
  };

  const updateUser = (data) => {
    setUser(currentUser => ({ ...currentUser, ...data }));
  };

  const value = {
    user, 
    isLoggedIn: !!user.nombre,
    login,
    logout,
    updateUser, 
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export default UserContext;