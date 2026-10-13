from pathlib import Path
import shutil

ROOT = Path(__file__).parent

print("Página generada en:", ROOT.resolve())
print("Archivos principales:")
for p in ROOT.iterdir():
    if p.is_file():
        print(" -", p.name)
