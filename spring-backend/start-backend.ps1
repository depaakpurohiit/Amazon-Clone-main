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

    $urlForParsing = $inputUrl -replace '^jdbc:', ''

    if ($urlForParsing -match '^(?<scheme>[^:]+://)(?<userinfo>[^@]+)@(?<rest>.+)$') {
        $scheme = $matches['scheme']
        $userinfo = $matches['userinfo']
        $rest = $matches['rest']

        $parts = $userinfo -split ':', 2
        $u = $parts[0]
        $p = if ($parts.Length -gt 1) { $parts[1] } else { $null }

        if ($scheme -match '^(postgresql|postgres)://') {
            $jdbc = "jdbc:postgresql://$rest"
        } else {
            $jdbc = if ($urlForParsing -match '^jdbc:') { $urlForParsing } else { "jdbc:$urlForParsing" }
            $jdbc = $jdbc -replace '^(jdbc:[^:]+://)[^@]+@', '$1'
        }

        return @{ JdbcUrl = $jdbc; Username = $u; Password = $p }
    } else {
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

function Get-JavaExecutable {
    $candidates = @()

    if ($env:JAVA_HOME) {
        $candidates += Join-Path $env:JAVA_HOME 'bin\java.exe'
    }

    $candidates += @(
        'C:\Program Files\Java\jdk-21\bin\java.exe',
        'C:\Program Files (x86)\Java\jdk-21\bin\java.exe'
    )

    foreach ($candidate in $candidates) {
        if ($candidate -and (Test-Path -LiteralPath $candidate)) {
            return $candidate
        }
    }

    $javaCommand = Get-Command java -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Source -ErrorAction SilentlyContinue
    if ($javaCommand -and (Test-Path -LiteralPath $javaCommand)) {
        return $javaCommand
    }

    throw "Java executable not found. Install JDK 21 or set JAVA_HOME to a JDK 21 installation."
}

function Get-JavaMajorVersion {
    param([string]$javaPath)

    $output = & $javaPath -version 2>&1 | Select-String -Pattern 'version' | Select-Object -First 1
    if (-not $output) { return $null }

    if ($output -match '"(?<ver>[0-9]+)(?:\.[0-9]+)*') {
        return [int]$matches['ver']
    }

    return $null
}

$normalized = Normalize-And-Extract-DbParams -inputUrl $DbUrl
if ($normalized.Username) { $DbUsername = $normalized.Username }
if ($normalized.Password) { $DbPassword = $normalized.Password }

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

    $javaExe = Get-JavaExecutable
    $javaMajor = Get-JavaMajorVersion -javaPath $javaExe
    if (-not $javaMajor -or $javaMajor -lt 21) {
        throw "Java 21 is required. Found '$javaMajor' at '$javaExe'. Set JAVA_HOME to a JDK 21 installation or install Java 21."
    }

    Write-Host "[INFO] Using Java executable: $javaExe"
    Write-Host "[INFO] Starting backend with Neon PostgreSQL..."

    $env:DB_URL = $finalDbUrl
    $env:DB_USERNAME = $DbUsername
    $env:DB_PASSWORD = $DbPassword
    $env:DB_DRIVER = "org.postgresql.Driver"
    $env:DB_DIALECT = "org.hibernate.dialect.PostgreSQLDialect"

    & $javaExe -jar $jarPath
    exit $LASTEXITCODE
} catch {
    throw "Neon startup precheck failed: $($_.Exception.Message)"
}
