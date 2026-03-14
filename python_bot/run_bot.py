from __future__ import annotations

import argparse
import json
import os
import re
import sys
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional

import gspread
from dotenv import load_dotenv
from google.oauth2.service_account import Credentials
from playwright.sync_api import BrowserContext, Page, TimeoutError as PlaywrightTimeoutError, sync_playwright

SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
]


@dataclass
class RegistroFila:
    row_number: int
    chave: str
    nome: str
    cpf: str
    email: str
    telefone: str
    ddd: str
    telefone_sem_ddd: str
    entidade: str
    cidade: str
    esfera: str
    pais: str
    ddi: str
    justificativa: str
    sistema_codigo: str
    sistema_nome: str
    cargo: str
    unidade: str
    status: str
    tipo_acao: str


class ConfigError(Exception):
    pass


class HorusBotV2:
    def __init__(self, env_file: str = ".env") -> None:
        load_dotenv(env_file)
        self.base_dir = Path(__file__).resolve().parent
        self.logs_dir = self.base_dir / "logs"
        self.logs_dir.mkdir(exist_ok=True)
        self.screenshot_dir = self.base_dir / os.getenv("SCREENSHOT_DIR", "logs/screenshots")
        self.screenshot_dir.mkdir(parents=True, exist_ok=True)
        self.evidence_dir = self.base_dir / os.getenv("EVIDENCE_DIR", "logs/evidence")
        self.evidence_dir.mkdir(parents=True, exist_ok=True)
        self.state_file = self.base_dir / os.getenv("STATE_FILE", "logs/storage_state.json")

        self.sheet_id = self._required_env("GOOGLE_SHEET_ID")
        self.worksheet_name = os.getenv("GOOGLE_WORKSHEET_NAME", "Fila Automacao")
        self.horus_url = self._required_env("HORUS_URL")
        self.headless = os.getenv("HEADLESS", "false").lower() == "true"
        self.manual_login = os.getenv("MANUAL_LOGIN", "true").lower() == "true"
        self.login_wait_seconds = int(os.getenv("LOGIN_WAIT_SECONDS", "180"))
        selectors_file = os.getenv("SELECTORS_FILE", "selectors.json")
        self.selectors = self._load_json(self.base_dir / selectors_file)
        self.gc = self._build_gspread_client()
        self.ws = self.gc.open_by_key(self.sheet_id).worksheet(self.worksheet_name)
        self.last_alert_message: Optional[str] = None

    def _required_env(self, key: str) -> str:
        value = os.getenv(key, "").strip()
        if not value:
            raise ConfigError(f"VariÃ¡vel obrigatÃ³ria nÃ£o definida: {key}")
        return value

    def _build_gspread_client(self) -> gspread.Client:
        # Suprimido suporte a INLINE_JSON para contornar limitacoes do bash e padding Base64 no GCP.
        service_account_path_raw = os.getenv("GOOGLE_SERVICE_ACCOUNT_JSON", "service_account.json").strip()
        service_account_path = Path(service_account_path_raw)
        if not service_account_path.is_absolute():
            service_account_path = self.base_dir / service_account_path

        if not service_account_path.exists():
            raise ConfigError(f"Arquivo da service account nÃ£o encontrado: {service_account_path}")
        credentials = Credentials.from_service_account_file(str(service_account_path), scopes=SCOPES)
        return gspread.authorize(credentials)

    @staticmethod
    def _load_json(path: Path) -> Dict[str, Any]:
        if not path.exists():
            raise ConfigError(f"Arquivo JSON nÃ£o encontrado: {path}")
        return json.loads(path.read_text(encoding="utf-8"))

    def _selector_list(self, group: str, key: str) -> List[str]:
        raw = self.selectors[group][key]
        return raw if isinstance(raw, list) else [raw]

    def _find_first(self, page: Page, selectors: Iterable[str], timeout: int = 4000):
        last_error: Optional[Exception] = None
        for selector in selectors:
            try:
                locator = page.locator(selector).first
                locator.wait_for(timeout=timeout)
                return locator
            except Exception as exc:  # noqa: BLE001
                last_error = exc
        if last_error:
            raise last_error
        raise RuntimeError("Nenhum seletor informado.")

    def listar_pendentes(self, limit: Optional[int] = None) -> List[RegistroFila]:
        rows = self.ws.get_all_records()
        pendentes: List[RegistroFila] = []
        for index, row in enumerate(rows, start=2):
            if str(row.get("status_automacao", "")).strip().upper() != "PENDENTE":
                continue
            pendentes.append(
                RegistroFila(
                    row_number=index,
                    chave=str(row.get("chave", "")).strip(),
                    nome=str(row.get("nome_completo", "")).strip(),
                    cpf=str(row.get("cpf", "")).strip(),
                    email=str(row.get("email", "")).strip(),
                    telefone=str(row.get("telefone_completo", "")).strip(),
                    ddd=str(row.get("ddd", "")).strip(),
                    telefone_sem_ddd=str(row.get("telefone_sem_ddd", "")).strip(),
                    entidade=str(row.get("entidade_padrao", "")).strip(),
                    cidade=str(row.get("cidade_padrao", "")).strip(),
                    esfera=str(row.get("esfera", "")).strip(),
                    pais=str(row.get("pais", "")).strip(),
                    ddi=str(row.get("ddi", "")).strip(),
                    justificativa=str(row.get("justificativa", "")).strip(),
                    sistema_codigo=str(row.get("sistema_codigo", "")).strip() or os.getenv("DEFAULT_SYSTEM_CODE", "341"),
                    sistema_nome=str(row.get("sistema_nome", "")).strip() or os.getenv("DEFAULT_SYSTEM_NAME", "HÃ“RUS - BÃSICO / ESTRATÃ‰GICO"),
                    cargo=str(row.get("cargo_funcao", "")).strip(),
                    unidade=str(row.get("unidade_setor", "")).strip(),
                    status=str(row.get("status_automacao", "")).strip(),
                    tipo_acao=str(row.get("tipo_acao", "CADASTRO")).strip().upper(),
                )
            )
            if limit and len(pendentes) >= limit:
                break
        return pendentes

    def atualizar_linha(self, registro: RegistroFila, status: str, observacao: str) -> None:
        header = self.ws.row_values(1)
        idx = {name: i + 1 for i, name in enumerate(header)}
        now_str = time.strftime("%Y-%m-%d %H:%M:%S")
        self.ws.update_cell(registro.row_number, idx["status_automacao"], status)
        self.ws.update_cell(registro.row_number, idx["observacao_automacao"], observacao)
        self.ws.update_cell(registro.row_number, idx["ultima_tentativa"], now_str)
        if status == "ENVIADO":
            self.ws.update_cell(registro.row_number, idx["data_envio"], now_str)
        tentativa = int(self.ws.cell(registro.row_number, idx["tentativas"]).value or 0)
        self.ws.update_cell(registro.row_number, idx["tentativas"], tentativa + 1)

    def _fill_by_key(self, page: Page, group: str, key: str, value: str) -> None:
        if not value:
            return
        locator = self._find_first(page, self._selector_list(group, key))
        locator.click()
        locator.fill("")
        locator.fill(value)

    def _click_by_key(self, page: Page, group: str, key: str) -> None:
        locator = self._find_first(page, self._selector_list(group, key))
        locator.click()

    def _click_popup_value(self, page: Page, button_key: str, popup_group: str) -> None:
        max_tentativas = 3
        for tentativa in range(max_tentativas):
            try:
                time.sleep(1)  # Espera a pÃ¡gina estabilizar
                with page.expect_popup(timeout=20000) as popup_info:
                    self._click_by_key(page, "main", button_key)
                popup = popup_info.value
                popup.wait_for_load_state("domcontentloaded")
                time.sleep(1)
                item = self._find_first(popup, self._selector_list(popup_group, "linha_resultado"), timeout=15000)
                item.click()
                try:
                    popup.wait_for_event("close", timeout=3000)
                except Exception:
                    try:
                        popup.close()
                    except Exception:
                        pass
                page.bring_to_front()
                time.sleep(0.5)
                return  # Sucesso!
            except Exception as e:
                if tentativa < max_tentativas - 1:
                    print(f"  Tentativa {tentativa + 1} falhou no popup ({button_key}), tentando novamente...")
                    time.sleep(2)
                else:
                    raise  # Na Ãºltima tentativa, deixa o erro subir

    def _set_esfera(self, page: Page, esfera: str) -> None:
        esfera_norm = (esfera or "").strip().upper()
        if esfera_norm == "FEDERAL":
            self._click_by_key(page, "main", "input_esfera_federal")
            return
        self._click_by_key(page, "main", "input_esfera_municipal")

    def _set_sistema(self, page: Page, registro: RegistroFila) -> None:
        if registro.sistema_codigo == "341":
            self._click_by_key(page, "main", "sistema_radio_341")
            return
        linha = self._find_first(page, self._selector_list("main", "sistema_linha_horus"), timeout=5000)
        radio = linha.locator("xpath=.//input[@type='radio']").first
        radio.click()

    @staticmethod
    def _determinar_perfil(cargo: str, unidade: str = "") -> str:
        """Define o perfil baseado na UBS selecionada.
        Se a UBS for SESAM ALMOXARIFADO, usa Almoxarifado/CAF I.
        Para qualquer outra UBS, usa FarmÃ¡cia/Unidade de SaÃºde I.
        """
        if "SESAM ALMOXARIFADO" in unidade.upper():
            return "Almoxarifado/CAF I"
        return "FarmÃ¡cia/Unidade de SaÃºde I"

    def _informar_perfil(self, page: Page, registro: RegistroFila) -> None:
        """Clica em Informar Perfil, seleciona o perfil correto, UBS, e finaliza."""
        # 1. Clicar no botÃ£o/Ã­cone "Informar Perfil"
        locator = self._find_first(page, self._selector_list("perfil", "botao_informar_perfil"), timeout=8000)
        locator.click()
        time.sleep(2)
        page.wait_for_load_state("domcontentloaded")

        # 2. Apagar perfis existentes (se houver)
        try:
            excluir_btns = page.locator(self._selector_list("perfil", "perfil_existente_excluir")[0])
            while excluir_btns.count() > 0:
                excluir_btns.first.click()
                time.sleep(1)
                page.wait_for_load_state("domcontentloaded")
                excluir_btns = page.locator(self._selector_list("perfil", "perfil_existente_excluir")[0])
        except Exception:
            pass  # Sem perfis existentes

        # 3. Selecionar o Perfil no dropdown
        perfil_nome = self._determinar_perfil(registro.cargo, registro.unidade)
        try:
            select_perfil = self._find_first(page, self._selector_list("perfil", "select_perfil"), timeout=5000)
            select_perfil.select_option(label=perfil_nome)
        except Exception:
            try:
                select_perfil = self._find_first(page, self._selector_list("perfil", "select_perfil"), timeout=3000)
                options = select_perfil.locator("option")
                for i in range(options.count()):
                    text = options.nth(i).text_content() or ""
                    if perfil_nome.split("/")[0] in text:
                        select_perfil.select_option(index=i)
                        break
            except Exception:
                print(f"Aviso: nÃ£o consegui selecionar o perfil '{perfil_nome}'.")

        # 4. Selecionar Esfera de AtuaÃ§Ã£o = HÃ“RUS-BÃSICO
        try:
            select_esfera = self._find_first(page, self._selector_list("perfil", "select_esfera_atuacao"), timeout=3000)
            for label in ["HÃ“RUS-BÃSICO", "HORUS-BÃSICO", "HORUS-BASICO"]:
                try:
                    select_esfera.select_option(label=label)
                    break
                except Exception:
                    continue
        except Exception:
            print("Aviso: campo esfera de atuaÃ§Ã£o nÃ£o encontrado.")

        # 5. Pesquisar e selecionar a UBS (Unidade de DispensaÃ§Ã£o)
        # O formulÃ¡rio web agora envia o nome exato (ex: "USF CANELA DE OEIRAS - OEIRAS-PI")
        ubs_nome = registro.unidade.strip() if registro.unidade else ""
        if not ubs_nome:
            ubs_nome = "OEIRAS"
        
        termo_busca = ubs_nome.split("-")[0].strip() if "-" in ubs_nome else ubs_nome
        
        # Alguns ajustes para a busca nÃ£o falhar (SCAWEB Ã© sensÃ­vel)
        termo_busca = termo_busca.replace("USF ", "").replace("UBS ", "").replace("US ", "")
        
        # O HÃ³rus retorna no mÃ¡ximo 100 itens. Se for apenas 'CAPS I' ou 'CAPS AD', virÃ£o 100 CAPS aleatÃ³rios do Brasil,
        # muitas vezes omitindo o de Oeiras. Se for CAPS, mantemos o 'OEIRAS' na string de busca para forÃ§ar.
        if "CAPS" in termo_busca.upper() or len(termo_busca) < 5:
            termo_busca += " OEIRAS"
        
        try:
            print(f"  Buscando UBS com termo: '{termo_busca}' (Nome exato esperado: '{ubs_nome}')")
            self._fill_by_key(page, "perfil", "input_unidade_dispensacao", termo_busca)
            time.sleep(0.5)
            # Pesquisar abre um popup com resultados
            with page.expect_popup(timeout=15000) as popup_info:
                self._click_by_key(page, "perfil", "botao_pesquisar_unidade")
            popup = popup_info.value
            popup.wait_for_load_state("domcontentloaded")
            time.sleep(1)
            # Clicar no resultado que bate com o nome exato (ou caso especial)
            links = popup.locator("xpath=//a")
            encontrou = False
            
            for i in range(links.count()):
                texto = links.nth(i).text_content() or ""
                texto = texto.strip().upper()
                print(f"    Resultado {i}: '{texto}'")
                
                # Ignorar absurdamente qualquer coisa do ParÃ¡ para evitar Oeiras do ParÃ¡
                if "PARÃ" in texto or "PARA " in texto or "- PA" in texto:
                    print(f"    --- Ignorando (ContÃ©m ParÃ¡): '{texto}'")
                    continue
                
                # Se for o nome gigante exato, ou se contiver o "termo_busca" E for de "OEIRAS-PI"
                if ubs_nome.upper() == texto or (termo_busca.upper() in texto and "OEIRAS" in texto):
                    print(f"    >>> Selecionando: '{texto}'")
                    links.nth(i).click()
                    encontrou = True
                    break
                    
            if not encontrou:
                print(f"Aviso: NÃ£o encontrou '{ubs_nome}', clicando no primeiro da lista.")
                links.first.click()
            try:
                popup.wait_for_event("close", timeout=3000)
            except Exception:
                try:
                    popup.close()
                except Exception:
                    pass
            page.bring_to_front()
            time.sleep(1)
        except Exception as exc:
            print(f"Aviso: nÃ£o consegui selecionar a UBS: {exc}")

        # Se for atualizaÃ§Ã£o, remove o perfil antigo antes de incluir o novo
        if getattr(registro, "tipo_acao", "CADASTRO") in {"ATUALIZAR_PERFIL", "TROCA_UBS"}:
            print("  AÃ§Ã£o Ã© atualizaÃ§Ã£o de perfil: verificando se existe perfil anterior para excluir...")
            try:
                # Procura o botÃ£o de excluir na tabela de perfis
                botao_excluir = self._find_first(page, self._selector_list("perfil", "perfil_existente_excluir"), timeout=3000)
                botao_excluir.click()
                print("  Perfil anterior excluÃ­do com sucesso.")
                time.sleep(2)
                page.wait_for_load_state("domcontentloaded")
            except Exception:
                print("  Nenhum perfil anterior encontrado para excluir (ou erro ao tentar). Seguindo com a inclusÃ£o.")

        # 6. Clicar em Incluir
        try:
            self._click_by_key(page, "perfil", "botao_incluir")
            time.sleep(2)
            page.wait_for_load_state("domcontentloaded")
        except Exception:
            print("Aviso: botÃ£o Incluir nÃ£o encontrado.")

        # NÃƒO clica em Finalizar! O Finalizar faz logout do sistema.

    def _capture_evidence(self, page: Page, prefix: str) -> None:
        html_path = self.evidence_dir / f"{prefix}.html"
        png_path = self.screenshot_dir / f"{prefix}.png"
        html_path.write_text(page.content(), encoding="utf-8")
        page.screenshot(path=str(png_path), full_page=True)

    def _abrir_contexto(self, playwright) -> BrowserContext:
        browser = playwright.chromium.launch(headless=self.headless)
        if self.state_file.exists():
            return browser.new_context(storage_state=str(self.state_file))
        return browser.new_context()

    def _garantir_login(self, page: Page) -> None:
        page.goto(self.horus_url, wait_until="domcontentloaded")
        if not self.manual_login:
            return
        print("\n=== LOGIN MANUAL NECESSÃRIO ===")
        print("FaÃ§a login no SCAWEB/HÃ³rus, navegue atÃ© o ambiente correto e pressione ENTER.")
        input()
        page.context.storage_state(path=str(self.state_file))

    def navegar_tela_cadastro(self, page: Page) -> None:
        try:
            self._click_by_key(page, "main", "menu_cadastro")
            page.wait_for_load_state("domcontentloaded")
        except Exception:
            print("Aviso: nÃ£o consegui abrir o menu automaticamente; vou assumir que a tela jÃ¡ estÃ¡ aberta.")

    def processar_registro(self, page: Page, registro: RegistroFila, dry_run: bool = False) -> str:
        page.goto(self.horus_url, wait_until="domcontentloaded")
        time.sleep(1)
        self._fill_by_key(page, "main", "input_email", registro.email)
        self._fill_by_key(page, "main", "input_nome", registro.nome)
        cpf_limpo = re.sub(r'\D', '', registro.cpf)
        self._fill_by_key(page, "main", "input_cpf", cpf_limpo)
        # Preencher campo de entidade ANTES de clicar Pesquisar (JS exige campo preenchido)
        self._fill_by_key(page, "main", "input_entidade_texto", registro.entidade or "SECRETARIA MUNICIPAL")
        self._click_popup_value(page, "botao_entidade", "popup_entidade")
        # Campos fixos da entidade (mesmos para todos)
        self._fill_by_key(page, "main", "input_bairro", "RODAGEM DE FLORIANO")
        self._fill_by_key(page, "main", "input_cep", "64500000")
        self._fill_by_key(page, "main", "input_endereco", "AV. FLORIANO PEIXOTO, 417")
        self._set_esfera(page, registro.esfera)
        self._fill_by_key(page, "main", "input_pais", registro.pais)
        # Preencher campo de cidade ANTES de clicar Pesquisar (JS exige campo preenchido)
        self._fill_by_key(page, "main", "input_cidade_texto", "OEIRAS")
        self._click_popup_value(page, "botao_cidade", "popup_cidade")
        self._fill_by_key(page, "main", "input_ddi", registro.ddi)
        
        ddd_val = registro.ddd
        tel_val = registro.telefone_sem_ddd or registro.telefone
        
        # Fallback: Se a planilha nÃ£o tiver mandado a coluna DDD separada, extraÃ­mos do telefone completo
        if not ddd_val and tel_val:
            nums = re.sub(r'\D', '', tel_val)
            if len(nums) >= 10:
                ddd_val = nums[:2]
                tel_val = nums[2:]
        
        # Limpar rigorosamente qualquer lixo (parÃªnteses, traÃ§os, etc)
        ddd_val = re.sub(r'\D', '', str(ddd_val))
        tel_val = re.sub(r'\D', '', str(tel_val))

        # Se o telefone ainda tiver o DDD grudado (11 dÃ­gitos), a gente remove o prefixo repetido
        if len(tel_val) == 11 and tel_val.startswith(ddd_val):
            tel_val = tel_val[2:]

        self._fill_by_key(page, "main", "input_ddd", ddd_val)
        self._fill_by_key(page, "main", "input_telefone", tel_val)
        # Justificativa: se for troca de UBS, usa texto padrÃ£o automaticamente
        if registro.tipo_acao == "TROCA_UBS":
            justificativa = "SOLICITAÃ‡ÃƒO DE TROCA DE UBS"
        else:
            justificativa = registro.justificativa
        self._fill_by_key(page, "main", "textarea_justificativa", justificativa)

        if not ddd_val or not tel_val:
            raise ValueError(f"Dados de telefone incompletos na planilha (DDD: '{ddd_val}', Tel: '{tel_val}')")

        if dry_run:
            return "DRY_RUN_OK"

        # Limpar alerta anterior
        self.last_alert_message = None

        self._click_by_key(page, "main", "botao_gravar")
        
        # Pequena espera para ver se sobe alerta do navegador
        time.sleep(2)
        if self.last_alert_message:
            raise RuntimeError(f"Erro reportado pela pÃ¡gina: {self.last_alert_message}")

        time.sleep(1)
        page.wait_for_load_state("domcontentloaded")

        # Tentar marcar o sistema na pÃ¡gina seguinte, se disponÃ­vel
        try:
            self._set_sistema(page, registro)
            time.sleep(0.5)
            # Clicar em Confirmar para finalizar a aprovaÃ§Ã£o de sistemas
            try:
                self._click_by_key(page, "main", "botao_confirmar")
                time.sleep(3)
                page.wait_for_load_state("domcontentloaded")
            except Exception:
                print("Aviso: botÃ£o Confirmar nÃ£o encontrado.")
        except Exception:
            print("Aviso: grade de sistemas nÃ£o encontrada na pÃ¡gina atual.")

        final_url_ok = any(token in page.url for token in self.selectors["final"]["url_contains"])
        if final_url_ok:
            # Informar Perfil na pÃ¡gina final
            try:
                self._informar_perfil(page, registro)
            except Exception as exc:
                print(f"Aviso: erro ao informar perfil: {exc}")
            return "CADASTRO_COMPLETO"

        return "GRAVAR_OK"

    def listar_erros(self, limit: Optional[int] = None) -> List[RegistroFila]:
        """Retorna registros com status ERRO para reprocessamento."""
        rows = self.ws.get_all_records()
        erros: List[RegistroFila] = []
        for index, row in enumerate(rows, start=2):
            if str(row.get("status_automacao", "")).strip().upper() != "ERRO":
                continue
            erros.append(
                RegistroFila(
                    row_number=index,
                    chave=str(row.get("chave", "")).strip(),
                    nome=str(row.get("nome_completo", "")).strip(),
                    cpf=str(row.get("cpf", "")).strip(),
                    email=str(row.get("email", "")).strip(),
                    telefone=str(row.get("telefone_completo", "")).strip(),
                    ddd=str(row.get("ddd", "")).strip(),
                    telefone_sem_ddd=str(row.get("telefone_sem_ddd", "")).strip(),
                    entidade=str(row.get("entidade_padrao", "")).strip(),
                    cidade=str(row.get("cidade_padrao", "")).strip(),
                    esfera=str(row.get("esfera", "")).strip(),
                    pais=str(row.get("pais", "")).strip(),
                    ddi=str(row.get("ddi", "")).strip(),
                    justificativa=str(row.get("justificativa", "")).strip(),
                    sistema_codigo=str(row.get("sistema_codigo", "")).strip() or os.getenv("DEFAULT_SYSTEM_CODE", "341"),
                    sistema_nome=str(row.get("sistema_nome", "")).strip() or os.getenv("DEFAULT_SYSTEM_NAME", "HÃ“RUS - BÃSICO / ESTRATÃ‰GICO"),
                    cargo=str(row.get("cargo_funcao", "")).strip(),
                    unidade=str(row.get("unidade_setor", "")).strip(),
                    status=str(row.get("status_automacao", "")).strip(),
                    tipo_acao=str(row.get("tipo_acao", "CADASTRO")).strip().upper(),
                )
            )
            if limit and len(erros) >= limit:
                break
        return erros

    def _notificar_whatsapp(self, mensagem: str) -> None:
        """Envia notificaÃ§Ã£o via WhatsApp usando BOT_WEBHOOK_URL do .env."""
        webhook_url = os.getenv("BOT_WEBHOOK_URL", "").strip()
        if not webhook_url:
            return  # Sem webhook configurado, pula silenciosamente
        try:
            import urllib.request
            import urllib.parse
            payload = json.dumps({"text": mensagem}).encode("utf-8")
            req = urllib.request.Request(webhook_url, data=payload,
                                         headers={"Content-Type": "application/json"})
            urllib.request.urlopen(req, timeout=10)
        except Exception as exc:
            print(f"Aviso: nÃ£o foi possÃ­vel enviar notificaÃ§Ã£o WhatsApp: {exc}")

    def limpar_enviados(self) -> None:
        """Move registros ENVIADOS para a aba Finalizados e deleta da Fila."""
        print("\nVerificando se hÃ¡ registros ENVIADOS para mover para 'Finalizados'...")
        try:
            records = self.ws.get_all_records()
            # Identificar linhas para mover
            linhas_para_mover = []
            indices_para_deletar = []
            
            # offset 2 porque get_all_records comeÃ§a depois do header
            for idx, r in enumerate(records, start=2):
                if str(r.get("status_automacao", "")).strip().upper() == "ENVIADO":
                    linhas_para_mover.append(list(r.values()))
                    indices_para_deletar.append(idx)
                    
            if not linhas_para_mover:
                print("Nenhum registro para mover.")
                return
                
            # Mover para finalizados
            try:
                final_ws = self.gc.open_by_key(self.sheet_id).worksheet("Finalizados")
            except Exception:
                print("Aviso: Aba 'Finalizados' nÃ£o encontrada, nÃ£o movendo registros.")
                return
                
            final_ws.append_rows(linhas_para_mover)
            print(f"{len(linhas_para_mover)} registros copiados para 'Finalizados'.")
            
            # Deletar de baixo pra cima para nÃ£o mudar o index
            for idx in sorted(indices_para_deletar, reverse=True):
                self.ws.delete_rows(idx)
                
            print(f"{len(indices_para_deletar)} linhas limpas de 'Fila Automacao'.")
        except Exception as e:
            print(f"Erro ao limpar enviados: {e}")

    def executar(self, limit: int | None = None, dry_run: bool = False, nome_filtro: str | None = None, reprocessar_erros: bool = False) -> int:
        # Se pedido, marca ERROs como PENDENTE antes de buscar
        if reprocessar_erros:
            erros = self.listar_erros(limit=limit)
            if erros:
                print(f"Reprocessando {len(erros)} registro(s) com ERRO...")
                for r in erros:
                    self.atualizar_linha(r, "PENDENTE", "Reprocessamento agendado.")

        pendentes = self.listar_pendentes(limit=limit)
        if nome_filtro:
            nome_upper = nome_filtro.upper()
            pendentes = [r for r in pendentes if nome_upper in r.nome.upper()]
        if not pendentes:
            print("Nenhum registro pendente na fila.")
            return 0
        print(f"{len(pendentes)} registro(s) pendente(s) encontrado(s).")

        sucesso = 0
        falha = 0
        nomes_sucesso: List[str] = []
        nomes_falha: List[str] = []

        with sync_playwright() as playwright:
            context = self._abrir_contexto(playwright)
            page = context.new_page()
            def handle_dialog(dialog):
                msg = dialog.message
                print(f"\n[ALERTA NA PÃGINA] {msg}")
                self.last_alert_message = msg
                dialog.accept()
            page.on("dialog", handle_dialog)
            self._garantir_login(page)
            for registro in pendentes:
                cpf_limpo = re.sub(r'\D','', registro.cpf) or 'semcpf'
                stamp = f"{int(time.time())}_{cpf_limpo}"
                try:
                    self.atualizar_linha(registro, "ENVIANDO", "Registro em processamento.")
                    resultado = self.processar_registro(page, registro, dry_run=dry_run)
                    self._capture_evidence(page, f"{stamp}_ok")
                    status_final = "PENDENTE" if dry_run else "ENVIADO"
                    obs = f"Processado com sucesso: {resultado}" if not dry_run else "Teste visual concluÃ­do; nada foi gravado."
                    self.atualizar_linha(registro, status_final, obs)
                    sucesso += 1
                    nomes_sucesso.append(registro.nome)
                except Exception as exc:  # noqa: BLE001
                    self._capture_evidence(page, f"{stamp}_erro")
                    mensagem = f"Falha ao processar: {exc}"
                    print(mensagem)
                    self.atualizar_linha(registro, "ERRO", mensagem)
                    falha += 1
                    nomes_falha.append(registro.nome)
            context.storage_state(path=str(self.state_file))
            context.close()

        # RelatÃ³rio final no terminal
        print("\n" + "="*50)
        print(f"  RELATÃ“RIO FINAL - {time.strftime('%d/%m/%Y %H:%M')}")
        print("="*50)
        print(f"  âœ… Sucesso: {sucesso} | âŒ Erro: {falha} | Total: {sucesso + falha}")
        if nomes_sucesso:
            print(f"  ConcluÃ­dos: {', '.join(nomes_sucesso)}")
        if nomes_falha:
            print(f"  Com erro:   {', '.join(nomes_falha)}")
        print("="*50)

        # NotificaÃ§Ã£o WhatsApp
        if not dry_run:
            msg = (
                f"*ðŸ¤– RobÃ´ HÃ³rus - {time.strftime('%d/%m %H:%M')}*\n"
                f"âœ… Sucesso: {sucesso} | âŒ Erro: {falha}\n"
            )
            if nomes_sucesso:
                msg += f"ConcluÃ­dos: {', '.join(nomes_sucesso)}\n"
            if nomes_falha:
                msg += f"Com erro: {', '.join(nomes_falha)}"
            self._notificar_whatsapp(msg)
            
            # Tentar mover todos os enviados (desta execuÃ§Ã£o e antigos que sobraram)
            self.limpar_enviados()

        return 0


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="RobÃ´ HÃ³rus/SCAWEB - versÃ£o melhorada")
    parser.add_argument("--limit", type=int, default=None, help="Quantidade mÃ¡xima de linhas pendentes a processar")
    parser.add_argument("--dry-run", action="store_true", help="Preenche a tela, mas nÃ£o grava")
    parser.add_argument("--env-file", default=".env", help="Arquivo .env a utilizar")
    parser.add_argument("--nome", type=str, default=None, help="Filtrar por nome (parcial)")
    parser.add_argument("--reprocessar-erros", action="store_true", help="Reprocessar registros com status ERRO")
    parser.add_argument("--test-registration", action="store_true", help="Faz um cadastro fictÃ­cio de teste")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    try:
        bot = HorusBotV2(env_file=args.env_file)

        if args.test_registration:
            print("\n=== INICIANDO CADASTRO DE TESTE ===")
            dummy = RegistroFila(
                row_number=-1,
                chave="TESTE-" + str(int(time.time())),
                nome="CADASTRO DE TESTE AUTOMACAO",
                cpf="000.000.000-00",
                email="teste@exemplo.com",
                telefone="(89) 99999-9999",
                ddd="89",
                telefone_sem_ddd="999999999",
                entidade="SECRETARIA MUNICIPAL DE SAUDE",
                cidade="OEIRAS",
                esfera="MUNICIPAL",
                pais="BRASIL",
                ddi="55",
                justificativa="CADASTRO DE TESTE PARA VALIDACAO DA AUTOMACAO",
                sistema_codigo="341",
                sistema_nome="HÃ“RUS - BÃSICO / ESTRATÃ‰GICO",
                cargo="AUXILIAR ADMINISTRATIVO",
                unidade="SESAM ALMOXARIFADO",
                status="PENDENTE",
                tipo_acao="CADASTRO"
            )
            with sync_playwright() as playwright:
                context = bot._abrir_contexto(playwright)
                page = context.new_page()
                def handle_dialog(dialog):
                    msg = dialog.message
                    print(f"\n[ALERTA NA PÃGINA] {msg}")
                    bot.last_alert_message = msg
                    dialog.accept()
                page.on("dialog", handle_dialog)
                bot._garantir_login(page)
                try:
                    res = bot.processar_registro(page, dummy, dry_run=args.dry_run)
                    print(f"\nSucesso no cadastro de teste: {res}")
                except Exception as e:
                    print(f"\nFalha no cadastro de teste: {e}")
                finally:
                    context.close()
            return 0

        return bot.executar(
            limit=args.limit,
            dry_run=args.dry_run,
            nome_filtro=args.nome,
            reprocessar_erros=getattr(args, "reprocessar_erros", False),
        )
    except ConfigError as exc:
        print(f"Erro de configuraÃ§Ã£o: {exc}")
        return 2
    except KeyboardInterrupt:
        print("ExecuÃ§Ã£o interrompida pelo usuÃ¡rio.")
        return 130


if __name__ == "__main__":
    raise SystemExit(main())
