import { useState, useEffect } from "react";
import { Form, Button, Row, Col, Spinner, Image, InputGroup } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaSave, FaTimes, FaUpload } from 'react-icons/fa';
import api from '../../api/axiosConfig';

const CATEGORIAS = ["Consolas", "Videojuegos", "Accesorios", "Coleccionables", "Ropa"];

function ProductForm({ initialData, onSubmit, isEditing, onDelete, isSubmitting = false }) {
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);

    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: 0,
        stock: 0,
        description: '',
        imagen: '',
        isActive: true
    });

    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        if (isEditing && initialData) {
            setFormData(initialData);
            if (initialData.imagen) {
                setImagePreview(initialData.imagen);
            }
        }
    }, [initialData, isEditing]);

    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const response = await api.get('/products/categories');

                if (response.data && Array.isArray(response.data)) {
                    setCategories(response.data);
                }
            } catch (error) {
                console.error("Error cargando categorías:", error);
            } finally {
                setLoadingCategories(false);
            }
        };
        fetchCategorias();
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setImagePreview(objectUrl);

            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, imagen: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit(formData);
    };

    const handleDeleteClick = () => {
        if (window.confirm("¿Estás seguro de que quieres desactivar este producto permanentemente?")) {
            if (onDelete) onDelete();
        }
    };

    return (
        <Form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow-sm">
            <h4 className="mb-4 text-primary">
                {isEditing ? `Editar Producto: ${formData.name}` : 'Nuevo Producto'}
            </h4>

            <Row className="mb-3">
                <Form.Group as={Col} md="8" controlId="forName">
                    <Form.Label>Nombre del Producto <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Ej: Hollow Knight: Solksong"
                        required
                        disabled={isSubmitting}
                    />
                </Form.Group>

                <Form.Group as={Col} md="4" controlId="forCategory">
                    <Form.Label>Categoría <span className="text-danger">*</span></Form.Label>
                    <Form.Select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                        disabled={isSubmitting || loadingCategories}
                    >
                        <option value="">
                            {loadingCategories ? 'Cargando...' : 'Seleccionar...'}
                        </option>

                        {!loadingCategories && categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>
            </Row>

            <Row className="mb-3">
                <Form.Group as={Col} md="6" controlId="forPrice">
                    <Form.Label>Precio (CLP) <span className="text-danger">*</span></Form.Label>
                    <InputGroup>
                        <InputGroup.Text>$</InputGroup.Text>
                        <Form.Control
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            min="0"
                            required
                            disabled={isSubmitting}
                        />
                    </InputGroup>
                </Form.Group>

                <Form.Group as={Col} md="6" controlId="forStock">
                    <Form.Label>Stock Disponible <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleInputChange}
                        min="0"
                        required
                        disabled={isSubmitting}
                    />
                </Form.Group>
            </Row>

            <Row className="mb-4">
                <Form.Group as={Col} md="8" controlId="forDescription">
                    <Form.Label>Descripción</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={5}
                        name="description"
                        value={formData.description || ''}
                        onChange={handleInputChange}
                        placeholder="Detalles del producto..."
                        disabled={isSubmitting}
                    />
                </Form.Group>

                <Form.Group as={Col} md="4" className="text-center">
                    <Form.Label>Imagen del Producto</Form.Label>
                    <div className="border rounded p-2 mb-2 bg-light d-flex justify-content-center align-items-center" style={{ height: '150px' }}>
                        {imagePreview ? (
                            <Image src={imagePreview} alt="Preview" style={{ maxHeight: '100%', maxWidth: '100%' }} />
                        ) : (
                            <span className="text-muted small">Sin imagen</span>
                        )}
                    </div>
                    <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        disabled={isSubmitting}
                        size="sm"
                    />
                </Form.Group>
            </Row>

            <hr />
            <div className="d-flex justify-content-end gap-2">
                {isEditing && (
                    <Button
                        variant="outline-danger"
                        onClick={handleDeleteClick}
                        className="me-auto"
                        disabled={isSubmitting}
                    >
                        <FaTrash className="me-2" /> Eliminar
                    </Button>
                )}

                <Button
                    variant="secondary"
                    onClick={() => navigate('/admin')}
                    disabled={isSubmitting}
                >
                    <FaTimes className="me-2" /> Cancelar
                </Button>

                <Button
                    variant="primary"
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <><Spinner as="span" animation="border" size="sm" className="me-2" />Guardando...</>
                    ) : (
                        <><FaSave className="me-2" /> {isEditing ? 'Guardar Cambios' : 'Crear Producto'}</>
                    )}
                </Button>
            </div>
        </Form>
    );
}

export default ProductForm;