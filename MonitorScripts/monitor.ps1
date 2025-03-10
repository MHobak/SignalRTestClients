param(
    [string]$Namespace = "default", # Replace with your namespace
    [string[]]$PodNames = @("signalr-service-68cd694f5c-qm8l2"), # Default to two pods
    [int]$IntervalSeconds = 5
)

if (-not $PodNames) {
    Write-Error "Please provide one or more pod names using the -PodNames parameter."
    return
}

$running = $true

function Get-PodTop {
    foreach ($podName in $PodNames) {
        try {
            kubectl top pod $podName -n $Namespace
        }
        catch {
            Write-Warning "Error getting top for pod $($podName): $($_.Exception.Message)"
        }
    }
}

function Stop-Script {
    $global:running = $false
    Write-Host "Stopping monitoring..."
}

# Register a Ctrl+C handler
$ctrlCHandler = { Stop-Script }
Add-Type -AssemblyName System.Console
[System.Console]::CancelKeyPress += $ctrlCHandler

Write-Host "Monitoring pods. Press Ctrl+C to stop."

while ($running) {
    Get-PodTop
    Start-Sleep -Seconds $IntervalSeconds
}

# Unregister the Ctrl+C handler
[System.Console]::CancelKeyPress -= $ctrlCHandler