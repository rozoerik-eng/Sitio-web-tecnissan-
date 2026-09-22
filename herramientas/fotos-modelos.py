#!/usr/bin/env python3
"""
Prepara las fotos de los modelos para la franja del inicio.

Uso:
    python3 herramientas/fotos-modelos.py            # todas las de fuentes/modelos/
    python3 herramientas/fotos-modelos.py Note.PNG   # solo una

Las fotos vienen de catalogo, con fondo transparente y mucho margen
sobrante alrededor del carro, y cada una con el carro a distinto tamano.
El script recorta ese margen y vuelve a encuadrar todas igual, para que en
la franja los catorce carros se vean del mismo porte.

Tambien limpia el halo tenue que traen en el borde: pixeles casi
transparentes que sobre fondo blanco se ven como una mancha gris.
"""

import sys
import unicodedata
from pathlib import Path

from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
ORIGEN = RAIZ / "fuentes" / "modelos"
DESTINO = RAIZ / "site" / "assets" / "modelos"

ANCHO, ALTO = 680, 453     # el tamano con el que se montaron las diez primeras
MARGEN_X = 18              # aire a los lados, en pixeles del lienzo final
MARGEN_Y = 34              # aire arriba y abajo
ALFA_MINIMA = 12           # por debajo de esto el pixel es halo, no carro
CALIDAD = 82


def slug(nombre: str) -> str:
    base = unicodedata.normalize("NFKD", nombre).encode("ascii", "ignore").decode()
    return "".join(c if c.isalnum() or c == "-" else "-" for c in base.lower()).strip("-")


def prepara(ruta: Path) -> Path:
    im = Image.open(ruta).convert("RGBA")

    # 1. fuera el halo: lo casi transparente pasa a transparente del todo
    alfa = im.getchannel("A").point(lambda a: 0 if a < ALFA_MINIMA else a)
    im.putalpha(alfa)

    # 2. recorta el margen vacio que rodea al carro
    caja = alfa.getbbox()
    if caja:
        im = im.crop(caja)

    # 3. escala para que quepa en el hueco util, sin deformar
    util_x, util_y = ANCHO - 2 * MARGEN_X, ALTO - 2 * MARGEN_Y
    escala = min(util_x / im.width, util_y / im.height)
    im = im.resize((max(1, round(im.width * escala)), max(1, round(im.height * escala))),
                   Image.LANCZOS)

    # 4. centrado en el lienzo final, transparente
    lienzo = Image.new("RGBA", (ANCHO, ALTO), (0, 0, 0, 0))
    lienzo.paste(im, ((ANCHO - im.width) // 2, (ALTO - im.height) // 2), im)

    salida = DESTINO / f"{slug(ruta.stem)}.webp"
    lienzo.save(salida, "WEBP", quality=CALIDAD, method=6)
    return salida


def main() -> int:
    if not ORIGEN.is_dir():
        print(f"No existe {ORIGEN.relative_to(RAIZ)}")
        return 1
    DESTINO.mkdir(parents=True, exist_ok=True)

    pedidas = sys.argv[1:]
    if pedidas:
        fotos = [ORIGEN / n for n in pedidas]
        faltan = [f for f in fotos if not f.is_file()]
        for f in faltan:
            print(f"No encontre {f.relative_to(RAIZ)}")
        if faltan:
            return 1
    else:
        fotos = sorted(f for f in ORIGEN.iterdir()
                       if f.is_file() and f.suffix.lower() == ".png")

    for f in fotos:
        salida = prepara(f)
        kb = salida.stat().st_size / 1024
        print(f"  {f.name}  ->  {salida.relative_to(RAIZ)}  ({kb:.0f} KB)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
