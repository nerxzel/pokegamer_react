import { Routes, Route} from "react-router-dom";
import Inicio from '../pages/Inicio.jsx';
import Productos from '../pages/Productos.jsx';
import Noticias from '../pages/Noticias.jsx';
import Comunidad from '../pages/Comunidad.jsx';
import Carrito from '../pages/Carrito.jsx';
import Usuario from '../pages/Usuario.jsx';
import Nosotros from '../pages/Nosotros.jsx';
import Perfil from '../pages/Perfil.jsx'; 
import Checkout from '../pages/Checkout.jsx'


export default function AppRoutes() {
    return(
        <Routes> 
            <Route path="/" element={<Inicio />}/>
            <Route path="/productos" element={<Productos />}/>
            <Route path="/noticias" element={<Noticias />}/>
            <Route path="/comunidad" element={<Comunidad />}/>
            <Route path="/carrito" element={<Carrito />}/>
            <Route path="/usuario" element={<Usuario />}/>
            <Route path="/nosotros" element={<Nosotros />}/>
            <Route path="/perfil" element={<Perfil />}/>
            <Route path="/checkout" element={<Checkout />}/>
        </Routes>

    );
}