import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useUser } from '../hooks/useUser';
import { Container, Row, Col, Card, ListGroup, Button, Alert } from 'react-bootstrap';
import { getErrorMessage } from '../utils/errorHandler';

export default function Checkout() {
    const { cart, submitOrder, total: subtotal, loading } = useCart();
    const { isLoggedIn } = useUser();
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    useEffect(() => {
        if (cart.length === 0) {
            navigate('/productos');
        }
    }, [cart, navigate]);

    const iva = subtotal * 0.19;
    const total = subtotal + iva;

    const handleConfirmPurchase = async () => {
        setError(null);

        if (!isLoggedIn) {
            navigate('/login');
            return;
        }

        try {
            await submitOrder();

            alert('¡Compra exitosa! Tu pedido ha sido procesado.');
            navigate('/perfil');
        } catch (err) {
            setError(getErrorMessage(err));
        }
    };

    return (
        <Container className="my-5">
            <h2 className="mb-4">Resumen de Pedido</h2>

            {/* Mostramos errores de backend aquí (ej: Stock insuficiente) */}
            {error && <Alert variant="danger">{error}</Alert>}

            <Row>
                <Col md={8}>
                    <Card className="mb-4">
                        <Card.Header>Productos</Card.Header>
                        <ListGroup variant="flush">
                            {cart.map((item, index) => {
                                const product = item.productId || item;
                                if (!product) return null;
                                return (
                                    <ListGroup.Item key={index} className="d-flex justify-content-between">
                                        <span>{product.name} (x{item.quantity})</span>
                                        <span>${(product.price * item.quantity).toLocaleString()}</span>
                                    </ListGroup.Item>
                                );
                            })}
                        </ListGroup>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Total a Pagar</Card.Title>
                            <hr />
                            <div className="d-flex justify-content-between mb-2">
                                <span>Subtotal:</span>
                                <span>${subtotal.toLocaleString()}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-3">
                                <span>IVA (19%):</span>
                                <span>${iva.toLocaleString()}</span>
                            </div>
                            <h3 className="text-center text-primary">
                                ${total.toLocaleString()}
                            </h3>

                            <Button
                                className="w-100 mt-3 btn-primary-custom"
                                size="lg"
                                onClick={handleConfirmPurchase}
                                disabled={loading}
                            >
                                {loading ? 'Procesando...' : 'Confirmar Pago'}
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}