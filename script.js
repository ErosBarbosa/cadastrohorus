// ============================================
// Hórus Registration Form - JavaScript Logic
// ============================================

// === CONFIGURAÇÃO ===
// URL do Apps Script Web App (será configurada após deploy)
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx-crCng7IIymeazroCwvWhoIXxtYFopMFC6vZZ_g-ZFsIvDVQ0hww3CG6NflWvEWwa/exec';  // Preencher após deploy do Apps Script

let currentStep = 1;

// === CPF MASK ===
document.getElementById('cpf').addEventListener('input', function (e) {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length > 11) v = v.slice(0, 11);
    if (v.length > 9) v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
    else if (v.length > 6) v = v.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    else if (v.length > 3) v = v.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    e.target.value = v;
});

// === DDD MASK ===
document.getElementById('ddd').addEventListener('input', function (e) {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 2);
});

// === TELEFONE MASK ===
document.getElementById('telefone').addEventListener('input', function (e) {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 9);
});

// === PREVIEW DE PERFIL BASEADO NA UBS ===
function atualizarPerfilPreview(ubsNome) {
    const preview = document.getElementById('perfil_preview');
    const previewText = document.getElementById('perfil_preview_text');
    if (!ubsNome || ubsNome === '' || ubsNome === 'OUTRO') {
        preview.style.display = 'none';
        return;
    }
    const perfil = ubsNome.toUpperCase().includes('SESAM ALMOXARIFADO')
        ? '📦 Almoxarifado/CAF I'
        : '💊 Farmácia/Unidade de Saúde I';
    previewText.textContent = perfil;
    preview.style.display = 'block';
}

// === MOSTRAR JUSTIFICATIVA APENAS PARA TROCA DE UBS ===
function atualizarJustificativaGroup() {
    const tipo = document.querySelector('input[name="tipo_acao"]:checked');
    const grp = document.getElementById('justificativa_group');
    if (tipo && tipo.value === 'ATUALIZAR_PERFIL') {
        grp.style.display = 'block';
    } else {
        grp.style.display = 'none';
        document.getElementById('justificativa').value = '';
    }
}
document.querySelectorAll('input[name="tipo_acao"]').forEach(r =>
    r.addEventListener('change', atualizarJustificativaGroup)
);

// === CONFETTI ===
function launchConfetti() {
    if (typeof confetti !== 'function') return;
    const end = Date.now() + 2500;
    const colors = ['#06b6d4', '#10b981', '#f97316', '#8b5cf6'];
    (function frame() {
        confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors });
        confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors });
        if (Date.now() < end) requestAnimationFrame(frame);
    }());
}

// === CARGO "OUTRO" TOGGLE ===
document.getElementById('cargo_funcao').addEventListener('change', function () {
    const outroGroup = document.getElementById('cargo_outro_group');
    outroGroup.style.display = this.value === 'OUTRO' ? 'block' : 'none';
});

// === UNIDADE "OUTRO" TOGGLE E ZONA TOGGLE ===
document.querySelectorAll('input[name="zona_unidade"]').forEach(radio => {
    radio.addEventListener('change', function () {
        const checkOutro = () => {
            document.getElementById('unidade_outra_group').style.display = 'none';
            document.getElementById('unidade_outra').value = '';
        }
        if (this.value === 'URBANA') {
            document.getElementById('group_unidade_urbana').style.display = 'block';
            document.getElementById('group_unidade_rural').style.display = 'none';
            document.getElementById('unidade_rural').value = '';
        } else {
            document.getElementById('group_unidade_urbana').style.display = 'none';
            document.getElementById('group_unidade_rural').style.display = 'block';
            document.getElementById('unidade_urbana').value = '';
        }
        checkOutro();
    });
});

['unidade_urbana', 'unidade_rural'].forEach(id => {
    document.getElementById(id).addEventListener('change', function () {
        const outroGroup = document.getElementById('unidade_outra_group');
        outroGroup.style.display = this.value === 'OUTRO' ? 'block' : 'none';
        atualizarPerfilPreview(this.value);
        if (this.value && this.value !== 'OUTRO') {
            document.getElementById('btn_add_unidade').style.display = 'inline-block';
        } else {
            document.getElementById('btn_add_unidade').style.display = 'none';
        }
    });
});

// === NOME AUTO UPPERCASE ===
document.getElementById('nome_completo').addEventListener('input', function (e) {
    const start = e.target.selectionStart;
    const end = e.target.selectionEnd;
    e.target.value = e.target.value.toUpperCase();
    e.target.setSelectionRange(start, end);
});

// === SEGUNDA UNIDADE (UNIVERSAL) TOGGLE ===
document.getElementById('btn_add_unidade').addEventListener('click', function () {
    document.getElementById('group_unidade_2').style.display = 'block';
    this.style.display = 'none'; // hide add button
});

document.getElementById('btn_rem_unidade').addEventListener('click', function () {
    document.getElementById('group_unidade_2').style.display = 'none';
    document.getElementById('unidade_2').value = '';
    document.getElementById('btn_add_unidade').style.display = 'inline-block';
});

// === NAVIGATION ===
function nextStep(step) {
    if (!validateStep(currentStep)) return;

    if (step === 3) populateReview();

    setStep(step);
}

function prevStep(step) {
    setStep(step);
}

function setStep(step) {
    // Hide all steps
    document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));

    // Show target step
    const target = document.getElementById('step' + step);
    if (target) {
        target.classList.add('active');
        target.style.display = 'block';
    }

    // Update progress bar
    document.querySelectorAll('.progress-step').forEach(ps => {
        const s = parseInt(ps.dataset.step);
        ps.classList.remove('active', 'completed');
        if (s === step) ps.classList.add('active');
        else if (s < step) ps.classList.add('completed');
    });

    currentStep = step;

    // Scroll to top of form
    document.querySelector('.form-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// === VALIDATION ===
function validateStep(step) {
    clearErrors();
    let valid = true;

    if (step === 1) {
        const tipo = document.querySelector('input[name="tipo_acao"]:checked');
        const nome = document.getElementById('nome_completo').value.trim();
        const email = document.getElementById('email').value.trim();
        const cpf = document.getElementById('cpf').value.replace(/\D/g, '');
        const ddd = document.getElementById('ddd').value.trim();
        const telefone = document.getElementById('telefone').value.trim();

        if (!tipo) {
            showError('tipo', 'Selecione o tipo de solicitação');
            valid = false;
        }
        if (!nome || nome.length < 5) {
            showError('nome_completo', 'Digite seu nome completo');
            valid = false;
        }
        if (!email || !email.includes('@') || !email.includes('.')) {
            showError('email', 'Digite um e-mail válido');
            valid = false;
        }
        if (cpf.length !== 11) {
            showError('cpf', 'CPF deve ter 11 dígitos');
            valid = false;
        }
        if (!ddd || ddd.length < 2) {
            showError('ddd', 'DDD inválido');
            valid = false;
        }
        if (!telefone || telefone.length < 8) {
            showError('telefone', 'Telefone inválido');
            valid = false;
        }
    }

    if (step === 2) {
        const cargo = document.getElementById('cargo_funcao').value;
        const zona = document.querySelector('input[name="zona_unidade"]:checked');

        let unidade = '';
        if (zona) {
            unidade = zona.value === 'URBANA' ? document.getElementById('unidade_urbana').value : document.getElementById('unidade_rural').value;
        }

        if (!cargo) {
            showError('cargo_funcao', 'Selecione seu cargo');
            valid = false;
        }
        if (cargo === 'OUTRO' && !document.getElementById('cargo_outro').value.trim()) {
            showError('cargo_outro', 'Especifique seu cargo');
            valid = false;
        }
        if (!zona) {
            showError('zona', 'Selecione a zona da unidade');
            valid = false;
        } else if (!unidade) {
            const errorId = zona.value === 'URBANA' ? 'unidade_urbana' : 'unidade_rural';
            showError(errorId, 'Selecione sua unidade principal');
            valid = false;
        }

        const groupUnidade2 = document.getElementById('group_unidade_2');
        const unidade2 = document.getElementById('unidade_2');
        if (zona && groupUnidade2.style.display !== 'none') {
            if (!unidade2.value) {
                showError('unidade_2', 'Selecione a 2ª unidade ou remova este campo');
                valid = false;
            } else if (unidade2.value === unidade) {
                showError('unidade_2', 'A 2ª unidade não pode ser igual à 1ª');
                valid = false;
            }
        }

        if (unidade === 'OUTRO' && !document.getElementById('unidade_outra').value.trim()) {
            showError('unidade_outra', 'Digite o nome da unidade');
            valid = false;
        }
    }

    return valid;
}

function showError(fieldId, msg) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.classList.add('error');
    }

    // Procura span de erro pelo ID explícito ou relativo ao campo
    const errorSpan = document.getElementById(`erro_${fieldId}`) ||
        (field && field.parentElement.querySelector('.field-error')) ||
        (field && field.closest('.form-group').querySelector('.field-error'));

    if (errorSpan) errorSpan.textContent = msg;
}

function clearErrors() {
    document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    document.querySelectorAll('.field-error').forEach(el => el.textContent = '');
}

// === REVIEW ===
function populateReview() {
    const tipo = document.querySelector('input[name="tipo_acao"]:checked');
    const cargo = document.getElementById('cargo_funcao');

    const zona = document.querySelector('input[name="zona_unidade"]:checked');
    let unidadeElement = null;
    let unidadeElement2 = null;

    if (zona) {
        unidadeElement = zona.value === 'URBANA' ? document.getElementById('unidade_urbana') : document.getElementById('unidade_rural');
        if (zona.value === 'RURAL' && document.getElementById('group_unidade_rural_2').style.display !== 'none') {
            unidadeElement2 = document.getElementById('unidade_rural_2');
        }
    }

    document.getElementById('rev_nome').textContent = document.getElementById('nome_completo').value;
    document.getElementById('rev_email').textContent = document.getElementById('email').value;
    document.getElementById('rev_cpf').textContent = document.getElementById('cpf').value;
    document.getElementById('rev_telefone').textContent =
        `(${document.getElementById('ddd').value}) ${document.getElementById('telefone').value}`;

    const tipoValor = tipo ? tipo.value : '';
    document.getElementById('rev_tipo').textContent =
        tipoValor === 'CADASTRO' ? 'Novo Cadastro' : 'Atualizar Perfil / Trocar UBS';

    document.getElementById('rev_cargo').textContent =
        cargo.value === 'OUTRO' ? document.getElementById('cargo_outro').value : cargo.options[cargo.selectedIndex].text;

    if (unidadeElement) {
        let texto = unidadeElement.value === 'OUTRO' ? document.getElementById('unidade_outra').value : unidadeElement.options[unidadeElement.selectedIndex].text;

        if (document.getElementById('group_unidade_2').style.display !== 'none') {
            const u2 = document.getElementById('unidade_2');
            if (u2 && u2.value) {
                texto += ' / ' + (u2.value === 'OUTRO' ? '' : u2.options[u2.selectedIndex].text);
            }
        }
        document.getElementById('rev_unidade').textContent = texto;
    }
}

// === SUBMIT ===
document.getElementById('formCadastro').addEventListener('submit', async function (e) {
    e.preventDefault();

    const loading = document.getElementById('loadingOverlay');
    const btnEnviar = document.getElementById('btnEnviar');

    loading.style.display = 'flex';
    btnEnviar.disabled = true;

    const cargo = document.getElementById('cargo_funcao').value;
    const zona = document.querySelector('input[name="zona_unidade"]:checked');
    let unidade = '';
    if (zona) {
        let unidade1 = zona.value === 'URBANA' ? document.getElementById('unidade_urbana').value : document.getElementById('unidade_rural').value;
        if (unidade1 === 'OUTRO') {
            unidade1 = document.getElementById('unidade_outra').value.trim().toUpperCase();
        }

        unidade = unidade1;

        if (document.getElementById('group_unidade_2').style.display !== 'none') {
            const unidade2 = document.getElementById('unidade_2').value;
            if (unidade2 && unidade2 !== unidade1) {
                unidade += ' / ' + (unidade2 === 'OUTRO' ? '' : unidade2);
            }
        }
    }

    const protocolo = gerarProtocolo();

    const dados = {
        chave: protocolo,
        tipo_acao: document.querySelector('input[name="tipo_acao"]:checked')?.value === 'ATUALIZAR_PERFIL' ? 'TROCA_UBS' : 'CADASTRO',
        nome_completo: document.getElementById('nome_completo').value.trim().toUpperCase(),
        email: document.getElementById('email').value.trim().toLowerCase(),
        cpf: document.getElementById('cpf').value,
        ddd: document.getElementById('ddd').value,
        telefone_sem_ddd: document.getElementById('telefone').value, // Envia separado
        telefone_completo: `(${document.getElementById('ddd').value}) ${document.getElementById('telefone').value}`, // Mantém legado
        cargo_funcao: cargo === 'OUTRO' ? document.getElementById('cargo_outro').value.trim().toUpperCase() : cargo,
        unidade_setor: unidade,
        justificativa: document.getElementById('justificativa').value.trim(),
        data_envio: new Date().toISOString(),
        status_automacao: 'PENDENTE'
    };

    // Redirecionamento INSTANTÂNEO para o WhatsApp (evitar bloqueios de pop-up do navegador)
    const numeroWhatsapp = "5589994250078";
    const tipoText = dados.tipo_acao === 'CADASTRO' ? 'Novo Cadastro' : 'Atualizar Perfil / Trocar UBS';
    const msg = `*Novo Formulário Hórus*\n` +
        `Protocolo: ${protocolo}\n\n` +
        `*Tipo:* ${tipoText}\n` +
        `*Nome:* ${dados.nome_completo}\n` +
        `*Telefone:* ${dados.telefone_completo}\n` +
        `*E-mail:* ${dados.email}\n` +
        `*Cargo:* ${dados.cargo_funcao}\n` +
        `*Unidade(s):* ${dados.unidade_setor}`;

    const encodedMsg = encodeURIComponent(msg);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${numeroWhatsapp}&text=${encodedMsg}`;

    // Abre o WhatsApp imediatamente no ato do clique
    window.open(whatsappUrl, '_blank');

    loading.style.display = 'flex';
    btnEnviar.disabled = true;

    try {
        if (!APPS_SCRIPT_URL) {
            // Demo mode: simula envio
            await new Promise(r => setTimeout(r, 2000));
            showSuccess(protocolo, dados);
            return;
        }

        const response = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        showSuccess(protocolo, dados);
    } catch (err) {
        console.error('Erro ao enviar:', err);
        alert('Erro ao enviar cadastro. Tente novamente.');
        loading.style.display = 'none';
        btnEnviar.disabled = false;
    }
});

function gerarProtocolo() {
    const agora = new Date();
    const ano = agora.getFullYear();
    const seq = Math.floor(Math.random() * 9000 + 1000);
    return `HOR-${ano}-${seq}`;
}

function showSuccess(protocolo, dados) {
    document.getElementById('loadingOverlay').style.display = 'none';
    document.querySelectorAll('.form-step').forEach(s => {
        s.classList.remove('active');
        s.style.display = 'none';
    });
    document.querySelector('.progress-bar').style.display = 'none';

    const success = document.getElementById('stepSuccess');
    success.style.display = 'block';
    success.classList.add('active');
    document.getElementById('protocolo').textContent = protocolo;

    // 🎉 Confetti!
    launchConfetti();

    // Link fallback button just in case the popup blocker still caught it
    if (dados) {
        const numeroWhatsapp = "5589994250078";
        const tipoText = dados.tipo_acao === 'CADASTRO' ? 'Novo Cadastro' : 'Atualizar Perfil / Trocar UBS';
        const msg = `*Novo Formulário Hórus*\n` +
            `Protocolo: ${protocolo}\n\n` +
            `*Tipo:* ${tipoText}\n` +
            `*Nome:* ${dados.nome_completo}\n` +
            `*CPF:* ${dados.cpf}\n` +
            `*Telefone:* (${dados.ddd}) ${dados.telefone}\n` +
            `*E-mail:* ${dados.email}\n` +
            `*Cargo:* ${dados.cargo_funcao}\n` +
            `*Unidade(s):* ${dados.unidade_setor}`;

        const encodedMsg = encodeURIComponent(msg);
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${numeroWhatsapp}&text=${encodedMsg}`;

        const btnWhatsapp = document.getElementById('btn_whatsapp');
        btnWhatsapp.href = whatsappUrl;
    }
}

function novoFormulario() {
    document.getElementById('formCadastro').reset();
    document.getElementById('stepSuccess').style.display = 'none';
    document.querySelector('.progress-bar').style.display = 'flex';
    document.getElementById('cargo_outro_group').style.display = 'none';
    document.getElementById('unidade_outra_group').style.display = 'none';
    document.getElementById('group_unidade_urbana').style.display = 'none';
    document.getElementById('group_unidade_rural').style.display = 'none';
    document.getElementById('group_unidade_2').style.display = 'none';
    document.getElementById('btn_add_unidade').style.display = 'none';
    setStep(1);
}
