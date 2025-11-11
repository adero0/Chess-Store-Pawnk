import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { type Product } from '../api/productService';
import apiClient from '../api/axiosConfig';

interface SliderConfig {
    products: Product[];
}

const Slider: React.FC = () => {
    const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));
    const [slides, setSlides] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSlides = async () => {
            try {
                const response = await apiClient.get<SliderConfig>('/slider-config');
                setSlides(response.data.products);
            } catch (err) {
                setError('Nie udało się załadować produktów do slajdera.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        void fetchSlides();
    }, []);

    if (loading) return <div className="w-full max-w-2xl mx-auto px-1">Ładowanie slajdera...</div>;
    if (error) return <div className="w-full max-w-2xl mx-auto px-1" style={{ color: 'var(--color-error)' }}>{error}</div>;

    return (
        <div className="w-full max-w-2xl mx-auto px-1">
            <Carousel
                opts={{ align: "start", loop: true }}
                plugins={[plugin.current]}
                className="w-full"
            >
                <CarouselContent className="items-start">
                    {slides.map((slide) => (
                        <CarouselItem
                            key={slide.id}
                            className="basis-1/3 sm:basis-1/4 md:basis-1/6 flex-shrink-0"
                        >
                            <Link to={`/product/${slide.id}`} className="flex flex-col items-center text-current no-underline">
                                <div
                                    style={{ height: "400px", width: "100%" }}
                                    className="overflow-hidden rounded-md"
                                >
                                    <img
                                        src={slide.imageUrl}
                                        alt={slide.name}
                                        className="w-full h-full object-cover object-center"
                                    />
                                </div>
                                {/* Increased caption font size */}
                                <p className="text-[20px] font-bold text-xs text-center truncate mt-2">
                                    {slide.name}
                                </p>
                                {/* Increased description font size */}
                                <p className="text-[14px] sm:text-xs text-gray-600 text-center line-clamp-2 mt-1 px-1">
                                    {slide.description}
                                </p>
                            </Link>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="scale-75 -ml-3" />
                <CarouselNext className="scale-75 -mr-3" />
            </Carousel>
        </div>
    );
};

export default Slider;