import React, { useMemo, useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { useCart } from '../../contexts/CartContext';
import { ProductCard } from '../components/product/ProductCard';
import { allProducts } from '../../utils/data';
import { promotions } from '../../utils/promotions';

const categories = ["Всі", "Акції", "Напої", "Снеки", "Енергетики", "Шоколад"];
const itemsPerPage = 20;

export const ShopView = () => {
    const {
        searchQuery, setSearchQuery,
        selectedCategory, setSelectedCategory,
        priceRange, setPriceRange,
        calRange, setCalRange,
        stockFilter, setStockFilter,
        promoFilter, setPromoFilter,
        brokenImages, setBrokenImages,
        currentPage, setCurrentPage,
        activeNav,
        navigateTo,
        viewMode, setViewMode
    } = useAppContext();

    const {
        addToCart,
        selectedCity, setSelectedCity,
        isSelectingCity, setIsSelectingCity,
        isCityConfirmed, setIsCityConfirmed,
        availableCities
    } = useCart();

    const clearFilters = () => {
        setSearchQuery(''); 
        setSelectedCategory('Всі');
        setPriceRange({ min: '', max: '' });
        setCalRange({ min: '', max: '' });
        setStockFilter('all');
        setPromoFilter(false);
    };

    const handleSelectProduct = (product) => {
        navigateTo('product', activeNav, product);
    };

    const filteredProducts = useMemo(() => {
        return allProducts.filter(p => {
            const q = searchQuery.toLowerCase();
            const matchSearch = !q || 
                (p.name && p.name.toLowerCase().includes(q)) || 
                (p.category && p.category.toLowerCase().includes(q)) ||
                (p.details?.description && p.details.description.toLowerCase().includes(q)) ||
                (p.details?.brand && p.details.brand.toLowerCase().includes(q)) ||
                (p.details?.country && p.details.country.toLowerCase().includes(q));

            const drinkCategories = ["Газовані напої", "Азіатські напої", "Соки зі шматочками", "Енергетики"];
            const matchCategory = 
                selectedCategory === "Всі" ? true :
                selectedCategory === "Акції" ? !!p.oldPrice :
                selectedCategory === "Напої" ? drinkCategories.includes(p.category) :
                p.category === selectedCategory;
            
            const matchPrice = (!priceRange.min || p.price >= Number(priceRange.min)) && 
                               (!priceRange.max || p.price <= Number(priceRange.max));
                               
            const calories = p.details?.calories ? parseInt(p.details.calories) : 0;
            const matchCal = (!calRange.min || calories >= Number(calRange.min)) && 
                             (!calRange.max || calories <= Number(calRange.max));

            const matchStock = stockFilter === 'all' ? true : 
                               stockFilter === 'inStock' ? !p.outOfStock :
                               p.outOfStock;

            const matchPromo = !promoFilter || !!p.oldPrice;

            return matchSearch && matchCategory && matchPrice && matchCal && matchStock && matchPromo;
        }).sort((a, b) => {
            if (a.outOfStock && !b.outOfStock) return 1;
            if (!a.outOfStock && b.outOfStock) return -1;
            
            const aBroken = brokenImages.has(a.id);
            const bBroken = brokenImages.has(b.id);
            if (aBroken && !bBroken) return 1;
            if (!aBroken && bBroken) return -1;

            if (a.localImage && !b.localImage) return -1;
            if (!a.localImage && b.localImage) return 1;

            if (selectedCategory === 'Всі') return (a._rand || 0) - (b._rand || 0);
            return 0;
        });
    }, [searchQuery, selectedCategory, priceRange, calRange, brokenImages, stockFilter, promoFilter]);

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    useEffect(() => { setCurrentPage(1); }, [searchQuery, selectedCategory, priceRange, calRange, stockFilter, setCurrentPage]);

    return (
        <>
            <div className="py-2 text-sm text-gray-500 dark:text-gray-400 font-medium mb-6">
                <span className="hover:text-primary cursor-pointer transition-colors">Головна</span>
                <span className="mx-3 text-gray-300 dark:text-gray-600">/</span>
                <span className="text-dark dark:text-gray-200">{activeNav}</span>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                <aside className="w-full lg:w-72 flex-shrink-0 space-y-6">
                    <div className="glass-panel p-6 rounded-2xl shadow-sm">
                        <h3 className="font-extrabold text-xl mb-5 text-dark dark:text-white flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
                            Категорії
                        </h3>
                        <ul className="space-y-2">
                            {categories.map(cat => {
                                const isPromo = cat === "Акції";
                                const drinkCategories = ["Газовані напої", "Азіатські напої", "Соки зі шматочками", "Енергетики"];
                                const catCount = cat === "Всі" ? allProducts.length : 
                                                 isPromo ? allProducts.filter(p => !!p.oldPrice).length :
                                                 cat === "Напої" ? allProducts.filter(p => drinkCategories.includes(p.category)).length :
                                                 allProducts.filter(p => p.category === cat).length;
                                if (cat !== "Всі" && !isPromo && catCount === 0) return null;
                                return (
                                    <li key={cat}>
                                        <button onClick={() => setSelectedCategory(cat)} className={`w-full flex justify-between items-center px-4 py-3 rounded-xl transition-all ${
                                            selectedCategory === cat 
                                                ? isPromo 
                                                    ? 'bg-red-500/10 dark:bg-red-500/20 text-red-500 font-extrabold shadow-sm'
                                                    : 'bg-primary/10 dark:bg-primary/20 text-primary font-bold' 
                                                : isPromo
                                                    ? 'text-red-500 dark:text-red-400 font-extrabold hover:bg-red-500/5'
                                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                        }`}>
                                            <span className="flex items-center gap-1">
                                                {cat}
                                            </span>
                                            <span className={`text-xs px-2 py-1 rounded-full ${
                                                selectedCategory === cat 
                                                    ? isPromo 
                                                        ? 'bg-red-500 text-white' 
                                                        : 'bg-primary text-white' 
                                                    : isPromo
                                                        ? 'bg-red-100 dark:bg-red-950/50 text-red-500'
                                                        : 'bg-gray-200 dark:bg-gray-700'
                                            }`}>{catCount}</span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    <div className="glass-panel p-6 rounded-2xl shadow-sm">
                        <h3 className="font-extrabold text-xl mb-5 text-dark dark:text-white flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                            Фільтри
                        </h3>

                        <div className="mb-5 flex items-center gap-2.5">
                             <input 
                                 type="checkbox" 
                                 id="promoFilter" 
                                 checked={promoFilter} 
                                 onChange={e => setPromoFilter(e.target.checked)} 
                                 className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary cursor-pointer bg-white dark:bg-gray-800"
                             />
                             <label htmlFor="promoFilter" className="text-sm font-extrabold text-gray-600 dark:text-gray-300 cursor-pointer select-none">
                                 Тільки акційні товари
                             </label>
                        </div>

                        <div className="mb-5">
                            <label className="block text-sm font-bold text-gray-500 mb-2">Ціна (грн)</label>
                            <div className="flex items-center gap-2">
                                <input type="number" placeholder="Від" value={priceRange.min} onChange={e => setPriceRange({...priceRange, min: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-darkBg border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" />
                                <span className="text-gray-400">-</span>
                                <input type="number" placeholder="До" value={priceRange.max} onChange={e => setPriceRange({...priceRange, max: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-darkBg border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" />
                            </div>
                        </div>
                        
                        <div className="mb-5">
                            <label className="block text-sm font-bold text-gray-500 mb-2">Калорійність (ккал)</label>
                            <div className="flex items-center gap-2">
                                <input type="number" placeholder="Від" value={calRange.min} onChange={e => setCalRange({...calRange, min: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-darkBg border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" />
                                <span className="text-gray-400">-</span>
                                <input type="number" placeholder="До" value={calRange.max} onChange={e => setCalRange({...calRange, max: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-darkBg border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" />
                            </div>
                        </div>
                        
                        <div className="mb-5">
                            <label className="block text-sm font-bold text-gray-500 mb-2">Наявність</label>
                            <select value={stockFilter} onChange={e => setStockFilter(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-darkBg border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-sm text-dark dark:text-white">
                                <option value="all">Всі товари</option>
                                <option value="inStock">В наявності</option>
                                <option value="outOfStock">Немає в наявності</option>
                            </select>
                        </div>

                        <button onClick={clearFilters} className="w-full mt-2 text-sm font-bold text-gray-500 hover:text-primary transition-colors">Очистити всі фільтри</button>
                    </div>
                </aside>

                <div className="flex-1 min-w-0">
                    <div className="mb-8 overflow-x-auto pb-4">
                        <div className="flex gap-4 pb-2 w-max">
                            {promotions.filter(promo => !['ІНФОРМАЦІЯ', 'ДОПОМОГА', 'ДОКУМЕНТИ', 'ПОВЕРНЕННЯ', 'ПРО НАС'].includes(promo.tag)).map(promo => (
                                <div key={promo.id} onClick={() => navigateTo('article', activeNav, null, promo)} className="relative w-64 h-80 rounded-2xl overflow-hidden flex-shrink-0 cursor-pointer group shadow-sm hover:shadow-lg transition-all">
                                    <img src={promo.image} alt={promo.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/80"></div>
                                    <div className="absolute inset-0 p-5 flex flex-col">
                                        <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md self-start uppercase tracking-wider mb-auto">{promo.tag}</span>
                                        <h4 className="text-white font-extrabold text-lg leading-tight mt-auto drop-shadow-md">{promo.title}</h4>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 glass-panel p-4 rounded-2xl">
                        <div className="flex items-center gap-4">
                            <h1 className="text-2xl lg:text-3xl font-black text-dark dark:text-white tracking-tight">{selectedCategory}</h1>
                            <div className="text-sm font-bold text-gray-500 bg-white/50 dark:bg-gray-800/50 px-3 py-1 rounded-full">{filteredProducts.length} товарів</div>
                        </div>
                        <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl p-1 shrink-0">
                            <button onClick={() => setViewMode('large')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${viewMode === 'large' ? 'bg-white dark:bg-gray-700 shadow-sm text-primary' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>Великі</button>
                            <button onClick={() => setViewMode('medium')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${viewMode === 'medium' ? 'bg-white dark:bg-gray-700 shadow-sm text-primary' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>Середні</button>
                            <button onClick={() => setViewMode('small')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${viewMode === 'small' ? 'bg-white dark:bg-gray-700 shadow-sm text-primary' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>Малі</button>
                        </div>
                    </div>
                    
                    {paginatedProducts.length > 0 ? (
                        <>
                            <div className={viewMode === 'large' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : viewMode === 'medium' ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5" : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4"}>
                                {paginatedProducts.map(p => <ProductCard key={p.id} product={p} viewMode={viewMode} addToCart={addToCart} onSelect={handleSelectProduct} onImageError={() => setBrokenImages(prev => new Set(prev).add(p.id))} />)}
                            </div>

                            {totalPages > 1 && (
                                <div className="flex justify-center mt-14">
                                    <div className="flex flex-wrap items-center justify-center gap-2 glass-panel p-2 rounded-2xl shadow-sm">
                                        <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-darkCard font-bold">&laquo;</button>
                                        {(() => {
                                            let pages = [];
                                            if (totalPages <= 7) {
                                                for (let i = 1; i <= totalPages; i++) pages.push(i);
                                            } else {
                                                if (currentPage <= 4) {
                                                    pages = [1, 2, 3, 4, 5, '...', totalPages];
                                                } else if (currentPage >= totalPages - 3) {
                                                    pages = [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
                                                } else {
                                                    pages = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
                                                }
                                            }
                                            return pages.map((page, index) => 
                                                page === '...' ? (
                                                    <span key={`ellipsis-${index}`} className="w-10 h-10 flex items-center justify-center font-bold text-gray-400">...</span>
                                                ) : (
                                                    <button key={page} onClick={() => setCurrentPage(page)} className={`w-10 h-10 rounded-xl font-bold transition-all ${currentPage === page ? 'gradient-bg text-white shadow-md scale-105' : 'bg-gray-50 dark:bg-darkCard hover:bg-gray-200 dark:hover:bg-gray-700'}`}>{page}</button>
                                                )
                                            );
                                        })()}
                                        <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-darkCard font-bold">&raquo;</button>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center glass-panel rounded-3xl mt-8">
                            <div className="text-6xl mb-4">🔍</div>
                            <h3 className="text-2xl font-bold mb-2 text-dark dark:text-white">Товари не знайдено</h3>
                            <p className="text-gray-500 max-w-md">За вашим запитом або обраними фільтрами нічого не знайдено. Спробуйте змінити параметри пошуку.</p>
                            <button onClick={clearFilters} className="mt-6 px-6 py-3 bg-primary/10 text-primary font-bold rounded-xl hover:bg-primary hover:text-white transition-colors">Скинути фільтри</button>
                        </div>
                    )}
                </div>
                
                {/* Right Sidebar (Map) - Floating Overlay */}
                {!isCityConfirmed && (
                    <aside className="fixed top-28 right-6 w-80 z-50 animate-in fade-in slide-in-from-right-8 duration-500">
                        <div className="glass-panel p-6 rounded-2xl shadow-2xl relative">
                            <button onClick={() => setIsCityConfirmed(true)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                            </button>
                            <div className="flex justify-between items-start mb-1 pr-6">
                                <h3 className="font-extrabold text-lg text-dark dark:text-white">
                                    Ваше місто {selectedCity}?
                                </h3>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">Товари та акції залежать від адреси</p>
                            
                            {!isSelectingCity && (
                                <div className="flex gap-2 mb-5">
                                    <button onClick={() => setIsCityConfirmed(true)} className="flex-1 bg-primary hover:bg-primary/90 text-white rounded-xl py-2.5 font-bold transition-colors text-sm">Так, вірно</button>
                                    <button onClick={() => setIsSelectingCity(true)} className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-dark dark:text-white rounded-xl py-2.5 font-bold transition-colors text-sm">Ні, інше</button>
                                </div>
                            )}

                            {isSelectingCity && (
                                <div className="mb-5">
                                    <select 
                                        value={selectedCity} 
                                        onChange={(e) => {
                                            setSelectedCity(e.target.value);
                                            setIsSelectingCity(false);
                                            setIsCityConfirmed(true);
                                        }}
                                        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-dark dark:text-white rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer appearance-none"
                                    >
                                        <option value="" disabled>Оберіть місто</option>
                                        {availableCities.map(city => (
                                            <option key={city} value={city}>{city}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className="rounded-xl overflow-hidden h-64 border border-gray-200 dark:border-gray-800 relative group">
                                <iframe 
                                    width="100%" 
                                    height="100%" 
                                    frameBorder="0" 
                                    scrolling="no" 
                                    marginHeight="0" 
                                    marginWidth="0" 
                                    src={`https://maps.google.com/maps?q=${encodeURIComponent("Нова Пошта, " + selectedCity)}&t=&z=12&ie=UTF8&iwloc=&output=embed&hl=uk`}
                                    style={{ border: 'none' }}
                                ></iframe>
                            </div>
                        </div>
                    </aside>
                )}
            </div>
        </>
    );
};
