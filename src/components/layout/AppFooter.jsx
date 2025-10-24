import { Container, Row, Col } from 'react-bootstrap';
import Logo from "../../assets/Logo.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faInstagram, faYoutube, faWhatsapp } from '@fortawesome/free-brands-svg-icons';



export default function AppFooter() {
  return (
   
    <footer className="bg-primary text-light py-4">
      
      <Container fluid>
        
        <Row className="gy-4"> 
          <Col lg={3} md={6} xs={12} className="d-flex flex-column align-items-center align-items-md-start">
            <img src={Logo} alt="Logo Pokémon" style={{ width: '80px', marginBottom: '0.5rem' }} />
            <p>¡Atrápalos a todos!</p>
          </Col>

          <Col lg={3} md={6} xs={12} className="text-center text-md-start">
            <h4>Servicio Técnico</h4>
            <p className="mb-1">Email: serviciotecnico@centropokemon.cl</p>
            <p className="mb-1">Tel: +569 12345678</p>
            <a href="https://www.whatsapp.com" target='blank' className="text-light fs-4">
              <FontAwesomeIcon icon={faWhatsapp}/>
            </a>
          </Col>
          
          <Col lg={3} md={6} xs={12} className="text-center text-md-start">
            <h4>Síguenos</h4>
            <a href="https://www.facebook.com" target='blank' className="text-light fs-4 me-3"><FontAwesomeIcon icon={faFacebookF}/></a>
            <a href="https://x.com" target='blank' className="text-light fs-4 me-3"><FontAwesomeIcon icon={faTwitter}/></a>
            <a href="https://www.instagram.com" target='blank' className="text-light fs-4 me-3"><FontAwesomeIcon icon={faInstagram}/></a>
            <a href="https://www.youtube.com" target='blank' className="text-light fs-4"><FontAwesomeIcon icon={faYoutube}/></a>
          </Col>

          <Col lg={3} md={6} xs={12} className="text-center text-md-start">
             <p className="mt-4">&copy; 2025 Tienda Pokémon. Todos los derechos reservados.</p>
          </Col>

        </Row>
      </Container>
    </footer>
  );
}