import { useNavigate, Link } from 'react-router-dom';
import React from "react";
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
    sub: string;
    roles: string[];
    iat: number;
    exp: number;
}

const Dashboard: React.FC<{ setIsAuthenticated: (isAuth: boolean) => void }> = ({ setIsAuthenticated }) => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    let userRoles: string[] = [];
    let username = '';

    if (token) {
        try {
            const decodedToken = jwtDecode<DecodedToken>(token);
            userRoles = decodedToken.roles;
            username = decodedToken.sub;
        } catch (error) {
            console.error("Invalid token:", error);
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        navigate('/');
    };

    const pageStyle: React.CSSProperties = {
        padding: '2rem',
        backgroundColor: 'var(--background)',
    };

    const headerStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center