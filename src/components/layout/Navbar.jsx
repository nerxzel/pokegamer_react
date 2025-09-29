import { Link } from "react-router-dom";
import logo from '../../assets/Logo.png';

export default function AppNavbar() {
    return (
        <header className="banner">
            <div className="Logo">
                <Link to="/">
                    <img src={logo} alt="Logo Pokegamer" />
                </Link>
            </div>

            <nav aria-label="Navegación principal">
                <ul>
                    <li><Link to="/inicio">Inicio</Link></li>
                    <li><Link to="/productos">Productos</Link></li>
                    <li><Link to="/noticias">Noticias</Link></li>
                    <li><Link to="/comunidad">Centro Pokémon</Link></li>
                    <li><Link to="/usuario">Usuario</Link></li>
                    <li><Link to="/carrito">Carrito</Link></li>
                    <li><Link to="/nosotros">Nosotros</Link></li>
                </ul>
            </nav>

            <div className="Espacio-Vacio"></div>
        </header>
    );
}