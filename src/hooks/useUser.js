import { useContext } from 'react';
import UserContext from '../context/ContextUsuario'; 

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser debe ser usado dentro de un UserProvider');
  }

  const { user, isLoggedIn, login, logout, register, updateUser } = context;

  const getUserRole = () => user?.role || null;
  
  const isAdmin = () => isLoggedIn && user?.role === 'admin';

  const isUser = () => isLoggedIn && user?.role === 'customer';
  
  return {
    user,
    isLoggedIn,
    login,
    logout,
    register,
    updateUser,
    getUserRole,
    isAdmin,     
    isUser       
  };
};