import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../hooks/useUser'; 
import { Container, Row, Col, Form, Button, Spinner } from 'react-bootstrap';

export default function RegistroForm({ onCancel }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { register } = useUser(); 

  const handleSubmit = async (e) => { 
    e.preventDefault();
    setServerError('');
    setLoading(true);

    if (!name || !email || !password) {
        setServerError('Todos los campos son obligatorios.');
        setLoading(false);
        return;
    }

    try {

      await register(name, email, password); 
      
      navigate('/perfil'); 

    } catch (error) {
      setServerError(error.message || "Ocurrió un error al registrarse.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-5">
        <Row className="justify-content-center">
            <Col xs={12} sm={10} md={8} lg={6} xl={4}> 
                <h2 className="mb-4">Crear Cuenta</h2>
                <Form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                    
                    <Form.Group controlId="name">
                        <Form.Label>Nombre completo:</Form.Label>
                        <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} required disabled={loading} />
                    </Form.Group>

                    <Form.Group controlId="email">
                        <Form.Label>Correo electrónico:</Form.Label>
                        <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} />
                    </Form.Group>

                    <Form.Group controlId="password">
                        <Form.Label>Contraseña:</Form.Label>
                        <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading} />
                    </Form.Group>
                    
                    {serverError && <div className="text-danger small fw-bold mt-2">{serverError}</div>}

                    <div className="d-grid gap-2 mt-4">
                        <Button 
                            className="btn-primary-custom"
                            type="submit"
                            disabled={loading}>
                            {loading ? (
                                <><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /><span className="ms-2">Registrando...</span></>
                            ) : (
                                'Registrarme'
                            )}
                        </Button>
                        
                        <Button
                            type="button"
                            className="btn-secondary-custom"
                            onClick={onCancel}
                            disabled={loading}>
                              Iniciar Sesión
                        </Button>
                    </div>
                </Form>
            </Col>
        </Row>
    </Container>
  );
}