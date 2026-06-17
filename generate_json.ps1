[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$drinksCsvPath = "C:\Users\User\Downloads\choco-yummy.csv"
$snacksCsvPath = "C:\Users\User\Downloads\Eat\products.csv" 
$csvFiles = Get-ChildItem -Path "C:\Users\User\Downloads" -Filter "*.csv" | Where-Object { $_.Name -match "choco-yummy" -and $_.Name -ne "choco-yummy.csv" }
if ($csvFiles.Count -gt 0) { $snacksCsvPath = $csvFiles[0].FullName }

$global:allProducts = @()
$global:idCounter = 1

function ProcessCsv($path, $isSnacks) {
    if (-not (Test-Path $path)) { return }
    $csv = Import-Csv -Path $path -Encoding UTF8
    foreach ($row in $csv) {
        if ([string]::IsNullOrWhiteSpace($row.'product-name')) { continue }

        $name = $row.'product-name'
        $desc = $row.'product-desc'
        $price = $row.'price'
        
        $img = $row.'img-responsive src'
        if ([string]::IsNullOrWhiteSpace($img)) { $img = $row.'list-image src' }
        if (-not [string]::IsNullOrWhiteSpace($img)) { $img = $img -replace '-(50x50|200x200)\.(webp|png|jpg|jpeg)', '-495x495.$2' }
        
        $category = "Газовані напої"
        if ($isSnacks) {
            $category = "Снеки"
            if ($name -match "(?i)Шоколад|Milka|KitKat|Hershey|Oreo") { $category = "Шоколад" }
            elseif ($name -match "(?i)Жуйк|Bubble|Hubba|Gum") { $category = "Жуйки" }
            elseif ($name -match "(?i)Цукерк|Солодо|Candy|Lollipop|Chupa|Jelly|Mochi|Мармелад|Драже") { $category = "Солодощі" }
        } else {
            if ($name -match "(?i)Енергетик|Monster|Red Bull|Baja Blast|Krating|Prime") { $category = "Енергетики" }
            elseif ($name -match "(?i)Сік|Mogu") { $category = "Соки зі шматочками" }
            elseif ($name -match "(?i)Снек|Чип|Чіпс|Takis|Pringles|Doritos|Cheetos") { $category = "Снеки" }
            elseif ($name -match "(?i)Шоколад|Milka|KitKat|Hershey") { $category = "Шоколад" }
            elseif ($name -match "(?i)Жуйк|Bubble|Hubba|Gum") { $category = "Жуйки" }
            elseif ($name -match "(?i)Цукерк|Солодо|Candy|Lollipop|Chupa|Jelly") { $category = "Солодощі" }
            elseif ($name -match "(?i)Азіат|Япон|Корей") { $category = "Азіатські напої" }
        }
        
        $priceNum = 99
        if (-not [string]::IsNullOrWhiteSpace($price)) {
            $priceNum = [int]($price -replace '[^\d]','')
        }
        
        $obj = [PSCustomObject]@{
            id = $global:idCounter
            name = $name
            price = $priceNum
            image = $img
            category = $category
            details = [PSCustomObject]@{
                brand = "Choco Yummy"
                country = "Імпорт"
                volume = "N/A"
                calories = "N/A"
                description = $desc
            }
        }
        $global:allProducts += $obj
        $global:idCounter++
    }
}

ProcessCsv $drinksCsvPath $false
ProcessCsv $snacksCsvPath $true

$json = $global:allProducts | ConvertTo-Json -Depth 5 -Compress
[System.IO.File]::WriteAllText("C:\Users\User\Downloads\Eat\products.json", $json, [System.Text.Encoding]::UTF8)
Write-Host "Success!"