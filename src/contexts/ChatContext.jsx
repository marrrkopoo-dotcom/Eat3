import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
    const { currentUser, setCurrentUser } = useAuth();
    
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatInput, setChatInput] = useState('');
    const [chatMessages, setChatMessages] = useState(() => {
        const saved = localStorage.getItem('supportChatMessages');
        return saved ? JSON.parse(saved) : [];
    });
    const [clientId] = useState(() => {
        let id = localStorage.getItem('supportClientId');
        if (!id) {
            id = `client-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            localStorage.setItem('supportClientId', id);
        }
        return id;
    });
    const [unreadChatCount, setUnreadChatCount] = useState(0);

    // Save messages to localStorage
    useEffect(() => {
        localStorage.setItem('supportChatMessages', JSON.stringify(chatMessages));
    }, [chatMessages]);

    // Track unread messages when chat is closed
    useEffect(() => {
        if (isChatOpen) {
            setUnreadChatCount(0);
        }
    }, [isChatOpen]);

    // Polling updates from Telegram bot (via Express server)
    useEffect(() => {
        const fetchUpdates = async () => {
            if (!clientId) return;
            try {
                const res = await fetch(`/api/chat-updates?clientId=${clientId}`);
                const data = await res.json();
                if (data.updates && data.updates.length > 0) {
                    setChatMessages(prev => {
                        const newMsgs = [...prev, ...data.updates];
                        if (!isChatOpen) {
                            setUnreadChatCount(c => c + data.updates.length);
                        }
                        return newMsgs;
                    });
                }
                if (data.orderUpdates && data.orderUpdates.length > 0) {
                    setCurrentUser(prevUser => {
                        if (!prevUser || !prevUser.orders) return prevUser;
                        
                        let updated = false;
                        const newOrders = prevUser.orders.map(order => {
                            const updateObj = data.orderUpdates.find(u => u.orderId === order.id);
                            if (updateObj) {
                                updated = true;
                                return {
                                    ...order,
                                    status: updateObj.status || order.status,
                                    customerName: updateObj.customerName || order.customerName,
                                    customerPhone: updateObj.customerPhone || order.customerPhone,
                                    city: updateObj.city || order.city,
                                    postOffice: updateObj.postOffice || order.postOffice
                                };
                            }
                            return order;
                        });
                        
                        if (updated) {
                            const updatedUser = { ...prevUser, orders: newOrders };
                            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
                            
                            // Also update this user in the 'users' list in localStorage
                            let users = JSON.parse(localStorage.getItem('users') || '[]');
                            const idx = users.findIndex(u => u.email === prevUser.email);
                            if (idx !== -1) {
                                users[idx] = updatedUser;
                                localStorage.setItem('users', JSON.stringify(users));
                            }
                            return updatedUser;
                        }
                        return prevUser;
                    });
                }
            } catch (err) {
                console.error('Error polling chat updates:', err);
            }
        };

        const interval = setInterval(fetchUpdates, 3500);
        return () => clearInterval(interval);
    }, [clientId, isChatOpen, setCurrentUser]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!chatInput.trim()) return;

        const isFirstMessage = chatMessages.filter(m => m.sender === 'client').length === 0;

        const clientMsg = {
            sender: 'client',
            text: chatInput,
            timestamp: new Date().toISOString()
        };

        setChatMessages(prev => [...prev, clientMsg]);
        const textToSend = chatInput;
        setChatInput('');

        if (isFirstMessage) {
            setTimeout(() => {
                setChatMessages(prev => [...prev, {
                    sender: 'support',
                    senderName: 'Жуйка Бот 🤖',
                    senderAvatar: 'https://images.unsplash.com/photo-1546776310-eef45dd6d63c?w=150&h=150&fit=crop',
                    text: 'Менеджер підключається... Зачекайте, будь ласка 💛',
                    timestamp: new Date().toISOString()
                }]);
            }, 1000);
        }

        try {
            await fetch('/api/send-message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    clientId,
                    message: textToSend,
                    clientName: currentUser ? currentUser.name : 'Гість'
                })
            });
        } catch (err) {
            console.error('Error sending message to support:', err);
            setChatMessages(prev => [
                ...prev,
                {
                    sender: 'support',
                    text: '⚠️ Помилка з\'єднання. Спробуйте надіслати повідомлення пізніше.',
                    timestamp: new Date().toISOString()
                }
            ]);
        }
    };

    return (
        <ChatContext.Provider value={{
            isChatOpen, setIsChatOpen,
            chatInput, setChatInput,
            chatMessages, setChatMessages,
            clientId, unreadChatCount, setUnreadChatCount,
            handleSendMessage
        }}>
            {children}
        </ChatContext.Provider>
    );
};
