import React from 'react';

export const ReturnsPage = () => (
    <div className="space-y-6">
        <div className="bg-white/60 dark:bg-gray-800/60 p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Правила повернення продовольчої продукції</h3>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
                <p>Оскільки наш асортимент складається виключно з продуктів харчування (снеків, кондитерських виробів та напоїв), відповідно до норм законодавства України («Про захист прав споживачів»), такі товари належної якості не підлягають обміну або поверненню.</p>
                <p>Тому ми рекомендуємо уважно оглядати посилку та перевіряти цілісність упаковок та терміни придатності безпосередньо у відділенні «Нової Пошти» при одержанні.</p>
            </div>
        </div>

        <div className="bg-white/60 dark:bg-gray-800/60 p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Як діяти у разі виявлення пошкоджень чи невідповідності</h3>
            <div className="space-y-3 text-gray-600 dark:text-gray-400">
                <p>Якщо при огляді посилки на пошті ви виявили пошкодження упаковок, відсутність деяких позицій або невідповідність замовленим товарам:</p>
                <ul className="list-decimal pl-5 space-y-2">
                    <li>Обов'язково зафіксуйте цей факт спільно зі співробітником пошти, склавши Акт прийому-передачі;</li>
                    <li>Зробіть фотографії пошкоджених або невідповідних позицій;</li>
                    <li>Зв'яжіться з нашою службою підтримки за телефоном: <a href="tel:+380779152365" className="font-bold hover:underline text-primary">(077) 915-23-65</a>;</li>
                    <li>Ми оперативно вирішимо ситуацію: зробимо повернення коштів за ці товари або безкоштовно надішлемо заміну.</li>
                </ul>
            </div>
        </div>

        <div className="bg-primary/10 border border-primary/20 p-6 rounded-2xl text-gray-800 dark:text-gray-200">
            <p className="font-medium text-primary">Важливе застереження!</p>
            <p className="mt-1">Будь-які претензії щодо цілісності або комплектації замовлення, виявлені після того, як ви залишили відділення Нової Пошти, на жаль, не приймаються до розгляду. Це пов'язано з тим, що ми не можемо перевірити умови зберігання та транспортування товарів поза межами поштового сервісу.</p>
        </div>
    </div>
);
