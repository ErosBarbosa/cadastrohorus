"""
Abre o Chrome e tira screenshots automaticamente a cada 10 segundos.
Você só precisa fazer o que precisa no navegador.
Os screenshots vão sendo salvos automaticamente.
Feche o navegador quando terminar.
"""
from playwright.sync_api import sync_playwright
import time, os

URL = "https://scaweb.saude.gov.br/scaweb/solicitacaoUsuario.do?acao=gravarNovaSolicitacao"

def main():
    os.makedirs("logs/screenshots", exist_ok=True)
    os.makedirs("logs/evidence", exist_ok=True)
    
    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=False, args=["--start-maximized"])
        context = browser.new_context(no_viewport=True)
        page = context.new_page()
        
        page.on("dialog", lambda d: d.accept())
        
        print("Abrindo o navegador no SCAWEB...")
        page.goto(URL, wait_until="domcontentloaded")
        
        print("\n" + "="*60)
        print(" NAVEGADOR ABERTO!")
        print(" Faça o Informar Perfil no navegador.")
        print(" Eu vou tirando screenshots automaticamente a cada 10s.")
        print(" Quando terminar, FECHE o navegador.")
        print("="*60 + "\n")
        
        screenshot_num = 1
        try:
            while True:
                time.sleep(10)
                try:
                    path = f"logs/screenshots/perfil_auto_{screenshot_num}.png"
                    page.screenshot(path=path, full_page=True)
                    print(f"  Screenshot #{screenshot_num} salvo!")
                    screenshot_num += 1
                except Exception:
                    print("Navegador fechado. Encerrando...")
                    break
        except KeyboardInterrupt:
            pass
        
        # Salvar HTML final
        try:
            html = page.content()
            with open("logs/evidence/perfil_final.html", "w", encoding="utf-8") as f:
                f.write(html)
            print("HTML final salvo!")
        except Exception:
            pass
        
        try:
            context.close()
            browser.close()
        except Exception:
            pass
        
        print("Pronto!")

if __name__ == "__main__":
    main()
