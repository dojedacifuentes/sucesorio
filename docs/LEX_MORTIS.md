# LEX MORTIS: diseño y continuidad

Rediseño de septiembre de 2026 (rama `eva-arcade/lex-mortis`), según el «Prompt maestro EVA Arcade · LEX MORTIS» del autor. Este documento resume las decisiones y deja lo necesario para seguir.

## 1. Identidad: juego propio dentro de EVA ARCADE

- El título es **LEX MORTIS**; la firma es **EVA ARCADE**. La portada muestra el logotipo oficial de EVA ARCADE en bucle (□X → ≡X → EVA → □X), la cabecera lleva el símbolo fijo y la pausa y la portada enlazan a la puerta del Arcade (`/links` de la landing de EVA).
- Todo sale del vídeo oficial del logotipo con `scripts/build-brand.mjs` (necesita un binario de ffmpeg, p. ej. el de `ffmpeg-static` en una carpeta temporal): bucle de 480 px en WebM (≈140 KB) y MP4 (≈290 KB) sin audio, recortado para dejar fuera la marca de agua de la esquina; póster, símbolo, favicon, icono de inicio y vista previa para redes (`public/og-image.jpg`).
- Paleta de la marca: fondo `#040710`, halo de azul eléctrico `#2A8CFF` a índigo `#5A60FF` y violeta `#A24DFF`, trazo casi blanco; el magenta `#EC70E2` es el acento propio de LEX MORTIS. Tokens en `src/styles/index.css`.
- Superficies opacas (sin paneles translúcidos) y texto con contraste AA como mínimo.
- Dos tipografías autoalojadas: Oxanium (títulos y etiquetas) e Inter (lectura).
- Retratos de EVA: `scripts/build-assets.mjs` recorta los PNG del autor (los originales no se versionan).

## 2. Contrato de pantalla

Nada obliga a desplazarse, ni la página ni un panel. El armazón (`App.jsx`, `ui/Screen.jsx`) ocupa el área visible real (`ui/useViewport.js`: barras del navegador, teclado virtual, áreas seguras) con tres filas: **cabecera · escenario · barra de acciones**. El contenido largo se pagina por oraciones con `ui/FitPager.jsx` (mide con el ancho real y repagina al cambiar tamaño o texto; nunca corta ni oculta). La consecuencia de una respuesta reemplaza a la pregunta en el mismo espacio (`ui/Verdict.jsx`), nunca aparece debajo.

EVA ocupa una franja fija en móvil vertical, una columna en escritorio y un botón en la cabecera cuando el alto no alcanza (su mensaje se lee entonces en su propia capa). En salas de juego, en celulares de altura media, pasa a la cabecera y reacciona dentro de la consecuencia.

`qa/fit.mjs` lo comprueba en 10 tamaños (320×568 a 1920×1080, con dos apaisados) recorriendo cada sala por sus estados (`qa/cases.mjs`): documento sin desplazamiento, ningún texto o control fuera de pantalla, recortado o tapado, sin desplazamiento interno ni página desbordada. Guarda capturas en `qa/out/` (no se sube).

## 3. Salas y dónde quedó cada contenido

| Sala | Escena | Contenido | Interacción |
|---|---|---|---|
| Expedientes | `scenes/detective` | `data/cases.js` + `advancedDetectiveCases` (30) | Pruebas que se examinan, cronología que se ordena, árbol por generaciones, decisión con solución **y** fundamento, consecuencia en el árbol. Guiones con hechos del propio caso en `data/caseScripts.js` (6 casos). |
| Neón de artículos / Partida rápida | `scenes/arcade` | `arcadeQuestions` + avanzadas (126) | 3 oleadas × 5 (rápida: 8), vidas, combo, reloj que se pausa, dificultad que sube o baja con la precisión. |
| Duelos | `scenes/boss` | `data/bosses.js` + avanzados (8 × 5) | El rival grita una confusión (una alternativa equivocada); acertar le quita resistencia, fallar cuesta una vida; lo fallado vuelve una vez. |
| Cementerio de conceptos | `scenes/memory` | `flashcards` + avanzadas (112) | Recordar → voltear (definición, ejemplo, error frecuente) → autoevaluación. Mazo fijo al empezar. |
| Máquina de siglas | `scenes/mnemonics` | `mnemonicChallenges` + avanzadas (25) | Fichas de letras (toque o teclado), pista con ayuda anotada. |
| Laboratorio de acervos | `scenes/acervos` | `calculationScenarios` (12) | Un paso por pantalla con teclado numérico propio; vacío ≠ cero; coma o punto; tolerancia 0,01. |
| Sala oral | `scenes/oral` | `oralQuestions` + avanzadas (30) | Asignar cada frase a su papel (concepto, norma, doctrina, caso), síntesis y repregunta de la comisión. |
| Codex | `scenes/codex` | `data/legal/corpus.js` (490 arts. del Libro III + Ley 20.830) | Búsqueda, filtros, artículos y módulos paginados; se abre sobre cualquier escena sin desmontarla. |
| Progreso / Resultados | `scenes/progress`, `scenes/results` | guardado | Rango, dominio autónomo por módulo, bitácora de EVA, errores, historial; precisión sobre lo respondido. |

Ningún banco perdió ítems (`npm run check:content` compara con `scripts/content-baseline.json`). Los 24 módulos siguen en el Codex.

## 4. EVA

- Líneas por evento en `eva/lines.js` (primera visita, prueba descubierta, pistas en tres niveles, error, error repetido, acierto, jefe, cierre…); `eva/director.js` elige sin repetir las recientes y limita los comentarios de ambiente; las funcionales nunca se silencian. Ajuste «Solo lo útil».
- Pistas graduadas por expediente: pregunta orientadora → relación relevante → explicación (el caso cuenta como resuelto con ayuda).
- Arco breve: la bitácora (`EVA_LOG`) se desbloquea al cerrar 1, 3, 6, 10, 15, 20, 25 y 30 expedientes.

## 5. Guardado

- Clave `lex-mortis-save-v2`, esquema en `game/persistence.js` (versión explícita). La v1 (`lex-mortis-progress-v1`) se migra al cargar y **queda intacta** como respaldo; su «dominio» mezclado se conserva como referencia (`legacyScore`) sin contarlo como dominio autónomo.
- JSON dañado → se aparta a una clave de cuarentena y se avisa; sin almacenamiento o sin cuota → el juego sigue en memoria y lo dice. El reinicio de Ajustes explica qué borra, pide confirmación y deja una copia.
- Toda recompensa pasa por una clave idempotente (`game/progress.js`): doble clic, tecla repetida o reanudación no duplican nada. Respuestas autónomas, asistidas, errores y autoevaluaciones se registran por separado.
- Partida en curso en `save.run` (sala, parámetro y estado) para «Continuar» desde la portada o el archivo.

## 6. Contenido jurídico

Ver `docs/VALIDACION_JURIDICA.md`: 88 correcciones confirmadas contra el texto oficial, 7 puntos inciertos aclarados sin tomar partido, ortografía completa. Las fechas narrativas (2088…) son ficción.

## 7. Pruebas realizadas

- `npm test`: 21 pruebas de lógica (migración, cuarentena, idempotencia, ayuda ≠ dominio, autoevaluación aparte, precisión, cantidades con vacío/cero/decimales/tolerancia, orden estable del mazo, EVA sin repeticiones, integridad del banco).
- `npm run check:content` y `npm run build`.
- `qa/fit.mjs` en Chrome (Chromium) sin interfaz, emulando los 10 tamaños. **No se probó** en WebKit/Safari ni en teléfonos físicos, ni con el teclado virtual real (el teclado numérico propio del laboratorio evita depender de él).

## 8. Pendientes posibles

- Guiones de investigación (cronología, rama) para más expedientes, siempre con hechos del propio caso.
- Soporte de mando (Gamepad API): no implementado.
- Voz: no hay; EVA funciona con texto.
