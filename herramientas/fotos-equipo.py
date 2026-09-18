#!/usr/bin/env python3
"""
Convierte las fotos del equipo a lo que necesitan las tarjetas.

Uso:
    python3 herramientas/fotos-equipo.py

Pon las fotos originales (como salgan del celular, da igual el tamano) en
fuentes/equipo/ con el nombre de la persona:  juan-perez.jpg
El script deja site/assets/equipo/juan-perez.webp recortada 3:4 y lista, y
ese nombre de archivo es el que va en el campo "foto" de datos/equipo.json.

Recorta centrado a lo alto pero pegado arriba, que es donde esta la cara.
Si una foto queda mal recortada, pasale el encuadre a mano:
    python3 herramientas/fotos-equipo.py juan-perez.jpg --alto 0.1
(--alto 0 = pegado al borde de arriba, 1 = pegado al de abajo)
"""

import argparse
import sys
import unicodedata
from pathlib import Path

from PIL import Image, ImageOps

RAIZ = Path(__file__).resolve().parent.parent
ORIGEN = RAIZ / "fuentes" / "equipo"
DESTINO = RAIZ / "site" / "assets" / "equipo"

ANCHO, ALTO = 600, 800          # 3:4, el aspecto que espera .persona-foto
CALIDAD = 82
EXTENSIONES = {".jpg", ".jpeg", ".png", ".webp", ".heic", ".HEIC"}


def slug(nombre: str) -> str:
    base = unicodedata.normalize("NFKD", nombre).encode("ascii", "ignore").decode()
    limpio = "".join(c if c.isalnum() else "-" for c in base.lower())
    while "--" in limpio:
        limpio = limpio.replace("--", "-")
    return limpio.strip("-")


def recorta(ruta: Path, alto: float) -> Path:
    im = Image.open(ruta)
    im = ImageOps.exif_transpose(im)          # el celular guarda la rotacion aparte
    im = im.convert("RGB")
    an, al = im.size

    objetivo = ANCHO / ALTO
    if an / al > objetivo:                     # sobra ancho: recorto a los lados
        nuevo_an = round(al * objetivo)
        x = (an - nuevo_an) // 2
        caja = (x, 0, x + nuevo_an, al)
    else:                                      # sobra alto: recorto arriba/abajo
        nuevo_al = round(an / objetivo)
        y = round((al - nuevo_al) * alto)
        caja = (0, y, an, y + nuevo_al)

    im = im.crop(caja).resize((ANCHO, ALTO), Image.LANCZOS)
    salida = DESTINO / f"{slug(ruta.stem)}.webp"
    im.save(salida, "WEBP", quality=CALIDAD, method=6)
    return salida


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("archivos", nargs="*", help="nombres dentro de fuentes/equipo/ (vacio = todas)")
    ap.add_argument("--alto", type=float, default=0.12,
                    help="de donde recorta a lo alto: 0 arriba, 1 abajo (por defecto 0.12)")
    args = ap.parse_args()

    if not ORIGEN.is_dir():
        print(f"No existe {ORIGEN.relative_to(RAIZ)}. Crea la carpeta y pon ahi las fotos.")
        return 1
    DESTINO.mkdir(parents=True, exist_ok=True)

    if args.archivos:
        fotos = [ORIGEN / n for n in args.archivos]
        faltan = [f for f in fotos if not f.is_file()]
        if faltan:
            for f in faltan:
                print(f"No encontre {f.relative_to(RAIZ)}")
            return 1
    else:
        fotos = sorted(f for f in ORIGEN.iterdir()
                       if f.is_file() and f.suffix.lower() in EXTENSIONES)

    if not fotos:
        print(f"No hay fotos en {ORIGEN.relative_to(RAIZ)}.")
        return 0

    for f in fotos:
        try:
            salida = recorta(f, max(0.0, min(1.0, args.alto)))
        except Exception as e:                  # una foto rota no debe tumbar el resto
            print(f"  ! {f.name}: {e}")
            continue
        print(f"  {f.name}  ->  {salida.relative_to(RAIZ)}   (foto: \"{salida.name}\")")
    return 0


if __name__ == "__main__":
    sys.exit(main())
