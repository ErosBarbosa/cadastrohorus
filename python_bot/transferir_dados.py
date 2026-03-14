"""
Transfere respostas do formulario para a fila de automacao.

Uso:
    python transferir_dados.py --origem-sheet-id <ID> --destino-sheet-id <ID>
"""

from __future__ import annotations

import argparse
import os
import re
import time

import gspread
from dotenv import load_dotenv
from google.oauth2.service_account import Credentials

SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
]

# Mapeamento de UBS: nome do formulario -> nome exato no Horus
MAPA_UBS = {
    "UBS Canela": "USF CANELA DE OEIRAS - OEIRAS-PI",
    "UBS Jureminha": "USF JUREMINHA - OEIRAS-PI",
    "UBS Boa Nova": "USF BOA NOVA - OEIRAS-PI",
    "UBS Oeiras Nova": "USF DE OEIRAS NOVA - OEIRAS-PI",
    "UBS Varzea (Geral)": "USF VARZEA - OEIRAS-PI",
    "UBS Buriti do Rei": "USF BURITI DO REI - OEIRAS-PI",
    "UBS Briona": "USF BRIONA - OEIRAS-PI",
    "UBS Contentamento": "USF CONTENTAMENTO - OEIRAS-PI",
    "UBS Morro Redondo": "USF MORRO REDONDO - OEIRAS-PI",
    "UBS Alagoinha": "USF ALAGOINHA - OEIRAS-PI",
    "UBS Buriti do Canto / Alto Sereno": "UBS BURITI DO CANTO - OEIRAS-PI",
    "UBS Jurani": "UBS JURANI - OEIRAS-PI",
    "CAPS I - Saude Mental": "CAPS I - OEIRAS-PI",
    "CAPS AD - Alcool e Drogas": "CAPS AD - OEIRAS-PI",
    "SESAM Almoxarifado": "SESAM ALMOXARIFADO - OEIRAS-PI",
    "SESAM Farmacia": "SESAM FARMACIA - OEIRAS-PI",
    "UBS Alto Sereno": "UBS ALTO SERENO - OEIRAS-PI",
    "UBS Belo Monte": "UBS BELO MONTE - OEIRAS-PI",
    "UBS Boa Vista": "UBS BOA VISTA - OEIRAS-PI",
    "UBS Dr Hailton Alves": "USF DR HAILTON ALVES - OEIRAS-PI",
    "UBS Dr Pedro Barbosa": "USF DR PEDRO BARBOSA - OEIRAS-PI",
    "USF Rodagem de Picos": "USF RODAGEM DE PICOS - OEIRAS-PI",
    "SAMU": "SAMU 192 OEIRAS USB 01 - OEIRAS-PI",
    "CEO": "CENTRO DE ESPECIALIDADES ODONTOLOGICAS CEO DE OEIRAS - OEIRAS-PI",
    "CS Dr Paulo de Tarso": "CS DR PAULO DE TARSO - OEIRAS-PI",
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Transfere respostas do formulario para a fila.")
    parser.add_argument("--origem-sheet-id", default="", help="ID da planilha de origem.")
    parser.add_argument("--origem-aba", default="", help="Nome da aba de origem.")
    parser.add_argument("--destino-sheet-id", default="", help="ID da planilha de destino.")
    parser.add_argument("--destino-aba", default="", help="Nome da aba de destino.")
    parser.add_argument("--service-account", default="", help="Caminho do JSON da service account.")
    parser.add_argument("--sleep", type=float, default=0.5, help="Pausa entre insercoes para evitar rate limit.")
    return parser.parse_args()


def _value_or_env(cli_value: str, env_key: str, default: str = "") -> str:
    return (cli_value or os.getenv(env_key, default)).strip()


def normalizar_ubs(nome_raw: str) -> str:
    """Mapeia o nome da UBS para o nome exato do Horus."""
    nome = (nome_raw or "").strip()
    for key, val in MAPA_UBS.items():
        if key.lower() in nome.lower():
            return val
    return nome.upper()


def separar_telefone(telefone_raw: str) -> tuple[str, str]:
    """Separa DDD e numero do telefone."""
    digitos = re.sub(r"\D", "", telefone_raw or "")
    if len(digitos) >= 10:
        return digitos[:2], digitos[2:]
    if len(digitos) == 9:
        return "89", digitos
    return "89", digitos


def main() -> int:
    load_dotenv(".env")
    args = parse_args()

    origem_sheet_id = _value_or_env(args.origem_sheet_id, "ORIGEM_SHEET_ID")
    origem_aba = _value_or_env(args.origem_aba, "ORIGEM_ABA", "Respostas ao formulario 1")
    destino_sheet_id = _value_or_env(args.destino_sheet_id, "GOOGLE_SHEET_ID") or _value_or_env(
        args.destino_sheet_id, "DESTINO_SHEET_ID"
    )
    destino_aba = _value_or_env(args.destino_aba, "GOOGLE_WORKSHEET_NAME", "Fila Automacao")
    service_account = _value_or_env(args.service_account, "GOOGLE_SERVICE_ACCOUNT_JSON", "service_account.json")

    if not origem_sheet_id:
        print("Erro: informe --origem-sheet-id ou ORIGEM_SHEET_ID no .env.")
        return 2
    if not destino_sheet_id:
        print("Erro: informe --destino-sheet-id ou GOOGLE_SHEET_ID/DESTINO_SHEET_ID no .env.")
        return 2

    creds = Credentials.from_service_account_file(service_account, scopes=SCOPES)
    gc = gspread.authorize(creds)

    print("Conectando a planilha de origem...")
    origem_ws = gc.open_by_key(origem_sheet_id).worksheet(origem_aba)
    registros = origem_ws.get_all_records()
    print(f"  {len(registros)} registro(s) encontrado(s).")

    print("Conectando a planilha de destino...")
    destino_ws = gc.open_by_key(destino_sheet_id).worksheet(destino_aba)
    cabecalhos = destino_ws.row_values(1)
    idx = {name: i + 1 for i, name in enumerate(cabecalhos)}

    transferidos = 0
    ignorados = 0

    for row in registros:
        nome = str(row.get("Nome Completo", "") or "").strip().upper()
        cpf = re.sub(r"\D", "", str(row.get("CPF", "") or "")).zfill(11)
        email = str(row.get("E-mail", "") or row.get("Endereco de e-mail", "") or "").strip().lower()
        cargo = str(row.get("Cargo/Funcao", "") or row.get("Cargo/Função", "") or "").strip().upper()
        ubs_raw = str(row.get("Unidade Basica de Saude (UBS) ou Setor", "") or row.get("Unidade Básica de Saúde (UBS) ou Setor", "") or "").strip()
        telefone_raw = str(row.get("NumerodeTelefone(WhatsApp)", "") or row.get("NúmerodeTelefone(WhatsApp)", "") or "").strip()
        tipo_raw = str(row.get("Tipo", "") or "CADASTRO").strip().upper()

        if not nome or not cpf:
            print(f"  Linha sem nome/CPF, ignorando: {row}")
            ignorados += 1
            continue

        unidade = normalizar_ubs(ubs_raw)
        ddd, numero = separar_telefone(telefone_raw)
        telefone_completo = ddd + numero
        tipo_acao = "TROCA_UBS" if "TROCA" in tipo_raw or "ATUALIZAR" in tipo_raw else "CADASTRO"

        nova_linha = [""] * len(cabecalhos)

        def set_col(col_name: str, valor: str) -> None:
            if col_name in idx:
                nova_linha[idx[col_name] - 1] = valor

        set_col("nome_completo", nome)
        set_col("cpf", cpf)
        set_col("email", email)
        set_col("cargo_funcao", cargo)
        set_col("unidade_setor", unidade)
        set_col("telefone_completo", telefone_completo)
        set_col("ddd", ddd)
        set_col("telefone_sem_ddd", numero)
        set_col("tipo_acao", tipo_acao)
        set_col("status_automacao", "PENDENTE")
        set_col("esfera", "MUNICIPAL")
        set_col("pais", "BRASIL")
        set_col("ddi", "55")
        set_col("entidade_padrao", "SECRETARIA MUNICIPAL DE SAUDE")
        set_col("cidade_padrao", "OEIRAS")
        set_col("sistema_codigo", "341")
        set_col("sistema_nome", "HORUS - BASICO / ESTRATEGICO")
        set_col(
            "justificativa",
            "SOLICITACAO DE CADASTRO NO SISTEMA HORUS" if tipo_acao == "CADASTRO" else "SOLICITACAO DE TROCA DE UBS",
        )
        set_col("tentativas", "0")

        destino_ws.append_row(nova_linha, value_input_option="RAW")
        print(f"  Transferido: {nome} ({cpf})")
        transferidos += 1
        if args.sleep > 0:
            time.sleep(args.sleep)

    print("\n" + "=" * 50)
    print("TRANSFERENCIA COMPLETA")
    print(f"Transferidos: {transferidos}")
    print(f"Ignorados:    {ignorados}")
    print("=" * 50)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

