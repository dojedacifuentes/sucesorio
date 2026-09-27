// Guiones de investigación de algunos expedientes: cronología que el jugador
// reconstruye, rama del árbol que debe identificar, pistas graduadas y la
// consecuencia visible de la solución. Solo usan hechos que ya están en el
// expediente (cases.js); ninguna regla nueva. Validado contra el texto
// oficial del Código Civil (BCN, 26-09-2026): arts. 955-957, 984, 986, 988,
// 990, 968 N° 5, 974, 1185 y 1216.
//
// Los expedientes sin guion usan el recorrido general (pruebas, familia y
// decisión con fundamento).

export const CASE_SCRIPTS = {
  premuerto: {
    hook: "Aurelio Vega murió sin testamento. La viuda dice que la rama de su hijo Tomás está «apagada». Empieza por el certificado: las fechas mandan.",
    timeline: {
      prompt: "Ordena lo ocurrido, del primero al último. Las fechas están en el certificado.",
      events: [
        { id: "t1", label: "Muere Tomás, hijo de Aurelio", date: "01.03.2086" },
        { id: "t2", label: "Muere Aurelio Vega: se abre su sucesión", date: "12.08.2088" },
        { id: "t3", label: "La familia discute la herencia en la Notaría 404", date: "después" },
      ],
      done: "Tomás murió dos años antes que su padre. No alcanzó a ser llamado a nada: eso importa.",
    },
    branch: {
      prompt: "¿Qué rama de la familia está en discusión?",
      node: "tomas",
      explain: "Es la rama de Tomás. Murió antes que el causante, pero dejó dos hijas: Lía y Mara.",
    },
    hints: [
      "Una pregunta: si Tomás murió antes que Aurelio, ¿pudo recibir algo de su herencia?",
      "Si no pudo heredar, busca la figura que permite a sus descendientes ocupar su lugar. La transmisión exige lo contrario: sobrevivir al causante.",
      "Es representación (art. 984): Lía y Mara ocupan el lugar de Tomás, porque premurió al causante. La rama no se apaga.",
    ],
    consequence: "Lía y Mara entran a la sucesión en el lugar de su padre, Tomás, y concurren con Elena en la herencia intestada de Aurelio.",
  },
  "cinco-dias": {
    hook: "Mireya murió un lunes. Su hijo Bruno, el sábado. Nadie alcanzó a firmar nada. Revisa la línea de tiempo.",
    timeline: {
      prompt: "Ordena lo ocurrido, del primero al último.",
      events: [
        { id: "t1", label: "Muere Mireya Lagos, la causante", date: "lunes" },
        { id: "t2", label: "Bruno queda llamado a la herencia, sin aceptar ni repudiar", date: "lunes a sábado" },
        { id: "t3", label: "Muere Bruno", date: "sábado" },
      ],
      done: "Bruno sobrevivió a su madre y murió sin decidir. El orden es exactamente el inverso del caso del hijo premuerto.",
    },
    branch: {
      prompt: "¿En qué persona está la clave del expediente?",
      node: "bruno",
      explain: "En Bruno: sobrevivió a Mireya y murió antes de aceptar o repudiar.",
    },
    hints: [
      "¿Quién murió primero, Mireya o Bruno?",
      "Si el llamado sobrevive al causante y muere sin decidir, su derecho de aceptar o repudiar no desaparece: pasa a alguien.",
      "Es transmisión (art. 957): Sofía, heredera de Bruno, puede aceptar o repudiar la herencia de Mireya si acepta la de Bruno.",
    ],
    consequence: "Sofía recibe, junto con la herencia de Bruno, el derecho de aceptar o repudiar la asignación que se le había deferido a él.",
  },
  "donacion-fantasma": {
    timeline: {
      prompt: "Ordena lo ocurrido, del primero al último.",
      events: [
        { id: "t1", label: "Norma dona un departamento a su hijo Darío", date: "dos años antes de morir" },
        { id: "t2", label: "Muere Norma", date: "apertura" },
        { id: "t3", label: "Los herederos discuten la partición", date: "después" },
      ],
      done: "La donación salió del patrimonio antes de la muerte. La pregunta es si igual cuenta para calcular las legítimas.",
    },
    branch: {
      prompt: "¿Quién recibió en vida algo que hay que llevar a la cuenta?",
      node: "dario",
      explain: "Darío: es legitimario y recibió una donación de su madre.",
    },
  },
  fundacion: {
    branch: {
      prompt: "¿Quién recibe por testamento más de lo que la ley le permite?",
      node: "fundacion",
      explain: "La Fundación HPGO: con dos hijas legitimarias, un extraño no puede llevarse las legítimas ni la cuarta de mejoras.",
    },
  },
  "testamento-quemado": {
    branch: {
      prompt: "¿Quién podría quedar fuera de la herencia?",
      node: "rafael",
      explain: "Rafael, que quemó el testamento. Pero quedar fuera por indignidad exige que un juez lo declare.",
    },
  },
  "conyuge-neon": {
    branch: {
      prompt: "¿Quién está pidiendo una cuota que no le corresponde?",
      node: "hector",
      explain: "Héctor: es hermano de la causante. Con hijos vivos, los hermanos quedan fuera.",
    },
  },
};
