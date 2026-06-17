$ErrorActionPreference = 'Stop'
$productsJson = Get-Content 'src\data\products.json' -Encoding UTF8 | ConvertFrom-Json
$outputDir = 'public\images'

if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir | Out-Null
}

foreach ($product in $productsJson) {
    $url = $product.image
    if ([string]::IsNullOrWhiteSpace($url)) { continue }
    
    $cleanUrl = ($url -split "\?")[0]
    $ext = [System.IO.Path]::GetExtension($cleanUrl)
    if ([string]::IsNullOrWhiteSpace($ext)) { $ext = '.jpg' }
    
    $filename = "$($product.id)$ext"
    $filepath = Join-Path $outputDir $filename
    
    try {
        if (-not (Test-Path $filepath)) {
            Invoke-WebRequest -Uri $url -OutFile $filepath -UseBasicParsing
        }
        $product.image = "/images/$filename"
        Write-Host "Processed: $filename"
    } catch {
        Write-Host "Failed to download: $url"
    }
}

$productsJson | ConvertTo-Json -Depth 10 | Set-Content 'src\data\products.json' -Encoding UTF8
Write-Host "Finished downloading images and updating products.json"
