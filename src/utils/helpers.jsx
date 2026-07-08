import React from 'react';

export const parseHash = () => {
    const hash = window.location.hash;
    if (!hash || hash === '#/') {
        const view = localStorage.getItem('activeView') || 'shop';
        const nav = localStorage.getItem('activeNav') || 'Всі';
        const savedProdId = localStorage.getItem('selectedProductId');
        const productId = savedProdId ? parseInt(savedProdId) : null;
        const savedArtId = localStorage.getItem('activeArticleId');
        const articleId = savedArtId ? parseInt(savedArtId) : null;
        return { view, nav, productId, articleId, page: 1 };
    }
    
    let view = 'shop';
    let nav = 'Всі';
    let productId = null;
    let articleId = null;
    let page = 1;

    // Handle new URL search params format (#/?view=shop&nav=Всі)
    if (hash.startsWith('#/?') || hash.startsWith('#?')) {
        const queryStr = hash.replace(/^#\/?\?/, '');
        const params = new URLSearchParams(queryStr);
        if (params.has('view')) view = params.get('view');
        if (params.has('nav')) nav = params.get('nav');
        if (params.has('product')) productId = parseInt(params.get('product'));
        if (params.has('article')) articleId = parseInt(params.get('article'));
        if (params.has('page')) page = parseInt(params.get('page')) || 1;
    } else {
        // Legacy support
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
        } else if (hash.startsWith('#view=')) {
            const queryStr = hash.replace('#', '');
            const params = new URLSearchParams(queryStr);
            if (params.has('view')) view = params.get('view');
            if (params.has('nav')) nav = params.get('nav');
            if (params.has('product')) productId = parseInt(params.get('product'));
            if (params.has('article')) articleId = parseInt(params.get('article'));
            if (params.has('page')) page = parseInt(params.get('page')) || 1;
        }
    }
    
    return { view, nav, productId, articleId, page };
};

export const generateHash = ({ view = 'shop', nav, product, article, page }) => {
    const params = new URLSearchParams();
    params.set('view', view);
    if (nav && view === 'shop') params.set('nav', nav);
    if (product) params.set('product', product.id || product);
    if (article) params.set('article', article.id || article);
    if (page && page > 1) params.set('page', page);
    
    return `#/?${params.toString()}`;
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
