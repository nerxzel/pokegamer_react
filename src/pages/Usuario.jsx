import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import LoginForm from '../components/auth/LoginForm';
import RegistroForm from '../components/auth/RegistroForm';

export default function Usuario() {
  const [showRegister, setShowRegister] = useState(false);

  const { isLoggedIn } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/perfil'); 
    }
  }, [isLoggedIn, navigate]);

return (
    <section className="seccion">
     
      {isLoggedIn ? (
        <div className="text-center my-5">Redirigiendo a tu perfil...</div>
      ) : showRegister ? (
        <RegistroForm onCancel={() => setShowRegister(false)} />
      ) : (
        <LoginForm onShowRegister={() => setShowRegister(true)} />
      )}
    </section>
  );
}