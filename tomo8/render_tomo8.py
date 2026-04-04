import os
import subprocess

def run_ffmpeg(cmd):
    print(f"Ejecutando: {' '.join(cmd)}")
    subprocess.run(cmd, check=True)

def render_scene(scene_num, img, audio, subs, duration, logo, output):
    # Usar rutas compatibles con Windows para el filtro 'ass'
    # FFmpeg necesita escapes específicos para los dos puntos de la unidad (C:)
    # Y prefiere barras diagonales (/)
    abs_subs = os.path.abspath(subs).replace("\\", "/").replace(":", "\\:")
    
    cmd = [
        "ffmpeg", "-y",
        "-loop", "1", "-i", img,
        "-i", audio,
        "-i", logo,
        "-filter_complex", (
            f"[0:v]scale=2160x3840,zoompan=z='min(zoom+0.0004,1.2)':d={int(float(duration)*25)}:s=1080x1920,setsar=1[v];"
            f"[v][2:v]overlay=W-w-50:50[vlogo];"
            f"[vlogo]ass='{abs_subs}'[vfinal]"
        ),
        "-map", "[vfinal]",
        "-map", "1:a",
        "-c:v", "libx264", "-preset", "slow", "-crf", "18",
        "-c:a", "aac", "-b:a", "192k",
        "-t", str(duration),
        output
    ]
    
    run_ffmpeg(cmd)

if __name__ == "__main__":
    # Asegurarnos de estar en el directorio de trabajo correcto
    os.chdir(r"C:\Users\USUARIO\.gemini\antigravity\scratch")
    
    base_dir = r"C:\Users\USUARIO\.gemini\antigravity\scratch\tomo8_production"
    logo = os.path.join(base_dir, "logo_ms.png")
    
    # Escena 1: Combinar audios
    sc1_audio = os.path.join(base_dir, "sc1_full.mp3")
    cmd_sc1_audio = [
        "ffmpeg", "-y",
        "-i", os.path.join(base_dir, "vox_sc1_kristian.mp3"),
        "-i", os.path.join(base_dir, "vox_sc1_paloma.mp3"),
        "-filter_complex", "concat=n=2:v=0:a=1",
        sc1_audio
    ]
    run_ffmpeg(cmd_sc1_audio)
    
    # Render Scene 1
    render_scene("1", "tomo8_production/sc1.png", "tomo8_production/sc1_full.mp3", "tomo8_production/v1.ass", "31.39", "tomo8_production/logo_ms.png", "tomo8_production/v1.mp4")
    
    # Escena 2 y 3 directas
    render_scene("2", "tomo8_production/sc2.png", "tomo8_production/vox_sc2_kristian.mp3", "tomo8_production/v2.ass", "18.14", "tomo8_production/logo_ms.png", "tomo8_production/v2.mp4")
    render_scene("3", "tomo8_production/sc3.png", "tomo8_production/vox_sc3_paloma.mp3", "tomo8_production/v3.ass", "15.96", "tomo8_production/logo_ms.png", "tomo8_production/v3.mp4")

    # Escena 4: Combinar audios Duo
    sc4_audio = os.path.join(base_dir, "sc4_full.mp3")
    cmd_sc4_audio = [
        "ffmpeg", "-y",
        "-i", os.path.join(base_dir, "vox_sc4_paloma.mp3"),
        "-i", os.path.join(base_dir, "vox_sc4_kristian.mp3"),
        "-filter_complex", "concat=n=2:v=0:a=1",
        sc4_audio
    ]
    run_ffmpeg(cmd_sc4_audio)
    
    render_scene("4", "tomo8_production/sc4.png", "tomo8_production/sc4_full.mp3", "tomo8_production/v4.ass", "11.35", "tomo8_production/logo_ms.png", "tomo8_production/v4.mp4")

    # Concat Final
    concat_list = os.path.join(base_dir, "concat.txt")
    with open(concat_list, "w") as f:
        f.write("file 'v1.mp4'\nfile 'v2.mp4'\nfile 'v3.mp4'\nfile 'v4.mp4'\n")
    
    cmd_final = [
        "ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", concat_list,
        "-c", "copy",
        os.path.join(base_dir, "Tomo8_MS_Final.mp4")
    ]
    run_ffmpeg(cmd_final)
    print("PRODUCCIÓN FINALIZADA: Tomo8_MS_Final.mp4")
