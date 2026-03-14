# Relatorio de implantacao online - Automacao Horus (12/03/2026)

## 1) Objetivo
Colocar a automacao para rodar 100% online, sem depender de PC local ligado, usando servicos Google Cloud e mantendo Google Sheets/Apps Script no fluxo.

## 2) Arquitetura recomendada (Google)
1. Entrada de dados:
- `formulario/` hospedado em Cloud Storage (site estatico) ou Firebase Hosting.
- Frontend envia JSON para Apps Script Web App (`doPost`) para gravar na aba `Fila Automacao`.

2. Orquestracao:
- Cloud Scheduler dispara Cloud Run Job em intervalo fixo (ex.: a cada 5 min).
- Opcional: Apps Script tambem pode disparar execucao sob demanda quando chegar novo formulario.

3. Execucao do robo:
- `python_bot/run_bot.py` dentro de container no Cloud Run Jobs.
- Execucao headless com Playwright Chromium.

4. Segredos e configuracao:
- Secret Manager para `service_account.json`, webhook e credenciais.
- Variaveis de ambiente no Job (sem segredo em arquivo no repositorio).

5. Entrega e observabilidade:
- Artifact Registry para imagem Docker.
- Cloud Build para build/deploy automatico.
- Cloud Logging + alerta (erro de execucao).

## 3) Ajustes tecnicos obrigatorios no seu codigo
1. Login interativo nao funciona em nuvem:
- O codigo atual usa `input()` para login manual quando `MANUAL_LOGIN=true`.
- Em Cloud Run isso precisa ficar `MANUAL_LOGIN=false` e login deve ser automatizado.

2. Estado de sessao:
- O arquivo `logs/storage_state.json` hoje e local.
- Em nuvem, persistir estado em Secret Manager (ou Cloud Storage) e restaurar antes da execucao.

3. Seguranca:
- Nao manter `service_account.json` no repositorio final; usar segredo injetado no runtime.

## 4) Custos estimados (USD)
Baseados nos precos oficiais pesquisados em 12/03/2026.

### 4.1 Cloud Run Jobs (com 1 vCPU e 1 GiB)
- CPU: USD 0.000018 por vCPU-segundo.
- Memoria: USD 0.000002 por GiB-segundo.
- Free tier mensal: 240.000 vCPU-s + 450.000 GiB-s.
- Jobs sao cobrados por tempo de instancia com minimo de 1 minuto por execucao.

Formula simplificada (mensal):
- `vcpu_s = numero_execucoes * duracao_media_segundos`
- `mem_s = numero_execucoes * duracao_media_segundos`
- `custo_cpu = max(0, vcpu_s - 240000) * 0.000018`
- `custo_mem = max(0, mem_s - 450000) * 0.000002`

### 4.2 Outros servicos
- Cloud Scheduler: USD 0.10 por job/mes (3 jobs gratis por billing account).
- Secret Manager:
  - USD 0.06 por versao ativa/mes
  - USD 0.03 por 10.000 operacoes de acesso
  - Free tier: 6 versoes + 10.000 acessos/mes
- Artifact Registry (storage):
  - ate 0.5 GB gratis
  - acima disso: USD 0.10 por GB/mes
- Cloud Build:
  - 2.500 build-minutos gratis/mes
  - e2-standard-2: USD 0.006 por minuto apos free tier
- Cloud Logging:
  - primeiros 50 GiB/mes gratis por projeto
  - depois: USD 0.50 por GiB

### 4.3 Cenarios praticos de custo
Premissa: 1 execucao por solicitacao, 2 minutos por execucao, 1 vCPU/1 GiB.

1. Ate 2.000 solicitacoes/mes:
- Cloud Run: ~USD 0.00 (dentro do free tier)
- Outros (Scheduler, segredos, storage leve): ~USD 0.00 a 0.50
- Total estimado: ~USD 0.00 a 0.50/mes

2. 5.000 solicitacoes/mes:
- Cloud Run CPU: (600.000 - 240.000) * 0.000018 = USD 6.48
- Cloud Run Memoria: (600.000 - 450.000) * 0.000002 = USD 0.30
- Outros: ~USD 0.20 a 1.00
- Total estimado: ~USD 6.98 a 7.78/mes

3. 10.000 solicitacoes/mes:
- Cloud Run CPU: (1.200.000 - 240.000) * 0.000018 = USD 17.28
- Cloud Run Memoria: (1.200.000 - 450.000) * 0.000002 = USD 1.50
- Outros: ~USD 0.20 a 2.00
- Total estimado: ~USD 18.98 a 20.78/mes

## 5) Compensa financeiramente?
Em geral, sim.

Com o seu tipo de automacao, o custo tende a ficar baixo enquanto elimina:
- dependencia de maquina local ligada 24/7;
- risco operacional de quedas por energia/internet local;
- manutencao manual de rotina.

Ponto de atencao: `southamerica-east1` (Sao Paulo) esta em Tier 2 no Cloud Run; o valor final pode ficar acima das contas-base acima (que usam os valores padrao exibidos nas tabelas oficiais). Antes de fechar, valide no Pricing Calculator com a regiao final.

## 6) Fontes oficiais (precos e limites)
- Cloud Run pricing: https://cloud.google.com/run/pricing
- Cloud Scheduler pricing: https://cloud.google.com/scheduler/pricing
- Secret Manager pricing: https://cloud.google.com/secret-manager/pricing
- Artifact Registry pricing: https://cloud.google.com/artifact-registry/pricing
- Cloud Build pricing: https://cloud.google.com/build/pricing
- Cloud Logging / Observability pricing: https://cloud.google.com/stackdriver/pricing
- Apps Script quotas: https://developers.google.com/apps-script/guides/services/quotas
- Google Sheets API limits/pricing note: https://developers.google.com/workspace/sheets/api/limits
- Cloud Pricing Calculator: https://cloud.google.com/products/calculator
