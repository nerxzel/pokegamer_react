import { Card, Button, Toast, ToastContainer } from 'react-bootstrap';
import { useCart } from '../../hooks/useCart';
import { useState } from 'react';


export default function CardProducto( {producto} ) {

  const { addToCart } = useCart();
  const [ showToast, setShowToast ] = useState(false)
   
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price);
  };
    
  const handleAddToCart = () => {
    addToCart(producto);
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  };

    return (
        <>
            <Card className='Producto-Box'>
                
                <Card.Img variant="top" src={producto.imagen}/>
                <Card.Body className="d-flex flex-column">
                    <Card.Title className='text-center'>{producto.nombre}</Card.Title>
                    <div className="mt-auto d-flex justify-content-between align-items-center">
                        <Card.Text className='Producto-Precio mb-0'>
                            {formatPrice(producto.precio)}
                        </Card.Text>
                        <Button 
                            className='Producto-Comprar-Boton' 
                            onClick={handleAddToCart}
                            variant="primary"
                        >
                            Agregar al carro
                        </Button>
                    </div>
                </Card.Body>
            </Card>

            <ToastContainer className="p-3 position-fixed bottom-0 end-0">
                <Toast 
                    onClose={() => setShowToast(false)} 
                    show={showToast} 
                    delay={3000} 
                    autohide
                    className="custom-toast-bg" 
                >
                    <Toast.Header className="custom-toast-header">
                        <strong className="me-auto">🛒 Carrito</strong>
                        <small className="text-white">Justo ahora</small> 
                    </Toast.Header>
                    <Toast.Body>
                        ¡{producto.nombre} añadido correctamente!
                    </Toast.Body>
                </Toast>
            </ToastContainer>
        </>
    );
}