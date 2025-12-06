import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById, type Product as ApiProduct } from '../api/productService';
import { getCommentsForProduct, createComment, deleteComment } from '../api/commentService';
import { useCart } from '../context/CartContext';
import { type CommentDto } from '../types/dto';
import { jwtDecode } from 'jwt-decode';
import ReactMarkdown from 'react-markdown';

interface DecodedToken {
    roles: string[];
}

const ProductPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { addToCart } = useCart();
    
    const [product, setProduct] = useState<ApiProduct | null>(null);
    const [comments, setComments] = useState<CommentDto[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [userRoles, setUserRoles] = useState<string[]>([]);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        if (!id) return;

        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
            try {
                const decodedToken = jwtDecode<DecodedToken>(token);
                setUserRoles(decodedToken.roles);
            } catch (error) {
                console.error("Invalid token:", error);
            }
        }

        const fetchProductAndComments = async () => {
            try {
                const productId = parseInt(id, 10);
                const productData = await getProductById(id);
                setProduct(productData);

                const commentsData = await getCommentsForProduct(productId);
                setComments(commentsData);
            } catch (err) {
                setError('Nie udało się załadować danych.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        void fetchProductAndComments();
    }, [id]);

    const handleAddToCart = () => {
        if (product) {
            addToCart(product);
            alert(`${product.name} został dodany do koszyka!`);
        }
    };

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id || !newComment.trim()) return;
        const productId = parseInt(id, 10);

        try {
            await createComment(productId, newComment);
            setNewComment('');
            alert("Twój komentarz został dodany i czeka na moderację.");
        } catch (err) {
            console.error("Failed to add comment:", err);
            alert("Nie udało się dodać komentarza.");
        }
    };

    const handleCommentDelete = async (commentId: number) => {
        if (!window.confirm("Czy na pewno chcesz usunąć ten komentarz?")) return;

        try {
            await deleteComment(commentId);
            setComments(comments.filter(c => c.id !== commentId));
        } catch (err) {
            console.error("Failed to delete comment:", err);
            alert("Nie udało się usunąć komentarza.");
        }
    };
    
    const isModeratorOrAdmin = userRoles.includes('ROLE_ADMIN') || userRoles.includes('ROLE_MODERATOR');

    const pageStyle: React.CSSProperties = {
        padding: '2rem',
        backgroundColor: 'var(--background)',
    };

    const containerStyle: React.CSSProperties = {
        maxWidth: '1200px',
        margin: '0 auto',
    };

    const productGridStyle: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '4rem',
        alignItems: 'flex-start',
    };

    const imageStyle: React.CSSProperties = {
        width: '100%',
        height: 'auto',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    };

    const detailsStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
    };

    const titleStyle: React.CSSProperties = {
        fontSize: '2.5rem',
        fontWeight: 'bold',
        color: 'var(--foreground)',
        marginBottom: '1rem',
    };

    const descriptionStyle: React.CSSProperties = {
        fontSize: '1.1rem',
        color: 'var(--muted-foreground)',
        marginBottom: '2rem',
    };

    const priceStyle: React.CSSProperties = {
        fontSize: '2rem',
        fontWeight: 'bold',
        color: 'var(--primary)',
        marginBottom: '2rem',
    };

    const buttonStyle: React.CSSProperties = {
        backgroundColor: 'var(--primary)',
        color: 'var(--primary-foreground)',
        border: 'none',
        padding: '1rem 2rem',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
        fontSize: '1.1rem',
        fontWeight: 'bold',
        transition: 'background-color 0.2s',
        alignSelf: 'flex-start',
    };

    const commentsSectionStyle: React.CSSProperties = {
        marginTop: '4rem',
        paddingTop: '2rem',
        borderTop: '1px solid var(--border)',
    };

    const commentStyle: React.CSSProperties = {
        backgroundColor: 'var(--card)',
        border: '1px solid var(--border)',
        padding: '1.5rem',
        borderRadius: 'var(--radius-lg)',
        marginBottom: '1rem',
        position: 'relative',
    };
    
    const deleteButtonStyle: React.CSSProperties = {
        position: 'absolute',
        top: '1rem',
        right: '1rem',
        background: 'var(--destructive)',
        color: 'var(--destructive-foreground)',
        border: 'none',
        borderRadius: '50%',
        width: '30px',
        height: '30px',
        cursor: 'pointer',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    };

    const statusBadgeStyle = (status: 'PENDING' | 'REJECTED'): React.CSSProperties => ({
        backgroundColor: status === 'PENDING' ? 'var(--color-accent)' : 'var(--color-error)',
        color: 'white',
        padding: '2px 8px',
        borderRadius: '12px',
        fontSize: '0.8rem',
        marginLeft: '10px',
    });

    if (loading) return <div style={pageStyle}>Ładowanie...</div>;
    if (error) return <div style={pageStyle}>{error}</div>;
    if (!product) return <div style={pageStyle}>Produkt nie został znaleziony.</div>;

    return (
        <div style={pageStyle}>
            <div style={containerStyle}>
                <div style={productGridStyle}>
                    <div>
                        <img src={product.imageUrl} alt={product.name} style={imageStyle} />
                    </div>
                    <div style={detailsStyle}>
                        <h1 style={titleStyle}>{product.name}</h1>
                        <p style={descriptionStyle}>{product.description}</p>
                        <p style={priceStyle}>{product.price.toFixed(2)} zł</p>
                        <button onClick={handleAddToCart} style={buttonStyle}>
                            Dodaj do koszyka
                        </button>
                    </div>
                </div>

                <div style={commentsSectionStyle}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>Komentarze ({comments.length})</h2>
                    
                    {comments.map(comment => (
                        <div
                            key={comment.id}
                            style={{
                                ...commentStyle,
                                opacity: comment.status !== 'ACCEPTED' && !isModeratorOrAdmin ? 0.5 : 1
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                                <strong style={{ fontSize: '1.1rem' }}>{comment.authorName}</strong>
                                {isModeratorOrAdmin && comment.status !== 'ACCEPTED' && (
                                    <span style={statusBadgeStyle(comment.status)}>{comment.status}</span>
                                )}
                                <span
                                    style={{
                                        fontSize: '0.9em',
                                        color: 'var(--muted-foreground)',
                                        marginLeft: '1rem'
                                    }}
                                >
                {new Date(comment.createdAt).toLocaleString()}
            </span>
                            </div>

                            {/* Render HTML */}
                            <div
                                className="html-content"
                                style={{ color: 'var(--foreground)' }}
                                dangerouslySetInnerHTML={{ __html: comment.content }}
                            />

                            {isModeratorOrAdmin && (
                                <button
                                    onClick={() => handleCommentDelete(comment.id)}
                                    style={deleteButtonStyle}
                                >
                                    X
                                </button>
                            )}
                        </div>
                    ))
                    }

                    {isAuthenticated && (
                        <form onSubmit={handleCommentSubmit} style={{ marginTop: '2rem' }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Dodaj komentarz</h3>
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                required
                                style={{ width: '100%', minHeight: '120px', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', backgroundColor: 'var(--input)', color: 'var(--foreground)' }}
                            />
                            <button type="submit" style={{ ...buttonStyle, marginTop: '1rem' }}>Wyślij</button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductPage;
