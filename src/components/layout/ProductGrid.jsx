import { Form, Row, Col, Button, Table, Badge, Spinner, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaPencilAlt, FaPlus, FaCheck, FaSearch, FaBan } from 'react-icons/fa';
import api from '../../api/axiosConfig';

function ProductGrid() {
    const [products, setProducts] = useState([]);
    const [searchBar, setSearchBar] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);
    };

    const loadProducts = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.get('/products?isActive=true');

            if (response.data && response.data && Array.isArray(response.data.products)) {
                setProducts(response.data.products);
            } else {
                setProducts([]);
            }
        } catch (err) {
            console.error(err);
            setError("No se pudieron cargar los productos. Intenta nuevamente.");
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);


    const filteredProducts = products.filter((product) => {
        const term = searchBar.toLowerCase();
        return (
            (product.name || '').toLowerCase().includes(term) ||
            (product.category || '').toLowerCase().includes(term) ||
            (product.description || '').toLowerCase().includes(term)
        );
    });

    return (
        <div className="p-4 bg-white rounded shadow-sm">
            <Row className="mb-3 justify-content-between align-items-center">
                <Col md={6}>
                    <InputGroup>
                        <InputGroup.Text><FaSearch /></InputGroup.Text>
                        <Form.Control
                            placeholder="Buscar por Nombre, Categoría..."
                            value={searchBar}
                            onChange={(e) => setSearchBar(e.target.value)}
                        />
                    </InputGroup>
                </Col>
                <Col md={4} className="text-end">
                    <Button
                        variant="success"
                        onClick={() => navigate(`/admin/products`)}
                    >
                        <FaPlus className="me-2" /> Nuevo Producto
                    </Button>
                </Col>
            </Row>

            {error && <div className="alert alert-danger">{error}</div>}

            {loading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-2">Cargando inventario...</p>
                </div>
            ) : (
                <div className="table-responsive">
                    <Table hover className="align-middle table-striped">
                        <thead className="table-light">
                            <tr>
                                <th>Imagen</th>
                                <th>Nombre</th>
                                <th>Categoría</th>
                                <th>Precio</th>
                                <th>Stock</th>

                                <th className="text-end">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map((product) => (
                                    <tr key={product._id} className={!product.isActive ? 'table-secondary text-muted' : ''}>
                                        <td>
                                            <img
                                                src={product.imagen || 'https://placehold.co/100x100?text=No+Img'}
                                                alt={product.name}
                                                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                                className="rounded border bg-white"
                                            />
                                        </td>
                                        <td className="fw-bold">{product.name}</td>
                                        <td className="fw-normal">
                                            {product.category}
                                        </td>
                                        <td className="fw-bold text-nowrap">{formatCurrency(product.price)}</td>
                                        <td>
                                            <span className={product.stock < 5 ? 'text-danger fw-bold' : 'text-success'}>
                                                {product.stock}
                                            </span>
                                        </td>

                                        <td className="text-end text-nowrap">
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                className="me-2"
                                                onClick={() => navigate(`/admin/products/${product._id}`)}
                                                title="Editar Producto"
                                            >
                                                <FaPencilAlt />
                                            </Button>

                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center py-4 text-muted">
                                        No se encontraron productos.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
            )}
        </div>
    );
}

export default ProductGrid;