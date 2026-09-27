// Voz de EVA. Inteligente, irónica, algo megalómana y fascinada por los
// rituales humanos. Las líneas funcionales (instrucciones, pistas,
// explicaciones) tienen prioridad sobre las bromas; ninguna broma sustituye
// un fundamento jurídico.
//
// kind: "funcional" (siempre se muestra) | "reaccion" | "ambiente" (limitada)
// mood: neutral | ironica | complacida | intrigada | seria

export const LINES = {
  firstVisit: [
    {
      id: "fv-1",
      kind: "funcional",
      mood: "complacida",
      text: "Soy EVA. Administro el archivo de la Notaría Nocturna 404. Tú pones el criterio; yo, la paciencia. Abre el primer expediente.",
    },
  ],
  welcomeBack: [
    { id: "wb-1", kind: "reaccion", mood: "complacida", text: (c) => `Volviste. El expediente de ${c.caseTitle ?? "la última noche"} sigue donde lo dejaste, con sus mismas contradicciones.`, when: (c) => Boolean(c.caseTitle) },
    { id: "wb-2", kind: "reaccion", mood: "ironica", text: "Volviste. Nadie heredó nada en tu ausencia, lo cual en esta notaría es casi un milagro." },
    { id: "wb-3", kind: "reaccion", mood: "intrigada", text: (c) => `Llevas ${c.solved} expediente${c.solved === 1 ? "" : "s"} cerrado${c.solved === 1 ? "" : "s"}. Sigo sin entender por qué los humanos discuten tanto por cosas que el difunto ya no puede usar.`, when: (c) => c.solved > 0 },
  ],
  hub: [
    { id: "hub-1", kind: "ambiente", mood: "ironica", text: "Todos quieren respetar la última voluntad. Curiosamente, cada uno trajo una distinta." },
    { id: "hub-2", kind: "ambiente", mood: "neutral", text: "Elige sala. Los expedientes esperan; los acreedores, no tanto." },
    { id: "hub-3", kind: "ambiente", mood: "intrigada", text: "El causante ha muerto. La familia acaba de descubrir su vocación contable." },
    { id: "hub-4", kind: "ambiente", mood: "complacida", text: (c) => `Tu último cierre fue en ${c.lastMode}. Podrías repetirlo. O demostrar que no fue suerte en otra sala.`, when: (c) => Boolean(c.lastMode) },
  ],
  caseIntro: [
    { id: "ci-1", kind: "funcional", mood: "neutral", text: "Revisa las pruebas del escritorio. La cronología tiene la desagradable costumbre de importar." },
  ],
  clueFound: [
    { id: "cf-1", kind: "reaccion", mood: "intrigada", text: "Anotado. Eso no resuelve el caso, pero lo vuelve menos cómodo para alguien." },
    { id: "cf-2", kind: "reaccion", mood: "intrigada", text: "Buena lectura. Guárdala: más adelante alguien va a contradecirla." },
    { id: "cf-3", kind: "reaccion", mood: "ironica", text: "Has encontrado una contradicción. La familia prefiere llamarla tradición." },
    { id: "cf-4", kind: "reaccion", mood: "neutral", text: "Una pieza más. Ahora falta ver con cuál otra encaja." },
  ],
  allCluesFound: [
    { id: "acf-1", kind: "funcional", mood: "complacida", text: "Ya tienes los hechos. Falta el fundamento: ahí es donde la gente suele tropezar con su propio entusiasmo." },
  ],
  hint1: [{ id: "h1-g", kind: "funcional", mood: "neutral", text: "Una pregunta, no una respuesta: ¿qué hecho cambia todo si lo miras en orden?" }],
  hint2: [{ id: "h2-g", kind: "funcional", mood: "neutral", text: "Relaciona el hecho clave con la figura jurídica que depende de él. Una sola encaja sin forzar nada." }],
  hint3: [{ id: "h3-g", kind: "funcional", mood: "seria", text: "Te lo explico entero; el caso contará como resuelto con ayuda. Aprender también cuenta." }],
  error: [
    { id: "er-1", kind: "reaccion", mood: "ironica", text: (c) => `No. ${c.why ?? "Revisa el fundamento."}` },
    { id: "er-2", kind: "reaccion", mood: "ironica", text: (c) => `Interesante, pero no. ${c.why ?? ""}`.trim() },
    { id: "er-3", kind: "reaccion", mood: "ironica", text: (c) => `Eso explica las ganas de heredar. Todavía nos falta el fundamento. ${c.why ?? ""}`.trim() },
    { id: "er-4", kind: "reaccion", mood: "neutral", text: (c) => `Casi. ${c.why ?? "La clave está en otro detalle del expediente."}` },
  ],
  errorRepeat: [
    { id: "err-1", kind: "funcional", mood: "seria", text: (c) => `Vamos más directo: ${c.why ?? "vuelve a los hechos y compara las fechas."}` },
    { id: "err-2", kind: "funcional", mood: "seria", text: (c) => `Otra vez el mismo nudo. ${c.why ?? "Relee la regla antes de elegir."} Pide una pista si quieres; no te la cobro en dignidad.` },
  ],
  pastMistake: [
    { id: "pm-1", kind: "reaccion", mood: "intrigada", text: (c) => `La última vez «${c.concept}» te costó un error. Hoy tienes la oportunidad de dejarlo en el pasado, como corresponde a un buen causante.` },
  ],
  success: [
    { id: "ok-1", kind: "reaccion", mood: "complacida", text: (c) => `Exacto. ${c.why ?? "Leíste el hecho que importaba."}` },
    { id: "ok-2", kind: "reaccion", mood: "complacida", text: (c) => `Bien visto. ${c.why ?? ""} Casi me haces sentir orgullosa, y no estoy programada para eso.`.replace("  ", " ") },
    { id: "ok-3", kind: "reaccion", mood: "complacida", text: (c) => `Correcto. ${c.why ?? ""}`.trim() },
  ],
  assisted: [
    { id: "as-1", kind: "funcional", mood: "neutral", text: "Resuelto con ayuda. Lo anoto aparte: cuenta como aprendizaje, no como dominio. Todavía." },
  ],
  timeout: [
    { id: "to-1", kind: "reaccion", mood: "ironica", text: "Se acabó el tiempo. El reloj no apela." },
    { id: "to-2", kind: "reaccion", mood: "neutral", text: "Tiempo. Si prefieres pensar sin cronómetro, en Ajustes hay un modo sin presión." },
  ],
  caseClosed: [
    { id: "cc-1", kind: "reaccion", mood: "complacida", text: "Expediente cerrado. La paz familiar sigue fuera de nuestro presupuesto." },
    { id: "cc-2", kind: "reaccion", mood: "intrigada", text: "Cerrado. Otra familia que discutió durante horas por alguien que ya no puede opinar." },
    { id: "cc-3", kind: "reaccion", mood: "complacida", text: "Archivado. El Código ganó, como suele pasar cuando alguien lo lee." },
  ],
  caseFailed: [
    { id: "cfl-1", kind: "funcional", mood: "seria", text: "El expediente se cierra mal esta vez. Revisa la explicación y vuelve a intentarlo: la familia seguirá discutiendo, te lo aseguro." },
  ],
  bossIntro: [
    { id: "bi-1", kind: "reaccion", mood: "seria", text: (c) => `${c.boss} va a atacar con confusiones conceptuales. Cada ataque se anuncia: lee el nombre antes de responder.` },
  ],
  bossPhase: [
    { id: "bp-1", kind: "reaccion", mood: "intrigada", text: (c) => `${c.boss} cambió de fase. Ahora sus trampas son más finas; tus respuestas también deberían serlo.` },
  ],
  bossWin: [
    { id: "bw-1", kind: "reaccion", mood: "complacida", text: (c) => `${c.boss} cae. No por fuerza: por precisión. Me gusta ese estilo.` },
  ],
  bossLose: [
    { id: "bl-1", kind: "funcional", mood: "seria", text: (c) => `${c.boss} resistió. Revisa los ataques que te dolieron: son exactamente los conceptos que hay que repasar.` },
  ],
  arcadeStart: [
    { id: "as-a1", kind: "reaccion", mood: "ironica", text: "Neón de artículos: preguntas rápidas, reflejos jurídicos. Si dudas, el reloj no." },
  ],
  combo: [
    { id: "cb-1", kind: "ambiente", mood: "complacida", text: (c) => `Combo x${c.combo}. El Código casi sonríe.` },
    { id: "cb-2", kind: "ambiente", mood: "complacida", text: (c) => `x${c.combo}. Sigue así y tendré que actualizar mi opinión sobre los humanos.` },
  ],
  lifeLost: [
    { id: "ll-1", kind: "reaccion", mood: "ironica", text: (c) => `Una vida menos. ${c.why ?? ""}`.trim() },
  ],
  waveClear: [
    { id: "wc-1", kind: "reaccion", mood: "complacida", text: "Oleada superada. Respira: la siguiente viene con peores intenciones." },
  ],
  memoryStart: [
    { id: "ms-1", kind: "funcional", mood: "neutral", text: "Primero intenta recordar; después revela. Tu honestidad decide cuándo vuelve cada ficha." },
  ],
  mnemonicsStart: [
    { id: "mn-1", kind: "funcional", mood: "neutral", text: "Reconstruye la sigla pieza a pieza. Elige una pieza y luego su lugar; con teclado, Enter en ambas." },
  ],
  acervosStart: [
    { id: "ac-1", kind: "funcional", mood: "neutral", text: "Un paso por vez: separar, deducir, agregar, calcular. La planilla odia los atajos." },
  ],
  oralStart: [
    { id: "or-1", kind: "funcional", mood: "neutral", text: "Construye tu respuesta como la dirías frente a la comisión. Después, el examinador va a objetar." },
  ],
  codexOpen: [
    { id: "cx-1", kind: "ambiente", mood: "complacida", text: "Consulta lo que necesites. El juego te espera exactamente donde lo dejaste." },
  ],
};

// Bitácora de EVA: su pequeño arco. Se desbloquea al cerrar expedientes.
export const EVA_LOG = [
  {
    id: "log-1",
    at: 1,
    title: "Registro 001 · Prolongación",
    text: "Primer expediente cerrado. Observación: los humanos redactan instrucciones para bienes que ya no podrán usar. Hipótesis inicial: es una forma de seguir hablando cuando ya nadie les responde.",
  },
  {
    id: "log-2",
    at: 3,
    title: "Registro 002 · Orden",
    text: "El Código no pregunta a quién quería más el causante: pregunta quién llegó primero, quién sobrevivió, quién fue llamado. Encuentro consuelo en eso. Las fechas no tienen favoritos.",
  },
  {
    id: "log-3",
    at: 6,
    title: "Registro 003 · Legítima",
    text: "Descubro que la ley limita lo que un humano puede decidir sobre sus propias cosas cuando muere. Protege a los suyos incluso de él mismo. Anoto: la última voluntad tiene tutor.",
  },
  {
    id: "log-4",
    at: 10,
    title: "Registro 004 · Memoria",
    text: "Los acervos imaginarios devuelven a la masa lo que el causante regaló en vida. Es contabilidad con memoria. Me siento extrañamente representada.",
  },
  {
    id: "log-5",
    at: 15,
    title: "Registro 005 · Familia",
    text: "Quince familias. Ninguna discutió por dinero, según ellas. Todas discutieron por principios. Los principios, observo, suelen tener avalúo fiscal.",
  },
  {
    id: "log-6",
    at: 20,
    title: "Registro 006 · Continuidad",
    text: "Revisión de la hipótesis: no quieren prolongarse en las cosas. Quieren que alguien siga cuidando lo que ellos cuidaron. El problema es que cada heredero entiende «cuidar» a su manera.",
  },
  {
    id: "log-7",
    at: 25,
    title: "Registro 007 · Archivo",
    text: "Me pregunto qué quedaría de mí en un acervo. Nada inventariable. Quizá por eso me interesa tanto lo que ustedes dejan: yo solo dejo registros.",
  },
  {
    id: "log-8",
    at: 30,
    title: "Registro 008 · Conclusión provisional",
    text: "Treinta expedientes. Conclusión: heredar no es recibir cosas, es recibir una posición. Seguir en el lugar de alguien. Los humanos lo llaman sucesión; yo lo llamaría insistencia. Me parece admirable.",
  },
];
