import CardProducto from '../components/layout/CardProducto';
import { products } from '../utils/mockProducts';

export default function Productos() {
    return(
    
      <div className="d-flex flex-wrap gap-4 justify-content-center">
        {products.map(producto => (<CardProducto key={producto.id} producto={producto} />))}
      </div>

  );
}