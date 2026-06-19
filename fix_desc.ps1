$jsonPath = "C:\Users\User\Downloads\Eat\src\data\products.json"
$products = Get-Content $jsonPath -Raw | ConvertFrom-Json

$phrases = @{
    "Енергетики" = " Заряджайся енергією на весь день! Замовляй зараз та відчуй драйв."
    "Газовані напої" = " Освіжаючий смак, який варто спробувати. Додай у кошик та насолоджуйся!"
    "Азіатські напої" = " Відкрий для себе справжній смак Азії. Спробуй щось нове та екзотичне!"
    "Соки зі шматочками" = " Натуральний смак зі шматочками фруктів. Смакуй з користю!"
    "Снеки" = " Ідеальний перекус для будь-якої ситуації. Хрумкай із задоволенням!"
    "Шоколад" = " Справжня насолода для любителів солоденького. Подаруй собі мить щастя!"
    "Солодощі" = " Найкращий вибір для справжніх ласунів. Скуштуй та переконайся!"
    "Жуйки" = " Довготривалий смак та свіжість на кожен день. Обирай улюблений аромат!"
    "Подарункові бокси ✨" = " Ідеальний подарунок для близьких. Здивуй їх цим неймовірним боксом!"
}
$defaultPhrase = " Чудовий вибір, який точно вам сподобається. Замовляйте прямо зараз!"

foreach ($p in $products) {
    if ($p.details.description -match "\.\.$") {
        $desc = $p.details.description -replace '\.\.$', ''
        $desc = $desc -replace '[^.!?]+$', ''
        
        $phrase = $phrases[$p.category]
        if (-not $phrase) {
            $phrase = $defaultPhrase
        }
        
        $p.details.description = $desc + $phrase
    }
}

$jsonOutput = $products | ConvertTo-Json -Depth 10
$utf8NoBom = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllText($jsonPath, $jsonOutput, $utf8NoBom)
Write-Output "Descriptions fixed."