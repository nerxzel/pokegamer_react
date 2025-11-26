import { createContext, useMemo, useState, useEffect } from 'react';
import { useUser } from '../hooks/useUser'
import api from '../api/axiosConfig';
import { getErrorMessage } from '../utils/errorHandler';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isLoggedIn } = useUser();

  const refreshCart = async () => {
    try {
      const response = await api.get('/cart');
      setCart(response.data?.items || []);
    } catch (err) {
      console.error("Error recargando el carrito", err);
    }
  };

  useEffect(() => {
    const syncCart = async () => {
      setLoading(true);
      try {
        if (isLoggedIn) {
          const localCartRaw = localStorage.getItem('pokegamer_carrito');

          if (localCartRaw) {
            const localCart = JSON.parse(localCartRaw);

            if (localCart.length > 0) {
              await Promise.all(localCart.map(item => {
                return api.post("/cart/items", {
                  productId: item._id,
                  quantity: item.quantity
                });
              }));

              localStorage.removeItem('pokegamer_carrito');
            }
          }

          await refreshCart();

        } else {
          const storedCart = localStorage.getItem('pokegamer_carrito');
          if (storedCart) {
            setCart(JSON.parse(storedCart));
          } else {
            setCart([]);
          }
        }
      } catch (err) {
        console.error("Error en la carga:", err);
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    syncCart();
  }, [isLoggedIn]);

  const addToCart = async (product) => {
    if (isLoggedIn) {
      try {
        setLoading(true);
        const response = await api.post("/cart/items", { productId: product._id, quantity: 1 })
        setCart(response.data?.items || [])
      } catch (err) {
        setError(getErrorMessage(err))
      } finally {
        setLoading(false)
      }
    } else {
      let newCart = [...cart];
      const existingProductIndex = newCart.findIndex(item => item._id === product._id);

      if (existingProductIndex !== -1) {
        newCart[existingProductIndex].quantity += 1;
      } else {
        newCart.push({ ...product, quantity: 1 })
      }
      setCart(newCart)
      localStorage.setItem('pokegamer_carrito', JSON.stringify(newCart))
    }
  };

  const removeFromCart = async (productId) => {
    if (isLoggedIn) {
      try {
        setLoading(true);
        const response = await api.delete(`/cart/items/${productId}`);

        const newItems = response.data?.items;

        if (Array.isArray(newItems)) {
          setCart(newItems);
        } else {
          await refreshCart();
        }
      } catch (err) {
        console.error(err);
        setError(getErrorMessage(err));
        await refreshCart();
      } finally {
        setLoading(false);
      }
    } else {
      const newCart = cart.filter(item => (item._id) !== productId)
      setCart(newCart)
      localStorage.setItem("pokegamer_carrito", JSON.stringify(newCart))
    }
  };

  const clearCart = async () => {
    if (isLoggedIn) {
      try {
        setLoading(true)
        const response = await api.delete(`/cart`)
        setCart(response.data?.items || [])
      } catch (err) {
        setError(getErrorMessage(err))
      } finally {
        setLoading(false)
      }
    } else {
      const newCart = []
      setCart(newCart)
      localStorage.setItem("pokegamer_carrito", JSON.stringify(newCart))
    }
  }

  const total = useMemo(() => {
    if (!cart || !Array.isArray(cart)) return 0;

    return cart.reduce((sum, item) => {
      const productData = item.productId || item;
      if (!productData) return sum;

      const price = productData.price || 0;
      const quantity = item.quantity || 0;

      return sum + (price * quantity);
    }, 0);
  }, [cart]);

  const submitOrder = async () => {
    if (!isLoggedIn) {
      throw new Error("Debes iniciar sesión para realizar la compra.");
    }
    setLoading(true);
    try {
      const response = await api.post('/orders');

      setCart([]);
      localStorage.removeItem('pokegamer_carrito');

      return response.data;
    } catch (err) {
      console.error(err);
      const msg = getErrorMessage(err);
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    submitOrder,
    total,
    loading,
    error
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export default CartContext;