export const additionalModules = [
  {
    id: "derecho-real-herencia",
    title: "Derecho real de herencia",
    theme: "Una universalidad jurídica con vida breve y carácter intenso.",
    articles: ["577", "951", "684", "1264"],
    concepts: ["derecho real", "universalidad jurídica", "dominio", "petición de herencia", "vida efímera"],
    summary:
      "El derecho real de herencia recae sobre la universalidad del patrimonio transmisible o una cuota de el; es distinto del dominio y se protege especialmente por la petición de herencia.",
    mnemonic: "RUDPE: Real, Universal, Distinto del dominio, Protegido por petición, Efímero.",
    commonError: "Hablar de dominio sobre bienes singulares antes de partición, como si la comunidad hereditaria pidiera permiso.",
  },
  {
    id: "clases-sucesion",
    title: "Clases de sucesión",
    theme: "Testamento, ley o mezcla: tres rutas hacia la misma pelea familiar.",
    articles: ["952", "996"],
    concepts: ["testamentaria", "intestada", "mixta", "remanente"],
    summary:
      "La sucesión puede ser testamentaria, intestada o mixta. En la mixta se cumplen primero disposiciones testamentarias y el remanente se adjudica abintestato, respetando legítimas y mejoras.",
    mnemonic: "TIM: Testamentaria, Intestada, Mixta.",
    commonError: "Creer que si hay testamento desaparecen siempre las reglas intestadas.",
  },
  {
    id: "herederos-legatarios",
    title: "Herederos y legatarios",
    theme: "Universalidad o cosa singular: la etiqueta del testador no manda.",
    articles: ["951", "953", "954", "1097", "1104", "1362", "1363"],
    concepts: ["heredero universal", "heredero de cuota", "remanente", "legatario de especie", "legatario de género", "responsabilidad"],
    summary:
      "El objeto de la asignación determina si hay heredero o legatario. El heredero representa al causante; el legatario no, y su responsabilidad es excepcional.",
    mnemonic: "UCR-EG: Universal, Cuota, Remanente; Especie, Género.",
    commonError: "Llamar heredero al legatario porque el testamento lo dijo con mucha seguridad.",
  },
  {
    id: "posesion-herencia",
    title: "Posesión legal, efectiva y yacente",
    theme: "La herencia necesita cara visible antes de que los acreedores aprendan a gritar.",
    articles: ["688", "722", "955", "1240"],
    concepts: ["posesión legal", "posesión efectiva", "herencia yacente", "curador", "15 días"],
    summary:
      "El heredero adquiere posesión legal al deferirse la herencia, aun si lo ignora. La herencia yacente puede declararse si pasan 15 días sin aceptación ni albacea con tenencia de bienes.",
    mnemonic: "LEY: Legal, Efectiva, Yacente.",
    commonError: "Confundir posesión legal con decreto de posesión efectiva.",
  },
  {
    id: "derechos-concurrentes",
    title: "Derechos que concurren",
    theme: "Representación, transmisión, acrecimiento y sustitución: cuatro trampas con nombres solemnes.",
    articles: ["957", "984", "985", "986", "1147", "1183"],
    concepts: ["representación", "transmisión", "acrecimiento", "sustitución", "por cabeza", "por estirpe"],
    summary:
      "La representación opera como ficción legal en línea descendente; el representante sucede directamente al causante, por estirpe, no a través del representado.",
    mnemonic: "RTAS: Representación, Transmisión, Acrecimiento, Sustitución.",
    commonError: "Usar representación como sinónimo de transmisión o creer que el nieto hereda a través del padre.",
  },
  {
    id: "ordenes-completos",
    title: "Órdenes sucesorios completos",
    theme: "La fila hereditaria: si aparece el primero, el de atrás mira desde la lluvia.",
    articles: ["988", "989", "990", "992", "994", "995"],
    concepts: ["descendientes", "cónyuge", "ascendientes", "hermanos", "colaterales", "Fisco"],
    summary:
      "Los órdenes se excluyen entre sí: descendientes (concurre el cónyuge o conviviente civil); ascendientes y cónyuge o conviviente civil; hermanos; colaterales; Fisco. El heredero determinante activa el orden.",
    mnemonic: "DAHCF: Descendientes, Ascendientes-cónyuge, Hermanos, Colaterales, Fisco.",
    commonError: "Meter al hermano dentro del primer orden porque llevó café a la notaría.",
  },
  {
    id: "calculo-conyuge",
    title: "Cálculo del cónyuge sobreviviente",
    theme: "El cónyuge no es extra: es una variable con mínimo legal.",
    articles: ["988", "989", "996"],
    concepts: ["un hijo", "varios hijos", "cuarta mínima", "segundo orden", "imputación mixta"],
    summary:
      "Con un hijo, el cónyuge lleva lo mismo que el hijo. Con varios, lleva el doble que cada hijo, pero nunca menos de una cuarta parte. En segundo orden lleva dos tercios con ascendientes.",
    mnemonic: "1=igual, 2+=doble, 7+=cuarta mínima, 2do=2/3.",
    commonError: "Dividir siempre en partes iguales aunque el art. 988 este gritando desde el monitor.",
  },
  {
    id: "mejoras-pactos",
    title: "Cuarta de mejoras y pacto de no mejorar",
    theme: "La única sucesión futura que el Código deja entrar por la puerta lateral.",
    articles: ["1167", "1195", "1198", "1203", "1204", "1463"],
    concepts: ["mejoreros", "mejora expresa", "mejora tácita", "pacto de no mejorar", "modalidades"],
    summary:
      "La cuarta de mejoras favorece a descendientes, ascendientes, cónyuge y conviviente civil. Las mejoras no se presumen, salvo supuestos legales, y el pacto de no mejorar es excepcional y solemne.",
    mnemonic: "MAPE: Mejoreros, Acto expreso, Pacto, Excepción.",
    commonError: "Asignar mejoras a terceros como si la cuarta fuera libre disposición con maquillaje.",
  },
  {
    id: "imputaciones",
    title: "Imputaciones a legítimas y mejoras",
    theme: "Donaciones, legados y desembolsos: el pasado patrimonial siempre vuelve.",
    articles: ["1189", "1193", "1194", "1196", "1198", "1202", "1203", "1205", "1206"],
    concepts: ["imputación", "legados", "donaciones", "deudas del legitimario", "gastos de educación", "restitución", "prorrata"],
    summary:
      "Donaciones y legados al legitimario se imputan a su legítima salvo expresión de mejora. Gastos de educación y regalos de costumbre no se imputan. Excesos se cargan a mejora, libre disposición o restitución.",
    mnemonic: "IDEL: Imputar Donaciones, Exceptuar Educación, luego Libre/restaurar.",
    commonError: "Creer que toda transferencia en vida fue regalo invisible para el cálculo.",
  },
  {
    id: "acervos-calculo",
    title: "Cálculo de acervos",
    theme: "La masa hereditaria entra bruta y sale jurídicamente maquillada.",
    articles: ["959", "1185", "1186", "1187", "1188"],
    concepts: ["acervo bruto", "ilíquido", "líquido", "colación al valor", "exceso", "inoficiosa donación"],
    summary:
      "El acervo bruto separa bienes ajenos; el ilíquido descuenta bajas generales; el líquido sirve de base salvo agregaciones imaginarias. El primer acervo agrega donaciones a legitimarios; el segundo controla excesos a terceros.",
    mnemonic: "SBDAE: Separar, Bajar, Donar, Agregar, Exceso.",
    commonError: "Calcular la cuarta de libre disposición sobre una masa que todavía trae bienes ajenos pegados.",
  },
  {
    id: "acciones-protectoras",
    title: "Acciones protectoras de la herencia",
    theme: "Cuando la familia falla, el Código abre arsenal.",
    articles: ["1187", "1216", "1264", "1269", "1317", "1344"],
    concepts: ["petición de herencia", "reforma de testamento", "inoficiosa donación", "partición", "reivindicatoria"],
    summary:
      "La acción correcta depende del daño: calidad hereditaria, legítimas vulneradas, donaciones excesivas, indivisión o dominio singular.",
    mnemonic: "PRIP: Petición, Reforma, Inoficiosa, Partición.",
    commonError: "Demandar reforma cuando el problema es que un heredero aparente ocupa toda la herencia.",
  },
  {
    id: "estructura-examen",
    title: "Estructuras de examen oral",
    theme: "Hablar civilmente antes de que el pánico tome posesión efectiva.",
    articles: ["588", "951", "955", "956", "957", "984", "988", "1184"],
    concepts: ["concepto", "norma", "clasificación", "requisitos", "efectos", "caso"],
    summary:
      "Las respuestas de grado se memorizan por estructura: concepto, norma, naturaleza, requisitos, efectos, distinciones y aplicación al caso.",
    mnemonic: "CNNREC: Concepto, Norma, Naturaleza, Requisitos, Efectos, Caso.",
    commonError: "Recitar artículos sin ordenar la respuesta. Eso es lluvia jurídica, no argumento.",
  },
];

const frames = [
  f("drh-1", "derecho-real-herencia", "Derecho real de herencia", "577/951", "Derecho real que recae sobre la universalidad jurídica del patrimonio transmisible o una cuota.", "El heredero de 1/3 no tiene dominio singular sobre la casa antes de partición.", "Confundir herencia con dominio sobre cada bien."),
  f("drh-2", "derecho-real-herencia", "Universalidad jurídica", "951", "Continente patrimonial distinto de las cosas singulares que lo integran.", "La herencia contiene activo y pasivo transmisible.", "Mirar solo el activo y olvidar deudas."),
  f("drh-3", "derecho-real-herencia", "Protección del derecho real de herencia", "1264", "Se protege especialmente por la acción de petición de herencia.", "Heredero verdadero reclama contra heredero aparente.", "Usar siempre reivindicatoria aunque se discuta calidad hereditaria."),
  f("drh-4", "derecho-real-herencia", "Vida efímera de la herencia", "1317/1344", "El derecho real de herencia vive mientras hay comunidad hereditaria; la partición lo proyecta a dominio singular.", "Tras adjudicación, art. 1344 declara adquisición directa desde el causante.", "Decir que la partición vende bienes entre comuneros."),
  f("cs-1", "clases-sucesion", "Sucesión testamentaria", "952", "Se sucede en virtud de testamento.", "El causante designa asignatarios, respetando asignaciones forzosas.", "Pensar que testamento permite borrar legítimas."),
  f("cs-2", "clases-sucesion", "Sucesión intestada", "952", "Se sucede en virtud de la ley por falta o insuficiencia de testamento.", "La ley llama por órdenes sucesorios.", "Creer que intestada significa sin reglas."),
  f("cs-3", "clases-sucesion", "Sucesión mixta", "952/996", "Una parte se rige por testamento y otra por ley.", "El testamento solo dispone de algunos bienes y el remanente va abintestato.", "Cumplir el testamento antes de enterar legítimas y mejoras."),
  f("hl-1", "herederos-legatarios", "Asignación por causa de muerte", "953", "Señalamiento legal o testamentario de lo que corresponde en la sucesión.", "La ley asigna a hijos; el testamento asigna legado a un tercero.", "Confundir asignación con adjudicación particional."),
  f("hl-2", "herederos-legatarios", "Asignatario", "953", "Persona a quien se hace una asignación.", "Heredero y legatario son especies de asignatario.", "Usar asignatario como sinónimo solo de heredero."),
  f("hl-3", "herederos-legatarios", "Heredero universal", "1097/1098", "Heredero llamado sin designación de cuota.", "Dejo mis bienes a Ana y Bruno: ambos son universales.", "Creer que universal significa necesariamente único."),
  f("hl-4", "herederos-legatarios", "Heredero de cuota", "951/1097", "Heredero llamado con cuota determinada.", "Dejo 1/3 a Ana y 2/3 a Bruno.", "Aplicarle acrecimiento como si no hubiera cuota fijada."),
  f("hl-5", "herederos-legatarios", "Heredero de remanente", "1099/1100", "Llamado a lo que queda después de cubrir disposiciones.", "Lego el auto a C y dejo el resto a D.", "Olvidar que puede ser testamentario o abintestato."),
  f("hl-6", "herederos-legatarios", "Representación del causante por herederos", "1097", "El heredero representa al causante y sucede en derechos y obligaciones transmisibles.", "Soporta deudas hereditarias según cuota, salvo beneficio.", "Atribuir esta representación al legatario."),
  f("hl-7", "herederos-legatarios", "Legatario de especie", "951/954", "Sucede en especie o cuerpo cierto y adquiere dominio desde la muerte.", "Lego tal reloj o tal inmueble.", "Exigir tradición como si fuera legado de género."),
  f("hl-8", "herederos-legatarios", "Legatario de género", "951/954", "Tiene derecho personal para exigir entrega de bienes de género.", "Lego 100 acciones de una serie determinada.", "Darle frutos desde la muerte sin entrega ni mora."),
  f("hl-9", "herederos-legatarios", "Legatario no representa al causante", "1104", "No tiene más derechos o cargas que las expresamente conferidas o impuestas.", "No responde como heredero universal.", "Tratarlo como continuador patrimonial pleno."),
  f("hl-10", "herederos-legatarios", "Responsabilidad subsidiaria del legatario", "1362/1363", "Puede contribuir a deudas hereditarias si al abrirse la sucesión no hubo lo bastante para pagarlas; la acción de los acreedores en su contra es subsidiaria de la que tienen contra los herederos.", "Acreedor va contra legatario solo subsidiariamente.", "Cobrar primero al legatario por ansiedad procesal."),
  f("ph-1", "posesion-herencia", "Posesión legal de la herencia", "722", "Se confiere al heredero al deferirse la herencia, aunque lo ignore.", "Heredero ausente tiene posesión legal desde la delación.", "Confundirla con posesión material."),
  f("ph-2", "posesion-herencia", "Posesión efectiva", "688", "Reconocimiento administrativo o judicial de la calidad hereditaria para efectos prácticos.", "Permite inscripciones hereditarias.", "Creer que sin ella no hubo adquisición hereditaria."),
  f("ph-3", "posesion-herencia", "Herencia yacente", "1240", "Herencia declarada yacente si pasan 15 días sin aceptación ni albacea con tenencia de bienes.", "Se nombra curador para dar cara visible a la sucesión.", "Declararla aunque exista albacea con tenencia que aceptó."),
  f("dc-1", "derechos-concurrentes", "Representación", "984", "Ficción legal por la cual descendientes ocupan lugar, grado y derechos del representado.", "Nieto representa al hijo premuerto.", "Creer que el representante hereda al representado."),
  f("dc-2", "derechos-concurrentes", "Por cabeza", "985", "División directa entre quienes suceden personalmente.", "Tres hijos vivos: cada uno por cabeza.", "Aplicarla a nietos que representan una rama."),
  f("dc-3", "derechos-concurrentes", "Por estirpe", "985", "División por rama cuando opera representación.", "Dos nietos de hijo premuerto comparten la cuota de esa rama.", "Dar a cada nieto igual que a cada hijo vivo."),
  f("dc-4", "derechos-concurrentes", "Línea de representación", "984/986", "Opera en línea descendente y en los casos legalmente admitidos.", "Nietos pueden representar; ascendientes no representan.", "Hacer representar a un padre por un abuelo."),
  f("dc-5", "derechos-concurrentes", "Representación por repudio", "984", "También puede operar cuando el llamado no quiere suceder.", "Hijo repudia y sus descendientes ocupan su lugar si procede.", "Creer que repudio siempre extingue toda rama."),
  f("dc-6", "derechos-concurrentes", "Legitimarios y representación", "1183", "Los legitimarios concurren, son excluidos y representados según reglas intestadas.", "Nieto representa al padre en legítimas.", "Pensar que representación es solo intestada sin excepciones."),
  f("dc-7", "derechos-concurrentes", "Transmisión", "957", "Derecho del asignatario que muere sin aceptar o repudiar pasa a sus herederos.", "Hijo sobrevive al causante y muere luego.", "Usarla cuando el hijo premurió."),
  f("oc-1", "ordenes-completos", "Primer orden", "988", "Descendientes, personalmente o representados, excluyen a otros salvo cónyuge o conviviente civil.", "Hijos con cónyuge; hermanos fuera.", "Llamar ascendientes pese a hijos vivos."),
  f("oc-2", "ordenes-completos", "Segundo orden", "989", "Sin posteridad, concurren cónyuge (o conviviente civil) y ascendientes de grado más próximo.", "Cónyuge 2/3 y ascendientes 1/3.", "Meter hermanos junto a padres."),
  f("oc-3", "ordenes-completos", "Tercer orden", "990", "A falta de descendientes, ascendientes, cónyuge y conviviente civil, suceden hermanos.", "Hermanos carnales y medios hermanos con reglas de proporción.", "Olvidar que hermanos carnales llevan doble que medios."),
  f("oc-4", "ordenes-completos", "Cuarto orden", "992", "Colaterales de grado más próximo excluyen a los de grado posterior.", "Tío de tercer grado excluye primo más lejano.", "Mezclar todos los colaterales en una bolsa triste."),
  f("oc-5", "ordenes-completos", "Quinto orden", "995", "A falta de otros herederos abintestato, sucede el Fisco.", "Herencia vacante termina en el Estado.", "Llamarlo antes de revisar colaterales."),
  f("oc-6", "ordenes-completos", "Exclusión del cónyuge culpable", "994", "El cónyuge que por su culpa dio motivo a la separación judicial no tiene parte alguna en la herencia abintestato.", "Falta para efectos del orden sucesorio.", "Tratar al cónyuge sancionado como concurrente normal."),
  f("cc-1", "calculo-conyuge", "Cónyuge con un hijo", "988", "El cónyuge recibe la misma porción que el hijo.", "Herencia 100: cónyuge 50, hijo 50.", "Darle doble aunque hay un solo hijo."),
  f("cc-2", "calculo-conyuge", "Cónyuge con varios hijos", "988", "El cónyuge recibe el doble de lo que corresponde a cada hijo.", "Cónyuge y tres hijos: se divide en cinco unidades.", "Dividir por cuatro personas iguales."),
  f("cc-3", "calculo-conyuge", "Cuarta mínima del cónyuge", "988", "Con varios hijos, el cónyuge nunca baja de una cuarta parte.", "Con ocho hijos: cónyuge 1/4 y el resto se divide entre hijos.", "Aplicar doble unidad aun cuando baja de 1/4."),
  f("cc-4", "calculo-conyuge", "Cónyuge en segundo orden", "989", "Con ascendientes, el cónyuge lleva dos tercios y ascendientes un tercio.", "Sin hijos: cónyuge 2/3, padres 1/3.", "Dar mitad y mitad."),
  f("mp-1", "mejoras-pactos", "Mejoreros", "1195", "Descendientes, ascendientes, cónyuge y conviviente civil pueden recibir cuarta de mejoras.", "Testador mejora a un nieto aunque concurra un hijo.", "Creer que solo legitimarios concretos pueden ser mejoreros."),
  f("mp-2", "mejoras-pactos", "Mejoras no se presumen", "1198", "Donaciones o legados a legitimario se imputan a legítima salvo expresión de mejora.", "Si no dice mejora, se imputa a legítima.", "Convertir todo beneficio adicional en mejora tácita."),
  f("mp-3", "mejoras-pactos", "Pacto de no mejorar", "1204/1463", "Pacto solemne excepcional por escritura pública para no disponer de la cuarta de mejoras.", "Causante promete no mejorar para que acrezca legalmente.", "Pactar designación directa de mejorero futuro."),
  f("im-1", "imputaciones", "Regla general de imputación", "1198", "Donaciones y legados al legitimario se imputan a su legítima salvo voluntad contraria válida.", "Legado a hijo reduce lo que recibe por legítima.", "Sumarlo siempre como extra."),
  f("im-2", "imputaciones", "Gastos de educación", "1198", "No se imputan a legítimas, mejoras ni libre disposición.", "Pago de universidad no entra al cálculo.", "Perseguir cada mensualidad como anticipo hereditario."),
  f("im-3", "imputaciones", "Deudas del legitimario", "1203", "Desembolsos para pagar deudas de un legitimario descendiente se imputan a su legítima, pero solo en cuanto hayan sido útiles para extinguirlas.", "Padre paga deuda de hijo y se extingue.", "Imputar pagos que no extinguieron deuda."),
  f("im-4", "imputaciones", "Donaciones al representado", "1200/1202", "Se imputan a las legítimas de quienes lo representan cuando procede.", "Nietos representan al padre y cargan donaciones recibidas por el padre.", "Borrar la donación porque el representado falta."),
  f("im-5", "imputaciones", "Frutos de cosas donadas", "1205", "No se imputan frutos durante vida del donante si la cosa fue entregada.", "Inmueble donado produce rentas al donatario.", "Meter frutos en el acervo por reflejo contable."),
  f("im-6", "imputaciones", "Exceso sobre legítima", "1193", "Si lo dado en razón de legítimas excede la mitad del acervo imaginario, el exceso se imputa a la cuarta de mejoras.", "Las donaciones a los hijos desbordan la mitad legitimaria y el exceso aterriza en mejoras.", "Saltar directo a libre disposición."),
  f("im-7", "imputaciones", "Exceso sobre mejoras", "1194", "Si también supera mejoras, se carga a la parte de libre disposición.", "Donación enorme invade libre.", "Pedir restitución antes de agotar cuotas."),
  f("im-8", "imputaciones", "Saldo del donatario de especies", "1206", "Si le cabe definitivamente menos que el valor de las especies imputables a su legítima o mejora, el donatario paga el saldo en dinero o restituyendo especies, a su arbitrio.", "Donación desproporcionada: paga el saldo en dinero o devuelve especies, él elige.", "Dejarlo conservar todo sin pagar el saldo porque ya lo recibió."),
  f("ac-1", "acervos-calculo", "Acervo bruto", "1341/959", "Masa inicial que puede confundir bienes del causante con bienes ajenos.", "Sociedad conyugal o copropiedad mezclada.", "Usarlo como base final."),
  f("ac-2", "acervos-calculo", "Acervo ilíquido", "959", "Patrimonio del difunto separado de bienes ajenos, antes de bajas generales.", "Se deduce lo del cónyuge por sociedad conyugal.", "Restar deudas antes de separar bienes de terceros."),
  f("ac-3", "acervos-calculo", "Acervo líquido", "959", "Acervo ilíquido menos bajas generales.", "Base ordinaria para repartir.", "Olvidar costas, deudas hereditarias e impuestos aplicables."),
  f("ac-4", "acervos-calculo", "Primer acervo imaginario", "1185", "Agrega al líquido donaciones a legitimarios en razón de legítimas o mejoras.", "Donación a hijo se colaciona al valor.", "Acumular en especie físicamente."),
  f("ac-5", "acervos-calculo", "Colación al valor", "1185/1188", "Se agrega valor actualizado prudencialmente, no la cosa misma.", "Departamento donado entra como valor neto.", "Pedir que devuelva el inmueble siempre."),
  f("ac-6", "acervos-calculo", "Liberalidades no acumulables", "1188/1198", "Regalos moderados y presentes de matrimonio no se acumulan.", "Reloj por titulación no entra si es moderado.", "Acumular regalos de costumbre con furia fiscal."),
  f("ac-7", "acervos-calculo", "Segundo acervo imaginario", "1186", "Controla donaciones irrevocables excesivas a terceros.", "Donación a extraño que excede cuarta parte de suma donaciones+acervo.", "Aplicarlo a toda donación sin medir exceso."),
  f("ac-8", "acervos-calculo", "Exceso del segundo acervo", "1186", "Hay exceso si donaciones exceden la cuarta parte de donaciones más acervo.", "Base 100 + donación 60 = 160; cuarta 40; exceso 20.", "Comparar donación contra 1/4 del acervo solo."),
  f("ac-9", "acervos-calculo", "Acción de inoficiosa donación", "1187", "Protege legítimas o mejoras frente a donaciones excesivas.", "Donaciones a terceros menoscaban mitad legitimaria.", "Demandar reforma de testamento contra donatario."),
  f("ap-1", "acciones-protectoras", "Petición de herencia", "1264/1269", "Acción del heredero verdadero contra quien ocupa la herencia como heredero.", "Heredero aparente obtuvo posesión efectiva.", "Usarla para rebajar legado inoficioso."),
  f("ap-2", "acciones-protectoras", "Reforma de testamento", "1216", "Acción de legitimarios para proteger legítimas vulneradas por testamento.", "Testamento deja todo a tercero.", "Confundirla con nulidad total."),
  f("ap-3", "acciones-protectoras", "Inoficiosa donación", "1187", "Acción personal contra donatarios por donaciones excesivas.", "Se comienza por donaciones más recientes.", "Dirigirla contra cualquier poseedor no donatario."),
  f("ap-4", "acciones-protectoras", "Partición", "1317", "Acción para poner fin a la comunidad hereditaria.", "Coheredero pide división.", "Creer que prescribe como reforma."),
  f("ee-1", "estructura-examen", "Estructura CNNREC", "método", "Concepto, Norma, Naturaleza, Requisitos, Efectos y Caso.", "Para representar: defina, cite, clasifique, requisitos, efectos, ejemplo.", "Partir por el caso sin norma ni concepto."),
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
    prompt: `Artículo o bloque clave para: ${item.concept}`,
    options: optionSet(item.article, index),
    answer: item.article,
    article: item.article,
    concept: item.concept,
    feedback: `Correcto. ${item.concept}: ${item.definition} Error frecuente: ${item.error}`,
  })),
  qa("adv-q-1", "derecho-real-herencia", "El derecho real de herencia recae sobre:", ["Universalidad jurídica o cuota", "Solo inmuebles hereditarios", "Solo legados de especie", "Solo bienes inscritos"], "Universalidad jurídica o cuota", "577/951", "Derecho real de herencia", "Correcto. La herencia es universalidad jurídica, no inventario sentimental de cosas sueltas."),
  qa("adv-q-2", "herederos-legatarios", "La etiqueta usada por el testador para llamar heredero o legatario:", ["No decide: decide el objeto", "Decide siempre", "Solo importa si hay notario", "Decide si está en mayúsculas"], "No decide: decide el objeto", "1097/1104", "Asignatarios", "Correcto. El objeto manda. El testador puede equivocarse con solemnidad."),
  qa("adv-q-3", "herederos-legatarios", "El legatario de género adquiere:", ["Derecho personal", "Dominio inmediato de especie", "Derecho real de herencia", "Posesión efectiva"], "Derecho personal", "951/954", "Legado de género", "Correcto. Tiene crédito para exigir entrega; no dominio instantáneo."),
  qa("adv-q-4", "herederos-legatarios", "El legatario de especie (legado puro) adquiere dominio:", ["Desde la muerte del causante", "Desde la tradición", "Desde posesión efectiva", "Desde partición"], "Desde la muerte del causante", "951/956", "Legado de especie", "Correcto. La especie pasa ipso iure; el género espera entrega."),
  qa("adv-q-5", "derechos-concurrentes", "Cuando hay representación, la división es:", ["Por estirpe", "Por cabeza siempre", "Por orden alfabético", "Por cuotas testamentarias"], "Por estirpe", "985", "Representación", "Correcto. La rama ocupa el lugar; no se multiplica por dramatismo."),
  qa("adv-q-6", "derechos-concurrentes", "La representación opera:", ["En línea descendente", "En línea ascendente", "Solo entre cónyuges", "Solo con Fisco"], "En línea descendente", "984/986", "Representación", "Correcto. Ascendientes no representan. El árbol no crece hacia atrás."),
  qa("adv-q-7", "calculo-conyuge", "Cónyuge + tres hijos: la herencia se divide en:", ["Cinco unidades", "Cuatro unidades iguales", "Tres unidades", "Dos mitades"], "Cinco unidades", "988", "Cónyuge con hijos", "Correcto. Cónyuge vale dos unidades; cada hijo una."),
  qa("adv-q-8", "calculo-conyuge", "Cónyuge + ocho hijos: el cónyuge recibe mínimo:", ["1/4", "1/9", "2/10", "1/2"], "1/4", "988", "Cuarta mínima", "Correcto. El cónyuge no baja de cuarta parte."),
  qa("adv-q-9", "ordenes-completos", "Sin descendientes, con cónyuge y padres, aplica:", ["Segundo orden", "Primer orden", "Tercer orden", "Fisco"], "Segundo orden", "989", "Órdenes", "Correcto. Ascendientes y cónyuge: segundo orden."),
  qa("adv-q-10", "ordenes-completos", "En tercer orden, el hermano carnal lleva respecto del medio hermano:", ["Doble", "Igual", "Triple", "Nada"], "Doble", "990", "Hermanos", "Correcto. Carnal doble porción; el medio hermano no se imprime igual."),
  qa("adv-q-11", "acervos-calculo", "El acervo líquido se obtiene al:", ["Deducir bajas generales del ilíquido", "Sumar donaciones a terceros", "Aplicar representación", "Restar legítimas"], "Deducir bajas generales del ilíquido", "959", "Acervo líquido", "Correcto. Primero limpiar, después calcular."),
  qa("adv-q-12", "acervos-calculo", "Donación a legitimario hecha en razón de legítima o mejora:", ["Primer acervo imaginario", "Segundo acervo imaginario", "Herencia yacente", "Partición"], "Primer acervo imaginario", "1185", "Primer acervo", "Correcto. Colación al valor: el pasado entra en la planilla."),
  qa("adv-q-13", "acervos-calculo", "Donación excesiva a tercero:", ["Segundo acervo imaginario", "Primer acervo imaginario", "Legítima efectiva", "Posesión legal"], "Segundo acervo imaginario", "1186", "Segundo acervo", "Correcto. Se mide contra cuarta parte de acervo + donaciones."),
  qa("adv-q-14", "acervos-calculo", "Acervo imaginario 100, con legitimarios al donar; donación a tercero 60. Exceso según 1186:", ["20", "40", "60", "10"], "20", "1186", "Exceso", "Correcto. 100+60=160; cuarta=40; exceso=20."),
  qa("adv-q-15", "acciones-protectoras", "Donaciones excesivas que menoscaban legítimas o mejoras:", ["Inoficiosa donación", "Petición de herencia", "Interrogación judicial", "Herencia yacente"], "Inoficiosa donación", "1187", "Acciones", "Correcto. No se reforma testamento contra una donación; se persigue la inoficiosa."),
  qa("adv-q-16", "imputaciones", "Gastos de educación de un descendiente:", ["No se imputan", "Siempre se imputan a legítima", "Se imputan a mejora", "Crean transmisión"], "No se imputan", "1198", "Imputaciones", "Correcto. La universidad ya fue suficiente condena."),
  qa("adv-q-17", "imputaciones", "Si imputación excede legítima, primero invade:", ["Cuarta de mejoras", "Libre disposición", "Fisco", "Petición de herencia"], "Cuarta de mejoras", "1193", "Exceso imputable", "Correcto. El exceso entra a mejoras antes de arruinar la libre."),
  qa("adv-q-18", "mejoras-pactos", "La cuarta de mejoras puede favorecer a:", ["Descendientes, ascendientes y cónyuge", "Cualquier tercero", "Solo hijos", "Solo legatarios"], "Descendientes, ascendientes y cónyuge", "1195", "Mejoreros", "Correcto. Mejora no es libre disposición con chaqueta neón."),
  qa("adv-q-19", "mejoras-pactos", "El pacto de no mejorar es:", ["Excepcional y solemne", "Libre y verbal", "Prohibido siempre", "Una partición anticipada"], "Excepcional y solemne", "1204/1463", "Pacto de no mejorar", "Correcto. Escritura pública o nada; el futuro sucesorio no se toca con servilleta."),
  qa("adv-q-20", "posesion-herencia", "Herencia yacente requiere, entre otros:", ["15 días sin aceptación", "4 años sin partición", "Un testamento cerrado", "Un legado de género"], "15 días sin aceptación", "1240", "Herencia yacente", "Correcto. Pasan 15 días y la herencia necesita curador, no playlist triste."),
  qa("adv-q-21", "acciones-protectoras", "Acción imprescriptible para terminar comunidad:", ["Partición", "Reforma", "Inoficiosa", "Petición"], "Partición", "1317", "Partición", "Correcto. La comunidad hereditaria no es cadena perpetua."),
  qa("adv-q-22", "clases-sucesion", "En sucesión mixta, según art. 996, primero se:", ["Cumplen disposiciones testamentarias respetando legítimas y mejoras", "Aplica siempre intestada completa", "Entrega todo al cónyuge", "Abre segundo acervo"], "Cumplen disposiciones testamentarias respetando legítimas y mejoras", "996", "Sucesión mixta", "Correcto. Testamento primero, pero asignaciones forzosas con escolta."),
];

export const advancedMnemonicChallenges = [
  mn("adv-m-1", "derecho-real-herencia", "R U D P _", "E", "Derecho real de herencia", "Real, Universal, Distinto del dominio, Protegido por petición, Efímero."),
  mn("adv-m-2", "clases-sucesion", "T I _", "M", "Clases de sucesión", "Testamentaria, Intestada, Mixta."),
  mn("adv-m-3", "herederos-legatarios", "U C R / E _", "G", "Asignatarios", "Universal, Cuota, Remanente / Especie, Género."),
  mn("adv-m-4", "derechos-concurrentes", "R T A _", "S", "Derechos concurrentes", "Representación, Transmisión, Acrecimiento, Sustitución."),
  mn("adv-m-5", "ordenes-completos", "D A H C _", "F", "Órdenes", "Descendientes, Ascendientes-cónyuge, Hermanos, Colaterales, Fisco."),
  mn("adv-m-6", "calculo-conyuge", "1=igual / 2+=doble / 7+=_", "CUARTA", "Cónyuge con hijos", "Con siete o más hijos opera la cuarta mínima."),
  mn("adv-m-7", "acervos-calculo", "S B D A _", "E", "Cálculo de acervos", "Separar, Bajar, Donar, Agregar, Exceso."),
  mn("adv-m-8", "imputaciones", "I D E _", "L", "Imputaciones", "Imputar Donaciones, Exceptuar Educación, exceso a mejoras y luego Libre/restaurar (arts. 1193-1194)."),
  mn("adv-m-9", "acciones-protectoras", "P R I _", "P", "Acciones", "Petición, Reforma, Inoficiosa, Partición."),
  mn("adv-m-10", "estructura-examen", "C N N R E _", "C", "Oral", "Concepto, Norma, Naturaleza, Requisitos, Efectos, Caso."),
];

export const advancedOralQuestions = [
  oral("adv-o-1", "derecho-real-herencia", "Explique el derecho real de herencia y su diferencia con el dominio.", ["Concepto: derecho real sobre universalidad jurídica o cuota.", "Norma: arts. 577 y 951; protección por petición de herencia.", "Doctrina: objeto distinto del dominio, que recae en bienes singulares.", "Caso: antes de partición el heredero tiene cuota hereditaria, no dominio exclusivo sobre la casa."], "Buena ruta: universalidad primero, dominio singular después. La partición no es decorado."),
  oral("adv-o-2", "herederos-legatarios", "Distinga heredero universal, heredero de cuota y heredero de remanente.", ["Concepto: todos son asignatarios a título universal, pero se diferencian por forma de llamamiento.", "Norma: arts. 951, 1097, 1098, 1099 y 1100.", "Doctrina: universal sin cuota; de cuota con proporción; remanente recibe lo que queda.", "Caso: dejo 1/3 a A y resto a B; B es remanente y puede funcionar como de cuota."], "La palabra universal no significa único. El testador puede repartir el caos con distintas etiquetas."),
  oral("adv-o-3", "herederos-legatarios", "Distinga legatario de especie y de género.", ["Concepto: especie es cuerpo cierto; género es indeterminado dentro de género.", "Norma: arts. 951, 954 y 1104.", "Doctrina: especie adquiere dominio desde muerte; género tiene crédito y adquiere por entrega.", "Caso: 'mi reloj' versus '100 acciones'."], "Esta distinción evita convertir créditos en fantasmas reales."),
  oral("adv-o-4", "posesion-herencia", "Explique posesión legal, posesión efectiva y herencia yacente.", ["Concepto: legal nace por delación; efectiva reconoce calidad; yacente da administración visible.", "Norma: arts. 722 y 1240.", "Doctrina: adquisición hereditaria no depende del decreto de posesión efectiva.", "Caso: pasan 15 días sin aceptación ni albacea; se pide curador de herencia yacente."], "No confundas adquisición hereditaria con trámite. La burocracia llega después con abrigo mojado."),
  oral("adv-o-5", "ordenes-completos", "Desarrolle los cinco órdenes sucesorios intestados.", ["Concepto: grupos llamados preferentemente que se excluyen entre si.", "Norma: arts. 988, 989, 990, 992 y 995.", "Doctrina: el heredero determinante activa el orden y excluye posteriores.", "Caso: si hay hijos, hermanos y colaterales esperan afuera."], "Órdenes completos: descendientes, ascendientes-cónyuge, hermanos, colaterales, Fisco."),
  oral("adv-o-6", "calculo-conyuge", "Explique el cálculo del cónyuge sobreviviente con hijos.", ["Concepto: concurre en primer orden con descendientes.", "Norma: art. 988.", "Doctrina: con un hijo igual; con varios doble de cada hijo; mínimo cuarta parte.", "Caso: con tres hijos divide en cinco unidades; con ocho, cónyuge recibe 1/4."], "El cónyuge se cuenta con calculadora, no con intuición familiar."),
  oral("adv-o-7", "acervos-calculo", "Explique la formación de acervo bruto, ilíquido y líquido.", ["Concepto: son etapas de depuración de la masa hereditaria.", "Norma: art. 959 y doctrina de acervos.", "Doctrina: bruto incluye bienes confundidos; ilíquido separa ajenos; líquido descuenta bajas.", "Caso: sociedad conyugal exige separar antes de calcular legítimas."], "Primero separa, luego deduce. Repartir bruto es sabotaje con solemnidad."),
  oral("adv-o-8", "acervos-calculo", "Explique primer y segundo acervo imaginario.", ["Concepto: agregaciones contables para proteger legítimas y mejoras.", "Norma: arts. 1185 y 1186.", "Doctrina: primero donaciones a legitimarios; segundo solo el exceso de las donaciones a terceros sobre la cuarta parte de acervo más donaciones.", "Caso: donación a hijo va al primero; donación excesiva a amigo va al segundo."], "Imaginario no significa falso: significa que el Código recuerda lo donado."),
  oral("adv-o-9", "imputaciones", "Explique imputaciones a legítimas y mejoras.", ["Concepto: descuentos de donaciones, legados o pagos recibidos por legitimario.", "Norma: arts. 1198, 1202, 1203, 1205 y 1206.", "Doctrina: regla evita desigualdad; mejoras requieren expresión.", "Caso: legado al hijo se imputa salvo que conste mejora."], "Imputar es ajustar cuentas, no arruinar cumpleaños."),
  oral("adv-o-10", "acciones-protectoras", "Distinga petición de herencia, reforma e inoficiosa donación.", ["Concepto: cada acción protege un interés distinto.", "Norma: arts. 1264, 1216 y 1187.", "Doctrina: petición reclama calidad; reforma protege legítimas contra testamento; inoficiosa ataca donaciones excesivas.", "Caso: heredero aparente, testamento lesivo o donatario excesivo."], "Elegir acción correcta es medio examen ganado."),
];

export const advancedDetectiveCases = [
  caseFile("derecho-real-archivo", "El dominio que nunca llegó", "Derecho real de herencia", 3, "derecho-real-herencia", "Tres herederos se pelean por vender 'su' departamento antes de partición. Uno jura que su tercio hereditario equivale a la pieza con mejor vista. El Conservador apaga lentamente la pantalla.", ["Derecho real de herencia sobre universalidad", "Dominio singular solo tras partición", "Petición de herencia protege calidad"], "Distinguir derecho real de herencia y dominio singular antes de partición.", [
    choice("Sostener que cada heredero tiene dominio exclusivo sobre una habitación.", false, "951/1344", "Derecho real", "Incorrecto. Antes de partición hay cuota en la universalidad, no lotería inmobiliaria."),
    choice("Afirmar que tienen derecho real de herencia sobre universalidad o cuota, no dominio singular exclusivo.", true, "577/951", "Derecho real de herencia", "Correcto. La herencia es universalidad jurídica; el dominio singular se consolida por adjudicación."),
    choice("Pedir reforma de testamento por existir comunidad.", false, "1216", "Reforma", "Incorrecto. No hay legítima vulnerada; hay confusión entre herencia y dominio."),
  ]),
  caseFile("legado-genero", "Las cien acciones fantasma", "Legatario de género", 2, "herederos-legatarios", "El testamento lega a Vera '100 acciones serie N'. Los herederos dicen que Vera ya es dueña desde la muerte y debe soportar perdidas de mercado. Vera solo quiere que alguien entregue algo antes del colapso bursátil.", ["Legado de género", "Derecho personal", "Dominio por entrega"], "Distinguir legado de género y especie.", [
    choice("Vera adquiere dominio desde la muerte como legataria de especie.", false, "954", "Legado", "Incorrecto. Es género: tiene crédito para exigir entrega."),
    choice("Vera tiene derecho personal contra obligados al pago del legado; adquiere por entrega.", true, "951/1115", "Legado de género", "Correcto. El género no se vuelve especie por ansiedad financiera."),
    choice("Vera representa al causante en deudas hereditarias.", false, "1104", "Legatario", "Incorrecto. El legatario no representa al testador."),
  ]),
  caseFile("conyuge-ocho", "Ocho hijos y una viuda bajo neón", "Cuarta mínima del cónyuge", 4, "calculo-conyuge", "Causante deja cónyuge y ocho hijos. La familia propone dividir en diez unidades porque 'el cónyuge vale dos'. La viuda mira el art. 988 como quien mira una navaja elegante.", ["Cónyuge con varios hijos", "Doble porción", "Cuarta mínima"], "Aplicar cuarta mínima cuando el doble baja de 1/4.", [
    choice("Dividir en diez unidades: cónyuge 2/10 e hijos 1/10.", false, "988", "Cónyuge", "Incorrecto. 2/10 es menor que 1/4; opera garantía mínima."),
    choice("Asignar al cónyuge 1/4 y dividir 3/4 entre los ocho hijos.", true, "988", "Cuarta mínima", "Correcto. La cuarta mínima salva a la viuda de la matemática hostil."),
    choice("Excluir al cónyuge por existir descendientes.", false, "988", "Órdenes", "Incorrecto. El cónyuge concurre con descendientes."),
  ]),
  caseFile("hermano-medio", "El medio hermano completo en expectativas", "Tercer orden", 3, "ordenes-completos", "No hay descendientes, ascendientes ni cónyuge. Concurren una hermana carnal y un medio hermano. El medio hermano exige igualdad absoluta porque trajo empanadas al velorio.", ["Tercer orden", "Hermano carnal doble", "Medio hermano simple"], "Aplicar proporcionalidad entre hermanos carnales y medios.", [
    choice("Dividir por partes iguales entre ambos.", false, "990", "Hermanos", "Incorrecto. El hermano carnal lleva doble porción que el medio hermano."),
    choice("Dar dos unidades a la hermana carnal y una unidad al medio hermano.", true, "990", "Tercer orden", "Correcto. La empanada no deroga el art. 990."),
    choice("Llamar al Fisco porque no hay hijos.", false, "995", "Fisco", "Incorrecto. Hay tercer orden antes del Fisco."),
  ]),
  caseFile("mixta-remanente", "El testamento incompleto", "Sucesión mixta", 4, "clases-sucesion", "El testamento lega una moto, deja 1/4 a una amiga y guarda silencio sobre el resto. Los hijos preguntan si el silencio se hereda o se archiva.", ["Art. 996", "Remanente abintestato", "Legítimas y mejoras primero"], "Resolver sucesión parte testada y parte intestada.", [
    choice("Cumplir disposiciones válidas y adjudicar remanente abintestato, respetando legítimas y mejoras.", true, "996", "Sucesión mixta", "Correcto. El silencio testamentario activa a la ley."),
    choice("Declarar intestada toda la sucesión por testamento incompleto.", false, "952/996", "Mixta", "Incorrecto. Lo válido se cumple; el resto va por ley."),
    choice("Entregar todo a la amiga por ser voluntad parcial.", false, "996", "Remanente", "Incorrecto. El testamento no coloniza lo que no dispuso."),
  ]),
  caseFile("yacente", "Quince días sin herederos", "Herencia yacente", 2, "posesion-herencia", "El causante muere, nadie acepta, el albacea designado nunca responde y los acreedores rondan el edificio. Han pasado dieciséis días. El archivo huele a curador.", ["15 días", "Sin aceptación", "Sin albacea con tenencia"], "Declarar herencia yacente.", [
    choice("Pedir declaración de herencia yacente y nombramiento de curador.", true, "1240", "Herencia yacente", "Correcto. La sucesión necesita cara visible antes de que los acreedores hagan teatro."),
    choice("Esperar cuatro años para reforma de testamento.", false, "1216", "Reforma", "Incorrecto. No hay testamento lesivo; hay herencia sin administrador."),
    choice("Dar posesión efectiva a acreedores.", false, "1240", "Posesión", "Incorrecto. Los acreedores no se convierten en herederos por impaciencia."),
  ]),
  caseFile("educacion", "La universidad del hijo caro", "Imputaciones", 3, "imputaciones", "La causante pagó la universidad de su hija. En la partición, el hermano quiere imputar hasta el café del casino a la legítima. El expediente bosteza con desprecio.", ["Gastos de educación", "No imputables", "Art. 1198"], "Identificar liberalidades no imputables.", [
    choice("Imputar gastos de educación a la legítima.", false, "1198", "Imputaciones", "Incorrecto. Los gastos de educación no se computan ni imputan."),
    choice("No imputar los gastos de educación a legítimas, mejoras ni libre disposición.", true, "1198", "Educación", "Correcto. La educación ya cobro suficiente en salud mental."),
    choice("Aplicar acción de inoficiosa donación por cada semestre.", false, "1187", "Inoficiosa", "Incorrecto. No todo desembolso en vida es donación inoficiosa."),
  ]),
  caseFile("donacion-tercero", "La donación al DJ testamentario", "Segundo acervo imaginario", 5, "acervos-calculo", "El causante donó 200 a un DJ que tocaba synth funerario. El acervo base es 100; el causante ya tenía legitimarios cuando donó y los sigue teniendo al morir. La mitad legitimaria empieza a parpadear en rojo.", ["Donación a tercero", "Exceso mayor", "Inoficiosa donación"], "Detectar segundo acervo e inoficiosa.", [
    choice("Formar segundo acervo y considerar acción de inoficiosa donación.", true, "1186/1187", "Segundo acervo", "Correcto. 100+200=300; cuarta 75; exceso 125. Esto ya perfora zonas protegidas."),
    choice("Ignorar la donación porque fue irrevocable.", false, "1186", "Acervos", "Incorrecto. Irrevocable no significa invisible."),
    choice("Formar solo primer acervo por ser donación a legitimario.", false, "1185", "Primer acervo", "Incorrecto. El DJ no es legitimario, aunque haya llorado con autotune."),
  ]),
  caseFile("transmision-apaga-acrecer", "La cuota que no acreció", "Transmisión vs acrecimiento", 5, "derechos-concurrentes", "El testamento deja una misma cuota a Ada y Bruno por iguales partes. Bruno sobrevive al causante, muere tres días después sin aceptar ni repudiar, y Ada exige que todo acrezca a su favor. La pantalla del archivo marca una sola palabra: cronología.", ["Bruno sobrevivió al causante", "No hay aceptación ni repudiación", "Ada invoca acrecimiento por falta del coasignatario"], "Aplicar transmisión y excluir el acrecimiento cuando el asignatario alcanzó a ser llamado.", [
    choice("Aplicar acrecimiento y entregar toda la cuota a Ada.", false, "1147/1153", "Acrecimiento", "Incorrecto. Bruno no falto antes de la delación; sobrevivió y transmitió su derecho."),
    choice("Reconocer transmisión a los herederos de Bruno; esta excluye el acrecimiento.", true, "957/1153", "Transmisión", "Correcto. Si Bruno muere después de la delación sin decidir, sus herederos reciben el derecho de aceptar o repudiar."),
    choice("Abrir representación porque Bruno murió.", false, "984", "Representación", "Incorrecto. La representación es propia de la sucesión intestada (y de las legítimas), no de una cuota testamentaria como esta; además, Bruno sobrevivió al causante y murió sin aceptar ni repudiar: eso es transmisión."),
  ]),
  caseFile("sustituto-contra-acrecedor", "El suplente del testador", "Sustitución vulgar", 5, "derechos-concurrentes", "La causante instituye a Noelia y Omar en una misma asignación. Agrega una línea seca: 'si Noelia falta, la reemplaza Pilar'. Noelia muere antes de la apertura. Omar prepara discurso de acrecimiento; Pilar trae el testamento subrayado.", ["Coasignatarios conjuntos", "Sustitución vulgar expresa", "Noelia falta antes de deferirse la asignación"], "Preferir la sustitución vulgar expresamente ordenada por el testador por sobre el acrecimiento.", [
    choice("Dar la porción de Noelia a Pilar como sustituta vulgar.", true, "1156/1163", "Sustitución", "Correcto. La sustitución llamada por el testador entra antes que el acrecimiento."),
    choice("Hacer acrecer la porción de Noelia a Omar.", false, "1147/1163", "Acrecimiento", "Incorrecto. El acrecimiento queda desplazado por la sustitución vulgar expresa."),
    choice("Aplicar transmisión a los herederos de Noelia.", false, "957", "Transmisión", "Incorrecto. Noelia falto antes de la delación; no alcanzó a transmitir derecho de aceptar o repudiar."),
  ]),
  caseFile("indigno-con-descendencia", "La rama del indigno", "Representación del indigno", 5, "derechos-concurrentes", "El hijo del causante fue declarado indigno por ocultar dolosamente el testamento. Sus dos hijos piden ocupar su lugar. La familia quiere castigar a toda la rama; el Código no compra castigos hereditarios por arrastre.", ["Indignidad declarada judicialmente", "Descendientes del indigno", "Solicitud de heredar por estirpe"], "Permitir la representación del indigno por sus descendientes cuando concurren los requisitos.", [
    choice("Excluir también a los nietos por la indignidad del padre.", false, "987", "Representación", "Incorrecto. La indignidad es personal; la ley admite representar al indigno."),
    choice("Permitir que los nietos representen al indigno y tomen por estirpe.", true, "984/985/987", "Representación", "Correcto. Se puede representar al indigno; la porción se toma por estirpe."),
    choice("Transmitir a los nietos la herencia con el mismo vicio por cinco años.", false, "977", "Indignidad", "Incorrecto. Esa regla mira la transmisión de lo que el indigno alcanzó a adquirir; aquí el caso se resuelve por representación sucesoria."),
  ]),
  caseFile("desheredamiento-generico", "La cláusula de ingratitud", "Desheredamiento defectuoso", 5, "mejoras-pactos", "El testamento dice: 'desheredo a mi hija por ingratitud, malas visitas y silencios ofensivos'. No identifica causal legal ni existe prueba judicial previa. Los demás herederos dicen que la frase suena convincente en neón.", ["Legitimaria privada de legítima", "Causal genérica no especificada", "No consta prueba judicial de la causal"], "Detectar que el desheredamiento exige causal legal específica y prueba en los términos del Código.", [
    choice("Mantener el desheredamiento porque el testador fue claro en su molestia.", false, "1207/1209", "Desheredamiento", "Incorrecto. La molestia no es causal autónoma y el desheredamiento debe ajustarse estrictamente a la ley."),
    choice("Impugnar el desheredamiento y pedir lo que corresponde por legítima.", true, "1207/1209/1217", "Reforma", "Correcto. Sin causal específica y prueba suficiente, la cláusula no vale para privar la legítima."),
    choice("Transformar la cláusula en indignidad automática.", false, "968/974", "Indignidad", "Incorrecto. La indignidad requiere causal y declaración judicial; no nace por redacción dramática."),
  ]),
  caseFile("legitimario-en-silencio", "El heredero borrado en tinta blanca", "Legitimario omitido", 5, "acciones-protectoras", "El causante instituye herederos a dos hijos y guarda silencio absoluto sobre una tercera hija. El archivo no muestra desheredamiento ni renuncia. La hija omitida mira el margen vacío como si fuera una demanda.", ["Legitimaria pasada en silencio", "No hay desheredamiento", "Testamento distribuye como si ella no existiera"], "Aplicar la regla del legitimario pasado en silencio y, si es necesario, accionar de reforma.", [
    choice("Entender a la hija omitida instituida en su legítima y ajustar el testamento.", true, "1218/1216", "Legitimario omitido", "Correcto. El silencio no borra al legitimario; se entiende instituido en su legítima."),
    choice("Declarar nulo todo el testamento por omitir a una hija.", false, "1218", "Reforma", "Incorrecto. La solución no es quemar todo el instrumento, sino integrar la legítima que corresponde."),
    choice("Excluirla por no haber sido nombrada expresamente.", false, "1182/1218", "Legitimarios", "Incorrecto. Los legitimarios no dependen de una aparición estética en el testamento."),
  ]),
  caseFile("mejoras-al-tercero", "La cuarta enviada fuera de la familia", "Cuarta de mejoras", 5, "mejoras-pactos", "Con descendientes vivos, la testadora asigna toda la cuarta de mejoras a su socio de laboratorio jurídico. Los hijos no discuten la libre disposición; discuten esa cuarta con alarma quirúrgica.", ["Existen descendientes", "Cuarta de mejoras asignada a un tercero", "Legitimarios piden corrección"], "Reformar la disposición de mejoras hecha a favor de quien no puede recibirla por esa vía.", [
    choice("Mantener la mejora porque el testador puede mejorar a quien quiera.", false, "1195", "Mejoras", "Incorrecto. La cuarta de mejoras solo puede distribuirse entre cónyuge, conviviente civil, descendientes y ascendientes."),
    choice("Reformar el testamento en esa parte y adjudicar la mejora conforme a derecho.", true, "1195/1220", "Acción de reforma", "Correcto. Si la cuarta de mejoras sale a un tercero, los legitimarios pueden pedir reforma."),
    choice("Atacar con inoficiosa donación porque es una disposición testamentaria.", false, "1187", "Inoficiosa", "Incorrecto. La inoficiosa mira donaciones; aquí el remedio central es reforma del testamento."),
  ]),
  caseFile("pacto-no-mejorar", "La promesa sellada", "Pacto de no mejorar", 5, "mejoras-pactos", "Por escritura pública, el causante prometió a su cónyuge no disponer de la cuarta de mejoras. Años después, su testamento reparte esa cuarta entre dos descendientes. La escritura vieja despierta como archivo ejecutable.", ["Promesa por escritura pública", "Favorecido era legitimario", "Testamento posterior infringe la promesa"], "Aplicar el pacto excepcional de no mejorar y calcular lo que los asignatarios deben enterar al favorecido.", [
    choice("Tener por nula toda la sucesión futura pactada.", false, "1204", "Pacto sucesorio", "Incorrecto. El pacto de no mejorar es una excepción precisa; no anula todo el testamento."),
    choice("Dar al favorecido lo que le habría válido cumplir la promesa, a prorrata del provecho de los asignatarios.", true, "1204", "Pacto de no mejorar", "Correcto. El art. 1204 permite esta promesa concreta y da acción contra los beneficiados por la infracción."),
    choice("Ignorar la escritura porque todos los pactos sucesorios son válidos solo si hay testamento.", false, "1204/1463", "Pactos", "Incorrecto. La regla es restrictiva: esta promesa específica vale; las otras estipulaciones sobre sucesión futura no."),
  ]),
  caseFile("alimentos-en-la-masa", "La pensión que sobrevivió", "Alimentos forzosos", 5, "acciones-protectoras", "El causante debía alimentos judicialmente fijados a su ascendiente. Al morir, los herederos anotan la deuda como 'asunto personal extinto'. El expediente conserva el comprobante como si tuviera pulso.", ["Alimentos debidos por ley", "Muerte del alimentante", "Herederos intentan borrar la carga"], "Reconocer que los alimentos legales debidos por el difunto gravan la masa hereditaria, con reglas de proporcionalidad para lo futuro.", [
    choice("Extinguir automáticamente toda obligación alimenticia por la muerte.", false, "1168/1170", "Alimentos", "Incorrecto. Los alimentos que el difunto debía por ley gravan la masa hereditaria."),
    choice("Cargar los alimentos legales a la masa, sin perjuicio de rebajar futuros desproporcionados.", true, "1168/1170", "Asignación forzosa", "Correcto. No todo muere con el causante; ciertas cargas entran al cálculo sucesorio."),
    choice("Imputar los alimentos a la cuarta de libre disposición siempre.", false, "1171", "Alimentos voluntarios", "Incorrecto. Esa ruta sirve para alimentos voluntarios o excesos; aquí se trata de alimentos debidos por ley."),
  ]),
  caseFile("legado-cosa-ajena", "El inmueble que no era suyo", "Legado de cosa ajena", 5, "herederos-legatarios", "El testador lega a su amigo un departamento que pertenece a una sociedad de terceros. El testamento no muestra que supiera que la cosa era ajena, ni el legatario es descendiente, ascendiente o cónyuge. El amigo ya eligió cortinas.", ["Legado de especie ajena", "No consta conocimiento del testador", "Legatario tercero sin regla protectora especial"], "Distinguir el legado nulo de cosa ajena de la obligación excepcional de adquirirla.", [
    choice("Declarar nulo el legado de especie ajena en este caso.", true, "1107", "Legado de cosa ajena", "Correcto. Sin conocimiento expresado ni legatario protegido, el legado de especie ajena no vale."),
    choice("Obligar siempre a los herederos a comprar el departamento.", false, "1106/1107", "Legado", "Incorrecto. Esa obligación necesita que el testador ordene adquirir la especie o que opere una excepción legal."),
    choice("Tratarlo como legado de género y entregar cualquier departamento mediano.", false, "1115", "Legado de género", "Incorrecto. Se legó una especie determinada; no se convierte en género por frustración inmobiliaria."),
  ]),
  caseFile("reloj-vendido", "El legado que no revivió", "Revocación tácita de legado", 5, "herederos-legatarios", "El testador lega su reloj mecánico a Iris. Dos meses después lo vende; la venta se anula y el reloj vuelve a su escritorio antes de morir. Iris sostiene que el legado resucitó porque el reloj también volvió.", ["Legado de especie", "Enajenación entre vivos posterior", "La especie vuelve al patrimonio del testador"], "Aplicar la revocación tácita del legado por enajenación de la especie, aunque la cosa vuelva.", [
    choice("Mantener el legado porque la cosa estaba otra vez en poder del testador al morir.", false, "1135", "Legado", "Incorrecto. La vuelta física de la cosa no revive el legado revocado por enajenación."),
    choice("Entender revocado el legado por la enajenación entre vivos, aunque esta haya sido nula.", true, "1135", "Revocación tácita", "Correcto. La enajenación de la especie legada envuelve revocación y no revive por retorno posterior."),
    choice("Convertir el legado en crédito por el valor del reloj.", false, "1135", "Legado de especie", "Incorrecto. La regla extingue o revoca el legado; no lo recicla como indemnización sucesoria."),
  ]),
  caseFile("sustraccion-inventario", "La caja antes del inventario", "Aceptación forzada por sustracción", 5, "posesion-herencia", "Una heredera retira efectos de la sucesión antes del inventario y luego intenta repudiar porque aparecieron deudas. Dice que solo 'resguardo' la caja. El sistema encuentra la caja vendida en una feria de reliquias.", ["Sustracción de efectos hereditarios", "Repudiación posterior", "Objetos no incluidos en inventario"], "Aplicar la sanción del heredero que sustrae efectos de la sucesión.", [
    choice("Permitir la repudiación si devuelve el valor de la caja.", false, "1231", "Repudiación", "Incorrecto. La sustracción hace perder la facultad de repudiar y excluye participación en los objetos sustraídos."),
    choice("Mantenerla como heredera pese a repudiar, pero sin parte en los objetos sustraídos.", true, "1231", "Sustracción", "Correcto. El Código castiga la maniobra: no puede usar el repudio como salida de emergencia."),
    choice("Declarar beneficio de inventario automático por existir deudas.", false, "1247", "Beneficio", "Incorrecto. El beneficio de inventario no limpia la sustracción previa."),
  ]),
  caseFile("posesion-efectiva-mito", "El decreto que llegó tarde", "Posesión legal de la herencia", 5, "posesion-herencia", "La heredera toma medidas conservativas al día siguiente de la muerte. Un tercero objeta que aún no tiene posesión efectiva. Ella responde que la delación no espera timbres administrativos.", ["Muerte y delación ya ocurridas", "No hay decreto de posesión efectiva aún", "Medidas conservativas sobre la herencia"], "Distinguir posesión legal de la herencia y trámite de posesión efectiva.", [
    choice("Negar toda posesión hereditaria hasta el decreto de posesión efectiva.", false, "722", "Posesión", "Incorrecto. La posesión de la herencia se adquiere desde que es deferida, incluso si el heredero lo ignora."),
    choice("Reconocer posesión legal desde la delación, sin confundirla con posesión efectiva.", true, "722/1222", "Posesión hereditaria", "Correcto. El decreto ordena y acredita, pero no crea desde cero la posición hereditaria."),
    choice("Exigir partición previa para cualquier acto conservativo.", false, "1317", "Partición", "Incorrecto. La partición no es requisito para proteger la masa hereditaria."),
  ]),
  caseFile("testamento-bajo-fuerza", "La firma con amenaza", "Fuerza en testamento", 5, "clases-sucesion", "La testadora firma un testamento luego de que un heredero la amenaza con internarla y aislarla. El documento tiene solemnidades impecables; el consentimiento, no. La tinta se ve perfecta y aun así tiembla.", ["Amenaza determinante", "Testamento formalmente prolijo", "Asignatario beneficiado por la presión"], "Distinguir solemnidad externa de libertad testamentaria y declarar la nulidad por fuerza.", [
    choice("Mantener el testamento porque cumple las solemnidades externas.", false, "1007/1026", "Solemnidades", "Incorrecto. Las formas no salvan un testamento intervenido por fuerza."),
    choice("Pedir nulidad total del testamento por fuerza.", true, "1007", "Nulidad testamentaria", "Correcto. La fuerza en el testamento lo anula en todas sus partes."),
    choice("Usar solo acción de reforma porque hay asignatarios forzosos.", false, "1216", "Reforma", "Incorrecto. Si el vicio es fuerza, el problema no es solo legítima lesionada; es validez del testamento completo."),
  ]),
  caseFile("acervo-con-sociedad", "La planilla con bienes mezclados", "Acervos y bajas generales", 5, "acervos-calculo", "El inventario bruto mezcla bienes propios del causante, bienes sociales no liquidados, deudas hereditarias, gastos de última enfermedad y una donación imputable a una hija. Un heredero quiere calcular legítimas sobre el total bruto porque 'así duele menos'.", ["Bienes confundidos con sociedad conyugal", "Bajas generales pendientes", "Donación imputable a legitimaria"], "Ordenar el cálculo: separar bienes ajenos o sociales, deducir bajas generales y luego agregar donaciones acumulables.", [
    choice("Calcular legítimas directamente sobre el acervo bruto mezclado.", false, "959/1185", "Acervos", "Incorrecto. El bruto no es base final; primero se depura la masa."),
    choice("Separar lo ajeno, deducir bajas generales y después formar acervos imaginarios si procede.", true, "1341/959/1185", "Acervo líquido", "Correcto. La sucesión se calcula con bisturí: separar, bajar, agregar y recién distribuir."),
    choice("Ignorar la donación porque las bajas generales tienen prioridad.", false, "1185", "Primer acervo", "Incorrecto. Las bajas se deducen antes, pero la donación imputable puede volver al cálculo imaginario."),
  ]),
];

export const advancedBosses = [
  {
    id: "heredero-legatario-boss",
    name: "Notario 1104",
    subtitle: "Herederos vs legatarios",
    module: "herederos-legatarios",
    color: "#c69a41",
    intro: "El notario del distrito parpadea en ámbar. Cada etiqueta falsa del testador alimenta su sello mecánico.",
    questions: [
      bossQ("hlb1", "Asignatario a título universal es:", ["Heredero", "Legatario", "Albacea", "Curador"], "Heredero", "951/1097", "Universalidad equivale a heredero."),
      bossQ("hlb2", "Asignatario a título singular es:", ["Legatario", "Heredero universal", "Heredero de remanente", "Fisco"], "Legatario", "951/1104", "Singularidad equivale a legado."),
      bossQ("hlb3", "Si el testador llama legatario a quien recibe toda la herencia:", ["Es heredero", "Es legatario", "Es incapaz", "Es albacea"], "Es heredero", "1097", "El objeto manda sobre la etiqueta."),
      bossQ("hlb4", "Legado de género otorga inicialmente:", ["Derecho personal", "Dominio inmediato", "Derecho real de herencia", "Posesión efectiva"], "Derecho personal", "951/1115", "Debe exigir entrega."),
      bossQ("hlb5", "El heredero representa al causante según:", ["1097", "1104", "1186", "1240"], "1097", "1097", "Continúa derechos y obligaciones transmisibles."),
    ],
  },
  {
    id: "acervo-calculo-boss",
    name: "Planilla 1186",
    subtitle: "Cálculo de acervos",
    module: "acervos-calculo",
    color: "#2cf7ff",
    intro: "Una planilla neón abre celdas como tumbas. Cada número incorrecto convoca al contador de ultratumba.",
    questions: [
      bossQ("acb1", "Bruto 300, bienes ajenos 80, bajas 40. Acervo líquido:", ["180", "220", "260", "140"], "180", "959", "300-80=220; 220-40=180."),
      bossQ("acb2", "Líquido 150, donación a legitimario 50. Primer acervo:", ["200", "150", "100", "50"], "200", "1185", "Se agrega al valor."),
      bossQ("acb3", "Acervo imaginario 100, con legitimarios al donar; donación a tercero 60. Exceso:", ["20", "40", "60", "0"], "20", "1186", "100+60=160; cuarta=40; exceso=20."),
      bossQ("acb4", "Acervo imaginario 100, con legitimarios al donar; donación a tercero 200. Segundo acervo:", ["225", "300", "100", "75"], "225", "1186", "Exceso 125; segundo acervo 100+125=225."),
      bossQ("acb5", "Acción si donación excesiva menoscaba legítimas:", ["Inoficiosa donación", "Reforma", "Petición", "Partición"], "Inoficiosa donación", "1187", "Acción contra donatarios."),
    ],
  },
];

export const calculationScenarios = [
  calc("calc-1", "Cónyuge y un hijo", "Herencia intestada de 120. Concurren cónyuge sobreviviente y un hijo.", "988", ["Con un hijo, el cónyuge lleva la misma porción que el hijo."], { conyuge: 60, hijo: 60 }),
  calc("calc-2", "Cónyuge y tres hijos", "Herencia intestada de 150. Concurren cónyuge y tres hijos.", "988", ["Con varios hijos, el cónyuge vale dos unidades.", "Total unidades: 2 + 3 = 5.", "Cada unidad vale 30."], { conyuge: 60, cadaHijo: 30 }),
  calc("calc-3", "Cónyuge y ocho hijos", "Herencia intestada de 200. Concurren cónyuge y ocho hijos.", "988", ["La doble porción daría menos de 1/4.", "Cónyuge recibe mínimo 50.", "Resto 150 se divide entre ocho."], { conyuge: 50, cadaHijo: 18.75 }),
  calc("calc-4", "Segundo orden", "Herencia de 90. No hay descendientes. Concurren cónyuge y dos ascendientes de grado más próximo.", "989", ["Cónyuge recibe 2/3.", "Ascendientes reciben 1/3 en total.", "Dos ascendientes dividen ese tercio."], { conyuge: 60, cadaAscendiente: 15 }),
  calc("calc-5", "Hermanos carnales y medio hermano", "Herencia de 120. No hay descendientes, ascendientes ni cónyuge. Concurren dos hermanos carnales y un medio hermano.", "990", ["Cada carnal vale dos unidades.", "Medio hermano vale una unidad.", "Total unidades: 5."], { cadaCarnal: 48, medioHermano: 24 }),
  calc("calc-6", "Bruto a líquido", "Acervo bruto 300. Bienes ajenos o confundidos 100. Bajas generales 50.", "959", ["Separar bienes ajenos: 300 - 100 = 200.", "Deducir bajas generales: 200 - 50 = 150."], { acervoIliquido: 200, acervoLiquido: 150 }),
  calc("calc-7", "Primer acervo imaginario", "Acervo líquido 150. Donaciones acumulables a legitimarios 50.", "1185", ["Primer acervo imaginario = líquido + donaciones acumulables.", "Mitad legitimaria = 1/2 del primer acervo.", "Mejoras y libre = 1/4 cada una."], { primerAcervo: 200, mitadLegitimaria: 100, cuartaMejoras: 50, cuartaLibre: 50 }),
  calc("calc-8", "Segundo acervo sin exceso", "Acervo imaginario 150. Al donar, el causante tenía legitimarios. Donaciones irrevocables a terceros 50.", "1186", ["Suma: 150 + 50 = 200.", "Cuarta parte: 50.", "Donación no excede la cuarta parte."], { sumaBase: 200, cuartaReferencia: 50, exceso: 0 }),
  calc("calc-9", "Segundo acervo con exceso simple", "Acervo imaginario 100. Al donar, el causante tenía legitimarios. Donaciones irrevocables a terceros 60.", "1186", ["Suma: 160.", "Cuarta parte: 40.", "Exceso: 60 - 40 = 20.", "Segundo acervo: 100 + 20 = 120."], { sumaBase: 160, cuartaReferencia: 40, exceso: 20, segundoAcervo: 120 }),
  calc("calc-10", "Inoficiosa encendida", "Acervo imaginario 100. Al donar, el causante tenía legitimarios. Donaciones irrevocables a terceros 200.", "1186/1187", ["Suma: 300.", "Cuarta parte: 75.", "Exceso: 125.", "Segundo acervo: 225.", "El exceso puede menoscabar mejoras y legítimas."], { sumaBase: 300, cuartaReferencia: 75, exceso: 125, segundoAcervo: 225 }),
  calc("calc-11", "Imputación normal", "Legítima de 100. Donación imputable recibida por el legitimario: 45.", "1198", ["Se imputa la donación.", "Saldo a enterar: 100 - 45."], { saldoLegitima: 55 }),
  calc("calc-12", "Exceso sobre legítima", "Legítima 100. Donación imputable 120. No hay distribución testamentaria de mejoras.", "1193", ["La donación cubre la legítima.", "Exceso 20 se imputa a la cuarta de mejoras (art. 1193); si no cabe ahí, pasa a la cuarta restante (art. 1194)."], { cubreLegitima: 100, excesoAMejora: 20 }),
];

function f(id, module, concept, article, definition, example, error) {
  return { id, module, concept, article, definition, example, error };
}

function optionSet(answer, offset) {
  const options = [answer];
  let cursor = offset;
  while (options.length < 4) {
    const next = articleOptions[cursor % articleOptions.length];
    // Un distractor que comparte un artículo con la respuesta también sería correcto.
    const overlaps = next.split("/").some((part) => answer.split("/").includes(part));
    if (!options.includes(next) && !overlaps) options.push(next);
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
      { id: "rama1", name: "Rama A", tag: "interés", state: "represented", x: 35, y: 60 },
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
