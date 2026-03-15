import re

def fix_mojibake(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        text = f.read()

    # The mapping from corrupted UTF-8 (interpreted as Windows-1252) back to correct UTF-8
    replacements = {
        'HÃ³rus': 'Hórus', 'SaÃºde': 'Saúde', 'FormulÃ¡rio': 'Formulário', 'atualizaÃ§Ã£o': 'atualização',
        'â€”': '—', 'Ã­cone': 'ícone', 'ðŸŒ™': '🌙', 'SolicitaÃ§Ã£o': 'Solicitação', 'ConfirmaÃ§Ã£o': 'Confirmação',
        'ðŸ“‹': '📋', 'ðŸ†•': '🆕', 'ðŸ”„': '🔄', 'jÃ¡': 'já', 'PrÃ³ximo': 'Próximo', 'ðŸ‘¤': '👤', 'ðŸ ¥': '🏥',
        'FunÃ§Ã£o': 'Função', 'TÃ‰CNICO(A)': 'TÉCNICO(A)', 'TÃ©cnico(a)': 'Técnico(a)', 'MÃ‰DICO(A)': 'MÉDICO(A)',
        'MÃ©dico(a)': 'Médico(a)', 'FARMACÃŠUTICO(A)': 'FARMACÊUTICO(A)', 'FarmacÃªutico(a)': 'Farmacêutico(a)',
        'COMUNITÃ RIO': 'COMUNITÁRIO', 'SAÃšDE': 'SAÚDE', 'ComunitÃ¡rio': 'Comunitário', 'ðŸ ™ï¸ ': '🏙️',
        'ðŸŒ³': '🌳', 'AVANÃ‡ADO': 'AVANÇADO', '2Âª': '2ª', 'MudanÃ§a': 'Mudança', 'lotaÃ§Ã£o': 'lotação',
        'especÃ­fica': 'específica', 'serÃ¡': 'será', 'atribuÃ­do': 'atribuído', 'âœ…': '✅', 'âš ï¸ ': '⚠️',
        'ObrigatÃ³rio': 'Obrigatório', 'abrirÃ¡': 'abrirá', 'cÃ³pia': 'cópia', 'lÃ¡': 'lá', 'â ³': '⏳',
        'urgÃªncia': 'urgência', 'vocÃª': 'você', 'botÃ£o': 'botão', 'ðŸ“±': '📱', 'Ã©': 'é', 'Ã§': 'ç', 'Ã£': 'ã',
        'Ãª': 'ê', 'Ã³': 'ó', 'Ãº': 'ú', 'Ã¡': 'á', 'Ã­': 'í', 'Ã§Ã£': 'çã', 'Ã': 'í', "FARMACÃ CIA": "FARMÁCIA",
        'Â': ''
    }

    for k, v in replacements.items():
        text = text.replace(k, v)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(text)

fix_mojibake('c:/Users/EROS/Downloads/horus_automacao_entrega/horus_automacao/formulario/index.html')
print("Fix applied successfully!")
