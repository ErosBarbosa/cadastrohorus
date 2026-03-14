"""Limpa as linhas de dados da aba de fila (mantendo o cabecalho)."""

from __future__ import annotations

import argparse
import os

import gspread
from dotenv import load_dotenv
from google.oauth2.service_account import Credentials

SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Limpa a fila de automacao no Google Sheets.")
    parser.add_argument("--sheet-id", default="", help="ID da planilha destino.")
    parser.add_argument("--aba", default="", help="Nome da aba destino.")
    parser.add_argument("--service-account", default="", help="Caminho do JSON da service account.")
    parser.add_argument(
        "--confirmar",
        action="store_true",
        help="Confirma explicitamente a limpeza de todas as linhas da fila.",
    )
    return parser.parse_args()


def _value_or_env(cli_value: str, env_key: str, default: str = "") -> str:
    return (cli_value or os.getenv(env_key, default)).strip()


def main() -> int:
    load_dotenv(".env")
    args = parse_args()

    sheet_id = _value_or_env(args.sheet_id, "GOOGLE_SHEET_ID")
    aba = _value_or_env(args.aba, "GOOGLE_WORKSHEET_NAME", "Fila Automacao")
    service_account = _value_or_env(args.service_account, "GOOGLE_SERVICE_ACCOUNT_JSON", "service_account.json")

    if not args.confirmar:
        print("Abortado: use --confirmar para limpar a fila.")
        return 2
    if not sheet_id:
        print("Erro: informe --sheet-id ou GOOGLE_SHEET_ID no .env.")
        return 2

    creds = Credentials.from_service_account_file(service_account, scopes=SCOPES)
    gc = gspread.authorize(creds)

    print("Conectando a planilha destino...")
    ws = gc.open_by_key(sheet_id).worksheet(aba)

    all_rows = ws.get_all_values()
    total = len(all_rows)
    print(f"Total de linhas (incluindo cabecalho): {total}")

    n_dados = total - 1
    print(f"Linhas de dados: {n_dados}")

    if n_dados <= 0:
        print("Nada a apagar.")
        return 0

    print(f"Apagando {n_dados} linha(s)...")
    ws.delete_rows(2, total)
    print("Todas as linhas de dados foram removidas. Cabecalho mantido.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

