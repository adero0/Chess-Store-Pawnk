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

    const cardHoverStyle: React.CSSProperties = {
        transform: 'translateY(-5px)',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
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
            <p style={{ fontSize: '1.2rem', color: 'var(--muted-foreground)', marginBottom: '3rem' }}>
                Zarządzaj swoim kontem i zawartością sklepu.
            </p>

            <div style={gridStyle}>
                {isAdminOrModerator && (
                    <Link
                        to="/admin/comments"
                        style={cardStyle}
                        onMouseEnter={(e) => {
                            Object.assign(e.currentTarget.style, cardHoverStyle);
                        }}
                        onMouseLeave={(e) => {
                            Object.assign(e.currentTarget.style, {
                                transform: 'none',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                            });
                        }}
                    >
                        <svg style={cardIconStyle} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
                        </svg>
                        <h2 style={cardTitleStyle}>Weryfikacja Komentarzy</h2>
                        <p style={cardDescriptionStyle}>Zarządzaj i zatwierdzaj komentarze użytkowników.</p>
                    </Link>
                )}

                {isAdminOrModerator && (
                    <Link
                        to="/admin/slider"
                        style={cardStyle}
                        onMouseEnter={(e) => {
                            Object.assign(e.currentTarget.style, cardHoverStyle);
                        }}
                        onMouseLeave={(e) => {
                            Object.assign(e.currentTarget.style, {
                                transform: 'none',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                            });
                        }}
                    >
                        <svg style={cardIconStyle} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M10 8H8v4H5l4 4 4-4h-3z"/>
                        </svg>
                        <h2 style={cardTitleStyle}>Zarządzanie Slajderem</h2>
                        <p style={cardDescriptionStyle}>Konfiguruj produkty na slajderze głównym.</p>
                    </Link>
                )}

                {isAdminOrModerator && (
                    <Link
                        to="/admin/add-product"
                        style={cardStyle}
                        onMouseEnter={(e) => {
                            Object.assign(e.currentTarget.style, cardHoverStyle);
                        }}
                        onMouseLeave={(e) => {
                            Object.assign(e.currentTarget.style, {
                                transform: 'none',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                            });
                        }}
                    >
                        <svg style={cardIconStyle} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                        </svg>
                        <h2 style={cardTitleStyle}>Dodaj Produkt</h2>
                        <p style={cardDescriptionStyle}>Dodaj nowy produkt z obrazem do sklepu.</p>
                    </Link>
                )}

                {isAdmin && (
                    <Link
                        to="/admin/users"
                        style={cardStyle}
                        onMouseEnter={(e) => {
                            Object.assign(e.currentTarget.style, cardHoverStyle);
                        }}
                        onMouseLeave={(e) => {
                            Object.assign(e.currentTarget.style, {
                                transform: 'none',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                            });
                        }}
                    >
                        <svg style={cardIconStyle} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                        <h2 style={cardTitleStyle}>Zarządzanie Użytkownikami</h2>
                        <p style={cardDescriptionStyle}>Edytuj role i dane użytkowników.</p>
                    </Link>
                )}

                {isAdmin && (
                    <Link
                        to="/admin/theme"
                        style={cardStyle}
                        onMouseEnter={(e) => {
                            Object.assign(e.currentTarget.style, cardHoverStyle);
                        }}
                        onMouseLeave={(e) => {
                            Object.assign(e.currentTarget.style, {
                                transform: 'none',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                            });
                        }}
                    >
                        <svg style={cardIconStyle} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                        </svg>
                        <h2 style={cardTitleStyle}>Zarządzanie Motywem</h2>
                        <p style={cardDescriptionStyle}>Dostosuj kolory główne strony.</p>
                    </Link>
                )}

                {isAdmin && (
                    <Link
                        to="/orders"
                        style={cardStyle}
                        onMouseEnter={(e) => {
                            Object.assign(e.currentTarget.style, cardHoverStyle);
                        }}
                        onMouseLeave={(e) => {
                            Object.assign(e.currentTarget.style, {
                                transform: 'none',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                            });
                        }}
                    >
                        <svg style={cardIconStyle} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M3 3v18h18V3H3zm16 16H5V5h14v14z"/>
                        </svg>
                        <h2 style={cardTitleStyle}>Zarządzanie Zamówieniami</h2>
                        <p style={cardDescriptionStyle}>Zarządzaj statusami zamówień użytkowników.</p>
                    </Link>
                )}

                <Link
                    to="/orders"
                    style={cardStyle}
                    onMouseEnter={(e) => {
                        Object.assign(e.currentTarget.style, cardHoverStyle);
                    }}
                    onMouseLeave={(e) => {
                        Object.assign(e.currentTarget.style, {
                            transform: 'none',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                        });
                    }}
                >
                    <svg style={cardIconStyle} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                    </svg>
                    <h2 style={cardTitleStyle}>Historia Zamówień</h2>
                    <p style={cardDescriptionStyle}>Sprawdź swoje zamówienia i statusy dostaw.</p>
                </Link>

                <Link
                    to="/shipping-details"
                    style={cardStyle}
                    onMouseEnter={(e) => {
                        Object.assign(e.currentTarget.style, cardHoverStyle);
                    }}
                    onMouseLeave={(e) => {
                        Object.assign(e.currentTarget.style, {
                            transform: 'none',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                        });
                    }}
                >
                    <svg style={cardIconStyle} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                    </svg>
                    <h2 style={cardTitleStyle}>Adres Wysyłki</h2>
                    <p style={cardDescriptionStyle}>Zarządzaj swoim adresem wysyłki.</p>
                </Link>
            </div>
        </div>
    );
};

export default Dashboard;
