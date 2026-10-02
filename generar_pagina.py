from pathlib import Path
import shutil

# Este archivo sirve para regenerar la página.
# Coloca aquí los textos, estilos y scripts que quieras modificar
# y ejecuta:
#
#     python generar_pagina.py
#
# GitHub Pages no ejecuta este Python en línea:
# Python se utiliza para generar los archivos estáticos.

ROOT = Path(__file__).parent

# Si después quieres automatizar la generación, puedes leer plantillas
# o modificar archivos desde Python.
print("Página generada en:", ROOT.resolve())
print("Archivos principales:")
for p in ROOT.iterdir():
    if p.is_file():
        print(" -", p.name)
