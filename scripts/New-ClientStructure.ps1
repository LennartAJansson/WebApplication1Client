[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [ValidatePattern('^[a-zA-Z][a-zA-Z0-9-]*$')]
    [string]$ProjectName,

    [ValidateNotNullOrEmpty()]
    [string]$ParentDirectory = (Get-Location).Path
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Invoke-CheckedCommand {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Command,

        [string[]]$Arguments = @()
    )

    & $Command @Arguments
    if ($LASTEXITCODE -ne 0) {
        throw "Command failed (exit code ${LASTEXITCODE}): $Command $($Arguments -join ' ')"
    }
}

$npm = (Get-Command npm -ErrorAction Stop).Source
$npx = (Get-Command npx -ErrorAction Stop).Source
$node = (Get-Command node -ErrorAction Stop).Source

$parent = (Resolve-Path -LiteralPath $ParentDirectory).ProviderPath
$target = Join-Path $parent $ProjectName
if (Test-Path -LiteralPath $target) {
    throw "The target already exists: $target. Choose a new project name or parent directory."
}

Push-Location -LiteralPath $parent
try {
    Invoke-CheckedCommand -Command $npx -Arguments @(
        '--yes',
        '--package=@angular/cli@22.2.6',
        'ng', 'new', $ProjectName,
        '--routing',
        '--style=scss',
        '--standalone',
        '--ssr=false',
        '--package-manager=npm',
        '--file-name-style-guide=2025',
        '--skip-install',
        '--skip-git',
        '--defaults'
    )

    Push-Location -LiteralPath $target
    try {
        Invoke-CheckedCommand -Command $node -Arguments @(
            $ng, 'add', '@angular/material@22.2.7'
        )

        Invoke-CheckedCommand -Command $node -Arguments @(
            $ng, 'add', '@angular/cdk@22.2.7'
        )

        Invoke-CheckedCommand -Command $npm -Arguments @('install', '--save-dev', 'prettier@3.8.1')

        $ng = Join-Path $target 'node_modules\@angular\cli\bin\ng.js'
        $components = @(
            'features/customers/customer-list',
            'features/employees/employee-list',
            'features/shared/entity-detail',
            'features/shared/entity-form',
            'features/shared/delete-confirm-dialog',
            'features/workloads/workload-form',
            'features/workloads/workload-list'
        )

        foreach ($component in $components) {
            Invoke-CheckedCommand -Command $node -Arguments @(
                $ng, 'generate', 'component', $component,
                '--type=component',
                '--flat',
                '--standalone',
                '--style=scss',
                '--skip-tests',
                '--defaults'
            )
        }

        Invoke-CheckedCommand -Command $node -Arguments @(
            $ng, 'generate', 'service', 'core/services/api', '--type=service', '--defaults'
        )
        Invoke-CheckedCommand -Command $node -Arguments @(
            $ng, 'generate', 'interface', 'core/models/api', '--type=models', '--defaults'
        )
        Invoke-CheckedCommand -Command $node -Arguments @(
            $ng, 'generate', 'interface', 'features/shared/api-error', '--defaults'
        )
        Invoke-CheckedCommand -Command $node -Arguments @(
            $ng, 'generate', 'guard', 'core/guards/placeholder',
            '--functional',
            '--implements=CanActivate',
            '--type-separator=.',
            '--skip-tests',
            '--defaults'
        )
        Invoke-CheckedCommand -Command $node -Arguments @(
            $ng, 'generate', 'interceptor', 'core/interceptors/placeholder',
            '--functional',
            '--type-separator=.',
            '--skip-tests',
            '--defaults'
        )
        Invoke-CheckedCommand -Command $node -Arguments @($ng, 'generate', 'environments', '--defaults')
        Invoke-CheckedCommand -Command $npm -Arguments @('run', 'build')
    }
    finally {
        Pop-Location
    }
}
finally {
    Pop-Location
}

Write-Host "Created and built the generated project: $target"
