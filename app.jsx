const { useState, useEffect, useMemo, useRef } = React;

const allProducts = [{"id":1,"name":"Енергетик Red Bull Krating Daeng Vitamin 800 Energy Drink Thai 145мл","details":{"calories":"N/A","brand":"Choco Yummy","description":"Той самий Krating Daeng, з якого все почалося — оригінальний Red Bull із Таїланду!Енергетик у скляні..","volume":"N/A","country":"Імпорт"},"price":179,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Raznie/energetik-red-bull-krating-daeng-vitamin-800-thai-145ml-1-495x495.webp","category":"Енергетики"},{"id":2,"name":"Енергетик Monster Energy Reserve Peaches N Creme 473мл","details":{"calories":"N/A","brand":"Choco Yummy","description":"Персик і вершки... ммм, звучить ніжно і мега-смачно) За фактом, це яскравий і зухвалий Monster Energ..","volume":"N/A","country":"Імпорт"},"price":399,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Raznie/energetik-monster-energy-reserve-peaches-n-creme-473ml-6-495x495.webp","category":"Енергетики"},{"id":3,"name":"Картридж для напоїв Cirkul Puressence Cartridge Peach Персик 1шт","details":{"calories":"N/A","brand":"Choco Yummy","description":"Додайте своїй воді ніжного фруктового смаку. Cirkul Puressence Peach - це картридж, який перетворює ..","volume":"N/A","country":"Імпорт"},"price":99,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Raznie/kartridzh-cirkul-puressence-peach-495x495.webp","category":"Газовані напої"},{"id":4,"name":"Chupa Chups газировка Манго 345мл","details":{"calories":"N/A","brand":"Choco Yummy","description":"Новинки Chupa Chups завжди яскраві, смачні та незвичайні!Так що зустрічайте газовану воду зі смаком ..","volume":"N/A","country":"Імпорт"},"price":99,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Gazirovki/chupa-chups-mango-345ml-495x495.webp","category":"Солодощі"},{"id":5,"name":"Chupa Chups газована вода Апельсин 345мл","details":{"calories":"N/A","brand":"Choco Yummy","description":"Новинки Chupa Chups завжди яскраві, смачні та незвичайні!Так що зустрічайте газування зі смаком соло..","volume":"N/A","country":"Імпорт"},"price":79,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Gazirovki/chupa-chups-sparkling-orange-495x495.webp","category":"Солодощі"},{"id":6,"name":"Chupa Chups газована вода Виноград 345мл","details":{"calories":"N/A","brand":"Choco Yummy","description":"Новинки Chupa Chups завжди яскраві, смачні та незвичайні!Так що зустрічайте газування зі смаком соло..","volume":"N/A","country":"Імпорт"},"price":99,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Gazirovki/chupa-chups-sparkling-grape-495x495.webp","category":"Солодощі"},{"id":7,"name":"Chupa Chups газована вода Вишнева Гумка 345мл","details":{"calories":"N/A","brand":"Choco Yummy","description":"Новинки Chupa Chups завжди яскраві, смачні та незвичайні!Так що зустрічайте напій зі смаком солодкої..","volume":"N/A","country":"Імпорт"},"price":99,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Gazirovki/chupa-chups-sparkling-cherry-bubble-gum-495x495.webp","category":"Солодощі"},{"id":8,"name":"Chupa Chups газована вода Кавун 345мл","details":{"calories":"N/A","brand":"Choco Yummy","description":"Новинки Chupa Chups завжди яскраві, смачні та незвичайні!Так що зустрічайте напій зі смаком солодког..","volume":"N/A","country":"Імпорт"},"price":99,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Gazirovki/chupa-chups-sparkling-watermelon-495x495.webp","category":"Солодощі"},{"id":9,"name":"Chupa Chups газована вода Кисла Чорниця 345мл","details":{"calories":"N/A","brand":"Choco Yummy","description":"Новинки Chupa Chups завжди яскраві, смачні та незвичайні!Так що зустрічайте газування зі смаком кисл..","volume":"N/A","country":"Імпорт"},"price":79,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Gazirovki/chupa-chups-sour-blueberry-345-495x495.webp","category":"Солодощі"},{"id":10,"name":"Chupa Chups газована вода Кисле Яблуко 345мл","details":{"calories":"N/A","brand":"Choco Yummy","description":"Новинки Chupa Chups завжди яскраві, смачні та незвичайні!Так що зустрічайте газування зі смаком кисл..","volume":"N/A","country":"Імпорт"},"price":79,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Gazirovki/chupa-chups-sparkling-sour-apple-495x495.webp","category":"Солодощі"},{"id":11,"name":"Chupa Chups газована вода Кремова диня 250мл","details":{"calories":"N/A","brand":"Choco Yummy","description":"Новинки Chupa Chups завжди яскраві, смачні та незвичайні!Так що зустрічайте газування зі смаком вані..","volume":"N/A","country":"Імпорт"},"price":59,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Gazirovki/napij-chupa-chups-melon-cream-495x495.webp","category":"Солодощі"},{"id":12,"name":"Coca-Cola Ваніль","details":{"calories":"N/A","brand":"Choco Yummy","description":"Да-Да-Да, «Вона ж в Атб є»!) ⠀Всі вже напевно бачили на прилавках супермаркетів колу ваніль без..","volume":"N/A","country":"Імпорт"},"price":69,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Gazirovki/coca-cola-vanilla-1-495x495.webp","category":"Газовані напої"},{"id":13,"name":"Fanta Ананас","details":{"calories":"N/A","brand":"Choco Yummy","description":"Нова, стильна, яскрава Fanta Ананас в нашому магазині!) Таку ви точно ще не зустрічали! На..","volume":"N/A","country":"Імпорт"},"price":99,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Gazirovki/fanta-pineapple-495x495.webp","category":"Газовані напої"},{"id":14,"name":"Fanta Екзотик","details":{"calories":"N/A","brand":"Choco Yummy","description":"Ще одна крутєйша Фанта! ⠀FANTA EXZOTIC – улюблена газована вода з оригінальним освіжаючим міксо..","volume":"N/A","country":"Імпорт"},"price":69,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Gazirovki/fanta-exotic.-495x495.webp","category":"Газовані напої"},{"id":15,"name":"Fanta Лимон","details":{"calories":"N/A","brand":"Choco Yummy","description":"Гадали Фанта більше нічим не зможе нас здивувати?Як би не так! Адже в лінійці різноманітних смаків з..","volume":"N/A","country":"Імпорт"},"price":59,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Gazirovki/fanta-lemon-495x495.webp","category":"Газовані напої"},{"id":16,"name":"Fanta Полуниця","details":{"calories":"N/A","brand":"Choco Yummy","description":"Стильна і яскрава Fanta Полуниця вже в нашому магазині! Завдяки високій якості цей напій завоюв..","volume":"N/A","country":"Імпорт"},"price":99,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Gazirovki/fanta-strawberry0-495x495.webp","category":"Газовані напої"},{"id":17,"name":"Fanta Полуниця Ківі","details":{"calories":"N/A","brand":"Choco Yummy","description":"Новий смак Fanta Полуниця і Ківі - розширює наш асортимент крутейшого бренду Fanta!)  Ця г..","volume":"N/A","country":"Імпорт"},"price":59,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Gazirovki/fanta-strawberry-kiwi-495x495.webp","category":"Газовані напої"},{"id":18,"name":"Monster Java Salted Caramel USA","details":{"calories":"N/A","brand":"Choco Yummy","description":"Занадто круто, щоб утриматися!) ⠀Monster Energy Java Edition – це абсолютно нова унікальна амер..","volume":"N/A","country":"Імпорт"},"price":399,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Raznie/monster-java-salted-caramel-495x495.webp","category":"Енергетики"},{"id":19,"name":"Monster Juice Khaotic","details":{"calories":"N/A","brand":"Choco Yummy","description":"Суміш тропічного апельсинового соку для створення смаку, що краще відчувається, ніж описується.Поєдн..","volume":"N/A","country":"Імпорт"},"price":99,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Gazirovki/monster-juice-khaotic-495x495.webp","category":"Енергетики"},{"id":20,"name":"Monster Mango Loco 500мл","details":{"calories":"N/A","brand":"Choco Yummy","description":"Скучили за MONSTER?)  ⠀ MONSTER ENERGY MANGO LOCO – це та сама, небесна суміш екзотичних соків,..","volume":"N/A","country":"Імпорт"},"price":99,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Raznie/monster-mango-loco-495x495.webp","category":"Енергетики"},{"id":21,"name":"Monster Pipeline Punch 500мл","details":{"calories":"N/A","brand":"Choco Yummy","description":"Величезний вибір монстрів у наявності! ⠀Перенесіться на Гаваї наповнивши себе енергією Монстр!)..","volume":"N/A","country":"Імпорт"},"price":99,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Raznie/monster-pipeline-punch-495x495.webp","category":"Енергетики"},{"id":22,"name":"Monster The Doctor 500мл","details":{"calories":"N/A","brand":"Choco Yummy","description":"Лімітована версія MONSTER! Monster Energy The Doctor – це відомий енергетичний напій, з нестанд..","volume":"N/A","country":"Імпорт"},"price":129,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Raznie/monster-energy-the-doctor-495x495.webp","category":"Енергетики"},{"id":23,"name":"Monster Ultra Fiesta","details":{"calories":"N/A","brand":"Choco Yummy","description":"Найпопулярніший енергетик, який вже обов\u0027язково спробували усі геймери, а деякі зібрали колекцію яск..","volume":"N/A","country":"Імпорт"},"price":99,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Raznie/monster-ultra-fiesta-mango-495x495.webp","category":"Енергетики"},{"id":24,"name":"Monster Ultra Paradise 500мл","details":{"calories":"N/A","brand":"Choco Yummy","description":"А тепер, власне, ловіть обновку, заради якої писався цей піст!)⠀MONSTER ENERGY ULTRA PARADISE – чист..","volume":"N/A","country":"Імпорт"},"price":99,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Raznie/monster-ultra-paradise-495x495.webp","category":"Енергетики"},{"id":25,"name":"Monster Ultra Watermelon","details":{"calories":"N/A","brand":"Choco Yummy","description":"Monster Ultra WATERMELON – легендарний енергетичний напій зі смаком соковитого та стиглого кавуна, я..","volume":"N/A","country":"Імпорт"},"price":149,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Gazirovki/monster-ultra-watermelon-495x495.webp","category":"Енергетики"},{"id":26,"name":"Monster Ultra White 500мл","details":{"calories":"N/A","brand":"Choco Yummy","description":"MONSTER без ЦУКРУ! Monster Energy Ultra White – це дієтичний енергетичний напій без цукру! ..","volume":"N/A","country":"Імпорт"},"price":129,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Raznie/monster-energy-ultra-white-495x495.jpg","category":"Енергетики"},{"id":27,"name":"Prime Arsenal Hydration Drink Arsenal 500мл","details":{"calories":"N/A","brand":"Choco Yummy","description":"Prime Hydration Arsenal - лімітована версія напою для фанатів футболу!У складі:Амінокислоти, вітамін..","volume":"N/A","country":"Імпорт"},"price":379,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Raznie/napitok-prime-arsenal-hydration-drink-500ml-2-495x495.jpg","category":"Енергетики"},{"id":28,"name":"Адвент календар з віскі 20х50 мл + 4 чарки Jack Daniel\u0027s Tennessee Whiskey 24-Day Advent Calendar Gift 2023","details":{"calories":"N/A","brand":"Choco Yummy","description":"Прибуло! Ви так багато запитували про адвенти з алкоголем, ми поспішаємо з усіх ніг)Ловіть, розкішни..","volume":"N/A","country":"Імпорт"},"price":9999,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Drugoe/jack_daniel_s_tennessee_whiskey_24_day_advent_calendar_gift_1-495x495.jpg","category":"Газовані напої"},{"id":29,"name":"Вода Monster Tour Water Deep Well Питна 473мл","details":{"calories":"N/A","brand":"Choco Yummy","description":"Monster Tour Water Deep Well - у цій баночці немає кофеїну, цукру або інших добавок. Немає калорій. ..","volume":"N/A","country":"Імпорт"},"price":399,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Raznie/voda_monster_tour_water_470ml_4-495x495.jpg","category":"Енергетики"},{"id":30,"name":"Газировка Fanta Orange USA Апельсин 355мл","details":{"calories":"N/A","brand":"Choco Yummy","description":"Справжня американська Фанта. Весела газована вода з насиченим апельсиновим смаком іскриться бульбашк..","volume":"N/A","country":"Імпорт"},"price":99,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Gazirovki/gazirovka-fanta-orange-usa-355ml-2-495x495.jpg","category":"Газовані напої"},{"id":31,"name":"Газировка Fanta Tutti-frutti Zero Sugar Тутти Фрутти Без сахара 250мл","details":{"calories":"N/A","brand":"Choco Yummy","description":"ФАНТАстична!Газована вода легка, освіжаюча, іскриться бульбашками та веселощами)..","volume":"N/A","country":"Імпорт"},"price":99,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Gazirovki/gazirovka-fanta-tutti-frutti-zero-sugar-250ml-2-495x495.jpg","category":"Газовані напої"},{"id":32,"name":"Газировка Китайська Fanta White Peach Jasmine China Білий Персик Жасмин 330мл","details":{"calories":"N/A","brand":"Choco Yummy","description":"Китайська Fanta White Peach Jasmine - справжній ексклюзив для колекціонерів незвичайних газованих на..","volume":"N/A","country":"Імпорт"},"price":149,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Gazirovki/gazirovka-fanta-white-peach-jasmine-china-330ml-1-495x495.jpg","category":"Газовані напої"},{"id":33,"name":"Газована вода 7-Up Tropical No Caffeine 355мл","details":{"calories":"N/A","brand":"Choco Yummy","description":"7-Up Tropical - газована вода із сонячним настроєм. Додасть позитиву навіть у найпохмуріший день!Нап..","volume":"N/A","country":"Імпорт"},"price":99,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Gazirovki/gazirovka-7-tropical-no-caffeine-355ml-2-495x495.jpg","category":"Газовані напої"},{"id":34,"name":"Газована вода A\u0026W Cream Soda No Caffeine 355мл","details":{"calories":"N/A","brand":"Choco Yummy","description":"Газировка A\u0026W Cream Soda - американська класика, популярність якої вже більше століття!Кремова г..","volume":"N/A","country":"Імпорт"},"price":99,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Gazirovki/gazirovka-aw-cream-soda-no-caffeine-355ml-3-495x495.jpg","category":"Газовані напої"},{"id":35,"name":"Газована вода Arizona Cherry Lime Rickey Вишня і Лайм 500 мл","details":{"calories":"N/A","brand":"Choco Yummy","description":"Культовая Arizona объема XXL прямиком из Бруклина!Размер банки впечатляющий - хватит и друзьям. Вы п..","volume":"N/A","country":"Імпорт"},"price":189,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Gazirovki/gazirovka-arizona-cherry-lime-rickey-650ml-4-495x495.jpg","category":"Газовані напої"},{"id":36,"name":"Газована вода Arizona Cherry Lime Rickey Вишня і Лайм 650мл","details":{"calories":"N/A","brand":"Choco Yummy","description":"Культовая Arizona объема XXL прямиком из Бруклина!Размер банки впечатляющий - хватит и друзьям. Вы п..","volume":"N/A","country":"Імпорт"},"price":149,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Gazirovki/gazirovka-arizona-cherry-lime-rickey-650ml-4-495x495.jpg","category":"Газовані напої"},{"id":37,"name":"Газована вода Candy Can Bubblegum Sparkling Drink Sugar Free Жуйка 330мл","details":{"calories":"N/A","brand":"Choco Yummy","description":"Газировка для веселих вечірок!Напій шипучий, з ігристими бульбашками, чудово піднімає настрій і дару..","volume":"N/A","country":"Імпорт"},"price":129,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Gazirovki/gazirovka-candy-can-sparkling-bubblegum-330ml-5-495x495.jpg","category":"Жуйки"},{"id":38,"name":"Газована вода Candy Can Cotton Candy Sparkling Drink Sugar Free Солодка Вата Без цукру 330мл","details":{"calories":"N/A","brand":"Choco Yummy","description":"Веселі газовані напої від Candy Can тепер і в нашому асортименті. Компанія створює нереальні смаки, ..","volume":"N/A","country":"Імпорт"},"price":129,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Gazirovki/napitok_candy_can_cotton_candy_sugar_free_330ml_6-495x495.jpg","category":"Солодощі"},{"id":39,"name":"Газована вода Chupa Chups Sour Coco Green Apple Кокос-Зелене яблуко 240 мл","details":{"calories":"N/A","brand":"Choco Yummy","description":"газований напій Chupa Chups Sour Coco Green Apple Смак: Інтенсивний кисло-солодкий смак зеленого ябл..","volume":"N/A","country":"Імпорт"},"price":99,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Gazirovki/napij-chupa-chups-sour-coco-green-apple-240ml-4-495x495.jpg","category":"Солодощі"},{"id":40,"name":"Газована вода Chupa Chups Sour Coco Lemon Кокос-Лимон 240мл","details":{"calories":"N/A","brand":"Choco Yummy","description":"газований напій Chupa Chups Sour Coco LemonСмак: Лимон з кислинкою та вершковим відтінком кокоса.Вир..","volume":"N/A","country":"Імпорт"},"price":99,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Gazirovki/napij-chupa-chups-sour-coco-lemon-240ml-3-495x495.jpg","category":"Солодощі"},{"id":41,"name":"Газована вода Chupa Chups Sparkling Cola 345мл","details":{"calories":"N/A","brand":"Choco Yummy","description":"А чому б льодяникам Chupa Chups не стати газованою водою?)Газована вода легка, бадьора, смачна як ох..","volume":"N/A","country":"Імпорт"},"price":79,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Gazirovki/gazirovka-chupa-chups-sparkling-cola-345ml-4-495x495.jpg","category":"Солодощі"},{"id":42,"name":"Газована вода Coca-Cola Cherry Float Zero Sugar Вишня з ваніллю 355мл","details":{"calories":"N/A","brand":"Choco Yummy","description":"Та сама Coca-Cola Cherry Float, той самий кайф... тільки у версії Zero Sugar.Концепція «float» натхн..","volume":"N/A","country":"Імпорт"},"price":199,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Gazirovki/gazirovka-coca-cola-cherry-float-zero-sugar-355ml-1-495x495.jpg","category":"Газовані напої"},{"id":43,"name":"Газована вода Coca-Cola Cherry Float Вишня з ваніллю 355мл","details":{"calories":"N/A","brand":"Choco Yummy","description":"Coca-Cola завжди знаходить, чим здивувати!Формат «float» натхненний класичним американським десертом..","volume":"N/A","country":"Імпорт"},"price":199,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Gazirovki/gazirovka-coca-cola-cherry-float-355ml-2-495x495.jpg","category":"Газовані напої"},{"id":44,"name":"Газована вода Coca-Cola Holiday Creamy Vanilla Soda Ванільна 355мл","details":{"calories":"N/A","brand":"Choco Yummy","description":"Сезонна лімітка Coca-Cola.Виглядає баночка, як новорічний атрибут - стильна, з яскравим сезонним диз..","volume":"N/A","country":"Імпорт"},"price":169,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Gazirovki/gazirovka-coca-cola-holiday-creamy-vanilla-soda-355ml-3-495x495.jpg","category":"Газовані напої"},{"id":45,"name":"Газована вода Coca-Cola Zero Sugar Caffeine Free 330мл","details":{"calories":"N/A","brand":"Choco Yummy","description":"Знайома і улюблена вами Coca-Cola, тільки без цукру та без кофеїну — версія Zero Sugar Caffeine Free..","volume":"N/A","country":"Імпорт"},"price":179,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Gazirovki/gazirovka-coca-cola-zero-sugar-caffeine-free-330ml-1-495x495.jpg","category":"Газовані напої"},{"id":46,"name":"Газована вода Coca-Cola Zero Sugar Кока Кола Без Цукру 355мл","details":{"calories":"N/A","brand":"Choco Yummy","description":"Посміхаєтеся?) Так-так-так-так!!! Це дієтична Кока Кола. Охолодіть Колу, додайте кубики льоду і зроб..","volume":"N/A","country":"Імпорт"},"price":129,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Gazirovki/gazirovka_coca_cola_zero_sugar_340ml_1-495x495.jpg","category":"Газовані напої"},{"id":47,"name":"Газована Вода Dr Pepper Cream Soda 355ml","details":{"calories":"N/A","brand":"Choco Yummy","description":"Неповторний Доктор Пеппер!)⠀Рецепт приготування цього газування придумав фармацевт Чарльз Алдертон, ..","volume":"N/A","country":"Імпорт"},"price":99,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Gazirovki/dr.pepper-cream-soda-495x495.jpg","category":"Газовані напої"},{"id":48,"name":"Газована вода Dr Pepper Original 330мл","details":{"calories":"N/A","brand":"Choco Yummy","description":"Газований напій DR PEPPER! Рецепт приготування цієї газованої води придумав фармацевт Чарльз Ал..","volume":"N/A","country":"Імпорт"},"price":59,"image":"https://choco-yummy.com.ua/image/cache/catalog/589b8182-a106-46db-8f16-77f25db834c5-495x495.png","category":"Газовані напої"},{"id":49,"name":"Газована вода Dr. Pepper Strawberries \u0026 Cream Полуниця і вершки 330мл","details":{"calories":"N/A","brand":"Choco Yummy","description":"Легендарний Dr Pepper у версії Strawberries \u0026 Cream.Стильна тоненька банка зручно лежить у руці...","volume":"N/A","country":"Імпорт"},"price":59,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Gazirovki/gazirovka-dr-pepper-strawberries-cream-330ml-3-495x495.jpg","category":"Газовані напої"},{"id":50,"name":"Газована вода Dr. Pepper Vanilla Float Ванільне морозиво 330мл","details":{"calories":"N/A","brand":"Choco Yummy","description":"Dr Pepper поповнив класичну лінійку ще одним оригінальним варіантом. Традиційний рецепт із 23 інгред..","volume":"N/A","country":"Імпорт"},"price":59,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Gazirovki/gazirovka-dr-pepper-vanilla-float-long-330ml-3-4-495x495.jpg","category":"Газовані напої"},{"id":51,"name":"Газована вода Dr.Pepper Blackberry Ожина 355мл","details":{"calories":"N/A","brand":"Choco Yummy","description":"Dr Pepper Blackberry - американська версія газованої води, яку у звичайних супермаркетах ви не зустр..","volume":"N/A","country":"Імпорт"},"price":149,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Gazirovki/gazirovka-drpepper-blackberry-355ml-1-495x495.jpg","category":"Газовані напої"},{"id":52,"name":"Газована вода Fanta Diablo Crimson Cherry 330 мл","details":{"calories":"N/A","brand":"Choco Yummy","description":"Напій кольору крові...\n\n\nКолекційна банка з унікальним дизайном — культові персонажі Diablo.\n\nС..","volume":"N/A","country":"Імпорт"},"price":149,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Gazirovki/gazirovka-fanta-diablo-crimson-cherry-330ml-4-495x495.jpg","category":"Газовані напої"},{"id":53,"name":"Газована вода Fanta Fruit Twist Мультифрукт 330мл","details":{"calories":"N/A","brand":"Choco Yummy","description":"Яскрава, освіжаюча газована вода Fanta Fruit Twist створена, щоб підняти вам настрій.Фанта Мультифру..","volume":"N/A","country":"Імпорт"},"price":99,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Gazirovki/gazirovka-fanta-fruit-twist-330ml-1-495x495.jpg","category":"Газовані напої"},{"id":54,"name":"Газована вода Fanta Grape Asia 320мл","details":{"calories":"N/A","brand":"Choco Yummy","description":"Фіолетова Fanta!Газована вода випущена для місцевого споживача і смак відрізняється від звичної Фант..","volume":"N/A","country":"Імпорт"},"price":149,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Gazirovki/gazirovka-fanta-grape-asia-320ml-3-495x495.jpg","category":"Газовані напої"},{"id":55,"name":"Газована вода Fanta Grape Japan Виноград 500мл","details":{"calories":"N/A","brand":"Choco Yummy","description":"Стара добра Фанта, але японська!Шипучка з шаленим ароматом і смаком темного винограду.  Красивого ру..","volume":"N/A","country":"Імпорт"},"price":169,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Gazirovki/gazirovka-fanta-grape-japan-500ml-495x495.png","category":"Газовані напої"},{"id":56,"name":"Газована вода Fanta Huong Xa Xi Sarsaparilla Vietnam 320мл","details":{"calories":"N/A","brand":"Choco Yummy","description":"А ви вже пили Фанту з сарсапарилою? Звучить, як чарівне зілля)Для любителів спробувати нові, незвича..","volume":"N/A","country":"Імпорт"},"price":149,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Gazirovki/gazirovka-fanta-huong-xa-xi-sarsaparilla-vietnam-320ml-2-495x495.jpg","category":"Газовані напої"},{"id":57,"name":"Газована вода Fanta Orange USA Zero Sugar Апельсин 355мл","details":{"calories":"N/A","brand":"Choco Yummy","description":"Легендарна Fanta Orange, але в легкій версії - БЕЗ цукру. Газована вода з тим же апельсиновим смаком..","volume":"N/A","country":"Імпорт"},"price":99,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Gazirovki/gazirovka-fanta-orange-usa-zero-sugar-355ml-3-495x495.jpg","category":"Газовані напої"},{"id":58,"name":"Газована вода Fanta Orange Xbox Ghost Call of Duty 330мл","details":{"calories":"N/A","brand":"Choco Yummy","description":"Лімітована серія банок, випущена у рамках партнерства Fanta та Xbox на честь 25-річчя Xbox.На банку ..","volume":"N/A","country":"Імпорт"},"price":149,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Gazirovki/gazirovka-fanta-orange-xbox-ghost-call-duty-330ml-4-495x495.jpg","category":"Газовані напої"},{"id":59,"name":"Газована вода Fanta Виноград","details":{"calories":"N/A","brand":"Choco Yummy","description":"Ексклюзивна Fanta зі смаком винограду вже готова порадувати вас!  газовану воду з таким см..","volume":"N/A","country":"Імпорт"},"price":99,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Gazirovki/fanta-grape-495x495.jpg","category":"Газовані напої"},{"id":60,"name":"Газована вода Hata Soda Ramune Watermelon Кавун 500мл","details":{"calories":"N/A","brand":"Choco Yummy","description":"Чудова літня газована вода для тих, хто шукає нові смаки. У супермаркетах подібної ви не знайдете!Га..","volume":"N/A","country":"Імпорт"},"price":199,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Gazirovki/gazirovka-hatakosen-ramune-soda-watermelon-500ml-2-495x495.jpg","category":"Газовані напої"},{"id":61,"name":"Газована Вода Lady Boba Brown Sugar Bubble Tea","details":{"calories":"N/A","brand":"Choco Yummy","description":"Ця леді точно зведе вас з розуму)Lady Boba Brown Sugar Bubble Tea – це освіжаючий та сладкий напій, ..","volume":"N/A","country":"Імпорт"},"price":99,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Gazirovki/lady-boba-brown-sugar-bubble-tea-495x495.jpg","category":"Жуйки"},{"id":62,"name":"Газована вода Lotte Chilsung Cider Soda Сидр 250мл","details":{"calories":"N/A","brand":"Choco Yummy","description":"Газована вода Lotte Chilsung Cider уже давно стала справжнім хітом у Південній Кореї.Якщо хочеться н..","volume":"N/A","country":"Імпорт"},"price":69,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Gazirovki/gazirovka-lotte-chilsung-cider-soda-250ml-5-495x495.jpg","category":"Газовані напої"},{"id":63,"name":"Газована вода Mountain Dew Baja Blast Лайм Апельсин Ананас 355мл","details":{"calories":"N/A","brand":"Choco Yummy","description":"Коли хочеться не просто випити газованої води, а зловити хвилю енергії, беріть Mountain Dew Baja Bla..","volume":"N/A","country":"Імпорт"},"price":179,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Raznie/energetik_mountain_dew_voltage_baja_blast_355ml_2-495x495.jpg","category":"Енергетики"},{"id":64,"name":"Газована вода Mountain Dew Baja Cabo Citrus 355мл","details":{"calories":"N/A","brand":"Choco Yummy","description":"У банці — справжня відпустка)Напій червоно-помаранчевого кольору — шикарно виглядає в коктейлях і до..","volume":"N/A","country":"Імпорт"},"price":179,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Gazirovki/gazirovka-mountain-dew-baja-cabo-citrus-355ml-4-495x495.jpg","category":"Газовані напої"},{"id":65,"name":"Газована вода Mountain Dew Code Red Вишня 355мл","details":{"calories":"N/A","brand":"Choco Yummy","description":"Хороша!) Американська газована вода Mountain Dew Code Red - дуже смачний напій. Напій у міру солодки..","volume":"N/A","country":"Імпорт"},"price":179,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Gazirovki/gazirovka-mountain-dew-code-red-355ml-1-1-495x495.jpg","category":"Газовані напої"},{"id":66,"name":"Газована вода Mountain Dew Dragon Fruit Драконів фрукт 355мл","details":{"calories":"N/A","brand":"Choco Yummy","description":"Екзотична версія легендарного Mountain Dew - Dragon Fruit - загадковий Драконів фрукт. Це яскравий с..","volume":"N/A","country":"Імпорт"},"price":179,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Gazirovki/gazirovka-mountain-dew-dragon-fruit-355ml-5-495x495.jpg","category":"Газовані напої"},{"id":67,"name":"Газована вода Mountain Dew Kickstart Energizing Orange Citrus Апельсин  Цитрус 453мл","details":{"calories":"N/A","brand":"Choco Yummy","description":"Немає сил? Спробуйте Kickstart Orange Citrus від Mountain Dew. Кілька ковтків і рівень енергії підні..","volume":"N/A","country":"Імпорт"},"price":249,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Raznie/gazirovka-mountain-dew-kickstart-energizing-orange-citrus-453ml-1-495x495.jpg","category":"Газовані напої"},{"id":68,"name":"Газована вода Mountain Dew Pitch Black Виноград і Цитруси 330мл","details":{"calories":"N/A","brand":"Choco Yummy","description":"Mountain Dew Pitch Black - культова газована вода з таємничою атмосферою. Вперше світ її побачив у 2..","volume":"N/A","country":"Імпорт"},"price":99,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Gazirovki/gazirovka-mountain-dew-pitch-black-330ml-3-495x495.jpg","category":"Газовані напої"},{"id":69,"name":"Газована вода Mountain Dew Pitch Black Виноград і Цитруси 500 мл","details":{"calories":"N/A","brand":"Choco Yummy","description":"Mountain Dew Pitch Black - легендарна газована вода з атмосферою містики. Вперше її презентували в 2..","volume":"N/A","country":"Імпорт"},"price":199,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Gazirovki/gazirovka-mountain-dew-pitch-black-500ml-4-495x495.jpg","category":"Газовані напої"},{"id":70,"name":"Газована вода Mountain Dew Trolli Candy Cherry Lemon Zero Sugar Вишня Лимон 355мл","details":{"calories":"N/A","brand":"Choco Yummy","description":"Пустотливий варіант шипучки для любителів цукерок)Культова газована вода доповнена смаком мармеладни..","volume":"N/A","country":"Імпорт"},"price":199,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Gazirovki/gazirovka-mountain-dew-trolli-candy-zero-sugar-355ml-3-495x495.jpg","category":"Солодощі"},{"id":71,"name":"Газована вода Mountain Dew Voltage Raspberry Ginseng Малина Женьшень 355мл","details":{"calories":"N/A","brand":"Choco Yummy","description":"Американська газована вода Mountain Dew Voltage - класний напій зі смаком соковитої малини та женьше..","volume":"N/A","country":"Імпорт"},"price":199,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Raznie/energetik_mountain_dew_voltage_raspberry_ginseng_355ml_1-495x495.jpg","category":"Газовані напої"},{"id":72,"name":"Газована вода Mountain Dew Zero Sugar Цитрус Без цукру 330мл","details":{"calories":"N/A","brand":"Choco Yummy","description":"Класичний Mountain Dew у форматі Zero Sugar, який вже має цілу армію шанувальників!Mountain Dew з\u0027яв..","volume":"N/A","country":"Імпорт"},"price":159,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Gazirovki/gazirovka-mountain-dew-zero-sugar-330ml-4-495x495.jpg","category":"Газовані напої"},{"id":73,"name":"Газована вода Pepsi Caffeine Free Diet Дієтична Без Кофеїну 355мл","details":{"calories":"N/A","brand":"Choco Yummy","description":"У баночці Pepsi Caffeine Free Diet - ваша улюблена газована вода у фантастичній версії - Без Кофеїну..","volume":"N/A","country":"Імпорт"},"price":199,"image":"https://choco-yummy.com.ua/image/cache/catalog/693b231e1944b7f9-00012000008184-C1N1-495x495.png","category":"Газовані напої"},{"id":74,"name":"Газована вода Pepsi Cream Soda Zero Sugar Крем-Сода 330мл","details":{"calories":"N/A","brand":"Choco Yummy","description":"Улюблена Pepsi, ніжна крем-сода та абсолютний Нуль Сахара! У банку лише 2 калорії.Банка стильна, тон..","volume":"N/A","country":"Імпорт"},"price":149,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Gazirovki/gazirovka-pepsi-cream-soda-zero-sugar-poland-330ml-4-495x495.jpg","category":"Газовані напої"},{"id":75,"name":"Газована вода Pepsi Gold 235мл","details":{"calories":"N/A","brand":"Choco Yummy","description":"Лімітована святкова версія класичної Pepsi. Напій випущено з нагоди святкування Китайського Нового р..","volume":"N/A","country":"Імпорт"},"price":99,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Gazirovki/gazirovka-pepsi-gold-235ml-5-495x495.jpg","category":"Газовані напої"},{"id":76,"name":"Газована вода Pepsi Prebiotic Cola Cherry Vanilla з пребіотиками 355мл","details":{"calories":"N/A","brand":"Choco Yummy","description":"Вишнево-ванільна Pepsi повернулася! До того ж у корисній версії — з пребіотиками, які покращують тра..","volume":"N/A","country":"Імпорт"},"price":199,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Gazirovki/gazirovka-pepsi-prebiotic-cola-cherry-vanilla-355ml-4-495x495.jpg","category":"Газовані напої"},{"id":77,"name":"Газована вода Pepsi Prebiotic Cola з пребіотиками 355мл","details":{"calories":"N/A","brand":"Choco Yummy","description":"Пепсі-Кола нової ери!3 грами пребіотичної клітковини,5 грамів тростинного цукру,Чи є ви фанатом Peps..","volume":"N/A","country":"Імпорт"},"price":199,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Gazirovki/gazirovka-pepsi-prebiotic-cola-355ml-4-495x495.jpg","category":"Газовані напої"},{"id":78,"name":"Газована вода Pepsi Strawberries “N” Cream Zero Sugar Полуничний крем 330мл","details":{"calories":"N/A","brand":"Choco Yummy","description":"PEPSI Strawberries \u0027N\u0027 Cream - улюблене газування зі смаком десерту!Банка тонка, стильна, зручно леж..","volume":"N/A","country":"Імпорт"},"price":149,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Gazirovki/gazirovka-pepsi-strawberries-n-cream-zero-sugar-330ml-1-495x495.jpg","category":"Газовані напої"},{"id":79,"name":"Газована вода Pepsi White Peach Oolong Білий Персик та Улун 330мл","details":{"calories":"N/A","brand":"Choco Yummy","description":"Коли аромат чаю Улун зустрічається з найніжнішими відтінками білого персика - час зупиняється... Лег..","volume":"N/A","country":"Імпорт"},"price":199,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Gazirovki/gazirovka_pepsi_white_peach_oolong_330ml_2-495x495.jpg","category":"Газовані напої"},{"id":80,"name":"Газована вода Sprite Chill Strawberry Kiwi Полуниця Ківі 355мл","details":{"calories":"N/A","brand":"Choco Yummy","description":"Освіжаючий, підбадьорливий Sprite Chill із соковитою Полуницею, ніжним Ківі та легким морозним ефект..","volume":"N/A","country":"Імпорт"},"price":99,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Gazirovki/gazirovka-sprite-chill-strawberry-kiwi-355ml-2-495x495.jpg","category":"Газовані напої"},{"id":81,"name":"Газована вода Sprite Glass Пляшка скло 1л","details":{"calories":"N/A","brand":"Choco Yummy","description":"Де купити Спрайт? У нас в інтернет-магазині! Взагалі, газована вода Sprite давно не потребує предста..","volume":"N/A","country":"Імпорт"},"price":299,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Gazirovki/gazirovka_sprite_glass_1l_1-495x495.jpg","category":"Газовані напої"},{"id":82,"name":"Газована вода Sprite Tea Lemon Чай з Лимоном 355 мл","details":{"calories":"N/A","brand":"Choco Yummy","description":"Класичну формулу Sprite доповнили нотками лимонного чаю. Газована вода легка, освіжаюча, з цитрусово..","volume":"N/A","country":"Імпорт"},"price":99,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Gazirovki/gazirovka-sprite-tea-lemon-355ml-7-495x495.jpg","category":"Газовані напої"},{"id":83,"name":"Газована вода Sprite Zero Sugar Mint Chill Лимон-Лайм 1.25л","details":{"calories":"N/A","brand":"Choco Yummy","description":"Sprite Chill — перший у світі напій із охолоджувальним ефектом. Відчуття прохолоди наростає від перш..","volume":"N/A","country":"Імпорт"},"price":299,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Raznie/gazirovka-sprite-zero-sugar-mint-chill-lemon-lime-1250ml-4-495x495.jpg","category":"Газовані напої"},{"id":84,"name":"Газована вода Ultrapop Dragon Ball Drink Strawberry \u0026 Banana 330мл","details":{"calories":"N/A","brand":"Choco Yummy","description":"Спеціальна версія газованої води Ultrapop у стилі Dragon Ball.Банка найкрутіша — із зображенням само..","volume":"N/A","country":"Імпорт"},"price":179,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Gazirovki/gazirovka-ultrapop-dragon-ball-drink-strawberry-banana-330ml-1-495x495.jpg","category":"Газовані напої"},{"id":85,"name":"Газована вода Ultrapop One Piece Soda Luffy Lemon \u0026 Strawberry Лимон і Полуниця 330мл","details":{"calories":"N/A","brand":"Choco Yummy","description":"Спеціальна версія газованої води Ultrapop для любителів серіалу One Piece.Банка крута, в стилі «One ..","volume":"N/A","country":"Імпорт"},"price":179,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Gazirovki/gazirovka-ultrapop-one-piece-soda-luffy-lemon-strawberry-330ml-2-495x495.jpg","category":"Газовані напої"},{"id":86,"name":"Газована вода Warheads Sour Peach Soda Персик 355мл","details":{"calories":"N/A","brand":"Choco Yummy","description":"Від цукерок іноді треба відпочивати і... пити газовану воду!) Зі смаком улюблених карамельок)Банки г..","volume":"N/A","country":"Імпорт"},"price":79,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Gazirovki/gazirovka_warheads_sour_peach_soda_355ml_1-495x495.jpg","category":"Газовані напої"},{"id":87,"name":"Газована вода Warheads Sour! Black Cherry Soda","details":{"calories":"N/A","brand":"Choco Yummy","description":"Warheads Sour! Black Cherry Soda - содова зі смаком соковитої вишні від найпопулярнішого американськ..","volume":"N/A","country":"Імпорт"},"price":79,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Gazirovki/warheads-sour-black-cherry-soda-495x495.jpg","category":"Газовані напої"},{"id":88,"name":"Газована вода Warheads Sour! Blue Raspberry Soda","details":{"calories":"N/A","brand":"Choco Yummy","description":"Warheads Sour! Blue Raspberry Soda - содова зі смаком ожини від найпопулярнішого американського брен..","volume":"N/A","country":"Імпорт"},"price":79,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Gazirovki/warheads-sour-blue-raspberry-soda-495x495.jpg","category":"Газовані напої"},{"id":89,"name":"Газована вода Warheads SOUR! Green Apple Soda","details":{"calories":"N/A","brand":"Choco Yummy","description":"Warheads SOUR! Green Apple Soda - фантастична содова зі смаком зеленого яблука від найпопулярнішого ..","volume":"N/A","country":"Імпорт"},"price":79,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Gazirovki/warheads-sour-green-apple-soda-495x495.png","category":"Газовані напої"},{"id":90,"name":"Газована вода Warheads Sour! Watermelon Soda","details":{"calories":"N/A","brand":"Choco Yummy","description":"Warheads Sour! Watermelon Soda - содова зі смаком кавуна від найпопулярнішого американського бренду ..","volume":"N/A","country":"Імпорт"},"price":79,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Gazirovki/gazirovannyy-napitok-warheads-sour-black-cherry-so-vkusom-kisloy-vishni-355-ml7-495x495.jpg","category":"Газовані напої"},{"id":91,"name":"Газована вода без цукру Fanta Chucky Forest Berries Zero Sugar зі смаком лісових ягід 330мл.","details":{"calories":"N/A","brand":"Choco Yummy","description":"Газировка Fanta Chucky Forest Berries Zero Sugar 330мл — ягідний вибух без цукру, який бадьорить з п..","volume":"N/A","country":"Імпорт"},"price":179,"image":"https://choco-yummy.com.ua/image/cache/catalog/Anew/%D0%BD%D0%BE%D1%8F%D0%B1%D1%80%D1%8C/from%2027.11/1-18/15-kinder/02-pooh/harpor/03-ricola/11-mms/05-Mikolaje%20Czekoladowe/7777/fanta-chucky-forest-berries-zero-sugar-500ml-1-495x495.png","category":"Газовані напої"},{"id":92,"name":"Газована вода Губка Боб Qdol Spongebob Squarepants Citrus Цитрус Равлик Гері 330мл","details":{"calories":"N/A","brand":"Choco Yummy","description":"MIAOW... і всім гарного дня! Мовчазний Гері знає, що освіжаюча содова - це чудовий вибір. У цій бано..","volume":"N/A","country":"Імпорт"},"price":199,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Raznie/gazirovka-qdol-spongebob-squarepants-330ml-6-495x495.jpg","category":"Газовані напої"},{"id":93,"name":"Газована вода Губка Боб Qdol Spongebob Squarepants Grape Виноград Сквідвард 330 мл","details":{"calories":"N/A","brand":"Choco Yummy","description":"«Ну нарешті щось гідне...» Саме так сказав би саркастичний Сквідвард, спробувавши цю газовану воду. ..","volume":"N/A","country":"Імпорт"},"price":199,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Raznie/gazirovka-qdol-spongebob-squarepants-330ml-5-495x495.jpg","category":"Газовані напої"},{"id":94,"name":"Газована вода Губка Боб Qdol Spongebob Squarepants Lychee Лічі Містер Крабс 330мл","details":{"calories":"N/A","brand":"Choco Yummy","description":"Містер Крабс явно задоволений... Тому що ця газована вода - справжній скарб! А в банці - шипуча содо..","volume":"N/A","country":"Імпорт"},"price":199,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Raznie/gazirovka-qdol-spongebob-squarepants-330ml-3-495x495.jpg","category":"Газовані напої"},{"id":95,"name":"Газована вода Губка Боб Qdol Spongebob Squarepants Strawberry Полуниця Сенді Чікс 330мл","details":{"calories":"N/A","brand":"Choco Yummy","description":"Техаська білка Сенді Чікс пропонує всім зарядитися літнім настроєм! У цій баночці Полунична газована..","volume":"N/A","country":"Імпорт"},"price":199,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Raznie/gazirovka-qdol-spongebob-squarepants-330ml-1-495x495.jpg","category":"Газовані напої"},{"id":96,"name":"Газована вода Покемони Qdol Pokemon Citrus Squirtle Цитрус Сквіртл 330мл","details":{"calories":"N/A","brand":"Choco Yummy","description":"Газована вода Покемони Qdol Pokemon Citrus Squirtle Цитрус Сквіртл 330мл..","volume":"N/A","country":"Імпорт"},"price":199,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Gazirovki/qdol-pokemon-sparkling-water-330ml-6-1-495x495.jpg","category":"Газовані напої"},{"id":97,"name":"Газована вода Покемони Qdol Pokemon Grape Bulbasaur Виноград Бульбозавр 330мл","details":{"calories":"N/A","brand":"Choco Yummy","description":"Газована вода Покемони Qdol Pokemon Grape Bulbasaur Виноград Бульбозавр 330мл..","volume":"N/A","country":"Імпорт"},"price":199,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Gazirovki/qdol-pokemon-sparkling-water-330ml-5-1-495x495.jpg","category":"Газовані напої"},{"id":98,"name":"Газована вода Покемони Qdol Pokemon Lime Pikachu Лайм Пікачу 330мл","details":{"calories":"N/A","brand":"Choco Yummy","description":"Газована вода Покемони Qdol Pokemon Lime Pikachu Лайм Пікачу 330мл..","volume":"N/A","country":"Імпорт"},"price":199,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Gazirovki/qdol-pokemon-sparkling-water-330ml-4-1-495x495.jpg","category":"Газовані напої"},{"id":99,"name":"Газована вода Покемони Qdol Pokemon Lychee Charmander Лічі Чармандер 330мл","details":{"calories":"N/A","brand":"Choco Yummy","description":"Газована вода Покемони Qdol Pokemon Lychee Charmander Лічі Чармандер 330мл..","volume":"N/A","country":"Імпорт"},"price":199,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Gazirovki/qdol-pokemon-sparkling-water-330ml-1-1-495x495.jpg","category":"Газовані напої"},{"id":100,"name":"Газована вода Покемони Qdol Pokemon Peach Jigglypuff Персик Джиггліпуфф 330мл","details":{"calories":"N/A","brand":"Choco Yummy","description":"Газована вода Покемони Qdol Pokemon Peach Jigglypuff Персик Джиггліпуфф 330мл..","volume":"N/A","country":"Імпорт"},"price":199,"image":"https://choco-yummy.com.ua/image/cache/catalog/Products/Napitki/Gazirovki/qdol-pokemon-sparkling-water-330ml-3-1-495x495.jpg","category":"Газовані напої"}];

const categoryImages = {
    "Газовані напої": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80",
    "Азіатські напої": "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&q=80",
    "Соки зі шматочками": "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&q=80",
    "Енергетики": "https://images.unsplash.com/photo-1604152135912-04a022e23696?w=400&q=80",
    "Снеки": "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&q=80",
    "Шоколад": "https://images.unsplash.com/photo-1548831772-2bb8b6680a13?w=400&q=80",
    "Солодощі": "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400&q=80",
    "Жуйки": "https://images.unsplash.com/photo-1570586437263-ab629fccc818?w=400&q=80",
    "Подарункові бокси ✨": "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&q=80"
};

allProducts.forEach((p, index) => {
    // Add a small seed to Unsplash URL to get slight variations within the same category if possible, or just use the category image
    if (p.image.startsWith('images/')) {
        p.image = categoryImages[p.category] || categoryImages["Снеки"];
    }
});

const categories = ["Всі", "Газовані напої", "Азіатські напої", "Соки зі шматочками", "Енергетики", "Снеки", "Шоколад", "Солодощі", "Жуйки", "Подарункові бокси ✨"];
const navItems = ["Всі", "Напої", "Снеки", "Шоколад", "Солодощі", "Жуйки", "Подарункові бокси ✨"];

const SmartImage = ({ src, alt, className, style, onFinalError }) => {
    const [currentSrc, setCurrentSrc] = React.useState(src);
    const [fallbackIndex, setFallbackIndex] = React.useState(0);
    
    React.useEffect(() => {
        setCurrentSrc(src);
        setFallbackIndex(0);
    }, [src]);

    const getFallbacks = (originalUrl) => {
        if (!originalUrl || typeof originalUrl !== 'string' || !originalUrl.includes('-495x495')) return [originalUrl];
        return [
            originalUrl,
            originalUrl.replace('-495x495', '-282x495'),
            originalUrl.replace('-495x495', '-228x228'),
            originalUrl.replace('-495x495', '-200x200'),
            originalUrl.replace('-495x495', '-50x50'),
            originalUrl.replace('-495x495', '')
        ];
    };
    
    const fallbacks = getFallbacks(src);

    const handleError = () => {
        if (fallbackIndex < fallbacks.length - 1) {
            const nextIndex = fallbackIndex + 1;
            setFallbackIndex(nextIndex);
            setCurrentSrc(fallbacks[nextIndex]);
        } else if (typeof onFinalError === 'function') {
            onFinalError();
        }
    };

    return <img src={currentSrc} alt={alt} className={className} style={style} onError={handleError} onFinalError={onFinalError} />;
};
const ThemeToggle = ({ isDark, toggleTheme }) => (
    <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300">
        {isDark ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
        ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
        )}
    </button>
);

const Header = ({ isDark, toggleTheme, cartItemsCount, searchQuery, setSearchQuery, activeView, setActiveView, activeNav, setActiveNav, navigateTo }) => {
    return (
        <header className="glass-header sticky top-0 z-40 transition-colors duration-300 border-b border-gray-100 dark:border-gray-800">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-4 group cursor-pointer" onClick={() => navigateTo('shop', 'Напої')}>
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary rounded-full blur opacity-40 group-hover:opacity-70 transition duration-500"></div>
                        <SmartImage src="images/logo.png" alt="Choco Yummy" className="h-12 w-12 object-contain relative z-10 bg-white rounded-full p-1 shadow-sm" />
                    </div>
                    <div className="hidden md:block">
                        <div className="text-xs text-gray-500 dark:text-gray-400 font-medium tracking-wide uppercase">Магазин солодощів</div>
                        <div className="font-extrabold text-xl gradient-text tracking-tight">Choco Yummy</div>
                    </div>
                </div>
                
                <div className="flex-1 max-w-2xl mx-6 hidden sm:block">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                        <input 
                            type="text" 
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                if (activeView !== 'shop' || activeNav !== 'Напої') {
                                    navigateTo('shop', 'Напої');
                                }
                            }}
                            placeholder="Глибокий пошук (назва, бренд, опис, країна)..." 
                            className="w-full pl-11 pr-4 py-2.5 bg-gray-100/50 dark:bg-darkCard/50 border border-gray-200 dark:border-gray-700 text-dark dark:text-white rounded-full focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-inner" 
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4 ml-auto">
                    <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} />
                    
                    <div className="flex flex-col text-right hidden lg:flex border-l border-gray-200 dark:border-gray-700 pl-4">
                        <span className="font-bold text-dark dark:text-white text-sm">+38 (000) 000-00-00</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Пн-Нд: 09:00 - 20:00</span>
                    </div>
                    
                    <button 
                        onClick={() => navigateTo('checkout')}
                        className={`relative p-2.5 rounded-full transition-all shadow-sm ${activeView === 'checkout' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-darkCard text-dark dark:text-white hover:bg-primary hover:text-white'}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        {cartItemsCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white dark:border-darkBg shadow-sm cart-badge">
                                {cartItemsCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>
            {(activeView === 'shop' || activeView === 'product') && (
                <nav className="border-t border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-darkBg/50 backdrop-blur-md">
                    <div className="container mx-auto px-4">
                        <ul className="flex items-center gap-8 text-sm font-semibold h-12 overflow-x-auto whitespace-nowrap hide-scrollbar text-gray-600 dark:text-gray-300">
                            {navItems.map(item => (
                                <li key={item} 
                                    onClick={() => navigateTo('shop', item)}
                                    className={`cursor-pointer h-full flex items-center transition-colors ${activeNav === item ? 'text-primary border-b-2 border-primary' : 'hover:text-primary dark:hover:text-primary'}`}>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </nav>
            )}
        </header>
    );
};

const ProductCard = ({ product, addToCart, onSelect, onImageError }) => (
    <div className="glass-panel rounded-2xl p-4 product-card relative group flex flex-col h-full overflow-hidden cursor-pointer" onClick={() => onSelect(product)}>
        {product.isNew && <div className="absolute top-4 left-4 bg-accent text-white text-xs font-bold px-2.5 py-1 rounded-full z-10 shadow-md animate-pulse">Новинка</div>}
        {product.isPopular && !product.isNew && <div className="absolute top-4 left-4 bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full z-10 shadow-md">Хіт</div>}
        {product.outOfStock && <div className="absolute top-4 left-4 bg-gray-500 text-white text-xs font-bold px-2.5 py-1 rounded-full z-10 shadow-md">Немає в наявності</div>}
        
        <div className="relative mb-4 aspect-square flex items-center justify-center p-6 bg-white dark:bg-gray-800/50 rounded-xl overflow-hidden group-hover:shadow-inner transition-shadow">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <SmartImage src={product.image} onFinalError={onImageError}  alt={product.name} className={`max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-110 ${!product.outOfStock && 'animate-float'}`} style={{ animationDelay: `${product.id * 0.2}s` }} />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center backdrop-blur-[2px]">
                <span className="text-white font-bold bg-white/20 px-4 py-2 rounded-full backdrop-blur-md">Детальніше</span>
            </div>
        </div>
        
        <div className="text-xs font-semibold text-accent mb-1.5 uppercase tracking-wider">{product.category}</div>
        <h4 className="font-bold text-dark dark:text-gray-100 leading-snug mb-3 flex-grow hover:text-primary transition-colors cursor-pointer line-clamp-2 text-lg">{product.name}</h4>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-700/50" onClick={(e) => e.stopPropagation()}>
            <div className="font-extrabold text-2xl text-dark dark:text-white flex items-baseline gap-1">
                {product.price} <span className="text-sm text-gray-500 font-medium">грн</span>
            </div>
            <button onClick={() => addToCart(product)} className={`w-10 h-10 rounded-xl transition-all duration-300 flex items-center justify-center ${product.outOfStock ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed' : 'gradient-bg text-white shadow-lg hover:shadow-primary/40 transform hover:-translate-y-1 z-20 relative'}`} disabled={product.outOfStock}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
            </button>
        </div>
    </div>
);

const App = () => {
    // State
    const [activeView, setActiveView] = useState('shop'); // 'shop', 'product', 'checkout', 'success'
    const [activeNav, setActiveNav] = useState('Напої');
    const [isDark, setIsDark] = useState(false);
    const [cart, setCart] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Всі");
    const [currentPage, setCurrentPage] = useState(1);
    const [brokenImages, setBrokenImages] = useState(new Set());
    
    // Filters
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [calRange, setCalRange] = useState({ min: '', max: '' });
    
    const [lastOrderDetails, setLastOrderDetails] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const carouselRef = useRef(null);

    const scrollCarousel = (direction) => {
        if (carouselRef.current) {
            const scrollAmount = direction === 'left' ? -300 : 300;
            carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    // Browser History Integration
    useEffect(() => {
        const handlePopState = (e) => {
            if (e.state) {
                setActiveView(e.state.view || 'shop');
                if (e.state.nav) setActiveNav(e.state.nav);
                if (e.state.product) setSelectedProduct(e.state.product);
            }
        };
        window.history.replaceState({ view: activeView, nav: activeNav, product: selectedProduct }, '');
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const navigateTo = (view, nav = activeNav, product = selectedProduct) => {
        window.history.pushState({ view, nav, product }, '');
        setActiveView(view);
        if (nav !== activeNav) {
            setSelectedCategory(nav);
        }
        setActiveNav(nav);
        setSelectedProduct(product);
        window.scrollTo(0, 0);
    };

    const itemsPerPage = 6;

    // Theme logic
    useEffect(() => {
        if (isDark) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
    }, [isDark]);

    // Cart logic
    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const updateQuantity = (id, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(id);
            return;
        }
        setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: newQuantity } : item));
    };

    const removeFromCart = (id) => setCart(prev => prev.filter(item => item.id !== id));
    const clearCart = () => setCart([]);

    const clearFilters = () => {
        setSearchQuery(''); 
        setSelectedCategory('Всі');
        setPriceRange({ min: '', max: '' });
        setCalRange({ min: '', max: '' });
    };

    // Filter logic
    const filteredProducts = useMemo(() => {
        return allProducts.filter(p => {
            if (brokenImages.has(p.id)) return false;
            // Deep search
            const q = searchQuery.toLowerCase();
            const matchSearch = !q || 
                p.name.toLowerCase().includes(q) || 
                p.category.toLowerCase().includes(q) ||
                p.details.description.toLowerCase().includes(q) ||
                p.details.brand.toLowerCase().includes(q) ||
                p.details.country.toLowerCase().includes(q);

            const drinkCategories = ["Газовані напої", "Азіатські напої", "Соки зі шматочками", "Енергетики"];
            const matchCategory = 
                selectedCategory === "Всі" ? true :
                selectedCategory === "Напої" ? drinkCategories.includes(p.category) :
                p.category === selectedCategory;
            
            const matchPrice = (!priceRange.min || p.price >= Number(priceRange.min)) && 
                               (!priceRange.max || p.price <= Number(priceRange.max));
                               
            const calories = parseInt(p.details.calories);
            const matchCal = (!calRange.min || calories >= Number(calRange.min)) && 
                             (!calRange.max || calories <= Number(calRange.max));

            return matchSearch && matchCategory && matchPrice && matchCal;
        });
    }, [searchQuery, selectedCategory, priceRange, calRange]);

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    useEffect(() => { setCurrentPage(1); }, [searchQuery, selectedCategory, priceRange, calRange]);

    // Checkout Logic
    const handleCheckoutSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newOrderId = Math.floor(100000 + Math.random() * 900000);
        const orderTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        setLastOrderDetails({
            id: newOrderId,
            date: new Date().toLocaleString('uk-UA'),
            items: [...cart],
            total: orderTotal,
            customer: formData.get('name'),
            phone: formData.get('phone'),
            city: formData.get('city'),
            postOffice: formData.get('postOffice'),
            paymentMethod: "Накладений платіж",
            doNotCall: formData.get('doNotCall') === 'on'
        });

        clearCart();
        navigateTo('success');
    };

    const handleSelectProduct = (product) => {
        navigateTo('product', activeNav, product);
    };

    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Similar products logic
    let similarProducts = [];
    if (selectedProduct) {
        similarProducts = allProducts.filter(p => p.id !== selectedProduct.id);
        similarProducts.sort((a, b) => (a.category === selectedProduct.category ? -1 : 1) - (b.category === selectedProduct.category ? -1 : 1));
        similarProducts = similarProducts.slice(0, 8);
    }

    return (
        <div className="min-h-screen flex flex-col transition-colors duration-300 relative bg-gray-50/50 dark:bg-darkBg">
            <Header 
                isDark={isDark} 
                toggleTheme={() => setIsDark(!isDark)} 
                cartItemsCount={cart.reduce((s, i) => s + i.quantity, 0)}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                activeView={activeView}
                setActiveView={setActiveView}
                activeNav={activeNav}
                setActiveNav={setActiveNav}
                navigateTo={navigateTo}
            />
            
            <main className="flex-grow container mx-auto px-4 pb-20 pt-6 animate-in fade-in duration-500">
                {activeView === 'shop' && (
                    <>
                        <div className="py-2 text-sm text-gray-500 dark:text-gray-400 font-medium mb-6">
                            <span className="hover:text-primary cursor-pointer transition-colors">Головна</span>
                            <span className="mx-3 text-gray-300 dark:text-gray-600">/</span>
                            <span className="text-dark dark:text-gray-200">{activeNav}</span>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-8">
                            <aside className="w-full lg:w-72 flex-shrink-0 space-y-6">
                                <div className="glass-panel p-6 rounded-2xl shadow-sm">
                                    <h3 className="font-extrabold text-xl mb-5 text-dark dark:text-white flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
                                        Категорії
                                    </h3>
                                    <ul className="space-y-2">
                                        {categories.map(cat => {
                                            // Only show category if it has items, except for 'Всі'
                                            const catCount = cat === "Всі" ? allProducts.length : allProducts.filter(p => p.category === cat).length;
                                            if (cat !== "Всі" && catCount === 0) return null;
                                            return (
                                                <li key={cat}>
                                                    <button onClick={() => setSelectedCategory(cat)} className={`w-full flex justify-between items-center px-4 py-3 rounded-xl transition-all ${selectedCategory === cat ? 'bg-primary/10 dark:bg-primary/20 text-primary font-bold' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                                                        <span>{cat}</span>
                                                        <span className={`text-xs px-2 py-1 rounded-full ${selectedCategory === cat ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>{catCount}</span>
                                                    </button>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>

                                {/* Advanced Filters */}
                                <div className="glass-panel p-6 rounded-2xl shadow-sm">
                                    <h3 className="font-extrabold text-xl mb-5 text-dark dark:text-white flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                                        Тонкі фільтри
                                    </h3>
                                    
                                    <div className="mb-5">
                                        <label className="block text-sm font-bold text-gray-500 mb-2">Ціна (грн)</label>
                                        <div className="flex items-center gap-2">
                                            <input type="number" placeholder="Від" value={priceRange.min} onChange={e => setPriceRange({...priceRange, min: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-darkBg border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" />
                                            <span className="text-gray-400">-</span>
                                            <input type="number" placeholder="До" value={priceRange.max} onChange={e => setPriceRange({...priceRange, max: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-darkBg border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" />
                                        </div>
                                    </div>
                                    
                                    <div className="mb-5">
                                        <label className="block text-sm font-bold text-gray-500 mb-2">Калорійність (ккал)</label>
                                        <div className="flex items-center gap-2">
                                            <input type="number" placeholder="Від" value={calRange.min} onChange={e => setCalRange({...calRange, min: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-darkBg border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" />
                                            <span className="text-gray-400">-</span>
                                            <input type="number" placeholder="До" value={calRange.max} onChange={e => setCalRange({...calRange, max: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-darkBg border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" />
                                        </div>
                                    </div>

                                    <button onClick={clearFilters} className="w-full mt-2 text-sm font-bold text-gray-500 hover:text-primary transition-colors">Очистити всі фільтри</button>
                                </div>
                            </aside>

                            <div className="flex-1">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 glass-panel p-4 rounded-2xl">
                                    <h1 className="text-3xl font-black text-dark dark:text-white tracking-tight">{selectedCategory}</h1>
                                    <div className="text-sm font-bold text-gray-500">Знайдено: {filteredProducts.length} товарів</div>
                                </div>
                                
                                {paginatedProducts.length > 0 ? (
                                    <>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {paginatedProducts.map(p => <ProductCard key={p.id} product={p} addToCart={addToCart} onSelect={handleSelectProduct} />)}
                                        </div>

                                        {totalPages > 1 && (
                                            <div className="flex justify-center mt-14">
                                                <div className="flex items-center gap-2 glass-panel p-2 rounded-2xl shadow-sm">
                                                    <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-darkCard font-bold">&laquo;</button>
                                                    {[...Array(totalPages)].map((_, i) => (
                                                        <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-10 h-10 rounded-xl font-bold ${currentPage === i + 1 ? 'gradient-bg text-white scale-105' : 'bg-gray-50 dark:bg-darkCard'}`}>{i + 1}</button>
                                                    ))}
                                                    <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-darkCard font-bold">&raquo;</button>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-20 text-center glass-panel rounded-3xl mt-8">
                                        <div className="text-6xl mb-4">🔍</div>
                                        <h3 className="text-2xl font-bold mb-2 text-dark dark:text-white">Товари не знайдено</h3>
                                        <p className="text-gray-500 max-w-md">За вашим запитом або обраними фільтрами нічого не знайдено. Спробуйте змінити параметри пошуку.</p>
                                        <button onClick={clearFilters} className="mt-6 px-6 py-3 bg-primary/10 text-primary font-bold rounded-xl hover:bg-primary hover:text-white transition-colors">Скинути фільтри</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}



                {activeView === 'product' && selectedProduct && (
                    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="py-2 text-sm text-gray-500 dark:text-gray-400 font-medium mb-6 flex items-center gap-2">
                            <span onClick={() => navigateTo('shop', 'Напої')} className="hover:text-primary cursor-pointer transition-colors flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                                Назад до каталогу
                            </span>
                            <span className="mx-2 text-gray-300 dark:text-gray-600">|</span>
                            <span onClick={() => { setSelectedCategory(selectedProduct.category); navigateTo('shop', 'Напої'); }} className="hover:text-primary cursor-pointer transition-colors">{selectedProduct.category}</span>
                            <span className="mx-2 text-gray-300 dark:text-gray-600">/</span>
                            <span className="text-dark dark:text-gray-200 line-clamp-1">{selectedProduct.name}</span>
                        </div>

                        <div className="glass-panel w-full rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row relative mb-16">
                            {/* Image Section */}
                            <div className="w-full md:w-1/2 bg-white dark:bg-gray-800/80 relative border-r border-gray-100 dark:border-gray-800 min-h-[400px]">
                                <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-accent/5"></div>
                                <SmartImage src={selectedProduct.image} alt={selectedProduct.name} className="absolute inset-0 w-full h-full object-cover z-10" />
                                {selectedProduct.outOfStock && (
                                    <div className="absolute top-8 left-8 bg-gray-500 text-white text-sm font-bold px-4 py-2 rounded-full z-20 shadow-md">Немає в наявності</div>
                                )}
                            </div>

                            {/* Details Section */}
                            <div className="w-full md:w-1/2 p-8 lg:p-14 flex flex-col">
                                <h1 className="text-4xl lg:text-5xl font-black text-dark dark:text-white mb-6 leading-tight tracking-tight">{selectedProduct.name}</h1>
                                
                                <div className="flex items-end gap-4 mb-8">
                                    <div className="text-5xl font-black gradient-text tracking-tighter">{selectedProduct.price} <span className="text-2xl font-bold">грн</span></div>
                                    {selectedProduct.isPopular && <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-2">Хіт продажу</span>}
                                </div>

                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg mb-10">
                                    {selectedProduct.details.description}
                                </p>

                                <div className="grid grid-cols-2 gap-y-6 gap-x-8 text-sm mb-12 bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                                    <div>
                                        <span className="text-gray-500 block mb-1">Бренд</span>
                                        <span className="font-bold text-lg text-dark dark:text-white">{selectedProduct.details.brand}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 block mb-1">Країна</span>
                                        <span className="font-bold text-lg text-dark dark:text-white">{selectedProduct.details.country}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 block mb-1">Об'єм</span>
                                        <span className="font-bold text-lg text-dark dark:text-white">{selectedProduct.details.volume}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 block mb-1">Калорійність</span>
                                        <span className="font-bold text-lg text-dark dark:text-white">{selectedProduct.details.calories}</span>
                                    </div>
                                </div>

                                <div className="mt-auto">
                                    <button 
                                        onClick={() => addToCart(selectedProduct)} 
                                        disabled={selectedProduct.outOfStock}
                                        className={`w-full py-5 text-lg font-bold rounded-2xl shadow-xl transition-all transform flex items-center justify-center gap-3 ${selectedProduct.outOfStock ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'gradient-bg text-white hover:shadow-primary/40 hover:-translate-y-1'}`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                        {selectedProduct.outOfStock ? 'Товар закінчився' : 'Додати в кошик'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Similar Products Carousel */}
                        {similarProducts.length > 0 && (
                            <div className="mt-8">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-2xl lg:text-3xl font-black text-dark dark:text-white">Схожі товари</h3>
                                    <div className="flex gap-2">
                                        <button onClick={() => scrollCarousel('left')} className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-primary hover:text-white transition-colors text-gray-500 shadow-sm">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                        </button>
                                        <button onClick={() => scrollCarousel('right')} className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-primary hover:text-white transition-colors text-gray-500 shadow-sm">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                                        </button>
                                    </div>
                                </div>
                                <div ref={carouselRef} className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory hide-scrollbar items-stretch scroll-smooth">
                                    {similarProducts.map(p => (
                                        <div key={p.id} className="w-[260px] sm:w-[280px] snap-start flex-shrink-0 flex flex-col">
                                            <ProductCard product={p} addToCart={addToCart} onSelect={handleSelectProduct} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeView === 'checkout' && (
                    <div className="max-w-5xl mx-auto">
                        <div className="py-2 text-sm text-gray-500 dark:text-gray-400 font-medium mb-6">
                            <span onClick={() => {setActiveView('shop'); setActiveNav('Напої');}} className="hover:text-primary cursor-pointer transition-colors">Головна</span>
                            <span className="mx-3 text-gray-300 dark:text-gray-600">/</span>
                            <span className="text-dark dark:text-gray-200">Оформлення замовлення</span>
                        </div>
                        
                        <div className="bg-white dark:bg-darkBg rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-gray-100 dark:border-gray-800">
                            {/* Order Summary */}
                            <div className="w-full md:w-5/12 bg-gray-50 dark:bg-darkCard p-6 sm:p-8 border-r border-gray-100 dark:border-gray-800 flex flex-col h-full min-h-[500px]">
                                <h2 className="text-2xl font-black text-dark dark:text-white mb-6">Ваш кошик</h2>
                                
                                {cart.length === 0 ? (
                                    <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                                        <div className="text-6xl mb-4">🛒</div>
                                        <p className="mb-6 font-medium">Кошик поки порожній</p>
                                        <button onClick={() => navigateTo('shop', 'Напої')} className="px-6 py-2.5 bg-primary/10 text-primary rounded-full font-bold hover:bg-primary hover:text-white transition-colors">Перейти до покупок</button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex-1 space-y-6 overflow-y-auto pr-2 max-h-[60vh]">
                                            {cart.map(item => (
                                                <div key={item.id} className="flex gap-4 glass-panel p-3 rounded-2xl">
                                                    <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-xl p-2 border border-gray-100 dark:border-gray-700 flex-shrink-0 relative">
                                                        <SmartImage src={item.image} alt={item.name} className="w-full h-full object-contain" />
                                                        <button onClick={() => removeFromCart(item.id)} className="absolute -top-2 -right-2 bg-white dark:bg-gray-700 text-gray-400 hover:text-red-500 rounded-full p-1 shadow-md transition-colors">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                                        </button>
                                                    </div>
                                                    <div className="flex-1 flex flex-col justify-center">
                                                        <h4 className="font-bold text-dark dark:text-white leading-tight mb-1 text-sm">{item.name}</h4>
                                                        <div className="text-primary font-bold mb-2 text-sm">{item.price} грн</div>
                                                        <div className="flex items-center gap-3">
                                                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-700 text-dark dark:text-white transition">-</button>
                                                            <span className="font-bold text-dark dark:text-white w-4 text-center">{item.quantity}</span>
                                                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-700 text-dark dark:text-white transition">+</button>
                                                        </div>
                                                    </div>
                                                    <div className="font-bold text-dark dark:text-white self-center">
                                                        {item.price * item.quantity} грн
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                                            <div className="flex justify-between items-center text-xl font-black text-dark dark:text-white">
                                                <span>До сплати:</span>
                                                <span className="gradient-text">{cartTotal} грн</span>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Form */}
                            <div className="w-full md:w-7/12 p-6 sm:p-10 relative">
                                <h2 className="text-2xl font-black text-dark dark:text-white mb-6">Дані одержувача</h2>
                                
                                <form onSubmit={handleCheckoutSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Ім'я Прізвище</label>
                                            <input required name="name" type="text" placeholder="Іван Іванов" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-darkBg border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Телефон</label>
                                            <input required name="phone" type="tel" placeholder="+38 (000) 000-00-00" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-darkBg border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Місто</label>
                                        <input required name="city" type="text" placeholder="Київ" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-darkBg border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Відділення пошти</label>
                                        <input required name="postOffice" type="text" placeholder="Відділення Нової Пошти №1" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-darkBg border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                                    </div>

                                    <div className="pt-2">
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Оплата</label>
                                        <label className="flex items-center gap-3 p-4 border border-primary bg-primary/5 rounded-xl cursor-not-allowed opacity-90">
                                            <input type="radio" name="payment" checked readOnly className="w-5 h-5 text-primary accent-primary" />
                                            <div>
                                                <div className="font-bold text-dark dark:text-white">Накладений платіж</div>
                                                <div className="text-xs text-gray-500">Оплата при отриманні на пошті</div>
                                            </div>
                                        </label>
                                    </div>

                                    <div className="pt-2">
                                        <label className="flex items-center gap-3 cursor-pointer p-4 bg-gray-50 dark:bg-darkBg border border-gray-200 dark:border-gray-700 rounded-xl hover:border-primary transition-colors">
                                            <input type="checkbox" name="doNotCall" className="w-5 h-5 text-primary rounded focus:ring-primary accent-primary cursor-pointer" />
                                            <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Не дзвонити мені для підтвердження замовлення</span>
                                        </label>
                                    </div>

                                    <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                                        <button type="submit" disabled={cart.length === 0} className={`w-full font-bold py-4 rounded-xl shadow-lg transition-all ${cart.length === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'gradient-bg text-white hover:-translate-y-1'}`}>
                                            Оформити замовлення
                                        </button>
                                        <button type="button" onClick={() => navigateTo('shop', 'Напої')} className="w-full mt-3 font-bold py-4 rounded-xl text-gray-500 hover:text-dark dark:hover:text-white transition-colors">
                                            Повернутися до покупок
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {activeView === 'success' && lastOrderDetails && (
                    <div className="max-w-3xl mx-auto py-10 animate-in slide-in-from-bottom-8 duration-500">
                        <div className="glass-panel p-10 rounded-3xl shadow-2xl relative overflow-hidden">
                            <div className="absolute -top-20 -right-20 w-64 h-64 bg-green-500/10 rounded-full blur-3xl"></div>
                            
                            <div className="text-center mb-10 relative z-10">
                                <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <h2 className="text-4xl font-black text-dark dark:text-white mb-3">Замовлення успішно оформлено!</h2>
                                <p className="text-gray-500 dark:text-gray-400 text-lg">Дякуємо, {lastOrderDetails.customer}. Ваше замовлення <span className="font-bold text-primary">#{lastOrderDetails.id}</span> прийнято в роботу.</p>
                                
                                <div className="mt-4 inline-block max-w-lg">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                        Запит прийнято в обробку.
                                        {lastOrderDetails.doNotCall 
                                            ? " Очікуйте SMS з номером ТТН після відправки товару." 
                                            : " Наш менеджер зв'яжеться з вами найближчим часом."}
                                    </p>
                                </div>
                            </div>

                            {/* Receipt */}
                            <div className="bg-white dark:bg-darkCard rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden relative z-10">
                                <div className="bg-gray-50 dark:bg-gray-800/50 p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                                    <div>
                                        <h3 className="font-black text-xl tracking-wide uppercase text-dark dark:text-white">Чек замовлення</h3>
                                        <div className="text-xs text-gray-500 mt-1">{lastOrderDetails.date}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm text-gray-500">Номер замовлення</div>
                                        <div className="font-bold text-xl text-primary">#{lastOrderDetails.id}</div>
                                    </div>
                                </div>
                                
                                <div className="p-6">
                                    <div className="mb-6 space-y-4">
                                        <h4 className="font-bold text-sm text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700 pb-2">Товари</h4>
                                        {lastOrderDetails.items.map(item => (
                                            <div key={item.id} className="flex justify-between items-center">
                                                <div className="flex items-center gap-3">
                                                    <span className="font-bold text-dark dark:text-white">{item.quantity}x</span>
                                                    <span className="text-gray-700 dark:text-gray-300">{item.name}</span>
                                                </div>
                                                <div className="font-bold">{item.price * item.quantity} грн</div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mb-6">
                                        <h4 className="font-bold text-sm text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700 pb-2 mb-4">Деталі доставки</h4>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div><span className="text-gray-500">Одержувач:</span> <br/><span className="font-medium text-dark dark:text-white">{lastOrderDetails.customer}</span></div>
                                            <div><span className="text-gray-500">Телефон:</span> <br/><span className="font-medium text-dark dark:text-white">{lastOrderDetails.phone}</span></div>
                                            <div><span className="text-gray-500">Адреса:</span> <br/><span className="font-medium text-dark dark:text-white">{lastOrderDetails.city}, {lastOrderDetails.postOffice}</span></div>
                                            <div><span className="text-gray-500">Оплата:</span> <br/><span className="font-medium text-dark dark:text-white">{lastOrderDetails.paymentMethod}</span></div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 flex justify-between items-center">
                                        <span className="font-black text-lg">РАЗОМ ДО СПЛАТИ:</span>
                                        <span className="font-black text-2xl text-primary">{lastOrderDetails.total} грн</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10 text-center relative z-10">
                                <button onClick={() => navigateTo('shop', 'Напої')} className="px-8 py-4 gradient-bg text-white font-bold rounded-full shadow-lg hover:shadow-primary/40 transition-all transform hover:-translate-y-1">
                                    Повернутися на головну
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
            
            <footer className="bg-black text-gray-300 pt-16 pb-8 mt-auto border-t border-gray-900 relative z-10">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                        <div>
                            <div className="font-extrabold text-xl gradient-text tracking-tight mb-4 flex items-center gap-2">
                                <SmartImage src="images/logo.png" alt="Logo" className="h-8 w-8 object-contain" />
                                Choco Yummy
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed mb-6">
                                Магазин солодощів та екзотичних напоїв з усього світу.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-4 uppercase tracking-wider text-sm">Контакти</h4>
                            <ul className="text-sm text-gray-400 space-y-3">
                                <li className="flex items-start gap-3">
                                    <span className="text-lg">📍</span>
                                    <span>м. Київ, вул. Хрещатик, 24<br/>Україна, 01001</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="text-lg">📞</span>
                                    <a href="tel:+380000000000" className="hover:text-primary transition-colors font-medium">+38 (000) 000-00-00</a>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="text-lg">✉️</span>
                                    <a href="mailto:hello@chocoyummy.com.ua" className="hover:text-primary transition-colors">hello@chocoyummy.com.ua</a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-4 uppercase tracking-wider text-sm">Інформація</h4>
                            <ul className="text-sm text-gray-400 space-y-3">
                                <li><a href="#" className="hover:text-primary transition-colors">Про нас</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Доставка і оплата</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Політика конфіденційності</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Умови повернення</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-4 uppercase tracking-wider text-sm">Графік роботи</h4>
                            <ul className="text-sm text-gray-400 space-y-3 mb-6 bg-gray-900 p-4 rounded-xl border border-gray-800">
                                <li className="flex justify-between items-center"><span>Пн - Пт:</span> <span className="font-bold text-white">09:00 - 20:00</span></li>
                                <li className="flex justify-between items-center border-t border-gray-800 pt-2"><span>Сб - Нд:</span> <span className="font-bold text-white">10:00 - 18:00</span></li>
                            </ul>
                            <div className="flex gap-3">
                                <a href="#" className="w-10 h-10 rounded-xl bg-gray-800 text-white flex items-center justify-center hover:bg-primary transition-colors font-bold text-sm">IG</a>
                                <a href="#" className="w-10 h-10 rounded-xl bg-gray-800 text-white flex items-center justify-center hover:bg-primary transition-colors font-bold text-sm">FB</a>
                                <a href="#" className="w-10 h-10 rounded-xl bg-gray-800 text-white flex items-center justify-center hover:bg-primary transition-colors font-bold text-sm">TG</a>
                            </div>
                        </div>
                    </div>
                    <div className="text-center text-sm font-medium text-gray-500 pt-8 border-t border-gray-800 flex justify-center items-center">
                        <span>&copy; {new Date().getFullYear()} Choco Yummy. Всі права захищені.</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
