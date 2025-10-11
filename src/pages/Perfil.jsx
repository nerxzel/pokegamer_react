import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser'

export default function Perfil() {

  const { user, isLoggedIn, logout } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/usuario');
    }
  }, [isLoggedIn, navigate]);

   const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  if (!user) {
    return null; 
  }

  return (
    <section id="info-entrenador" className="seccion">
      <h2>Bienvenido, {user?.email}</h2>
      <p>Aquí puedes ver los datos de tu cuenta.</p>
      
      <ul>
        <li><strong>Email:</strong> {user?.email || '-'}</li>
      </ul>

      <div style={{ marginTop: '1.5em' }}>
        <button onClick={handleLogout} className="Producto-Comprar-Boton">
          Cerrar Sesión
        </button>
      </div>
    </section>
  );
}