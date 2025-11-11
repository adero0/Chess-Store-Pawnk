import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Slider from './Slider';
import { getProducts, type Product } from '../api/productService';

const Home: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getProducts();
                setProducts(data);
            } catch (err) {
                setError('Nie udało się załadować produktów.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const heroStyle: React.CSSProperties = {
        textAlign: 'center',
        padding: '4rem 2rem',
        backgroundColor: 'var(--color-card)',
        borderRadius: 'var(--radius-lg)',
        marginBottom: '3rem',
    };

    const heroTitleStyle: React.CSSProperties = {
        fontSize: '3rem',
        fontWeight: 'bold',
        color: 'var(--color-primary)',
        marginBottom: '1rem',
    };

    const heroSubtitleStyle: React.CSSProperties = {
        fontSize: '1.25rem',
        color: 'var(--color-muted-foreground)',
        marginBottom: '2rem',
    };

    const ctaButtonStyle: React.CSSProperties = {
        backgroundColor: 'var(--color-primary)',
        color: 'var(--color-primary-foreground)',
        padding: '1rem 2rem',
        borderRadius: 'var(--radius-md)',
        textDecoration: 'none',
        fontWeight: 'bold',
        transition: 'background-color 0.2s',
    };

    const gridStyle: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '2rem',
        marginTop: '3rem'
    };

    const cardStyle: React.CSSProperties = {
        backgroundColor: 'var(--color-card)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.5rem',
        textDecoration: 'none',
        color: 'var(--color-foreground)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        transition: 'transform 0.2s, box-shadow 0.2s',
    };

    const cardImageStyle: React.CSSProperties = {
        width: '100%',
        height: '180px',
        objectFit: 'cover',
        borderRadius: 'var(--radius-md)',
        marginBottom: '1rem'
    };

    return (
        <div style={{ padding: '2rem' }}>
            <div style={heroStyle}>
                <h1 style={heroTitleStyle}>Witaj w Świecie Szachów</h1>
                <p style={heroSubtitleStyle}>Odkryj naszą kolekcję ekskluzywnych szachów, akcesoriów i książek.</p>
                <Link to="/category/Zestawy" style={ctaButtonStyle}>
                    Zobacz Nasze Zestawy
                </Link>
            </div>
            
            <Slider />

            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '3rem', marginBottom: '1rem', color: 'var(--color-foreground)' }}>Polecane Produkty</h2>

            {loading && <p>Ładowanie produktów...</p>}
            {error && <p style={{ color: 'var(--color-destructive)' }}>{error}</p>}
            
            {!loading && !error && (
                <div style={gridStyle}>
                    {products.map(product => (
                        <Link to={`/product/${product.id}`} key={product.id} style={cardStyle} 
                              onMouseEnter={e => {
                                  e.currentTarget.style.transform = 'translateY(-5px)';
                                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                              }}
                              onMouseLeave={e => {
                                  e.currentTarget.style.transform = 'none';
                                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
                              }}>
                            <img src={product.imageUrl} alt={product.name} style={cardImageStyle} />
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: '0.5rem 0' }}>{product.name}</h3>
                            <p style={{ color: 'var(--color-primary)', fontWeight: 'bold', fontSize: '1.2rem' }}>{product.price.toFixed(2)} zł</p>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;
