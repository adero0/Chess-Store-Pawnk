import React, { useEffect, useState } from 'react';
import { getMyOrders } from '../api/orderService';
import type { OrderDto } from '../types/dto';

const OrderHistoryPage: React.FC = () => {
    const [orders, setOrders] = useState<OrderDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const userOrders = await getMyOrders();
                setOrders(userOrders);
            } catch (err) {
                setError('Failed to fetch order history.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return <div style={{ padding: '2rem' }}>Loading order history...</div>;
    }

    if (error) {
        return <div style={{ padding: '2rem', color: 'var(--color-error)' }}>{error}</div>;
    }

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Moje Zamówienia</h1>
            {orders.length === 0 ? (
                <p>Nie masz żadnych zamówień.</p>
            ) : (
                orders.map(order => (
                    <div key={order.id} style={{
                        backgroundColor: 'var(--card)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '1.5rem',
                        marginBottom: '1.5rem'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <div>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Zamówienie #{order.id}</h2>
                                <p style={{ color: 'var(--muted-foreground)' }}>
                                    Złożono: {new Date(order.orderDate).toLocaleDateString()}
                                </p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Suma: {order.totalPrice.toFixed(2)} zł</p>
                                <p style={{ color: 'var(--muted-foreground)' }}>Status: {order.status}</p>
                            </div>
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Przedmioty:</h3>
                            <ul>
                                {order.orderItems.map(item => (
                                    <li key={item.productId} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>{item.productName} (x{item.quantity})</span>
                                        <span>{(item.price * item.quantity).toFixed(2)} zł</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                         <p style={{ color: 'var(--muted-foreground)', marginTop: '1rem' }}>
                                    Przewidywana data dostawy: {new Date(order.deliveryDate).toLocaleDateString()}
                                </p>
                    </div>
                ))
            )}
        </div>
    );
};

export default OrderHistoryPage;
