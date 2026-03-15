// ============================================
// Horus Registration Form - JavaScript Logic
// ============================================

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx-crCng7IIymeazroCwvWhoIXxtYFopMFC6vZZ_g-ZFsIvDVQ0hww3CG6NflWvEWwa/exec';

const STORAGE_PROFILE_KEY = 'horus_cadastro_perfil';
const STORAGE_THEME_KEY = 'horus_theme';
const STORAGE_DRAFT_KEY = 'horus_cadastro_rascunho';

const DRAFT_FIELD_IDS = [
    'nome_completo',
    'email',
    'cpf',
    'ddd',
    'telefone',
    'cargo_funcao',
    'cargo_outro',
    'unidade_urbana',
    'unidade_rural',
    'unidade_2',
    'unidade_outra',
    'justificativa',
    'confirmacao_envio',
];

let currentStep = 1;
let draftTimer = null;

const byId = (id) => document.getElementById(id);

const LEGACY_CARGO_FIXES = {
    'M\uFFFDDICO(A)': 'MÉDICO(A)',
    'MÃ‰DICO(A)': 'MÉDICO(A)',
    'MEDICO(A)': 'MÉDICO(A)',
    'T\uFFFDCNICO(A) DE ENFERMAGEM': 'TÉCNICO(A) DE ENFERMAGEM',
    'TÃ‰CNICO(A) DE ENFERMAGEM': 'TÉCNICO(A) DE ENFERMAGEM',
    'TECNICO(A) DE ENFERMAGEM': 'TÉCNICO(A) DE ENFERMAGEM',
    'FARMAC\uFFFDUTICO(A)': 'FARMACÊUTICO(A)',
    'FARMACÃŠUTICO(A)': 'FARMACÊUTICO(A)',
    'FARMACEUTICO(A)': 'FARMACÊUTICO(A)',
    'AGENTE COMUNITÁRIO DE SA\uFFFDDE': 'AGENTE COMUNITÁRIO DE SAÚDE',
    'AGENTE COMUNITÃRIO DE SAÃšDE': 'AGENTE COMUNITÁRIO DE SAÚDE',
    'AGENTE COMUNITARIO DE SAUDE': 'AGENTE COMUNITÁRIO DE SAÚDE',
};

function decodeLegacyText(value) {
    if (!value) return '';
    const raw = String(value).trim();
    try {
        return decodeURIComponent(escape(raw));
    } catch {
        return raw;
    }
}

function normalizeLegacyText(value) {
    if (!value) return '';
    const decoded = decodeLegacyText(value);
    return decoded.replace(/\uFFFD/g, '').trim();
}

function normalizeCargoValue(value) {
    if (!value) return '';

    const raw = String(value).trim().toUpperCase();
    if (LEGACY_CARGO_FIXES[raw]) return LEGACY_CARGO_FIXES[raw];

    const decoded = decodeLegacyText(raw).toUpperCase();
    if (LEGACY_CARGO_FIXES[decoded]) return LEGACY_CARGO_FIXES[decoded];

    const plain = decoded.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (LEGACY_CARGO_FIXES[plain]) return LEGACY_CARGO_FIXES[plain];

    return decoded.replace(/\uFFFD/g, '');
}

function normalizeProfileData(profile = {}) {
    return {
        nome_completo: normalizeLegacyText(profile.nome_completo || '').toUpperCase(),
        email: normalizeLegacyText(profile.email || '').toLowerCase(),
        cpf: normalizeLegacyText(profile.cpf || ''),
        ddd: normalizeLegacyText(profile.ddd || ''),
        telefone: normalizeLegacyText(profile.telefone || ''),
        cargo_funcao: normalizeCargoValue(profile.cargo_funcao || ''),
    };
}

// === MASKS ===
function applyCpfMask(value) {
    let v = value.replace(/\D/g, '');
    if (v.length > 11) v = v.slice(0, 11);
    if (v.length > 9) return v.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
    if (v.length > 6) return v.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    if (v.length > 3) return v.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    return v;
}

function initMasks() {
    byId('cpf').addEventListener('input', (e) => {
        e.target.value = applyCpfMask(e.target.value);
    });

    byId('ddd').addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '').slice(0, 2);
    });

    byId('telefone').addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '').slice(0, 9);
    });

    // Mantem digitacao natural no campo de nome.
}

function formatHourMinute(date) {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function setDraftStatus(message, type = 'default') {
    const draftStatus = byId('draftStatus');
    if (!draftStatus) return;

    draftStatus.textContent = message;
    draftStatus.classList.remove('is-saved', 'is-error');

    if (type === 'saved') draftStatus.classList.add('is-saved');
    if (type === 'error') draftStatus.classList.add('is-error');
}

function captureDraftData() {
    const draft = {
        _current_step: currentStep,
        _show_second_unit: byId('group_unidade_2').style.display !== 'none',
        _saved_at: new Date().toISOString(),
    };

    DRAFT_FIELD_IDS.forEach((id) => {
        const field = byId(id);
        if (!field) return;
        draft[id] = field.type === 'checkbox' ? field.checked : field.value;
    });

    const tipo = document.querySelector('input[name="tipo_acao"]:checked');
    const zona = document.querySelector('input[name="zona_unidade"]:checked');
    draft.tipo_acao = tipo ? tipo.value : '';
    draft.zona_unidade = zona ? zona.value : '';

    return draft;
}

function saveDraftNow() {
    const successStepVisible = byId('stepSuccess').classList.contains('active');
    if (successStepVisible) return;

    try {
        const draft = captureDraftData();
        localStorage.setItem(STORAGE_DRAFT_KEY, JSON.stringify(draft));
        setDraftStatus(`Rascunho salvo às ${formatHourMinute(new Date())}`, 'saved');
    } catch {
        setDraftStatus('Falha ao salvar rascunho no dispositivo.', 'error');
    }
}

function scheduleDraftSave() {
    window.clearTimeout(draftTimer);
    draftTimer = window.setTimeout(saveDraftNow, 380);
}

function clearDraft() {
    localStorage.removeItem(STORAGE_DRAFT_KEY);
    setDraftStatus('Rascunho não salvo');
}

function aplicarValorRadio(name, value) {
    if (!value) return;
    const radio = document.querySelector(`input[name="${name}"][value="${value}"]`);
    if (radio) radio.checked = true;
}

function restoreDraft() {
    const raw = localStorage.getItem(STORAGE_DRAFT_KEY);
    if (!raw) {
        setDraftStatus('Rascunho não salvo');
        return;
    }

    let draft;
    try {
        draft = JSON.parse(raw);
    } catch {
        localStorage.removeItem(STORAGE_DRAFT_KEY);
        setDraftStatus('Rascunho inválido removido.', 'error');
        return;
    }

    if (!draft || typeof draft !== 'object') return;

    DRAFT_FIELD_IDS.forEach((id) => {
        const field = byId(id);
        if (!field || !(id in draft)) return;

        if (field.type === 'checkbox') {
            field.checked = Boolean(draft[id]);
        } else {
            field.value = String(draft[id] || '');
        }
    });

    aplicarValorRadio('tipo_acao', draft.tipo_acao);
    aplicarValorRadio('zona_unidade', draft.zona_unidade);

    atualizarJustificativaGroup();
    atualizarZonaFields();

    if (draft._show_second_unit) {
        byId('group_unidade_2').style.display = 'block';
        byId('btn_add_unidade').style.display = 'none';
    }

    atualizarUnidadeState();

    const stepFromDraft = Number(draft._current_step || 1);
    if (stepFromDraft >= 2 && stepFromDraft <= 4) {
        if (stepFromDraft === 4) populateReview();
        setStep(stepFromDraft);
    }

    if (draft._saved_at) {
        setDraftStatus(`Rascunho restaurado (${formatHourMinute(new Date(draft._saved_at))})`, 'saved');
    } else {
        setDraftStatus('Rascunho restaurado.', 'saved');
    }
}

function initDraftAutosave() {
    const form = byId('formCadastro');
    if (!form) return;

    form.addEventListener('input', scheduleDraftSave);
    form.addEventListener('change', scheduleDraftSave);
}

// === STEP CONTROL ===
function setStep(step) {
    document.querySelectorAll('.form-step').forEach((el) => {
        el.classList.remove('active');
        el.style.display = 'none';
    });

    const target = byId(`step${step}`);
    if (target) {
        target.classList.add('active');
        target.style.display = 'block';
    }

    document.querySelectorAll('.progress-step').forEach((progressStep) => {
        const progressIndex = Number(progressStep.dataset.step);
        progressStep.classList.remove('active', 'completed');

        if (progressIndex < step) {
            progressStep.classList.add('completed');
        } else if (progressIndex === step) {
            progressStep.classList.add('active');
        }
    });

    currentStep = step;
    window.scrollTo({ top: 0, behavior: 'auto' });
}

function nextStep(step) {
    if (!validateStep(currentStep)) return;
    if (step === 4) populateReview();
    setStep(step);
}

function prevStep(step) {
    setStep(step);
}

window.nextStep = nextStep;
window.prevStep = prevStep;

// === DYNAMIC FIELDS ===
function atualizarPerfilPreview(unidade) {
    const preview = byId('perfil_preview');
    const previewText = byId('perfil_preview_text');

    if (!unidade || unidade === 'OUTRO') {
        preview.style.display = 'none';
        previewText.textContent = '';
        return;
    }

    const perfil = unidade.toUpperCase().includes('ALMOXARIFADO')
        ? 'Almoxarifado / CAF I'
        : 'Farmácia / Unidade de Saúde I';

    previewText.textContent = perfil;
    preview.style.display = 'block';
}

function atualizarJustificativaGroup() {
    const tipo = document.querySelector('input[name="tipo_acao"]:checked');
    const group = byId('justificativa_group');

    if (tipo && tipo.value === 'ATUALIZAR_PERFIL') {
        group.style.display = 'block';
        return;
    }

    group.style.display = 'none';
    byId('justificativa').value = '';
}

function atualizarZonaFields() {
    const zona = document.querySelector('input[name="zona_unidade"]:checked');
    const groupUrbana = byId('group_unidade_urbana');
    const groupRural = byId('group_unidade_rural');

    if (!zona) {
        groupUrbana.style.display = 'none';
        groupRural.style.display = 'none';
        return;
    }

    if (zona.value === 'URBANA') {
        groupUrbana.style.display = 'block';
        groupRural.style.display = 'none';
        byId('unidade_rural').value = '';
    } else {
        groupUrbana.style.display = 'none';
        groupRural.style.display = 'block';
        byId('unidade_urbana').value = '';
    }

    atualizarUnidadeState();
}

function getUnidadePrincipalSelecionada() {
    const zona = document.querySelector('input[name="zona_unidade"]:checked');
    if (!zona) return '';
    return zona.value === 'URBANA' ? byId('unidade_urbana').value : byId('unidade_rural').value;
}

function atualizarUnidadeState() {
    const unidade = getUnidadePrincipalSelecionada();
    const outroGroup = byId('unidade_outra_group');
    const btnAdd = byId('btn_add_unidade');
    const groupUnidade2 = byId('group_unidade_2');

    if (unidade === 'OUTRO') {
        outroGroup.style.display = 'block';
        btnAdd.style.display = 'none';
    } else {
        outroGroup.style.display = 'none';
        byId('unidade_outra').value = '';

        if (unidade && groupUnidade2.style.display === 'none') {
            btnAdd.style.display = 'inline-flex';
        } else if (!unidade) {
            btnAdd.style.display = 'none';
        }
    }

    atualizarPerfilPreview(unidade);
}

function initDynamicFields() {
    byId('cargo_funcao').addEventListener('change', function () {
        byId('cargo_outro_group').style.display = this.value === 'OUTRO' ? 'block' : 'none';
        if (this.value !== 'OUTRO') byId('cargo_outro').value = '';
    });

    document.querySelectorAll('input[name="tipo_acao"]').forEach((radio) => {
        radio.addEventListener('change', atualizarJustificativaGroup);
    });

    document.querySelectorAll('input[name="zona_unidade"]').forEach((radio) => {
        radio.addEventListener('change', atualizarZonaFields);
    });

    ['unidade_urbana', 'unidade_rural'].forEach((id) => {
        byId(id).addEventListener('change', atualizarUnidadeState);
    });

    byId('btn_add_unidade').addEventListener('click', () => {
        byId('group_unidade_2').style.display = 'block';
        byId('btn_add_unidade').style.display = 'none';
    });

    byId('btn_rem_unidade').addEventListener('click', () => {
        byId('group_unidade_2').style.display = 'none';
        byId('unidade_2').value = '';

        const unidade = getUnidadePrincipalSelecionada();
        if (unidade && unidade !== 'OUTRO') {
            byId('btn_add_unidade').style.display = 'inline-flex';
        }
    });
}

// === VALIDATION ===
function showError(fieldId, msg) {
    const field = byId(fieldId);
    if (field) field.classList.add('error');

    const errorSpan = byId(`erro_${fieldId}`)
        || (field && field.parentElement && field.parentElement.querySelector('.field-error'))
        || (field && field.closest('.form-group') && field.closest('.form-group').querySelector('.field-error'));

    if (errorSpan) errorSpan.textContent = msg;
}

function clearErrors() {
    document.querySelectorAll('.error').forEach((el) => el.classList.remove('error'));
    document.querySelectorAll('.field-error').forEach((el) => {
        el.textContent = '';
    });
}

function validarCPF(cpf) {
    const digits = cpf.replace(/\D/g, '');
    if (digits.length !== 11 || /^(\d)\1{10}$/.test(digits)) return false;

    let sum = 0;
    for (let i = 0; i < 9; i += 1) sum += Number(digits[i]) * (10 - i);
    let check = (sum * 10) % 11;
    if (check === 10) check = 0;
    if (check !== Number(digits[9])) return false;

    sum = 0;
    for (let i = 0; i < 10; i += 1) sum += Number(digits[i]) * (11 - i);
    check = (sum * 10) % 11;
    if (check === 10) check = 0;

    return check === Number(digits[10]);
}

function validateStep(step, { skipClear = false } = {}) {
    if (!skipClear) clearErrors();
    let valid = true;

    if (step === 1) {
        const tipo = document.querySelector('input[name="tipo_acao"]:checked');
        if (!tipo) {
            showError('tipo', 'Selecione o tipo de solicitação.');
            valid = false;
        }
    }

    if (step === 2) {
        const nome = byId('nome_completo').value.trim();
        const email = byId('email').value.trim();
        const cpf = byId('cpf').value;
        const ddd = byId('ddd').value.trim();
        const telefone = byId('telefone').value.trim();

        if (!nome || nome.length < 5) {
            showError('nome_completo', 'Digite seu nome completo.');
            valid = false;
        }

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showError('email', 'Digite um e-mail válido.');
            valid = false;
        }

        if (!validarCPF(cpf)) {
            showError('cpf', 'CPF inválido. Verifique os números digitados.');
            valid = false;
        }

        if (!ddd || ddd.length !== 2) {
            showError('ddd', 'DDD inválido.');
            valid = false;
        }

        if (!telefone || telefone.length < 8) {
            showError('telefone', 'Telefone inválido.');
            valid = false;
        }
    }

    if (step === 3) {
        const cargo = byId('cargo_funcao').value;
        const cargoOutro = byId('cargo_outro').value.trim();
        const zona = document.querySelector('input[name="zona_unidade"]:checked');
        const unidadePrincipal = getUnidadePrincipalSelecionada();
        const unidadeOutra = byId('unidade_outra').value.trim();

        if (!cargo) {
            showError('cargo_funcao', 'Selecione seu cargo.');
            valid = false;
        }

        if (cargo === 'OUTRO' && !cargoOutro) {
            showError('cargo_outro', 'Especifique seu cargo.');
            valid = false;
        }

        if (!zona) {
            showError('zona', 'Selecione a zona da unidade.');
            valid = false;
        }

        if (zona && !unidadePrincipal) {
            showError(zona.value === 'URBANA' ? 'unidade_urbana' : 'unidade_rural', 'Selecione sua unidade principal.');
            valid = false;
        }

        if (unidadePrincipal === 'OUTRO' && !unidadeOutra) {
            showError('unidade_outra', 'Informe o nome da unidade.');
            valid = false;
        }

        const groupUnidade2 = byId('group_unidade_2');
        const unidade2 = byId('unidade_2').value;
        if (groupUnidade2.style.display !== 'none') {
            if (!unidade2) {
                showError('unidade_2', 'Selecione a 2ª unidade ou remova o campo.');
                valid = false;
            } else if (unidade2 === unidadePrincipal) {
                showError('unidade_2', 'A 2ª unidade não pode ser igual à 1ª.');
                valid = false;
            }
        }
    }

    return valid;
}

function validateBeforeSubmit() {
    clearErrors();

    for (const step of [1, 2, 3]) {
        const isStepValid = validateStep(step, { skipClear: true });
        if (!isStepValid) return step;
    }

    const confirmacaoEnvio = byId('confirmacao_envio');
    if (confirmacaoEnvio && !confirmacaoEnvio.checked) {
        showError('confirmacao_envio', 'Confirme os dados para finalizar o envio.');
        return 4;
    }

    return 0;
}

// === REVIEW ===
function optionTextByValue(selectEl, value) {
    if (!selectEl) return '';
    const option = Array.from(selectEl.options).find((opt) => opt.value === value);
    return option ? option.text : value;
}

function unidadeTextoParaResumo() {
    const zona = document.querySelector('input[name="zona_unidade"]:checked');
    if (!zona) return '';

    const unidadeEl = zona.value === 'URBANA' ? byId('unidade_urbana') : byId('unidade_rural');
    const unidade = unidadeEl.value;

    let texto = unidade === 'OUTRO'
        ? byId('unidade_outra').value.trim()
        : optionTextByValue(unidadeEl, unidade);

    if (byId('group_unidade_2').style.display !== 'none') {
        const unidade2 = byId('unidade_2').value;
        if (unidade2) {
            const texto2 = unidade2 === 'OUTRO'
                ? byId('unidade_outra').value.trim()
                : optionTextByValue(byId('unidade_2'), unidade2);
            texto = `${texto} / ${texto2}`;
        }
    }

    return texto;
}

function populateReview() {
    const tipo = document.querySelector('input[name="tipo_acao"]:checked');
    const cargo = byId('cargo_funcao').value;

    byId('rev_nome').textContent = byId('nome_completo').value;
    byId('rev_email').textContent = byId('email').value;
    byId('rev_cpf').textContent = byId('cpf').value;
    byId('rev_telefone').textContent = `(${byId('ddd').value}) ${byId('telefone').value}`;

    byId('rev_tipo').textContent = tipo && tipo.value === 'ATUALIZAR_PERFIL'
        ? 'Atualizar perfil / Trocar UBS'
        : 'Novo cadastro';

    byId('rev_cargo').textContent = cargo === 'OUTRO'
        ? byId('cargo_outro').value.trim()
        : optionTextByValue(byId('cargo_funcao'), cargo);

    byId('rev_unidade').textContent = unidadeTextoParaResumo();
}

// === SUBMIT ===
function gerarProtocolo() {
    const year = new Date().getFullYear();
    const sequence = Math.floor(Math.random() * 9000 + 1000);
    return `HOR-${year}-${sequence}`;
}

function buildPayload(protocolo) {
    const tipo = document.querySelector('input[name="tipo_acao"]:checked');
    const cargo = byId('cargo_funcao').value;
    const cargoFinal = cargo === 'OUTRO' ? byId('cargo_outro').value.trim().toUpperCase() : cargo;
    const unidadeFinal = unidadeTextoParaResumo();

    return {
        chave: protocolo,
        tipo_acao: tipo && tipo.value === 'ATUALIZAR_PERFIL' ? 'TROCA_UBS' : 'CADASTRO',
        nome_completo: byId('nome_completo').value.trim().toUpperCase(),
        email: byId('email').value.trim().toLowerCase(),
        cpf: byId('cpf').value,
        ddd: byId('ddd').value,
        telefone_sem_ddd: byId('telefone').value,
        telefone: byId('telefone').value,
        telefone_completo: `(${byId('ddd').value}) ${byId('telefone').value}`,
        cargo_funcao: cargoFinal,
        unidade_setor: unidadeFinal,
        justificativa: byId('justificativa').value.trim(),
        data_envio: new Date().toISOString(),
        status_automacao: 'PENDENTE',
    };
}

function buildWhatsappMessage(protocolo, dados) {
    const tipoText = dados.tipo_acao === 'CADASTRO' ? 'Novo cadastro' : 'Atualizar perfil / Trocar UBS';

    return [
        '*Novo Formulário Hórus*',
        `Protocolo: ${protocolo}`,
        '',
        `*Tipo:* ${tipoText}`,
        `*Nome:* ${dados.nome_completo}`,
        `*CPF:* ${dados.cpf}`,
        `*Telefone:* ${dados.telefone_completo}`,
        `*E-mail:* ${dados.email}`,
        `*Cargo:* ${dados.cargo_funcao}`,
        `*Unidade(s):* ${dados.unidade_setor}`,
    ].join('\n');
}

function openWhatsapp(message, popupWindow = null) {
    const number = '5589994250078';
    const encoded = encodeURIComponent(message);
    const url = `https://api.whatsapp.com/send?phone=${number}&text=${encoded}`;

    if (popupWindow && !popupWindow.closed) {
        popupWindow.location.href = url;
    } else {
        window.open(url, '_blank');
    }

    return url;
}

async function sendToAppsScript(dados, maxRetries = 2) {
    if (!APPS_SCRIPT_URL) return;

    let lastError = null;

    for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
        try {
            const response = await fetch(APPS_SCRIPT_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify(dados),
            });

            if (!response.ok) {
                throw new Error(`Falha HTTP ${response.status}`);
            }

            const responseText = await response.text();
            if (!responseText) return;

            let parsed = null;
            try {
                parsed = JSON.parse(responseText);
            } catch {
                parsed = null;
            }

            if (parsed && parsed.status && parsed.status !== 'success') {
                throw new Error(parsed.message || 'Apps Script retornou erro.');
            }

            return;
        } catch (error) {
            lastError = error;
            if (attempt < maxRetries) {
                await new Promise((resolve) => setTimeout(resolve, (attempt + 1) * 900));
            }
        }
    }

    throw lastError || new Error('Falha ao enviar dados ao Apps Script.');
}

function launchConfetti() {
    if (typeof confetti !== 'function') return;

    const end = Date.now() + 2200;
    const colors = ['#06b6d4', '#10b981', '#f97316', '#8b5cf6'];

    (function frame() {
        confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors });
        confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors });
        if (Date.now() < end) requestAnimationFrame(frame);
    }());
}

function showSuccess(protocolo, dados, whatsappUrl) {
    byId('loadingOverlay').style.display = 'none';

    document.querySelectorAll('.form-step').forEach((step) => {
        step.classList.remove('active');
        step.style.display = 'none';
    });

    document.querySelector('.progress-bar').style.display = 'none';

    const success = byId('stepSuccess');
    success.style.display = 'block';
    success.classList.add('active');
    byId('protocolo').textContent = protocolo;

    byId('btn_whatsapp').href = whatsappUrl;

    salvarDados(dados);
    launchConfetti();
}

byId('formCadastro').addEventListener('submit', async (e) => {
    e.preventDefault();

    const firstInvalidStep = validateBeforeSubmit();
    if (firstInvalidStep) {
        setStep(firstInvalidStep);
        return;
    }

    const loading = byId('loadingOverlay');
    const btnEnviar = byId('btnEnviar');

    loading.style.display = 'flex';
    btnEnviar.disabled = true;

    const protocolo = gerarProtocolo();
    const dados = buildPayload(protocolo);
    const message = buildWhatsappMessage(protocolo, dados);
    const popupWindow = window.open('', '_blank');
    let whatsappUrl = '';

    try {
        await sendToAppsScript(dados);
        whatsappUrl = openWhatsapp(message, popupWindow);
        showSuccess(protocolo, dados, whatsappUrl);
        clearDraft();
        setDraftStatus('Cadastro enviado com sucesso.', 'saved');
    } catch (error) {
        if (popupWindow && !popupWindow.closed) popupWindow.close();
        console.error('Erro ao enviar:', error);
        alert('Não foi possível confirmar o envio na planilha. Tente novamente.');
        loading.style.display = 'none';
        btnEnviar.disabled = false;
        setDraftStatus('Falha no envio. Rascunho mantido no dispositivo.', 'error');
    }
});

// === SUCCESS ACTIONS ===
async function copiarProtocolo() {
    const protocolo = byId('protocolo').textContent.trim();
    if (!protocolo || protocolo === '-') return;

    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(protocolo);
        } else {
            const input = document.createElement('input');
            input.value = protocolo;
            document.body.appendChild(input);
            input.select();
            document.execCommand('copy');
            input.remove();
        }
        alert('Protocolo copiado com sucesso.');
    } catch {
        alert('Não foi possível copiar automaticamente.');
    }
}

window.copiarProtocolo = copiarProtocolo;

function novoFormulario() {
    byId('formCadastro').reset();

    byId('stepSuccess').style.display = 'none';
    document.querySelector('.progress-bar').style.display = 'flex';

    byId('cargo_outro_group').style.display = 'none';
    byId('unidade_outra_group').style.display = 'none';
    byId('group_unidade_urbana').style.display = 'none';
    byId('group_unidade_rural').style.display = 'none';
    byId('group_unidade_2').style.display = 'none';
    byId('btn_add_unidade').style.display = 'none';
    byId('perfil_preview').style.display = 'none';

    clearErrors();
    clearDraft();
    setStep(1);
    carregarDados();
}

window.novoFormulario = novoFormulario;

// === PROFILE STORAGE ===
function salvarDados(dados) {
    const profile = normalizeProfileData({
        nome_completo: dados.nome_completo,
        email: dados.email,
        cpf: dados.cpf,
        ddd: dados.ddd,
        telefone: dados.telefone_sem_ddd,
        cargo_funcao: dados.cargo_funcao,
    });

    localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(profile));
}

function colapsarDadosPessoais(profile) {
    ['nome_completo', 'email', 'cpf', 'ddd', 'telefone'].forEach((id) => {
        const field = byId(id);
        if (field) field.closest('.form-group').style.display = 'none';
    });

    if (byId('resumo_dados_salvos')) return;

    const phone = profile.ddd && profile.telefone ? `(${profile.ddd}) ${profile.telefone}` : '';
    const firstName = profile.nome_completo ? profile.nome_completo.split(' ')[0] : '';

    const step2 = byId('step2');
    if (!step2) return;

    const card = document.createElement('div');
    card.id = 'resumo_dados_salvos';
    card.className = 'recovery-card';
    card.innerHTML = `
        <div class="recovery-header">
            <span class="recovery-welcome">Olá, ${firstName}</span>
            <button type="button" onclick="expandirDadosPessoais()" class="btn-ghost">Editar perfil</button>
        </div>
        <p class="recovery-desc">Recuperamos seus dados do último acesso. Você pode prosseguir ou editar as informações.</p>
        <div class="recovery-grid">
            <div class="recovery-item">
                <span class="recovery-label">Nome</span>
                <span class="recovery-value">${profile.nome_completo || '-'}</span>
            </div>
            <div class="recovery-item">
                <span class="recovery-label">CPF</span>
                <span class="recovery-value">${profile.cpf || '-'}</span>
            </div>
            <div class="recovery-item">
                <span class="recovery-label">E-mail</span>
                <span class="recovery-value">${profile.email || '-'}</span>
            </div>
            <div class="recovery-item">
                <span class="recovery-label">Telefone</span>
                <span class="recovery-value">${phone || '-'}</span>
            </div>
        </div>
        <div class="recovery-actions">
            <button type="button" onclick="limparDadosSalvos()" class="btn-ghost">Limpar dados salvos</button>
        </div>
    `;

    const title = step2.querySelector('.step-title');
    if (title) title.insertAdjacentElement('afterend', card);
}

function expandirDadosPessoais() {
    const card = byId('resumo_dados_salvos');
    if (card) card.remove();

    ['nome_completo', 'email', 'cpf', 'ddd', 'telefone'].forEach((id) => {
        const field = byId(id);
        if (field) field.closest('.form-group').style.display = '';
    });
}

function limparDadosSalvos() {
    localStorage.removeItem(STORAGE_PROFILE_KEY);
    localStorage.removeItem(STORAGE_DRAFT_KEY);
    expandirDadosPessoais();
    byId('formCadastro').reset();
    byId('cargo_outro_group').style.display = 'none';
    setDraftStatus('Rascunho não salvo');
}

window.expandirDadosPessoais = expandirDadosPessoais;
window.limparDadosSalvos = limparDadosSalvos;

function carregarDados() {
    const raw = localStorage.getItem(STORAGE_PROFILE_KEY);
    if (!raw) return;

    let profile;
    try {
        profile = JSON.parse(raw);
    } catch {
        return;
    }

    const normalizedProfile = normalizeProfileData(profile);

    if (normalizedProfile.nome_completo) byId('nome_completo').value = normalizedProfile.nome_completo;
    if (normalizedProfile.email) byId('email').value = normalizedProfile.email;
    if (normalizedProfile.cpf) byId('cpf').value = normalizedProfile.cpf;
    if (normalizedProfile.ddd) byId('ddd').value = normalizedProfile.ddd;
    if (normalizedProfile.telefone) byId('telefone').value = normalizedProfile.telefone;

    if (normalizedProfile.cargo_funcao) {
        const select = byId('cargo_funcao');
        const option = Array.from(select.options).find((item) => item.value === normalizedProfile.cargo_funcao);

        if (option) {
            select.value = normalizedProfile.cargo_funcao;
            byId('cargo_outro_group').style.display = 'none';
            byId('cargo_outro').value = '';
        } else {
            select.value = 'OUTRO';
            byId('cargo_outro_group').style.display = 'block';
            byId('cargo_outro').value = normalizedProfile.cargo_funcao;
        }
    }

    localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(normalizedProfile));
    colapsarDadosPessoais(normalizedProfile);
}

// === THEME ===
function applyTheme(theme) {
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
}

function initTheme() {
    const saved = localStorage.getItem(STORAGE_THEME_KEY);
    applyTheme(saved === 'dark' ? 'dark' : 'light');
}

function toggleTheme() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const nextTheme = isDark ? 'light' : 'dark';

    applyTheme(nextTheme);
    localStorage.setItem(STORAGE_THEME_KEY, nextTheme);
}

// === STARTUP ===
document.addEventListener('DOMContentLoaded', () => {
    initMasks();
    initDynamicFields();
    initDraftAutosave();

    byId('themeToggle').addEventListener('click', toggleTheme);

    initTheme();
    carregarDados();
    restoreDraft();
    atualizarJustificativaGroup();
    atualizarZonaFields();
    atualizarUnidadeState();
});

window.addEventListener('beforeunload', saveDraftNow);
