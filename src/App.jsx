import React, { useState, useEffect, useMemo, useRef } from 'react';

import productsData from './data/products.json';

const allProducts = productsData.filter(p => !!p.localImage);

const categoryImages = {
    "Газовані напої": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80",
    "Азіатські напої": "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&q=80",
    "Соки зі шматочками": "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&q=80",
    "Енергетики": "https://images.unsplash.com/photo-1604152135912-04a022e23696?w=400&q=80",
    "Снеки": "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&q=80",
    "Шоколад": "https://images.unsplash.com/photo-1548831772-2bb8b6680a13?w=400&q=80",
    "Солодощі": "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400&q=80",
    "Жуйки": "https://images.unsplash.com/photo-1570586437263-ab629fccc818?w=400&q=80",
    "Подарункові бокси ✨": "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&q=80"
};

allProducts.forEach((p, index) => {
    // Add a small seed to Unsplash URL to get slight variations within the same category if possible, or just use the category image
    if (p.image.startsWith('images/')) {
        p.image = categoryImages[p.category] || categoryImages["Снеки"];
    }
});

const categories = ["Всі", "Газовані напої", "Азіатські напої", "Соки зі шматочками", "Енергетики", "Снеки", "Шоколад", "Солодощі", "Жуйки", "Подарункові бокси ✨"];
const navItems = ["Всі", "Напої", "Снеки", "Шоколад", "Солодощі", "Жуйки", "Подарункові бокси ✨"];

const SmartImage = ({ src, fallbackSrc, alt, className, style, onFinalError, onLoad }) => {
    // Generate variations for remote URLs
    const getVariations = (url) => {
        if (!url) return [];
        const match = url.match(/(.*?)(?:-\d+x\d+)?(\.(?:webp|jpg|jpeg|png))$/i);
        if (!match) return [url];
        
        const base = match[1];
        const ext = match[2].toLowerCase();
        
        const variations = [
            url,
            `${base}-495x495${ext}`,
            `${base}-500x500${ext}`,
            `${base}-228x228${ext}`,
            `${base}${ext}`
        ];
        
        if (ext !== '.webp') {
            variations.push(
                `${base}-495x495.webp`,
                `${base}-500x500.webp`,
                `${base}-228x228.webp`,
                `${base}.webp`
            );
        }
        
        if (ext !== '.jpg' && ext !== '.jpeg') {
            variations.push(
                `${base}-495x495.jpg`,
                `${base}-500x500.jpg`,
                `${base}-228x228.jpg`,
                `${base}.jpg`
            );
        }
        
        return Array.from(new Set(variations));
    };

    const initialSrc = src || fallbackSrc;
    const [currentSrc, setCurrentSrc] = React.useState(initialSrc);
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [failedLocal, setFailedLocal] = React.useState(false);
    const [variationIndex, setVariationIndex] = React.useState(0);
    const [variations, setVariations] = React.useState([]);

    React.useEffect(() => {
        const initial = src || fallbackSrc;
        setCurrentSrc(initial);
        setIsLoaded(false);
        setFailedLocal(false);
        setVariationIndex(0);
        setVariations(getVariations(fallbackSrc));
    }, [src, fallbackSrc]);

    const handleError = () => {
        if (!failedLocal && src && fallbackSrc && currentSrc !== fallbackSrc) {
            setFailedLocal(true);
            setCurrentSrc(variations[0] || fallbackSrc);
            setVariationIndex(0);
        } else if (variations.length > 0 && variationIndex + 1 < variations.length) {
            const nextIndex = variationIndex + 1;
            setVariationIndex(nextIndex);
            setCurrentSrc(variations[nextIndex]);
        } else if (typeof onFinalError === 'function') {
            onFinalError();
        }
    };

    return (
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            <img 
                src={currentSrc} 
                alt={alt} 
                className={`${className || ''} ${!isLoaded ? 'blur-md scale-110 opacity-50' : 'blur-0 scale-100 opacity-100'} transition-all duration-700 ease-in-out w-full h-full object-contain`} 
                style={style} 
                onLoad={() => {
                    setIsLoaded(true);
                    if (typeof onLoad === 'function') onLoad();
                }}
                onError={handleError} 
            />
        </div>
    );
};

const ThemeToggle = ({ isDark, toggleTheme }) => (
    <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300">
        {isDark ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
        ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
        )}
    </button>
);

const Header = ({ isDark, toggleTheme, cartItemsCount, searchQuery, setSearchQuery, isSearchOverlayOpen, setIsSearchOverlayOpen, activeView, setActiveView, activeNav, setActiveNav, navigateTo, selectedCity, setIsCityConfirmed, currentUser, setIsAuthModalOpen }) => {
    return (
        <header className="glass-header sticky top-0 z-40 transition-colors duration-300 border-b border-gray-100 dark:border-gray-800">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-4 group cursor-pointer" onClick={() => navigateTo('shop', 'Всі')}>
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary rounded-full blur opacity-40 group-hover:opacity-70 transition duration-500"></div>
                            <img src="images/logo.png" alt="Choco Yummy" className="h-12 w-12 object-contain relative z-10 bg-white rounded-full p-1 shadow-sm" />
                        </div>
                        <div className="hidden md:block">
                            <div className="text-xs text-gray-500 dark:text-gray-400 font-medium tracking-wide uppercase">Мережа супермаркетів</div>
                            <div className="font-extrabold text-xl gradient-text tracking-tight">Choco Yummy</div>
                        </div>
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
                    <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} />
                    
                    <div className="flex flex-col text-right hidden lg:flex border-l border-gray-200 dark:border-gray-700 pl-4">
                        <span className="font-bold text-dark dark:text-white text-sm">+38 (000) 000-00-00</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Пн-Нд: 09:00 - 20:00</span>
                    </div>
                    
                    <button 
                        onClick={() => currentUser ? navigateTo('profile') : setIsAuthModalOpen(true)}
                        className={`relative p-2.5 rounded-full transition-all shadow-sm ml-2 ${activeView === 'profile' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-darkCard text-dark dark:text-white hover:bg-primary hover:text-white'}`}
                        title="Особистий кабінет"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </button>
                    
                    <button 
                        onClick={() => navigateTo('checkout')}
                        className={`relative p-2.5 rounded-full transition-all shadow-sm ml-2 ${activeView === 'checkout' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-darkCard text-dark dark:text-white hover:bg-primary hover:text-white'}`}
                        title="Кошик"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        {cartItemsCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white dark:border-darkBg shadow-sm cart-badge">
                                {cartItemsCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>
            {(activeView === 'shop' || activeView === 'product') && (
                <nav className="border-t border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-darkBg/50 backdrop-blur-md">
                    <div className="container mx-auto px-4">
                        <ul className="flex items-center gap-8 text-sm font-semibold h-12 overflow-x-auto whitespace-nowrap hide-scrollbar text-gray-600 dark:text-gray-300">
                            {navItems.map(item => (
                                <li key={item} 
                                    onClick={() => navigateTo('shop', item)}
                                    className={`cursor-pointer h-full flex items-center transition-colors ${activeNav === item ? 'text-primary border-b-2 border-primary' : 'hover:text-primary dark:hover:text-primary'}`}>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </nav>
            )}
        </header>
    );
};

const ProductCard = ({ product, addToCart, onSelect, onImageError }) => {
    const [isImageLoaded, setIsImageLoaded] = React.useState(false);

    return (
    <div className={`glass-panel rounded-2xl p-4 product-card relative group flex flex-col h-full overflow-hidden cursor-pointer transition-opacity duration-500 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`} onClick={() => onSelect(product)}>
        {product.isNew && <div className="absolute top-4 left-4 bg-accent text-white text-xs font-bold px-2.5 py-1 rounded-full z-10 shadow-md animate-pulse">Новинка</div>}
        {product.isPopular && !product.isNew && <div className="absolute top-4 left-4 bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full z-10 shadow-md">Хіт</div>}
        {product.outOfStock && <div className="absolute top-4 left-4 bg-gray-500 text-white text-xs font-bold px-2.5 py-1 rounded-full z-10 shadow-md">Немає в наявності</div>}
        
        <div className="relative mb-4 aspect-square flex items-center justify-center p-6 bg-white dark:bg-gray-800/50 rounded-xl overflow-hidden group-hover:shadow-inner transition-shadow">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <SmartImage src={product.localImage} fallbackSrc={product.image} alt={product.name} className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-110" onFinalError={onImageError} onLoad={() => setIsImageLoaded(true)} />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold bg-white/20 px-4 py-2 rounded-full">Детальніше</span>
            </div>
        </div>
        
        <div className="text-xs font-semibold text-accent mb-1.5 uppercase tracking-wider">{product.category}</div>
        <h4 className="font-bold text-dark dark:text-gray-100 leading-snug mb-3 flex-grow hover:text-primary transition-colors cursor-pointer line-clamp-2 text-lg">{product.name}</h4>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-700/50" onClick={(e) => e.stopPropagation()}>
            <div className="font-extrabold text-2xl text-dark dark:text-white flex items-baseline gap-1">
                {product.price} <span className="text-sm text-gray-500 font-medium">грн</span>
            </div>
            <button onClick={() => addToCart(product)} className={`w-10 h-10 rounded-xl transition-all duration-300 flex items-center justify-center ${product.outOfStock ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed' : 'gradient-bg text-white shadow-lg hover:shadow-primary/40 transform hover:-translate-y-1 z-20 relative'}`} disabled={product.outOfStock}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
            </button>
        </div>
    </div>
  );
};
const customProducts = [
    {
        id: "custom-lemonade-01",
        name: "Summer Splash Lemonade 500ml",
        price: 85,
        category: "Газовані напої",
        localImage: "product_lemonade.png",
        weight: "500 мл",
        brand: "Summer Splash",
        details: { calories: "45 ккал", ingredients: "Вода, сік лимона" }
    },
    {
        id: "custom-kinder-01",
        name: "Kinder Breakfast Milk Slice",
        price: 45,
        category: "Шоколад",
        localImage: "product_kinder.png",
        weight: "40 г",
        brand: "Kinder",
        details: { calories: "420 ккал", ingredients: "Молоко, шоколад" }
    },
    {
        id: "custom-muffin-01",
        name: "XXL Топ-дроп Мафін з карамеллю",
        price: 120,
        category: "Солодощі",
        localImage: "product_muffin.png",
        weight: "200 г",
        brand: "Choco Yummy Bakery",
        details: { calories: "550 ккал", ingredients: "Шоколад, карамель, борошно" }
    },
    {
        id: "custom-protein-01",
        name: "Power Protein Bar",
        price: 95,
        category: "Снеки",
        localImage: "product_protein.png",
        weight: "60 г",
        brand: "Power Nutrition",
        details: { calories: "220 ккал", ingredients: "Протеїн, вівсянка" }
    },
    {
        id: "custom-monster-01",
        name: "Monster Energy Original 500ml",
        price: 65,
        category: "Енергетики",
        localImage: "product_monster.png",
        weight: "500 мл",
        brand: "Monster Energy",
        details: { calories: "237 ккал", ingredients: "Вода, цукор, таурин, женьшень, кофеїн" }
    }
];
allProducts.push(...customProducts);

const promotions = [
    { 
        id: 1, 
        title: "Ця добірка на 100% складається з лимонадів, ягід та морозива", 
        image: "images/banner_summer.png", 
        tag: "ДОБІРКА",
        content: "Літо у самому розпалі! І що може бути краще за освіжаючий ковток холодного лимонаду? Ми підготували для вас ідеальну добірку: свіжі ягоди, натуральні лимонади та найсмачніше морозиво. Відчуйте смак справжнього літнього відпочинку!",
        featuredProducts: ["custom-lemonade-01"],
        btnText: "Всі напої"
    },
    { 
        id: 2, 
        title: "Новинка від Kinder до сніданку", 
        image: "images/banner_kinder.png", 
        tag: "НОВИНКА",
        content: "Ваш ідеальний ранок починається з Kinder! Представляємо абсолютно новий формат улюбленого шоколаду, створений спеціально для поживного сніданку. Ніжна молочна начинка, танучий шоколад та заряд енергії на весь день.",
        featuredProducts: ["custom-kinder-01"],
        btnText: "Купити Kinder"
    },
    { 
        id: 3, 
        title: "Знижки на лінійку енергетиків Monster", 
        image: "images/banner_monster.png", 
        tag: "АКЦІЯ",
        content: "Потрібен заряд енергії? Зустрічайте шалені знижки на всю лінійку енергетиків Monster Energy! Охолодіть свій розум та зарядіться на максимум. Замовляйте улюблений смак просто зараз, поки він є в наявності!",
        featuredProducts: ["custom-monster-01"],
        btnText: "Перейти до енергетиків"
    },
    { 
        id: 4, 
        title: "Усім спорт! Знижки на нашу спортивну лінійку", 
        image: "images/banner_sport.png", 
        tag: "ЗНИЖКИ",
        content: "Для тих, хто завжди в русі! Ми запускаємо глобальний розпродаж нашої спортивної лінійки. Протеїнові батончики, енергетики без цукру та корисні снеки тепер зі знижками до -30%. Досягайте своїх цілей разом із нами!",
        featuredProducts: ["custom-protein-01"],
        btnText: "Показати всі снеки"
    }
];

const dummyUser = {
    name: "Олександр Петренко",
    phone: "+38 (099) 123-45-67",
    email: "oleksandr.p@example.com",
    address: "м. Київ, вул. Хрещатик, 24, кв. 15",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    bonuses: 350
};

const dummyOrders = [
    {
        id: "CY-84729",
        date: "17 Червня 2026, 14:30",
        status: "in_transit", // 'processing', 'in_transit', 'delivered', 'cancelled'
        total: 1250,
        items: [
            { name: "Kinder Chocolate", quantity: 2 },
            { name: "Coca Cola Zero", quantity: 1 }
        ]
    },
    {
        id: "CY-83102",
        date: "10 Червня 2026, 18:15",
        status: "delivered",
        total: 840,
        items: [
            { name: "Fanta Orange", quantity: 3 },
            { name: "Milka Oreo", quantity: 2 }
        ]
    },
    {
        id: "CY-79044",
        date: "02 Травня 2026, 09:45",
        status: "delivered",
        total: 2100,
        items: [
            { name: "Red Bull Energy", quantity: 4 },
            { name: "Nutella 400g", quantity: 1 },
            { name: "Kinder Bueno", quantity: 5 }
        ]
    }
];

const App = () => {
    // State
    const [cookieAccepted, setCookieAccepted] = useState(() => {
        return localStorage.getItem('cookieAccepted') === 'true';
    });
    const [activeView, setActiveView] = useState('shop'); // 'shop', 'product', 'checkout', 'success', 'profile', 'article'
    const [activeArticle, setActiveArticle] = useState(null);
    const [activeNav, setActiveNav] = useState('Всі');
    const [isDark, setIsDark] = useState(false);
    const [cart, setCart] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("Всі");
    const [currentPage, setCurrentPage] = useState(1);
    const [brokenImages, setBrokenImages] = useState(new Set());
    
    // City Selection State
    const [selectedCity, setSelectedCity] = useState("Київ");
    const [isSelectingCity, setIsSelectingCity] = useState(false);
    const [isCityConfirmed, setIsCityConfirmed] = useState(false);
    const availableCities = ["Київ", "Львів", "Одеса", "Харків", "Дніпро"];

    // Auth State
    const [currentUser, setCurrentUser] = useState(() => {
        const saved = localStorage.getItem('currentUser');
        return saved ? JSON.parse(saved) : null;
    });
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
    const [authForm, setAuthForm] = useState({ name: '', email: '', phone: '', address: '', password: '' });
    const [authError, setAuthError] = useState('');

    const handleAcceptCookie = () => {
        localStorage.setItem('cookieAccepted', 'true');
        setCookieAccepted(true);
    };
    
    const handleAuthSubmit = (e) => {
        e.preventDefault();
        setAuthError('');
        
        let users = JSON.parse(localStorage.getItem('users') || '[]');
        
        if (authMode === 'register') {
            if (!authForm.name || !authForm.email || !authForm.password) {
                setAuthError('Будь ласка, заповніть всі обов\'язкові поля');
                return;
            }
            if (users.find(u => u.email === authForm.email)) {
                setAuthError('Користувач з таким email вже існує');
                return;
            }
            
            const newUser = {
                id: Date.now(),
                ...authForm,
                bonuses: 100, // Welcome bonuses!
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(authForm.name)}&background=random`,
                orders: []
            };
            
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(newUser));
            setCurrentUser(newUser);
            setIsAuthModalOpen(false);
            setAuthForm({ name: '', email: '', phone: '', address: '', password: '' });
            
        } else {
            const user = users.find(u => u.email === authForm.email && u.password === authForm.password);
            if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                setCurrentUser(user);
                setIsAuthModalOpen(false);
                setAuthForm({ name: '', email: '', phone: '', address: '', password: '' });
            } else {
                setAuthError('Невірний email або пароль');
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        setCurrentUser(null);
        navigateTo('shop');
    };
    
    // Filters
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [calRange, setCalRange] = useState({ min: '', max: '' });
    
    const [lastOrderDetails, setLastOrderDetails] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const carouselRef = useRef(null);

    const scrollCarousel = (direction) => {
        if (carouselRef.current) {
            const scrollAmount = direction === 'left' ? -300 : 300;
            carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    // Browser History Integration
    useEffect(() => {
        const handlePopState = (e) => {
            if (e.state) {
                setActiveView(e.state.view || 'shop');
                if (e.state.nav) setActiveNav(e.state.nav);
                if (e.state.product) setSelectedProduct(e.state.product);
            }
        };
        window.history.replaceState({ view: activeView, nav: activeNav, product: selectedProduct }, '');
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const navigateTo = (view, nav = activeNav, product = selectedProduct, article = activeArticle) => {
        window.history.pushState({ view, nav, product, article }, '');
        setActiveView(view);
        if (nav !== activeNav) {
            setSelectedCategory(nav);
        }
        setActiveNav(nav);
        setSelectedProduct(product);
        setActiveArticle(article);
        window.scrollTo(0, 0);
    };

    const itemsPerPage = 6;

    // Theme logic
    useEffect(() => {
        if (isDark) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
    }, [isDark]);

    // Cart logic
    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const updateQuantity = (id, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(id);
            return;
        }
        setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: newQuantity } : item));
    };

    const removeFromCart = (id) => setCart(prev => prev.filter(item => item.id !== id));
    const clearCart = () => setCart([]);

    const clearFilters = () => {
        setSearchQuery(''); 
        setSelectedCategory('Всі');
        setPriceRange({ min: '', max: '' });
        setCalRange({ min: '', max: '' });
    };

    // Filter logic
    const filteredProducts = useMemo(() => {
        return allProducts.filter(p => {
            if (brokenImages.has(p.id)) return false;
            // Deep search
            const q = searchQuery.toLowerCase();
            const matchSearch = !q || 
                p.name.toLowerCase().includes(q) || 
                p.category.toLowerCase().includes(q) ||
                p.details.description.toLowerCase().includes(q) ||
                p.details.brand.toLowerCase().includes(q) ||
                p.details.country.toLowerCase().includes(q);

            const drinkCategories = ["Газовані напої", "Азіатські напої", "Соки зі шматочками", "Енергетики"];
            const matchCategory = 
                selectedCategory === "Всі" ? true :
                selectedCategory === "Напої" ? drinkCategories.includes(p.category) :
                p.category === selectedCategory;
            
            const matchPrice = (!priceRange.min || p.price >= Number(priceRange.min)) && 
                               (!priceRange.max || p.price <= Number(priceRange.max));
                               
            const calories = p.details?.calories ? parseInt(p.details.calories) : 0;
            const matchCal = (!calRange.min || calories >= Number(calRange.min)) && 
                             (!calRange.max || calories <= Number(calRange.max));

            return matchSearch && matchCategory && matchPrice && matchCal;
        });
    }, [searchQuery, selectedCategory, priceRange, calRange, brokenImages]);

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    useEffect(() => { setCurrentPage(1); }, [searchQuery, selectedCategory, priceRange, calRange]);

    // Checkout Logic
    const handleCheckoutSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newOrderId = Math.floor(100000 + Math.random() * 900000);
        const orderTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        setLastOrderDetails({
            id: newOrderId,
            date: new Date().toLocaleString('uk-UA'),
            items: [...cart],
            total: orderTotal,
            customer: formData.get('name'),
            phone: formData.get('phone'),
            city: formData.get('city'),
            postOffice: formData.get('postOffice'),
            paymentMethod: "Накладений платіж",
            doNotCall: formData.get('doNotCall') === 'on'
        });

        clearCart();
        navigateTo('success');
    };

    const handleSelectProduct = (product) => {
        navigateTo('product', activeNav, product);
    };

    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Similar products logic
    let similarProducts = [];
    if (selectedProduct) {
        similarProducts = allProducts.filter(p => p.id !== selectedProduct.id);
        similarProducts.sort((a, b) => (a.category === selectedProduct.category ? -1 : 1) - (b.category === selectedProduct.category ? -1 : 1));
        similarProducts = similarProducts.slice(0, 8);
    }

    return (
        <div className="min-h-screen flex flex-col transition-colors duration-300 relative bg-gray-50/50 dark:bg-darkBg">
            <Header 
                isDark={isDark} 
                toggleTheme={() => setIsDark(!isDark)} 
                cartItemsCount={cart.reduce((s, i) => s + i.quantity, 0)}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                isSearchOverlayOpen={isSearchOverlayOpen}
                setIsSearchOverlayOpen={setIsSearchOverlayOpen}
                activeView={activeView}
                setActiveView={setActiveView}
                activeNav={activeNav}
                setActiveNav={setActiveNav}
                navigateTo={navigateTo}
                selectedCity={selectedCity}
                setIsCityConfirmed={setIsCityConfirmed}
                currentUser={currentUser}
                setIsAuthModalOpen={setIsAuthModalOpen}
            />
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
                                    <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3 text-sm uppercase tracking-wider">Категорія</h4>
                                    <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-dark dark:text-white rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer appearance-none">
                                        <option value="Всі">Всі категорії</option>
                                        {categories.filter(c => c !== "Всі").map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3 text-sm uppercase tracking-wider">Ціна (₴)</h4>
                                    <div className="flex items-center gap-2">
                                        <input type="number" placeholder="Від" value={priceRange.min} onChange={e => setPriceRange({...priceRange, min: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-dark dark:text-white rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
                                        <span className="text-gray-400">-</span>
                                        <input type="number" placeholder="До" value={priceRange.max} onChange={e => setPriceRange({...priceRange, max: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-dark dark:text-white rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3 text-sm uppercase tracking-wider">Калорії</h4>
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
                                        <div key={product.id} onClick={() => { setIsSearchOverlayOpen(false); handleSelectProduct(product); }} className="bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-3 cursor-pointer hover:border-primary hover:shadow-md transition-all group flex flex-col items-center text-center">
                                            <div className="h-20 w-20 mb-3 relative flex items-center justify-center bg-white dark:bg-gray-700/50 rounded-lg p-1">
                                                <img src={product.localImage} alt={product.name} className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-300" />
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
            
            {/* Auth Modal */}
            {isAuthModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-darkBg w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative">
                        <button onClick={() => setIsAuthModalOpen(false)} className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors z-10 text-gray-500 dark:text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                        </button>
                        
                        <div className="p-8">
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-extrabold text-dark dark:text-white mb-2">
                                    {authMode === 'login' ? 'З поверненням!' : 'Створити акаунт'}
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {authMode === 'login' ? 'Увійдіть, щоб отримати доступ до кабінету' : 'Зареєструйтесь і отримайте 100 бонусів!'}
                                </p>
                            </div>
                            
                            {authError && (
                                <div className="mb-6 p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm font-medium text-center">
                                    {authError}
                                </div>
                            )}

                            <form onSubmit={handleAuthSubmit} className="space-y-4">
                                {authMode === 'register' && (
                                    <>
                                        <div>
                                            <input type="text" placeholder="Ваше ім'я *" value={authForm.name} onChange={(e) => setAuthForm({...authForm, name: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium" />
                                        </div>
                                        <div>
                                            <input type="tel" placeholder="Телефон" value={authForm.phone} onChange={(e) => setAuthForm({...authForm, phone: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium" />
                                        </div>
                                        <div>
                                            <input type="text" placeholder="Адреса доставки" value={authForm.address} onChange={(e) => setAuthForm({...authForm, address: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium" />
                                        </div>
                                    </>
                                )}
                                <div>
                                    <input type="email" placeholder="Email *" value={authForm.email} onChange={(e) => setAuthForm({...authForm, email: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium" />
                                </div>
                                <div>
                                    <input type="password" placeholder="Пароль *" value={authForm.password} onChange={(e) => setAuthForm({...authForm, password: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium" />
                                </div>
                                
                                <button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/30 transition-all transform hover:-translate-y-1 mt-2">
                                    {authMode === 'login' ? 'Увійти' : 'Зареєструватись'}
                                </button>
                            </form>
                            
                            <div className="mt-8 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                                {authMode === 'login' ? 'Немає акаунту? ' : 'Вже маєте акаунт? '}
                                <button type="button" onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} className="text-primary hover:underline focus:outline-none">
                                    {authMode === 'login' ? 'Створити зараз' : 'Увійти'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            <main className="flex-grow container mx-auto px-4 pb-20 pt-6 animate-in fade-in duration-500">
                {activeView === 'shop' && (
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
                                            // Only show category if it has items, except for 'Всі'
                                            const catCount = cat === "Всі" ? allProducts.length : allProducts.filter(p => p.category === cat).length;
                                            if (cat !== "Всі" && catCount === 0) return null;
                                            return (
                                                <li key={cat}>
                                                    <button onClick={() => setSelectedCategory(cat)} className={`w-full flex justify-between items-center px-4 py-3 rounded-xl transition-all ${selectedCategory === cat ? 'bg-primary/10 dark:bg-primary/20 text-primary font-bold' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                                                        <span>{cat}</span>
                                                        <span className={`text-xs px-2 py-1 rounded-full ${selectedCategory === cat ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>{catCount}</span>
                                                    </button>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>

                                {/* Advanced Filters */}
                                <div className="glass-panel p-6 rounded-2xl shadow-sm">
                                    <h3 className="font-extrabold text-xl mb-5 text-dark dark:text-white flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                                        Тонкі фільтри
                                    </h3>
                                    
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

                                    <button onClick={clearFilters} className="w-full mt-2 text-sm font-bold text-gray-500 hover:text-primary transition-colors">Очистити всі фільтри</button>
                                </div>
                            </aside>

                            <div className="flex-1 min-w-0">
                                {/* Banners Section */}
                                <div className="mb-8 overflow-x-auto pb-4">
                                    <div className="flex gap-4 pb-2 w-max">
                                        {promotions.map(promo => (
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
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 glass-panel p-4 rounded-2xl">
                                    <h1 className="text-3xl font-black text-dark dark:text-white tracking-tight">{selectedCategory}</h1>
                                    <div className="text-sm font-bold text-gray-500">Знайдено: {filteredProducts.length} товарів</div>
                                </div>
                                
                                {paginatedProducts.length > 0 ? (
                                    <>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {paginatedProducts.map(p => <ProductCard key={p.id} product={p} addToCart={addToCart} onSelect={handleSelectProduct} onImageError={() => setBrokenImages(prev => new Set(prev).add(p.id))} />)}
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
                                                src={`https://maps.google.com/maps?q=${encodeURIComponent(selectedCity)}&t=&z=12&ie=UTF8&iwloc=&output=embed&hl=uk`}
                                                style={{ border: 'none' }}
                                            ></iframe>
                                        </div>
                                    </div>
                                </aside>
                            )}
                        </div>
                    </>
                )}

                {activeView === 'article' && activeArticle && (
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
                            <p>{activeArticle.content}</p>
                            
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
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
                                    {allProducts.filter(p => activeArticle.featuredProducts.includes(p.id)).map(product => (
                                        <ProductCard key={product.id} product={product} addToCart={addToCart} onSelect={handleSelectProduct} onImageError={() => setBrokenImages(prev => new Set(prev).add(product.id))} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeView === 'product' && selectedProduct && (
                    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
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
                            <div className="w-full md:w-1/2 bg-white dark:bg-gray-800/80 relative border-r border-gray-100 dark:border-gray-800 min-h-[400px]">
                                <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-accent/5"></div>
                                <SmartImage src={selectedProduct.localImage} fallbackSrc={selectedProduct.image} alt={selectedProduct.name} className="absolute inset-0 w-full h-full object-cover z-10" />
                                {selectedProduct.outOfStock && (
                                    <div className="absolute top-8 left-8 bg-gray-500 text-white text-sm font-bold px-4 py-2 rounded-full z-20 shadow-md">Немає в наявності</div>
                                )}
                            </div>

                            {/* Details Section */}
                            <div className="w-full md:w-1/2 p-8 lg:p-14 flex flex-col">
                                <h1 className="text-4xl lg:text-5xl font-black text-dark dark:text-white mb-6 leading-tight tracking-tight">{selectedProduct.name}</h1>
                                
                                <div className="flex items-end gap-4 mb-8">
                                    <div className="text-5xl font-black gradient-text tracking-tighter">{selectedProduct.price} <span className="text-2xl font-bold">грн</span></div>
                                    {selectedProduct.isPopular && <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-2">Хіт продажу</span>}
                                </div>

                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg mb-10">
                                    {selectedProduct.details.description}
                                </p>

                                <div className="grid grid-cols-2 gap-y-6 gap-x-8 text-sm mb-12 bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                                    <div>
                                        <span className="text-gray-500 block mb-1">Бренд</span>
                                        <span className="font-bold text-lg text-dark dark:text-white">{selectedProduct.details.brand}</span>
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
                )}

                {activeView === 'checkout' && (
                    <div className="max-w-5xl mx-auto">
                        <div className="py-2 text-sm text-gray-500 dark:text-gray-400 font-medium mb-6">
                            <span onClick={() => {setActiveView('shop'); setActiveNav('Напої');}} className="hover:text-primary cursor-pointer transition-colors">Головна</span>
                            <span className="mx-3 text-gray-300 dark:text-gray-600">/</span>
                            <span className="text-dark dark:text-gray-200">Оформлення замовлення</span>
                        </div>
                        
                        <div className="bg-white dark:bg-darkBg rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-gray-100 dark:border-gray-800">
                            {/* Order Summary */}
                            <div className="w-full md:w-5/12 bg-gray-50 dark:bg-darkCard p-6 sm:p-8 border-r border-gray-100 dark:border-gray-800 flex flex-col h-full min-h-[500px]">
                                <h2 className="text-2xl font-black text-dark dark:text-white mb-6">Ваш кошик</h2>
                                
                                {cart.length === 0 ? (
                                    <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                                        <div className="text-6xl mb-4">🛒</div>
                                        <p className="mb-6 font-medium">Кошик поки порожній</p>
                                        <button onClick={() => navigateTo('shop', 'Напої')} className="px-6 py-2.5 bg-primary/10 text-primary rounded-full font-bold hover:bg-primary hover:text-white transition-colors">Перейти до покупок</button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex-1 space-y-6 overflow-y-auto pr-2 max-h-[60vh]">
                                            {cart.map(item => (
                                                <div key={item.id} className="flex gap-4 glass-panel p-3 rounded-2xl">
                                                    <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-xl p-2 border border-gray-100 dark:border-gray-700 flex-shrink-0 relative">
                                                        <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                                                        <button onClick={() => removeFromCart(item.id)} className="absolute -top-2 -right-2 bg-white dark:bg-gray-700 text-gray-400 hover:text-red-500 rounded-full p-1 shadow-md transition-colors">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                                        </button>
                                                    </div>
                                                    <div className="flex-1 flex flex-col justify-center">
                                                        <h4 className="font-bold text-dark dark:text-white leading-tight mb-1 text-sm">{item.name}</h4>
                                                        <div className="text-primary font-bold mb-2 text-sm">{item.price} грн</div>
                                                        <div className="flex items-center gap-3">
                                                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-700 text-dark dark:text-white transition">-</button>
                                                            <span className="font-bold text-dark dark:text-white w-4 text-center">{item.quantity}</span>
                                                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-700 text-dark dark:text-white transition">+</button>
                                                        </div>
                                                    </div>
                                                    <div className="font-bold text-dark dark:text-white self-center">
                                                        {item.price * item.quantity} грн
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                                            <div className="flex justify-between items-center text-xl font-black text-dark dark:text-white">
                                                <span>До сплати:</span>
                                                <span className="gradient-text">{cartTotal} грн</span>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Form */}
                            <div className="w-full md:w-7/12 p-6 sm:p-10 relative">
                                <h2 className="text-2xl font-black text-dark dark:text-white mb-6">Дані одержувача</h2>
                                
                                <form onSubmit={handleCheckoutSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Ім'я Прізвище</label>
                                            <input required name="name" type="text" placeholder="Іван Іванов" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-darkBg border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Телефон</label>
                                            <input required name="phone" type="tel" placeholder="+38 (000) 000-00-00" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-darkBg border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Місто</label>
                                        <input required name="city" type="text" placeholder="Київ" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-darkBg border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Відділення пошти</label>
                                        <input required name="postOffice" type="text" placeholder="Відділення Нової Пошти №1" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-darkBg border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                                    </div>

                                    <div className="pt-2">
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Оплата</label>
                                        <label className="flex items-center gap-3 p-4 border border-primary bg-primary/5 rounded-xl cursor-not-allowed opacity-90">
                                            <input type="radio" name="payment" checked readOnly className="w-5 h-5 text-primary accent-primary" />
                                            <div>
                                                <div className="font-bold text-dark dark:text-white">Накладений платіж</div>
                                                <div className="text-xs text-gray-500">Оплата при отриманні на пошті</div>
                                            </div>
                                        </label>
                                    </div>

                                    <div className="pt-2">
                                        <label className="flex items-center gap-3 cursor-pointer p-4 bg-gray-50 dark:bg-darkBg border border-gray-200 dark:border-gray-700 rounded-xl hover:border-primary transition-colors">
                                            <input type="checkbox" name="doNotCall" className="w-5 h-5 text-primary rounded focus:ring-primary accent-primary cursor-pointer" />
                                            <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Не дзвонити мені для підтвердження замовлення</span>
                                        </label>
                                    </div>

                                    <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                                        <button type="submit" disabled={cart.length === 0} className={`w-full font-bold py-4 rounded-xl shadow-lg transition-all ${cart.length === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'gradient-bg text-white hover:-translate-y-1'}`}>
                                            Оформити замовлення
                                        </button>
                                        <button type="button" onClick={() => navigateTo('shop', 'Напої')} className="w-full mt-3 font-bold py-4 rounded-xl text-gray-500 hover:text-dark dark:hover:text-white transition-colors">
                                            Повернутися до покупок
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {activeView === 'profile' && currentUser && (
                    <div className="max-w-6xl mx-auto py-8 px-4 animate-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center gap-4 mb-8">
                            <button onClick={() => navigateTo('shop')} className="p-2 bg-white dark:bg-darkCard rounded-full shadow-sm hover:shadow-md transition-all text-dark dark:text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                            </button>
                            <h2 className="text-3xl font-extrabold text-dark dark:text-white">Особистий кабінет</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left Column: User Info & Bonuses */}
                            <div className="space-y-8">
                                {/* Profile Card */}
                                <div className="glass-panel p-6 rounded-3xl shadow-sm">
                                    <div className="flex items-center gap-4 mb-6">
                                        <img src={currentUser.avatar} alt={currentUser.name} className="w-16 h-16 rounded-full border-2 border-primary shadow-sm" />
                                        <div>
                                            <h3 className="text-xl font-bold text-dark dark:text-white">{currentUser.name}</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Постійний клієнт</p>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                            <div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Телефон</div>
                                                <div className="text-dark dark:text-white font-semibold">{currentUser.phone || "Не вказано"}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                            <div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Email</div>
                                                <div className="text-dark dark:text-white font-semibold">{currentUser.email}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                            <div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Адреса доставки</div>
                                                <div className="text-dark dark:text-white font-semibold">{currentUser.address || "Не вказано"}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 mt-6">
                                        <button className="flex-1 py-2.5 bg-gray-100 dark:bg-gray-800 text-dark dark:text-white font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                            Редагувати
                                        </button>
                                        <button onClick={handleLogout} className="py-2.5 px-4 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-bold rounded-xl hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors" title="Вийти з акаунту">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                        </button>
                                    </div>
                                </div>
                                
                                {/* Bonuses Card */}
                                <div className="bg-gradient-to-br from-primary to-orange-400 rounded-3xl p-6 shadow-lg text-white relative overflow-hidden group cursor-pointer hover:shadow-xl transition-all">
                                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="font-bold text-white/90">Ваш баланс</h3>
                                            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            </div>
                                        </div>
                                        <div className="text-4xl font-extrabold mb-1">{currentUser.bonuses}</div>
                                        <div className="text-sm text-white/80 font-medium mb-6">Choco Coins</div>
                                        <div className="text-xs bg-black/10 p-3 rounded-xl backdrop-blur-sm border border-white/10">
                                            Ви можете використати їх для оплати до 50% вартості наступного замовлення!
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Right Column: Orders */}
                            <div className="lg:col-span-2">
                                <div className="glass-panel p-8 rounded-3xl shadow-sm h-full">
                                    <h3 className="text-xl font-bold text-dark dark:text-white mb-6">Історія замовлень</h3>
                                    
                                    {(!currentUser.orders || currentUser.orders.length === 0) ? (
                                        <div className="text-center py-10">
                                            <div className="bg-gray-100 dark:bg-gray-800 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4 text-gray-400">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                            </div>
                                            <h4 className="font-bold text-dark dark:text-white mb-2">У вас ще немає замовлень</h4>
                                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Але це ніколи не пізно виправити!</p>
                                            <button onClick={() => navigateTo('shop')} className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors">Перейти до каталогу</button>
                                        </div>
                                    ) : (
                                    <div className="space-y-4">
                                        {currentUser.orders.map(order => (
                                            <div key={order.id} className="border border-gray-100 dark:border-gray-800 rounded-2xl p-5 hover:border-primary/30 transition-colors">
                                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 pb-4 border-b border-gray-100 dark:border-gray-800">
                                                    <div>
                                                        <div className="flex items-center gap-3 mb-1">
                                                            <span className="font-extrabold text-dark dark:text-white">{order.id}</span>
                                                            <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                                                                order.status === 'in_transit' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                                                                order.status === 'delivered' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                                                                order.status === 'processing' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' :
                                                                'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                                                            }`}>
                                                                {order.status === 'in_transit' ? 'Прямує до вас 🚚' :
                                                                 order.status === 'delivered' ? 'Доставлено ✅' :
                                                                 order.status === 'processing' ? 'В обробці ⏳' : 'Скасовано ❌'}
                                                            </span>
                                                        </div>
                                                        <div className="text-sm text-gray-500">{order.date}</div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-extrabold text-lg text-dark dark:text-white">{order.total} ₴</div>
                                                    </div>
                                                </div>
                                                
                                                <div className="space-y-2 mb-4">
                                                    {order.items.map((item, idx) => (
                                                        <div key={idx} className="flex justify-between items-center text-sm">
                                                            <span className="text-gray-600 dark:text-gray-300 font-medium">{item.name}</span>
                                                            <span className="text-gray-400 font-medium">x{item.quantity}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                
                                                <div className="flex gap-2">
                                                    <button className="flex-1 py-2 bg-gray-100 dark:bg-gray-800 text-dark dark:text-white font-bold rounded-xl text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                                        Деталі
                                                    </button>
                                                    <button className="flex-1 py-2 bg-primary/10 text-primary font-bold rounded-xl text-sm hover:bg-primary hover:text-white transition-colors">
                                                        Повторити
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeView === 'success' && lastOrderDetails && (
                    <div className="max-w-3xl mx-auto py-10 animate-in slide-in-from-bottom-8 duration-500">
                        <div className="glass-panel p-10 rounded-3xl shadow-2xl relative overflow-hidden">
                            <div className="absolute -top-20 -right-20 w-64 h-64 bg-green-500/10 rounded-full blur-3xl"></div>
                            
                            <div className="text-center mb-10 relative z-10">
                                <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <h2 className="text-4xl font-black text-dark dark:text-white mb-3">Замовлення успішно оформлено!</h2>
                                <p className="text-gray-500 dark:text-gray-400 text-lg">Дякуємо, {lastOrderDetails.customer}. Ваше замовлення <span className="font-bold text-primary">#{lastOrderDetails.id}</span> прийнято в роботу.</p>
                                
                                <div className="mt-4 inline-block max-w-lg">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                        Запит прийнято в обробку.
                                        {lastOrderDetails.doNotCall 
                                            ? " Очікуйте SMS з номером ТТН після відправки товару." 
                                            : " Наш менеджер зв'яжеться з вами найближчим часом."}
                                    </p>
                                </div>
                            </div>

                            {/* Receipt */}
                            <div className="bg-white dark:bg-darkCard rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden relative z-10">
                                <div className="bg-gray-50 dark:bg-gray-800/50 p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                                    <div>
                                        <h3 className="font-black text-xl tracking-wide uppercase text-dark dark:text-white">Чек замовлення</h3>
                                        <div className="text-xs text-gray-500 mt-1">{lastOrderDetails.date}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm text-gray-500">Номер замовлення</div>
                                        <div className="font-bold text-xl text-primary">#{lastOrderDetails.id}</div>
                                    </div>
                                </div>
                                
                                <div className="p-6">
                                    <div className="mb-6 space-y-4">
                                        <h4 className="font-bold text-sm text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700 pb-2">Товари</h4>
                                        {lastOrderDetails.items.map(item => (
                                            <div key={item.id} className="flex justify-between items-center">
                                                <div className="flex items-center gap-3">
                                                    <span className="font-bold text-dark dark:text-white">{item.quantity}x</span>
                                                    <span className="text-gray-700 dark:text-gray-300">{item.name}</span>
                                                </div>
                                                <div className="font-bold">{item.price * item.quantity} грн</div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mb-6">
                                        <h4 className="font-bold text-sm text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700 pb-2 mb-4">Деталі доставки</h4>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div><span className="text-gray-500">Одержувач:</span> <br/><span className="font-medium text-dark dark:text-white">{lastOrderDetails.customer}</span></div>
                                            <div><span className="text-gray-500">Телефон:</span> <br/><span className="font-medium text-dark dark:text-white">{lastOrderDetails.phone}</span></div>
                                            <div><span className="text-gray-500">Адреса:</span> <br/><span className="font-medium text-dark dark:text-white">{lastOrderDetails.city}, {lastOrderDetails.postOffice}</span></div>
                                            <div><span className="text-gray-500">Оплата:</span> <br/><span className="font-medium text-dark dark:text-white">{lastOrderDetails.paymentMethod}</span></div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 flex justify-between items-center">
                                        <span className="font-black text-lg">РАЗОМ ДО СПЛАТИ:</span>
                                        <span className="font-black text-2xl text-primary">{lastOrderDetails.total} грн</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10 text-center relative z-10">
                                <button onClick={() => navigateTo('shop', 'Напої')} className="px-8 py-4 gradient-bg text-white font-bold rounded-full shadow-lg hover:shadow-primary/40 transition-all transform hover:-translate-y-1">
                                    Повернутися на головну
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
            
            <footer className="bg-black text-gray-300 pt-16 pb-8 mt-auto border-t border-gray-900 relative z-10">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                        <div>
                            <div className="font-extrabold text-xl gradient-text tracking-tight mb-4 flex items-center gap-2">
                                Choco Yummy
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed mb-6">
                                Магазин солодощів та екзотичних напоїв з усього світу.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-4 uppercase tracking-wider text-sm">Контакти</h4>
                            <ul className="text-sm text-gray-400 space-y-3">
                                <li className="flex items-start gap-3">
                                    <span className="text-lg">📍</span>
                                    <span>м. Київ, вул. Хрещатик, 24<br/>Україна, 01001</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="text-lg">📞</span>
                                    <a href="tel:+380000000000" className="hover:text-primary transition-colors font-medium">+38 (000) 000-00-00</a>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="text-lg">✉️</span>
                                    <a href="mailto:hello@chocoyummy.com.ua" className="hover:text-primary transition-colors">hello@chocoyummy.com.ua</a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-4 uppercase tracking-wider text-sm">Інформація</h4>
                            <ul className="text-sm text-gray-400 space-y-3">
                                <li><a href="#" className="hover:text-primary transition-colors">Про нас</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Доставка і оплата</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Політика конфіденційності</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Умови повернення</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-4 uppercase tracking-wider text-sm">Графік роботи</h4>
                            <ul className="text-sm text-gray-400 space-y-3 mb-6 bg-gray-900 p-4 rounded-xl border border-gray-800">
                                <li className="flex justify-between items-center"><span>Пн - Пт:</span> <span className="font-bold text-white">09:00 - 20:00</span></li>
                                <li className="flex justify-between items-center border-t border-gray-800 pt-2"><span>Сб - Нд:</span> <span className="font-bold text-white">10:00 - 18:00</span></li>
                            </ul>
                            <div className="flex gap-3">
                                <a href="#" className="w-10 h-10 rounded-xl bg-gray-800 text-white flex items-center justify-center hover:bg-primary transition-colors font-bold text-sm">IG</a>
                                <a href="#" className="w-10 h-10 rounded-xl bg-gray-800 text-white flex items-center justify-center hover:bg-primary transition-colors font-bold text-sm">FB</a>
                                <a href="#" className="w-10 h-10 rounded-xl bg-gray-800 text-white flex items-center justify-center hover:bg-primary transition-colors font-bold text-sm">TG</a>
                            </div>
                        </div>
                    </div>
                    <div className="text-center text-sm font-medium text-gray-500 pt-8 border-t border-gray-800 flex justify-center items-center">
                        <span>&copy; {new Date().getFullYear()} Choco Yummy. Всі права захищені.</span>
                    </div>
                </div>
            </footer>

            {!cookieAccepted && (
                <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white dark:bg-darkCard p-4 rounded-2xl shadow-2xl z-50 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 max-w-2xl w-[calc(100%-2rem)] border border-gray-200 dark:border-gray-700 animate-in slide-in-from-bottom-8 duration-500">
                    <p className="text-sm text-gray-600 dark:text-gray-300 text-center sm:text-left">
                        Ми використовуємо <strong>рекомендаційні технології</strong> та збираємо текстові файли cookie для аналітики та правильної роботи сайту. Залишаючись на сайті, ви <strong>погоджуєтесь з обробкою текстових файлів cookie</strong>.
                    </p>
                    <button onClick={handleAcceptCookie} className="w-full sm:w-auto whitespace-nowrap px-6 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-dark dark:text-white font-bold rounded-xl transition-colors">
                        Погоджуюсь
                    </button>
                </div>
            )}
        </div>
    );
};

export default App;
