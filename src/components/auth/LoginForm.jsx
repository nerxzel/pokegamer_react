import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../hooks/useUser'; 
import { Container, Row, Col, Form, Button, Spinner } from 'react-bootstrap';

export default function LoginForm({ onShowRegister }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { login } = useUser(); 

    const handleSubmit = async (e) => {

        e.preventDefault();
        setServerError('');
        setLoading(true);

        if (!email || !password) {
            setServerError('Por favor, ingresa correo y contraseña.');
            setLoading(false);
            return;
        }

        try {
            await login(email, password); 
            navigate('/perfil'); 
        } catch (error) {
            setServerError(error.message || "Ocurrió un error al iniciar sesión.");
        } finally {
            setLoading(false);
        }
    };

return (
    <Container className="my-5">
        <Row className="justify-content-center">
            <Col xs={12} sm={10} md={8} lg={6} xl={4}> 
                <h2 className="mb-4">Inicio de Sesión</h2>
                
                <Form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                    
                    <Form.Group controlId="email">
                        <Form.Label>Correo:</Form.Label>
                        <Form.Control 
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </Form.Group>

                    <Form.Group controlId="password">
                        <Form.Label>Contraseña:</Form.Label>
                        <Form.Control 
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} 
                            required
                            disabled={loading}
                        />
                    </Form.Group>
                    
                    <div className="text-danger fw-bold" style={{ minHeight: '1.2em' }}>
                        {serverError}
                    </div>

                    <div className="d-grid gap-2 mt-2">
                        <Button 
                            className="btn-primary-custom"
                            type="submit"
                            disabled={loading}>
                            {loading ? (
                                <><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /><span className="ms-2">Ingresando...</span></>
                            ) : (
                                'Iniciar Sesión'
                            )}
                        </Button>
                        <Button
                            type="button"
                            className="btn-secondary-custom"
                            onClick={onShowRegister}
                            disabled={loading}>
                                Registrarme
                        </Button>
                    </div>
                    
                </Form>
            </Col>
        </Row>
    </Container>
    );
}