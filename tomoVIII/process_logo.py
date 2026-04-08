import PIL.Image as Image
import os

def make_transparent(input_path, output_path):
    img = Image.open(input_path)
    img = img.convert("RGBA")
    datas = img.getdata()

    new_data = []
    # Umbral para el blanco (el logo tiene fondo blanco)
    for item in datas:
        if item[0] > 200 and item[1] > 200 and item[2] > 200:
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)

    img.putdata(new_data)
    img.save(output_path, "PNG")

if __name__ == "__main__":
    src = r"C:\Users\USUARIO\.gemini\antigravity\scratch\tomo8_production\logo_ms.jpeg"
    dst = r"C:\Users\USUARIO\.gemini\antigravity\scratch\tomo8_production\logo_ms.png"
    make_transparent(src, dst)
    print(f"Logo procesado: {dst}")
