import cv2
import numpy as np
import os

def make_transparent_cv2(input_path, output_path):
    # Cargar la imagen
    img = cv2.imread(input_path)
    if img is None:
        print(f"Error: No se pudo cargar {input_path}")
        return

    # Convertir a BGRA (con canal alfa)
    b, g, r = cv2.split(img)
    # Crear una máscara para el fondo blanco (255, 255, 255)
    # Usamos un umbral alto para capturar el blanco brillante del fondo
    alpha = np.ones(b.shape, dtype=b.dtype) * 255
    
    # Simple umbral: si r, g, y b son todos > 240, hacerlo transparente
    white_mask = (r > 200) & (g > 200) & (b > 200)
    alpha[white_mask] = 0

    # Combinar canales
    rgba = cv2.merge((b, g, r, alpha))
    
    cv2.imwrite(output_path, rgba)
    print(f"Logo procesado (CV2): {output_path}")

if __name__ == "__main__":
    src = r"C:\Users\USUARIO\.gemini\antigravity\scratch\tomo8_production\logo_ms.jpeg"
    dst = r"C:\Users\USUARIO\.gemini\antigravity\scratch\tomo8_production\logo_ms.png"
    make_transparent_cv2(src, dst)
