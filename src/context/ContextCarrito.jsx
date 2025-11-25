import { createContext, useMemo, useState, useEffect } from 'react';
import { useUser } from '../hooks/useUser'
import api from '../api/axiosConfig';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState([]);
  const { isLoggedIn } = useUser();

  useEffect(() => {
    const cargarCarrito = async () => {
      setCargando(true);
      try {
        if (isLoggedIn) {
          const { response } = await api.get('/cart'); 
          setCart(response.items || []); 
        } else {
          const storedCart = localStorage.getItem('pokegamer_carrito');
          if (storedCart) {
            setCart(JSON.parse(storedCart));
          } else {
            setCart([]);
          }
        }
      } catch (err) {
        console.error("Error cargando carrito:", err);
        setError("Error al sincronizar el carrito");
      } finally {
        setCargando(false);
      }
    };

    cargarCarrito();
  }, [isLoggedIn]);
  
  const addToCart = async (product) => {
    if (isLoggedIn) {
      try {
        setCargando(true);

        const response = await api.post("/cart/items", { productId: product._id, quantity: 1})
        setCart(response.data.items)

      } catch (err) {
          setError(err.response?.data?.message || "Error al añadir al carro")
      } finally {
        setCargando(false)
      }

    } else {
      let newCart = [...cart];
      const existingProductIndex = newCart.findIndex(item => item._id === product._id);

      if (existingProductIndex !== -1) {
        newCart[existingProductIndex].quantity += 1;
      } else {
          newCart.push({...product, quantity: 1})
      }
      setCart(newCart)
      localStorage.setItem('pokegamer_carrito', JSON.stringify(newCart))
    }
  };
  
  const removeFromCart = async (productId) => {
    if (isLoggedIn) {
      try {
        setCargando(true)
        const response = await api.delete(`/cart/items/${productId}`)
        setCart(response.data.items)
      } catch (err) {
          setError(err.response?.data?.message || "No se pudo eliminar el producto")
      } finally {
        setCargando(false)
      }
    } else {
      const newCart = cart.filter(item => (item._id) !== productId)
      setCart(newCart)
      localStorage.setItem("pokegamer_carrito", JSON.stringify(newCart))
    }}
  
  const clearCart = async () => {
    if (isLoggedIn) {
      try {
        setCargando(true)
        const response = await api.delete(`/cart`)
        setCart(response.data.items)
      } catch {
          setError("Error al vaciar al carrito")
      } finally {
        setCargando(false)
      }
    } else {
      const newCart = []
      setCart(newCart)
      localStorage.setItem("pokegamer_carrito", JSON.stringify(newCart))
    }
  }

  const total = useMemo(() => {
  if (!cart) return 0; 

  return cart.reduce((sum, item) => {
    const realProduct = item.productId || item; 
    
    const price = realProduct.price || 0; 
    const quantity = item.quantity || 0;

    return sum + (price * quantity);
  }, 0);
}, [cart]);

  
  const value = {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    total,
    cargando,
    error
  };

return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export default CartContext;