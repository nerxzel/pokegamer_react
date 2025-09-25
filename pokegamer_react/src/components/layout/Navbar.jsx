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
                        <Nav.Link as={Link} to="./pages/Inicio">Inicio</Nav.Link>
                        <Nav.Link as={Link} to="./pages/Productos">Productos</Nav.Link>
                        <Nav.Link as={Link} to="./pages//Noticias">Noticias</Nav.Link>
                        <Nav.Link as={Link} to="./pages//Comunidad">Comunidad</Nav.Link>
                        <Nav.Link as={Link} to="./pages//Usuario">Usuario</Nav.Link>
                        <Nav.Link as={Link} to="./pages/Carrito">Carrito</Nav.Link>
                        <Nav.Link as={Link} to="./pages//Nosotros">Nosotros</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );

}