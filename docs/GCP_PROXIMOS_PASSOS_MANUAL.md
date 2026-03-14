# PASSO A PASSO PARA FAZER O JOB FUNCIONAR NO GCP

Use este guia se o deploy para o Google Cloud foi criado, mas o `horus-cadastro-job` nao consegue ler a credencial da planilha.

## Caminho recomendado

O jeito mais simples agora e rerodar o script atualizado:

```powershell
cd horus_automacao\python_bot
.\deploy_gcp.ps1 -ProjectId SEU_PROJECT_ID -SheetId SEU_GOOGLE_SHEET_ID
```

Esse script:
- envia `service_account.json` para o Secret Manager;
- monta o segredo em `/secrets/service_account.json`;
- define `GOOGLE_SERVICE_ACCOUNT_JSON=/secrets/service_account.json`;
- atualiza o Cloud Run Job e o Scheduler.

## Se voce quiser conferir manualmente no console

### 1) Verifique o Secret Manager
1. Abra o Secret Manager no projeto correto.
2. Confirme que existe o segredo `horus-service-account`.
3. Abra o segredo e confira se ha pelo menos uma versao ativa.
4. Se nao houver versao, envie o arquivo local `horus_automacao/python_bot/service_account.json`.

### 2) Verifique o Cloud Run Job
1. Abra `Cloud Run`.
2. Entre no job `horus-cadastro-job`.
3. Clique em `Editar job`.
4. Na configuracao do container, confirme a variavel:

```text
GOOGLE_SERVICE_ACCOUNT_JSON=/secrets/service_account.json
```

5. Na configuracao de secrets, confirme que o segredo `horus-service-account` esta montado exatamente neste caminho:

```text
/secrets/service_account.json
```

6. Se ainda existir a variavel antiga abaixo, remova:

```text
GOOGLE_SERVICE_ACCOUNT_JSON_INLINE
```

7. Salve a atualizacao do job.

## Teste final

Execute o job manualmente:

```powershell
gcloud run jobs execute horus-cadastro-job --region southamerica-east1 --project SEU_PROJECT_ID --wait
```

Se o ajuste estiver correto, o erro de credencial deve desaparecer e os logs devem mostrar o inicio normal da automacao.
