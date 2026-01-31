import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const isAuthenticated = Boolean(localStorage.getItem('token')); // Check if the user is authenticated

    return isAuthenticated ? children : <Navigate to="/auth/login" replace />;
};

export default ProtectedRoute;
