import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { SmartImage } from '../ui/SmartImage';

export const Header = () => {
    const { 
        searchQuery, setSearchQuery, 
        isSearchOverlayOpen, setIsSearchOverlayOpen, 
        activeView, setActiveView, 
        activeNav, setActiveNav, 
        navigateTo,
        filteredProducts,
        selectedCategory, setSelectedCategory,
        priceRange, setPriceRange,
        calRange, setCalRange
    } = useAppContext();
    
    const { currentUser, setIsAuthModalOpen } = useAuth();
    
    const { 
        cart, 
        selectedCity, setIsCityConfirmed, 
        setRepeatedOrderDetails 
    } = useCart();

    const cartItemsCount = cart.reduce((s, i) => s + i.quantity, 0);

    return (
        <header className="glass-header sticky top-0 z-40 transition-colors duration-300 border-b border-gray-100 dark:border-gray-800">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <div className="flex items-center group cursor-pointer" onClick={() => navigateTo('shop', 'Всі')}>
                        <img src="images/logo.svg?v=8" alt="жуйка" className="h-16 w-auto object-contain block select-none" />
                    </div>
                    
                    {selectedCity && (
                        <div 
                            className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-xl cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700" 
                            onClick={() => setIsCityConfirmed(false)}
                            title="Змінити місто"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm font-bold text-dark dark:text-white">{selectedCity}</span>
                        </div>
                    )}
                </div>
                
                <div className="flex-1 max-w-2xl mx-6 hidden sm:block">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                        <input 
                            type="text" 
                            value={searchQuery}
                            onFocus={() => setIsSearchOverlayOpen(true)}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    setIsSearchOverlayOpen(false);
                                    if (activeView !== 'shop' || activeNav !== 'Всі') {
                                        navigateTo('shop', 'Всі');
                                    }
                                }
                            }}
                            placeholder="Пошук солодощів (назва, категорія, смак, бренд)..." 
                            className="w-full pl-11 pr-4 py-2.5 bg-gray-100/50 dark:bg-darkCard/50 border border-gray-200 dark:border-gray-700 text-dark dark:text-white rounded-full focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-inner relative z-50" 
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4 ml-auto">
                    {/* User Action */}
                    {currentUser ? (
                        <div className="flex items-center gap-3">
                            <div className="hidden md:flex flex-col items-end">
                                <span className="text-sm font-bold text-dark dark:text-white leading-none">{currentUser.name.split(' ')[0]}</span>
                                <span className="text-xs text-primary font-bold">Особистий кабінет</span>
                            </div>
                            <button onClick={() => navigateTo('profile')} className="w-10 h-10 rounded-full border-2 border-primary/20 overflow-hidden hover:border-primary transition-colors cursor-pointer shadow-sm">
                                <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                            </button>
                        </div>
                    ) : (
                        <button onClick={() => setIsAuthModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-dark dark:text-white rounded-xl font-bold transition-colors shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                            <span className="hidden sm:inline">Увійти</span>
                        </button>
                    )}

                    {/* Cart Action */}
                    <button 
                        className="relative p-2.5 bg-green-500/10 hover:bg-green-500/20 text-green-500 rounded-xl transition-all hover:scale-105 active:scale-95 group shadow-sm"
                        onClick={() => {
                            if (activeView === 'checkout') {
                                navigateTo('shop', 'Всі');
                            } else {
                                setRepeatedOrderDetails(null);
                                navigateTo('checkout');
                            }
                        }}
                    >
                        <div className="absolute inset-0 bg-green-500 opacity-0 group-hover:opacity-10 rounded-xl transition-opacity"></div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {cartItemsCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-lg border-2 border-white dark:border-darkBg animate-pulse-soft z-20">
                                {cartItemsCount > 99 ? '99+' : cartItemsCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>
            {/* Search Overlay */}
            {isSearchOverlayOpen && (
                <>
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 transition-opacity" onClick={() => setIsSearchOverlayOpen(false)}></div>
                    <div className="fixed top-[72px] left-0 w-full bg-white dark:bg-darkBg z-40 border-b border-gray-200 dark:border-gray-800 shadow-2xl p-6 max-h-[80vh] overflow-y-auto animate-in slide-in-from-top-4 duration-300">
                        <div className="container mx-auto max-w-4xl">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-dark dark:text-white">Пошук та Фільтри</h3>
                                <button onClick={() => setIsSearchOverlayOpen(false)} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div>
                                    <h4 className="font-bold text-sm text-gray-500 mb-3 uppercase tracking-wider">Категорія</h4>
                                    <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-dark dark:text-white rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-bold">
                                        <option value="Всі">Всі товари</option>
                                        <option value="Напої">Всі напої</option>
                                        <option value="Солодощі">Солодощі</option>
                                        <option value="Снеки">Снеки</option>
                                        <option value="Газовані напої">Газовані напої</option>
                                        <option value="Азіатські напої">Азіатські напої</option>
                                        <option value="Соки зі шматочками">Соки зі шматочками</option>
                                        <option value="Енергетики">Енергетики</option>
                                    </select>
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-gray-500 mb-3 uppercase tracking-wider">Ціна (₴)</h4>
                                    <div className="flex items-center gap-2">
                                        <input type="number" placeholder="Від" value={priceRange.min} onChange={e => setPriceRange({...priceRange, min: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-dark dark:text-white rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
                                        <span className="text-gray-400">-</span>
                                        <input type="number" placeholder="До" value={priceRange.max} onChange={e => setPriceRange({...priceRange, max: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-dark dark:text-white rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-gray-500 mb-3 uppercase tracking-wider">Калорії (ккал)</h4>
                                    <div className="flex items-center gap-2">
                                        <input type="number" placeholder="Від" value={calRange.min} onChange={e => setCalRange({...calRange, min: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-dark dark:text-white rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
                                        <span className="text-gray-400">-</span>
                                        <input type="number" placeholder="До" value={calRange.max} onChange={e => setCalRange({...calRange, max: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-dark dark:text-white rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-bold text-lg text-dark dark:text-white">Результати ({filteredProducts.length})</h4>
                                    <span className="text-sm text-gray-500 hidden sm:inline">Натисніть Enter у пошуку, щоб переглянути всі</span>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {filteredProducts.slice(0, 5).map(product => (
                                        <div key={product.id} onClick={() => { setIsSearchOverlayOpen(false); navigateTo('product', activeNav || 'Всі', product); }} className="bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-3 cursor-pointer hover:border-primary hover:shadow-md transition-all group flex flex-col items-center text-center">
                                            <div className="h-20 w-20 mb-3 relative flex items-center justify-center bg-white dark:bg-gray-700/50 rounded-lg p-1">
                                                <SmartImage src={product.localImage} fallbackSrc={product.image} alt={product.name} className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-300" />
                                            </div>
                                            <div className="text-[10px] text-accent font-semibold mb-1 uppercase tracking-wider line-clamp-1">{product.category}</div>
                                            <div className="text-xs font-bold text-dark dark:text-gray-200 line-clamp-2 leading-snug mb-2 flex-grow">{product.name}</div>
                                            <div className="mt-auto font-extrabold text-primary text-sm">{product.price} ₴</div>
                                        </div>
                                    ))}
                                    {filteredProducts.length === 0 && (
                                        <div className="col-span-full py-8 text-center text-gray-500 font-medium">
                                            Нічого не знайдено за вашим запитом.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </header>
    );
};
