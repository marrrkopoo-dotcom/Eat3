import React, { useState, useEffect, useMemo, useRef } from 'react';

import productsData from './data/products.json';

const allProducts = productsData.filter(p => !!p.localImage || !!p.image).map(p => ({ ...p, _rand: Math.random() }));

const categoryImages = {
    "Газовані напої": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80",
    "Азіатські напої": "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&q=80",
    "Соки зі шматочками": "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&q=80",
    "Енергетики": "https://images.unsplash.com/photo-1604152135912-04a022e23696?w=400&q=80",
    "Снеки": "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&q=80",
    "Шоколад": "https://images.unsplash.com/photo-1548831772-2bb8b6680a13?w=400&q=80",
};

allProducts.forEach((p, index) => {
    // Add a small seed to Unsplash URL to get slight variations within the same category if possible, or just use the category image
    if (p.image.startsWith('images/')) {
        p.image = categoryImages[p.category] || categoryImages["Снеки"];
    } else if (p.image.startsWith('enc-')) {
        p.image = `/images/cache/${encodeURIComponent(p.image)}`;
    }
});

const categories = ["Всі", "Напої", "Снеки", "Шоколад", "Печиво та вафлі", "Акції"];
const navItems = ["Всі", "Напої", "Снеки", "Шоколад", "Печиво та вафлі", "Акції"];

const SmartImage = ({ src, fallbackSrc, alt, className, style, onFinalError, onLoad }) => {
    const [currentSrc, setCurrentSrc] = React.useState(src || fallbackSrc);
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [failedLocal, setFailedLocal] = React.useState(false);
    const imgRef = React.useRef(null);

    React.useEffect(() => {
        setCurrentSrc(src || fallbackSrc);
        setIsLoaded(false);
        setFailedLocal(false);
    }, [src, fallbackSrc]);

    // Handle cached images immediately
    React.useEffect(() => {
        if (imgRef.current && imgRef.current.complete) {
            setIsLoaded(true);
            if (typeof onLoad === 'function') onLoad();
        }
    }, [currentSrc]);

    const handleError = () => {
        if (!failedLocal && src && fallbackSrc) {
            setFailedLocal(true);
            setCurrentSrc(fallbackSrc);
        } else if (typeof onFinalError === 'function') {
            onFinalError();
        }
    };

    return (
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            <img 
                ref={imgRef}
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

const Header = ({ cartItemsCount, searchQuery, setSearchQuery, isSearchOverlayOpen, setIsSearchOverlayOpen, activeView, setActiveView, activeNav, setActiveNav, navigateTo, selectedCity, setIsCityConfirmed, currentUser, setIsAuthModalOpen, setRepeatedOrderDetails }) => {
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
                    <div className="flex flex-col text-right hidden lg:flex border-l border-gray-200 dark:border-gray-700 pl-4">
                        <a href="tel:+380779152365" className="font-bold text-dark dark:text-white hover:text-primary transition-colors text-sm">+38 (077) 915-23-65</a>
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
                        onClick={() => {
                            if (setRepeatedOrderDetails) setRepeatedOrderDetails(null);
                            navigateTo('checkout');
                        }}
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
                            {navItems.map(item => {
                                const isPromo = item === 'Акції';
                                return (
                                    <li key={item} 
                                        onClick={() => navigateTo('shop', item)}
                                        className={`cursor-pointer h-full flex items-center gap-1 transition-all ${
                                            isPromo 
                                                ? activeNav === item 
                                                    ? 'text-red-500 border-b-2 border-red-500 font-extrabold scale-105' 
                                                    : 'text-red-500 dark:text-red-400 font-extrabold hover:text-red-600'
                                                : activeNav === item 
                                                    ? 'text-primary border-b-2 border-primary' 
                                                    : 'hover:text-primary dark:hover:text-primary'
                                        }`}>
                                        {isPromo && <span>🏷️</span>}
                                        <span>{item}</span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </nav>
            )}
        </header>
    );
};

const ProductCard = ({ product, addToCart, onSelect, onImageError, viewMode = 'small' }) => {
    const [isImageLoaded, setIsImageLoaded] = React.useState(false);

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
const customProducts = [
    {
        id: "custom-protein-01",
        name: "Power Protein Bar",
        price: 95,
        category: "Снеки",
        localImage: "images/product_protein.png",
        weight: "60 г",
        brand: "Power Nutrition",
        details: { calories: "220 ккал", ingredients: "Протеїн, вівсянка" }
    },
    {
        id: "custom-monster-01",
        name: "Monster Energy Original 500ml",
        price: 65,
        category: "Енергетики",
        localImage: "images/product_monster.png",
        weight: "500 мл",
        brand: "Monster Energy",
        details: { calories: "237 ккал", ingredients: "Вода, цукор, таурин, женьшень, кофеїн" }
    }
];
allProducts.push(...customProducts);

const promotions = [
    { 
        id: 1, 
        title: "Тропічний вибух Chupa Chups 🥭", 
        image: "/images/banner_chupachups_new.jpg", 
        tag: "АКЦІЯ",
        content: "Відчуй смак сонячного літа з неймовірною серією газованих напоїв Chupa Chups! Справжні соковиті манго, апельсин та виноград в улюбленому форматі. Спеціальна пропозиція: купуй солодкі напої Chupa Chups за суперціною!",
        featuredProducts: [4, 5, 6, 9],
        btnText: "Скуштувати Chupa Chups"
    },
    { 
        id: 3, 
        title: "Американська класика Dr Pepper та Fanta 🇺🇸", 
        image: "/images/banner_drpepper_fanta_new.jpg", 
        tag: "ЕКСКЛЮЗИВ",
        content: "Справжні Dr Pepper Strawberries & Cream та класична американська Fanta Orange вже на складі Жуйки! Особливі рецептури з насиченим смаком прямо з США. Зберіть свій унікальний набір улюблених американських напоїв.",
        featuredProducts: [49, 47, 30, 12],
        btnText: "Обрати класику"
    },
    { 
        id: 4, 
        title: "Азіатський хрускіт: Lay's та міні-краби 🥢", 
        image: "/images/banner_asian_new.jpg", 
        tag: "ЕКЗОТИКА",
        content: "Справжній гастрономічний вибух прямо з Азії! Спробуйте унікальні смаки китайських чіпсів Lay's Big Wave (Свиняча грудинка, Смажений краб, Свіжий огірок) та екзотичних сушених міні-крабиків Seafood Spicy Baby Crab. Такого ви більше ніде не спробуєте!",
        featuredProducts: [143, 145, 149, 150],
        btnText: "Скуштувати екзотику"
    },
    {
        id: 11,
        title: "Шалені знижки на Monster Energy 🦖",
        image: "/images/banner_monster_new.jpg", 
        tag: "ГАРЯЧЕ",
        content: "Вибухова добірка Monster Energy для справжніх фанатів! Monster Ultra White без цукру, тропічний Mango Loco та лімітований The Doctor - заряджайтеся на максимум. Тільки цього тижня діють спеціальні знижені ціни!",
        featuredProducts: [26, 20, 21, 22],
        btnText: "Всі енергетики"
    },
    {
        id: 5,
        title: "Доставка та оплата",
        image: "https://images.unsplash.com/photo-1586880244406-556ebe35f282?w=800&q=80",
        tag: "ІНФОРМАЦІЯ",
        content: `Шановні клієнти, ми раді вітати Вас у нашому інтернет-магазині Жуйка!

Ми доставляємо товари виключно кур'єрською службою Нова пошта по всій території України.

Вартість доставки замовлення оплачує одержувач згідно з офіційними тарифами перевізника.

Хочемо звернути вашу увагу, що розрахунок вартості доставки залежить від ваги товару, обсягу, пункту призначення, а також від способу оплати, який ви вибрали.

Якщо ви вибрали оплату при отриманні - вам необхідно буде сплатити комісію Нової Пошти за переказ коштів, яка складає 20грн + 2% від вартості замовлення.

Способи оплати:
• Оплата при отриманні (накладений платіж) - оплата у відділенні Нової Пошти.
• На банківську картку - це оплата за реквізитами які ми відправляємо вам у повідомленні, після підтвердження замовлення.
Ваше замовлення ви можете оплатити через мобільний додаток чи у відділенні банку, також ви можете скористатись терміналом самообслуговування.

Ми ретельно пакуємо кожну, навіть найменшу посилку, адже нам важлива якість! Будь ласка, на пошті - обов'язково додатково перевіряйте цілісність і комплектацію вашого замовлення при отриманні товару, це дуже важливо!

Звертаємо вашу увагу, що мінімальне замовлення в нашому магазині становить 350 грн, а усі ваши посилки застраховані на повну суму вашого замовлення, коміссія за страхування складає усього лише 0.5% від вартості замовлення!)

З усіх додаткових питань, пов'язаних з доставкою або оплатою замовлення звертайтесь за контактним телефоном: (098) 735-05-05

Дякуємо, що вибрали наш інтернет-магазин і вдалих вам покупок, вам точно сподобається! :)`,
        featuredProducts: [],
        btnText: ""
    },
    {
        id: 6,
        title: "Питання-відповідь",
        image: "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=800&q=80",
        tag: "ДОПОМОГА",
        content: (
            <div className="space-y-6">
                <div className="bg-white/60 dark:bg-gray-800/60 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2"><span className="text-primary">1.</span> Як зробити замовлення на «Жуйці»?</h3>
                    <div className="space-y-2 text-gray-600 dark:text-gray-400 pl-6 border-l-2 border-gray-200 dark:border-gray-600 ml-2">
                        <p>1) Перейдіть до нашого каталогу товарів та додайте в кошик улюблені імпортні солодощі та снеки.</p>
                        <p>2) Зверніть увагу, що мінімальна сума замовлення на нашому сайті становить 350 грн.</p>
                        <p>3) Після вибору солодощів перейдіть до кошика у верхній частині сайту.</p>
                        <p>4) Перевірте кількість товарів, введіть свої контактні дані (для повторних замовлень вони збережуться та підставляться автоматично) та оберіть відділення пошти.</p>
                        <p>5) Натисніть кнопку «Оформити замовлення». Замовлення миттєво надійде нашому менеджеру і в чат підтримки Telegram!</p>
                    </div>
                </div>

                <div className="bg-white/60 dark:bg-gray-800/60 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2"><span className="text-primary">2.</span> Навіщо потрібна передоплата і як вона працює?</h3>
                    <div className="text-gray-600 dark:text-gray-400 pl-6 border-l-2 border-gray-200 dark:border-gray-600 ml-2">
                        Кожне замовлення з екзотичними солодощами ми пакуємо індивідуально та дбайливо. Часткова передоплата (або повна оплата за реквізитами) потрібна на випадок, якщо у вас зміняться плани або не буде можливості забрати посилку з пошти - тоді нам не доведеться оплачувати доставку в обидва боки.
                    </div>
                </div>

                <div className="bg-white/60 dark:bg-gray-800/60 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2"><span className="text-primary">3.</span> Як швидко доставляється посилка?</h3>
                    <div className="text-gray-600 dark:text-gray-400 pl-6 border-l-2 border-gray-200 dark:border-gray-600 ml-2">
                        Ми відправляємо ваші замовлення щодня. Зазвичай доставка Новою Поштою по Україні займає всього 1-2 робочих дні (у віддалені населені пункти - до 3-4 днів). Ви завжди можете відстежити актуальний статус доставки у своєму особистому кабінеті на нашому сайті.
                    </div>
                </div>

                <div className="bg-white/60 dark:bg-gray-800/60 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2"><span className="text-primary">4.</span> Чи можу я відправити замовлення як подарунок другу?</h3>
                    <div className="space-y-2 text-gray-600 dark:text-gray-400 pl-6 border-l-2 border-gray-200 dark:border-gray-600 ml-2">
                        <p>Так, це чудовий спосіб зробити солодкий сюрприз! Для цього необхідно:</p>
                        <p>1) Заповнити поля отримувача (ім'я, місто та відділення пошти) даними вашого друга, але вказати свій номер телефону для підтвердження замовлення менеджером.</p>
                        <p>2) Вказати реальний телефон друга в коментарі до замовлення, щоб він отримав СМС-повідомлення від Нової Пошти про прибуття посилки.</p>
                    </div>
                </div>

                <div className="bg-white/60 dark:bg-gray-800/60 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2"><span className="text-primary">5.</span> Де можна забрати замовлення самовивозом?</h3>
                    <div className="text-gray-600 dark:text-gray-400 pl-6 border-l-2 border-gray-200 dark:border-gray-600 ml-2">
                        <p>Самовивіз доступний у місті Києві. Детальний час та умови отримання замовлення з вами погодить менеджер під час телефонного дзвінка або через чат підтримки.</p>
                    </div>
                </div>

                <div className="bg-white/60 dark:bg-gray-800/60 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2"><span className="text-primary">6.</span> Чи створюєте ви індивідуальні солодкі Candy-бокси?</h3>
                    <div className="text-gray-600 dark:text-gray-400 pl-6 border-l-2 border-gray-200 dark:border-gray-600 ml-2">
                        <p>Так! Ми можемо зібрати для вас ексклюзивний «Сюрприз-бокс» на будь-яку зручну суму від 500 грн. Ви можете написати свої побажання (наприклад, більше жуйок, без шоколаду чи суперкислі цукерки), а повний вміст боксу залишиться для вас приємним сюрпризом до моменту відкриття коробки!)</p>
                    </div>
                </div>

                <div className="bg-white/60 dark:bg-gray-800/60 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2"><span className="text-primary">7.</span> Чи працюєте ви з гуртом (оптом) або за дропшипінгом?</h3>
                    <div className="text-gray-600 dark:text-gray-400 pl-6 border-l-2 border-gray-200 dark:border-gray-600 ml-2">
                        Наразі ми працюємо як роздрібний інтернет-магазин. Дропшипінгу немає, але для великих замовлень (наприклад, для офісів, вечірок або свят від 40 одиниць одного найменування товару) ми з радістю надамо вам індивідуальну знижку. Пишіть на нашу пошту: <a href="mailto:shop@juyka.com" className="text-primary hover:underline">shop@juyka.com</a>.
                    </div>
                </div>
            </div>
        ),
        featuredProducts: [],
        btnText: ""
    },
    {
        id: 7,
        title: "Договір публічної оферти",
        image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
        tag: "ДОКУМЕНТИ",
        content: (
            <div className="space-y-6">
                <div className="bg-white/60 dark:bg-gray-800/60 p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">1. Загальні положення</h3>
                    <div className="space-y-4 text-gray-600 dark:text-gray-400">
                        <p>1.1. Договір оферти є офіційною пропозицією ТОВАРИСТВО З ОБМЕЖЕНОЮ ВІДПОВІДАЛЬНІСТЮ "СБИТ-ВОСТОК" (код ЄДРПОУ: 41899847) (інтернет-магазин «Жуйка»), далі за текстом - «Продавець», укласти Договір купівлі-продажу товарів дистанційним способом, а саме через Інтернет-магазин, далі по тексту - «Договір», і розміщує Публічну оферту (пропозицію) на офіційному інтернет-сайті Продавця.</p>
                        <p>1.2. Моментом повного і безумовного прийняття Покупцем пропозиції Продавця (акцептом) укласти електронний договір купівлі-продажу товарів, вважається факт оплати Покупцем замовлення на умовах цього Договору, у строки та за цінами, вказаними на Інтернет-сайті Продавця.</p>
                        <p className="font-medium text-gray-900 dark:text-white">Діяльність веде ТОВ "СБИТ-ВОСТОК" (код ЄДРПОУ 41899847)</p>
                    </div>
                </div>

                <div className="bg-white/60 dark:bg-gray-800/60 p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">2. Поняття і визначення</h3>
                    <div className="space-y-2 text-gray-600 dark:text-gray-400">
                        <p>2.1. У цій оферті, якщо контекст не вимагає іншого, наведені нижче терміни мають таке значення:</p>
                        <ul className="list-disc pl-5 space-y-2 mt-2">
                            <li><strong className="text-gray-900 dark:text-white">«Товар»</strong> - солодощі, напої та інші супровідні продукти;</li>
                            <li><strong className="text-gray-900 dark:text-white">«Інтернет-магазин»</strong> - відповідно до Закону України «про електронну комерцію», засіб для подання або реалізації товару, роботи або послуги шляхом здійснення електронної угоди.</li>
                            <li><strong className="text-gray-900 dark:text-white">«Продавець»</strong> - компанія, яка реалізує товари, представлені на Інтернет-сайті.</li>
                            <li><strong className="text-gray-900 dark:text-white">«Покупець»</strong> - фізична особа, що уклала з Продавцем Договір на умовах, викладених нижче.</li>
                            <li><strong className="text-gray-900 dark:text-white">«Замовлення»</strong> - вибір окремих позицій з переліку товарів, зазначених Покупцем при розміщенні замовлення і проведенні оплати.</li>
                        </ul>
                    </div>
                </div>

                <div className="bg-white/60 dark:bg-gray-800/60 p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">3. Предмет договору</h3>
                    <div className="space-y-4 text-gray-600 dark:text-gray-400">
                        <p>3.1. Продавець зобов'язується передати у власність Покупця Товар, а Покупець зобов'язується оплатити і прийняти Товар на умовах даного Договору.</p>
                        <p>Цей Договір регулює купівлю-продаж товарів в Інтернет-магазині, в тому числі:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>добровільний вибір Покупцем товарів в Інтернет-магазині;</li>
                            <li>самостійне оформлення Покупцем замовлення в Інтернет-магазині;</li>
                            <li>оплата Покупцем замовлення, оформленого в Інтернет-магазині;</li>
                            <li>обробка і доставка замовлення Покупцеві у власність на умовах цього Договору.</li>
                        </ul>
                    </div>
                </div>

                <div className="bg-white/60 dark:bg-gray-800/60 p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">4. Порядок оформлення замовлення</h3>
                    <div className="space-y-3 text-gray-600 dark:text-gray-400">
                        <p>4.1. Покупець має право оформити замовлення на будь-який товар, представлений на Сайті Інтернет-магазину і наявний.</p>
                        <p>4.2. Кожна позиція може бути представлена в замовленні в будь-якій кількості.</p>
                        <p>4.3. При відсутності товару на складі, Менеджер компанії зобов'язаний поставити Покупця до відома (по телефону або через електронну пошту).</p>
                        <p>4.4. При відсутності товару Покупець має право замінити його аналогічним товаром, відмовитися від даного товару, анулювати замовлення.</p>
                    </div>
                </div>

                <div className="bg-white/60 dark:bg-gray-800/60 p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">5. Порядок оплати замовлень</h3>
                    <div className="space-y-3 text-gray-600 dark:text-gray-400">
                        <p className="font-bold text-gray-900 dark:text-white">Накладеним платежем</p>
                        <p>5.1. Оплата здійснюється за фактом отримання товару у відділенні транспортних компанії за готівковий розрахунок в гривнях при передоплаті у 100 гривень.</p>
                        <p>5.2. При не надходження коштів Інтернет-магазин залишає за собою право анулювати замовлення.</p>
                    </div>
                </div>

                <div className="bg-white/60 dark:bg-gray-800/60 p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">6. Умови доставки замовлення</h3>
                    <div className="text-gray-600 dark:text-gray-400">
                        <p>6.1. Доставка товарів, придбаних в Інтернет-магазині, здійснюється до складів транспортних компаній, де і здійснюється видача замовлень.</p>
                    </div>
                </div>

                <div className="bg-white/60 dark:bg-gray-800/60 p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">7. Права та обов'язки сторін</h3>
                    <div className="space-y-4 text-gray-600 dark:text-gray-400">
                        <div>
                            <p className="font-bold text-gray-900 dark:text-white">7.1. Продавець має право:</p>
                            <ul className="list-disc pl-5 mt-1">
                                <li>в односторонньому порядку припинити надання послуг за цим договором у разі порушення Покупцем умов цього договору.</li>
                            </ul>
                        </div>
                        <div>
                            <p className="font-bold text-gray-900 dark:text-white">7.2. Покупець зобов'язаний:</p>
                            <ul className="list-disc pl-5 mt-1">
                                <li>своєчасно оплатити та отримати замовлення на умовах цього договору.</li>
                            </ul>
                        </div>
                        <div>
                            <p className="font-bold text-gray-900 dark:text-white">7.3. Покупець має право:</p>
                            <ul className="list-disc pl-5 mt-1">
                                <li>оформити замовлення в Інтернет-магазині;</li>
                                <li>оформити електронний договір;</li>
                                <li>вимагати від Продавця виконання умов цього Договору.</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="bg-white/60 dark:bg-gray-800/60 p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">8. Відповідальність сторін</h3>
                    <div className="space-y-3 text-gray-600 dark:text-gray-400">
                        <p>8.1. Сторони несуть відповідальність за невиконання або неналежне виконання умов цього договору в порядку, передбаченому цим договором та чинним законодавством України.</p>
                        <p>8.2. Продавець не несе відповідальності за:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>змінений виробником зовнішній вигляд Товару;</li>
                            <li>за незначну невідповідність колірної гами товару;</li>
                            <li>за зміст і правдивість інформації, наданої Покупцем при оформленні замовлення;</li>
                            <li>за затримку і перебої в наданні Послуг, які відбуваються з причин, що знаходяться поза сферою його контролю;</li>
                            <li>за протиправні дії, здійснені Покупцем за допомогою даного доступу до мережі Інтернет;</li>
                            <li>за передачу Покупцем своїх мережевих ідентифікаторів третім особам.</li>
                        </ul>
                        <p>8.3. Покупець самостійно несе відповідальність за шкоду, заподіяну його діями особам або їх майну, юридичним особам, державі.</p>
                        <p>8.4. У разі настання обставин непереборної сили, сторони звільняються від виконання умов цього договору.</p>
                        <p>8.5. Сторони прикладають максимум зусиль для вирішення будь-яких розбіжностей виключно шляхом переговорів.</p>
                    </div>
                </div>

                <div className="bg-white/60 dark:bg-gray-800/60 p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">9. Інші умови</h3>
                    <div className="space-y-3 text-gray-600 dark:text-gray-400">
                        <p>9.1. Інтернет-магазин залишає за собою право в односторонньому порядку вносити зміни до цього договору за умови попередньої публікації його на сайті.</p>
                        <p>9.2. Інтернет-магазин створений для організації дистанційного способу продажу товарів через Інтернет.</p>
                        <p>9.3. Покупець несе відповідальність за достовірність інформації, зазначеної при оформленні замовлення. При здійсненні акцепту Покупець надає Продавцю беззастережну згоду на збір, обробку, зберігання, використання своїх персональних даних.</p>
                        <p>9.4. Оплата Покупцем замовлення означає повну згоду Покупця з умовами договору.</p>
                        <p>9.5. Фактичною датою електронної угоди є дата прийняття умов, відповідно до Закону України «Про електронну комерцію».</p>
                        <p>9.6. Використання ресурсу Інтернет-магазину для Покупця є безкоштовним.</p>
                        <p>9.7. Інформація, яку надає Покупець, є конфіденційною. Інтернет-магазин використовує її виключно в цілях обробки замовлення та доставки.</p>
                    </div>
                </div>

                <div className="bg-white/60 dark:bg-gray-800/60 p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">10. Термін дії договору</h3>
                    <div className="space-y-3 text-gray-600 dark:text-gray-400">
                        <p>10.1. Електронний договір вважається укладеним з моменту одержання особою яка направила пропозицію укласти такий договір, відповіді про прийняття цієї пропозиції.</p>
                        <p>10.2. До закінчення терміну дії цей Договір може бути розірваний за взаємною згодою сторін до моменту фактичної доставки товару, шляхом повернення грошових коштів.</p>
                        <p>10.3. Сторони мають право розірвати цей договір в односторонньому порядку, в разі невиконання однією із сторін умов цього Договору.</p>
                    </div>
                </div>
            </div>
        ),
        featuredProducts: [],
        btnText: ""
    },
    {
        id: 8,
        title: "Політика конфіденційності",
        image: "https://images.unsplash.com/photo-1508873535684-277a3cbcc4e8?w=800&q=80",
        tag: "ДОКУМЕНТИ",
        content: (
            <div className="space-y-6">
                <div className="bg-white/60 dark:bg-gray-800/60 p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">1. Збір інформації</h3>
                    <div className="space-y-3 text-gray-600 dark:text-gray-400">
                        <p>Ми збираємо інформацію, коли ви оформлюєте замовлення на нашому сайті, реєструєтесь або заповнюєте форми зворотного зв'язку.</p>
                        <p>До персональних даних, які можуть збиратися, відносяться: Ваше ім'я, номер телефону, адреса електронної пошти та адреса для доставки (відділення Нової Пошти).</p>
                    </div>
                </div>

                <div className="bg-white/60 dark:bg-gray-800/60 p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">2. Використання інформації</h3>
                    <div className="space-y-3 text-gray-600 dark:text-gray-400">
                        <p>Будь-яка зібрана нами інформація може використовуватися для:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Швидкої та якісної обробки і доставки Ваших замовлень;</li>
                            <li>Зв'язку з Вами для підтвердження деталей замовлення;</li>
                            <li>Покращення роботи нашого сайту та підвищення рівня обслуговування клієнтів.</li>
                        </ul>
                    </div>
                </div>

                <div className="bg-white/60 dark:bg-gray-800/60 p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">3. Захист даних</h3>
                    <div className="space-y-3 text-gray-600 dark:text-gray-400">
                        <p>Ми впроваджуємо різноманітні засоби безпеки для забезпечення збереження Ваших персональних даних. Доступ до конфіденційних даних мають лише ті співробітники, які безпосередньо займаються складанням та відправкою замовлень.</p>
                    </div>
                </div>

                <div className="bg-white/60 dark:bg-gray-800/60 p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">4. Згода з умовами</h3>
                    <div className="space-y-3 text-gray-600 dark:text-gray-400">
                        <p>Користуючись послугами нашого інтернет-магазину та вказуючи свої дані при оформленні замовлення, Ви автоматично погоджуєтесь з даною Політикою конфіденційності.</p>
                    </div>
                </div>
            </div>
        ),
        featuredProducts: [],
        btnText: ""
    },
    {
        id: 9,
        title: "Умови повернення та обміну",
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
        tag: "ПОВЕРНЕННЯ",
        content: (
            <div className="space-y-6">
                <div className="bg-white/60 dark:bg-gray-800/60 p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Повернення та обмін продуктів харчування</h3>
                    <div className="space-y-4 text-gray-600 dark:text-gray-400">
                        <p>Відповідно до Закону України «Про захист прав споживачів», продовольчі товари (продукти харчування, солодощі, напої) належної якості <strong className="text-gray-900 dark:text-white">не підлягають поверненню або обміну</strong>.</p>
                        <p>Ми просимо Вас обов'язково перевіряти цілісність, терміни придатності та комплектацію Вашого замовлення безпосередньо у відділенні «Нова Пошта» при отриманні посилки.</p>
                    </div>
                </div>

                <div className="bg-white/60 dark:bg-gray-800/60 p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Що робити у разі виявлення пошкоджень чи невідповідності?</h3>
                    <div className="space-y-3 text-gray-600 dark:text-gray-400">
                        <p>Якщо під час перевірки посилки у відділенні перевізника Ви виявили пошкодження товару, нестачу або невідповідність замовленому:</p>
                        <ul className="list-decimal pl-5 space-y-2">
                            <li>Складіть Акт прийому-передачі спільно зі співробітником «Нова Пошта»;</li>
                            <li>Зробіть фото пошкоджень або невідповідного товару;</li>
                            <li>Зв'яжіться з нами за телефоном: <a href="tel:+380779152365" className="font-bold hover:underline text-primary">(077) 915-23-65</a>;</li>
                            <li>Ми оперативно вирішимо проблему: надішлемо заміну або повернемо кошти.</li>
                        </ul>
                    </div>
                </div>

                <div className="bg-primary/10 border border-primary/20 p-6 rounded-2xl text-gray-800 dark:text-gray-200">
                    <p className="font-medium text-primary">Важливо!</p>
                    <p className="mt-1">Претензії щодо цілісності або комплектації замовлення, виявлені поза межами відділення Нової Пошти (вдома), на жаль, розгляду не підлягають, оскільки ми не можемо контролювати умови транспортування після отримання.</p>
                </div>
            </div>
        ),
        featuredProducts: [],
        btnText: ""
    },
    {
        id: 10,
        title: "Про нас",
        image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80",
        tag: "ПРО НАС",
        content: (
            <div className="space-y-6">
                <div className="bg-white/60 dark:bg-gray-800/60 p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">Вітаємо у світі Жуйки! 🍬</h3>
                    <div className="space-y-4 text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                        <p><strong>Жуйка</strong> - це не просто черговий інтернет-магазин солодощів. Це ваш персональний телепорт у найсолодші та найекзотичніші куточки планети! Ми знаходимо, привозимо та доставляємо те, чого ви ніколи не знайдете на полицях звичайних супермаркетів.</p>
                        <p>Наш шлях почався з простої ідеї: перетворити звичайне споживання їжі на захоплюючу пригоду. Ми закохані в незвичайні смаки, лімітовані колекції та яскраві емоції, якими хочемо ділитися з кожним із вас.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white/60 dark:bg-gray-800/60 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                        <span className="text-3xl mb-3 block">🌍</span>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-2">Ексклюзивний імпорт</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Прямі поставки унікальних солодощів та напоїв із США, Японії, Великобританії та країн Європи.</p>
                    </div>
                    <div className="bg-white/60 dark:bg-gray-800/60 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                        <span className="text-3xl mb-3 block">⚡</span>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-2">Швидкість та якість</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Надсилаємо замовлення день у день, надійно та дбайливо пакуючи кожну баночку та цукерку.</p>
                    </div>
                    <div className="bg-white/60 dark:bg-gray-800/60 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                        <span className="text-3xl mb-3 block">🎁</span>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-2">Бокси-сюрпризи</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Створюємо емоційні Mystery Boxes, наповнені несподіваними смаками та солодощами спеціально для вас.</p>
                    </div>
                </div>

                <div className="bg-primary/10 border border-primary/20 p-6 rounded-2xl text-gray-800 dark:text-gray-200">
                    <h4 className="font-bold mb-2">Дякуємо, що обираєте нас!</h4>
                    <p className="text-sm">Жуйка - це про радість, про нові відкриття та про любов до солодкого життя. Замовляйте, куштуйте та діліться своїми враженнями з нами у соціальних мережах!</p>
                </div>
            </div>
        ),
        featuredProducts: [],
        btnText: ""
    }
];

const dummyUser = {
    name: "Олександр Петренко",
    phone: "+38 (099) 123-45-67",
    email: "oleksandr.p@example.com",
    address: "м. Київ",
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

const parseHash = () => {
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

const App = () => {
    // State
    const [cookieAccepted, setCookieAccepted] = useState(() => {
        return localStorage.getItem('cookieAccepted') === 'true';
    });
    const [activeView, setActiveView] = useState(() => {
        const route = parseHash();
        return route.view;
    }); // 'shop', 'product', 'checkout', 'success', 'profile', 'article'
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
    const [cart, setCart] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(() => {
        const route = parseHash();
        return route.nav;
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [brokenImages, setBrokenImages] = useState(new Set());
    const [viewMode, setViewMode] = useState('medium'); // 'large', 'medium', 'small'
    const [stockFilter, setStockFilter] = useState('all'); // 'all', 'inStock', 'outOfStock'
    const [promoFilter, setPromoFilter] = useState(false);
    
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
    const [authForm, setAuthForm] = useState({ name: '', email: '', phone: '', countryCode: '+380', address: '', password: '' });
    const [authError, setAuthError] = useState('');
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    const [editProfileForm, setEditProfileForm] = useState({});
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const [repeatedOrderDetails, setRepeatedOrderDetails] = useState(null);


    // Support Chat State
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatInput, setChatInput] = useState('');
    const [chatMessages, setChatMessages] = useState(() => {
        const saved = localStorage.getItem('supportChatMessages');
        return saved ? JSON.parse(saved) : [];
    });
    const [clientId] = useState(() => {
        let id = localStorage.getItem('supportClientId');
        if (!id) {
            id = `client-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            localStorage.setItem('supportClientId', id);
        }
        return id;
    });
    const [unreadChatCount, setUnreadChatCount] = useState(0);

    // Scroll chat to bottom helper
    const chatEndRef = useRef(null);
    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chatMessages, isChatOpen]);

    // Save messages to localStorage and track unread count when window is closed
    useEffect(() => {
        localStorage.setItem('supportChatMessages', JSON.stringify(chatMessages));
    }, [chatMessages]);

    // Track unread messages when chat is closed
    useEffect(() => {
        if (isChatOpen) {
            setUnreadChatCount(0);
        }
    }, [isChatOpen]);

    // Polling updates from Telegram bot (via Express server)
    useEffect(() => {
        const fetchUpdates = async () => {
            if (!clientId) return;
            try {
                const res = await fetch(`/api/chat-updates?clientId=${clientId}`);
                const data = await res.json();
                if (data.updates && data.updates.length > 0) {
                    setChatMessages(prev => {
                        const newMsgs = [...prev, ...data.updates];
                        if (!isChatOpen) {
                            setUnreadChatCount(c => c + data.updates.length);
                        }
                        return newMsgs;
                    });
                }
                if (data.orderUpdates && data.orderUpdates.length > 0) {
                    setCurrentUser(prevUser => {
                        if (!prevUser || !prevUser.orders) return prevUser;
                        
                        let updated = false;
                        const newOrders = prevUser.orders.map(order => {
                            const updateObj = data.orderUpdates.find(u => u.orderId === order.id);
                            if (updateObj) {
                                updated = true;
                                return {
                                    ...order,
                                    status: updateObj.status || order.status,
                                    customerName: updateObj.customerName || order.customerName,
                                    customerPhone: updateObj.customerPhone || order.customerPhone,
                                    city: updateObj.city || order.city,
                                    postOffice: updateObj.postOffice || order.postOffice
                                };
                            }
                            return order;
                        });
                        
                        if (updated) {
                            const updatedUser = { ...prevUser, orders: newOrders };
                            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
                            
                            // Also update this user in the 'users' list in localStorage
                            let users = JSON.parse(localStorage.getItem('users') || '[]');
                            const idx = users.findIndex(u => u.email === prevUser.email);
                            if (idx !== -1) {
                                users[idx] = updatedUser;
                                localStorage.setItem('users', JSON.stringify(users));
                            }
                            return updatedUser;
                        }
                        return prevUser;
                    });
                }
            } catch (err) {
                console.error('Error polling chat updates:', err);
            }
        };

        const interval = setInterval(fetchUpdates, 3500);
        return () => clearInterval(interval);
    }, [clientId, isChatOpen]);

    // Checkout Logic
    const handleCheckoutSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const firstName = (formData.get('firstName') || '').trim();
        const middleName = (formData.get('middleName') || '').trim();
        const lastName = (formData.get('lastName') || '').trim();
        const name = [firstName, middleName, lastName].filter(Boolean).join(' ');
        const phone = formData.get('phone').trim();
        const city = formData.get('city').trim();
        const postOffice = formData.get('postOffice').trim();

        // Validation
        if (firstName.length < 2) {
            alert('Будь ласка, введіть ваше імʼя (мінімум 2 символи).');
            return;
        }
        if (lastName.length < 2) {
            alert('Будь ласка, введіть ваше прізвище (мінімум 2 символи).');
            return;
        }
        if (!/^[0-9]{9,10}$/.test(phone.replace(/[\s\-()]/g, ''))) {
            alert('Будь ласка, введіть коректний номер телефону (9-10 цифр після коду країни).');
            return;
        }
        if (city.length < 2) {
            alert('Будь ласка, введіть назву міста.');
            return;
        }
        if (postOffice.length < 3) {
            alert('Будь ласка, введіть номер або адресу відділення Нової Пошти.');
            return;
        }

        const countryCode = formData.get('countryCode') || '+380';
        const fullPhone = countryCode + ' ' + phone;

        const newOrderId = Math.floor(100000 + Math.random() * 900000);
        const orderTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        if (orderTotal < 350) {
            alert('Мінімальна сума замовлення становить 350 грн.');
            return;
        }

        const newOrder = {
            id: `#${newOrderId}`,
            date: new Date().toLocaleDateString('uk-UA'),
            items: cart.map(item => ({ name: item.name, quantity: item.quantity })),
            total: orderTotal,
            status: 'processing',
            customerName: name,
            customerPhone: fullPhone,
            city: city,
            postOffice: postOffice
        };

        let users = JSON.parse(localStorage.getItem('users') || '[]');

        if (currentUser) {
            const updatedUser = {
                ...currentUser,
                phone: fullPhone,
                city: city,
                address: postOffice,
                orders: [newOrder, ...(currentUser.orders || [])]
            };
            setCurrentUser(updatedUser);
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
            const userIndex = users.findIndex(u => u.email === currentUser.email);
            if (userIndex !== -1) {
                users[userIndex] = updatedUser;
                localStorage.setItem('users', JSON.stringify(users));
            }
        } else {
            // Auto-create account for guest
            const guestEmail = `guest_${newOrderId}@zhujka.local`;
            const autoPassword = Math.random().toString(36).slice(-8);
            const newUser = {
                id: Date.now(),
                name: name,
                email: guestEmail,
                phone: fullPhone,
                city: city,
                address: postOffice,
                password: autoPassword,
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
                orders: [newOrder]
            };
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(newUser));
            setCurrentUser(newUser);
        }

        setLastOrderDetails({
            id: newOrderId,
            date: new Date().toLocaleString('uk-UA'),
            items: [...cart],
            total: orderTotal,
            customer: name,
            phone: fullPhone,
            city: city,
            postOffice: postOffice,
            paymentMethod: "Накладений платіж",
            doNotCall: formData.get('doNotCall') === 'on'
        });

        // Format order details for local support chat message
        const orderItemsText = cart.map(item => `• ${item.name} x${item.quantity} (${item.price} грн)`).join('\n');
        const doNotCallText = formData.get('doNotCall') === 'on' ? '❌ Не телефонувати' : '📞 Зателефонувати для підтвердження';
        const orderMessageText = `📦 Нове замовлення #${newOrderId} успішно оформлено!\n\n` +
            `👤 Одержувач: ${name}\n` +
            `📞 Телефон: ${fullPhone}\n` +
            `📍 Доставка: м. ${city}, ${postOffice}\n` +
            `💬 Підтвердження: ${doNotCallText}\n\n` +
            `🛍️ Товари:\n${orderItemsText}\n\n` +
            `💰 Всього до сплати: ${orderTotal} грн`;

        const botOrderMsg = {
            sender: 'support',
            senderName: 'Жуйка Бот 🤖',
            senderAvatar: 'https://images.unsplash.com/photo-1546776310-eef45dd6d63c?w=150&h=150&fit=crop',
            text: orderMessageText,
            timestamp: new Date().toISOString()
        };

        setChatMessages(prev => [...prev, botOrderMsg]);

        // Send order to Telegram support chat via backend
        const orderData = {
            id: `#${newOrderId}`,
            customerName: name,
            customerPhone: fullPhone,
            city: city,
            postOffice: postOffice,
            doNotCall: formData.get('doNotCall') === 'on',
            items: cart.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price
            })),
            total: orderTotal
        };

        fetch('/api/send-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                clientId,
                order: orderData,
                clientName: name
            })
        }).catch(err => {
            console.log('Error sending order to TG support:', err);
        });

        clearCart();
        navigateTo('success');
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!chatInput.trim()) return;

        const isFirstMessage = chatMessages.filter(m => m.sender === 'client').length === 0;

        const clientMsg = {
            sender: 'client',
            text: chatInput,
            timestamp: new Date().toISOString()
        };

        setChatMessages(prev => [...prev, clientMsg]);
        const textToSend = chatInput;
        setChatInput('');

        if (isFirstMessage) {
            setTimeout(() => {
                setChatMessages(prev => [...prev, {
                    sender: 'support',
                    senderName: 'Жуйка Бот 🤖',
                    senderAvatar: 'https://images.unsplash.com/photo-1546776310-eef45dd6d63c?w=150&h=150&fit=crop',
                    text: 'Менеджер підключається... Зачекайте, будь ласка 💛',
                    timestamp: new Date().toISOString()
                }]);
            }, 1000);
        }

        try {
            await fetch('/api/send-message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    clientId,
                    message: textToSend,
                    clientName: currentUser ? currentUser.name : 'Гість'
                })
            });
        } catch (err) {
            console.error('Error sending message to support:', err);
            setChatMessages(prev => [
                ...prev,
                {
                    sender: 'support',
                    text: '⚠️ Помилка з\'єднання. Спробуйте надіслати повідомлення пізніше.',
                    timestamp: new Date().toISOString()
                }
            ]);
        }
    };

    const handleAcceptCookie = () => {
        localStorage.setItem('cookieAccepted', 'true');
        setCookieAccepted(true);
    };
    
    const handleAuthSubmit = (e) => {
        e.preventDefault();
        setAuthError('');

        let users = JSON.parse(localStorage.getItem('users') || '[]');

        if (authMode === 'register') {
            // Validate name: at least 2 characters
            if (!authForm.name || authForm.name.trim().length < 2) {
                setAuthError('Введіть ваше імʼя (мінімум 2 символи).');
                return;
            }
            // Validate email
            if (!authForm.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(authForm.email)) {
                setAuthError('Введіть коректну email-адресу.');
                return;
            }
            // Validate password
            if (!authForm.password || authForm.password.length < 6) {
                setAuthError('Пароль повинен містити мінімум 6 символів.');
                return;
            }
            // Validate phone if provided
            if (authForm.phone) {
                const rawPhone = authForm.phone.replace(/[\s\-()]/g, '');
                if (!/^[0-9]{9,10}$/.test(rawPhone)) {
                    setAuthError('Введіть коректний номер телефону (9-10 цифр без коду країни).');
                    return;
                }
            }
            if (users.find(u => u.email === authForm.email)) {
                setAuthError('Користувач з таким email вже існує.');
                return;
            }

            const fullPhone = authForm.countryCode && authForm.phone
                ? authForm.countryCode + ' ' + authForm.phone
                : authForm.phone || '';

            const newUser = {
                id: Date.now(),
                name: authForm.name.trim(),
                email: authForm.email.trim(),
                phone: fullPhone,
                address: authForm.address || '',
                password: authForm.password,
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(authForm.name.trim())}&background=random`,
                orders: []
            };

            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(newUser));
            setCurrentUser(newUser);
            setIsAuthModalOpen(false);
            setAuthForm({ name: '', email: '', phone: '', countryCode: '+380', address: '', password: '' });

        } else {
            if (!authForm.email || !authForm.password) {
                setAuthError('Введіть email та пароль.');
                return;
            }
            const user = users.find(u => u.email === authForm.email && u.password === authForm.password);
            if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                setCurrentUser(user);
                setIsAuthModalOpen(false);
                setAuthForm({ name: '', email: '', phone: '', countryCode: '+380', address: '', password: '' });
            } else {
                setAuthError('Невірний email або пароль. Спробуйте ще раз.');
            }
        }
    };

    const handleEditProfileSave = () => {
        const updatedUser = {
            ...currentUser,
            name: editProfileForm.name || currentUser.name,
            phone: editProfileForm.phone || currentUser.phone,
            address: editProfileForm.address || currentUser.address,
            city: editProfileForm.city || currentUser.city,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(editProfileForm.name || currentUser.name)}&background=random`
        };
        setCurrentUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const idx = users.findIndex(u => u.email === currentUser.email);
        if (idx !== -1) { users[idx] = updatedUser; localStorage.setItem('users', JSON.stringify(users)); }
        setIsEditProfileOpen(false);
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
    const [selectedProduct, setSelectedProduct] = useState(() => {
        const route = parseHash();
        if (route.productId) {
            return allProducts.find(p => p.id === route.productId) || null;
        }
        const savedId = localStorage.getItem('selectedProductId');
        return savedId ? allProducts.find(p => p.id === parseInt(savedId)) || null : null;
    });
    const carouselRef = useRef(null);

    const scrollCarousel = (direction) => {
        if (carouselRef.current) {
            const scrollAmount = direction === 'left' ? -300 : 300;
            carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
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
        localStorage.setItem('selectedCategory', selectedCategory);
        if (selectedProduct) localStorage.setItem('selectedProductId', selectedProduct.id);
        else localStorage.removeItem('selectedProductId');
        if (activeArticle) localStorage.setItem('activeArticleId', activeArticle.id);
        else localStorage.removeItem('activeArticleId');
    }, [activeView, activeNav, selectedCategory, selectedProduct, activeArticle]);

    const navigateTo = (view, nav = activeNav, product = selectedProduct, article = activeArticle) => {
        setActiveView(view);
        if (nav !== activeNav) {
            setSelectedCategory(nav);
        }
        setActiveNav(nav);
        setSelectedProduct(product);
        setActiveArticle(article);
        window.scrollTo(0, 0);
    };

    const itemsPerPage = 20;

    // Theme logic - Enforce light theme
    useEffect(() => {
        document.documentElement.classList.remove('dark');
    }, []);

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
        setStockFilter('all');
        setPromoFilter(false);
    };

    // Filter logic
    const filteredProducts = useMemo(() => {
        return allProducts.filter(p => {
            // Deep search
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
            // Out of stock goes to the end
            if (a.outOfStock && !b.outOfStock) return 1;
            if (!a.outOfStock && b.outOfStock) return -1;
            
            // Broken images go to the absolute end
            const aBroken = brokenImages.has(a.id);
            const bBroken = brokenImages.has(b.id);
            if (aBroken && !bBroken) return 1;
            if (!aBroken && bBroken) return -1;

            // Local images go first because they load instantly
            if (a.localImage && !b.localImage) return -1;
            if (!a.localImage && b.localImage) return 1;

            if (selectedCategory === 'Всі') return a._rand - b._rand;
            return 0;
        });
    }, [searchQuery, selectedCategory, priceRange, calRange, brokenImages, stockFilter, promoFilter]);

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    useEffect(() => { setCurrentPage(1); }, [searchQuery, selectedCategory, priceRange, calRange, stockFilter]);



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
                setRepeatedOrderDetails={setRepeatedOrderDetails}
            />
            
            {/* Running text marquee banner (бегущая строка) */}
            <div 
                onClick={() => navigateTo('shop', 'Акції')} 
                className="w-full bg-[#FFE600] text-black overflow-hidden py-2 font-black text-xs uppercase tracking-widest border-b border-black select-none z-20 relative cursor-pointer hover:bg-[#FFF000] transition-colors"
                title="Перейти до акційних товарів"
            >
                <div className="flex whitespace-nowrap animate-marquee">
                    <span className="mx-8 flex items-center gap-2">🔥 СУПЕР АКЦІЯ! ЗНИЖКИ ДО -35% НА 15% ТОВАРІВ!</span>
                    <span className="mx-8 flex items-center gap-2">🍬 ЧУПА ЧУПС ТА ШОКОЛАД ЗА СУПЕРЦІНОЮ!</span>
                    <span className="mx-8 flex items-center gap-2">⚡ ШВИДКА ДОСТАВКА ПО УКРАЇНІ!</span>
                    <span className="mx-8 flex items-center gap-2">🎁 КУПУЙ ВИГІДНО НА JUYKA.COM!</span>
                    
                    <span className="mx-8 flex items-center gap-2">🔥 СУПЕР АКЦІЯ! ЗНИЖКИ ДО -35% НА 15% ТОВАРІВ!</span>
                    <span className="mx-8 flex items-center gap-2">🍬 ЧУПА ЧУПС ТА ШОКОЛАД ЗА СУПЕРЦІНОЮ!</span>
                    <span className="mx-8 flex items-center gap-2">⚡ ШВИДКА ДОСТАВКА ПО УКРАЇНІ!</span>
                    <span className="mx-8 flex items-center gap-2">🎁 КУПУЙ ВИГІДНО НА JUYKA.COM!</span>
                </div>
            </div>
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
                                        {/* Full name */}
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Імʼя <span className="text-red-500">*</span></label>
                                            <input
                                                type="text"
                                                placeholder="Іван"
                                                value={authForm.name}
                                                onChange={(e) => setAuthForm({...authForm, name: e.target.value})}
                                                minLength={2}
                                                title="Введіть ваше імʼя"
                                                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                                            />
                                        </div>

                                        {/* Phone with country selector */}
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Телефон</label>
                                            <div className="flex gap-2">
                                                <select
                                                    value={authForm.countryCode || '+380'}
                                                    onChange={(e) => setAuthForm({...authForm, countryCode: e.target.value})}
                                                    className="flex-shrink-0 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-3 text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-bold cursor-pointer"
                                                >
                                                    <option value="+380">🇺🇦 +380</option>
                                                    <option value="+48">🇵🇱 +48</option>
                                                    <option value="+373">🇲🇩 +373</option>
                                                </select>
                                                <input
                                                    type="tel"
                                                    placeholder="0XXXXXXXXX"
                                                    value={authForm.phone}
                                                    onChange={(e) => setAuthForm({...authForm, phone: e.target.value})}
                                                    maxLength={13}
                                                    pattern="[0-9\s\-]{9,13}"
                                                    title="Введіть номер без коду країни (9-10 цифр)"
                                                    className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                                                />
                                            </div>
                                            <p className="text-xs text-gray-400 mt-1">Наприклад: 0671234567</p>
                                        </div>

                                        {/* Delivery address */}
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Адреса або відділення</label>
                                            <input
                                                type="text"
                                                placeholder="Місто, відділення Нової Пошти №1"
                                                value={authForm.address}
                                                onChange={(e) => setAuthForm({...authForm, address: e.target.value})}
                                                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                                            />
                                        </div>
                                    </>
                                )}

                                {/* Email */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Email <span className="text-red-500">*</span></label>
                                    <input
                                        type="email"
                                        placeholder="example@email.com"
                                        value={authForm.email}
                                        onChange={(e) => setAuthForm({...authForm, email: e.target.value})}
                                        required
                                        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                                    />
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Пароль <span className="text-red-500">*</span></label>
                                    <input
                                        type="password"
                                        placeholder={authMode === 'register' ? 'Мінімум 6 символів' : 'Ваш пароль'}
                                        value={authForm.password}
                                        onChange={(e) => setAuthForm({...authForm, password: e.target.value})}
                                        required
                                        minLength={authMode === 'register' ? 6 : 1}
                                        title={authMode === 'register' ? 'Пароль повинен містити мінімум 6 символів' : ''}
                                        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                                    />
                                    {authMode === 'register' && <p className="text-xs text-gray-400 mt-1">Мінімум 6 символів</p>}
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
                                                            {isPromo && <span>🏷️</span>}
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

                                {/* Advanced Filters */}
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
                                {/* Banners Section */}
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
                                        <ProductCard key={product.id} product={product} viewMode={viewMode} addToCart={addToCart} onSelect={handleSelectProduct} onImageError={() => setBrokenImages(prev => new Set(prev).add(product.id))} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeView === 'product' && selectedProduct && (
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
                                
                                <form key={repeatedOrderDetails ? 'repeated' : 'default'} onSubmit={handleCheckoutSubmit} className="space-y-5">
                                    {/* Name: 3 separate fields */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                                            Імʼя <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            required
                                            name="firstName"
                                            type="text"
                                            defaultValue={repeatedOrderDetails ? (repeatedOrderDetails.customerName || '').split(' ')[0] || '' : currentUser ? (currentUser.name || '').split(' ')[0] || '' : ''}
                                            placeholder="Іван"
                                            minLength={2}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-darkBg border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                                            По батькові
                                        </label>
                                        <input
                                            name="middleName"
                                            type="text"
                                            defaultValue={repeatedOrderDetails ? (repeatedOrderDetails.customerName || '').split(' ')[1] || '' : currentUser ? (currentUser.name || '').split(' ')[1] || '' : ''}
                                            placeholder="Іванович"
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-darkBg border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                                            Прізвище <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            required
                                            name="lastName"
                                            type="text"
                                            defaultValue={repeatedOrderDetails ? (repeatedOrderDetails.customerName || '').split(' ')[2] || '' : currentUser ? (currentUser.name || '').split(' ')[2] || '' : ''}
                                            placeholder="Іваненко"
                                            minLength={2}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-darkBg border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                        />
                                    </div>

                                    {/* Phone with country code */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                                            Телефон <span className="text-red-500">*</span>
                                        </label>
                                        <div className="flex gap-2">
                                            <select
                                                name="countryCode"
                                                defaultValue={repeatedOrderDetails ? (repeatedOrderDetails.customerPhone || '').split(' ')[0] || '+380' : currentUser ? (currentUser.phone || '').split(' ')[0] || '+380' : '+380'}
                                                className="flex-shrink-0 px-3 py-3 rounded-xl bg-gray-50 dark:bg-darkBg border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm font-bold cursor-pointer"
                                            >
                                                <option value="+380">🇺🇦 +380</option>
                                                <option value="+48">🇵🇱 +48</option>
                                                <option value="+373">🇲🇩 +373</option>
                                            </select>
                                            <input
                                                required
                                                name="phone"
                                                type="tel"
                                                defaultValue={repeatedOrderDetails ? (repeatedOrderDetails.customerPhone || '').replace(/^\+\d+\s*/, '') : currentUser ? (currentUser.phone || '').replace(/^\+\d+\s*/, '') : ''}
                                                placeholder="0XXXXXXXXX"
                                                pattern="[0-9\s\-]{9,13}"
                                                title="Введіть номер телефону (починаючи з 0 або без коду країни)"
                                                maxLength={13}
                                                className="flex-1 px-4 py-3 rounded-xl bg-gray-50 dark:bg-darkBg border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">Наприклад: 0XXXXXXXXX (для України)</p>
                                    </div>

                                    {/* City - plain input */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                                            Місто <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            required
                                            name="city"
                                            type="text"
                                            defaultValue={repeatedOrderDetails ? repeatedOrderDetails.city || '' : currentUser ? (currentUser.city || '') : ''}
                                            placeholder="Наприклад: Київ"
                                            minLength={2}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-darkBg border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                        />
                                    </div>

                                    {/* Post office - plain input */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                                            Відділення Нової Пошти <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            required
                                            name="postOffice"
                                            type="text"
                                            defaultValue={repeatedOrderDetails ? repeatedOrderDetails.postOffice || '' : currentUser ? (currentUser.address || '') : ''}
                                            placeholder="Наприклад: Відділення №1"
                                            minLength={3}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-darkBg border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                        />
                                    </div>

                                    {/* Payment */}
                                    <div className="pt-1">
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Оплата</label>
                                        <label className="flex items-center gap-3 p-4 border border-primary bg-primary/5 rounded-xl cursor-not-allowed opacity-90">
                                            <input type="radio" name="payment" checked readOnly className="w-5 h-5 text-primary accent-primary" />
                                            <div>
                                                <div className="font-bold text-dark dark:text-white">Накладений платіж</div>
                                                <div className="text-xs text-gray-500">Оплата при отриманні на пошті</div>
                                            </div>
                                        </label>
                                    </div>

                                    {/* Don't call */}
                                    <div>
                                        <label className="flex items-center gap-3 cursor-pointer p-4 bg-gray-50 dark:bg-darkBg border border-gray-200 dark:border-gray-700 rounded-xl hover:border-primary transition-colors">
                                            <input type="checkbox" name="doNotCall" defaultChecked={repeatedOrderDetails ? repeatedOrderDetails.doNotCall : false} className="w-5 h-5 text-primary rounded focus:ring-primary accent-primary cursor-pointer" />
                                            <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Не телефонувати для підтвердження замовлення</span>
                                        </label>
                                    </div>

                                    {!currentUser && (
                                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-sm text-blue-700 dark:text-blue-300">
                                            💡 Після оформлення замовлення для вас автоматично буде створено особистий кабінет, де можна відстежувати статус замовлень.
                                        </div>
                                    )}

                                    <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                                        {cartTotal < 350 && cart.length > 0 && (
                                            <div className="mb-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-sm font-bold p-4 rounded-xl text-center">
                                                ⚠️ Мінімальна сума замовлення - 350 грн.
                                            </div>
                                        )}
                                        <button type="submit" disabled={cart.length === 0 || cartTotal < 350} className={`w-full font-bold py-4 rounded-xl shadow-lg transition-all ${cart.length === 0 || cartTotal < 350 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'gradient-bg text-white hover:-translate-y-1'}`}>
                                            Оформити замовлення
                                        </button>
                                        <button type="button" onClick={() => navigateTo('shop', 'Всі')} className="w-full mt-3 font-bold py-4 rounded-xl text-gray-500 hover:text-dark dark:hover:text-white transition-colors">
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
                                        <button
                                            onClick={() => { setEditProfileForm({ name: currentUser.name, phone: currentUser.phone || '', city: currentUser.city || '', address: currentUser.address || '' }); setIsEditProfileOpen(true); }}
                                            className="flex-1 py-2.5 bg-gray-100 dark:bg-gray-800 text-dark dark:text-white font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            Редагувати
                                        </button>
                                        <button onClick={handleLogout} className="py-2.5 px-4 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-bold rounded-xl hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors" title="Вийти з акаунту">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                        </button>
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
                                                    <button
                                                        onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                                                        className="flex-1 py-2 bg-gray-100 dark:bg-gray-800 text-dark dark:text-white font-bold rounded-xl text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                                    >
                                                        {expandedOrderId === order.id ? 'Згорнути ▲' : 'Деталі ▼'}
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            order.items.forEach(item => {
                                                                const product = allProducts.find(p => p.name === item.name);
                                                                if (product) addToCart(product);
                                                            });
                                                            setRepeatedOrderDetails({
                                                                customerName: order.customerName,
                                                                customerPhone: order.customerPhone,
                                                                city: order.city,
                                                                postOffice: order.postOffice,
                                                                doNotCall: order.doNotCall
                                                            });
                                                            navigateTo('checkout');
                                                        }}
                                                        className="flex-1 py-2 bg-primary/10 text-primary font-bold rounded-xl text-sm hover:bg-primary hover:text-white transition-colors"
                                                    >
                                                        Повторити
                                                    </button>
                                                </div>

                                                {expandedOrderId === order.id && (
                                                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 space-y-3 animate-in slide-in-from-top-2 duration-200">
                                                        {/* Customer info */}
                                                        {(order.customerName || order.customerPhone || order.id) && (
                                                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 space-y-2">
                                                                <h5 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Покупець</h5>
                                                                {order.id && <div className="text-sm font-semibold text-primary">🔢 Замовлення {order.id}</div>}
                                                                {order.customerName && <div className="text-sm font-semibold text-dark dark:text-white">👤 {order.customerName}</div>}
                                                                {order.customerPhone && <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">📞 {order.customerPhone}</div>}
                                                            </div>
                                                        )}
                                                        {/* Delivery address */}
                                                        {(order.city || order.postOffice) && (
                                                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 space-y-1">
                                                                <h5 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Адреса доставки</h5>
                                                                {order.city && <div className="text-sm font-semibold text-dark dark:text-white">📍 {order.city}</div>}
                                                                {order.postOffice && <div className="text-sm text-gray-600 dark:text-gray-400">📦 {order.postOffice}</div>}
                                                            </div>
                                                        )}
                                                        {/* Items */}
                                                        <div>
                                                            <h5 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Склад замовлення</h5>
                                                            {order.items.map((item, idx) => (
                                                                <div key={idx} className="flex justify-between items-center text-sm bg-gray-50 dark:bg-gray-800/50 rounded-xl px-4 py-2 mb-1">
                                                                    <span className="text-gray-700 dark:text-gray-300 font-medium">{item.name}</span>
                                                                    <span className="text-primary font-bold">x{item.quantity}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-800">
                                                            <span className="text-sm font-bold text-gray-500">Сума:</span>
                                                            <span className="text-lg font-extrabold text-primary">{order.total} ₴</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Profile Modal */}
                {isEditProfileOpen && currentUser && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
                        <div className="bg-white dark:bg-darkBg w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative">
                            <button onClick={() => setIsEditProfileOpen(false)} className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors z-10 text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                            </button>
                            <div className="p-8">
                                <h2 className="text-2xl font-extrabold text-dark dark:text-white mb-2">Редагування профілю</h2>
                                <p className="text-sm text-gray-500 mb-6">Змініть свої дані</p>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Імʼя</label>
                                        <input type="text" value={editProfileForm.name || ''} onChange={e => setEditProfileForm({...editProfileForm, name: e.target.value})} placeholder="Іван" minLength={2} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 font-medium" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Телефон</label>
                                        <input type="tel" value={editProfileForm.phone || ''} onChange={e => setEditProfileForm({...editProfileForm, phone: e.target.value})} placeholder="+380 XX XXX XX XX" className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 font-medium" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Місто</label>
                                        <input type="text" value={editProfileForm.city || ''} onChange={e => setEditProfileForm({...editProfileForm, city: e.target.value})} placeholder="Київ" className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 font-medium" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Відділення Нової Пошти</label>
                                        <input type="text" value={editProfileForm.address || ''} onChange={e => setEditProfileForm({...editProfileForm, address: e.target.value})} placeholder="№1 або адреса" className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 font-medium" />
                                    </div>
                                    <div className="flex gap-3 pt-2">
                                        <button onClick={() => setIsEditProfileOpen(false)} className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 text-dark dark:text-white font-bold rounded-xl hover:bg-gray-200 transition-colors">Скасувати</button>
                                        <button onClick={handleEditProfileSave} className="flex-1 py-3 gradient-bg text-white font-bold rounded-xl hover:opacity-90 transition-opacity shadow-md">Зберегти</button>
                                    </div>
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
                            <div className="mb-4 flex items-center select-none">
                                <img src="images/logo.svg?v=8" alt="жуйка" className="h-12 w-auto object-contain block" />
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed mb-6">
                                Магазин солодощів та екзотичних напоїв з усього світу.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-4 uppercase tracking-wider text-sm">Контакти</h4>
                            <ul className="text-sm text-gray-400 space-y-3">

                                <li className="flex items-center gap-3">
                                    <span className="text-lg">📞</span>
                                    <a href="tel:+380779152365" className="hover:text-primary transition-colors font-medium">+38 (077) 915-23-65</a>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="text-lg">✉️</span>
                                    <a href="mailto:shop@juyka.com" className="hover:text-primary transition-colors">shop@juyka.com</a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-4 uppercase tracking-wider text-sm">Інформація</h4>
                            <ul className="text-sm text-gray-400 space-y-3">
                                <li><a href="#" onClick={(e) => { e.preventDefault(); navigateTo('article', null, null, promotions.find(p => p.id === 10)); window.scrollTo(0, 0); }} className="hover:text-primary transition-colors">Про нас</a></li>
                                <li><a href="#" onClick={(e) => { e.preventDefault(); navigateTo('article', null, null, promotions.find(p => p.id === 5)); window.scrollTo(0, 0); }} className="hover:text-primary transition-colors">Доставка та оплата</a></li>
                                <li><a href="#" onClick={(e) => { e.preventDefault(); navigateTo('article', null, null, promotions.find(p => p.id === 6)); window.scrollTo(0, 0); }} className="hover:text-primary transition-colors">Питання-відповідь</a></li>
                                <li><a href="#" onClick={(e) => { e.preventDefault(); navigateTo('article', null, null, promotions.find(p => p.id === 7)); window.scrollTo(0, 0); }} className="hover:text-primary transition-colors">Договір публічної оферти</a></li>
                                <li><a href="#" onClick={(e) => { e.preventDefault(); navigateTo('article', null, null, promotions.find(p => p.id === 8)); window.scrollTo(0, 0); }} className="hover:text-primary transition-colors">Політика конфіденційності</a></li>
                                <li><a href="#" onClick={(e) => { e.preventDefault(); navigateTo('article', null, null, promotions.find(p => p.id === 9)); window.scrollTo(0, 0); }} className="hover:text-primary transition-colors">Умови повернення</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-4 uppercase tracking-wider text-sm">Графік роботи</h4>
                            <ul className="text-sm text-gray-400 space-y-3 mb-6 bg-gray-900 p-4 rounded-xl border border-gray-800">
                                <li className="flex justify-between items-center"><span>Пн - Пт:</span> <span className="font-bold text-white">09:00 - 20:00</span></li>
                                <li className="flex justify-between items-center border-t border-gray-800 pt-2"><span>Сб - Нд:</span> <span className="font-bold text-white">10:00 - 18:00</span></li>
                            </ul>
                            {/* Social networks removed */}
                        </div>
                    </div>
                    <div className="text-center text-sm font-medium text-gray-500 pt-8 border-t border-gray-800 flex justify-center items-center">
                        <span>&copy; {new Date().getFullYear()} juyka.com. Всі права захищені.</span>
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
            {/* Support Chat Widget */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
                {/* Chat Window */}
                {isChatOpen && (
                    <div className="w-80 sm:w-96 h-[450px] bg-white dark:bg-darkCard rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden mb-4 animate-in slide-in-from-bottom-8 duration-300">
                        {/* Header */}
                        <div className="gradient-bg px-5 py-4 text-white flex justify-between items-center shadow-sm">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-lg font-bold">💬</div>
                                <div>
                                    <h3 className="font-extrabold text-sm leading-none">Підтримка Жуйки</h3>
                                    <span className="text-[10px] text-white/80 font-medium mt-0.5 block">Менеджер онлайн</span>
                                </div>
                            </div>
                            <button onClick={() => setIsChatOpen(false)} className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors font-bold text-lg">&times;</button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900/50">
                            {chatMessages.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-400">
                                    <span className="text-4xl mb-2">👋</span>
                                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Привіт! Маєте запитання?</p>
                                    <p className="text-xs text-gray-400 mt-1">Напишіть нам тут, і ми відповімо вам прямо в цей чат!</p>
                                </div>
                            ) : (
                                chatMessages.map((msg, index) => (
                                    <div key={index} className={`flex gap-2 ${msg.sender === 'client' ? 'justify-end' : 'justify-start'}`}>
                                        {msg.sender === 'support' && (
                                            <img 
                                                src={msg.senderAvatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face'} 
                                                alt={msg.senderName || 'Підтримка'} 
                                                className="w-7 h-7 rounded-full object-cover self-end mb-1 border border-gray-100 dark:border-gray-800" 
                                            />
                                        )}
                                        <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm ${
                                            msg.sender === 'client' 
                                                ? 'bg-primary text-white rounded-br-none shadow-sm' 
                                                : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-700 rounded-bl-none shadow-sm'
                                        }`}>
                                            {msg.sender === 'support' && (
                                                <span className="text-[10px] font-black block text-primary mb-0.5">
                                                    {msg.senderName || 'Підтримка'}
                                                </span>
                                            )}
                                            <p className="leading-relaxed break-words">{msg.text}</p>
                                            <span className={`text-[9px] block text-right mt-1 ${msg.sender === 'client' ? 'text-white/70' : 'text-gray-400'}`}>
                                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSendMessage} className="p-3 bg-white dark:bg-darkCard border-t border-gray-100 dark:border-gray-800 flex gap-2">
                            <input
                                type="text"
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                placeholder="Напишіть повідомлення..."
                                className="flex-1 bg-gray-50 dark:bg-gray-800 text-sm text-dark dark:text-white px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                            />
                            <button type="submit" className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center hover:bg-primary/95 transition-all shadow-md active:scale-95">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 transform rotate-90">
                                    <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                                </svg>
                            </button>
                        </form>
                    </div>
                )}

                {/* Floating Action Button */}
                <button
                    onClick={() => setIsChatOpen(!isChatOpen)}
                    className="w-14 h-14 rounded-full gradient-bg text-white shadow-2xl flex items-center justify-center hover:scale-105 transition-all active:scale-95 relative group border-2 border-white dark:border-gray-800"
                >
                    {isChatOpen ? (
                        <span className="text-2xl font-bold">&times;</span>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.278.187 2.222 1.282 2.222 2.571v9.753c0 1.29-.943 2.384-2.222 2.57-1.08.157-2.193.26-3.324.307L12 22.25v-4.125a49.123 49.123 0 0 1-7.152-.52C3.57 17.418 2.625 16.324 2.625 15.035V5.342c0-1.29.943-2.384 2.222-2.572Z" clipRule="evenodd" />
                            </svg>
                            {unreadChatCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                                    {unreadChatCount}
                                </span>
                            )}
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default App;
