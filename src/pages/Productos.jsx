import { useState, useMemo, useEffect} from 'react';
import { Form, Row, Col, Spinner } from 'react-bootstrap';
import CardProducto from '../components/layout/CardProducto';
import api from '../api/axiosConfig';

export default function Productos() {

    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [busqueda, setBusqueda] = useState('');
    const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);

    const handleCategoryChange = (e) => {
        const { value, checked } = e.target;
        setCategoriasSeleccionadas(prev =>
            checked ? [...prev, value] : prev.filter(cat => cat !== value)
        );
    };


    useEffect(() => {
    const cargarDatos = async () => {
        try {
            setCargando(true);
        

            const [resProductos, resCategorias] = await Promise.all([
                api.get('/products'),
                api.get('/products/categories')
            ]);

        setProductos(resProductos.data.products);
        
        setCategorias(resCategorias.data);

        } catch (err) {
            console.error("Error cargando productos:", err);
            setError("No se pudieron cargar los productos.");
        } finally {
            setCargando(false);
        }
    };

    cargarDatos();
  }, []);

    const productosFiltrados = useMemo(() => {
        return productos.filter(producto => {
            const coincideCategoria = categoriasSeleccionadas.length === 0 || categoriasSeleccionadas.includes(producto.category);
            const coincideBusqueda = producto.name.toLowerCase().includes(busqueda.toLowerCase());
            return coincideCategoria && coincideBusqueda;
        });
    }, [busqueda, categoriasSeleccionadas, productos]);

    if (cargando) {
        return (
            <div className="d-flex justify-content-center py-5">
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    if (error) {
        return (
            <Container className="py-4">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

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
                        <Col key={producto._id} className="d-flex justify-content-center">
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