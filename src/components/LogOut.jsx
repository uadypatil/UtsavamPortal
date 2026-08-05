// components/LogOut.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const LogOut = () => {
    const { logout } = useAuth();
    logout();
    return <Navigate to="/signin" replace />;
};

export default LogOut;
