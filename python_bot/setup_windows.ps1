python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
playwright install chromium
Copy-Item .env.example .env -Force
if (Test-Path selectors.example.json) {
    Copy-Item selectors.example.json selectors.json -Force
} elseif (-not (Test-Path selectors.json)) {
    Write-Error 'selectors.example.json e selectors.json nao encontrados.'
    exit 1
}
if ((Test-Path service_account.example.json) -and (-not (Test-Path service_account.json))) {
    Copy-Item service_account.example.json service_account.json -Force
}
Write-Host 'Ambiente criado. Agora preencha .env e service_account.json.'
