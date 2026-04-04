import cv2
import numpy as np
import os

def edit_cap4_image(input_path, output_path):
    img = cv2.imread(input_path)
    if img is None:
        print("Error al cargar imagen.")
        return
    
    # Dibujar un rectángulo negro para tapar los números anteriores o banner (ajuste manual ciego)
    # y poner el texto "100% AUMENTO"
    h, w = img.shape[:2]
    
    # Overlay de banner con "100% AUMENTO SALARIAL"
    overlay = img.copy()
    cv2.rectangle(overlay, (int(w*0.1), int(h*0.3)), (int(w*0.9), int(h*0.4)), (0, 0, 0), -1)
    
    font = cv2.FONT_HERSHEY_DUPLEX
    text = "100% AUMENTO SALARIAL"
    text_size = cv2.getTextSize(text, font, 1.5, 3)[0]
    text_x = (w - text_size[0]) // 2
    text_y = int(h * 0.35) + (text_size[1] // 2)
    
    cv2.putText(overlay, text, (text_x, text_y), font, 1.5, (0, 215, 255), 3, cv2.LINE_AA)
    
    # Mezclar un poco para que no se vea tan plano
    final = cv2.addWeighted(overlay, 0.8, img, 0.2, 0)
    
    cv2.imwrite(output_path, final)
    print(f"Imagen Cap 4 corregida: {output_path}")

if __name__ == "__main__":
    src = r"C:\Users\USUARIO\.gemini\antigravity\brain\21790438-3d2a-4324-ad81-91b8b0b2ba4c\tomo8_cap4_justicia_matematica_1774925932097.png"
    dst = r"C:\Users\USUARIO\.gemini\antigravity\scratch\StoryBook_Tomo8\images\tomo8_cap4_justicia_matematica.png"
    edit_cap4_image(src, dst)
