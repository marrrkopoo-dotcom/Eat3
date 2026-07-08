import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Link } from '../components/ui/Link';
import { useChat } from '../contexts/ChatContext';

export const CheckoutView = () => {
    const { navigateTo, setActiveView, setActiveNav } = useAppContext();
    const { 
        cart, removeFromCart, updateQuantity, clearCart, 
        setLastOrderDetails, repeatedOrderDetails, setRepeatedOrderDetails 
    } = useCart();
    const { currentUser, setCurrentUser } = useAuth();
    const { setChatMessages, clientId } = useChat();

    const [cityInput, setCityInput] = React.useState(() => {
        return repeatedOrderDetails ? repeatedOrderDetails.city || '' : currentUser ? (currentUser.city || '') : '';
    });

    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

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
        const orderTotal = cartTotal;

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

    return (
        <div className="max-w-5xl mx-auto">
            <div className="py-2 text-sm text-gray-500 dark:text-gray-400 font-medium mb-6 flex items-center gap-2">
                <Link view="shop" nav="Напої" className="hover:text-primary cursor-pointer transition-colors inline-block">Головна</Link>
                <span className="mx-3 text-gray-300 dark:text-gray-600">/</span>
                <span className="text-dark dark:text-gray-200">Оформлення замовлення</span>
            </div>
            
            <div className="bg-white dark:bg-darkBg rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-gray-100 dark:border-gray-800">
                {/* Order Summary */}
                <div className="w-full md:w-5/12 bg-gray-50 dark:bg-darkCard p-6 sm:p-8 border-r border-gray-100 dark:border-gray-800 flex flex-col min-h-[500px]">
                    <h2 className="text-2xl font-black text-dark dark:text-white mb-6">Ваш кошик</h2>
                    
                    {cart.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                            <div className="text-6xl mb-4">🛒</div>
                            <p className="mb-6 font-medium">Кошик поки порожній</p>
                            <Link view="shop" nav="Напої" className="px-6 py-2.5 bg-primary/10 text-primary rounded-full font-bold hover:bg-primary hover:text-white transition-colors inline-block text-center">Перейти до покупок</Link>
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
                                                <button onClick={() => updateQuantity(item.id, -1)} className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-700 text-dark dark:text-white transition">-</button>
                                                <span className="font-bold text-dark dark:text-white w-4 text-center">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, 1)} className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-700 text-dark dark:text-white transition">+</button>
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
                                value={cityInput}
                                onChange={(e) => setCityInput(e.target.value)}
                                placeholder="Наприклад: Київ"
                                minLength={2}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-darkBg border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                            />
                            <div className="flex flex-wrap gap-2 mt-2">
                                {['Київ', 'Львів', 'Одеса', 'Дніпро', 'Харків'].map(c => (
                                    <button 
                                        type="button" 
                                        key={c}
                                        onClick={() => setCityInput(c)}
                                        className="text-xs px-2.5 py-1 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>
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
                            <Link view="shop" nav="Всі" className="block w-full mt-3 font-bold py-4 rounded-xl text-gray-500 hover:text-dark dark:hover:text-white transition-colors text-center">
                                Повернутися до покупок
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
