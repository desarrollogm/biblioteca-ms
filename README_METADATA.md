# Guía de Metadatos - Biblioteca Digital MS

Esta guía define el estándar técnico para los metadatos de los tomos de la Biblioteca Digital MS, optimizado para WhatsApp, Facebook y Twitter.

## Bloque Estándar (Copiar y Pegar)

Este código debe ir dentro de la etiqueta `<head>` de cada archivo HTML.

```html
    <!-- Metadatos de Redes Sociales / WhatsApp -->
    <meta property="og:type" content="article">
    <meta property="og:site_name" content="Biblioteca Digital MS">
    <meta property="og:url" content="https://desarrollogm.github.io/biblioteca-ms/tomo[NUMERO]/tomo[NUMERO].html">
    <meta property="og:title" content="Tomo [NUMERO]: [TITULO] | Biblioteca Digital MS">
    <meta property="og:description" content="[RESUMEN DEL TOMO]">
    <meta property="og:image" content="https://desarrollogm.github.io/biblioteca-ms/tomo[NUMERO]/images/portada.png">
    <meta property="og:image:secure_url" content="https://desarrollogm.github.io/biblioteca-ms/tomo[NUMERO]/images/portada.png">
    <meta property="og:image:type" content="image/png">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Tomo [NUMERO]: [TITULO] | Magisterio Sonorense">
    <meta name="twitter:description" content="[RESUMEN DEL TOMO]">
    <meta name="twitter:image" content="https://desarrollogm.github.io/biblioteca-ms/tomo[NUMERO]/images/portada.png">

    <!-- WhatsApp / Schema.org -->
    <meta itemprop="name" content="Tomo [NUMERO]: [TITULO] | Biblioteca Digital MS">
    <meta itemprop="description" content="[RESUMEN DEL TOMO]">
    <meta itemprop="image" content="https://desarrollogm.github.io/biblioteca-ms/tomo[NUMERO]/images/portada.png">
```

## Reglas Críticas

1. **Rutas Absolutas**: WhatsApp requiere URLs completas que comiencen con `https://`. No usar rutas relativas como `./images/...`.
2. **Tamaño de Imagen**: La imagen `portada.png` debe ser de **1200x630 px** (proporción 1.91:1) y pesar preferiblemente **menos de 300KB** para una carga instantánea.
3. **Cache-Busting**: Si actualizas la imagen pero WhatsApp sigue mostrando la anterior, añade un parámetro al final del link al compartirlo: `?v=1`.
4. **Validación**: Usa el [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) para forzar a las redes a re-escanear el sitio.

---
*Mantenido por el Equipo Técnico del Magisterio Sonorense*
