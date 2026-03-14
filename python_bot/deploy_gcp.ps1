param(
    [Parameter(Mandatory = $true)]
    [string]$ProjectId,
    [Parameter(Mandatory = $true)]
    [string]$SheetId,
    [string]$Region = "southamerica-east1",
    [string]$WorksheetName = "Fila Automacao",
    [string]$HorusUrl = "https://scaweb.saude.gov.br/scaweb/solicitacaoUsuario.do?acao=gravarNovaSolicitacao",
    [string]$RepoName = "horus-automacao",
    [string]$ImageName = "python-bot",
    [string]$JobName = "horus-cadastro-job",
    [string]$SchedulerName = "horus-cadastro-cron",
    [string]$Schedule = "*/5 * * * *",
    [string]$Timezone = "America/Sao_Paulo",
    [string]$WebhookUrl = ""
)

$ErrorActionPreference = "Stop"
if ($PSVersionTable.PSVersion.Major -ge 7) {
    # gcloud escreve mensagens informativas em stderr; no PowerShell 7 isso pode
    # virar erro terminante mesmo com exit code 0.
    $PSNativeCommandUseErrorActionPreference = $false
}
$gcloudCommand = (Get-Command gcloud.cmd -ErrorAction SilentlyContinue).Source
if (-not $gcloudCommand) {
    $gcloudCommand = (Get-Command gcloud -ErrorAction Stop).Source
}

function Invoke-GCloud {
    param(
        [switch]$Quiet,
        [switch]$AllowFailure,
        [Parameter(ValueFromRemainingArguments = $true)]
        [string[]]$Args
    )

    $quotedArgs = foreach ($arg in $Args) {
        if ($null -eq $arg) {
            '""'
            continue
        }

        if ($arg -match '[\s",]') {
            '"' + ($arg -replace '(\\*)"', '$1$1\"') + '"'
        } else {
            $arg
        }
    }

    $stdoutFile = [System.IO.Path]::GetTempFileName()
    $stderrFile = [System.IO.Path]::GetTempFileName()
    try {
        $process = Start-Process -FilePath $gcloudCommand -ArgumentList ($quotedArgs -join ' ') -NoNewWindow -Wait -PassThru -RedirectStandardOutput $stdoutFile -RedirectStandardError $stderrFile
        $stdout = [System.IO.File]::ReadAllText($stdoutFile)
        $stderr = [System.IO.File]::ReadAllText($stderrFile)
        $exitCode = $process.ExitCode
    } finally {
        Remove-Item $stdoutFile, $stderrFile -ErrorAction SilentlyContinue
    }

    $output = @()
    if ($stdout) {
        $output += $stdout.TrimEnd("`r", "`n")
    }
    if ($stderr) {
        $output += $stderr.TrimEnd("`r", "`n")
    }

    if (-not $Quiet -and $output) {
        $output | Write-Output
    }

    if (-not $AllowFailure -and $exitCode -ne 0) {
        $commandText = "gcloud " + ($Args -join " ")
        if ($output) {
            $details = ($output | Out-String).Trim()
            throw "$commandText`n$details"
        }
        throw "Falha ao executar: $commandText"
    }

    return [pscustomobject]@{
        ExitCode = $exitCode
        Output = $output
    }
}

function Ensure-ServiceAccount {
    param(
        [string]$ProjectId,
        [string]$AccountId,
        [string]$DisplayName
    )
    $email = "$AccountId@$ProjectId.iam.gserviceaccount.com"
    $existsResult = Invoke-GCloud -Quiet iam service-accounts list --project $ProjectId --filter "email=$email" --format "value(email)"
    $exists = ($existsResult.Output | Out-String).Trim()
    if (-not $exists) {
        $null = Invoke-GCloud -Quiet iam service-accounts create $AccountId --display-name $DisplayName --project $ProjectId
    }
    return $email
}

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$serviceAccountFile = Join-Path $scriptDir "service_account.json"
if (-not (Test-Path $serviceAccountFile)) {
    throw "Arquivo nao encontrado: $serviceAccountFile"
}

$imageUri = "$Region-docker.pkg.dev/$ProjectId/$RepoName/$ImageName`:latest"

$null = Invoke-GCloud -Quiet config set project $ProjectId
$null = Invoke-GCloud -Quiet services enable run.googleapis.com cloudscheduler.googleapis.com artifactregistry.googleapis.com cloudbuild.googleapis.com secretmanager.googleapis.com iam.googleapis.com --project $ProjectId

$runnerSa = Ensure-ServiceAccount -ProjectId $ProjectId -AccountId "horus-runner" -DisplayName "Horus Runner"
$schedulerSa = Ensure-ServiceAccount -ProjectId $ProjectId -AccountId "horus-scheduler" -DisplayName "Horus Scheduler"

$null = Invoke-GCloud -Quiet projects add-iam-policy-binding $ProjectId --member "serviceAccount:$runnerSa" --role "roles/secretmanager.secretAccessor" --quiet
$null = Invoke-GCloud -Quiet projects add-iam-policy-binding $ProjectId --member "serviceAccount:$schedulerSa" --role "roles/run.invoker" --quiet

$repoResult = Invoke-GCloud -Quiet -AllowFailure artifacts repositories describe $RepoName --location $Region --project $ProjectId
if ($repoResult.ExitCode -ne 0) {
    $null = Invoke-GCloud -Quiet artifacts repositories create $RepoName --repository-format docker --location $Region --description "Imagens do robo Horus" --project $ProjectId
}

Push-Location $scriptDir
$null = Invoke-GCloud builds submit --tag $imageUri --project $ProjectId
Pop-Location

$secretResult = Invoke-GCloud -Quiet -AllowFailure secrets describe horus-service-account --project $ProjectId
if ($secretResult.ExitCode -ne 0) {
    $null = Invoke-GCloud -Quiet secrets create horus-service-account --replication-policy automatic --project $ProjectId
}
$null = Invoke-GCloud -Quiet secrets versions add horus-service-account --data-file $serviceAccountFile --project $ProjectId

$envVars = @(
    "GOOGLE_SHEET_ID=$SheetId",
    "GOOGLE_WORKSHEET_NAME=$WorksheetName",
    "GOOGLE_SERVICE_ACCOUNT_JSON=/secrets/service_account.json",
    "HORUS_URL=$HorusUrl",
    "HEADLESS=true",
    "MANUAL_LOGIN=false",
    "SCREENSHOT_DIR=/tmp/screenshots",
    "EVIDENCE_DIR=/tmp/evidence",
    "STATE_FILE=/tmp/storage_state.json"
)
if ($WebhookUrl) {
    $envVars += "BOT_WEBHOOK_URL=$WebhookUrl"
}
$envVarsArg = [string]::Join(",", $envVars)

$commonArgs = @(
    $JobName,
    "--image", $imageUri,
    "--region", $Region,
    "--project", $ProjectId,
    "--service-account", $runnerSa,
    "--tasks", "1",
    "--max-retries", "1",
    "--task-timeout", "900s",
    "--cpu", "1",
    "--memory", "1Gi",
    "--set-env-vars", $envVarsArg,
    "--set-secrets", "/secrets/service_account.json=horus-service-account:latest"
)

$jobResult = Invoke-GCloud -Quiet -AllowFailure run jobs describe $JobName --region $Region --project $ProjectId
if ($jobResult.ExitCode -eq 0) {
    $null = Invoke-GCloud -Quiet run jobs update @commonArgs
} else {
    $null = Invoke-GCloud -Quiet run jobs create @commonArgs
}

$runJobUri = "https://$Region-run.googleapis.com/apis/run.googleapis.com/v1/namespaces/$ProjectId/jobs/$JobName:run"
$schedulerArgs = @(
    $SchedulerName,
    "--location", $Region,
    "--project", $ProjectId,
    "--schedule", $Schedule,
    "--time-zone", $Timezone,
    "--uri", $runJobUri,
    "--http-method", "POST",
    "--oauth-service-account-email", $schedulerSa,
    "--oauth-token-scope", "https://www.googleapis.com/auth/cloud-platform"
)

$schedulerResult = Invoke-GCloud -Quiet -AllowFailure scheduler jobs describe $SchedulerName --location $Region --project $ProjectId
if ($schedulerResult.ExitCode -eq 0) {
    $null = Invoke-GCloud -Quiet scheduler jobs update http @schedulerArgs
} else {
    $null = Invoke-GCloud -Quiet scheduler jobs create http @schedulerArgs
}

Write-Output ""
Write-Output "Deploy finalizado."
Write-Output "Imagem: $imageUri"
Write-Output "Job: $JobName"
Write-Output "Scheduler: $SchedulerName ($Schedule)"
Write-Output ""
Write-Output "Teste manual:"
Write-Output "gcloud run jobs execute $JobName --region $Region --project $ProjectId --wait"
