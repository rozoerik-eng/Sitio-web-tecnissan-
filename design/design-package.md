# Paquete de diseño: Tecnissan

Documento único del build. Todo lo que está aquí se construye tal cual.
El texto para el visitante se copia **verbatim**, nunca se parafrasea.

Tier: **1** (un solo plano continuo de 6 segundos, scrubbed por scroll).
Caso de assets: **negocio real, con logo y fotos propias** (el usuario las entrega).
Público primario: dueños particulares de Nissan (March, Versa, Sentra, Tiida, Qashqai, X-Trail, Kicks).
Sensación: precisión técnica y confianza.

---

## 0. Datos reales pendientes (tokens a reemplazar)

Estos valores no se inventan. Mientras no lleguen, el sitio usa el token y
el build NO se publica.

| Token | Qué es |
|---|---|
| `{{WHATSAPP_E164}}` | Número de WhatsApp en formato internacional sin signos, ej. 573001234567 |
| `{{WHATSAPP_VISIBLE}}` | El mismo número como se lee, ej. +57 300 123 4567 |
| `{{DIRECCION}}` | Dirección exacta del taller |
| `{{CIUDAD}}` | Ciudad y país |
| `{{MAPS_EMBED_Q}}` | La dirección codificada para el iframe de Google Maps |
| `{{HORARIO_SEMANA}}` | Horario lunes a viernes |
| `{{HORARIO_SABADO}}` | Horario sábado |
| `{{ANIOS}}` | Años de operación del taller |
| `{{EMAIL}}` | Correo donde llegan los mensajes del formulario |
| `{{FUNDADOR}}` | Quién fundó el taller |
| `{{EQUIPO}}` | Nombres, cargos y años trabajando Nissan |
| `{{TESTIMONIOS}}` | Reseñas reales de clientes, con nombre y modelo del carro |

---

## 1. Investigación de clientes (lenguaje real, recogido de reseñas y foros)

**Dolores, en sus palabras**
- El mantenimiento oficial les parece carísimo, y lo dicen con cifras (300 por una revisión, 430 por un inyector).
- No les explican nada. Trustpilot tiene el servicio de Nissan en 1,4 sobre 5, y la queja que más se repite es falta de transparencia y atención inexistente.
- La caja CVT empieza a sonar, a calentarse y a quedarse cerca de los 100.000 km.
- El taller general no sabe de CVT. Ya fueron a uno y no les supieron decir qué era.
- Miedo concreto: que le cambien piezas que no necesitaba.

**Deseos**
- Que le digan qué tiene el carro antes de tocarlo.
- El precio dicho antes de empezar.
- Que quien lo atienda sepa de Nissan, con el escáner correcto.
- Que le expliquen en palabras que entienda.
- Que se lo entreguen cuando dijeron.

**Objeciones que la página responde**
1. ¿Repuestos originales o genéricos?
2. ¿Pierdo la garantía si no voy al concesionario?
3. ¿Cuánto me va a costar de verdad?
4. ¿Sí tienen el escáner de Nissan o van a adivinar?
5. ¿Cuánto se demoran?

**El dato de oro**
Buena parte de la mala fama de la CVT viene de que nadie le hace el cambio de
aceite cada 40.000 a 50.000 km. Tecnissan es el único que lo va a decir en su
sitio, y eso da una razón para escribir hoy.

## 2. La única acción

**Escribir por WhatsApp para agendar el diagnóstico.**
Todo en la página empuja ahí. El mapa, los horarios y el formulario existen
para los que no usan WhatsApp, no como acciones que compiten.

---

## 3. Marca

**Premisa:** un taller que solo hace Nissan, y que te dice qué tiene tu carro
antes de tocarlo.

**Paleta** (sacada del mundo del video: azul de sombra, aluminio, luz de diagnóstico)

```
--noche:    #0A1320   canvas, nunca negro puro
--noche-2:  #0F1B2B   superficies elevadas
--carbon:   #16243A   bordes y tarjetas
--acero:    #8496AB   texto secundario, etiquetas
--aluminio: #C9D6E4   texto de apoyo
--luz:      #E9F0F8   texto principal, nunca blanco puro
--diagnos:  #5FD0FF   ACENTO de marca, en dosis mínimas
--wa:       #25D366   solo botones de WhatsApp
```

Dos acentos, y es a propósito: `--diagnos` es la marca y va con cuentagotas
(subrayados, etiquetas mono, la línea SVG que se dibuja). `--wa` no es
decoración, es la señal funcional de WhatsApp, y por eso solo vive en esos
botones. Lo digo en voz alta porque rompe la regla de un acento único.

**Tipografía**
- Display: **Archivo** variable, eje de ancho en 112 (ancha, de ingeniería, con carácter)
- Texto: **Sora**
- Etiquetas pequeñas y cifras: **JetBrains Mono**

**Elemento firma:** la **línea de diagnóstico**. Un trazo SVG de 1px en
`--diagnos` que se dibuja solo al hacer scroll, recorre la página de sección en
sección y late suave donde hay un número. Es el escáner leyendo el carro,
convertido en la costura visual del sitio.

**Motivos:** rejilla de taller a 4% de opacidad, esquinas cortadas a 45 grados
en tarjetas (como una placa de metal), y cifras siempre en mono con etiqueta
arriba.

---

## 4. Guion del video (Tier 1, 6 segundos, image-to-video, 1080p, 16:9)

**Mundo:** el vano de un motor Nissan impecable en un taller oscuro y ordenado,
luz fría entrando de lado, aluminio y azul de sombra.

**Movimiento:** un solo plano continuo. La cámara viaja baja y pegada sobre el
metal del motor, avanzando lentamente hacia adelante, la luz barre las
superficies a medida que pasa, y al final la cámara se retira y se abre hasta
descansar en la bahía de servicio completa, ordenada, con el carro sobre el
elevador al fondo a la derecha.

**Cruce de frontera y momento de lente:** al salir del vano del motor hacia la
bahía abierta, la profundidad de campo se abre y el destello de la luz lateral
recorre el lente una vez. Ese es el latido del scroll.

**Frame final exacto (descansa de verdad):** plano amplio y quieto de la bahía.
El carro sobre el elevador ocupa el tercio derecho. **El tercio izquierdo queda
vacío y oscuro**, que es donde aterriza el texto de descanso.

**Carril de acción:** centro y derecha del cuadro. Los subtítulos viven en la
franja izquierda y en la inferior, nunca encima del motor.

**Prompt del frame inicial (imagen, 16:9, 2k):**
> Cinematic macro photograph, low camera close over the polished aluminium and
> deep blue shadow of an immaculate modern four cylinder engine bay, cool side
> light raking across brushed metal and clean hoses, dark tidy service workshop
> far behind in soft focus, deep navy and steel grey palette, single cool key
> light, volumetric haze, shallow depth of field, no text, no logos, no badges,
> no brand marks, no people, no hands, photorealistic, 35mm, high detail

**Prompt del movimiento (video):**
> Single continuous shot, no cuts. The camera glides slowly forward low over the
> polished engine bay as cool light rakes across the metal, then smoothly pulls
> back and widens, revealing the full tidy service bay with a car raised on a
> lift at the right, and comes to a complete rest on that wide framing. Slow
> deliberate motion, subtle lens flare once as the frame opens, volumetric dust
> in the light, no cuts, no text, no logos, no people.

**Tomas de apoyo (2 a 4 imágenes, mismo mundo, misma luz, misma paleta):**
1. La tableta del escáner sobre el guardabarros, luz fría, pantalla apagada (sin texto ni interfaz).
2. Detalle de una caja CVT limpia sobre el banco, aluminio y azul.
3. La bahía vista desde la puerta, vacía y ordenada, luz de tragaluz.

Si el usuario entrega fotos reales del taller y del equipo, **esas mandan** en
las secciones de equipo y de lugar, y las generadas solo rellenan lo que no
tenga foto.

---

## 5. Mapa de franjas del scrub (punto de partida, se valida con el flick test)

El video se mapea a ~4 alturas de pantalla de scroll.

| Franja | Rango | Texto (verbatim) |
|---|---|---|
| 0 | 0.00 - 0.10 | Etiqueta mono: `ESPECIALISTAS NISSAN` · marca quieta · pista de scroll |
| 1 | 0.10 - 0.32 | **Tu Nissan no necesita adivinanzas.** / Necesita a quien lo conoce por dentro. |
| 2 | 0.34 - 0.56 | **Primero el diagnóstico. Después la llave inglesa.** / Con el escáner de Nissan, no con el oído. |
| 3 | 0.58 - 0.78 | **El precio, dicho antes de empezar.** / Nunca una pieza que no necesitabas. |
| 4 | 0.80 - 1.00 | **Solo Nissan. Nada más.** (descanso, en el tercio izquierdo) + botón de WhatsApp |

Cada franja entra con su propia animación, lleva su velo de contraste detrás,
y dura un flick de scroll.

---

## 6. La página debajo del video

1. **Nav fija:** logo Tecnissan, enlaces (Servicios, Equipo, Cómo llegar, Preguntas), botón de WhatsApp.
2. **Franja de prueba:** tres cifras en mono. `{{ANIOS}}` años solo en Nissan · escáner de diagnóstico Nissan · presupuesto antes de tocar el carro.
3. **Por qué un taller solo de Nissan.** Tres columnas con la línea de diagnóstico uniéndolas.
4. **Servicios.** Seis tarjetas, todas con icono SVG dibujado (trato parejo, ninguna queda sin arte): Diagnóstico electrónico · Caja CVT · Motor y distribución · Frenos y suspensión · Aire acondicionado · Mantenimiento por kilometraje.
5. **El momento interactivo: "¿Qué le suena a su Nissan?"** El visitante elige su síntoma con un clic, la página le revela qué suele ser y qué se revisa, y el botón de WhatsApp se arma solo con ese mensaje escrito. Es el gancho y la conversión en el mismo lugar.
6. **El equipo.** Fotos reales si llegan. Nombre, cargo y años trabajando Nissan.
7. **Cómo trabajamos, cuatro pasos.** La línea de diagnóstico se dibuja al hacer scroll y conecta los cuatro.
8. **Lo que dicen los clientes.** Solo reseñas reales. Si no llegan, la sección no se publica.
9. **Preguntas.** Las cinco objeciones de la investigación, respondidas directo.
10. **Cómo llegar.** Mapa de Google embebido, dirección, horarios, botón de indicaciones y botón de WhatsApp.
11. **Cierre.** Una acción y un formulario corto.
12. **Footer.** Datos, horarios, y la nota de imágenes si aplica.

**El formulario:** `mailto:` a `{{EMAIL}}`. Es un negocio real recibiendo
clientes reales, así que el mensaje tiene que llegar a alguien. Al visitante se
le dice en la misma pantalla que se abre su app de correo. WhatsApp queda como
el camino principal porque es el que la gente de verdad usa.

## 7. Textos verbatim de las secciones

**Franja de prueba**
- `{{ANIOS}} AÑOS` / Solo Nissan, desde el primer día
- `DIAGNÓSTICO` / Con el escáner de Nissan, no a oído
- `PRESUPUESTO` / Lo sabe antes de que toquemos el carro

**Por qué un taller solo de Nissan**
Título: **El taller de la esquina sabe de carros. Nosotros sabemos de su carro.**
Bajada: Un Nissan no se arregla igual que los demás. La caja CVT, la electrónica y los intervalos son suyos, y el que no los conoce empieza a cambiar piezas para ver si pega.

1. **Conocemos la caja CVT.** Dónde suena, por qué se calienta y qué se salva a tiempo.
2. **Leemos el carro, no lo adivinamos.** El escáner nos dice el código y nosotros le decimos qué significa.
3. **Le hablamos claro.** Qué tiene, qué es urgente y qué puede esperar al otro mes.

**Servicios** (título y una línea cada uno)
1. **Diagnóstico electrónico.** Conectamos el escáner, leemos los códigos y le explicamos qué encontró.
2. **Caja CVT.** Cambio de aceite en su kilometraje, revisión de temperatura y reparación cuando toca.
3. **Motor y distribución.** Sincronización, empaques, inyección y el ruido que lleva meses molestando.
4. **Frenos y suspensión.** Pastillas, discos, amortiguadores y la alineación que se siente al volante.
5. **Aire acondicionado.** Fugas, compresor y carga de gas, para que enfríe como el primer día.
6. **Mantenimiento por kilometraje.** Lo que su Nissan pide a los 10, 20, 40 y 100 mil, sin lo que no pide.

**El dato de la CVT (bloque propio, dentro de servicios)**
Título: **La mitad de las cajas CVT dañadas se podían salvar.**
Texto: La CVT pide cambio de aceite cada 40.000 a 50.000 kilómetros. Casi nadie lo hace, y a los 100.000 empieza el ruido y el recalentamiento. Si su Nissan ya pasó de ese kilometraje y nunca le hicieron ese servicio, esto es lo primero que hay que revisar.
Botón: Preguntar por la CVT

**Momento interactivo, "¿Qué le suena a su Nissan?"**
Instrucción: Elija lo que está sintiendo y le decimos qué revisamos primero.

| Síntoma (botón) | Respuesta que revela |
|---|---|
| La caja suena o se calienta | Suele ser la CVT pidiendo aceite, y a veces el enfriador tapado. Medimos temperatura, revisamos el estado del aceite y le decimos si se salva con servicio o si ya necesita reparación. |
| Tirones al acelerar | Puede ser la CVT, las bujías o el sensor de flujo de aire. El escáner lo separa en minutos, sin desarmar nada. |
| Se encendió un testigo | Leemos el código y le decimos qué significa antes de tocar una sola pieza. Muchas veces es un sensor de treinta mil pesos, no una reparación grande. |
| Está gastando más gasolina | Revisamos inyectores, bujías, filtro y sensor de oxígeno. Casi siempre es uno de esos cuatro. |
| El aire ya no enfría | Buscamos la fuga con equipo, medimos presiones y revisamos el compresor antes de cargar gas. |
| Toca el mantenimiento | Le decimos exactamente qué pide su Nissan en su kilometraje, y qué no pide todavía. |

Botón que aparece: **Escribir por WhatsApp con esto** (el mensaje se arma solo con el síntoma elegido).

**Cómo trabajamos, cuatro pasos**
1. **Usted escribe.** Cuenta qué siente el carro por WhatsApp. Le respondemos una persona, no un robot.
2. **Diagnosticamos.** Conectamos el escáner y revisamos. Le contamos qué encontramos.
3. **Autoriza usted.** Le damos el precio completo antes de empezar. Si dice que no, no se hace.
4. **Entregamos.** Con la fecha dicha desde el principio, y le explicamos qué le hicimos.

**Preguntas (las objeciones reales)**
- **¿Usan repuestos originales?** Sí, y cuando existe una alternativa buena y más económica se lo decimos, con el precio de las dos. La decisión es suya.
- **¿Pierdo la garantía de fábrica si no voy al concesionario?** No. La garantía se mantiene mientras los mantenimientos se hagan a tiempo y queden registrados, y nosotros le entregamos el soporte de cada uno.
- **¿Cuánto me va a costar?** El diagnóstico se cobra aparte y se lo decimos antes. La reparación se la presupuestamos completa y no empezamos hasta que usted diga que sí.
- **¿De verdad tienen el escáner de Nissan?** Sí. No trabajamos a oído. Leemos el módulo, le mostramos el código y le explicamos qué significa.
- **¿Cuánto se demoran?** Un mantenimiento sale el mismo día. Una reparación de caja o de motor lleva más, y le damos la fecha antes de recibirle el carro.
- **¿Atienden todos los Nissan?** Sí. March, Versa, Sentra, Tiida, Kicks, Qashqai, X-Trail y los demás, nuevos y de años atrás.

**Cómo llegar**
Título: **Venga al taller. Aquí estamos.**
Texto: `{{DIRECCION}}`, `{{CIUDAD}}`. Lunes a viernes `{{HORARIO_SEMANA}}`, sábados `{{HORARIO_SABADO}}`.
Botones: Abrir en Google Maps · Escribir por WhatsApp

**Cierre**
Título: **Cuéntenos qué le está pasando a su Nissan.**
Bajada: Le respondemos hoy y le decimos qué revisamos primero, sin compromiso.
Botón principal: Escribir por WhatsApp
Formulario: nombre, modelo y año, qué está sintiendo. Botón: Enviar por correo.
Nota bajo el botón: Se abre su aplicación de correo con el mensaje listo para enviar a Tecnissan.

---

## 8. Capa vectorial y movimiento

- **Línea de diagnóstico:** un `path` SVG de 1px en `--diagnos`, con
  `stroke-dasharray` animado por `IntersectionObserver`, que baja por la
  página y conecta las secciones 3, 4 y 7.
- **Rejilla de taller:** fondo fijo en gradiente radial más rejilla a 4%, una
  sola capa de ambiente detrás de toda la página.
- **Partículas:** polvo mínimo flotando en el hero, a nivel de susurro.
- **Entradas:** cada sección entra distinto (las cifras cuentan, las tarjetas
  suben desfasadas, la línea se dibuja, el mapa se revela). Nada aparece de golpe.
- **Resplandor:** solo en las cifras mono y en el título del bloque de CVT.
- `prefers-reduced-motion` apaga todo y deja el frame final como imagen fija.

## 9. Puertas

1. Frame inicial inspeccionado por mí antes de animar (logos colados, anatomía, composición).
2. Elección de modelo de video con precios reales antes de gastar créditos.
3. **Puerta del video:** el usuario lo ve en `review/` antes de construir nada alrededor.
4. Tomas de apoyo mostradas al usuario antes de usarlas.
5. Autotest completo antes de mostrar el sitio.
6. Verificación en vivo después de publicar.
