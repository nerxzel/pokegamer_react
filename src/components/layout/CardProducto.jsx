import { Card, Button } from 'react-bootstrap';


export default function CardProducto( {producto} ) {
   
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price);
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
          <Button variant="primary" className='Producto-Comprar-Boton'>Agregar al carro</Button>
        </div>
      </Card.Body>
    </Card>
  );
}