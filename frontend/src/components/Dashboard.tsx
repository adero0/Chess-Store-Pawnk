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
                          onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}>
                        <svg style={cardIconStyle} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16l-3.99-4zM15 11l-2.5 3.01L10 11l-4 5h14l-5-6.01z"/></svg>
                        <h2 style={cardTitleStyle}>Zarządzaj Slajderem</h2>
                        <p style={cardDescriptionStyle}>Zmieniaj kolejność i zawartość slajdera na stronie głównej.</p>
                    </Link>
                )}

                {isAdmin && (
                    <Link to="/admin/users" style={cardStyle}
                          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; }}
                          onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}>
                        <svg style={cardIconStyle} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
                        <h2 style={cardTitleStyle}>Zarządzanie Użytkownikami</h2>
                        <p style={cardDescriptionStyle}>Zarządzaj użytkownikami, rolami i uprawnieniami.</p>
                    </Link>
                )}

                <Link to="/orders" style={cardStyle}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}>
                    <svg style={cardIconStyle} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm0 15l-4-4h3V9h2v5h3l-4 4z"/></svg>
                    <h2 style={cardTitleStyle}>Moje Zamówienia</h2>
                    <p style={cardDescriptionStyle}>Śledź i zarządzaj swoimi zamówieniami.</p>
                </Link>
                
                <Link to="/cart" style={cardStyle}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}>
                    <svg style={cardIconStyle} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.9 2 1.99 2 2-.9 2-2-.9-2-2-2z"/></svg>
                    <h2 style={cardTitleStyle}>Mój Koszyk</h2>
                    <p style={cardDescriptionStyle}>Przeglądaj i zarządzaj przedmiotami w swoim koszyku.</p>
                </Link>
            </div>
        </div>
    );
};

export default Dashboard;