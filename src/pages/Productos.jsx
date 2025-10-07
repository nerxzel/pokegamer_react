import CardProducto from '../components/layout/CardProducto';
import { mockProducts } from '../utils/mockProducts';

export default function Productos() {
    return(
    
      <div className="d-flex flex-wrap gap-4 justify-content-center">
        {mockProducts.map(producto => (<CardProducto key={producto.id} producto={producto} />))}
      </div>

  );
}