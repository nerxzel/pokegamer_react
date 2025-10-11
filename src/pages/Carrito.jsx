import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';

export default function Carrito() {
  
  const { cart, removeFromCart, clearCart, total } = useCart();
  const navigate = useNavigate();

  
  return (
    <section className="seccion">
      <h2>Carrito de Compras</h2>
      
      {cart.length === 0 ? (
        <p>El carrito de compras está vacío.</p>
      ) : (
        <div>
          {cart.map(item => (
            <div key={item.id} className="d-flex justify-content-between align-items-center border-bottom py-2">
              <div>
                <h5 className="mb-0">{item.nombre}</h5>
                <p className="mb-0">Cantidad: {item.quantity}</p>
                <p className="mb-0 text-muted">Precio: ${item.precio.toLocaleString()}</p>
              </div>
              <button className="btn btn-danger btn-sm" onClick={() => removeFromCart(item.id)}>
                Eliminar
              </button>
            </div>
          ))}
          
          <div className="mt-4">
            <h4>Total a Pagar: ${total.toLocaleString()}</h4>
            <div className="d-flex gap-2 mt-3">
              <button className="Producto-Comprar-Boton" onClick={clearCart}>
                Vaciar Carrito
              </button>
              <button className="Producto-Comprar-Boton" onClick={() => navigate('/checkout')}>
                Finalizar Compra
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}