
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Auth: React.FC<{ setIsAuthenticated: (isAuth: boolean) => void }> = ({ setIsAuthenticated }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/auth/signin', {
                username,
                password,
            });
            localStorage.setItem('token', response.data.accessToken);
            setIsAuthenticated(true);
            navigate('/dashboard');

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            setMessage('Login failed. Please check your credentials.');
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/auth/signup', {
                username,
                email,
                password,
            });
            setMessage(response.data.message + ' Now you can log in.');
            setIsLogin(true);

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            setMessage('Registration failed. Please try again.');
        }
    };

    return (
        <div style={{ fontFamily: 'var(--font-family)', color: 'var(--color-text)', backgroundColor: 'var(--color-background)', padding: '2rem' }}>
            <div style={{ maxWidth: '400px', margin: '0 auto', padding: '2rem', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--border-radius)', boxShadow: 'var(--box-shadow)' }}>
                <h2>{isLogin ? 'Login' : 'Register'}</h2>
                <form onSubmit={isLogin ? handleLogin : handleRegister}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--border-radius)', border: '1px solid var(--color-border)' }}
                        />
                    </div>
                    {!isLogin && (
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
                    )}
                    <div style={{ marginBottom: '1rem' }}>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--border-radius)', border: '1px solid var(--color-border)' }}
                        />
                    </div>
                    <button type="submit" style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--border-radius)', border: 'none', backgroundColor: 'var(--color-primary)', color: 'var(--color-text-on-primary)', cursor: 'pointer' }}>
                        {isLogin ? 'Login' : 'Register'}
                    </button>
                </form>
                <p style={{ marginTop: '1rem', textAlign: 'center' }}>
                    <Link to="/forgot-password" style={{ color: 'var(--color-primary)' }}>Forgot Password?</Link>
                </p>
                <p style={{ marginTop: '1rem', textAlign: 'center' }}>
                    {isLogin ? "Don't have an account?" : 'Already have an account?'}
                    <button onClick={() => setIsLogin(!isLogin)} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', marginLeft: '0.5rem' }}>
                        {isLogin ? 'Register' : 'Login'}
                    </button>
                </p>
                {message && <p style={{ marginTop: '1rem', textAlign: 'center', color: 'var(--color-accent)' }}>{message}</p>}
            </div>
        </div>
    );
};

export default Auth;
