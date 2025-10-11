import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../hooks/useUser'; 

export default function LoginForm({ onShowRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  
  const { login } = useUser();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const mockUserData = {
      nombre: " ",
      email: email,
      // se podrían añadir más datos eventualmente (?)
    };
    
    login(mockUserData);
    
    navigate('/perfil'); 
  };

  return (
    <div style={{ maxWidth: '420px', margin: '0 auto' }}>
      <h2>Inicio de Sesión</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="username">Correo:</label>
          <input
            type="email"
            id="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div style={{ minHeight: '1.2em', fontWeight: 'bold', color: 'red' }}>
          {/* En otro momento añadiré la lógica para manejar los errores de un formulario */}
        </div>
        <button className="Producto-Comprar-Boton" type="submit">Iniciar Sesión</button>
        <button
          type="button"
          className="Producto-Comprar-Boton"
          onClick={onShowRegister} 
          style={{ background: '#178fd6' }}
        >
          Crear cuenta
        </button>
      </form>
    </div>
  );
}