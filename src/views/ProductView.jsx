import React, { useRef } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { useCart } from '../contexts/CartContext';
import { ProductCard } from '../components/product/ProductCard';
import { SmartImage } from '../components/ui/SmartImage';
import { allProducts } from '../utils/data';

export const ProductView = () => {
    const { 
        selectedProduct, navigateTo, 
        setSelectedCategory, activeNav 
    } = useAppContext();
    const { addToCart } = useCart();
    
    const carouselRef = useRef(null);

    const scrollCarousel = (direction) => {
        if (carouselRef.current) {
            const scrollAmount = direction === 'left' ? -300 : 300;
            carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    if (!selectedProduct) return null;

    let similarProducts = allProducts.filter(p => p.id !== selectedProduct.id);
    similarProducts.sort((a, b) => (a.category === selectedProduct.category ? -1 : 1) - (b.category === selectedProduct.category ? -1 : 1));
    similarProducts = similarProducts.slice(0, 8);

    const handleSelectProduct = (product) => {
        navigateTo('product', activeNav, product);
    };

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="py-2 text-sm text-gray-500 dark:text-gray-400 font-medium mb-6 flex items-center gap-2">
                <span onClick={() => navigateTo('shop', 'Напої')} className="hover:text-primary cursor-pointer transition-colors flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Назад до каталогу
                </span>
                <span className="mx-2 text-gray-300 dark:text-gray-600">|</span>
                <span onClick={() => { setSelectedCategory(selectedProduct.category); navigateTo('shop', 'Напої'); }} className="hover:text-primary cursor-pointer transition-colors">{selectedProduct.category}</span>
                <span className="mx-2 text-gray-300 dark:text-gray-600">/</span>
                <span className="text-dark dark:text-gray-200 line-clamp-1">{selectedProduct.name}</span>
            </div>

            <div className="glass-panel w-full rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row relative mb-16">
                {/* Image Section */}
                <div className="w-full md:w-2/5 bg-white dark:bg-gray-800/80 relative border-r border-gray-100 dark:border-gray-800 min-h-[300px] flex items-center justify-center p-8">
                    <SmartImage src={selectedProduct.localImage} fallbackSrc={selectedProduct.image} alt={selectedProduct.name} className="relative w-full h-full max-h-[400px] object-contain z-10" />
                    {selectedProduct.outOfStock && (
                        <div className="absolute top-8 left-8 bg-gray-500 text-white text-sm font-bold px-4 py-2 rounded-full z-20 shadow-md">Немає в наявності</div>
                    )}
                </div>

                {/* Details Section */}
                <div className="w-full md:w-3/5 p-5 lg:p-8 flex flex-col">
                    <h1 className="text-2xl lg:text-3xl font-black text-dark dark:text-white mb-3 leading-tight tracking-tight">{selectedProduct.name}</h1>
                    
                    <div className="flex items-end gap-3 mb-5">
                        <div className="text-3xl font-black gradient-text tracking-tighter">{selectedProduct.price} <span className="text-lg font-bold">₴</span></div>
                        {selectedProduct.oldPrice && (
                            <div className="text-xl line-through text-gray-400 dark:text-gray-500 font-bold mb-0.5">
                                {selectedProduct.oldPrice} ₴
                            </div>
                        )}
                        {selectedProduct.isPopular && <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full mb-1">Хіт продажу 🔥</span>}
                        {selectedProduct.oldPrice && <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full mb-1">АКЦІЯ 🏷️</span>}
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm mb-6">
                        {selectedProduct.details.description}
                    </p>

                    <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs mb-6 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                        <div>
                            <span className="text-gray-500 block mb-1">Бренд</span>
                            <span className="font-bold text-sm text-dark dark:text-white">{selectedProduct.details.brand}</span>
                        </div>
                        <div>
                            <span className="text-gray-500 block mb-1">Країна</span>
                            <span className="font-bold text-lg text-dark dark:text-white">{selectedProduct.details.country}</span>
                        </div>
                        <div>
                            <span className="text-gray-500 block mb-1">Об'єм</span>
                            <span className="font-bold text-lg text-dark dark:text-white">{selectedProduct.details.volume}</span>
                        </div>
                        <div>
                            <span className="text-gray-500 block mb-1">Калорійність</span>
                            <span className="font-bold text-lg text-dark dark:text-white">{selectedProduct.details.calories}</span>
                        </div>
                    </div>

                    <div className="mt-auto">
                        <button 
                            onClick={() => addToCart(selectedProduct)} 
                            disabled={selectedProduct.outOfStock}
                            className={`w-full py-5 text-lg font-bold rounded-2xl shadow-xl transition-all transform flex items-center justify-center gap-3 ${selectedProduct.outOfStock ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'gradient-bg text-white hover:shadow-primary/40 hover:-translate-y-1'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                            {selectedProduct.outOfStock ? 'Товар закінчився' : 'Додати в кошик'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Similar Products Carousel */}
            {similarProducts.length > 0 && (
                <div className="mt-8">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-2xl lg:text-3xl font-black text-dark dark:text-white">Схожі товари</h3>
                        <div className="flex gap-2">
                            <button onClick={() => scrollCarousel('left')} className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-primary hover:text-white transition-colors text-gray-500 shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                            </button>
                            <button onClick={() => scrollCarousel('right')} className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-primary hover:text-white transition-colors text-gray-500 shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                            </button>
                        </div>
                    </div>
                    <div ref={carouselRef} className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory hide-scrollbar items-stretch scroll-smooth">
                        {similarProducts.map(p => (
                            <div key={p.id} className="w-[260px] sm:w-[280px] snap-start flex-shrink-0 flex flex-col">
                                <ProductCard product={p} addToCart={addToCart} onSelect={handleSelectProduct} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
