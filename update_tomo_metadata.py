import os
import re

BASE_DIR = r"C:\Users\USUARIO\.gemini\antigravity\scratch\biblioteca-ms"
TOMO_MAP = {
    "tomoI": "tomo1",
    "tomoII": "tomo2",
    "tomoIII": "tomo3",
    "tomoIV": "tomo4",
    "tomoV": "tomo5",
    "tomoVI": "tomo6",
    "tomoVII": "tomo7",
    "tomoVIII": "tomo8"
}

def update_tomo_metadata(roman_folder, arabic_name):
    file_path = os.path.join(BASE_DIR, roman_folder, f"{arabic_name}.html")
    if not os.path.exists(file_path):
        print(f"[!] No existe: {file_path}")
        return

    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Extraer og:description para usarlo en la meta description
    desc_match = re.search(r'<meta property="og:description" content="([^"]+)">', content)
    description = desc_match.group(1) if desc_match else ""

    # 2. Insertar meta name="description" antes de og:title (o cerca del inicio del head)
    if '<meta name="description"' not in content and description:
        content = content.replace('<meta property="og:title"', f'<meta name="description" content="{description}">\n    <meta property="og:title"', 1)

    # 3. Actualizar og:url
    old_url_pattern = r'property="og:url" content="https://desarrollogm.github.io/biblioteca-ms/tomo\d+/index\.html"'
    new_url = f'property="og:url" content="https://desarrollogm.github.io/biblioteca-ms/{roman_folder}/{arabic_name}.html"'
    content = re.sub(old_url_pattern, new_url, content)

    # 4. Actualizar rutas de imágenes en metadatos (tomoX -> tomo[ROMAN])
    # Match strings like /tomo1/images/
    content = re.sub(r'/tomo\d+/images/', f'/{roman_folder}/images/', content)

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"[+] Metadatos actualizados en {roman_folder}/{arabic_name}.html")

if __name__ == "__main__":
    for roman, arabic in TOMO_MAP.items():
        update_tomo_metadata(roman, arabic)
