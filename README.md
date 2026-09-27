# LEX MORTIS · un juego de EVA ARCADE

Investiga expedientes en la **Notaría Nocturna 404**, decide quién hereda y aprende Derecho Sucesorio chileno jugando. Juego web independiente que forma parte de **EVA ARCADE**, la colección de juegos de EVA ([más juegos](https://evaproyecto01.vercel.app/links)).

Publicado en https://sucesorio.vercel.app/

## Ejecutar

```bash
npm install
npm run dev            # http://127.0.0.1:5173
npm run build          # compilación de producción (la que usa Vercel)
npm test               # pruebas de lógica (vitest)
npm run check:content  # integridad del banco: ids, respuestas, módulos
npm run qa:fit         # «todo cabe en pantalla» en 10 tamaños (Chrome sin interfaz; con el servidor en marcha, ver qa/fit.mjs)
```

Stack: React 18, Vite 6, Tailwind CSS 3, Framer Motion 11. Sin backend: el progreso se guarda en el navegador.

## Qué hay

- **Expedientes** (30): pruebas que se examinan, cronologías que se ordenan, árbol familiar, decisión con fundamento y consecuencia visible.
- **Neón de artículos** (126 preguntas) y **Partida rápida**: oleadas con vidas, combos y dificultad que se ajusta.
- **Duelos** (8 rivales, 40 ataques), **Cementerio de conceptos** (112 fichas), **Máquina de siglas** (25), **Laboratorio de acervos** (12 cálculos), **Sala oral** (30).
- **Codex** con el texto oficial del Código Civil, Libro III, y la Ley 20.830 (BCN, 26-09-2026).
- **EVA**, que comenta según lo que haces, da pistas graduadas y lleva una bitácora que se desbloquea al cerrar expedientes.

## Documentación

- `docs/LEX_MORTIS.md`: diseño, dónde quedó cada contenido, guardado, marca, pruebas y cómo seguir.
- `docs/VALIDACION_JURIDICA.md`: auditoría del contenido contra el texto oficial (y `docs/auditoria-juridica.json`).
