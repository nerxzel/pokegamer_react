import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import ProductForm from '../components/layout/ProductForm';

function AdminAdd() {
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleCreate = async (formData) => {
        try {
            setSubmitting(true);
            await api.post('/products', formData);
            navigate('/admin');
        } catch (error) {
            alert("Error al crear producto: " + (error.response?.data?.message || error.message));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="container mt-4">
            <ProductForm
                onSubmit={handleCreate}
                isEditing={false}
                isSubmitting={submitting}
            />
        </div>
    );
}
export default AdminAdd;