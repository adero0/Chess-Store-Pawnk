import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const CartPage: React.FC = () => {
    const { cartItems, removeFromCart, updateQuantity } = useCart();

    const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const pageStyle: React.CSSProperties = {
        padding: '2rem',
        backgroundColor: 'var(--color-background)',
        color: 'var(--color-text)',
        minHeight: '100vh'
    };

    const containerStyle: React.CSSProperties = {
        maxWidth: '1000px',
        margin: '0 auto'
    };

    const itemStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.5rem',
        marginBottom: '1rem',
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--border-radius)',
        boxShadow: 'var(--box-shadow)'
    };

    const quantityControlsStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
    };

    const buttonStyle: React.CSSProperties = {
        backgroundColor: 'var(--color-primary)',
        color: 'var(--color-text-on-primary)',
        border: 'none',
        padding: '0.5rem 1rem',
        borderRadius: 'var(--border-radius)',
        cursor: 'pointer'
    };

    return (
        <div style={pageStyle}>
            <div style={containerStyle}>
                <h1>Twój Koszyk</h1>
                {cartItems.length === 0 ? (
                    <p>Koszyk jest pusty. <Link to="/">Wróć do sklepu</Link>.</p>
                ) : (
                    <div>
                        {cartItems.map(item => (
                            <div key={item.id} style={itemStyle}>
                                <div>
                                    <h3 style={{ marginBottom: '0.5rem' }}>{item.name}</h3>
                                    <p>{item.price.toFixed(2)} zł x {item.quantity}</p>
                                </div>
                                <div style={quantityControlsStyle}>
                                    <button style={buttonStyle} onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                                    <span>{item.quantity}</span>
                                    <button style={buttonStyle} onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                    <button style={{...buttonStyle, backgroundColor: 'var(--color-error)'}} onClick={() => removeFromCart(item.id)}>Usuń</button>
                                </div>
                            </div>
                        ))}
                        <div style={{ marginTop: '2rem', textAlign: 'right' }}>
                            <h2>Łącznie: {total.toFixed(2)} zł</h2>
                            <Link to="/checkout" style={{...buttonStyle, padding: '1rem 2rem', marginTop: '1rem', textDecoration: 'none'}}>Przejdź do płatności</Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;
