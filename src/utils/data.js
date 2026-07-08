import productsData from '../data/products.json';

export const categoryImages = {
    "Газовані напої": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80",
    "Азіатські напої": "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&q=80",
    "Соки зі шматочками": "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&q=80",
    "Енергетики": "https://images.unsplash.com/photo-1604152135912-04a022e23696?w=400&q=80",
    "Снеки": "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&q=80",
    "Шоколад": "https://images.unsplash.com/photo-1548831772-2bb8b6680a13?w=400&q=80",
};

export const allProducts = productsData.filter(p => !!p.localImage || !!p.image).map(p => ({ ...p, _rand: Math.random() }));

allProducts.forEach((p, index) => {
    // Add a small seed to Unsplash URL to get slight variations within the same category if possible, or just use the category image
    if (p.image.startsWith('images/')) {
        p.image = categoryImages[p.category] || categoryImages["Снеки"];
    } else if (p.image.startsWith('enc-')) {
        p.image = `/images/cache/${encodeURIComponent(p.image)}`;
    }
});

export const categories = ["Всі", "Напої", "Снеки", "Шоколад", "Печиво та вафлі", "Акції"];
export const navItems = ["Всі", "Напої", "Снеки", "Шоколад", "Печиво та вафлі", "Акції"];

export const dummyUser = {
    name: "Олександр Петренко",
    phone: "+38 (099) 123-45-67",
    email: "oleksandr.p@example.com",
    address: "м. Київ",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    bonuses: 350
};

export const dummyOrders = [
    {
        id: "CY-84729",
        date: "17 Червня 2026, 14:30",
        status: "in_transit",
        total: 1250,
        items: [
            { name: "Kinder Chocolate", quantity: 2 },
            { name: "Coca Cola Zero", quantity: 1 }
        ]
    },
    {
        id: "CY-83102",
        date: "10 Червня 2026, 18:15",
        status: "delivered",
        total: 840,
        items: [
            { name: "Fanta Orange", quantity: 3 },
            { name: "Milka Oreo", quantity: 2 }
        ]
    },
    {
        id: "CY-79044",
        date: "02 Травня 2026, 09:45",
        status: "delivered",
        total: 2100,
        items: [
            { name: "Red Bull Energy", quantity: 4 },
            { name: "Nutella 400g", quantity: 1 },
            { name: "Kinder Bueno", quantity: 5 }
        ]
    }
];
