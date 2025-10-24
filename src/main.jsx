import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { UserProvider } from './context/ContextUsuario.jsx';
import { CartProvider } from './context/ContextCarrito.jsx';
import App from './App.jsx'
import AppRoutes from './routes/AppRoutes.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import './style/theme.css';


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <UserProvider>
      <CartProvider>
          <AppRoutes /> 
      </CartProvider>
    </UserProvider>
  </BrowserRouter>
  
)
