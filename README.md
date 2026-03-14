# Automacao Horus / SCAWEB

Projeto de automacao do fluxo de cadastro de usuarios no SCAWEB/Horus, com entrada via Google Forms/Sheets, Apps Script para organizar a fila e um bot Python com Playwright para executar o cadastro.

## Estrutura

- `apps_script/Code.gs`: script da planilha que monta e atualiza a aba `Fila Automacao`.
- `python_bot/run_bot.py`: bot principal que le a fila e executa o cadastro.
- `python_bot/selectors.json`: seletores usados pelo Playwright.
- `python_bot/.env.example`: exemplo de configuracao local.
- `python_bot/service_account.example.json`: modelo de credencial da service account.
- `docs/GUIA_IMPLANTACAO.md`: guia de configuracao local.
- `docs/GCP_PROXIMOS_PASSOS.md`: resumo do deploy automatizado no Google Cloud.
- `.agents/skills/`: instrucoes auxiliares para orientar o agente durante manutencao e evolucao do projeto.

## Fluxo automatizado

1. O Google Forms recebe a solicitacao.
2. O Apps Script organiza os dados na aba `Fila Automacao`.
3. O bot Python abre o SCAWEB/Horus, preenche os campos e tenta concluir o cadastro.
4. O status da linha e atualizado na planilha.

## Publicacao

Este repositorio foi preparado para GitHub sem arquivos locais sensiveis. Nao versione:

- `python_bot/.env`
- `python_bot/service_account.json`
- `python_bot/.venv/`
- `python_bot/logs/`

## Observacoes

- A primeira validacao deve ser feita com `HEADLESS=false`.
- O projeto ainda depende de sessao valida no SCAWEB/Horus; se o login nao estiver persistido, a execucao em nuvem precisa de ajuste adicional.
- Os seletores foram montados com base no comportamento observado do sistema e podem exigir manutencao quando o HTML mudar.
