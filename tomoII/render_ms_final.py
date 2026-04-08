import subprocess
import os

base_path = r"C:\Users\USUARIO\.gemini\antigravity\scratch\tomo2_production"
scratch_path = r"C:\Users\USUARIO\.gemini\antigravity\scratch"
brain_path = r"C:\Users\USUARIO\.gemini\antigravity\brain\3d87c7e5-e987-4018-9f65-83da42a81e7d"

logo_path = os.path.join(scratch_path, "ms_logo_gold.png")

videos = [
    {
        "img": os.path.join(brain_path, "v1_obregon_red_struggle_1774753902946.png"),
        "audio": os.path.join(base_path, "vox", "clip_1.mp3"),
        "ass": os.path.join(base_path, "v1.ass"),
        "out": os.path.join(base_path, "MS_1roMayo_V1_Despertar.mp4")
    },
    {
        "img": os.path.join(brain_path, "v2_obregon_red_march_1774753920138.png"),
        "audio": os.path.join(base_path, "vox", "clip_2.mp3"),
        "ass": os.path.join(base_path, "v2.ass"),
        "out": os.path.join(base_path, "MS_1roMayo_V2_Fuerza.mp4")
    },
    {
        "img": os.path.join(brain_path, "v3_obregon_red_cita_logo_1774753939176.png"),
        "audio": os.path.join(base_path, "vox", "clip_3.mp3"),
        "ass": os.path.join(base_path, "v3.ass"),
        "out": os.path.join(base_path, "MS_1roMayo_V3_Cita.mp4")
    }
]

def render_v4_pro(data):
    # Filter chain:
    # 1. Scale image to a padding size to avoid zoompan artifacts
    # 2. zoompan: slow zoom-in (z='zoom+0.0006')
    # 3. overlay logo
    # 4. apply ass subtitles
    
    # subtitles requires escaping backslashes for FFmpeg on Windows
    ass_path = data["ass"].replace("\\", "\\\\").replace(":", "\\:")
    
    cmd = [
        "ffmpeg", "-y",
        "-loop", "1", "-i", data["img"],
        "-i", logo_path,
        "-i", data["audio"],
        "-filter_complex", (
            f"[0:v]scale=2000:-1,zoompan=z='min(zoom+0.0006,1.5)':d=125:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1080x1920[v];"
            f"[1:v]scale=350:-1[logo];"
            f"[v][logo]overlay=W-w-100:100[vsub];"
            f"[vsub]ass='{ass_path}'[vfinal]"
        ),
        "-map", "[vfinal]", "-map", "2:a",
        "-shortest",
        "-c:v", "libx264", "-preset", "slow", "-crf", "18",
        "-c:a", "aac", "-b:a", "192k",
        "-pix_fmt", "yuv420p",
        data["out"]
    ]
    
    print(f"[*] PROCESANDO: {os.path.basename(data['out'])} con MOVIMIENTO...")
    subprocess.run(cmd, check=True)

if __name__ == "__main__":
    for v in videos:
        if os.path.exists(v["audio"]):
            render_v4_pro(v)
        else:
            print(f"[!] ERROR: No se encontró el audio para {v['out']}")
