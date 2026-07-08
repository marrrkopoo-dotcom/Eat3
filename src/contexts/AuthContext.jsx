import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(() => {
        const saved = localStorage.getItem('currentUser');
        return saved ? JSON.parse(saved) : null;
    });
    
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
    const [authForm, setAuthForm] = useState({ name: '', email: '', phone: '', countryCode: '+380', address: '', password: '' });
    const [authError, setAuthError] = useState('');
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    const [editProfileForm, setEditProfileForm] = useState({});
    
    const handleAuthSubmit = (e) => {
        e.preventDefault();
        setAuthError('');

        let users = JSON.parse(localStorage.getItem('users') || '[]');

        if (authMode === 'register') {
            if (!authForm.name || authForm.name.trim().length < 2) {
                setAuthError('Введіть ваше імʼя (мінімум 2 символи).');
                return;
            }
            if (!authForm.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(authForm.email)) {
                setAuthError('Введіть коректну email-адресу.');
                return;
            }
            if (!authForm.password || authForm.password.length < 6) {
                setAuthError('Пароль повинен містити мінімум 6 символів.');
                return;
            }
            if (authForm.phone) {
                const rawPhone = authForm.phone.replace(/[\s\-()]/g, '');
                if (!/^[0-9]{9,10}$/.test(rawPhone)) {
                    setAuthError('Введіть коректний номер телефону (9-10 цифр без коду країни).');
                    return;
                }
            }
            if (users.find(u => u.email === authForm.email)) {
                setAuthError('Користувач з таким email вже існує.');
                return;
            }

            const fullPhone = authForm.countryCode && authForm.phone
                ? authForm.countryCode + ' ' + authForm.phone
                : authForm.phone || '';

            const newUser = {
                id: Date.now(),
                name: authForm.name.trim(),
                email: authForm.email.trim(),
                phone: fullPhone,
                address: authForm.address || '',
                password: authForm.password,
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(authForm.name.trim())}&background=random`,
                orders: []
            };

            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(newUser));
            setCurrentUser(newUser);
            setIsAuthModalOpen(false);
            setAuthForm({ name: '', email: '', phone: '', countryCode: '+380', address: '', password: '' });

        } else {
            if (!authForm.email || !authForm.password) {
                setAuthError('Введіть email та пароль.');
                return;
            }
            const user = users.find(u => u.email === authForm.email && u.password === authForm.password);
            if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                setCurrentUser(user);
                setIsAuthModalOpen(false);
                setAuthForm({ name: '', email: '', phone: '', countryCode: '+380', address: '', password: '' });
            } else {
                setAuthError('Невірний email або пароль. Спробуйте ще раз.');
            }
        }
    };

    const handleEditProfileSave = () => {
        const updatedUser = {
            ...currentUser,
            name: editProfileForm.name || currentUser.name,
            phone: editProfileForm.phone || currentUser.phone,
            address: editProfileForm.address || currentUser.address,
            city: editProfileForm.city || currentUser.city,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(editProfileForm.name || currentUser.name)}&background=random`
        };
        setCurrentUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const idx = users.findIndex(u => u.email === currentUser.email);
        if (idx !== -1) { 
            users[idx] = updatedUser; 
            localStorage.setItem('users', JSON.stringify(users)); 
        }
        setIsEditProfileOpen(false);
    };

    const handleLogout = (navigateTo) => {
        localStorage.removeItem('currentUser');
        setCurrentUser(null);
        if(navigateTo) navigateTo('shop');
    };

    return (
        <AuthContext.Provider value={{
            currentUser, setCurrentUser,
            isAuthModalOpen, setIsAuthModalOpen,
            authMode, setAuthMode,
            authForm, setAuthForm,
            authError, setAuthError,
            handleAuthSubmit, handleLogout,
            isEditProfileOpen, setIsEditProfileOpen,
            editProfileForm, setEditProfileForm,
            handleEditProfileSave
        }}>
            {children}
        </AuthContext.Provider>
    );
};
