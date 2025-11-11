import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '../api/passwordService';

const ResetPasswordPage: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (!token) {
            setError('Invalid or missing password reset token.');
            return;
        }
        try {
            await resetPassword(token, password);
            setMessage('Your password has been reset successfully. You can now log in with your new password.');
            setError('');
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError('Failed to reset password. The token may be invalid or expired.');
            setMessage('');
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ maxWidth: '400px', margin: '0 auto', padding: '2rem', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--border-radius)', boxShadow: 'var(--box-shadow)' }}>
                <h2>Reset Password</h2>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label htmlFor="password">New Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--border-radius)', border: '1px solid var(--color-border)' }}
                        />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label htmlFor="confirmPassword">Confirm New Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--border-radius)', border: '1px solid var(--color-border)' }}
                        />
                    </div>
                    <button type="submit" style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--border-radius)', border: 'none', backgroundColor: 'var(--color-primary)', color: 'var(--color-text-on-primary)', cursor: 'pointer' }}>
                        Reset Password
                    </button>
                </form>
                {message && <p style={{ marginTop: '1rem', textAlign: 'center', color: 'var(--color-accent)' }}>{message}</p>}
                {error && <p style={{ marginTop: '1rem', textAlign: 'center', color: 'var(--color-error)' }}>{error}</p>}
            </div>
        </div>
    );
};

export default ResetPasswordPage;
