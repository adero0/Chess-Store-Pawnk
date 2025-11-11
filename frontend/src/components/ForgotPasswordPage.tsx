import React, { useState } from 'react';
import { requestPasswordReset } from '../api/passwordService';

const ForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await requestPasswordReset(email);
            setMessage('A password reset link has been sent to your email address.');
            setError('');
        } catch (err) {
            setError('Failed to send password reset email. Please check the email address and try again.');
            setMessage('');
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ maxWidth: '400px', margin: '0 auto', padding: '2rem', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--border-radius)', boxShadow: 'var(--box-shadow)' }}>
                <h2>Forgot Password</h2>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--border-radius)', border: '1px solid var(--color-border)' }}
                        />
                    </div>
                    <button type="submit" style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--border-radius)', border: 'none', backgroundColor: 'var(--color-primary)', color: 'var(--color-text-on-primary)', cursor: 'pointer' }}>
                        Send Password Reset Email
                    </button>
                </form>
                {message && <p style={{ marginTop: '1rem', textAlign: 'center', color: 'var(--color-accent)' }}>{message}</p>}
                {error && <p style={{ marginTop: '1rem', textAlign: 'center', color: 'var(--color-error)' }}>{error}</p>}
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
