import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../hooks/useUser'; 

import { Container, Row, Col, Form, Button } from 'react-bootstrap'

export default function LoginForm({ onShowRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  
  const { login } = useUser();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const mockUserData = {
      nombre: " ",
      email: email,
      
    };
    
    login(mockUserData);
    
    navigate('/perfil'); 
  };

  return (
        <Container className="my-5">
            <Row className="justify-content-center">
                <Col xs={12} sm={10} md={8} lg={6} xl={4}> 
                    <h2 className="mb-4">Inicio de Sesión</h2>
                    
                    <Form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                        
                        <Form.Group controlId="username">
                            <Form.Label>Correo:</Form.Label>
                            <Form.Control 
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="password">
                            <Form.Label>Contraseña:</Form.Label>
                            <Form.Control 
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>
                        
                        <div className="text-danger fw-bold" style={{ minHeight: '1.2em' }}></div>

                        <div className="d-grid gap-2 mt-2">
                            <Button 
                                className="btn-primary-custom"
                                type="submit">
                                  Iniciar Sesión
                            </Button>
                          
                            <Button
                                type="button"
                                className="btn-secondary-custom"
                                onClick={onShowRegister}>
                                  Crear cuenta
                            </Button>
                        </div>
                        
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}