import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser'
import { Container, Card, ListGroup, Button, Row, Col } from 'react-bootstrap';

export default function Perfil() {

    const { user, isLoggedIn, logout } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/usuario');
        }
    }, [isLoggedIn, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!user) {
        return null; 
    }

return (
        <Container as="section" id="info-entrenador" className="seccion my-5">
            <h2 className="mb-4">Bienvenido, {user?.email}</h2>
            
            <Row className="justify-content-center">
                <Col lg={6} md={8}> 
                    
                    <Card className="checkout-card mb-4">
                        <Card.Body>
                            <Card.Title as="h3">Datos de tu cuenta</Card.Title>
                            <Card.Text>Aquí puedes ver la información básica de tu cuenta.</Card.Text>
                        
                            <ListGroup variant="flush" className="bg-transparent">
                                <ListGroup.Item className="d-flex justify-content-between checkout-list-item">
                                    <strong>Nombre:</strong> {user?.name || '-'}
                                    <strong>Email:</strong> {user?.email || '-'}
                                </ListGroup.Item>        
                            </ListGroup>
                        </Card.Body>
                    </Card>

                    <div className="d-grid gap-2 mt-4"> 
                        <Button 
                            onClick={handleLogout} 
                            className="btn-primary-custom" 
                            size="lg">
                                Cerrar Sesión
                        </Button>
                    </div>

                </Col>
            </Row>
        </Container>
    );
}