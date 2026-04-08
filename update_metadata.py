import os
import re

BASE_DIR = r"C:\Users\USUARIO\.gemini\antigravity\scratch\biblioteca-ms"
TOMOS = ["tomo1", "tomo2", "tomo3", "tomo4", "tomo5", "tomo6", "tomo7", "tomo8"]

def update_html(tomo):
    file_path = os.path.join(BASE_DIR, tomo, "index.html")
    if not os.path.exists(file_path):
        print(f"[-] No se encontró {file_path}")
        return

    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Determinar ruta de imagen basándose en lo que hay en el disco
    img_rel_path = "images/og_image.png"
    if tomo == "tomo2":
        img_rel_path = "assets/images/og_image.png"
        
    img_url = f"https://desarrollogm.github.io/biblioteca-ms/{tomo}/{img_rel_path}"

    # Reemplazos usando expresiones regulares para mayor robustez
    # 1. og:image
    content = re.sub(r'(<meta property="og:image" content=")[^"]+(">)', f'\\1{img_url}\\2', content)
    # 2. og:image:width (puede no existir aún)
    if 'og:image:width' in content:
        content = re.sub(r'(<meta property="og:image:width" content=")[^"]+(">)', r'\11200\2', content)
    else:
        content = content.replace('<meta property="og:image"', '<meta property="og:image:width" content="1200">\n    <meta property="og:image"', 1)
        
    # 3. og:image:height
    if 'og:image:height' in content:
        content = re.sub(r'(<meta property="og:image:height" content=")[^"]+(">)', r'\1630\2', content)
    else:
        content = content.replace('<meta property="og:image:width"', '<meta property="og:image:height" content="630">\n    <meta property="og:image:width"', 1)

    # 4. twitter:image
    content = re.sub(r'(<meta name="twitter:image" content=")[^"]+(">)', f'\\1{img_url}\\2', content)

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"[+] Actualizado {tomo}")

if __name__ == "__main__":
    for t in TOMOS:
        update_html(t)
