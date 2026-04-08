import os
import re

BASE_DIR = r"C:\Users\USUARIO\.gemini\antigravity\scratch\biblioteca-ms"
TOMOS = ["tomo1", "tomo2", "tomo3", "tomo4", "tomo5", "tomo6", "tomo7", "tomo8"]

def fix_html(tomo):
    file_path = os.path.join(BASE_DIR, tomo, "index.html")
    if not os.path.exists(file_path):
        return

    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Primero, limpiar las líneas corruptas "J00">" y "s0">"
    content = re.sub(r'\n\s*J00">', '', content)
    content = re.sub(r'\n\s*s0">', '', content)

    # Re-insertar correctamente og:image:width y og:image:height
    # Buscamos og:image y le pegamos los metadatos abajo
    if '<meta property="og:image:width"' not in content:
        content = content.replace('<meta property="og:image"', '<meta property="og:image:width" content="1200">\n    <meta property="og:image:height" content="630">\n    <meta property="og:image"', 1)

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"[+] Corregido {tomo}")

if __name__ == "__main__":
    for t in TOMOS:
        fix_html(t)
