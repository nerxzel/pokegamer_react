import { useState, useMemo } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import CardProducto from '../components/layout/CardProducto';
import { mockProductos } from '../utils/mockProductos';

const categorias = [...new Set(mockProductos.map(p => p.categoria))];

export default function Productos() {
    const [busqueda, setBusqueda] = useState('');
    const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);

    useEffect(() => {
        const productosGuardados = localStorage.getItem('productos');

        if (productosGuardados) {
            const parsed = JSON.parse(productosGuardados);
            setProductos(parsed);
            setCategorias([...new Set(parsed.map(p => p.categoria))]);
        } else {
            localStorage.setItem('productos', JSON.stringify(mockProductos));
            setProductos(mockProductos);
            setCategorias([...new Set(mockProductos.map(p => p.categoria))]);
        }
    }, []);

    const handleCategoryChange = (e) => {
        const { value, checked } = e.target;
        setCategoriasSeleccionadas(prev =>
            checked ? [...prev, value] : prev.filter(cat => cat !== value)
        );
    };

   
    const productosFiltrados = useMemo(() => {
        return productos.filter(producto => {
            const coincideCategoria =
                categoriasSeleccionadas.length === 0 ||
                categoriasSeleccionadas.includes(producto.categoria);
            const coincideBusqueda = producto.nombre
                .toLowerCase()
                .includes(busqueda.toLowerCase());
            return coincideCategoria && coincideBusqueda;
        });
    }, [busqueda, categoriasSeleccionadas, productos]);

    return (
        <div>
            
            <div className="seccion p-4 mb-5">
                <Row>
                    <Col md={12} className="mb-3">
                        <Form.Control
                            type="text"
                            placeholder="Buscar por nombre..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                    </Col>
                    <Col md={12}>
                        <div className="d-flex flex-wrap gap-3">
                            {categorias.map(cat => (
                                <Form.Check
                                    key={cat}
                                    type="checkbox"
                                    id={`check-${cat}`}
                                    label={cat.charAt(0).toUpperCase() + cat.slice(1)}
                                    value={cat}
                                    onChange={handleCategoryChange}
                                />
                            ))}
                        </div>
                    </Col>
                </Row>
            </div>

            <Row xs={1} sm={2} md={3} lg={4} className="g-4 justify-content-center">
                {productosFiltrados.length > 0 ? (
                    productosFiltrados.map(producto => (
                        <Col key={producto.id} className="d-flex justify-content-center">
                            <CardProducto producto={producto} />
                        </Col>
                    ))
                ) : (
                    <Col className="text-center">
                        <p>No se encontraron productos con esos filtros.</p>
                    </Col>
                )}
            </Row>
        </div>
    );
}