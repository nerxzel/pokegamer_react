import {Button, Form, Container, Row, Col }from 'react-bootstrap';

export default function RegistroForm({ onCancel }) {
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos de registro enviados");
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col xs={12} sm={10} md={8} lg={6} xl={4}>
          
          <h2 className="mb-3">Registro de Usuario</h2>
          <p className="mb-3">Completa tus datos para crear tu cuenta.</p>
          <hr className="mb-4" />
          
          <Form onSubmit={handleSubmit} className="d-flex flex-column gap-3">

            <Form.Group controlId="correo-reg">
                <Form.Label>Correo electrónico:</Form.Label>
                <Form.Control type="email" name="correo-reg" required />
            </Form.Group>
            
            <Form.Group controlId="password-reg">
                <Form.Label>Contraseña:</Form.Label>
                <Form.Control type="password" name="password-reg" required />
            </Form.Group>

            <div className="d-grid gap-2 d-md-flex justify-content-md-start mt-3">    
          
                <Button 
                    className="btn-primary-custom"
                    type="submit"
                >
                    Registrarse
                </Button>
                
                <Button
                    type="button"
                    className="btn-danger-custom" 
                    onClick={onCancel}
                >
                    Cancelar
                </Button>
            </div>
            
          </Form>
        </Col>
      </Row>
    </Container>
  );
}