import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    
    // City Selection State is closely tied to cart/checkout
    const [selectedCity, setSelectedCity] = useState("Київ");
    const [isSelectingCity, setIsSelectingCity] = useState(false);
    const [isCityConfirmed, setIsCityConfirmed] = useState(false);
    const availableCities = ["Київ", "Львів", "Одеса", "Харків", "Дніпро", "Вінниця"];

    const [lastOrderDetails, setLastOrderDetails] = useState(null);
    const [repeatedOrderDetails, setRepeatedOrderDetails] = useState(null);

    const addToCart = (product) => {
        if (product.outOfStock) return;
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const updateQuantity = (id, delta) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const newQuantity = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQuantity };
            }
            return item;
        }));
    };

    const removeFromCart = (id) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const clearCart = () => {
        setCart([]);
    };

    return (
        <CartContext.Provider value={{
            cart, setCart,
            addToCart, updateQuantity, removeFromCart, clearCart,
            selectedCity, setSelectedCity,
            isSelectingCity, setIsSelectingCity,
            isCityConfirmed, setIsCityConfirmed,
            availableCities,
            lastOrderDetails, setLastOrderDetails,
            repeatedOrderDetails, setRepeatedOrderDetails
        }}>
            {children}
        </CartContext.Provider>
    );
};
