import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent, useDroppable } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { getProducts, type Product } from '../api/productService';
import apiClient from '../api/axiosConfig';

interface SliderConfig {
    id: number;
    products: Product[];
    displayCount: number;
}

const SortableItem: React.FC<{ id: Product, children: React.ReactNode }> = ({ id, children }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: id.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        padding: '10px',
        border: '1px solid #ccc',
        marginBottom: '5px',
        backgroundColor: 'white',
        cursor: 'grab',
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {children}
        </div>
    );
};

const DroppableContainer: React.FC<{ id: string, children: React.ReactNode }> = ({ id, children }) => {
    const { setNodeRef } = useDroppable({ id });

    return (
        <div ref={setNodeRef} style={{ border: '1px solid black', padding: '10px', minHeight: '400px', width: '300px' }}>
            {children}
        </div>
    );
}

const SliderManagementPage: React.FC = () => {
    const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
    const [sliderProducts, setSliderProducts] = useState<Product[]>([]);
    const [configId, setConfigId] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsResponse, sliderConfigResponse] = await Promise.all([
                    getProducts(),
                    apiClient.get<SliderConfig>(`/slider-config`)
                ]);

                const allProducts = productsResponse;
                const currentSliderConfig = sliderConfigResponse.data;
                const currentSliderProducts = currentSliderConfig.products || [];

                setConfigId(currentSliderConfig.id);
                setSliderProducts(currentSliderProducts);
                setAvailableProducts(allProducts.filter(p => !currentSliderProducts.some(sp => sp.id === p.id)));
            } catch (err) {
                setError('Nie udało się załadować danych.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        void fetchData();
    }, []);

    const findContainer = (id: any): string | null => {
        if (sliderProducts.some(p => p.id === id)) {
            return 'slider-products';
        }
        if (availableProducts.some(p => p.id === id)) {
            return 'available-products';
        }
        return null;
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const activeContainer = findContainer(activeId);
        const overContainer = findContainer(overId) || (overId === 'available-products' ? 'available-products' : 'slider-products');

        if (!activeContainer || !overContainer) return;

        if (activeContainer !== overContainer) {
            if (activeContainer === 'available-products') {
                const productToMove = availableProducts.find(p => p.id === activeId);
                if (productToMove) {
                    setAvailableProducts(prev => prev.filter(p => p.id !== activeId));
                    setSliderProducts(prev => [...prev, productToMove]);
                }
            } else {
                const productToMove = sliderProducts.find(p => p.id === activeId);
                if (productToMove) {
                    setSliderProducts(prev => prev.filter(p => p.id !== activeId));
                    setAvailableProducts(prev => [...prev, productToMove]);
                }
            }
        }
        else {
            if (activeContainer === 'slider-products') {
                setSliderProducts((items) => {
                    const oldIndex = items.findIndex(item => item.id === activeId);
                    const newIndex = items.findIndex(item => item.id === overId);
                    if (oldIndex !== -1 && newIndex !== -1) {
                        return arrayMove(items, oldIndex, newIndex);
                    }
                    return items;
                });
            }
        }
    };

    const handleSave = async () => {
        if (configId === null) {
            setError('Nie udało się zidentyfikować konfiguracji slajdera.');
            return;
        }
        try {
            await apiClient.put(`/slider-config`, { id: configId, products: sliderProducts });
            alert('Konfiguracja slajdera została zapisana.');
        } catch (err) {
            setError('Nie udało się zapisać konfiguracji slajdera.');
            console.error(err);
        }
    };

    if (loading) return <div>Ładowanie...</div>;
    if (error) return <div style={{ color: 'var(--color-error)' }}>{error}</div>;

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <div style={{ display: 'flex', justifyContent: 'space-around', padding: '20px' }}>
                <div>
                    <h2>Dostępne Produkty</h2>
                    <DroppableContainer id="available-products">
                        <SortableContext items={availableProducts.map(p => p.id)} strategy={verticalListSortingStrategy}>
                            {availableProducts.map(product => (
                                <SortableItem key={product.id} id={product}>
                                    {product.name}
                                </SortableItem>
                            ))}
                        </SortableContext>
                    </DroppableContainer>
                </div>
                <div>
                    <h2>Produkty w Slajderze</h2>
                    <DroppableContainer id="slider-products">
                        <SortableContext items={sliderProducts.map(p => p.id)} strategy={verticalListSortingStrategy}>
                            {sliderProducts.map(product => (
                                <SortableItem key={product.id} id={product}>
                                    {product.name}
                                </SortableItem>
                            ))}
                        </SortableContext>
                    </DroppableContainer>
                </div>
            </div>
            <button onClick={handleSave} style={{ marginTop: '20px' }}>Zapisz</button>
        </DndContext>
    );
};

export default SliderManagementPage;
