import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useUser } from '../hooks/useUser';

export default function Carrito() {
  
  const { cart, removeFromCart, clearCart, total } = useCart();
  const { isLoggedIn } = useUser()
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (isLoggedIn) {
      navigate('/checkout');
    } else {
      if(window.confirm("Debes iniciar sesión para finalizar tu compra. ¿Ir al login?")) {
          navigate('/usuario');
      }
    }
  };

  return (
    <section className="seccion">
      <h2>Carrito de Compras</h2>
      
      {cart.length === 0 ? (
        <p>El carrito de compras está vacío.</p>
      ) : (
        <div>
          {cart.map((item, index) => {
            const product = item.productId || item;
          
            if (!product) return null; 

            return (
              <div key={product._id || index} className="d-flex justify-content-between align-items-center border-bottom py-2">
                <div>
                  <h5 className="mb-0">{product.name}</h5>
                  <p className="mb-0">Cantidad: {item.quantity}</p>
                  <p className="mb-0 text-muted">Precio: ${product.price}</p>
                </div>
                
                <button className="btn btn-danger btn-sm" onClick={() => removeFromCart(product._id)}>
                  Eliminar
                </button>
              </div>
            );
          })}
          
          <div className="mt-4">
            <h4>Total a Pagar: ${total}</h4>
            <div className="d-flex gap-2 mt-3">
              <button className="btn-danger-custom" onClick={clearCart}>
                Vaciar Carrito
              </button>
              <button className="Producto-Comprar-Boton" onClick={handleCheckout}>
                Finalizar Compra
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}