export const additionalModules = [
  {
    id: "derecho-real-herencia",
    title: "Derecho real de herencia",
    theme: "Una universalidad juridica con vida breve y caracter intenso.",
    articles: ["577", "951", "684", "1264"],
    concepts: ["derecho real", "universalidad juridica", "dominio", "peticion de herencia", "vida efimera"],
    summary:
      "El derecho real de herencia recae sobre la universalidad del patrimonio transmisible o una cuota de el; es distinto del dominio y se protege especialmente por la peticion de herencia.",
    mnemonic: "RUDPE: Real, Universal, Distinto del dominio, Protegido por peticion, Efimero.",
    commonError: "Hablar de dominio sobre bienes singulares antes de particion, como si la comunidad hereditaria pidiera permiso.",
  },
  {
    id: "clases-sucesion",
    title: "Clases de sucesion",
    theme: "Testamento, ley o mezcla: tres rutas hacia la misma pelea familiar.",
    articles: ["952", "996"],
    concepts: ["testamentaria", "intestada", "mixta", "remanente"],
    summary:
      "La sucesion puede ser testamentaria, intestada o mixta. En la mixta se cumplen primero disposiciones testamentarias y el remanente se adjudica abintestato, respetando legitimas y mejoras.",
    mnemonic: "TIM: Testamentaria, Intestada, Mixta.",
    commonError: "Creer que si hay testamento desaparecen siempre las reglas intestadas.",
  },
  {
    id: "herederos-legatarios",
    title: "Herederos y legatarios",
    theme: "Universalidad o cosa singular: la etiqueta del testador no manda.",
    articles: ["951", "953", "954", "1097", "1104", "1362", "1363"],
    concepts: ["heredero universal", "heredero de cuota", "remanente", "legatario de especie", "legatario de genero", "responsabilidad"],
    summary:
      "El objeto de la asignacion determina si hay heredero o legatario. El heredero representa al causante; el legatario no, y su responsabilidad es excepcional.",
    mnemonic: "UCR-EG: Universal, Cuota, Remanente; Especie, Genero.",
    commonError: "Llamar heredero al legatario porque el testamento lo dijo con mucha seguridad.",
  },
  {
    id: "posesion-herencia",
    title: "Posesion legal, efectiva y yacente",
    theme: "La herencia necesita cara visible antes de que los acreedores aprendan a gritar.",
    articles: ["722", "955", "1233", "1240"],
    concepts: ["posesion legal", "posesion efectiva", "herencia yacente", "curador", "15 dias"],
    summary:
      "El heredero adquiere posesion legal al deferirse la herencia, aun si lo ignora. La herencia yacente puede declararse si pasan 15 dias sin aceptacion ni albacea con tenencia de bienes.",
    mnemonic: "LEY: Legal, Efectiva, Yacente.",
    commonError: "Confundir posesion legal con decreto de posesion efectiva.",
  },
  {
    id: "derechos-concurrentes",
    title: "Derechos que concurren",
    theme: "Representacion, transmision, acrecimiento y sustitucion: cuatro trampas con nombres solemnes.",
    articles: ["957", "984", "985", "986", "1147", "1183"],
    concepts: ["representacion", "transmision", "acrecimiento", "sustitucion", "por cabeza", "por estirpe"],
    summary:
      "La representacion opera como ficcion legal en linea descendente; el representante sucede directamente al causante, por estirpe, no a traves del representado.",
    mnemonic: "RTAS: Representacion, Transmision, Acrecimiento, Sustitucion.",
    commonError: "Usar representacion como sinonimo de transmision o creer que el nieto hereda a traves del padre.",
  },
  {
    id: "ordenes-completos",
    title: "Ordenes sucesorios completos",
    theme: "La fila hereditaria: si aparece el primero, el de atras mira desde la lluvia.",
    articles: ["988", "989", "990", "992", "994", "995"],
    concepts: ["descendientes", "conyuge", "ascendientes", "hermanos", "colaterales", "Fisco"],
    summary:
      "Los ordenes se excluyen entre si: descendientes; ascendientes y conyuge; hermanos; colaterales; Fisco. El heredero determinante activa el orden.",
    mnemonic: "DACHF: Descendientes, Ascendientes-conyuge, Hermanos, Colaterales, Fisco.",
    commonError: "Meter al hermano dentro del primer orden porque llevo cafe a la notaria.",
  },
  {
    id: "calculo-conyuge",
    title: "Calculo del conyuge sobreviviente",
    theme: "El conyuge no es extra: es una variable con minimo legal.",
    articles: ["988", "989", "996"],
    concepts: ["un hijo", "varios hijos", "cuarta minima", "segundo orden", "imputacion mixta"],
    summary:
      "Con un hijo, el conyuge lleva lo mismo que el hijo. Con varios, lleva el doble que cada hijo, pero nunca menos de una cuarta parte. En segundo orden lleva dos tercios con ascendientes.",
    mnemonic: "1=igual, 2+=doble, 7+=cuarta minima, 2do=2/3.",
    commonError: "Dividir siempre en partes iguales aunque el art. 988 este gritando desde el monitor.",
  },
  {
    id: "mejoras-pactos",
    title: "Cuarta de mejoras y pacto de no mejorar",
    theme: "La unica sucesion futura que el Codigo deja entrar por la puerta lateral.",
    articles: ["1167", "1195", "1198", "1203", "1204", "1463"],
    concepts: ["mejoreros", "mejora expresa", "mejora tacita", "pacto de no mejorar", "modalidades"],
    summary:
      "La cuarta de mejoras favorece a descendientes, ascendientes y conyuge. Las mejoras no se presumen, salvo supuestos legales, y el pacto de no mejorar es excepcional y solemne.",
    mnemonic: "MAPE: Mejoreros, Acto expreso, Pacto, Excepcion.",
    commonError: "Asignar mejoras a terceros como si la cuarta fuera libre disposicion con maquillaje.",
  },
  {
    id: "imputaciones",
    title: "Imputaciones a legitimas y mejoras",
    theme: "Donaciones, legados y desembolsos: el pasado patrimonial siempre vuelve.",
    articles: ["1189", "1193", "1194", "1196", "1198", "1202", "1203", "1205", "1206"],
    concepts: ["imputacion", "legados", "donaciones", "deudas del legitimario", "gastos de educacion", "restitucion", "prorrata"],
    summary:
      "Donaciones y legados al legitimario se imputan a su legitima salvo expresion de mejora. Gastos de educacion y regalos de costumbre no se imputan. Excesos se cargan a mejora, libre disposicion o restitucion.",
    mnemonic: "IDEL: Imputar Donaciones, Exceptuar Educacion, luego Libre/restaurar.",
    commonError: "Creer que toda transferencia en vida fue regalo invisible para el calculo.",
  },
  {
    id: "acervos-calculo",
    title: "Calculo de acervos",
    theme: "La masa hereditaria entra bruta y sale juridicamente maquillada.",
    articles: ["959", "1185", "1186", "1187", "1188"],
    concepts: ["acervo bruto", "iliquido", "liquido", "colacion al valor", "exceso", "inoficiosa donacion"],
    summary:
      "El acervo bruto separa bienes ajenos; el iliquido descuenta bajas generales; el liquido sirve de base salvo agregaciones imaginarias. El primer acervo agrega donaciones a legitimarios; el segundo controla excesos a terceros.",
    mnemonic: "SBDAE: Separar, Bajar, Donar, Agregar, Exceso.",
    commonError: "Calcular la cuarta de libre disposicion sobre una masa que todavia trae bienes ajenos pegados.",
  },
  {
    id: "acciones-protectoras",
    title: "Acciones protectoras de la herencia",
    theme: "Cuando la familia falla, el Codigo abre arsenal.",
    articles: ["1187", "1216", "1264", "1269", "1317", "1344"],
    concepts: ["peticion de herencia", "reforma de testamento", "inoficiosa donacion", "particion", "reivindicatoria"],
    summary:
      "La accion correcta depende del dano: calidad hereditaria, legitimas vulneradas, donaciones excesivas, indivision o dominio singular.",
    mnemonic: "PRIP: Peticion, Reforma, Inoficiosa, Particion.",
    commonError: "Demandar reforma cuando el problema es que un heredero aparente ocupa toda la herencia.",
  },
  {
    id: "estructura-examen",
    title: "Estructuras de examen oral",
    theme: "Hablar civilmente antes de que el panico tome posesion efectiva.",
    articles: ["588", "951", "955", "956", "957", "984", "988", "1184"],
    concepts: ["concepto", "norma", "clasificacion", "requisitos", "efectos", "caso"],
    summary:
      "Las respuestas de grado se memorizan por estructura: concepto, norma, naturaleza, requisitos, efectos, distinciones y aplicacion al caso.",
    mnemonic: "CNNREC: Concepto, Norma, Naturaleza, Requisitos, Efectos, Caso.",
    commonError: "Recitar articulos sin ordenar la respuesta. Eso es lluvia juridica, no argumento.",
  },
];

const frames = [
  f("drh-1", "derecho-real-herencia", "Derecho real de herencia", "577/951", "Derecho real que recae sobre la universalidad juridica del patrimonio transmisible o una cuota.", "El heredero de 1/3 no tiene dominio singular sobre la casa antes de particion.", "Confundir herencia con dominio sobre cada bien."),
  f("drh-2", "derecho-real-herencia", "Universalidad juridica", "951", "Continente patrimonial distinto de las cosas singulares que lo integran.", "La herencia contiene activo y pasivo transmisible.", "Mirar solo el activo y olvidar deudas."),
  f("drh-3", "derecho-real-herencia", "Proteccion del derecho real de herencia", "1264", "Se protege especialmente por la accion de peticion de herencia.", "Heredero verdadero reclama contra heredero aparente.", "Usar siempre reivindicatoria aunque se discuta calidad hereditaria."),
  f("drh-4", "derecho-real-herencia", "Vida efimera de la herencia", "1317/1344", "El derecho real de herencia vive mientras hay comunidad hereditaria; la particion lo proyecta a dominio singular.", "Tras adjudicacion, art. 1344 declara adquisicion directa desde el causante.", "Decir que la particion vende bienes entre comuneros."),
  f("cs-1", "clases-sucesion", "Sucesion testamentaria", "952", "Se sucede en virtud de testamento.", "El causante designa asignatarios, respetando asignaciones forzosas.", "Pensar que testamento permite borrar legitimas."),
  f("cs-2", "clases-sucesion", "Sucesion intestada", "952", "Se sucede en virtud de la ley por falta o insuficiencia de testamento.", "La ley llama por ordenes sucesorios.", "Creer que intestada significa sin reglas."),
  f("cs-3", "clases-sucesion", "Sucesion mixta", "952/996", "Una parte se rige por testamento y otra por ley.", "El testamento solo dispone de algunos bienes y el remanente va abintestato.", "Cumplir el testamento antes de enterar legitimas y mejoras."),
  f("hl-1", "herederos-legatarios", "Asignacion por causa de muerte", "953", "Señalamiento legal o testamentario de lo que corresponde en la sucesion.", "La ley asigna a hijos; el testamento asigna legado a un tercero.", "Confundir asignacion con adjudicacion particional."),
  f("hl-2", "herederos-legatarios", "Asignatario", "953", "Persona a quien se hace una asignacion.", "Heredero y legatario son especies de asignatario.", "Usar asignatario como sinonimo solo de heredero."),
  f("hl-3", "herederos-legatarios", "Heredero universal", "951/1097", "Heredero llamado sin designacion de cuota.", "Dejo mis bienes a Ana y Bruno: ambos son universales.", "Creer que universal significa necesariamente unico."),
  f("hl-4", "herederos-legatarios", "Heredero de cuota", "951/1097", "Heredero llamado con cuota determinada.", "Dejo 1/3 a Ana y 2/3 a Bruno.", "Aplicarle acrecimiento como si no hubiera cuota fijada."),
  f("hl-5", "herederos-legatarios", "Heredero de remanente", "1097", "Llamado a lo que queda despues de cubrir disposiciones.", "Lego el auto a C y dejo el resto a D.", "Olvidar que puede ser testamentario o abintestato."),
  f("hl-6", "herederos-legatarios", "Representacion del causante por herederos", "1097", "El heredero representa al causante y sucede en derechos y obligaciones transmisibles.", "Soporta deudas hereditarias segun cuota, salvo beneficio.", "Atribuir esta representacion al legatario."),
  f("hl-7", "herederos-legatarios", "Legatario de especie", "951/954", "Sucede en especie o cuerpo cierto y adquiere dominio desde la muerte.", "Lego tal reloj o tal inmueble.", "Exigir tradicion como si fuera legado de genero."),
  f("hl-8", "herederos-legatarios", "Legatario de genero", "951/954", "Tiene derecho personal para exigir entrega de bienes de genero.", "Lego 100 acciones de una serie determinada.", "Darle frutos desde la muerte sin entrega ni mora."),
  f("hl-9", "herederos-legatarios", "Legatario no representa al causante", "1104", "No tiene mas derechos o cargas que las expresamente conferidas o impuestas.", "No responde como heredero universal.", "Tratarlo como continuador patrimonial pleno."),
  f("hl-10", "herederos-legatarios", "Responsabilidad subsidiaria del legatario", "1362/1363", "Puede contribuir a deudas hereditarias si no hay bienes suficientes y fue pagado su legado.", "Acreedor va contra legatario solo subsidiariamente.", "Cobrar primero al legatario por ansiedad procesal."),
  f("ph-1", "posesion-herencia", "Posesion legal de la herencia", "722", "Se confiere al heredero al deferirse la herencia, aunque lo ignore.", "Heredero ausente tiene posesion legal desde la delacion.", "Confundirla con posesion material."),
  f("ph-2", "posesion-herencia", "Posesion efectiva", "posesion efectiva", "Reconocimiento administrativo o judicial de la calidad hereditaria para efectos practicos.", "Permite inscripciones hereditarias.", "Creer que sin ella no hubo adquisicion hereditaria."),
  f("ph-3", "posesion-herencia", "Herencia yacente", "1240", "Herencia declarada yacente si pasan 15 dias sin aceptacion ni albacea con tenencia de bienes.", "Se nombra curador para dar cara visible a la sucesion.", "Declararla aunque exista albacea con tenencia que acepto."),
  f("dc-1", "derechos-concurrentes", "Representacion", "984", "Ficcion legal por la cual descendientes ocupan lugar, grado y derechos del representado.", "Nieto representa al hijo premuerto.", "Creer que el representante hereda al representado."),
  f("dc-2", "derechos-concurrentes", "Por cabeza", "985", "Division directa entre quienes suceden personalmente.", "Tres hijos vivos: cada uno por cabeza.", "Aplicarla a nietos que representan una rama."),
  f("dc-3", "derechos-concurrentes", "Por estirpe", "985", "Division por rama cuando opera representacion.", "Dos nietos de hijo premuerto comparten la cuota de esa rama.", "Dar a cada nieto igual que a cada hijo vivo."),
  f("dc-4", "derechos-concurrentes", "Linea de representacion", "984/986", "Opera en linea descendente y en los casos legalmente admitidos.", "Nietos pueden representar; ascendientes no representan.", "Hacer representar a un padre por un abuelo."),
  f("dc-5", "derechos-concurrentes", "Representacion por repudio", "984", "Tambien puede operar cuando el llamado no quiere suceder.", "Hijo repudia y sus descendientes ocupan su lugar si procede.", "Creer que repudio siempre extingue toda rama."),
  f("dc-6", "derechos-concurrentes", "Legitimarios y representacion", "1183", "Los legitimarios concurren, son excluidos y representados segun reglas intestadas.", "Nieto representa al padre en legitimas.", "Pensar que representacion es solo intestada sin excepciones."),
  f("dc-7", "derechos-concurrentes", "Transmision", "957", "Derecho del asignatario que muere sin aceptar o repudiar pasa a sus herederos.", "Hijo sobrevive al causante y muere luego.", "Usarla cuando el hijo premurio."),
  f("oc-1", "ordenes-completos", "Primer orden", "988", "Descendientes, personalmente o representados, excluyen a otros salvo conyuge.", "Hijos con conyuge; hermanos fuera.", "Llamar ascendientes pese a hijos vivos."),
  f("oc-2", "ordenes-completos", "Segundo orden", "989", "Sin posteridad, concurren conyuge y ascendientes de grado mas proximo.", "Conyuge 2/3 y ascendientes 1/3.", "Meter hermanos junto a padres."),
  f("oc-3", "ordenes-completos", "Tercer orden", "990", "A falta de descendientes, ascendientes y conyuge, suceden hermanos.", "Hermanos carnales y medios hermanos con reglas de proporcion.", "Olvidar que hermanos carnales llevan doble que medios."),
  f("oc-4", "ordenes-completos", "Cuarto orden", "992", "Colaterales de grado mas proximo excluyen a los de grado posterior.", "Tio de tercer grado excluye primo mas lejano.", "Mezclar todos los colaterales en una bolsa triste."),
  f("oc-5", "ordenes-completos", "Quinto orden", "995", "A falta de otros herederos abintestato, sucede el Fisco.", "Herencia vacante termina en el Estado.", "Llamarlo antes de revisar colaterales."),
  f("oc-6", "ordenes-completos", "Indignidad calificada del conyuge", "994", "El conyuge culpable de separacion judicial puede quedar sancionado.", "Falta para efectos del orden sucesorio.", "Tratar al conyuge sancionado como concurrente normal."),
  f("cc-1", "calculo-conyuge", "Conyuge con un hijo", "988", "El conyuge recibe la misma porcion que el hijo.", "Herencia 100: conyuge 50, hijo 50.", "Darle doble aunque hay un solo hijo."),
  f("cc-2", "calculo-conyuge", "Conyuge con varios hijos", "988", "El conyuge recibe el doble de lo que corresponde a cada hijo.", "Conyuge y tres hijos: se divide en cinco unidades.", "Dividir por cuatro personas iguales."),
  f("cc-3", "calculo-conyuge", "Cuarta minima del conyuge", "988", "Con varios hijos, el conyuge nunca baja de una cuarta parte.", "Con ocho hijos: conyuge 1/4 y el resto se divide entre hijos.", "Aplicar doble unidad aun cuando baja de 1/4."),
  f("cc-4", "calculo-conyuge", "Conyuge en segundo orden", "989", "Con ascendientes, el conyuge lleva dos tercios y ascendientes un tercio.", "Sin hijos: conyuge 2/3, padres 1/3.", "Dar mitad y mitad."),
  f("mp-1", "mejoras-pactos", "Mejoreros", "1195", "Descendientes, ascendientes y conyuge pueden recibir cuarta de mejoras.", "Testador mejora a un nieto aunque concurra un hijo.", "Creer que solo legitimarios concretos pueden ser mejoreros."),
  f("mp-2", "mejoras-pactos", "Mejoras no se presumen", "1198", "Donaciones o legados a legitimario se imputan a legitima salvo expresion de mejora.", "Si no dice mejora, se imputa a legitima.", "Convertir todo beneficio adicional en mejora tacita."),
  f("mp-3", "mejoras-pactos", "Pacto de no mejorar", "1204/1463", "Pacto solemne excepcional por escritura publica para no disponer de la cuarta de mejoras.", "Causante promete no mejorar para que acrezca legalmente.", "Pactar designacion directa de mejorero futuro."),
  f("im-1", "imputaciones", "Regla general de imputacion", "1198", "Donaciones y legados al legitimario se imputan a su legitima salvo voluntad contraria valida.", "Legado a hijo reduce lo que recibe por legitima.", "Sumarlo siempre como extra."),
  f("im-2", "imputaciones", "Gastos de educacion", "1198", "No se imputan a legitimas, mejoras ni libre disposicion.", "Pago de universidad no entra al calculo.", "Perseguir cada mensualidad como anticipo hereditario."),
  f("im-3", "imputaciones", "Deudas del legitimario", "1203", "Desembolsos para pagar deudas se imputan si fueron utiles para extinguirlas.", "Padre paga deuda de hijo y se extingue.", "Imputar pagos que no extinguieron deuda."),
  f("im-4", "imputaciones", "Donaciones al representado", "1202", "Se imputan a las legitimas de quienes lo representan cuando procede.", "Nietos representan al padre y cargan donaciones recibidas por el padre.", "Borrar la donacion porque el representado falta."),
  f("im-5", "imputaciones", "Frutos de cosas donadas", "1205", "No se imputan frutos durante vida del donante si la cosa fue entregada.", "Inmueble donado produce rentas al donatario.", "Meter frutos en el acervo por reflejo contable."),
  f("im-6", "imputaciones", "Exceso sobre legitima", "1193", "Si imputaciones exceden legitima, el exceso se carga preferentemente a cuarta de mejoras.", "Donacion supera legitima de Pedro y toca mejoras.", "Saltar directo a libre disposicion."),
  f("im-7", "imputaciones", "Exceso sobre mejoras", "1194", "Si tambien supera mejoras, se carga a la parte de libre disposicion.", "Donacion enorme invade libre.", "Pedir restitucion antes de agotar cuotas."),
  f("im-8", "imputaciones", "Restitucion por exceso total", "1206", "Si imputacion supera legitima, mejora y libre, el donatario debe restituir.", "Donacion desproporcionada obliga a devolver exceso.", "Dejarlo conservar todo porque ya lo recibio."),
  f("ac-1", "acervos-calculo", "Acervo bruto", "1341/959", "Masa inicial que puede confundir bienes del causante con bienes ajenos.", "Sociedad conyugal o copropiedad mezclada.", "Usarlo como base final."),
  f("ac-2", "acervos-calculo", "Acervo iliquido", "959", "Patrimonio del difunto separado de bienes ajenos, antes de bajas generales.", "Se deduce lo del conyuge por sociedad conyugal.", "Restar deudas antes de separar bienes de terceros."),
  f("ac-3", "acervos-calculo", "Acervo liquido", "959", "Acervo iliquido menos bajas generales.", "Base ordinaria para repartir.", "Olvidar costas, deudas hereditarias e impuestos aplicables."),
  f("ac-4", "acervos-calculo", "Primer acervo imaginario", "1185", "Agrega al liquido donaciones a legitimarios en razon de legitimas o mejoras.", "Donacion a hijo se colaciona al valor.", "Acumular en especie fisicamente."),
  f("ac-5", "acervos-calculo", "Colacion al valor", "1185/1188", "Se agrega valor actualizado prudencialmente, no la cosa misma.", "Departamento donado entra como valor neto.", "Pedir que devuelva el inmueble siempre."),
  f("ac-6", "acervos-calculo", "Liberalidades no acumulables", "1188/1198", "Regalos moderados y presentes de matrimonio no se acumulan.", "Reloj por titulacion no entra si es moderado.", "Acumular regalos de costumbre con furia fiscal."),
  f("ac-7", "acervos-calculo", "Segundo acervo imaginario", "1186", "Controla donaciones irrevocables excesivas a terceros.", "Donacion a extraño que excede cuarta parte de suma donaciones+acervo.", "Aplicarlo a toda donacion sin medir exceso."),
  f("ac-8", "acervos-calculo", "Exceso del segundo acervo", "1186", "Hay exceso si donaciones exceden la cuarta parte de donaciones mas acervo.", "Base 100 + donacion 60 = 160; cuarta 40; exceso 20.", "Comparar donacion contra 1/4 del acervo solo."),
  f("ac-9", "acervos-calculo", "Accion de inoficiosa donacion", "1187", "Protege legitimas o mejoras frente a donaciones excesivas.", "Donaciones a terceros menoscaban mitad legitimaria.", "Demandar reforma de testamento contra donatario."),
  f("ap-1", "acciones-protectoras", "Peticion de herencia", "1264/1269", "Accion del heredero verdadero contra quien ocupa la herencia como heredero.", "Heredero aparente obtuvo posesion efectiva.", "Usarla para rebajar legado inoficioso."),
  f("ap-2", "acciones-protectoras", "Reforma de testamento", "1216", "Accion de legitimarios para proteger legitimas vulneradas por testamento.", "Testamento deja todo a tercero.", "Confundirla con nulidad total."),
  f("ap-3", "acciones-protectoras", "Inoficiosa donacion", "1187", "Accion personal contra donatarios por donaciones excesivas.", "Se comienza por donaciones mas recientes.", "Dirigirla contra cualquier poseedor no donatario."),
  f("ap-4", "acciones-protectoras", "Particion", "1317", "Accion para poner fin a la comunidad hereditaria.", "Coheredero pide division.", "Creer que prescribe como reforma."),
  f("ee-1", "estructura-examen", "Estructura CNNREC", "metodo", "Concepto, Norma, Naturaleza, Requisitos, Efectos y Caso.", "Para representar: defina, cite, clasifique, requisitos, efectos, ejemplo.", "Partir por el caso sin norma ni concepto."),
];

const articleOptions = [
  "577/951",
  "588",
  "722",
  "951",
  "952",
  "953",
  "954",
  "955",
  "956",
  "957",
  "959",
  "984",
  "985",
  "986",
  "988",
  "989",
  "990",
  "992",
  "994",
  "995",
  "996",
  "999",
  "1036",
  "1097",
  "1104",
  "1167",
  "1183",
  "1184",
  "1185",
  "1186",
  "1187",
  "1188",
  "1189",
  "1191",
  "1193",
  "1194",
  "1195",
  "1196",
  "1198",
  "1202",
  "1203",
  "1204/1463",
  "1205",
  "1206",
  "1216",
  "1232",
  "1240",
  "1247",
  "1264/1269",
  "1317",
  "1344",
];

export const advancedFlashcards = frames.map((item) => ({
  id: `adv-card-${item.id}`,
  module: item.module,
  concept: item.concept,
  article: item.article,
  definition: item.definition,
  example: item.example,
  commonError: item.error,
}));

export const advancedArcadeQuestions = [
  ...frames.map((item, index) => ({
    id: `adv-art-${item.id}`,
    module: item.module,
    prompt: `Articulo o bloque clave para: ${item.concept}`,
    options: optionSet(item.article, index),
    answer: item.article,
    article: item.article,
    concept: item.concept,
    feedback: `Correcto. ${item.concept}: ${item.definition} Error frecuente: ${item.error}`,
  })),
  qa("adv-q-1", "derecho-real-herencia", "El derecho real de herencia recae sobre:", ["Universalidad juridica o cuota", "Solo inmuebles hereditarios", "Solo legados de especie", "Solo bienes inscritos"], "Universalidad juridica o cuota", "577/951", "Derecho real de herencia", "Correcto. La herencia es universalidad juridica, no inventario sentimental de cosas sueltas."),
  qa("adv-q-2", "herederos-legatarios", "La etiqueta usada por el testador para llamar heredero o legatario:", ["No decide: decide el objeto", "Decide siempre", "Solo importa si hay notario", "Decide si esta en mayusculas"], "No decide: decide el objeto", "1097/1104", "Asignatarios", "Correcto. El objeto manda. El testador puede equivocarse con solemnidad."),
  qa("adv-q-3", "herederos-legatarios", "El legatario de genero adquiere:", ["Derecho personal", "Dominio inmediato de especie", "Derecho real de herencia", "Posesion efectiva"], "Derecho personal", "954", "Legado de genero", "Correcto. Tiene credito para exigir entrega; no dominio instantaneo."),
  qa("adv-q-4", "herederos-legatarios", "El legatario de especie adquiere dominio:", ["Desde la muerte del causante", "Desde la tradicion", "Desde posesion efectiva", "Desde particion"], "Desde la muerte del causante", "951/954", "Legado de especie", "Correcto. La especie pasa ipso iure; el genero espera entrega."),
  qa("adv-q-5", "derechos-concurrentes", "Cuando hay representacion, la division es:", ["Por estirpe", "Por cabeza siempre", "Por orden alfabetico", "Por cuotas testamentarias"], "Por estirpe", "985", "Representacion", "Correcto. La rama ocupa el lugar; no se multiplica por dramatismo."),
  qa("adv-q-6", "derechos-concurrentes", "La representacion opera:", ["En linea descendente", "En linea ascendente", "Solo entre conyuges", "Solo con Fisco"], "En linea descendente", "984/986", "Representacion", "Correcto. Ascendientes no representan. El arbol no crece hacia atras."),
  qa("adv-q-7", "calculo-conyuge", "Conyuge + tres hijos: la herencia se divide en:", ["Cinco unidades", "Cuatro unidades iguales", "Tres unidades", "Dos mitades"], "Cinco unidades", "988", "Conyuge con hijos", "Correcto. Conyuge vale dos unidades; cada hijo una."),
  qa("adv-q-8", "calculo-conyuge", "Conyuge + ocho hijos: el conyuge recibe minimo:", ["1/4", "1/9", "2/10", "1/2"], "1/4", "988", "Cuarta minima", "Correcto. El conyuge no baja de cuarta parte."),
  qa("adv-q-9", "ordenes-completos", "Sin descendientes, con conyuge y padres, aplica:", ["Segundo orden", "Primer orden", "Tercer orden", "Fisco"], "Segundo orden", "989", "Ordenes", "Correcto. Ascendientes y conyuge: segundo orden."),
  qa("adv-q-10", "ordenes-completos", "En tercer orden, el hermano carnal lleva respecto del medio hermano:", ["Doble", "Igual", "Triple", "Nada"], "Doble", "990", "Hermanos", "Correcto. Carnal doble porcion; el medio hermano no se imprime igual."),
  qa("adv-q-11", "acervos-calculo", "El acervo liquido se obtiene al:", ["Deducir bajas generales del iliquido", "Sumar donaciones a terceros", "Aplicar representacion", "Restar legitimas"], "Deducir bajas generales del iliquido", "959", "Acervo liquido", "Correcto. Primero limpiar, despues calcular."),
  qa("adv-q-12", "acervos-calculo", "Donacion a legitimario hecha en razon de legitima o mejora:", ["Primer acervo imaginario", "Segundo acervo imaginario", "Herencia yacente", "Particion"], "Primer acervo imaginario", "1185", "Primer acervo", "Correcto. Colacion al valor: el pasado entra en la planilla."),
  qa("adv-q-13", "acervos-calculo", "Donacion excesiva a tercero:", ["Segundo acervo imaginario", "Primer acervo imaginario", "Legitima efectiva", "Posesion legal"], "Segundo acervo imaginario", "1186", "Segundo acervo", "Correcto. Se mide contra cuarta parte de acervo + donaciones."),
  qa("adv-q-14", "acervos-calculo", "Base 100, donacion a tercero 60. Exceso segun 1186:", ["20", "40", "60", "10"], "20", "1186", "Exceso", "Correcto. 100+60=160; cuarta=40; exceso=20."),
  qa("adv-q-15", "acciones-protectoras", "Donaciones excesivas que menoscaban legitimas o mejoras:", ["Inoficiosa donacion", "Peticion de herencia", "Interrogacion judicial", "Herencia yacente"], "Inoficiosa donacion", "1187", "Acciones", "Correcto. No se reforma testamento contra una donacion; se persigue la inoficiosa."),
  qa("adv-q-16", "imputaciones", "Gastos de educacion de un descendiente:", ["No se imputan", "Siempre se imputan a legitima", "Se imputan a mejora", "Crean transmision"], "No se imputan", "1198", "Imputaciones", "Correcto. La universidad ya fue suficiente condena."),
  qa("adv-q-17", "imputaciones", "Si imputacion excede legitima, primero invade:", ["Cuarta de mejoras", "Libre disposicion", "Fisco", "Peticion de herencia"], "Cuarta de mejoras", "1193", "Exceso imputable", "Correcto. El exceso entra a mejoras antes de arruinar la libre."),
  qa("adv-q-18", "mejoras-pactos", "La cuarta de mejoras puede favorecer a:", ["Descendientes, ascendientes y conyuge", "Cualquier tercero", "Solo hijos", "Solo legatarios"], "Descendientes, ascendientes y conyuge", "1195", "Mejoreros", "Correcto. Mejora no es libre disposicion con chaqueta neon."),
  qa("adv-q-19", "mejoras-pactos", "El pacto de no mejorar es:", ["Excepcional y solemne", "Libre y verbal", "Prohibido siempre", "Una particion anticipada"], "Excepcional y solemne", "1204/1463", "Pacto de no mejorar", "Correcto. Escritura publica o nada; el futuro sucesorio no se toca con servilleta."),
  qa("adv-q-20", "posesion-herencia", "Herencia yacente requiere, entre otros:", ["15 dias sin aceptacion", "4 anos sin particion", "Un testamento cerrado", "Un legado de genero"], "15 dias sin aceptacion", "1240", "Herencia yacente", "Correcto. Pasan 15 dias y la herencia necesita curador, no playlist triste."),
  qa("adv-q-21", "acciones-protectoras", "Accion imprescriptible para terminar comunidad:", ["Particion", "Reforma", "Inoficiosa", "Peticion"], "Particion", "1317", "Particion", "Correcto. La comunidad hereditaria no es cadena perpetua."),
  qa("adv-q-22", "clases-sucesion", "En sucesion mixta, segun art. 996, primero se:", ["Cumplen disposiciones testamentarias respetando legitimas y mejoras", "Aplica siempre intestada completa", "Entrega todo al conyuge", "Abre segundo acervo"], "Cumplen disposiciones testamentarias respetando legitimas y mejoras", "996", "Sucesion mixta", "Correcto. Testamento primero, pero asignaciones forzosas con escolta."),
];

export const advancedMnemonicChallenges = [
  mn("adv-m-1", "derecho-real-herencia", "R U D P _", "E", "Derecho real de herencia", "Real, Universal, Distinto del dominio, Protegido por peticion, Efimero."),
  mn("adv-m-2", "clases-sucesion", "T I _", "M", "Clases de sucesion", "Testamentaria, Intestada, Mixta."),
  mn("adv-m-3", "herederos-legatarios", "U C R / E _", "G", "Asignatarios", "Universal, Cuota, Remanente / Especie, Genero."),
  mn("adv-m-4", "derechos-concurrentes", "R T A _", "S", "Derechos concurrentes", "Representacion, Transmision, Acrecimiento, Sustitucion."),
  mn("adv-m-5", "ordenes-completos", "D A C H _", "F", "Ordenes", "Descendientes, Ascendientes-conyuge, Hermanos, Colaterales, Fisco."),
  mn("adv-m-6", "calculo-conyuge", "1=igual / 2+=doble / 7+=_", "CUARTA", "Conyuge con hijos", "Con siete o mas hijos opera la cuarta minima."),
  mn("adv-m-7", "acervos-calculo", "S B D A _", "E", "Calculo de acervos", "Separar, Bajar, Donar, Agregar, Exceso."),
  mn("adv-m-8", "imputaciones", "I D E _", "L", "Imputaciones", "Imputar Donaciones, Exceptuar Educacion, luego Libre/restaurar."),
  mn("adv-m-9", "acciones-protectoras", "P R I _", "P", "Acciones", "Peticion, Reforma, Inoficiosa, Particion."),
  mn("adv-m-10", "estructura-examen", "C N N R E _", "C", "Oral", "Concepto, Norma, Naturaleza, Requisitos, Efectos, Caso."),
];

export const advancedOralQuestions = [
  oral("adv-o-1", "derecho-real-herencia", "Explique el derecho real de herencia y su diferencia con el dominio.", ["Concepto: derecho real sobre universalidad juridica o cuota.", "Norma: arts. 577 y 951; proteccion por peticion de herencia.", "Doctrina: objeto distinto del dominio, que recae en bienes singulares.", "Caso: antes de particion el heredero tiene cuota hereditaria, no dominio exclusivo sobre la casa."], "Buena ruta: universalidad primero, dominio singular despues. La particion no es decorado."),
  oral("adv-o-2", "herederos-legatarios", "Distinga heredero universal, heredero de cuota y heredero de remanente.", ["Concepto: todos son asignatarios a titulo universal, pero se diferencian por forma de llamamiento.", "Norma: arts. 951 y 1097.", "Doctrina: universal sin cuota; de cuota con proporcion; remanente recibe lo que queda.", "Caso: dejo 1/3 a A y resto a B; B es remanente y puede funcionar como de cuota."], "La palabra universal no significa unico. El testador puede repartir el caos con distintas etiquetas."),
  oral("adv-o-3", "herederos-legatarios", "Distinga legatario de especie y de genero.", ["Concepto: especie es cuerpo cierto; genero es indeterminado dentro de genero.", "Norma: arts. 951, 954 y 1104.", "Doctrina: especie adquiere dominio desde muerte; genero tiene credito y adquiere por entrega.", "Caso: 'mi reloj' versus '100 acciones'."], "Esta distincion evita convertir creditos en fantasmas reales."),
  oral("adv-o-4", "posesion-herencia", "Explique posesion legal, posesion efectiva y herencia yacente.", ["Concepto: legal nace por delacion; efectiva reconoce calidad; yacente da administracion visible.", "Norma: arts. 722 y 1240.", "Doctrina: adquisicion hereditaria no depende del decreto de posesion efectiva.", "Caso: pasan 15 dias sin aceptacion ni albacea; se pide curador de herencia yacente."], "No confundas adquisicion hereditaria con tramite. La burocracia llega despues con abrigo mojado."),
  oral("adv-o-5", "ordenes-completos", "Desarrolle los cinco ordenes sucesorios intestados.", ["Concepto: grupos llamados preferentemente que se excluyen entre si.", "Norma: arts. 988, 989, 990, 992 y 995.", "Doctrina: el heredero determinante activa el orden y excluye posteriores.", "Caso: si hay hijos, hermanos y colaterales esperan afuera."], "Ordenes completos: descendientes, ascendientes-conyuge, hermanos, colaterales, Fisco."),
  oral("adv-o-6", "calculo-conyuge", "Explique el calculo del conyuge sobreviviente con hijos.", ["Concepto: concurre en primer orden con descendientes.", "Norma: art. 988.", "Doctrina: con un hijo igual; con varios doble de cada hijo; minimo cuarta parte.", "Caso: con tres hijos divide en cinco unidades; con ocho, conyuge recibe 1/4."], "El conyuge se cuenta con calculadora, no con intuicion familiar."),
  oral("adv-o-7", "acervos-calculo", "Explique la formacion de acervo bruto, iliquido y liquido.", ["Concepto: son etapas de depuracion de la masa hereditaria.", "Norma: art. 959 y doctrina de acervos.", "Doctrina: bruto incluye bienes confundidos; iliquido separa ajenos; liquido descuenta bajas.", "Caso: sociedad conyugal exige separar antes de calcular legitimas."], "Primero separa, luego deduce. Repartir bruto es sabotaje con solemnidad."),
  oral("adv-o-8", "acervos-calculo", "Explique primer y segundo acervo imaginario.", ["Concepto: agregaciones contables para proteger legitimas y mejoras.", "Norma: arts. 1185 y 1186.", "Doctrina: primero donaciones a legitimarios; segundo donaciones excesivas a terceros.", "Caso: donacion a hijo va al primero; donacion excesiva a amigo va al segundo."], "Imaginario no significa falso: significa que el Codigo recuerda lo donado."),
  oral("adv-o-9", "imputaciones", "Explique imputaciones a legitimas y mejoras.", ["Concepto: descuentos de donaciones, legados o pagos recibidos por legitimario.", "Norma: arts. 1198, 1202, 1203, 1205 y 1206.", "Doctrina: regla evita desigualdad; mejoras requieren expresion.", "Caso: legado al hijo se imputa salvo que conste mejora."], "Imputar es ajustar cuentas, no arruinar cumpleaños."),
  oral("adv-o-10", "acciones-protectoras", "Distinga peticion de herencia, reforma e inoficiosa donacion.", ["Concepto: cada accion protege un interes distinto.", "Norma: arts. 1264, 1216 y 1187.", "Doctrina: peticion reclama calidad; reforma protege legitimas contra testamento; inoficiosa ataca donaciones excesivas.", "Caso: heredero aparente, testamento lesivo o donatario excesivo."], "Elegir accion correcta es medio examen ganado."),
];

export const advancedDetectiveCases = [
  caseFile("derecho-real-archivo", "El dominio que nunca llegó", "Derecho real de herencia", 3, "derecho-real-herencia", "Tres herederos se pelean por vender 'su' departamento antes de particion. Uno jura que su tercio hereditario equivale a la pieza con mejor vista. El Conservador apaga lentamente la pantalla.", ["Derecho real de herencia sobre universalidad", "Dominio singular solo tras particion", "Peticion de herencia protege calidad"], "Distinguir derecho real de herencia y dominio singular antes de particion.", [
    choice("Sostener que cada heredero tiene dominio exclusivo sobre una habitacion.", false, "951/1344", "Derecho real", "Incorrecto. Antes de particion hay cuota en la universalidad, no loteria inmobiliaria."),
    choice("Afirmar que tienen derecho real de herencia sobre universalidad o cuota, no dominio singular exclusivo.", true, "577/951", "Derecho real de herencia", "Correcto. La herencia es universalidad juridica; el dominio singular se consolida por adjudicacion."),
    choice("Pedir reforma de testamento por existir comunidad.", false, "1216", "Reforma", "Incorrecto. No hay legitima vulnerada; hay confusion entre herencia y dominio."),
  ]),
  caseFile("legado-genero", "Las cien acciones fantasma", "Legatario de genero", 2, "herederos-legatarios", "El testamento lega a Vera '100 acciones serie N'. Los herederos dicen que Vera ya es dueña desde la muerte y debe soportar perdidas de mercado. Vera solo quiere que alguien entregue algo antes del colapso bursatil.", ["Legado de genero", "Derecho personal", "Dominio por entrega"], "Distinguir legado de genero y especie.", [
    choice("Vera adquiere dominio desde la muerte como legataria de especie.", false, "954", "Legado", "Incorrecto. Es genero: tiene credito para exigir entrega."),
    choice("Vera tiene derecho personal contra obligados al pago del legado; adquiere por entrega.", true, "951/954", "Legado de genero", "Correcto. El genero no se vuelve especie por ansiedad financiera."),
    choice("Vera representa al causante en deudas hereditarias.", false, "1104", "Legatario", "Incorrecto. El legatario no representa al testador."),
  ]),
  caseFile("conyuge-ocho", "Ocho hijos y una viuda bajo neón", "Cuarta minima del conyuge", 4, "calculo-conyuge", "Causante deja conyuge y ocho hijos. La familia propone dividir en diez unidades porque 'el conyuge vale dos'. La viuda mira el art. 988 como quien mira una navaja elegante.", ["Conyuge con varios hijos", "Doble porcion", "Cuarta minima"], "Aplicar cuarta minima cuando el doble baja de 1/4.", [
    choice("Dividir en diez unidades: conyuge 2/10 e hijos 1/10.", false, "988", "Conyuge", "Incorrecto. 2/10 es menor que 1/4; opera garantia minima."),
    choice("Asignar al conyuge 1/4 y dividir 3/4 entre los ocho hijos.", true, "988", "Cuarta minima", "Correcto. La cuarta minima salva a la viuda de la matematica hostil."),
    choice("Excluir al conyuge por existir descendientes.", false, "988", "Ordenes", "Incorrecto. El conyuge concurre con descendientes."),
  ]),
  caseFile("hermano-medio", "El medio hermano completo en expectativas", "Tercer orden", 3, "ordenes-completos", "No hay descendientes, ascendientes ni conyuge. Concurren una hermana carnal y un medio hermano. El medio hermano exige igualdad absoluta porque trajo empanadas al velorio.", ["Tercer orden", "Hermano carnal doble", "Medio hermano simple"], "Aplicar proporcionalidad entre hermanos carnales y medios.", [
    choice("Dividir por partes iguales entre ambos.", false, "990", "Hermanos", "Incorrecto. El hermano carnal lleva doble porcion que el medio hermano."),
    choice("Dar dos unidades a la hermana carnal y una unidad al medio hermano.", true, "990", "Tercer orden", "Correcto. La empanada no deroga el art. 990."),
    choice("Llamar al Fisco porque no hay hijos.", false, "995", "Fisco", "Incorrecto. Hay tercer orden antes del Fisco."),
  ]),
  caseFile("mixta-remanente", "El testamento incompleto", "Sucesion mixta", 4, "clases-sucesion", "El testamento lega una moto, deja 1/4 a una amiga y guarda silencio sobre el resto. Los hijos preguntan si el silencio se hereda o se archiva.", ["Art. 996", "Remanente abintestato", "Legitimas y mejoras primero"], "Resolver sucesion parte testada y parte intestada.", [
    choice("Cumplir disposiciones validas y adjudicar remanente abintestato, respetando legitimas y mejoras.", true, "996", "Sucesion mixta", "Correcto. El silencio testamentario activa a la ley."),
    choice("Declarar intestada toda la sucesion por testamento incompleto.", false, "952/996", "Mixta", "Incorrecto. Lo valido se cumple; el resto va por ley."),
    choice("Entregar todo a la amiga por ser voluntad parcial.", false, "996", "Remanente", "Incorrecto. El testamento no coloniza lo que no dispuso."),
  ]),
  caseFile("yacente", "Quince dias sin herederos", "Herencia yacente", 2, "posesion-herencia", "El causante muere, nadie acepta, el albacea designado nunca responde y los acreedores rondan el edificio. Han pasado dieciséis dias. El archivo huele a curador.", ["15 dias", "Sin aceptacion", "Sin albacea con tenencia"], "Declarar herencia yacente.", [
    choice("Pedir declaracion de herencia yacente y nombramiento de curador.", true, "1240", "Herencia yacente", "Correcto. La sucesion necesita cara visible antes de que los acreedores hagan teatro."),
    choice("Esperar cuatro anos para reforma de testamento.", false, "1216", "Reforma", "Incorrecto. No hay testamento lesivo; hay herencia sin administrador."),
    choice("Dar posesion efectiva a acreedores.", false, "posesion efectiva", "Posesion", "Incorrecto. Los acreedores no se convierten en herederos por impaciencia."),
  ]),
  caseFile("educacion", "La universidad del hijo caro", "Imputaciones", 3, "imputaciones", "La causante pago la universidad de su hija. En la particion, el hermano quiere imputar hasta el cafe del casino a la legitima. El expediente bosteza con desprecio.", ["Gastos de educacion", "No imputables", "Art. 1198"], "Identificar liberalidades no imputables.", [
    choice("Imputar gastos de educacion a la legitima.", false, "1198", "Imputaciones", "Incorrecto. Los gastos de educacion no se computan ni imputan."),
    choice("No imputar los gastos de educacion a legitimas, mejoras ni libre disposicion.", true, "1198", "Educacion", "Correcto. La educacion ya cobro suficiente en salud mental."),
    choice("Aplicar accion de inoficiosa donacion por cada semestre.", false, "1187", "Inoficiosa", "Incorrecto. No todo desembolso en vida es donacion inoficiosa."),
  ]),
  caseFile("donacion-tercero", "La donacion al DJ testamentario", "Segundo acervo imaginario", 5, "acervos-calculo", "El causante dono 200 a un DJ que tocaba synth funerario. El acervo base es 100 y existen legitimarios. La mitad legitimaria empieza a parpadear en rojo.", ["Donacion a tercero", "Exceso mayor", "Inoficiosa donacion"], "Detectar segundo acervo e inoficiosa.", [
    choice("Formar segundo acervo y considerar accion de inoficiosa donacion.", true, "1186/1187", "Segundo acervo", "Correcto. 100+200=300; cuarta 75; exceso 125. Esto ya perfora zonas protegidas."),
    choice("Ignorar la donacion porque fue irrevocable.", false, "1186", "Acervos", "Incorrecto. Irrevocable no significa invisible."),
    choice("Formar solo primer acervo por ser donacion a legitimario.", false, "1185", "Primer acervo", "Incorrecto. El DJ no es legitimario, aunque haya llorado con autotune."),
  ]),
];

export const advancedBosses = [
  {
    id: "heredero-legatario-boss",
    name: "Notario 1104",
    subtitle: "Herederos vs legatarios",
    module: "herederos-legatarios",
    color: "#c69a41",
    intro: "El notario del distrito parpadea en ambar. Cada etiqueta falsa del testador alimenta su sello mecanico.",
    questions: [
      bossQ("hlb1", "Asignatario a titulo universal es:", ["Heredero", "Legatario", "Albacea", "Curador"], "Heredero", "951/1097", "Universalidad equivale a heredero."),
      bossQ("hlb2", "Asignatario a titulo singular es:", ["Legatario", "Heredero universal", "Heredero de remanente", "Fisco"], "Legatario", "951/1104", "Singularidad equivale a legado."),
      bossQ("hlb3", "Si el testador llama legatario a quien recibe toda la herencia:", ["Es heredero", "Es legatario", "Es incapaz", "Es albacea"], "Es heredero", "1097", "El objeto manda sobre la etiqueta."),
      bossQ("hlb4", "Legado de genero otorga inicialmente:", ["Derecho personal", "Dominio inmediato", "Derecho real de herencia", "Posesion efectiva"], "Derecho personal", "954", "Debe exigir entrega."),
      bossQ("hlb5", "El heredero representa al causante segun:", ["1097", "1104", "1186", "1240"], "1097", "1097", "Continua derechos y obligaciones transmisibles."),
    ],
  },
  {
    id: "acervo-calculo-boss",
    name: "Planilla 1186",
    subtitle: "Calculo de acervos",
    module: "acervos-calculo",
    color: "#2cf7ff",
    intro: "Una planilla neon abre celdas como tumbas. Cada numero incorrecto convoca al contador de ultratumba.",
    questions: [
      bossQ("acb1", "Bruto 300, bienes ajenos 80, bajas 40. Acervo liquido:", ["180", "220", "260", "140"], "180", "959", "300-80=220; 220-40=180."),
      bossQ("acb2", "Liquido 150, donacion a legitimario 50. Primer acervo:", ["200", "150", "100", "50"], "200", "1185", "Se agrega al valor."),
      bossQ("acb3", "Base 100, donacion tercero 60. Exceso:", ["20", "40", "60", "0"], "20", "1186", "100+60=160; cuarta=40; exceso=20."),
      bossQ("acb4", "Base 100, donacion tercero 200. Segundo acervo:", ["225", "300", "100", "75"], "225", "1186", "Exceso 125; segundo acervo 100+125=225."),
      bossQ("acb5", "Accion si donacion excesiva menoscaba legitimas:", ["Inoficiosa donacion", "Reforma", "Peticion", "Particion"], "Inoficiosa donacion", "1187", "Accion contra donatarios."),
    ],
  },
];

export const calculationScenarios = [
  calc("calc-1", "Conyuge y un hijo", "Herencia intestada de 120. Concurren conyuge sobreviviente y un hijo.", "988", ["Con un hijo, el conyuge lleva la misma porcion que el hijo."], { conyuge: 60, hijo: 60 }),
  calc("calc-2", "Conyuge y tres hijos", "Herencia intestada de 150. Concurren conyuge y tres hijos.", "988", ["Con varios hijos, el conyuge vale dos unidades.", "Total unidades: 2 + 3 = 5.", "Cada unidad vale 30."], { conyuge: 60, cadaHijo: 30 }),
  calc("calc-3", "Conyuge y ocho hijos", "Herencia intestada de 200. Concurren conyuge y ocho hijos.", "988", ["La doble porcion daria menos de 1/4.", "Conyuge recibe minimo 50.", "Resto 150 se divide entre ocho."], { conyuge: 50, cadaHijo: 18.75 }),
  calc("calc-4", "Segundo orden", "Herencia de 90. No hay descendientes. Concurren conyuge y dos ascendientes de grado mas proximo.", "989", ["Conyuge recibe 2/3.", "Ascendientes reciben 1/3 en total.", "Dos ascendientes dividen ese tercio."], { conyuge: 60, cadaAscendiente: 15 }),
  calc("calc-5", "Hermanos carnales y medio hermano", "Herencia de 120. No hay descendientes, ascendientes ni conyuge. Concurren dos hermanos carnales y un medio hermano.", "990", ["Cada carnal vale dos unidades.", "Medio hermano vale una unidad.", "Total unidades: 5."], { cadaCarnal: 48, medioHermano: 24 }),
  calc("calc-6", "Bruto a liquido", "Acervo bruto 300. Bienes ajenos o confundidos 100. Bajas generales 50.", "959", ["Separar bienes ajenos: 300 - 100 = 200.", "Deducir bajas generales: 200 - 50 = 150."], { acervoIliquido: 200, acervoLiquido: 150 }),
  calc("calc-7", "Primer acervo imaginario", "Acervo liquido 150. Donaciones acumulables a legitimarios 50.", "1185", ["Primer acervo imaginario = liquido + donaciones acumulables.", "Mitad legitimaria = 1/2 del primer acervo.", "Mejoras y libre = 1/4 cada una."], { primerAcervo: 200, mitadLegitimaria: 100, cuartaMejoras: 50, cuartaLibre: 50 }),
  calc("calc-8", "Segundo acervo sin exceso", "Base 150. Donaciones irrevocables a terceros 50.", "1186", ["Suma: 150 + 50 = 200.", "Cuarta parte: 50.", "Donacion no excede la cuarta parte."], { sumaBase: 200, cuartaReferencia: 50, exceso: 0 }),
  calc("calc-9", "Segundo acervo con exceso simple", "Base 100. Donaciones irrevocables a terceros 60.", "1186", ["Suma: 160.", "Cuarta parte: 40.", "Exceso: 60 - 40 = 20.", "Segundo acervo: 100 + 20 = 120."], { sumaBase: 160, cuartaReferencia: 40, exceso: 20, segundoAcervo: 120 }),
  calc("calc-10", "Inoficiosa encendida", "Base 100. Donaciones irrevocables a terceros 200.", "1186/1187", ["Suma: 300.", "Cuarta parte: 75.", "Exceso: 125.", "Segundo acervo: 225.", "El exceso puede menoscabar mejoras y legitimas."], { sumaBase: 300, cuartaReferencia: 75, exceso: 125, segundoAcervo: 225 }),
  calc("calc-11", "Imputacion normal", "Legitima de 100. Donacion imputable recibida por el legitimario: 45.", "1198", ["Se imputa la donacion.", "Saldo a enterar: 100 - 45."], { saldoLegitima: 55 }),
  calc("calc-12", "Exceso sobre legitima", "Legitima 100. Donacion imputable 120. No hay distribucion testamentaria de mejoras.", "1193", ["La donacion cubre la legitima.", "Exceso 20 se carga a mejoras con preferencia."], { cubreLegitima: 100, excesoAMejora: 20 }),
];

function f(id, module, concept, article, definition, example, error) {
  return { id, module, concept, article, definition, example, error };
}

function optionSet(answer, offset) {
  const options = [answer];
  let cursor = offset;
  while (options.length < 4) {
    const next = articleOptions[cursor % articleOptions.length];
    if (!options.includes(next)) options.push(next);
    cursor += 7;
  }
  return options;
}

function qa(id, module, prompt, options, answer, article, concept, feedback) {
  return { id, module, prompt, options, answer, article, concept, feedback };
}

function mn(id, module, prompt, answer, hint, expansion) {
  return {
    id,
    module,
    prompt,
    answer,
    hint,
    expansion,
    feedback: `Correcto. ${answer}: ${expansion} La memoria vuelve del cementerio con una linterna.`,
  };
}

function oral(id, module, prompt, sequence, feedback) {
  return {
    id,
    module,
    prompt,
    blocks: [
      { id: "concepto", label: sequence[0] },
      { id: "norma", label: sequence[1] },
      { id: "doctrina", label: sequence[2] },
      { id: "caso", label: sequence[3] },
    ],
    answer: ["concepto", "norma", "doctrina", "caso"],
    feedback,
  };
}

function choice(label, correct, article, concept, feedback) {
  return { label, correct, article, concept, feedback };
}

function caseFile(id, title, theme, difficulty, module, dossier, documents, resolution, choices) {
  return {
    id,
    title,
    theme,
    difficulty,
    module,
    dossier,
    cast: [
      { name: "Causante", role: "Origen del expediente", status: "muerto" },
      { name: "Interesados", role: "Familia/terceros", status: "conflicto" },
      { name: "Archivo civil", role: "Sistema probatorio", status: "parpadea" },
    ],
    documents: documents.map((body, index) => ({ title: `Pista ${index + 1}`, body })),
    tree: [
      { id: "causante", name: "Causante", tag: "origen", state: "dead", x: 50, y: 12 },
      { id: "rama1", name: "Rama A", tag: "interes", state: "represented", x: 35, y: 60 },
      { id: "rama2", name: "Rama B", tag: "conflicto", state: "alive", x: 65, y: 60 },
    ],
    choices,
    resolution,
  };
}

function bossQ(id, prompt, options, answer, article, feedback) {
  return { id, prompt, options, answer, article, feedback };
}

function calc(id, title, prompt, article, steps, answers) {
  return { id, title, prompt, article, steps, answers };
}
