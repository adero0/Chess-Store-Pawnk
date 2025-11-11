import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface ProtectedRouteProps {
    children: React.ReactElement;
    roles?: string[];
}

interface DecodedToken {
    sub: string;
    roles: string[];
    iat: number;
    exp: number;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/login" />;
    }

    try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        const userRoles = decodedToken.roles;

        if (roles && roles.length > 0) {
            const hasRequiredRole = roles.some(role => userRoles.includes(role));
            if (!hasRequiredRole) {
                return <Navigate to="/" />;
            }
        }

        return children;
    } catch (error) {
        console.error("Invalid token:", error);
        return <Navigate to="/login" />;
    }
};

export default ProtectedRoute;
