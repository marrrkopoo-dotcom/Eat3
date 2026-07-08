import React from 'react';

export const parseHash = () => {
    const hash = window.location.hash;
    if (!hash) {
        const view = localStorage.getItem('activeView') || 'shop';
        const nav = localStorage.getItem('activeNav') || 'Всі';
        const savedProdId = localStorage.getItem('selectedProductId');
        const productId = savedProdId ? parseInt(savedProdId) : null;
        const savedArtId = localStorage.getItem('activeArticleId');
        const articleId = savedArtId ? parseInt(savedArtId) : null;
        return { view, nav, productId, articleId };
    }
    
    let view = 'shop';
    let nav = 'Всі';
    let productId = null;
    let articleId = null;

    if (hash.startsWith('#/product/')) {
        view = 'product';
        productId = parseInt(hash.replace('#/product/', ''));
    } else if (hash.startsWith('#/article/')) {
        view = 'article';
        articleId = parseInt(hash.replace('#/article/', ''));
    } else if (hash.startsWith('#/checkout')) {
        view = 'checkout';
    } else if (hash.startsWith('#/success')) {
        view = 'success';
    } else if (hash.startsWith('#/profile')) {
        view = 'profile';
    } else if (hash.startsWith('#/shop')) {
        view = 'shop';
        const match = hash.match(/category=([^&]+)/);
        if (match) {
            nav = decodeURIComponent(match[1]);
        }
    }
    return { view, nav, productId, articleId };
};

export const getAvatarSvg = (name) => {
    const lowercaseName = (name || '').toLowerCase();
    const isFemale = lowercaseName.endsWith('а') || 
                     lowercaseName.endsWith('я') || 
                     lowercaseName.includes('ольга') || 
                     lowercaseName.includes('олена') || 
                     lowercaseName.includes('ірина') || 
                     lowercaseName.includes('марія') || 
                     lowercaseName.includes('підтримка') ||
                     lowercaseName.includes('ольга');
    
    if (isFemale) {
        return (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-pink-400 p-1">
                <path d="M12 2a5 5 0 0 1 5 5v1a5 5 0 0 1-1.63 3.69c.8 1.48 2.37 2.31 4.13 3.31A2 2 0 0 1 21 16.73V20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3.27a2 2 0 0 1 1.5-1.93c1.76-1 3.33-1.83 4.13-3.31A5 5 0 0 1 7 8V7a5 5 0 0 1 5-5zM12 4a3 3 0 0 0-3 3v1a3 3 0 0 0 6 0V7a3 3 0 0 0-3-3z"/>
            </svg>
        );
    } else {
        return (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-blue-400 p-1">
                <path d="M12 2a5 5 0 0 1 5 5v1a5 5 0 0 1-5 5 5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 10a8 8 0 0 1 8 8v2H4v-2a8 8 0 0 1 8-8z"/>
            </svg>
        );
    }
};
