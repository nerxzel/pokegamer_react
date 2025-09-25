import { Routes, Route} from "react-router-dom";
import Inicio from '../pages/Inicio.jsx';
import Productos from '../pages/Productos.jsx';
import Noticias from '../pages/Noticias.jsx';
import Comunidad from '../pages/Comunidad.jsx';
import Carrito from '../pages/Carrito.jsx';
import Usuario from '../pages/Usuario.jsx';
import Nosotros from '../pages/Nosotros.jsx';


export default function AppRoutes() {
    return(
        <Routes> 
            <Route path="/Inicio" element={<Inicio />}/>
            <Route path="/Productos" element={<Productos />}/>
            <Route path="/Noticias" element={<Noticias />}/>
            <Route path="/Comunidad" element={<Comunidad />}/>
            <Route path="/Carrito" element={<Carrito />}/>
            <Route path="/Usuario" element={<Usuario />}/>
            <Route path="/Nosotros" element={<Nosotros />}/>
        </Routes>

    );
}