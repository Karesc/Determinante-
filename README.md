# El determinante como área

Página educativa interactiva para GitHub Pages.

## Archivos

- `index.html`: contenido de la página.
- `style.css`: diseño visual.
- `script.js`: animación y sliders.
- `generar_pagina.py`: script de Python asociado al proyecto.
- `assets/`: carpeta para imágenes, GIFs, etc.

## Publicarla en GitHub Pages

1. Crea un repositorio en GitHub.
2. Sube todos estos archivos.
3. Ve a:

   Settings → Pages

4. En "Build and deployment", selecciona:

   Deploy from a branch

5. Selecciona la rama `main` y la carpeta `/ (root)`.
6. Guarda.

GitHub generará una dirección similar a:

https://TU-USUARIO.github.io/NOMBRE-DEL-REPOSITORIO/

## Importante

GitHub Pages sirve archivos estáticos. Por eso:

- Python puede utilizarse para GENERAR la página.
- JavaScript controla los sliders y la animación en el navegador.
- No se necesita Flask, Django ni otro servidor.

La página usa MathJax desde CDN para renderizar las ecuaciones.
