import React from 'react';

export const AboutPage = () => (
    <div className="space-y-6">
        <div className="bg-white/60 dark:bg-gray-800/60 p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">Жуйка - провідник у світ екзотичних смаків</h3>
            <div className="space-y-4 text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                <p>Наш проект виник з великої пристрасті до незвичайних гастрономічних відкриттів. Ми прагнемо розширити межі звичного солодкого асортименту та познайомити вас з унікальними десертами, які рідко зустрічаються на полицях звичайних маркетів.</p>
                <p>Кожен продукт у нашому каталозі ми підбираємо особисто, фокусуючись на оригінальності походження, лімітованих серіях та ексклюзивних брендах, які завоювали популярність у різних країнах.</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/60 dark:bg-gray-800/60 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                <span className="text-3xl mb-3 block">🌍</span>
                <h4 className="font-bold text-gray-900 dark:text-white mb-2">Прямі поставки</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Ми організовуємо регулярний імпорт солодощів та напоїв з США, країн Європи та Азії без посередників.</p>
            </div>
            <div className="bg-white/60 dark:bg-gray-800/60 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                <span className="text-3xl mb-3 block">⚡</span>
                <h4 className="font-bold text-gray-900 dark:text-white mb-2">Оперативний сервіс</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Пакуємо замовлення одразу після підтвердження та передаємо на відправку в той самий день.</p>
            </div>
        </div>

        <div className="bg-primary/10 border border-primary/20 p-6 rounded-2xl text-gray-800 dark:text-gray-200">
            <h4 className="font-bold mb-2">Дякуємо, що обираєте нас!</h4>
            <p className="text-sm">Жуйка створена для того, щоб дарувати вам та вашим близьким яскраві смакові враження та приємні моменти. Відкривайте нове та насолоджуйтеся кожною миттю.</p>
        </div>
    </div>
);
