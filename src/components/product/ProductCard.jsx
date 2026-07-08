import React, { useState } from 'react';
import { SmartImage } from '../ui/SmartImage';

export const ProductCard = ({ product, addToCart, onSelect, onImageError, viewMode = 'small' }) => {
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    return (
    <div className={`glass-panel rounded-2xl ${viewMode === 'large' ? 'p-4' : viewMode === 'medium' ? 'p-3' : 'p-2'} product-card relative group flex flex-col h-full overflow-hidden cursor-pointer transition-opacity duration-500`} onClick={() => onSelect(product)}>
        {product.oldPrice ? (
            <div className={`absolute ${viewMode === 'large' ? 'top-4 left-4 px-2.5 py-1 text-xs' : viewMode === 'medium' ? 'top-3 left-3 px-2 py-0.5 text-[11px]' : 'top-2 left-2 px-1.5 py-0.5 text-[10px]'} bg-red-500 text-white font-bold rounded-full z-10 shadow-md`}>АКЦІЯ</div>
        ) : product.isNew ? (
            <div className={`absolute ${viewMode === 'large' ? 'top-4 left-4 px-2.5 py-1 text-xs' : viewMode === 'medium' ? 'top-3 left-3 px-2 py-0.5 text-[11px]' : 'top-2 left-2 px-1.5 py-0.5 text-[10px]'} bg-accent text-white font-bold rounded-full z-10 shadow-md animate-pulse`}>Новинка</div>
        ) : product.isPopular ? (
            <div className={`absolute ${viewMode === 'large' ? 'top-4 left-4 px-2.5 py-1 text-xs' : viewMode === 'medium' ? 'top-3 left-3 px-2 py-0.5 text-[11px]' : 'top-2 left-2 px-1.5 py-0.5 text-[10px]'} bg-orange-500 text-white font-bold rounded-full z-10 shadow-md`}>Хіт</div>
        ) : null}
        {product.outOfStock && <div className={`absolute ${viewMode === 'large' ? 'top-4 left-4 px-2.5 py-1 text-xs' : viewMode === 'medium' ? 'top-3 left-3 px-2 py-0.5 text-[11px]' : 'top-2 left-2 px-1.5 py-0.5 text-[10px]'} bg-gray-500 text-white font-bold rounded-full z-10 shadow-md`}>Немає в наявності</div>}
        
        <div className={`relative ${viewMode === 'large' ? 'mb-4 p-6 rounded-xl' : viewMode === 'medium' ? 'mb-3 p-4 rounded-lg' : 'mb-1.5 p-2 rounded-lg'} aspect-square flex items-center justify-center bg-white dark:bg-gray-800/50 overflow-hidden group-hover:shadow-inner transition-shadow`}>
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <SmartImage src={product.localImage} fallbackSrc={product.image} alt={product.name} className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-110" onFinalError={onImageError} onLoad={() => setIsImageLoaded(true)} />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center">
                <span className={`text-white font-bold ${viewMode === 'large' ? 'px-4 py-2 text-sm' : 'px-3 py-1.5 text-xs'} bg-white/20 rounded-full`}>Детальніше</span>
            </div>
        </div>
        
        <div className={`${viewMode === 'large' ? 'text-xs mb-1.5' : viewMode === 'medium' ? 'text-[11px] mb-1' : 'text-[10px] mb-1'} font-semibold text-accent uppercase tracking-wider`}>{product.category}</div>
        <h4 className={`font-bold text-dark dark:text-gray-100 leading-snug ${viewMode === 'large' ? 'mb-3 text-lg' : viewMode === 'medium' ? 'mb-2 text-base' : 'mb-2 text-sm'} flex-grow hover:text-primary transition-colors cursor-pointer line-clamp-2`}>{product.name}</h4>
        
        <div className={`flex items-center justify-between mt-auto ${viewMode === 'large' ? 'pt-4' : viewMode === 'medium' ? 'pt-3' : 'pt-2'} border-t border-gray-100 dark:border-gray-700/50`} onClick={(e) => e.stopPropagation()}>
            <div className={`font-extrabold text-dark dark:text-white flex items-baseline gap-1.5 flex-wrap ${viewMode === 'large' ? 'text-2xl' : viewMode === 'medium' ? 'text-xl' : 'text-lg'}`}>
                <span>{product.price} <span className={`${viewMode === 'large' ? 'text-sm' : 'text-xs'} text-gray-500 font-medium`}>₴</span></span>
                {product.oldPrice && (
                    <span className="line-through text-xs text-gray-400 dark:text-gray-500 font-normal ml-0.5">
                        {product.oldPrice} ₴
                    </span>
                )}
            </div>
            <button onClick={() => addToCart(product)} className={`${viewMode === 'large' ? 'w-10 h-10 rounded-xl' : viewMode === 'medium' ? 'w-9 h-9 rounded-xl' : 'w-8 h-8 rounded-lg'} transition-all duration-300 flex items-center justify-center ${product.outOfStock ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed' : 'gradient-bg text-white shadow-lg hover:shadow-primary/40 transform hover:-translate-y-1 z-20 relative'}`} disabled={product.outOfStock}>
                <svg xmlns="http://www.w3.org/2000/svg" className={`${viewMode === 'large' ? 'h-5 w-5' : 'h-4 w-4'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
            </button>
        </div>
    </div>
  );
};
