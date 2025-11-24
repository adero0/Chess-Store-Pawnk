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
        alignItems: 'center',
        marginBottom: '3rem',
    };

    const titleStyle: React.CSSProperties = {
        fontSize: '2.5rem',
        fontWeight: 'bold',
        color: 'var(--foreground)',
    };

    const logoutButtonStyle: React.CSSProperties = {
        backgroundColor: 'var(--destructive)',
        color: 'var(--destructive-foreground)',
        border: 'none',
        padding: '0.8rem 1.5rem',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: 'bold',
    };

    const gridStyle: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
    };

    const cardStyle: React.CSSProperties = {
        backgroundColor: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '2rem',
        textDecoration: 'none',
        color: 'var(--foreground)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        position: 'relative',
    };

    const cardIconStyle: React.CSSProperties = {
        width: '48px',
        height: '48px',
        marginBottom: '1.5rem',
        color: 'var(--primary)',
    };

    const cardTitleStyle: React.CSSProperties = {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        marginBottom: '0.5rem',
    };

    const cardDescriptionStyle: React.CSSProperties = {
        color: 'var(--muted-foreground)',
        marginBottom: '1.5rem',
    };

    const isAdminOrModerator = userRoles.includes('ROLE_ADMIN') || userRoles.includes('ROLE_MODERATOR');
    const isAdmin = userRoles.includes('ROLE_ADMIN');

    return (
        <div style={pageStyle}>
            <div style={headerStyle}>
                <h1 style={titleStyle}>Witaj, {username}!</h1>
                <button onClick={handleLogout} style={logoutButtonStyle}>
                    Wyloguj
                </button>
            </div>
            <p style={{ fontSize: '1.2rem', color: 'var(--muted-foreground)', marginBottom: '3rem' }}>Zarządzaj swoim kontem i zawartością sklepu.</p>

            <div style={gridStyle}>
                {isAdminOrModerator && (
                     <Link to="/admin/comments" style={cardStyle}
                     onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; }}
                     onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}>
                   <svg style={cardIconStyle} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>
                   <h2 style={cardTitleStyle}>Weryfikacja Komentarzy</h2>
                   <p style={cardDescriptionStyle}>Zarządzaj i zatwierdzaj komentarze użytkowników.</p>
               </Link>
                )}

                {isAdminOrModerator && (
                    <Link to="/admin/slider" style={cardStyle}
                          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; }}
                          onMouseLeave={e =>