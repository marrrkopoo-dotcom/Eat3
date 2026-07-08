import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { ChatProvider } from './contexts/ChatContext';
import { AppProvider, useAppContext } from './contexts/AppContext';

import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { CookieBanner } from './components/layout/CookieBanner';
import { SupportChat } from './components/chat/SupportChat';
import { AuthModal } from './components/modals/AuthModal';

import { ShopView } from './views/ShopView';
import { ProductView } from './views/ProductView';
import { CheckoutView } from './views/CheckoutView';
import { ProfileView } from './views/ProfileView';
import { ArticleView } from './views/ArticleView';
import { SuccessView } from './views/SuccessView';

const AppContent = () => {
    const { activeView } = useAppContext();

    return (
        <div className="min-h-screen flex flex-col transition-colors duration-300 relative bg-gray-50/50 dark:bg-darkBg">
            <Header />

            <main className="flex-1 container mx-auto px-4 py-8 relative z-20">
                {activeView === 'shop' && <ShopView />}
                {activeView === 'article' && <ArticleView />}
                {activeView === 'product' && <ProductView />}
                {activeView === 'checkout' && <CheckoutView />}
                {activeView === 'profile' && <ProfileView />}
                {activeView === 'success' && <SuccessView />}
            </main>
            
            <Footer />
            <CookieBanner />
            <SupportChat />
            <AuthModal />
        </div>
    );
};

const App = () => {
    return (
        <AuthProvider>
            <ChatProvider>
                <CartProvider>
                    <AppProvider>
                        <AppContent />
                    </AppProvider>
                </CartProvider>
            </ChatProvider>
        </AuthProvider>
    );
};

export default App;
