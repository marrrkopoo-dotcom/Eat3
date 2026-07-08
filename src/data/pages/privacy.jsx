import React from 'react';

export const PrivacyPage = () => (
    <div className="space-y-6">
        <div className="bg-white/60 dark:bg-gray-800/60 p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">1. Яку інформацію ми збираємо</h3>
            <div className="space-y-3 text-gray-600 dark:text-gray-400">
                <p>Для оформлення та відправки ваших покупок нам потрібні деякі ваші контактні дані. Ми збираємо їх лише тоді, коли ви самостійно заповнюєте форми замовлення або реєструєте акаунт.</p>
                <p>До цього переліку належать: ваше ім'я та прізвище, номер мобільного телефону, адреса електронної пошти та обране відділення або поштомат Нової Пошти.</p>
            </div>
        </div>

        <div className="bg-white/60 dark:bg-gray-800/60 p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">2. Навіщо потрібні ці дані</h3>
            <div className="space-y-3 text-gray-600 dark:text-gray-400">
                <p>Зібрані відомості використовуються нами виключно для виконання наших зобов'язань перед вами:</p>
                <ul className="list-disc pl-5 space-y-1">
                    <li>Організація швидкої доставки товарів на вашу адресу;</li>
                    <li>Зв'язок з вами для підтвердження деталей замовлення або вирішення будь-яких питань;</li>
                    <li>Покращення роботи інтерфейсу сайту та аналіз споживчих переваг.</li>
                </ul>
            </div>
        </div>

        <div className="bg-white/60 dark:bg-gray-800/60 p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">3. Безпека ваших даних</h3>
            <div className="space-y-3 text-gray-600 dark:text-gray-400">
                <p>Ми використовуємо надійні заходи безпеки, щоб захистити ваші контактні відомості від втрати, крадіжки або несанкціонованого доступу. Ми ніколи не передаємо вашу персональну інформацію третім особам, крім випадків, безпосередньо пов'язаних із доставкою вашої посилки (наприклад, передача даних Новій Пошті).</p>
            </div>
        </div>

        <div className="bg-white/60 dark:bg-gray-800/60 p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">4. Згода з правилами сайту</h3>
            <div className="space-y-3 text-gray-600 dark:text-gray-400">
                <p>Використовуючи послуги нашого магазину та надсилаючи свої дані через форми на сайті, ви підтверджуєте свою повну згоду з правилами цієї Політики.</p>
            </div>
        </div>
    </div>
);
