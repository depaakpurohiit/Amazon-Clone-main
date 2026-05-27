param(
    [string]$DbUrl = "jdbc:postgresql://ep-misty-rain-apff0rak-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
    [string]$DbUsername = "neondb_owner",
    [string]$DbPassword = $env:DB_PASSWORD
)

$ErrorActionPreference = "Stop"

function Start-WithH2 {
    Write-Host "[INFO] Starting backend with local H2 fallback..."
    Remove-Item Env:DB_URL -ErrorAction SilentlyContinue
    Remove-Item Env:DB_USERNAME -ErrorAction SilentlyContinue
    Remove-Item Env:DB_PASSWORD -ErrorAction SilentlyContinue
    Remove-Item Env:DB_DRIVER -ErrorAction SilentlyContinue
    Remove-Item Env:DB_DIALECT -ErrorAction SilentlyContinue
    .\mvnw.cmd spring-boot:run
}

if ([string]::IsNullOrWhiteSpace($DbPassword) -or $DbPassword -eq "ACTUAL_PASSWORD" -or $DbPassword -eq "YOUR_NEW_PASSWORD") {
    Write-Warning "Neon password is missing/placeholder. Falling back to H2."
    Start-WithH2
    exit $LASTEXITCODE
}

try {
    $uri = [Uri]($DbUrl -replace "^jdbc:", "")
    $hostName = $uri.Host
    if ([string]::IsNullOrWhiteSpace($hostName)) {
        throw "Could not parse host from DB_URL."
    }

    $dnsOk = $false
    try {
        [System.Net.Dns]::GetHostAddresses($hostName) | Out-Null
        $dnsOk = $true
    } catch {
        $dnsOk = $false
    }

    if (-not $dnsOk) {
        Write-Warning "Neon host DNS resolution failed ($hostName). Falling back to H2."
        Start-WithH2
        exit $LASTEXITCODE
    }

    Write-Host "[INFO] Starting backend with Neon PostgreSQL..."
    $env:DB_URL = $DbUrl
    $env:DB_USERNAME = $DbUsername
    $env:DB_PASSWORD = $DbPassword
    $env:DB_DRIVER = "org.postgresql.Driver"
    $env:DB_DIALECT = "org.hibernate.dialect.PostgreSQLDialect"
    .\mvnw.cmd spring-boot:run
    exit $LASTEXITCODE
} catch {
    Write-Warning "Neon startup precheck failed: $($_.Exception.Message)"
    Start-WithH2
    exit $LASTEXITCODE
}
