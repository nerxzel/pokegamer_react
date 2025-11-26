import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axiosConfig';
import ProductForm from '../components/layout/ProductForm';

function AdminEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await api.get(`/products/${id}`);
                setProduct(res.data || res);
            } catch (err) {
                alert("No se pudo cargar el producto");
                navigate('/admin/productos');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id, navigate]);

    const handleUpdate = async (formData) => {
        try {
            setSubmitting(true);
            await api.put(`/products/${id}`, formData);
            navigate('/admin/productos');
        } catch (error) {
            alert("Error al actualizar: " + error.message);
        } finally {
            setSubmitting(false);
        }
    };


    const handleDelete = async () => {
        try {
            await api.delete(`/products/${id}`);
            navigate('/admin');
        } catch (error) {
            alert("Error al eliminar");
        }
    };

    if (loading) return <div>Cargando...</div>;

    return (
        <div className="container mt-4">
            <ProductForm
                initialData={product}
                onSubmit={handleUpdate}
                onDelete={handleDelete}
                isEditing={true}
                isSubmitting={submitting}
            />
        </div>
    );
}
export default AdminEdit;