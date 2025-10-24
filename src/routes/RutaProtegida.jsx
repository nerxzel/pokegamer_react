import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../hooks/useUser';

const RutaProtegida = ({ allowedRole = null }) => {
    const { isLoggedIn, isAdmin } = useUser();
    
    if (!isLoggedIn) {
        return <Navigate to="/usuario" replace />;
    }

    if (allowedRole === 'ADMIN') {
        if (isAdmin()) {

            return <Outlet />;
        } else {
            alert("Acceso denegado: Se requieren permisos de Administrador.");
            return <Navigate to="/" replace />; 
        }
    }

    return <Outlet />;
};

export default RutaProtegida;