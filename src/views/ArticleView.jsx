import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { useCart } from '../contexts/CartContext';
import { ProductCard } from '../components/product/ProductCard';
import { allProducts } from '../utils/data';

export const ArticleView = () => {
    const { activeArticle, navigateTo, activeNav, viewMode, setBrokenImages } = useAppContext();
    const { addToCart } = useCart();

    const handleSelectProduct = (product) => {
        navigateTo('product', activeNav, product);
    };

    if (!activeArticle) return null;

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 py-8 px-4">
            <button onClick={() => navigateTo('shop')} className="mb-6 flex items-center gap-2 text-gray-500 hover:text-primary transition-colors font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Повернутися до магазину
            </button>
            
            <div className="rounded-3xl overflow-hidden mb-8 shadow-md relative h-80 sm:h-96">
                <img src={activeArticle.image} alt={activeArticle.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end">
                    <div className="p-8">
                        <span className="bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider mb-3 inline-block">{activeArticle.tag}</span>
                        <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">{activeArticle.title}</h1>
                    </div>
                </div>
            </div>

            <div className="glass-panel p-8 sm:p-10 rounded-3xl mb-12 text-lg text-gray-700 dark:text-gray-300 leading-relaxed shadow-sm">
                {typeof activeArticle.content === 'string' ? (
                    <p className="whitespace-pre-wrap">{activeArticle.content}</p>
                ) : (
                    activeArticle.content
                )}
                
                <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                    <span className="font-medium text-gray-500 hidden sm:block">Сподобалось? Обирайте швидше!</span>
                    <button onClick={() => navigateTo('shop', 'Всі')} className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                        {activeArticle.btnText || "Перейти до каталогу"}
                    </button>
                </div>
            </div>

            {activeArticle.featuredProducts && activeArticle.featuredProducts.length > 0 && (
                <div className="mt-12">
                    <h3 className="text-2xl font-black text-dark dark:text-white mb-6 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">✨</span>
                        Товари з цієї статті
                    </h3>
                    <div className={viewMode === 'large' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : viewMode === 'medium' ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5" : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4"}>
                        {allProducts.filter(p => activeArticle.featuredProducts.includes(p.id)).map(product => (
                            <ProductCard 
                                key={product.id} 
                                product={product} 
                                viewMode={viewMode} 
                                addToCart={addToCart} 
                                onSelect={handleSelectProduct} 
                                onImageError={() => setBrokenImages(prev => new Set(prev).add(product.id))} 
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
