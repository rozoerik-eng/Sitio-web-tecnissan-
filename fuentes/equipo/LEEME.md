# Fotos del equipo

Aquí van las fotos **originales** de cada persona del taller, como salgan del
celular. No importa el tamaño ni la orientación.

Nombra cada archivo con el nombre de la persona, en minúsculas y con guiones:

```
juan-perez.jpg
maria-gomez.jpg
```

Después corre, desde la raíz del repositorio:

```
python3 herramientas/fotos-equipo.py
```

Eso deja en `site/assets/equipo/` la versión recortada a 3:4 y comprimida
(`juan-perez.webp`), que es la que usa la web. Esta carpeta (`fuentes/`) **no
se publica**: solo guarda los originales.

Si alguna foto queda mal encuadrada, muévele el recorte a lo alto:

```
python3 herramientas/fotos-equipo.py juan-perez.jpg --alto 0
```

`--alto 0` pega el recorte al borde de arriba, `1` al de abajo, y por defecto
va en `0.12` (casi arriba, que es donde suele estar la cara).
