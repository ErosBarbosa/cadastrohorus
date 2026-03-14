# Proximos Passos para Subir no GCP

## 1) Pre-requisitos locais
1. Instalar `gcloud` e fazer login:
```powershell
gcloud auth login
gcloud auth application-default login
```
2. Garantir que `python_bot/service_account.json` exista no seu ambiente local.

## 2) Deploy automatizado (recomendado)
Na pasta `python_bot`, execute:
```powershell
.\deploy_gcp.ps1 -ProjectId SEU_PROJECT_ID -SheetId SEU_GOOGLE_SHEET_ID
```

O script atualizado faz tudo isto automaticamente:
- habilita as APIs necessarias;
- cria/atualiza o Secret Manager `horus-service-account`;
- publica a imagem no Artifact Registry;
- cria/atualiza o Cloud Run Job;
- monta o segredo como arquivo em `/secrets/service_account.json`;
- define `GOOGLE_SERVICE_ACCOUNT_JSON=/secrets/service_account.json`;
- cria/atualiza o Cloud Scheduler.

Opcional:
```powershell
.\deploy_gcp.ps1 -ProjectId SEU_PROJECT_ID -SheetId SEU_GOOGLE_SHEET_ID -Region southamerica-east1 -Schedule "*/10 * * * *"
```

## 3) Testar execucao
```powershell
gcloud run jobs execute horus-cadastro-job --region southamerica-east1 --project SEU_PROJECT_ID --wait
```

## 4) Observabilidade
1. Ver logs do Job:
```powershell
gcloud run jobs executions list --job horus-cadastro-job --region southamerica-east1 --project SEU_PROJECT_ID
```
2. Se houver erro, abrir detalhes no Cloud Logging.

## 5) Configuracao cloud usada pelo script
1. `MANUAL_LOGIN=false`
2. `HEADLESS=true`
3. Credencial Google via Secret Manager montada como arquivo:
- segredo: `horus-service-account`
- arquivo no container: `/secrets/service_account.json`
- variavel no job: `GOOGLE_SERVICE_ACCOUNT_JSON=/secrets/service_account.json`

## 6) Se o job ja existia e continua falhando
1. Rode novamente o `deploy_gcp.ps1` atualizado.
2. No Cloud Run Job, confirme que:
- existe a variavel `GOOGLE_SERVICE_ACCOUNT_JSON=/secrets/service_account.json`;
- o secret `horus-service-account` esta montado em `/secrets/service_account.json`;
- a variavel antiga `GOOGLE_SERVICE_ACCOUNT_JSON_INLINE` nao esta mais sendo usada.
