import { createContext, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage'; 

const UserContext = createContext();

const INITIAL_MOCK_USERS = [
{ id: 1, email: "comprador1@tienda.com", password: "password123", nombre: "Comprador Mock", role: "USER" },
{ id: 2, email: "test@tienda.com", password: "securepassword", nombre: "Test User", role: "ADMIN"},
];

export const UserProvider = ({ children }) => {
const [user, setUser] = useLocalStorage('currentUser', null);
const [mockUsers, setMockUsers] = useLocalStorage('mockRegisteredUsers', INITIAL_MOCK_USERS);

const isLoggedIn = !!user;

const login = async (email, password) => {
    await new Promise(resolve => setTimeout(resolve, 1000)); 

    const foundUser = mockUsers.find(
      u => u.email === email && u.password === password
    );

    if (foundUser) {
      const userData = { 
          id: foundUser.id, 
          email: foundUser.email, 
          nombre: foundUser.nombre, 
          role: foundUser.role 
      };
      setUser(userData);
      return { success: true, user: userData };
    } else {
      throw new Error("Credenciales inválidas");
    }
  };

  const register = async (nombre, email, password) => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const exists = mockUsers.some(u => u.email === email);
    if (exists) {
      throw new Error("El correo electrónico ya está registrado.");
    }

    const newUser = {
      id: Date.now(), 
      nombre,
      email,
      password, 
      role: "USER" 
    };

    setMockUsers(prevUsers => [...prevUsers, newUser]);

    const userData = { 
      id: newUser.id, 
      email: newUser.email, 
      nombre: newUser.nombre, 
      role: newUser.role 
    };
    setUser(userData); 

    return { success: true, user: userData };
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