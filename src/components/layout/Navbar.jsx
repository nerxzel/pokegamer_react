import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function AppNavbar(){
    return (
        <Navbar expand="lg" bg="dark" data-bs-theme="dark" className="border-bottom" aria-label="Main">
            <Container>
                <Navbar.Brand as={Link} to="/">Pokegamer</Navbar.Brand>
                <Navbar.Toggle aria-controls="mainNav" />
                <Navbar.Collapse id="mainNav">
                    <Nav className="ms-auto">
                        <Nav.Link as={Link} to="/inicio">Inicio</Nav.Link>
                        <Nav.Link as={Link} to="/productos">Productos</Nav.Link>
                        <Nav.Link as={Link} to="/noticias">Noticias</Nav.Link>
                        <Nav.Link as={Link} to="/comunidad">Comunidad</Nav.Link>
                        <Nav.Link as={Link} to="/usuario">Usuario</Nav.Link>
                        <Nav.Link as={Link} to="/carrito">Carrito</Nav.Link>
                        <Nav.Link as={Link} to="/nosotros">Nosotros</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );

}