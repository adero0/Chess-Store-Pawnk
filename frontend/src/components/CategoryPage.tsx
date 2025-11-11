import React, {useEffect, useState} from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductsByCategory, type Product } from '../api/productService';

const CategoryPage: React.FC = () => {
    const { categoryName = '' } = useParams<{ categoryName: string }>();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getProductsByCategory(categoryName);
                setProducts(data);
            } catch (err) {
                setError('Nie udało się załadować produktów.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        void fetchProducts();
    }, [categoryName]);

    const pageStyle: React.CSSProperties = {
        backgroundColor: 'var(--color-background)',
        color: 'var(--color-text)',
        padding: '2rem',
        minHeight: '100vh'
    };

    const gridStyle: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '2rem',
    };

    const getCardStyle = (isHovered: boolean): React.CSSProperties => ({
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--border-radius)',
        padding: '1.5rem',
        textDecoration: 'none',
        color: 'var(--color-text)',
        boxShadow: isHovered ? 'var(--box-shadow-lg, 0 8px 25px rgba(0,0,0,0.15))' : 'var(--box-shadow)',
        transform: isHovered ? 'translateY(-4px)' : 'none',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    });

    const cardImageStyle: React.CSSProperties = {
        width: '100%',
        height: '180px',
        objectFit: 'cover',
        borderRadius: 'var(--border-radius)',
        marginBottom: '1rem'
    };

    return (
        <div style={pageStyle}>
            <h1 style={{ marginBottom: '2rem' }}>Kategoria: {categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}</h1>
            {loading && <p>Ładowanie produktów...</p>}
            {error && <p style={{ color: 'var(--color-error)' }}>{error}</p>}
            {!loading && !error && products.length > 0 ? (
                <div style={gridStyle}>
                    {products.map(product => (
                        <Link 
                            to={`/product/${product.id}`} 
                            key={product.id} 
                            style={getCardStyle(hoveredId === product.id.toString())}
                            onMouseEnter={() => setHoveredId(product.id.toString())}
                            onMouseLeave={() => setHoveredId(null)}
                        >
                            <img src={product.imageUrl} alt={product.name} style={cardImageStyle} />
                            <h3 style={{ margin: '0.5rem 0' }}>{product.name}</h3>
                            <p style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>{product.price.toFixed(2)} zł</p>
                        </Link>
                    ))}
                </div>
            ) : (
                !loading && !error && <p>Brak produktów w tej kategorii.</p>
            )}
        </div>
    );
};

export default CategoryPage;
