$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:8080/")
$listener.Start()
Write-Host "Server started at http://localhost:8080/"

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $response = $context.Response
        $path = $context.Request.Url.LocalPath
        if ($path -eq "/") { $path = "/index.html" }
        
        $file = Join-Path (Get-Location) $path
        if (Test-Path $file) {
            $content = [System.IO.File]::ReadAllBytes($file)
            $response.ContentLength64 = $content.Length
            
            # Set basic content types
            if ($file -match "\.html$") { $response.ContentType = "text/html" }
            elseif ($file -match "\.css$") { $response.ContentType = "text/css" }
            elseif ($file -match "\.js$") { $response.ContentType = "application/javascript" }
            elseif ($file -match "\.png$") { $response.ContentType = "image/png" }
            elseif ($file -match "\.jpg$") { $response.ContentType = "image/jpeg" }
            
            $response.OutputStream.Write($content, 0, $content.Length)
        } else {
            $response.StatusCode = 404
        }
        $response.Close()
    }
} finally {
    $listener.Stop()
}
