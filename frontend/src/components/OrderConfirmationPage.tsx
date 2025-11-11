import React from 'react';
import { Link } from 'react-router-dom';

const OrderConfirmationPage: React.FC = () => {
    return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--border-radius)', boxShadow: 'var(--box-shadow)' }}>
                <h2>Thank you for your order!</h2>
                <p>A confirmation email has been sent to your email address.</p>
                <p>Your estimated delivery date is 5 days from now.</p>
                <Link to="/" style={{ marginTop: '2rem', display: 'inline-block', textDecoration: 'none', padding: '0.75rem 1.5rem', borderRadius: 'var(--border-radius)', backgroundColor: 'var(--color-primary)', color: 'var(--color-text-on-primary)' }}>
                    Continue Shopping
                </Link>
            </div>
        </div>
    );
};

export default OrderConfirmationPage;
