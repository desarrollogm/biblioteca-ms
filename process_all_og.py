import os
import subprocess

# Configuración de rutas
BASE_DIR = r"C:\Users\USUARIO\.gemini\antigravity\scratch\biblioteca-ms"
TOMOS = ["tomo1", "tomo2", "tomo3", "tomo4", "tomo5", "tomo6", "tomo7", "tomo8"]

def process_tomo(tomo):
    tomo_path = os.path.join(BASE_DIR, tomo)
    
    # Buscar imagen fuente (hero.png o portada.png)
    source = None
    possible_paths = [
        os.path.join(tomo_path, "images", "hero.png"),
        os.path.join(tomo_path, "assets", "images", "portada.png"),
        os.path.join(tomo_path, "images", "portada.png")
    ]
    
    for p in possible_paths:
        if os.path.exists(p):
            source = p
            break
            
    if not source:
        print(f"[-] No se encontró imagen fuente en {tomo}")
        return

    # Definir carpetas de salida
    output_dir = os.path.dirname(source)
    output_file = os.path.join(output_dir, "og_image.png")
    
    print(f"[*] Procesando {tomo}: {source} -> {output_file}")
    
    # Comando FFmpeg con efecto de bordes borrosos (cinematico)
    # 1. Scale background to fill 1200x630 (with blur)
    # 2. Scale foreground to fit height 630
    # 3. Overlay centered
    cmd = [
        "ffmpeg", "-y", "-i", source,
        "-vf", "split[a][b];[a]scale=1200:2133,boxblur=20:10,crop=1200:630[bg];[b]scale=-1:630[fg];[bg][fg]overlay=(W-w)/2:0",
        output_file
    ]
    
    try:
        subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.STDOUT)
        print(f"[+] Éxito en {tomo}")
    except subprocess.CalledProcessError as e:
        print(f"[!] Error procesando {tomo}: {e}")

if __name__ == "__main__":
    for t in TOMOS:
        process_tomo(t)
