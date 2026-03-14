const ABA_RESPOSTAS = 'Respostas ao formulário 1';
const ABA_FILA = 'Fila Automacao';
const ABA_LOG = 'Log Automacao';

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Automação Hórus')
    .addItem('Preparar fila', 'prepararFilaAutomacao')
    .addItem('Criar gatilho automático', 'criarGatilhoFormulario')
    .addToUi();
}

function criarGatilhoFormulario() {
  const ss = SpreadsheetApp.getActive();
  const existe = ScriptApp.getProjectTriggers().some(t => t.getHandlerFunction() === 'prepararFilaAutomacao');
  if (!existe) {
    ScriptApp.newTrigger('prepararFilaAutomacao').forSpreadsheet(ss).onFormSubmit().create();
  }
  SpreadsheetApp.getUi().alert('Gatilho criado. A fila será atualizada a cada novo envio do formulário.');
}

function prepararFilaAutomacao() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const abaRespostas = ss.getSheetByName(ABA_RESPOSTAS) || ss.getSheets()[0];
  if (!abaRespostas) throw new Error('Aba de respostas não encontrada.');

  let abaFila = ss.getSheetByName(ABA_FILA);
  let abaLog = ss.getSheetByName(ABA_LOG);
  if (!abaFila) abaFila = ss.insertSheet(ABA_FILA);
  if (!abaLog) abaLog = ss.insertSheet(ABA_LOG);

  const dados = abaRespostas.getDataRange().getValues();
  if (dados.length < 2) {
    inicializarFila_(abaFila);
    inicializarLog_(abaLog);
    return;
  }

  const cab = dados[0];
  const idx = {
    carimbo: cab.indexOf('Carimbo de data/hora'),
    emailForm: cab.indexOf('Endereço de e-mail'),
    nome: cab.indexOf('Nome Completo'),
    cpf: cab.indexOf('CPF'),
    cargo: cab.indexOf('Cargo/Função'),
    unidade: cab.indexOf('Unidade Básica de Saúde (UBS) ou Setor'),
    email: cab.indexOf('E-mail'),
    telefone: cab.indexOf('NúmerodeTelefone(WhatsApp)'),
    dificuldade: cab.indexOf('Está com alguma dificuldade ao utilizar o sistema?')
  };

  if ([idx.nome, idx.cpf, idx.unidade].some(v => v === -1)) {
    throw new Error('Uma ou mais colunas obrigatórias não foram encontradas.');
  }

  const filaAtual = lerFilaAtual_(abaFila);
  const cpfs = {};
  const emails = {};
  const novaFila = [];

  dados.slice(1).forEach((linha, i) => {
    const nome = String(linha[idx.nome] || '').trim();
    const cpf = normalizarNumeros_(linha[idx.cpf]);
    const emailForm = String(linha[idx.emailForm] || '').trim();
    const email = String(linha[idx.email] || emailForm).trim();
    const telefone = normalizarNumeros_(linha[idx.telefone]);
    const ddd = telefone.length >= 10 ? telefone.substring(0, 2) : '';
    const telefoneSemDdd = telefone.length >= 10 ? telefone.substring(2) : telefone;
    const unidade = String(linha[idx.unidade] || '').trim();
    const cargo = String(linha[idx.cargo] || '').trim();
    const dificuldade = String(linha[idx.dificuldade] || '').trim().toUpperCase();
    const chave = cpf || [nome, email, telefone].join('|');
    const anterior = filaAtual[chave] || {};

    let duplicidades = [];
    if (cpf) {
      if (cpfs[cpf]) duplicidades.push('CPF repetido');
      cpfs[cpf] = true;
    }
    if (email) {
      if (emails[email]) duplicidades.push('E-mail repetido');
      emails[email] = true;
    }

    const hashConteudo = Utilities.base64EncodeWebSafe(
      Utilities.computeDigest(
        Utilities.DigestAlgorithm.MD5,
        [nome, cpf, email, telefone, unidade, cargo].join('|')
      )
    );

    let status = anterior.status_automacao || 'PENDENTE';
    let observacao = anterior.observacao_automacao || '';

    if (!nome || !cpf) {
      status = 'IGNORADO';
      observacao = 'Registro sem nome ou CPF.';
    }
    if (duplicidades.length > 0) {
      status = 'IGNORADO';
      observacao = duplicidades.join(' | ');
    }

    novaFila.push([
      chave,
      i + 2,
      linha[idx.carimbo] || '',
      nome.toUpperCase(),
      cpf,
      cargo,
      unidade,
      email,
      telefone,
      ddd,
      telefoneSemDdd,
      dificuldade === 'SIM' ? 'SIM' : 'NAO',
      'SECRETARIA MUNICIPAL DE SAÚDE OEIRAS',
      'OEIRAS - PI',
      'MUNICIPAL',
      'BRASIL',
      '55',
      '341',
      'HÓRUS - BÁSICO / ESTRATÉGICO',
      'ATUALIZAÇÃO CADASTRAL',
      duplicidades.join(' | '),
      status,
      observacao,
      anterior.tentativas || 0,
      anterior.ultima_tentativa || '',
      anterior.data_envio || '',
      hashConteudo
    ]);

    registrarLog_(abaLog, [new Date(), chave, status, observacao || 'Sincronizado na fila']);
  });

  inicializarFila_(abaFila);
  if (novaFila.length > 0) {
    abaFila.getRange(2, 1, novaFila.length, novaFila[0].length).setValues(novaFila);
  }
  abaFila.setFrozenRows(1);
  abaFila.autoResizeColumns(1, abaFila.getLastColumn());
}

function inicializarFila_(aba) {
  aba.clear();
  aba.getRange(1, 1, 1, 27).setValues([[
    'chave', 'linha_origem', 'carimbo_data_hora', 'nome_completo', 'cpf', 'cargo_funcao',
    'unidade_setor', 'email', 'telefone_completo', 'ddd', 'telefone_sem_ddd', 'tem_dificuldade',
    'entidade_padrao', 'cidade_padrao', 'esfera', 'pais', 'ddi', 'sistema_codigo', 'sistema_nome',
    'justificativa', 'duplicidades', 'status_automacao', 'observacao_automacao', 'tentativas',
    'ultima_tentativa', 'data_envio', 'hash_conteudo'
  ]]);
}

function inicializarLog_(aba) {
  aba.clear();
  aba.getRange(1, 1, 1, 4).setValues([['data_hora', 'chave', 'status', 'observacao']]);
}

function lerFilaAtual_(aba) {
  const dados = aba.getDataRange().getValues();
  if (dados.length < 2) return {};
  const cab = dados[0];
  const idx = {};
  cab.forEach((c, i) => idx[c] = i);
  const mapa = {};
  dados.slice(1).forEach(l => {
    mapa[String(l[idx['chave']])] = {
      status_automacao: l[idx['status_automacao']],
      observacao_automacao: l[idx['observacao_automacao']],
      tentativas: l[idx['tentativas']],
      ultima_tentativa: l[idx['ultima_tentativa']],
      data_envio: l[idx['data_envio']]
    };
  });
  return mapa;
}

function registrarLog_(aba, linha) {
  if (aba.getLastRow() === 0) inicializarLog_(aba);
  aba.appendRow(linha);
}

function normalizarNumeros_(valor) {
  return String(valor || '').replace(/\D/g, '');
}
