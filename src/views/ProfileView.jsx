import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useChat } from '../contexts/ChatContext';
import { allProducts } from '../utils/data';
import { Link } from '../components/ui/Link';

export const ProfileView = () => {
    const { navigateTo } = useAppContext();
    const { 
        currentUser, handleLogout,
        isEditProfileOpen, setIsEditProfileOpen,
        editProfileForm, setEditProfileForm,
        handleEditProfileSave
    } = useAuth();
    const { addToCart, setRepeatedOrderDetails } = useCart();
    const { setIsChatOpen, setChatMessages } = useChat();
    
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const [cancelModalOrderId, setCancelModalOrderId] = useState(null);

    const handleCancelClick = (orderId) => {
        setCancelModalOrderId(orderId);
    };

    const confirmCancelOrder = () => {
        if(!cancelModalOrderId) return;
        const orderId = cancelModalOrderId;
        const updatedUser = {
            ...currentUser,
            orders: currentUser.orders.map(o => o.id === orderId ? {...o, status: 'cancelled_by_client'} : o)
        };
        setCurrentUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const updatedUsers = users.map(u => u.email === updatedUser.email ? updatedUser : u);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        
        const cancelMsg = {
             sender: 'user',
             text: `Хочу скасувати замовлення №${orderId}`,
             timestamp: new Date().toISOString()
        };
        const botReply = {
             sender: 'support',
             senderName: 'Жуйка Бот 🤖',
             senderAvatar: 'https://images.unsplash.com/photo-1546776310-eef45dd6d63c?w=150&h=150&fit=crop',
             text: `✅ Замовлення №${orderId} успішно скасовано. Кошти (якщо була оплата карткою) буде повернуто на ваш рахунок найближчим часом.`,
             timestamp: new Date().toISOString()
        };
        setChatMessages(prev => [...prev, cancelMsg, botReply]);
        setExpandedOrderId(null);
        setCancelModalOrderId(null);
    };

    if (!currentUser) return null;

    return (
        <div className="max-w-6xl mx-auto py-8 px-4 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4 mb-8">
                <Link view="shop" nav="Всі" className="p-2 bg-white dark:bg-darkCard rounded-full shadow-sm hover:shadow-md transition-all text-dark dark:text-white inline-flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                </Link>
                <h2 className="text-3xl font-extrabold text-dark dark:text-white">Особистий кабінет</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: User Info */}
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
                                <Link view="shop" nav="Всі" className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors inline-block text-center">Перейти до каталогу</Link>
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
                                                     order.status === 'processing' ? 'В обробці ⏳' : 
                                                     order.status === 'cancelled_by_client' ? 'Скасовано клієнтом ❌' : 'Скасовано ❌'}
                                                </span>
                                            </div>
                                            <div className="pt-2 text-xs text-gray-400">
                                                Оформлено: {order.date}
                                            </div>
                                            {order.status === 'processing' ? (
                                                <button onClick={() => handleCancelClick(order.id)} className="w-full mt-2 py-2.5 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 font-bold rounded-xl text-sm hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">
                                                    Скасувати замовлення
                                                </button>
                                            ) : (order.status !== 'cancelled' && order.status !== 'cancelled_by_client') ? (
                                                <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-xs text-gray-500 dark:text-gray-400 text-center">
                                                    Замовлення вже підтверджено або відправлено. Для скасування або зміни зверніться у <button onClick={() => setIsChatOpen(true)} className="text-primary font-bold hover:underline">підтримку</button>.
                                                </div>
                                            ) : null}
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
                                            {(order.customerName || order.customerPhone || order.id) && (
                                                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 space-y-2">
                                                    <h5 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Покупець</h5>
                                                    {order.id && <div className="text-sm font-semibold text-primary">🔢 Замовлення {order.id}</div>}
                                                    {order.customerName && <div className="text-sm font-semibold text-dark dark:text-white">👤 {order.customerName}</div>}
                                                    {order.customerPhone && <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">📞 {order.customerPhone}</div>}
                                                </div>
                                            )}
                                            {(order.city || order.postOffice) && (
                                                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 space-y-1">
                                                    <h5 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Адреса доставки</h5>
                                                    {order.city && <div className="text-sm font-semibold text-dark dark:text-white">📍 {order.city}</div>}
                                                    {order.postOffice && <div className="text-sm text-gray-600 dark:text-gray-400">📦 {order.postOffice}</div>}
                                                </div>
                                            )}
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
                                    <button onClick={() => { handleEditProfileSave(); setIsEditProfileOpen(false); }} className="flex-1 py-3 gradient-bg text-white font-bold rounded-xl hover:opacity-90 transition-opacity shadow-md">Зберегти</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Cancel Confirmation Modal */}
            {cancelModalOrderId && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-darkBg w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden relative p-8 text-center animate-in zoom-in-95 duration-200">
                        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </div>
                        <h2 className="text-2xl font-extrabold text-dark dark:text-white mb-2">Скасувати замовлення?</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Ви впевнені, що хочете скасувати це замовлення? Цю дію неможливо відмінити.</p>
                        
                        <div className="flex gap-3">
                            <button onClick={() => setCancelModalOrderId(null)} className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 text-dark dark:text-white font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                Ні, залишити
                            </button>
                            <button onClick={confirmCancelOrder} className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors shadow-md shadow-red-500/20">
                                Так, скасувати
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
