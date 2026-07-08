import React, { useRef, useEffect } from 'react';
import { useChat } from '../../contexts/ChatContext';
import { getAvatarSvg } from '../../utils/helpers';

export const SupportChat = () => {
    const { 
        isChatOpen, setIsChatOpen,
        chatInput, setChatInput,
        chatMessages,
        unreadChatCount,
        handleSendMessage
    } = useChat();

    // Scroll chat to bottom helper
    const chatEndRef = useRef(null);
    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chatMessages, isChatOpen]);

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            {isChatOpen && (
                <div className="w-80 sm:w-96 h-[450px] bg-white dark:bg-darkCard rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden mb-4 animate-in slide-in-from-bottom-8 duration-300">
                    {/* Header */}
                    <div className="gradient-bg px-5 py-4 text-white flex justify-between items-center shadow-sm">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-lg font-bold">💬</div>
                            <div>
                                <h3 className="font-extrabold text-sm leading-none">Підтримка Жуйки</h3>
                                <span className="text-[10px] text-white/80 font-medium mt-0.5 block">Менеджер онлайн</span>
                            </div>
                        </div>
                        <button onClick={() => setIsChatOpen(false)} className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors font-bold text-lg">&times;</button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900/50">
                        {chatMessages.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-400">
                                <span className="text-4xl mb-2">👋</span>
                                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Привіт! Маєте запитання?</p>
                                <p className="text-xs text-gray-400 mt-1">Напишіть нам тут, і ми відповімо вам прямо в цей чат!</p>
                            </div>
                        ) : (
                            chatMessages.map((msg, index) => (
                                <div key={index} className={`flex gap-2 ${msg.sender === 'client' ? 'justify-end' : 'justify-start'}`}>
                                    {msg.sender === 'support' && (
                                        <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden self-end mb-1 border border-gray-200 dark:border-gray-700 flex-shrink-0">
                                            {getAvatarSvg(msg.senderName || 'Підтримка')}
                                        </div>
                                    )}
                                    <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm ${
                                        msg.sender === 'client' 
                                            ? 'bg-primary text-white rounded-br-none shadow-sm' 
                                            : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-700 rounded-bl-none shadow-sm'
                                    }`}>
                                        {msg.sender === 'support' && (
                                            <span className="text-[10px] font-black block text-primary mb-0.5">
                                                {msg.senderName || 'Підтримка'}
                                            </span>
                                        )}
                                        <p className="leading-relaxed break-words">{msg.text}</p>
                                        <span className={`text-[9px] block text-right mt-1 ${msg.sender === 'client' ? 'text-white/70' : 'text-gray-400'}`}>
                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSendMessage} className="p-3 bg-white dark:bg-darkCard border-t border-gray-100 dark:border-gray-800 flex gap-2">
                        <input
                            type="text"
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            placeholder="Напишіть повідомлення..."
                            className="flex-1 bg-gray-50 dark:bg-gray-800 text-sm text-dark dark:text-white px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        />
                        <button type="submit" className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center hover:bg-primary/95 transition-all shadow-md active:scale-95">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 transform rotate-90">
                                <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                            </svg>
                        </button>
                    </form>
                </div>
            )}

            {/* Floating Action Button */}
            <button
                onClick={() => setIsChatOpen(!isChatOpen)}
                className="w-14 h-14 rounded-full gradient-bg text-white shadow-2xl flex items-center justify-center hover:scale-105 transition-all active:scale-95 relative group border-2 border-white dark:border-gray-800"
            >
                {isChatOpen ? (
                    <span className="text-2xl font-bold">&times;</span>
                ) : (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.278.187 2.222 1.282 2.222 2.571v9.753c0 1.29-.943 2.384-2.222 2.57-1.08.157-2.193.26-3.324.307L12 22.25v-4.125a49.123 49.123 0 0 1-7.152-.52C3.57 17.418 2.625 16.324 2.625 15.035V5.342c0-1.29.943-2.384 2.222-2.572Z" clipRule="evenodd" />
                        </svg>
                        {unreadChatCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                                {unreadChatCount}
                            </span>
                        )}
                    </>
                )}
            </button>
        </div>
    );
};
