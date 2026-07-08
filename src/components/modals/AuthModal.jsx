import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

export const AuthModal = () => {
    const { 
        isAuthModalOpen, setIsAuthModalOpen, 
        authMode, setAuthMode, 
        authForm, setAuthForm, 
        authError, handleAuthSubmit 
    } = useAuth();

    if (!isAuthModalOpen) return null;

    return (
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
    );
};
