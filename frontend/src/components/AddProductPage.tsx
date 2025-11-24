import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProduct } from '../api/productService';
import { getAllCategories } from '../api/categoryService';
import { type CategoryDto } from '../types/dto';

const AddProductPage: React.FC = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [categoryName, setCategoryName] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [categories, setCategories] = useState<CategoryDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getAllCategories();
                setCategories(data);
            } catch (err) {
                setError('Nie udało się załadować kategorii.');
                console.error(err);
            }
        };
        fetchCategories();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !description || !price || !categoryName || !image) {
            setError('Wypełnij wszystkie pola.');
            return;
        }

        setLoading(true);
        setError(null);

        const formData = new FormData();
        const productData = {
            name,
            description,
            price: parseFloat(price),
            categoryName,
            imageUrl: '' // Wypełniane przez backend
        };
        formData.append('product', new Blob([JSON.stringify(productData)], { type: 'application/json' }));
        formData.append('image', image);

        try {
            await createProduct(formData);
            alert('Produkt został dodany pomyślnie!');
            navigate('/dashboard');
        } catch (err) {
            setError('Błąd podczas dodawania produktu. Sprawdź uprawnienia lub spróbuj ponownie.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const pageStyle: React.CSSProperties = {
        padding: '2rem',
        backgroundColor: 'var(--background)',
        minHeight: '100vh'
    };

    const formStyle: React.CSSProperties = {
        maxWidth: '600px',
        margin: '0 auto',
        backgroundColor: 'var(--card)',
        padding: '2rem',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    };

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '0.75rem',
        marginBottom: '1rem',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'var(--input)',
        color: 'var(--foreground)'
    };

    const selectStyle: React.CSSProperties = {
        ...inputStyle,
        padding: '0.75rem 0.5rem'
    };

    const buttonStyle: React.CSSProperties = {
        width: '100%',
        padding: '1rem',
        backgroundColor: 'var(--primary)',
        color: 'var(--primary-foreground)',
        border: 'none',
        borderRadius: 'var(--radius-md)',
        fontSize: '1.1rem',
        fontWeight: 'bold',
        cursor: 'pointer'
    };

    return (
        <div style={pageStyle}>
            <h1 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '2rem', color: 'var(--foreground)' }}>
                Dodaj Nowy Produkt
            </h1>
            <form onSubmit={handleSubmit} style={formStyle}>
                <input
                    type="text"
                    placeholder="Nazwa produktu"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={inputStyle}
                    required
                />
                <textarea
                    placeholder="Opis produktu"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }}
                    required
                />
                <input
                    type="number"
                    placeholder="Cena (zł)"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    step="0.01"
                    min="0"
                    style={inputStyle}
                    required
                />
                <select
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    style={selectStyle}
                    required
                >
                    <option value="">Wybierz kategorię</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                </select>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files?.[0] || null)}
                    style={{ ...inputStyle, padding: '0.5rem' }}
                    required
                />
                {error && <p style={{ color: 'var(--destructive)', marginBottom: '1rem' }}>{error}</p>}
                <button type="submit" disabled={loading} style={buttonStyle}>
                    {loading ? 'Dodawanie...' : 'Dodaj Produkt'}
                </button>
            </form>
        </div>
    );
};

export default AddProductPage;
