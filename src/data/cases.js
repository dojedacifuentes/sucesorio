export const detectiveCases = [
  {
    id: "premuerto",
    title: "El hijo premuerto",
    theme: "Representacion",
    difficulty: 1,
    module: "intestada",
    dossier:
      "En la Notaria Nocturna 404, Aurelio Vega muere sin testamento. Su hijo Tomas murio dos anos antes, dejando dos hijas. La viuda del causante insiste en que la rama de Tomas esta 'apagada'. La familia aplaude la frase. El Codigo no.",
    cast: [
      { name: "Aurelio Vega", role: "Causante", status: "muerto" },
      { name: "Elena", role: "Conyuge sobreviviente", status: "viva" },
      { name: "Tomas", role: "Hijo premuerto", status: "muerto" },
      { name: "Lia y Mara", role: "Nietas", status: "representan" },
    ],
    documents: [
      { title: "Certificado de defuncion", body: "Aurelio Vega fallece el 12.08.2088. Tomas Vega registra defuncion el 01.03.2086." },
      { title: "Informe familiar", body: "Tomas dejo dos descendientes vivas. No hay testamento ni repudio." },
      { title: "Nota del archivo", body: "La premoriencia del hijo abre la puerta a la representacion sucesoria." },
    ],
    tree: [
      { id: "aurelio", name: "Aurelio", tag: "causante", state: "dead", x: 50, y: 10 },
      { id: "elena", name: "Elena", tag: "conyuge", state: "alive", x: 25, y: 36 },
      { id: "tomas", name: "Tomas", tag: "hijo", state: "dead", x: 50, y: 36 },
      { id: "nietas", name: "Lia / Mara", tag: "nietas", state: "represented", x: 50, y: 68 },
    ],
    choices: [
      {
        label: "Excluir a las nietas porque Tomas murio antes.",
        correct: false,
        article: "art. 984",
        concept: "Representacion",
        feedback:
          "Incorrecto. La premoriencia no corta la rama cuando procede representacion. Acabas de apagar una linea familiar con entusiasmo ilegal.",
      },
      {
        label: "Reconocer representacion: las nietas ocupan el lugar de Tomas.",
        correct: true,
        article: "art. 984",
        concept: "Representacion",
        feedback:
          "Correcto. Tomas murio antes del causante; sus descendientes pueden representarlo. Representacion, art. 984. La rama no murio: solo cambio de avatar.",
      },
      {
        label: "Aplicar transmision porque hay nietas vivas.",
        correct: false,
        article: "art. 957",
        concept: "Transmision",
        feedback:
          "Incorrecto. Transmision exige que Tomas haya sobrevivido al causante y muerto despues de la delacion. Aqui estaba muerto antes del episodio piloto.",
      },
    ],
    resolution:
      "Se aplica representacion. Las nietas de Tomas concurren ocupando su lugar en la sucesion intestada. La clave fue la cronologia: Tomas premurio al causante.",
  },
  {
    id: "cinco-dias",
    title: "Cinco dias despues",
    theme: "Transmision",
    difficulty: 2,
    module: "intestada",
    dossier:
      "Mireya Lagos muere el lunes. Su hijo Bruno, llamado a heredar, muere el sabado sin aceptar ni repudiar. La pareja de Bruno pregunta si 'se perdio el derecho por mala gestion del calendario'.",
    cast: [
      { name: "Mireya Lagos", role: "Causante", status: "muerta" },
      { name: "Bruno", role: "Hijo sobreviviente por cinco dias", status: "muerto despues" },
      { name: "Sofia", role: "Heredera de Bruno", status: "viva" },
    ],
    documents: [
      { title: "Linea de tiempo", body: "Lunes: muerte de Mireya. Sabado: muerte de Bruno. No consta aceptacion ni repudiacion." },
      { title: "Bitacora medica", body: "Bruno sobrevivio a Mireya. La asignacion ya estaba deferida a su favor." },
      { title: "Alerta del sistema", body: "Si el llamado muere despues de la delacion, revise transmision." },
    ],
    tree: [
      { id: "mireya", name: "Mireya", tag: "causante", state: "dead", x: 50, y: 12 },
      { id: "bruno", name: "Bruno", tag: "+5 dias", state: "dead", x: 50, y: 43 },
      { id: "sofia", name: "Sofia", tag: "heredera", state: "represented", x: 50, y: 72 },
    ],
    choices: [
      {
        label: "Aplicar transmision: Sofia recibe el derecho de aceptar o repudiar.",
        correct: true,
        article: "art. 957",
        concept: "Transmision",
        feedback:
          "Correcto. Bruno sobrevivio a Mireya y murio sin decidir. Transmite su derecho a sus herederos, art. 957. Cinco dias bastan para arruinar un examen oral.",
      },
      {
        label: "Aplicar representacion por muerte de Bruno.",
        correct: false,
        article: "art. 984",
        concept: "Representacion",
        feedback:
          "Incorrecto. Bruno no premurio: sobrevivio a la causante. La representacion no corrige calendarios mal leidos.",
      },
      {
        label: "Declarar vacante la cuota de Bruno.",
        correct: false,
        article: "art. 957",
        concept: "Transmision",
        feedback:
          "Incorrecto. La cuota no queda vacante solo porque Bruno murio rapido. El derecho ya habia entrado a su patrimonio transmisible.",
      },
    ],
    resolution:
      "Opera transmision. Sofia, como heredera de Bruno, puede aceptar o repudiar la asignacion deferida a Bruno.",
  },
  {
    id: "fundacion",
    title: "La fundacion favorita",
    theme: "Reforma de testamento",
    difficulty: 3,
    module: "acciones",
    dossier:
      "El empresario Silvio deja todo a la Fundacion Hologramas Para Gatos de Oficina. Tiene dos hijas legitimarias. El testamento brilla; las legitimas sangran.",
    cast: [
      { name: "Silvio", role: "Causante testador", status: "muerto" },
      { name: "Iris y Paula", role: "Hijas", status: "legitimarias" },
      { name: "Fundacion HPGO", role: "Asignataria testamentaria", status: "tercero" },
    ],
    documents: [
      { title: "Testamento", body: "Instituyo heredera universal a la Fundacion HPGO. A mis hijas les dejo mi coleccion de ceniceros digitales." },
      { title: "Inventario", body: "Patrimonio liquido relevante. No consta pago equivalente a legitimas." },
      { title: "Nota doctrinal", body: "Si el testamento vulnera legitimas, piense en reforma de testamento." },
    ],
    tree: [
      { id: "silvio", name: "Silvio", tag: "causante", state: "dead", x: 50, y: 10 },
      { id: "iris", name: "Iris", tag: "hija", state: "represented", x: 38, y: 55 },
      { id: "paula", name: "Paula", tag: "hija", state: "represented", x: 62, y: 55 },
      { id: "fundacion", name: "HPGO", tag: "tercero", state: "excluded", x: 50, y: 78 },
    ],
    choices: [
      {
        label: "Accion de reforma de testamento por vulneracion de legitimas.",
        correct: true,
        article: "art. 1216",
        concept: "Reforma",
        feedback:
          "Correcto. Las hijas son legitimarias. Si el testamento las reduce indebidamente, procede reforma. La fundacion puede ronronear, pero no comerse la mitad legitimaria.",
      },
      {
        label: "Peticion de herencia porque las hijas quieren heredar.",
        correct: false,
        article: "art. 1264",
        concept: "Peticion de herencia",
        feedback:
          "Incorrecto. El problema no es negar la calidad hereditaria, sino la lesion de legitimas por testamento.",
      },
      {
        label: "Particion inmediata sin tocar el testamento.",
        correct: false,
        article: "art. 1317",
        concept: "Particion",
        feedback:
          "Incorrecto. Partir una herencia mal configurada es repartir el incendio por habitaciones.",
      },
    ],
    resolution:
      "Procede reforma de testamento para proteger las legitimas de las hijas frente a la disposicion excesiva a favor de la fundacion.",
  },
  {
    id: "testamento-quemado",
    title: "El testamento quemado",
    theme: "Indignidad",
    difficulty: 3,
    module: "asignatarios",
    dossier:
      "Un heredero aparece en camara quemando el testamento cerrado de su madre. Dice que era 'performance de duelo'. El fiscal bostezó; el civilista desperto.",
    cast: [
      { name: "Aurora", role: "Causante", status: "muerta" },
      { name: "Rafael", role: "Hijo", status: "sospechoso" },
      { name: "Clara", role: "Hija", status: "viva" },
    ],
    documents: [
      { title: "Video municipal", body: "Rafael arroja al fuego una cubierta rotulada como testamento de Aurora." },
      { title: "Declaracion", body: "Rafael: 'Solo queria cerrar ciclos'. El notario: 'Queria cerrar el expediente con fuego'." },
      { title: "Pista", body: "Ocultar o destruir disposiciones testamentarias puede conectar con indignidad." },
    ],
    tree: [
      { id: "aurora", name: "Aurora", tag: "causante", state: "dead", x: 50, y: 10 },
      { id: "rafael", name: "Rafael", tag: "quemo testamento", state: "excluded", x: 38, y: 55 },
      { id: "clara", name: "Clara", tag: "hija", state: "alive", x: 62, y: 55 },
    ],
    choices: [
      {
        label: "Demandar declaracion de indignidad contra Rafael.",
        correct: true,
        article: "art. 968",
        concept: "Indignidad",
        feedback:
          "Correcto. La conducta grave contra la voluntad testamentaria puede fundar indignidad. Quemar testamentos no es duelo: es pesima estrategia probatoria.",
      },
      {
        label: "Declarar incapacidad automatica sin juicio.",
        correct: false,
        article: "art. 968",
        concept: "Indignidad",
        feedback:
          "Incorrecto. Esto apunta a indignidad y requiere declaracion judicial. El Codigo no tiene boton rojo de odio familiar.",
      },
      {
        label: "Aplicar beneficio de inventario.",
        correct: false,
        article: "art. 1247",
        concept: "Beneficio",
        feedback:
          "Incorrecto. El problema no son deudas hereditarias; es conducta indigna. Inventariar cenizas no salva la respuesta.",
      },
    ],
    resolution:
      "Debe perseguirse la declaracion judicial de indignidad si se acreditan los presupuestos. La indignidad priva de suceder como sancion civil.",
  },
  {
    id: "donacion-fantasma",
    title: "La donacion fantasma",
    theme: "Primer acervo imaginario",
    difficulty: 4,
    module: "acervos",
    dossier:
      "Antes de morir, Norma dono un departamento a su hijo favorito. En la particion, el favorito dice que ese departamento 'ya no cuenta porque tiene buena energia'. La planilla se rie.",
    cast: [
      { name: "Norma", role: "Causante", status: "muerta" },
      { name: "Dario", role: "Hijo donatario", status: "legitimario" },
      { name: "Eva", role: "Hija", status: "legitimaria" },
    ],
    documents: [
      { title: "Escritura de donacion", body: "Norma dono a Dario un departamento dos anos antes de morir." },
      { title: "Inventario", body: "El acervo liquido sin agregar la donacion reduce notoriamente la legitima de Eva." },
      { title: "Nota contable", body: "Donacion a legitimario: revisar primer acervo imaginario." },
    ],
    tree: [
      { id: "norma", name: "Norma", tag: "causante", state: "dead", x: 50, y: 10 },
      { id: "dario", name: "Dario", tag: "donatario", state: "alive", x: 38, y: 58 },
      { id: "eva", name: "Eva", tag: "legitimaria", state: "represented", x: 62, y: 58 },
    ],
    choices: [
      {
        label: "Agregar la donacion para formar primer acervo imaginario.",
        correct: true,
        article: "art. 1185",
        concept: "Primer acervo imaginario",
        feedback:
          "Correcto. Donacion a legitimario: se considera para calcular. La donacion fantasma acaba de aparecer en la camara termica del art. 1185.",
      },
      {
        label: "Ignorar la donacion porque salio del patrimonio antes de morir.",
        correct: false,
        article: "art. 1185",
        concept: "Acervos",
        feedback:
          "Incorrecto. Precisamente por eso existe el acervo imaginario. El Codigo tiene memoria y rencor contable.",
      },
      {
        label: "Aplicar segundo acervo imaginario por ser donacion a legitimario.",
        correct: false,
        article: "art. 1186",
        concept: "Segundo acervo",
        feedback:
          "Incorrecto. El segundo mira donaciones excesivas a terceros. Dario es legitimario: primer acervo.",
      },
    ],
    resolution:
      "La donacion hecha a Dario debe considerarse en el primer acervo imaginario para calcular correctamente legitimas.",
  },
  {
    id: "conyuge-neon",
    title: "El conyuge del neon",
    theme: "Conyuge con hijos",
    difficulty: 2,
    module: "intestada",
    dossier:
      "Elena muere intestada. Sobreviven su conyuge civil y dos hijos. Un hermano llega con lentes de sol a exigir cuota. Nadie sabe quien lo invito.",
    cast: [
      { name: "Elena", role: "Causante", status: "muerta" },
      { name: "Marco", role: "Conyuge", status: "vivo" },
      { name: "Nina y Leo", role: "Hijos", status: "vivos" },
      { name: "Hector", role: "Hermano", status: "excluido" },
    ],
    documents: [
      { title: "Estado civil", body: "Conyuge sobreviviente vigente. Dos hijos vivos." },
      { title: "Declaracion de Hector", body: "Soy hermano y traje mi propio lapiz. Eso debe valer algo." },
      { title: "Pista", body: "El primer orden con hijos excluye ordenes posteriores." },
    ],
    tree: [
      { id: "elena", name: "Elena", tag: "causante", state: "dead", x: 50, y: 10 },
      { id: "marco", name: "Marco", tag: "conyuge", state: "alive", x: 28, y: 48 },
      { id: "hijos", name: "Nina / Leo", tag: "hijos", state: "represented", x: 55, y: 50 },
      { id: "hector", name: "Hector", tag: "hermano", state: "excluded", x: 78, y: 76 },
    ],
    choices: [
      {
        label: "Heredan conyuge e hijos; el hermano queda excluido.",
        correct: true,
        article: "arts. 988 a 995",
        concept: "Ordenes intestados",
        feedback:
          "Correcto. Existiendo hijos y conyuge, el hermano no entra. Lentes de sol no son titulo sucesorio.",
      },
      {
        label: "Dividir entre conyuge, hijos y hermano por igualdad familiar.",
        correct: false,
        article: "arts. 988 a 995",
        concept: "Ordenes",
        feedback:
          "Incorrecto. La igualdad no significa barra libre hereditaria. Los ordenes excluyen a los posteriores.",
      },
      {
        label: "Excluir al conyuge porque hay hijos.",
        correct: false,
        article: "arts. 988 a 995",
        concept: "Conyuge",
        feedback:
          "Incorrecto. El conyuge concurre con hijos segun reglas. No lo borres como archivo temporal.",
      },
    ],
    resolution:
      "En sucesion intestada concurren conyuge e hijos en el primer orden aplicable; el hermano queda excluido por existir orden preferente.",
  },
  {
    id: "heredero-deudas",
    title: "El heredero con deudas",
    theme: "Beneficio de inventario",
    difficulty: 2,
    module: "aceptacion",
    dossier:
      "Ruben hereda a su padre y encuentra tres bienes, nueve acreedores y una carpeta llamada 'no abrir hasta despues del funeral'. Quiere aceptar sin perder su vida financiera.",
    cast: [
      { name: "Padre de Ruben", role: "Causante", status: "muerto" },
      { name: "Ruben", role: "Heredero", status: "vivo" },
      { name: "Acreedores", role: "Coro cyberpunk", status: "hambrientos" },
    ],
    documents: [
      { title: "Inventario preliminar", body: "Bienes: 3. Deudas: muchas, algunas con tipografia agresiva." },
      { title: "Consulta", body: "Ruben desea aceptar, pero limitar responsabilidad." },
      { title: "Pista", body: "El beneficio de inventario existe para este tipo de noche." },
    ],
    tree: [
      { id: "causante", name: "Padre", tag: "causante", state: "dead", x: 50, y: 15 },
      { id: "ruben", name: "Ruben", tag: "heredero", state: "represented", x: 50, y: 58 },
    ],
    choices: [
      {
        label: "Aceptar con beneficio de inventario.",
        correct: true,
        article: "art. 1247",
        concept: "Beneficio de inventario",
        feedback:
          "Correcto. El beneficio limita responsabilidad. Ruben hereda bienes, no una suscripcion premium al desastre.",
      },
      {
        label: "Aceptar pura y simplemente para demostrar confianza.",
        correct: false,
        article: "art. 1247",
        concept: "Beneficio",
        feedback:
          "Incorrecto. La confianza es preciosa; los acreedores tambien la embargan con cariño.",
      },
      {
        label: "Pedir reforma de testamento.",
        correct: false,
        article: "art. 1216",
        concept: "Reforma",
        feedback:
          "Incorrecto. No hay lesion de legitimas por testamento; hay pasivo hereditario mirando fijo desde la esquina.",
      },
    ],
    resolution:
      "Ruben debe aceptar con beneficio de inventario si quiere limitar su responsabilidad por deudas hereditarias.",
  },
  {
    id: "particion-no-transfiere",
    title: "La particion que no transfiere",
    theme: "Efecto declarativo",
    difficulty: 4,
    module: "particion",
    dossier:
      "Tres coherederos parten la herencia. A Valeria se le adjudica un archivo inmobiliario. Un comprador pregunta si debe revisar transferencia entre hermanos. El expediente enciende una luz dorada.",
    cast: [
      { name: "Causante", role: "Titular original", status: "muerto" },
      { name: "Valeria", role: "Adjudicataria", status: "viva" },
      { name: "Hermanos", role: "Coherederos", status: "vivos" },
    ],
    documents: [
      { title: "Laudo", body: "Se adjudica a Valeria el inmueble del distrito 7." },
      { title: "Ordenata", body: "Compensaciones registradas. Comunidad terminada." },
      { title: "Pista", body: "Art. 1344: efecto declarativo y retroactivo de la particion." },
    ],
    tree: [
      { id: "causante", name: "Causante", tag: "origen", state: "dead", x: 50, y: 12 },
      { id: "valeria", name: "Valeria", tag: "adjudicataria", state: "represented", x: 35, y: 58 },
      { id: "otros", name: "Otros", tag: "coherederos", state: "alive", x: 65, y: 58 },
    ],
    choices: [
      {
        label: "Sostener efecto declarativo: Valeria se entiende sucesora directa del causante.",
        correct: true,
        article: "art. 1344",
        concept: "Efecto declarativo",
        feedback:
          "Correcto. La particion declara derechos; no transfiere entre comuneros. El dominio no hizo escala con cafe en los hermanos.",
      },
      {
        label: "Tratar la adjudicacion como compraventa entre coherederos.",
        correct: false,
        article: "art. 1344",
        concept: "Particion",
        feedback:
          "Incorrecto. La particion no es compraventa con playlist triste. Tiene efecto declarativo.",
      },
      {
        label: "Pedir peticion de herencia contra Valeria.",
        correct: false,
        article: "art. 1264",
        concept: "Peticion",
        feedback:
          "Incorrecto. Nadie niega calidad hereditaria; se consulta el efecto de la adjudicacion particional.",
      },
    ],
    resolution:
      "La adjudicacion particional tiene efecto declarativo y retroactivo. Valeria se entiende haber sucedido directamente al causante en el bien adjudicado.",
  },
];
