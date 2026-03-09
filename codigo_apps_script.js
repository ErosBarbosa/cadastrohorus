// ============================================
// Hórus Registration Form - Google Apps Script
// ============================================
// Instruções:
// 1. Abra sua planilha do Google Sheets
// 2. Vá em Extensões > Apps Script
// 3. Cole este código apagando o que estiver lá
// 4. Clique em Implantar > Nova implantação
// 5. Tipo: App da Web
// 6. Executar como: Você
// 7. Quem tem acesso: Qualquer pessoa
// 8. Copie a URL gerada e cole no `script.js` (APPS_SCRIPT_URL)
// ============================================

const SHEET_NAME = 'Fila Automacao'; // Altere se o nome da sua aba for diferente

function doPost(e) {
    try {
        // Pegar a planilha ativa e a aba
        const doc = SpreadsheetApp.getActiveSpreadsheet();
        const sheet = doc.getSheetByName(SHEET_NAME);

        // Se a aba não existir, retornar erro
        if (!sheet) {
            return ContentService.createTextOutput(JSON.stringify({
                "status": "error",
                "message": "Aba '" + SHEET_NAME + "' não encontrada na planilha."
            })).setMimeType(ContentService.MimeType.JSON);
        }

        // Fazer o parse dos dados JSON recebidos do formulário
        const dados = JSON.parse(e.postData.contents);

        // Ler o cabeçalho (primeira linha) para saber a ordem das colunas
        const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

        // Criar um array para a nova linha do tamanho do cabeçalho
        const newRow = new Array(headers.length).fill('');

        // Gerar uma chave única baseada no timestamp
        const timestamp = new Date();
        const chave = "REG-" + timestamp.getTime();

        // Preencher a nova linha mapeando os campos
        for (let i = 0; i < headers.length; i++) {
            const colName = headers[i].toString().trim();

            switch (colName) {
                case 'chave':
                    newRow[i] = chave;
                    break;
                case 'nome_completo':
                    newRow[i] = dados.nome_completo || '';
                    break;
                case 'cpf':
                    newRow[i] = dados.cpf || '';
                    break;
                case 'email':
                    newRow[i] = dados.email || '';
                    break;
                case 'ddd':
                    newRow[i] = dados.ddd || '';
                    break;
                case 'telefone_sem_ddd':
                    newRow[i] = dados.telefone || '';
                    break;
                case 'telefone_completo':
                    newRow[i] = (dados.ddd && dados.telefone) ? `(${dados.ddd}) ${dados.telefone}` : '';
                    break;
                case 'cargo_funcao':
                    newRow[i] = dados.cargo_funcao || '';
                    break;
                case 'unidade_setor':
                    newRow[i] = dados.unidade_setor || '';
                    break;
                case 'tipo_acao':
                    newRow[i] = dados.tipo_acao || 'CADASTRO';
                    break;
                case 'status_automacao':
                    newRow[i] = 'PENDENTE'; // Força para PENDENTE para o bot ler
                    break;
                case 'data_solicitacao':
                    newRow[i] = Utilities.formatDate(timestamp, "America/Sao_Paulo", "dd/MM/yyyy HH:mm:ss");
                    break;
            }
        }

        // Se a aba estiver vazia (sem cabeçalhos), não conseguimos inserir
        if (headers.length === 0 || headers[0] === "") {
            // Fallback genérico caso a planilha não tenha os cabeçalhos esperados
            sheet.appendRow([
                chave,
                dados.nome_completo,
                dados.cpf,
                dados.email,
                `(${dados.ddd}) ${dados.telefone}`,
                dados.cargo_funcao,
                dados.unidade_setor,
                dados.tipo_acao,
                'PENDENTE',
                Utilities.formatDate(timestamp, "America/Sao_Paulo", "dd/MM/yyyy HH:mm:ss")
            ]);
        } else {
            // Inserir a nova linha mapeada de acordo com os cabeçalhos
            sheet.appendRow(newRow);
        }

        // Retornar sucesso
        return ContentService.createTextOutput(JSON.stringify({
            "status": "success",
            "message": "Registro inserido com sucesso!"
        })).setMimeType(ContentService.MimeType.JSON);

    } catch (error) {
        // Retornar erro
        return ContentService.createTextOutput(JSON.stringify({
            "status": "error",
            "message": error.toString()
        })).setMimeType(ContentService.MimeType.JSON);
    }
}

// Para lidar com requisições OPTIONS (CORS - preflight)
function doOptions(e) {
    const output = ContentService.createTextOutput();
    output.setMimeType(ContentService.MimeType.TEXT);
    output.setContent('');
    return output;
}
