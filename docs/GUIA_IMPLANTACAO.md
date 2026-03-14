# Guia de implantacao

## 1) Google Sheets

1. Abra a planilha ligada ao Google Forms.
2. Va em `Extensoes > Apps Script`.
3. Cole o conteudo de `apps_script/Code.gs`.
4. Salve o projeto.
5. Execute `prepararFilaAutomacao` uma vez.
6. Depois execute `criarGatilhoFormulario`.

A planilha criara a aba `Fila Automacao` com estes campos principais:

- `nome_completo`
- `cpf`
- `email`
- `telefone_completo`
- `ddd`
- `telefone_sem_ddd`
- `entidade_padrao`
- `cidade_padrao`
- `esfera`
- `sistema_codigo`
- `sistema_nome`
- `status_automacao`
- `observacao_automacao`

## 2) Python / Playwright

1. Instale Python 3.11+.
2. Abra a pasta `python_bot` no terminal.
3. Rode:

```bash
python -m venv .venv
```

Windows:

```bash
.venv\Scripts\activate
```

Linux/Mac:

```bash
source .venv/bin/activate
```

4. Instale dependencias:

```bash
pip install -r requirements.txt
playwright install chromium
```

5. Copie `.env.example` para `.env`.
6. Preencha `service_account.json` a partir de `service_account.example.json`.
7. Compartilhe a planilha com o e-mail da service account.
8. Rode o bot:

```bash
python run_bot.py --limit 1
```

## 3) Primeiro teste recomendado

- Deixe so 1 linha como `PENDENTE`.
- Execute em modo visual.
- Faca o login manual.
- Confira se o bot:
  - chega na tela de cadastro,
  - preenche os campos,
  - marca `HORUS - BASICO / ESTRATEGICO`,
  - clica em `Gravar`,
  - detecta a URL `solicitacaoPerfil.do`.

## 4) Ajustes mais comuns

Se um campo nao for encontrado, ajuste `selectors.json`.

Se o sistema abrir o popup em outra janela/modal, atualize os grupos:
- `popup_entidade`
- `popup_cidade`

Se o sistema mudar o codigo do Horus, altere:
- `sistema_codigo`
- `sistema_nome`
