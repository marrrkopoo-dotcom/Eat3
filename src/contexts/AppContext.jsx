import React, { createContext, useContext, useState, useEffect } from 'react';
import { parseHash } from '../utils/helpers';
import { allProducts } from '../utils/data';
import { promotions } from '../utils/promotions';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
    const [cookieAccepted, setCookieAccepted] = useState(() => {
        return localStorage.getItem('cookieAccepted') === 'true';
    });
    const [activeView, setActiveView] = useState(() => {
        const route = parseHash();
        return route.view;
    }); 
    const [activeArticle, setActiveArticle] = useState(() => {
        const route = parseHash();
        if (route.articleId) {
            return promotions.find(p => p.id === route.articleId) || null;
        }
        const savedId = localStorage.getItem('activeArticleId');
        return savedId ? promotions.find(p => p.id === parseInt(savedId)) || null : null;
    });
    const [activeNav, setActiveNav] = useState(() => {
        const route = parseHash();
        return route.nav;
    });
    
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(() => {
        const route = parseHash();
        return route.nav;
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [brokenImages, setBrokenImages] = useState(new Set());
    const [viewMode, setViewMode] = useState('medium'); 
    const [stockFilter, setStockFilter] = useState('all'); 
    const [promoFilter, setPromoFilter] = useState(false);
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [calRange, setCalRange] = useState({ min: '', max: '' });
    
    const [selectedProduct, setSelectedProduct] = useState(() => {
        const route = parseHash();
        if (route.productId) {
            return allProducts.find(p => p.id === route.productId) || null;
        }
        const savedId = localStorage.getItem('selectedProductId');
        return savedId ? allProducts.find(p => p.id === parseInt(savedId)) || null : null;
    });

    const navigateTo = (view, navItem = 'Всі', product = null, article = null) => {
        if (view === 'shop') {
            setActiveNav(navItem);
            setSelectedCategory(navItem);
        }
        if (product) {
            setSelectedProduct(product);
            localStorage.setItem('selectedProductId', product.id);
        }
        if (article) {
            setActiveArticle(article);
            localStorage.setItem('activeArticleId', article.id);
        }
        setActiveView(view);
        
        let hash = `#view=${view}`;
        if (navItem && view === 'shop') hash += `&nav=${encodeURIComponent(navItem)}`;
        if (product) hash += `&product=${product.id}`;
        if (article) hash += `&article=${article.id}`;
        
        window.history.pushState(null, '', hash);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleAcceptCookie = () => {
        localStorage.setItem('cookieAccepted', 'true');
        setCookieAccepted(true);
    };

    // Browser History Integration
    useEffect(() => {
        const handleRouteUpdate = () => {
            const route = parseHash();
            setActiveView(prev => prev !== route.view ? route.view : prev);
            setActiveNav(prev => prev !== route.nav ? route.nav : prev);
            setSelectedCategory(prev => prev !== route.nav ? route.nav : prev);
            
            setSelectedProduct(prev => {
                if (route.productId) {
                    if (prev && prev.id === route.productId) return prev;
                    return allProducts.find(p => p.id === route.productId) || null;
                }
                return null;
            });

            setActiveArticle(prev => {
                if (route.articleId) {
                    if (prev && prev.id === route.articleId) return prev;
                    return promotions.find(p => p.id === route.articleId) || null;
                }
                return null;
            });
        };

        window.addEventListener('popstate', handleRouteUpdate);
        window.addEventListener('hashchange', handleRouteUpdate);
        return () => {
            window.removeEventListener('popstate', handleRouteUpdate);
            window.removeEventListener('hashchange', handleRouteUpdate);
        };
    }, []);

    // Sync state changes to browser URL/History
    useEffect(() => {
        let hash = '#/';
        if (activeView === 'shop') {
            hash = `#/shop?category=${encodeURIComponent(activeNav || 'Всі')}`;
        } else if (activeView === 'product' && selectedProduct) {
            hash = `#/product/${selectedProduct.id}`;
        } else if (activeView === 'article' && activeArticle) {
            hash = `#/article/${activeArticle.id}`;
        } else if (activeView === 'checkout') {
            hash = `#/checkout`;
        } else if (activeView === 'success') {
            hash = `#/success`;
        } else if (activeView === 'profile') {
            hash = `#/profile`;
        }

        if (window.location.hash !== hash) {
            window.history.pushState({ 
                view: activeView, 
                nav: activeNav, 
                productId: selectedProduct ? selectedProduct.id : null,
                articleId: activeArticle ? activeArticle.id : null
            }, '', hash);
        }
    }, [activeView, activeNav, selectedProduct, activeArticle]);

    useEffect(() => {
        localStorage.setItem('activeView', activeView);
        localStorage.setItem('activeNav', activeNav);
        if (selectedProduct) localStorage.setItem('selectedProductId', selectedProduct.id);
        if (activeArticle) localStorage.setItem('activeArticleId', activeArticle.id);
    }, [activeView, activeNav, selectedProduct, activeArticle]);

    return (
        <AppContext.Provider value={{
            cookieAccepted, setCookieAccepted, handleAcceptCookie,
            activeView, setActiveView,
            activeArticle, setActiveArticle,
            activeNav, setActiveNav,
            searchQuery, setSearchQuery,
            isSearchOverlayOpen, setIsSearchOverlayOpen,
            selectedCategory, setSelectedCategory,
            currentPage, setCurrentPage,
            brokenImages, setBrokenImages,
            viewMode, setViewMode,
            stockFilter, setStockFilter,
            promoFilter, setPromoFilter,
            priceRange, setPriceRange,
            calRange, setCalRange,
            selectedProduct, setSelectedProduct,
            navigateTo
        }}>
            {children}
        </AppContext.Provider>
    );
};
