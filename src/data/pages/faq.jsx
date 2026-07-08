import React from 'react';

export const FAQPage = () => (
    <div className="space-y-6">
        <div className="bg-white/60 dark:bg-gray-800/60 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2"><span className="text-primary">1.</span> Як оформити покупку на сайті?</h3>
            <div className="space-y-2 text-gray-600 dark:text-gray-400 pl-6 border-l-2 border-gray-200 dark:border-gray-600 ml-2">
                <p>Оберіть потрібні товари в каталозі та натисніть кнопку додавання до кошика.</p>
                <p>Наш інтернет-магазин приймає замовлення на суму від 350 грн.</p>
                <p>Після завершення вибору перейдіть до розділу оформлення у правому верхньому кутку.</p>
                <p>Вкажіть дані одержувача та номер поштового відділення, після чого підтвердіть замовлення.</p>
            </div>
        </div>

        <div className="bg-white/60 dark:bg-gray-800/60 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2"><span className="text-primary">2.</span> Чому діє правило передоплати?</h3>
            <div className="text-gray-600 dark:text-gray-400 pl-6 border-l-2 border-gray-200 dark:border-gray-600 ml-2">
                Ми збираємо та пакуємо кожне замовлення індивідуально. Завдяки внесенню часткової або повної передоплати за реквізитами ми отримуємо гарантію того, що посилку заберуть з пошти, і нам не доведеться нести збитки за логістику в обидва боки.
            </div>
        </div>

        <div className="bg-white/60 dark:bg-gray-800/60 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2"><span className="text-primary">3.</span> Скільки часу займає доставка?</h3>
            <div className="text-gray-600 dark:text-gray-400 pl-6 border-l-2 border-gray-200 dark:border-gray-600 ml-2">
                Складання та відправка замовлень відбуваються щодня. Зазвичай доставка Новою Поштою по містах України займає близько 1-2 днів (у віддалені населені пункти доставка може тривати від 3 до 4 днів).
            </div>
        </div>

        <div className="bg-white/60 dark:bg-gray-800/60 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2"><span className="text-primary">4.</span> Чи можна зробити подарунок іншій людині?</h3>
            <div className="space-y-2 text-gray-600 dark:text-gray-400 pl-6 border-l-2 border-gray-200 dark:border-gray-600 ml-2">
                <p>Так, ми з радістю допоможемо вам організувати сюрприз. Для цього:</p>
                <p>1) Вкажіть ім'я, прізвище та відділення пошти вашого друга при оформленні.</p>
                <p>2) Введіть власний номер телефону для зв'язку з менеджером, а номер телефону друга вкажіть у коментарях, щоб він отримав сповіщення про прибуття посилки.</p>
            </div>
        </div>

        <div className="bg-white/60 dark:bg-gray-800/60 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2"><span className="text-primary">5.</span> Чи є можливість забрати замовлення самостійно?</h3>
            <div className="text-gray-600 dark:text-gray-400 pl-6 border-l-2 border-gray-200 dark:border-gray-600 ml-2">
                <p>Послуга самовивозу діє у місті Києві. Точний час та адресу узгоджує менеджер індивідуально після підтвердження замовлення.</p>
            </div>
        </div>

        <div className="bg-white/60 dark:bg-gray-800/60 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2"><span className="text-primary">6.</span> Умови для оптових покупців</h3>
            <div className="text-gray-600 dark:text-gray-400 pl-6 border-l-2 border-gray-200 dark:border-gray-600 ml-2">
                Ми працюємо за роздрібною моделлю і не маємо системи дропшипінгу. Проте при замовленні великих партій продукції (від 40 штук однієї позиції) ми можемо запропонувати спеціальну індивідуальну знижку. Для обговорення деталей пишіть на нашу пошту: <a href="mailto:shop@juyka.com" className="text-primary hover:underline">shop@juyka.com</a>.
            </div>
        </div>
    </div>
);
