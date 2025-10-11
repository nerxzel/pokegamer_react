import { Link } from "react-router-dom";
import Logo from '../../assets/Logo.png';
import { Container, Navbar, Nav} from "react-bootstrap";

export default function AppNavbar() {
    return (
        <Navbar bg="primary" variant="dark" expand="lg" sticky="top">

        <Container fluid>
            <Navbar.Brand href="home">
                <img src={Logo} width="80px" alt="Logo Pokemon" />
            </Navbar.Brand>

            <Navbar.Toggle aria-controls="basic-navbar-nav"/>

            <Navbar.Collapse id="basic-navbar-nav" >
                <Nav className="mx-auto gap-2">
                    <Nav.Link as={Link} to="/" className="pokeball-link nav-link-boxed">Inicio</Nav.Link>
                    <Nav.Link as={Link} to="/productos" className="pokeball-link nav-link-boxed">Productos</Nav.Link>
                    <Nav.Link as={Link} to="/noticias" className="pokeball-link nav-link-boxed">Noticias</Nav.Link>
                    <Nav.Link as={Link} to="/comunidad" className="pokeball-link nav-link-boxed">Centro Pokemon</Nav.Link>
                    <Nav.Link as={Link} to="/usuario" className="pokeball-link nav-link-boxed">Usuario</Nav.Link>
                    <Nav.Link as={Link} to="/carrito" className="pokeball-link nav-link-boxed">Carrito</Nav.Link>
                    <Nav.Link as={Link} to="/nosotros" className="pokeball-link nav-link-boxed">Nosotros</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Container>
        
        </Navbar>
    );
}