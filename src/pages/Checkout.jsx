import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useUser } from '../hooks/useUser'

export default function Checkout() {
  const { cart, clearCart, total: subtotal } = useCart();
  const { user, isLoggedIn } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (cart.length === 0) {
      alert("No hay productos en el carrito para finalizar la compra.");
      navigate('/carrito');
    }
  }, [cart, navigate]);

  const iva = subtotal * 0.19;
  const total = subtotal + iva;

  const handleConfirmPurchase = () => {

    alert('¡Compra confirmada con éxito! Redirigiendo...');
    clearCart();
    setTimeout(() => {
      navigate(isLoggedIn ? '/perfil' : '/');
    }, 1500); 
  };

  return (
    <section className="seccion">
      <h2>Checkout</h2>
      <div style={{ maxWidth: '860px', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

        <div style={{ background: 'rgba(0,0,0,.35)', padding: '1rem', borderRadius: '12px' }}>
          <h3 style={{ marginTop: 0 }}>Resumen de productos</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
            {cart.map(item => (
              <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{item.nombre} x {item.quantity}</span>
                <strong>${(item.precio * item.quantity).toLocaleString()}</strong>
              </li>
            ))}
          </ul>
          <hr style={{ borderColor: 'rgba(255,255,255,.2)', margin: '1rem 0' }} />
          <div style={{ fontSize: '.9rem' }}>
            <p>Subtotal: <strong>${subtotal.toLocaleString()}</strong></p>
            <p>IVA (19%): <strong>${iva.toLocaleString()}</strong></p>
            <p style={{ fontSize: '1.1rem' }}>Total: <strong>${total.toLocaleString()}</strong></p>
          </div>
        </div>

        <div style={{ background: 'rgba(0,0,0,.35)', padding: '1rem', borderRadius: '12px' }}>
          <h3 style={{ marginTop: 0 }}>Datos de envío</h3>
          {isLoggedIn ? (
            <div>
              <p>Nombre: {user.nombre}</p>
              <p>Email: {user.email}</p>
              {/* eventualmente se podrían poner más datos del usuario aquí también */}
            </div>
          ) : (
            <form>
              <p>Completa tus datos para el envío como invitado.</p>
              <input type="text" placeholder="Nombre completo" className="form-control mb-2" />
              <input type="email" placeholder="Email de contacto" className="form-control" />
            </form>
          )}
        </div>

        <div style={{ display: 'flex', gap: '.6rem' }}>
          <button onClick={() => navigate('/carrito')} className="Producto-Comprar-Boton" type="button">
            Volver al carrito
          </button>
          <button onClick={handleConfirmPurchase} className="Producto-Comprar-Boton" type="button">
            Confirmar compra
          </button>
        </div>
      </div>
    </section>
  );
}