import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { useCart } from '../contexts/CartContext';

export const SuccessView = () => {
    const { navigateTo } = useAppContext();
    const { lastOrderDetails } = useCart();

    if (!lastOrderDetails) {
        navigateTo('shop');
        return null;
    }

    return (
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
    );
};
