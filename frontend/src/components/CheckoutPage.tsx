import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { createOrder } from '../api/checkoutService';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../api/userService';

const CheckoutPage: React.FC = () => {
    const { cartItems, clearCart } = useCart();
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [country, setCountry] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const currentUser = await getCurrentUser();
                setName(currentUser.shippingName || '');
                setAddress(currentUser.shippingAddress || '');
                setCity(currentUser.shippingCity || '');
                setPostalCode(currentUser.shippingPostalCode || '');
                setCountry(currentUser.shippingCountry || '');
            } catch (error) {
                console.error('Failed to fetch user', error);
            }
        };

        fetchUser();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const orderItems = cartItems.map(item => ({
            productId: item.id,
            quantity: item.quantity,
        }));

        try {
            await createOrder({ orderItems });
            clearCart();
            navigate('/order-confirmation');
        } catch (err) {
            setError('Failed to place order. Please try again.');
            console.error(err);
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--border-radius)', boxShadow: 'var(--box-shadow)' }}>
                <h2>Checkout</h2>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label htmlFor="name">Full Name</label>
                        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--border-radius)', border: '1px solid var(--color-border)' }} />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label htmlFor="address">Address</label>
                        <input type="text" id="address" value={address} onChange={(e) => setAddress(e.target.value)} required style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--border-radius)', border: '1px solid var(--color-border)' }} />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label htmlFor="city">City</label>
                        <input type="text" id="city" value={city} onChange={(e) => setCity(e.target.value)} required style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--border-radius)', border: '1px solid var(--color-border)' }} />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label htmlFor="postalCode">Postal Code</label>
                        <input type="text" id="postalCode" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--border-radius)', border: '1px solid var(--color-border)' }} />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label htmlFor="country">Country</label>
                        <input type="text" id="country" value={country} onChange={(e) => setCountry(e.target.value)} required style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--border-radius)', border: '1px solid var(--color-border)' }} />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label htmlFor="cardNumber">Card Number</label>
                        <input type="text" id="cardNumber" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--border-radius)', border: '1px solid var(--color-border)' }} />
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{ flex: 1 }}>
                            <label htmlFor="expiryDate">Expiry Date</label>
                            <input type="text" id="expiryDate" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} placeholder="MM/YY" style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--border-radius)', border: '1px solid var(--color-border)' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label htmlFor="cvv">CVV</label>
                            <input type="text" id="cvv" value={cvv} onChange={(e) => setCvv(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--border-radius)', border: '1px solid var(--color-border)' }} />
                        </div>
                    </div>
                    <button type="submit" style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--border-radius)', border: 'none', backgroundColor: 'var(--color-primary)', color: 'var(--color-text-on-primary)', cursor: 'pointer' }}>
                        Place Order
                    </button>
                    {error && <p style={{ marginTop: '1rem', color: 'var(--color-error)' }}>{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default CheckoutPage;
