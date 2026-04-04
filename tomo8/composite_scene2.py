import cv2
import numpy as np

def composite_logo(base_path, logo_path, output_path):
    # Cargar escena base y logo transparente
    base = cv2.imread(base_path)
    logo = cv2.imread(logo_path, cv2.IMREAD_UNCHANGED)
    
    if base is None or logo is None:
        print("Error al cargar archivos.")
        return

    # Redimensionar el logo para que quepa en la pancarta
    # Asumimos que la pancarta está en el primer plano central
    h, w = base.shape[:2]
    logo_h, logo_w = logo.shape[:2]
    
    # Escalar logo (aprox 30% del ancho de la imagen para que se vea real)
    scale = (w * 0.4) / logo_w
    new_logo_w = int(logo_w * scale)
    new_logo_h = int(logo_h * scale)
    logo_resized = cv2.resize(logo, (new_logo_w, new_logo_h))

    # Coordenadas de inserción (ajuste manual para la pancarta del primer plano)
    # En la imagen anterior, la 'blank banner' suele estar centrada
    y_offset = int(h * 0.5)
    x_offset = int((w - new_logo_w) / 2)

    # Superposición con canal alfa
    alpha_logo = logo_resized[:, :, 3] / 255.0
    alpha_base = 1.0 - alpha_logo

    for c in range(0, 3):
        base[y_offset:y_offset+new_logo_h, x_offset:x_offset+new_logo_w, c] = (
            alpha_logo * logo_resized[:, :, c] +
            alpha_base * base[y_offset:y_offset+new_logo_h, x_offset:x_offset+new_logo_w, c]
        )

    cv2.imwrite(output_path, base)
    print(f"Composición final lista: {output_path}")

if __name__ == "__main__":
    base_file = r"C:\Users\USUARIO\.gemini\antigravity\brain\21790438-3d2a-4324-ad81-91b8b0b2ba4c\tomo8_escena2_manta_base_urbana_1774924378218.png"
    logo_file = r"C:\Users\USUARIO\.gemini\antigravity\scratch\tomo8_production\logo_ms.png"
    output_file = r"C:\Users\USUARIO\.gemini\antigravity\brain\21790438-3d2a-4324-ad81-91b8b0b2ba4c\tomo8_escena2_FINAL.png"
    composite_logo(base_file, logo_file, output_file)
