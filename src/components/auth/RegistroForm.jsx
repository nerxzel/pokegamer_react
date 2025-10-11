export default function RegistroForm({ onCancel }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos de registro enviados");
  };

  return (
    <div style={{ maxWidth: '420px', margin: '0 auto' }}>
      <h2>Registro de Usuario</h2>
      <p>Completa tus datos para crear tu cuenta.</p>
      <hr />
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label htmlFor="nombre">Nombre completo:</label>
            <input type="text" id="nombre" name="nombre" required />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label htmlFor="correo-reg">Correo electrónico:</label>
            <input type="email" id="correo-reg" name="correo-reg" required />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label htmlFor="password-reg">Contraseña:</label>
            <input type="password" id="password-reg" name="password-reg" required />
        </div>

        <div style={{ display: 'flex', gap: '.6em' }}>
            <button className="Producto-Comprar-Boton" type="submit">Registrarse</button>
            <button
              type="button"
              className="Producto-Comprar-Boton"
              onClick={onCancel}
              style={{ background: '#633' }}
            >
              Cancelar
            </button>
        </div>
      </form>
    </div>
  );
}