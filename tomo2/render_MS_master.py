import os
import subprocess

# Paths
BASE_DIR = r"C:\Users\USUARIO\.gemini\antigravity\scratch\tomo2_production\staging"
OUTPUT_DIR = r"C:\Users\USUARIO\.gemini\antigravity\scratch\tomo2_production\output"
LOGO = os.path.join(BASE_DIR, "logo.png")

# Audio Durations
DURATIONS = {
    "1": 8.2,
    "2": 11.1,
    "3": 7.9
}

# FFmpeg Command Template for Ken Burns + Audio + Branding
def render_scene(id, type="zoom"):
    img = os.path.join(BASE_DIR, f"escena{id}.png")
    aud = os.path.join(BASE_DIR, f"audio{id}.mp3")
    out = os.path.join(OUTPUT_DIR, f"scene{id}.mp4")
    dur = DURATIONS[str(id)]
    frames = int(dur * 25)
    
    # Improved Ken Burns filters (using 'on' for frame number)
    if type == "zoom":
        vf = f"scale=1440:2560,zoompan=z='min(zoom+0.001,1.5)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={frames}:s=720x1280"
    elif type == "pan":
        # Pan right
        vf = f"scale=1280:2275,zoompan=z=1.15:x='on*1.5':y='ih/2-(ih/zoom/2)':d={frames}:s=720x1280"
    else:
        vf = f"scale=720:1280"
        
    cmd = [
        "ffmpeg", "-y", "-loop", "1", "-i", img, "-i", aud, "-i", LOGO,
        "-filter_complex", 
        f"[0:v]{vf}[bg];"
        f"[2:v]scale=250:-1[logo];"
        f"[bg][logo]overlay=main_w-overlay_w-40:40[v]",
        "-map", "[v]", "-map", "1:a", "-c:v", "libx264", "-c:a", "aac", "-t", str(dur), "-pix_fmt", "yuv420p", out
    ]
    subprocess.run(cmd)

# Execution
if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

print("[*] Rendering Scene 1 (Zoom)...")
render_scene(1, "zoom")

print("[*] Rendering Scene 2 (Pan)...")
render_scene(2, "pan")

print("[*] Rendering Scene 3 (Zoom Out)...")
render_scene(3, "zoom")

# Concat
with open(os.path.join(OUTPUT_DIR, "list.txt"), "w") as f:
    f.write(f"file 'scene1.mp4'\nfile 'scene2.mp4'\nfile 'scene3.mp4'")

print("[*] Concatenating Final Master...")
final_cmd = [
    "ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", os.path.join(OUTPUT_DIR, "list.txt"),
    "-c", "copy", os.path.join(OUTPUT_DIR, "MS_1roMayo_KRISTIAN_MASTER_v2.mp4")
]
subprocess.run(final_cmd)

print("[+] Done! Master: MS_1roMayo_KRISTIAN_MASTER_v2.mp4")
