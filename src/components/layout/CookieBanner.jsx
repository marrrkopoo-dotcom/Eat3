import React, { useState, useEffect } from 'react';

export const CookieBanner = () => {
    const [cookieAccepted, setCookieAccepted] = useState(true);

    useEffect(() => {
        const accepted = localStorage.getItem('cookieAccepted');
        if (!accepted) {
            setCookieAccepted(false);
        }
    }, []);

    const handleAcceptCookie = () => {
        localStorage.setItem('cookieAccepted', 'true');
        setCookieAccepted(true);
    };

    if (cookieAccepted) return null;

    return (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white dark:bg-darkCard p-4 rounded-2xl shadow-2xl z-50 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 max-w-2xl w-[calc(100%-2rem)] border border-gray-200 dark:border-gray-700 animate-in slide-in-from-bottom-8 duration-500">
            <p className="text-sm text-gray-600 dark:text-gray-300 text-center sm:text-left">
                Ми використовуємо <strong>рекомендаційні технології</strong> та збираємо текстові файли cookie для аналітики та правильної роботи сайту. Залишаючись на сайті, ви <strong>погоджуєтесь з обробкою текстових файлів cookie</strong>.
            </p>
            <button onClick={handleAcceptCookie} className="w-full sm:w-auto whitespace-nowrap px-6 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-dark dark:text-white font-bold rounded-xl transition-colors">
                Погоджуюсь
            </button>
        </div>
    );
};
