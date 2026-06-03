param(
    [string]$DbUrl = "postgresql://neondb_owner:npg_LNe3xVF1DovC@ep-misty-rain-apff0rak-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
    [string]$DbUsername = "neondb_owner",
    [string]$DbPassword = $env:DB_PASSWORD
)

$ErrorActionPreference = "Stop"

$jarPath = Join-Path $PSScriptRoot "target\amazon-clone-backend-0.0.1-SNAPSHOT.jar"
if (-not (Test-Path -LiteralPath $jarPath)) {
    throw "Build artifact not found at $jarPath. Run a build once, then use this launcher."
}

function Normalize-And-Extract-DbParams {
    param([string]$inputUrl)

    # Remove any leading 'jdbc:' for parsing
    $urlForParsing = $inputUrl -replace '^jdbc:', ''

    # Detect and extract userinfo if present (scheme://user:pass@rest)
    if ($urlForParsing -match '^(?<scheme>[^:]+://)(?<userinfo>[^@]+)@(?<rest>.+)$') {
        $scheme = $matches['scheme']
        $userinfo = $matches['userinfo']
        $rest = $matches['rest']

        # split userinfo into user and password (limit to 2 parts)
        $parts = $userinfo -split ':', 2
        $u = $parts[0]
        $p = if ($parts.Length -gt 1) { $parts[1] } else { $null }

        # Build JDBC url without userinfo
        if ($scheme -match '^(postgresql|postgres)://') {
            $jdbc = "jdbc:postgresql://$rest"
        } else {
            $jdbc = if ($urlForParsing -match '^jdbc:') { $urlForParsing } else { "jdbc:$urlForParsing" }
            $jdbc = $jdbc -replace '^(jdbc:[^:]+://)[^@]+@', '$1'
        }

        return @{ JdbcUrl = $jdbc; Username = $u; Password = $p }
    } else {
        # No credentials in URL; ensure JDBC prefix
        if ($urlForParsing -match '^(postgresql|postgres)://') {
            $jdbc = if ($urlForParsing -match '^jdbc:') { $urlForParsing } else { $urlForParsing -replace '^(postgresql|postgres):', 'jdbc:postgresql:' }
        } elseif ($inputUrl -match '^jdbc:') {
            $jdbc = $inputUrl
        } else {
            $jdbc = "jdbc:postgresql://$urlForParsing"
        }
        return @{ JdbcUrl = $jdbc; Username = $null; Password = $null }
    }
}

$normalized = Normalize-And-Extract-DbParams -inputUrl $DbUrl

# If username/password were embedded in the URL, prefer them.
if ($normalized.Username) { $DbUsername = $normalized.Username }
if ($normalized.Password) { $DbPassword = $normalized.Password }

# Final DB URL to use for Spring (without credentials)
$finalDbUrl = $normalized.JdbcUrl

if ([string]::IsNullOrWhiteSpace($DbPassword) -or $DbPassword -eq "ACTUAL_PASSWORD" -or $DbPassword -eq "YOUR_NEW_PASSWORD") {
    throw "DB_PASSWORD is required for Neon startup. You can provide it as an environment variable or embed credentials in the URL (postgresql://user:pass@host/...)."
}

try {
    $uri = [Uri]($finalDbUrl -replace '^jdbc:', '')
    $hostName = $uri.Host
    if ([string]::IsNullOrWhiteSpace($hostName)) {
        throw "Could not parse host from DB_URL."
    }

    try {
        [System.Net.Dns]::GetHostAddresses($hostName) | Out-Null
    } catch {
        throw "Neon host DNS resolution failed for $hostName."
    }

    Write-Host "[INFO] Starting backend with Neon PostgreSQL..."
    $env:DB_URL = $finalDbUrl
    $env:DB_USERNAME = $DbUsername
    $env:DB_PASSWORD = $DbPassword
    $env:DB_DRIVER = "org.postgresql.Driver"
    $env:DB_DIALECT = "org.hibernate.dialect.PostgreSQLDialect"
    & java -jar $jarPath
    exit $LASTEXITCODE
} catch {
    throw "Neon startup precheck failed: $($_.Exception.Message)"
}
