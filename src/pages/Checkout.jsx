import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useUser } from '../hooks/useUser'
import { Container, Row, Col, Card, ListGroup, Button, Form } from 'react-bootstrap';

export default function Checkout() {
    const { cart, clearCart, total: subtotal } = useCart();
    const { user, isLoggedIn } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (cart.length === 0) {
        alert("No hay productos en el carrito para finalizar la compra.");
        navigate('/carrito');
        }
    }, [cart, navigate]);

    const iva = subtotal * 0.19;
    const total = subtotal + iva;

    const handleConfirmPurchase = () => {

        alert('¡Compra confirmada con éxito! Redirigiendo...');
        clearCart();
        setTimeout(() => {
            navigate(isLoggedIn ? '/perfil' : '/');
        }, 1500); 
    };

 return (
        <Container as="section" className="seccion my-5">
            <h2 className="mb-4">Checkout</h2>
            
            <Row className="justify-content-center">
                <Col lg={8} xl={6}>
                    <Card className="checkout-card mb-4">
                        <Card.Body>
                            <Card.Title as="h3">Resumen de productos</Card.Title>
                            <ListGroup variant="flush" className="bg-transparent">
                                {cart.map(item => -(
                                    <ListGroup.Item 
                                        key={item._id} 
                                        className="d-flex justify-content-between checkout-list-item"
                                    >
                                        <span>{item.name} x {item.quantity}</span>
                                        <strong>${(item.price * item.quantity).toLocaleString()}</strong>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                            
                            <hr className="my-3 border-secondary" />

                            <div className="fs-6">
                                <p className="mb-1">Subtotal: <strong>${subtotal.toLocaleString()}</strong></p>
                                <p className="mb-1">IVA (19%): <strong>${iva.toLocaleString()}</strong></p> 
                                <p className="fs-5 mt-3">Total: <strong>${total.toLocaleString()}</strong></p>
                            </div>
                        </Card.Body>
                    </Card>

                    <Card className="checkout-card mb-4">
                        <Card.Body>
                            <Card.Title as="h3">Datos de envío</Card.Title>
                            {isLoggedIn ? (
                                <div>
                                    <p className="mb-0">Email: {user.email}</p>
                                </div>
                            ) : (
                                <Form>
                                    <p>Completa tus datos para el envío como invitado.</p>
                                    <Form.Control type="text" placeholder="Nombre completo" className="mb-2" />
                                    <Form.Control type="email" placeholder="Email de contacto" />
                                </Form>
                            )}
                        </Card.Body>
                    </Card>

                    <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                        <Button 
                            onClick={() => navigate('/carrito')} 
                            variant="secondary">
                                Volver al carrito
                        </Button>

                        <Button 
                            onClick={handleConfirmPurchase} 
                            className="btn-primary-custom">
                                Confirmar compra
                        </Button>
                    </div>

                </Col>
            </Row>
        </Container>
    );
}