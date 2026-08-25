import os
import threading
import webbrowser

from dotenv import load_dotenv

load_dotenv()

from app import create_app

app = create_app()

if __name__ == "__main__":
    port = int(os.environ.get("BBA_PORT", "5000"))
    url = f"http://127.0.0.1:{port}/login"

    def _abrir_navegador():
        webbrowser.open(url)

    threading.Timer(1.5, _abrir_navegador).start()
    print(f"BBA — acesse: {url}")
    app.run(host="0.0.0.0", port=port, debug=True)