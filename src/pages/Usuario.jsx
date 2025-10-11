import { useState } from 'react';
import LoginForm from '../components/auth/LoginForm';
import RegistroForm from '../components/auth/RegistroForm';

export default function Usuario() {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <section className="seccion">
      {showRegister ? (
        <RegistroForm onCancel={() => setShowRegister(false)} />
      ) : (
        <LoginForm onShowRegister={() => setShowRegister(true)} />
      )}
    </section>
  );
}