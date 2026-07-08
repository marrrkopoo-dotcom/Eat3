import React from 'react';

export const OfferPage = () => (
    <div className="space-y-6">
        <div className="bg-white/60 dark:bg-gray-800/60 p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">1. Вступні положення</h3>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
                <p>1.1. Цей документ є публічною пропозицією ТОВАРИСТВА З ОБМЕЖЕНОЮ ВІДПОВІДАЛЬНІСТЮ "СБИТ-ВОСТОК" (код ЄДРПОУ 41899847), надалі за текстом - Продавець, укласти договір купівлі-продажу товарів дистанційно за допомогою електронного ресурсу juyka.com.</p>
                <p>1.2. Повною та беззастережною згодою з умовами даної пропозиції (акцептом) вважається факт внесення Покупцем оплати за обрані товари на умовах, опублікованих на цьому сайті.</p>
                <p className="font-medium text-gray-900 dark:text-white">Юридична особа: ТОВ "СБИТ-ВОСТОК" (код ЄДРПОУ 41899847)</p>
            </div>
        </div>

        <div className="bg-white/60 dark:bg-gray-800/60 p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">2. Визначення основних термінів</h3>
            <div className="space-y-2 text-gray-600 dark:text-gray-400">
                <p>2.1. У цьому договорі наведені нижче поняття використовуються у таких значеннях:</p>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                    <li><strong className="text-gray-900 dark:text-white">Товар</strong> - кондитерські вироби, солодощі, снеки, газовані та енергетичні напої, представлені на сайті;</li>
                    <li><strong className="text-gray-900 dark:text-white">Сайт (Інтернет-магазин)</strong> - електронний майданчик juyka.com, створений для демонстрації та дистанційного продажу;</li>
                    <li><strong className="text-gray-900 dark:text-white">Покупець</strong> - дієздатна фізична особа, яка замовляє та оплачує товари на сайті для власних потреб;</li>
                    <li><strong className="text-gray-900 dark:text-white">Замовлення</strong> - сформований запит на купівлю обраних позицій товарів, що надсилається через інтерфейс кошика.</li>
                </ul>
            </div>
        </div>

        <div className="bg-white/60 dark:bg-gray-800/60 p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">3. Суть угоди</h3>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
                <p>3.1. Продавець зобов'язується передати у власність Покупця замовлений Товар, а Покупець бере на себе зобов'язання оплатити його вартість та прийняти його згідно з правилами цього Договору.</p>
                <p>3.2. Ця угода поширюється на вибір товарів, оформлення замовлення, здійснення оплати та подальшу доставку товарів покупцю.</p>
            </div>
        </div>

        <div className="bg-white/60 dark:bg-gray-800/60 p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">4. Оформлення покупок</h3>
            <div className="space-y-3 text-gray-600 dark:text-gray-400">
                <p>4.1. Оформлення замовлення здійснюється Покупцем самостійно через інтерфейс кошика на Сайті.</p>
                <p>4.2. Кількість одиниць кожної позиції товару визначається Покупцем особисто при формуванні замовлення.</p>
                <p>4.3. Якщо обраної позиції немає на складі, представник магазину повідомляє про це покупця телефоном або електронною поштою для внесення змін до замовлення.</p>
            </div>
        </div>

        <div className="bg-white/60 dark:bg-gray-800/60 p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">5. Розрахунки та оплата</h3>
            <div className="space-y-3 text-gray-600 dark:text-gray-400">
                <p>5.1. Покупець може здійснити оплату замовлення двома способами: післяплатою при отриманні посилки у відділенні перевізника або шляхом безготівкового переказу на реквізити IBAN Продавця.</p>
                <p>5.2. У разі неотримання оплати у визначений термін, замовлення вважається скасованим.</p>
            </div>
        </div>

        <div className="bg-white/60 dark:bg-gray-800/60 p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">6. Доставка</h3>
            <div className="text-gray-600 dark:text-gray-400">
                <p>6.1. Транспортування замовлень виконується поштовою компанією Нова Пошта. Товари видаються у відділеннях або поштоматах компанії-перевізника, обраних Покупцем при реєстрації замовлення.</p>
            </div>
        </div>

        <div className="bg-white/60 dark:bg-gray-800/60 p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">7. Права та взаємні обов'язки</h3>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
                <p>7.1. Продавець має право призупинити обслуговування Покупця, якщо останній порушує суттєві умови даної угоди.</p>
                <p>7.2. Покупець зобов'язаний своєчасно розрахуватися за Товар та отримати надіслану йому посилку.</p>
                <p>7.3. Покупець має право вимагати належного виконання Продавцем зобов'язань щодо комплектації та якості товарів.</p>
            </div>
        </div>

        <div className="bg-white/60 dark:bg-gray-800/60 p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">8. Обмеження відповідальності</h3>
            <div className="space-y-3 text-gray-600 dark:text-gray-400">
                <p>8.1. Сторони несуть відповідальність за неналежне виконання зобов'язань згідно з чинним законодавством України.</p>
                <p>8.2. Продавець не несе відповідальності за зміну дизайну упаковки виробником, затримки доставки з вини поштової компанії або за неточності в контактних даних, вказаних Покупцем при замовленні.</p>
                <p>8.3. За виникнення форс-мажорних обставин сторони звільняються від виконання зобов'язань за цим договором.</p>
            </div>
        </div>

        <div className="bg-white/60 dark:bg-gray-800/60 p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">9. Додаткові умови</h3>
            <div className="space-y-3 text-gray-600 dark:text-gray-400">
                <p>9.1. Інтернет-магазин має право оновлювати цей договір в односторонньому порядку, публікуючи нову редакцію на цій сторінці.</p>
                <p>9.2. Здійснюючи замовлення, Покупець добровільно погоджується на збір та обробку своїх персональних даних з метою організації доставки.</p>
            </div>
        </div>
    </div>
);
