[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$json = [System.IO.File]::ReadAllText("C:\Users\User\Downloads\Eat\products.json", [System.Text.Encoding]::UTF8)
$content = [System.IO.File]::ReadAllText("C:\Users\User\Downloads\Eat\app.jsx", [System.Text.Encoding]::UTF8)

$content = $content -replace '(?s)const allProducts = \[.*?\];', ("const allProducts = " + $json + ";")

# Also remove footer image:
$content = $content -replace '(?m)^.*?<img src="images/logo\.png" alt="Logo" className="h-8 w-8 object-contain" />.*$\r?\n', ""

[System.IO.File]::WriteAllText("C:\Users\User\Downloads\Eat\app.jsx", $content, [System.Text.Encoding]::UTF8)
Write-Host "Success!"