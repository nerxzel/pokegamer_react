import { Container, Row, Col } from 'react-bootstrap';
import Logo from "../../assets/Logo.png";



export default function AppFooter() {
  return (

   // bg-primary es un color de fondo, text-light color de texto, py-4 para dar un padding de 4
    <footer className="bg-primary text-light py-4"> 
      
      <Container>
        
        <Row className="gy-4"> 

          <Col lg={3} md={6} xs={12} className="text-center text-md-start">
            <img src={Logo} alt="Logo Pokémon" style={{ width: '80px', marginBottom: '0.5rem' }} />
            <p>Centro Pokémon - ¡Atrápalos a todos!</p>
          </Col>

          <Col lg={3} md={6} xs={12} className="text-center text-md-start">
            <h4>Servicio Técnico</h4>
            <p className="mb-1">Email: serviciotecnico@centropokemon.cl</p>
            <p className="mb-1">Tel: +569 12345678</p>
            <a href="#" className="text-light fs-4">
              <i className="fab fa-whatsapp"></i>
            </a>
          </Col>
          
          <Col lg={3} md={6} xs={12} className="text-center text-md-start">
            <h4>Síguenos</h4>
            <a href="#" className="text-light fs-4 me-3"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="text-light fs-4 me-3"><i className="fab fa-twitter"></i></a>
            <a href="#" className="text-light fs-4 me-3"><i className="fab fa-instagram"></i></a>
            <a href="#" className="text-light fs-4"><i className="fab fa-youtube"></i></a>
          </Col>

        
          <Col lg={3} md={6} xs={12} className="text-center text-md-start">
         
             <p className="mt-4">&copy; 2025 Tienda Pokémon. Todos los derechos reservados.</p>
          </Col>

        </Row>
      </Container>
    </footer>
  );
}