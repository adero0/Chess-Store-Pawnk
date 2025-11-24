import React, { useEffect, useState } from 'react';
import { getPendingComments, updateCommentStatus } from '../api/commentService';
import type { CommentDto } from '../types/dto';

const CommentVerificationPage: React.FC = () => {
    const [pendingComments, setPendingComments] = useState<CommentDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPendingComments = async () => {
        try {
            setLoading(true);
            const comments = await getPendingComments();
            setPendingComments(comments);
        } catch (err) {
            setError('Failed to fetch pending comments.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingComments();
    }, []);

    const handleUpdateStatus = async (commentId: number, status: 'ACCEPTED' | 'REJECTED') => {
        try {
            await updateCommentStatus(commentId, status);
            fetchPendingComments(); // Refresh the list
        } catch (err) {
            setError('Failed to update comment status.');
            console.error(err);
        }
    };

    if (loading) {
        return <div style={{ padding: '2rem' }}>Loading...</div>;
    }

    if (error) {
        return <div style={{ padding: '2rem', color: 'var(--color-error)' }}>{error}</div>;
    }

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Weryfikacja Komentarzy</h1>
            {pendingComments.length === 0 ? (
                <p>No pending comments.</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                    <thead>
                        <tr style={{ backgroundColor: 'var(--color-surface)' }}>
                            <th style={{ padding: '0.75rem', border: '1px solid var(--color-border)', textAlign: 'left' }}>Produkt</th>
                            <th style={{ padding: '0.75rem', border: '1px solid var(--color-border)', textAlign: 'left' }}>Autor</th>
                            <th style={{ padding: '0.75rem', border: '1px solid var(--color-border)', textAlign: 'left' }}>Komentarz</th>
                            <th style={{ padding: '0.75rem', border: '1px solid var(--color-border)', textAlign: 'left' }}>Akcje</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendingComments.map(comment => (
                            <tr key={comment.id} style={{ backgroundColor: 'var(--color-background)' }}>
                                <td style={{ padding: '0.75rem', border: '1px solid var(--color-border)' }}>{comment.productName}</td>
                                <td style={{ padding: '0.75rem', border: '1px solid var(--color-border)' }}>{comment.authorName}</td>
                                <td style={{ padding: '0.75rem', border: '1px solid var(--color-border)' }}>{comment.content}</td>
                                <td style={{ padding: '0.75rem', border: '1px solid var(--color-border)' }}>
                                    <button onClick={() => handleUpdateStatus(comment.id, 'ACCEPTED')} style={{ marginRight: '10px' }}>Zatwierdź</button>
                                    <button onClick={() => handleUpdateStatus(comment.id, 'REJECTED')} style={{ backgroundColor: 'var(--color-error)', color: 'var(--color-text-on-primary)'}}>Odrzuć</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default CommentVerificationPage;
