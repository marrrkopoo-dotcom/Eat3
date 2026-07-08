import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { promotions } from '../../utils/promotions';
import { Link } from '../ui/Link';

export const Footer = () => {
    const { navigateTo } = useAppContext();

    return (
        <footer className="bg-black text-gray-300 pt-16 pb-8 mt-auto border-t border-gray-900 relative z-10">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    <div>
                        <div className="mb-4 flex items-center select-none">
                            <img src="images/logo.svg?v=8" alt="жуйка" className="h-12 w-auto object-contain block" />
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            Магазин солодощів та екзотичних напоїв з усього світу.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-4 uppercase tracking-wider text-sm">Контакти</h4>
                        <ul className="text-sm text-gray-400 space-y-3">
                            <li className="flex items-center gap-3">
                                <span className="text-lg">📞</span>
                                <a href="tel:+380779152365" className="hover:text-primary transition-colors font-medium">+38 (077) 915-23-65</a>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="text-lg">✉️</span>
                                <a href="mailto:shop@juyka.com" className="hover:text-primary transition-colors">shop@juyka.com</a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-4 uppercase tracking-wider text-sm">Інформація</h4>
                        <ul className="text-sm text-gray-400 space-y-3">
                            <li><Link view="article" article={promotions.find(p => p.id === 10)} className="hover:text-primary transition-colors">Про нас</Link></li>
                            <li><Link view="article" article={promotions.find(p => p.id === 5)} className="hover:text-primary transition-colors">Доставка та оплата</Link></li>
                            <li><Link view="article" article={promotions.find(p => p.id === 6)} className="hover:text-primary transition-colors">Питання-відповідь</Link></li>
                            <li><Link view="article" article={promotions.find(p => p.id === 7)} className="hover:text-primary transition-colors">Договір публічної оферти</Link></li>
                            <li><Link view="article" article={promotions.find(p => p.id === 8)} className="hover:text-primary transition-colors">Політика конфіденційності</Link></li>
                            <li><Link view="article" article={promotions.find(p => p.id === 9)} className="hover:text-primary transition-colors">Умови повернення</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-4 uppercase tracking-wider text-sm">Графік роботи</h4>
                        <ul className="text-sm text-gray-400 space-y-3 mb-6 bg-gray-900 p-4 rounded-xl border border-gray-800">
                            <li className="flex justify-between items-center"><span>Пн - Пт:</span> <span className="font-bold text-white">09:00 - 20:00</span></li>
                            <li className="flex justify-between items-center border-t border-gray-800 pt-2"><span>Сб - Нд:</span> <span className="font-bold text-white">10:00 - 18:00</span></li>
                        </ul>
                    </div>
                </div>
                <div className="text-center text-sm font-medium text-gray-500 pt-8 border-t border-gray-800 flex flex-col items-center gap-1">
                    <span>&copy; {new Date().getFullYear()} juyka.com. Всі права захищені.</span>
                    <span className="text-xs text-gray-600">ТОВ "СБИТ-ВОСТОК", 41899847</span>
                </div>
            </div>
        </footer>
    );
};
