import re
import json

with open('app.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

food_items = [
    {'name': 'Pocky Matcha Green Tea', 'price': 60, 'cat': 'Печиво', 'nav': 'Снеки', 'brand': 'Glico', 'country': 'Японія', 'vol': '40 г', 'cal': '180 ккал', 'desc': 'Культові японські палички Pocky, вкриті преміальним шоколадом з додаванням справжнього чаю матча.'},
    {'name': 'Takis Fuego', 'price': 150, 'cat': 'Чіпси', 'nav': 'Снеки', 'brand': 'Barcel', 'country': 'Мексика', 'vol': '92 г', 'cal': '480 ккал', 'desc': 'Екстремально гострі кукурудзяні чіпси у формі трубочок зі смаком вогняного чилі та лайма.'},
    {'name': 'KitKat Ruby Chocolate', 'price': 120, 'cat': 'Шоколадні батончики', 'nav': 'Шоколад', 'brand': 'Nestle', 'country': 'Японія', 'vol': '50 г', 'cal': '250 ккал', 'desc': 'Унікальний рожевий шоколад Ruby з ягідними нотками та хрусткими вафлями.'},
    {'name': 'Reese\'s Peanut Butter Cups', 'price': 80, 'cat': 'Цукерки', 'nav': 'Шоколад', 'brand': 'Hershey', 'country': 'США', 'vol': '42 г', 'cal': '210 ккал', 'desc': 'Класичні американські кошики з ніжного молочного шоколаду з начинкою з солонуватої арахісової пасти.'},
    {'name': 'Mochi Taro', 'price': 95, 'cat': 'Моті', 'nav': 'Солодощі', 'brand': 'Taiwan Dessert', 'country': 'Тайвань', 'vol': '120 г', 'cal': '320 ккал', 'desc': 'Ніжні і тягучі тістечка моті з традиційною азіатською начинкою з солодкого таро.'},
    {'name': 'Doritos Nacho Cheese American', 'price': 130, 'cat': 'Чіпси', 'nav': 'Снеки', 'brand': 'Frito-Lay', 'country': 'США', 'vol': '110 г', 'cal': '550 ккал', 'desc': 'Оригінальні американські Doritos з мега-насиченим сирним смаком.'},
    {'name': 'Cheetos Flamin Hot', 'price': 140, 'cat': 'Снеки', 'nav': 'Снеки', 'brand': 'Frito-Lay', 'country': 'США', 'vol': '99 г', 'cal': '500 ккал', 'desc': 'Кукурудзяні палички з вогняно-гострим сирним смаком, які залишають на пальцях червоний пил.'},
    {'name': 'Milka Oreo White', 'price': 90, 'cat': 'Плитки шоколаду', 'nav': 'Шоколад', 'brand': 'Mondelez', 'country': 'Німеччина', 'vol': '100 г', 'cal': '540 ккал', 'desc': 'Ніжний білий альпійський шоколад з великою кількістю хрустких шматочків печива Oreo.'},
    {'name': 'Oreo Red Velvet', 'price': 110, 'cat': 'Печиво', 'nav': 'Снеки', 'brand': 'Nabisco', 'country': 'США', 'vol': '137 г', 'cal': '480 ккал', 'desc': 'Лімітована серія Oreo зі смаком знаменитого торта Червоний оксамит та кремом з крем-сиру.'},
    {'name': 'Pop-Tarts Smores', 'price': 250, 'cat': 'Печиво', 'nav': 'Снеки', 'brand': 'Kellogg\'s', 'country': 'США', 'vol': '384 г', 'cal': '1600 ккал', 'desc': 'Традиційне американське печиво для тостера з начинкою з маршмеллоу та шоколаду.'},
    {'name': 'Haribo Goldbears Sour', 'price': 70, 'cat': 'Жувальні цукерки', 'nav': 'Солодощі', 'brand': 'Haribo', 'country': 'Німеччина', 'vol': '100 г', 'cal': '340 ккал', 'desc': 'Знамениті золоті ведмедики Харібо, але тепер у надзвичайно кислій посипці!'},
    {'name': 'Skittles Tropical', 'price': 50, 'cat': 'Жувальні цукерки', 'nav': 'Солодощі', 'brand': 'Mars', 'country': 'США', 'vol': '61 г', 'cal': '240 ккал', 'desc': 'Тропічний мікс популярних цукерок: банан-ягода, ківі-лайм, манго-танжело, ананас-маракуйя.'},
    {'name': 'Hubba Bubba Bubble Tape', 'price': 85, 'cat': 'Жувальна гумка', 'nav': 'Жуйки', 'brand': 'Wrigley', 'country': 'США', 'vol': '56 г', 'cal': '150 ккал', 'desc': 'Гігантська жуйка-стрічка довжиною майже 2 метри зі смаком класичної солодкої полуниці.'},
    {'name': 'Trident Splash', 'price': 45, 'cat': 'Жувальна гумка', 'nav': 'Жуйки', 'brand': 'Mondelez', 'country': 'США', 'vol': '20 г', 'cal': '40 ккал', 'desc': 'Жуйка без цукру з рідкою освіжаючою начинкою всередині. Довго зберігає смак.'},
    {'name': 'Mystery Snack Box', 'price': 650, 'cat': 'Бокси', 'nav': 'Подарункові бокси ✨', 'brand': 'Choco Yummy', 'country': 'Мікс', 'vol': '1.5 кг', 'cal': '0 ккал', 'desc': 'Сюрприз-бокс із 15 різноманітними солодощами та напоями з усього світу. Ідеально на подарунок!'},
    {'name': 'Asian Treat Box', 'price': 800, 'cat': 'Бокси', 'nav': 'Подарункові бокси ✨', 'brand': 'Choco Yummy', 'country': 'Азія', 'vol': '1.2 кг', 'cal': '0 ккал', 'desc': 'Спеціальний бокс, який містить виключно найкращі смаколики з Японії, Кореї та Тайваню.'},
    {'name': 'Pocky Strawberry', 'price': 60, 'cat': 'Печиво', 'nav': 'Снеки', 'brand': 'Glico', 'country': 'Японія', 'vol': '40 г', 'cal': '180 ккал', 'desc': 'Класичні японські бісквітні палички у рожевій полуничній глазурі.'},
    {'name': 'KitKat Sake', 'price': 150, 'cat': 'Шоколадні батончики', 'nav': 'Шоколад', 'brand': 'Nestle', 'country': 'Японія', 'vol': '60 г', 'cal': '280 ккал', 'desc': 'Тільки в Японії! Ексклюзивний білий шоколад зі справжнім порошком японського саке.'},
    {'name': 'Nerds Rope Rainbow', 'price': 55, 'cat': 'Жувальні цукерки', 'nav': 'Солодощі', 'brand': 'Ferrara Candy', 'country': 'США', 'vol': '26 г', 'cal': '90 ккал', 'desc': 'Довга жувальна мармеладка, повністю вкрита дрібними хрусткими та кисленькими цукерками Nerds.'},
    {'name': 'Warheads Extreme Sour', 'price': 90, 'cat': 'Льодяники', 'nav': 'Солодощі', 'brand': 'Impact Confections', 'country': 'США', 'vol': '28 г', 'cal': '100 ккал', 'desc': 'Найкисліші цукерки у світі! Витримаєте перші 30 секунд кислоти, щоб дістатися солодкого центру?'},
    {'name': 'Pringles Pizza', 'price': 120, 'cat': 'Чіпси', 'nav': 'Снеки', 'brand': 'Kellogg\'s', 'country': 'США', 'vol': '158 г', 'cal': '800 ккал', 'desc': 'Знамениті чіпси в тубусі зі смаком справжньої італійської піци з сиром та пепероні.'},
    {'name': 'Hershey\'s Cookies n Creme', 'price': 75, 'cat': 'Плитки шоколаду', 'nav': 'Шоколад', 'brand': 'Hershey', 'country': 'США', 'vol': '43 г', 'cal': '220 ккал', 'desc': 'Культова плитка з ніжного білого шоколаду з хрусткими шматочками шоколадного печива.'},
    {'name': 'Jelly Belly Bean Boozled', 'price': 180, 'cat': 'Жувальні цукерки', 'nav': 'Солодощі', 'brand': 'Jelly Belly', 'country': 'США', 'vol': '45 г', 'cal': '160 ккал', 'desc': 'Рулетка смаків! Кожен колір може бути як смачним (персик), так і жахливим (блювота). Грайте з друзями!'},
    {'name': 'Toxic Waste Sour Candy', 'price': 110, 'cat': 'Льодяники', 'nav': 'Солодощі', 'brand': 'Candy Dynamics', 'country': 'США', 'vol': '42 г', 'cal': '150 ккал', 'desc': 'Ультра-кислі льодяники, запаковані у мініатюрну жовту бочку для токсичних відходів.'},
    {'name': 'Nutella B-ready', 'price': 140, 'cat': 'Печиво', 'nav': 'Снеки', 'brand': 'Ferrero', 'country': 'Італія', 'vol': '132 г', 'cal': '650 ккал', 'desc': 'Хрусткий вафельний батончик у формі багета, щедро наповнений оригінальною пастою Nutella.'}
]

def insert_nav(match):
    m = match.group(0)
    # add navCategory if missing
    if "navCategory" not in m:
        return m.replace("category:", "navCategory: \"Напої\", category:")
    return m

# Add navCategory: 'Напої' to existing
new_content = re.sub(r'\{[^}]+category:\s*"[^"]+"[^}]+\}', insert_nav, content)

end_idx = new_content.find('];\n\nconst categories')
if end_idx != -1:
    js_items = []
    for i, item in enumerate(food_items):
        js = f"""    {{ 
        id: {26 + i}, name: "{item['name']}", price: {item['price']}, image: "images/ramune.png", navCategory: "{item['nav']}", category: "{item['cat']}",
        details: {{ brand: "{item['brand']}", country: "{item['country']}", volume: "{item['vol']}", calories: "{item['cal']}", description: "{item['desc']}" }}
    }},"""
        js_items.append(js)
    
    products_str = '\n'.join(js_items) + '\n'
    new_content = new_content[:end_idx] + products_str + new_content[end_idx:]

with open('app_new.jsx', 'w', encoding='utf-8') as f:
    f.write(new_content)
