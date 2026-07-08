import React from 'react';
import { DeliveryText } from '../data/pages/delivery';
import { FAQPage } from '../data/pages/faq';
import { OfferPage } from '../data/pages/offer';
import { PrivacyPage } from '../data/pages/privacy';
import { ReturnsPage } from '../data/pages/returns';
import { AboutPage } from '../data/pages/about';

export const promotions = [
    { 
        id: 1, 
        title: "Тропічний вибух Chupa Chups", 
        image: "/images/banner_chupachups_new.jpg", 
        tag: "АКЦІЯ",
        content: "Відчуй смак сонячного літа з неймовірною серією газованих напоїв Chupa Chups! Справжні соковиті манго, апельсин та виноград в улюбленому форматі. Спеціальна пропозиція: купуй солодкі напої Chupa Chups за суперціною!",
        featuredProducts: [4, 5, 6, 9],
        btnText: "Скуштувати Chupa Chups"
    },
    { 
        id: 3, 
        title: "Американська класика Dr Pepper та Fanta", 
        image: "/images/banner_drpepper_fanta_new.jpg", 
        tag: "ЕКСКЛЮЗИВ",
        content: "Справжні Dr Pepper Strawberries & Cream та класична американська Fanta Orange вже на складі Жуйки! Особливі рецептури з насиченим смаком прямо з США. Зберіть свій унікальний набір улюблених американських напоїв.",
        featuredProducts: [49, 47, 30, 12],
        btnText: "Обрати класику"
    },
    { 
        id: 4, 
        title: "Азіатський хрускіт: Lay's та міні-краби", 
        image: "/images/banner_asian_new.jpg", 
        tag: "ЕКЗОТИКА",
        content: "Справжній гастрономічний вибух прямо з Азії! Спробуйте унікальні смаки китайських чіпсів Lay's Big Wave (Свиняча грудинка, Смажений краб, Свіжий огірок) та екзотичних сушених міні-крабиків Seafood Spicy Baby Crab. Такого ви більше ніде не спробуєте!",
        featuredProducts: [143, 145, 149, 150],
        btnText: "Скуштувати екзотику"
    },
    {
        id: 11,
        title: "Шалені знижки на Monster Energy",
        image: "/images/banner_monster_new.jpg", 
        tag: "ГАРЯЧЕ",
        content: "Вибухова добірка Monster Energy для справжніх фанатів! Monster Ultra White без цукру, тропічний Mango Loco та лімітований The Doctor - заряджайтеся на максимум. Тільки цього тижня діють спеціальні знижені ціни!",
        featuredProducts: [26, 20, 21, 22],
        btnText: "Всі енергетики"
    },
    {
        id: 5,
        title: "Доставка та оплата",
        image: "/images/banner_delivery.png",
        tag: "ІНФОРМАЦІЯ",
        content: DeliveryText,
        featuredProducts: [],
        btnText: ""
    },
    {
        id: 6,
        title: "Питання-відповідь",
        image: "https://images.unsplash.com/photo-1516383740770-fbcc5ccbece0?w=800&q=80",
        tag: "ДОПОМОГА",
        content: <FAQPage />,
        featuredProducts: [],
        btnText: ""
    },
    {
        id: 7,
        title: "Договір публічної оферти",
        image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80",
        tag: "ДОКУМЕНТ",
        content: <OfferPage />,
        featuredProducts: [],
        btnText: ""
    },
    {
        id: 8,
        title: "Політика конфіденційності",
        image: "https://images.unsplash.com/photo-1508385082359-f38ae991e8f2?w=800&q=80",
        tag: "ДОКУМЕНТ",
        content: <PrivacyPage />,
        featuredProducts: [],
        btnText: ""
    },
    {
        id: 9,
        title: "Умови повернення",
        image: "/images/banner_returns.png",
        tag: "ІНФОРМАЦІЯ",
        content: <ReturnsPage />,
        featuredProducts: [],
        btnText: ""
    },
    {
        id: 10,
        title: "Про нас",
        image: "/images/banner_about.png",
        tag: "ІНФОРМАЦІЯ",
        content: <AboutPage />,
        featuredProducts: [],
        btnText: ""
    }
];
