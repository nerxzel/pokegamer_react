import { Card, Button } from 'react-bootstrap';
import { useCart } from '../../hooks/useCart';


export default function CardProducto( {producto} ) {

  const { addToCart } = useCart();

   
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price);
  };
    
  const handleAddToCart = () => {
    addToCart(producto);
    // Hay que añadir la función para mostrar que se añadió el producto
    console.log(`${producto.nombre} agregado al carrito!`);
  };

    return (

    <Card className='Producto-Box'>
      
      <Card.Img variant="top" src={producto.imagen}/>
      <Card.Body className="d-flex flex-column">
        <Card.Title className='text-center'>{producto.nombre}</Card.Title>
        <div className="mt-auto d-flex justify-content-between align-items-center">
          <Card.Text className='Producto-Precio mb-0'>
            {formatPrice(producto.precio)}
          </Card.Text>
          <Button variant="primary" className='Producto-Comprar-Boton' onClick={handleAddToCart}>Agregar al carro</Button>
        </div>
      </Card.Body>
    </Card>
  );
}