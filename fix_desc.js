const fs = require('fs');

const jsonPath = 'C:\\Users\\User\\Downloads\\Eat\\src\\data\\products.json';
const data = fs.readFileSync(jsonPath, 'utf8');
const products = JSON.parse(data);

const phrases = {
    "Енергетики": " Заряджайся енергією на весь день! Замовляй зараз та відчуй драйв.",
    "Газовані напої": " Освіжаючий смак, який варто спробувати. Додай у кошик та насолоджуйся!",
    "Азіатські напої": " Відкрий для себе справжній смак Азії. Спробуй щось нове та екзотичне!",
    "Соки зі шматочками": " Натуральний смак зі шматочками фруктів. Смакуй з користю!",
    "Снеки": " Ідеальний перекус для будь-якої ситуації. Хрумкай із задоволенням!",
    "Шоколад": " Справжня насолода для любителів солоденького. Подаруй собі мить щастя!",
    "Солодощі": " Найкращий вибір для справжніх ласунів. Скуштуй та переконайся!",
    "Жуйки": " Довготривалий смак та свіжість на кожен день. Обирай улюблений аромат!",
    "Подарункові бокси ✨": " Ідеальний подарунок для близьких. Здивуй їх цим неймовірним боксом!"
};
const defaultPhrase = " Чудовий вибір, який точно вам сподобається. Замовляйте прямо зараз!";

products.forEach(p => {
    if (p.details && p.details.description && p.details.description.endsWith('..')) {
        let desc = p.details.description.replace(/\.\.$/, '');
        // Remove the last incomplete sentence. We match anything after the last period, exclamation or question mark.
        desc = desc.replace(/[^.!?]+$/, '');
        
        const phrase = phrases[p.category] || defaultPhrase;
        p.details.description = desc + phrase;
    }
});

fs.writeFileSync(jsonPath, JSON.stringify(products, null, 4), 'utf8');
console.log('Descriptions fixed.');
