# Cómo agregar o cambiar mecánicos en la página de Equipo

Todo sale de `datos/equipo.json`. No hay que tocar el HTML.

## 1. La foto (opcional, pero mejor con foto)

Pon la foto original en `fuentes/equipo/nombre-apellido.jpg` y corre:

```
python3 herramientas/fotos-equipo.py
```

Te dice qué nombre de archivo quedó (`nombre-apellido.webp`). Ese es el que va
en el campo `foto`.

Si una persona todavía no tiene foto, deja el campo `foto` fuera: la tarjeta
sale con sus iniciales en negro y no se ve incompleta.

## 2. Los datos

Abre `datos/equipo.json` y agrega un bloque dentro de `personas`:

```json
{
  "nombre": "Juan Pérez",
  "cargo": "Técnico de diagnóstico electrónico",
  "texto": "Conecta el escáner, lee los códigos y comprueba en el carro lo que dice la máquina.",
  "anos": 8,
  "numero": "01",
  "foto": "juan-perez.webp"
}
```

- `nombre` y `cargo` son obligatorios.
- `texto`: una o dos frases, en lenguaje de cliente, de qué hace.
- `anos`: años en Tecnissan. Si no está, no sale la línea.
- `numero`: el número del overol. Sale como placa sobre la foto. Si no está,
  no sale nada.
- `detalle`: la ficha larga que se abre al dar clic en la tarjeta. Es una
  lista, **un párrafo por elemento**:

  ```json
  "detalle": [
    "Primer párrafo.",
    "Segundo párrafo."
  ]
  ```

  Si una persona no tiene `detalle`, su tarjeta simplemente no se abre: no
  sale el «Ver ficha» y no queda un clic que no hace nada.
- El orden de la lista es el orden en que salen las tarjetas.

## 3. Generar

```
node herramientas/equipo.mjs
```

Eso reescribe la sección "uno por uno" de `site/equipo.html` y mete a cada
persona en los datos estructurados de la página (lo que lee Google).

Si la lista queda vacía, la sección desaparece sola: no deja títulos sueltos
ni espacios en blanco.

## 4. Subir

Commit y push. Listo.

---

**Antes de publicar:** son caras y nombres de personas reales en una página
pública. Conviene avisarles y tener su permiso.
