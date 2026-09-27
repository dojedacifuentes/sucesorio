export const detectiveCases = [
  {
    id: "premuerto",
    title: "El hijo premuerto",
    theme: "Representación",
    difficulty: 1,
    module: "intestada",
    dossier:
      "En la Notaría Nocturna 404, Aurelio Vega muere sin testamento. Su hijo Tomás murió dos años antes, dejando dos hijas. La viuda del causante insiste en que la rama de Tomás está 'apagada'. La familia aplaude la frase. El Código no.",
    cast: [
      { name: "Aurelio Vega", role: "Causante", status: "muerto" },
      { name: "Elena", role: "Cónyuge sobreviviente", status: "viva" },
      { name: "Tomás", role: "Hijo premuerto", status: "muerto" },
      { name: "Lía y Mara", role: "Nietas", status: "representan" },
    ],
    documents: [
      { title: "Certificado de defunción", body: "Aurelio Vega fallece el 12.08.2088. Tomás Vega registra defunción el 01.03.2086." },
      { title: "Informe familiar", body: "Tomás dejó dos descendientes vivas. No hay testamento ni repudio." },
      { title: "Nota del archivo", body: "La premoriencia del hijo abre la puerta a la representación sucesoria." },
    ],
    tree: [
      { id: "aurelio", name: "Aurelio", tag: "causante", state: "dead", x: 50, y: 10 },
      { id: "elena", name: "Elena", tag: "cónyuge", state: "alive", x: 25, y: 36 },
      { id: "tomas", name: "Tomás", tag: "hijo", state: "dead", x: 50, y: 36 },
      { id: "nietas", name: "Lía / Mara", tag: "nietas", state: "represented", x: 50, y: 68 },
    ],
    choices: [
      {
        label: "Excluir a las nietas porque Tomás murió antes.",
        correct: false,
        article: "art. 984",
        concept: "Representación",
        feedback:
          "Incorrecto. La premoriencia no corta la rama cuando procede representación. Acabas de apagar una línea familiar con entusiasmo ilegal.",
      },
      {
        label: "Reconocer representación: las nietas ocupan el lugar de Tomás.",
        correct: true,
        article: "art. 984",
        concept: "Representación",
        feedback:
          "Correcto. Tomás murió antes del causante; sus descendientes pueden representarlo. Representación, art. 984. La rama no murió: solo cambió de avatar.",
      },
      {
        label: "Aplicar transmisión porque hay nietas vivas.",
        correct: false,
        article: "art. 957",
        concept: "Transmisión",
        feedback:
          "Incorrecto. Transmisión exige que Tomás haya sobrevivido al causante y muerto después de la delación. Aquí estaba muerto antes del episodio piloto.",
      },
    ],
    resolution:
      "Se aplica representación. Las nietas de Tomás concurren ocupando su lugar en la sucesión intestada. La clave fue la cronología: Tomás premurió al causante.",
  },
  {
    id: "cinco-dias",
    title: "Cinco días después",
    theme: "Transmisión",
    difficulty: 2,
    module: "intestada",
    dossier:
      "Mireya Lagos muere el lunes. Su hijo Bruno, llamado a heredar, muere el sábado sin aceptar ni repudiar. La pareja de Bruno pregunta si 'se perdió el derecho por mala gestión del calendario'.",
    cast: [
      { name: "Mireya Lagos", role: "Causante", status: "muerta" },
      { name: "Bruno", role: "Hijo sobreviviente por cinco días", status: "muerto después" },
      { name: "Sofía", role: "Heredera de Bruno", status: "viva" },
    ],
    documents: [
      { title: "Línea de tiempo", body: "Lunes: muerte de Mireya. Sábado: muerte de Bruno. No consta aceptación ni repudiación." },
      { title: "Bitácora médica", body: "Bruno sobrevivió a Mireya. La asignación ya estaba deferida a su favor." },
      { title: "Alerta del sistema", body: "Si el llamado muere después de la delación, revise transmisión." },
    ],
    tree: [
      { id: "mireya", name: "Mireya", tag: "causante", state: "dead", x: 50, y: 12 },
      { id: "bruno", name: "Bruno", tag: "+5 días", state: "dead", x: 50, y: 43 },
      { id: "sofia", name: "Sofía", tag: "heredera", state: "represented", x: 50, y: 72 },
    ],
    choices: [
      {
        label: "Aplicar transmisión: Sofía recibe el derecho de aceptar o repudiar.",
        correct: true,
        article: "art. 957",
        concept: "Transmisión",
        feedback:
          "Correcto. Bruno sobrevivió a Mireya y murió sin decidir. Transmite su derecho a sus herederos, art. 957. Cinco días bastan para arruinar un examen oral.",
      },
      {
        label: "Aplicar representación por muerte de Bruno.",
        correct: false,
        article: "art. 984",
        concept: "Representación",
        feedback:
          "Incorrecto. Bruno no premurió: sobrevivió a la causante. La representación no corrige calendarios mal leídos.",
      },
      {
        label: "Declarar vacante la cuota de Bruno.",
        correct: false,
        article: "art. 957",
        concept: "Transmisión",
        feedback:
          "Incorrecto. La cuota no queda vacante solo porque Bruno murió rápido. El derecho ya había entrado a su patrimonio transmisible.",
      },
    ],
    resolution:
      "Opera transmisión. Sofía, como heredera de Bruno y siempre que acepte la herencia de este, puede aceptar o repudiar la asignación deferida a Bruno.",
  },
  {
    id: "fundacion",
    title: "La fundación favorita",
    theme: "Reforma de testamento",
    difficulty: 3,
    module: "acciones",
    dossier:
      "El empresario Silvio deja todo a la Fundación Hologramas Para Gatos de Oficina. Tiene dos hijas legitimarias. El testamento brilla; las legítimas sangran.",
    cast: [
      { name: "Silvio", role: "Causante testador", status: "muerto" },
      { name: "Iris y Paula", role: "Hijas", status: "legitimarias" },
      { name: "Fundación HPGO", role: "Asignataria testamentaria", status: "tercero" },
    ],
    documents: [
      { title: "Testamento", body: "Instituyo heredera universal a la Fundación HPGO. A mis hijas les dejo mi colección de ceniceros digitales." },
      { title: "Inventario", body: "Patrimonio líquido relevante. No consta pago equivalente a legítimas." },
      { title: "Nota doctrinal", body: "Si el testamento vulnera legítimas, piense en reforma de testamento." },
    ],
    tree: [
      { id: "silvio", name: "Silvio", tag: "causante", state: "dead", x: 50, y: 10 },
      { id: "iris", name: "Iris", tag: "hija", state: "represented", x: 38, y: 55 },
      { id: "paula", name: "Paula", tag: "hija", state: "represented", x: 62, y: 55 },
      { id: "fundacion", name: "HPGO", tag: "tercero", state: "excluded", x: 50, y: 78 },
    ],
    choices: [
      {
        label: "Acción de reforma de testamento por vulneración de legítimas.",
        correct: true,
        article: "arts. 1216 y 1220",
        concept: "Reforma",
        feedback:
          "Correcto. Las hijas son legitimarias. Si el testamento las reduce indebidamente, procede reforma. La fundación puede ronronear, pero no comerse la mitad legitimaria ni la cuarta de mejoras: a lo sumo, se queda con la cuarta de libre disposición.",
      },
      {
        label: "Petición de herencia porque las hijas quieren heredar.",
        correct: false,
        article: "art. 1264",
        concept: "Petición de herencia",
        feedback:
          "Incorrecto. El problema no es negar la calidad hereditaria, sino la lesión de legítimas por testamento.",
      },
      {
        label: "Partición inmediata sin tocar el testamento.",
        correct: false,
        article: "art. 1317",
        concept: "Partición",
        feedback:
          "Incorrecto. Partir una herencia mal configurada es repartir el incendio por habitaciones.",
      },
    ],
    resolution:
      "Procede reforma de testamento para proteger las legítimas de las hijas y adjudicarles la cuarta de mejoras dispuesta a favor de la fundación, que como extraña solo puede conservar la cuarta de libre disposición.",
  },
  {
    id: "testamento-quemado",
    title: "El testamento quemado",
    theme: "Indignidad",
    difficulty: 3,
    module: "asignatarios",
    dossier:
      "Un heredero aparece en cámara quemando el testamento cerrado de su madre. Dice que era 'performance de duelo'. El fiscal bostezó; el civilista despertó.",
    cast: [
      { name: "Aurora", role: "Causante", status: "muerta" },
      { name: "Rafael", role: "Hijo", status: "sospechoso" },
      { name: "Clara", role: "Hija", status: "viva" },
    ],
    documents: [
      { title: "Video municipal", body: "Rafael arroja al fuego una cubierta rotulada como testamento de Aurora." },
      { title: "Declaración", body: "Rafael: 'Solo quería cerrar ciclos'. El notario: 'Quería cerrar el expediente con fuego'." },
      { title: "Pista", body: "Ocultar o destruir disposiciones testamentarias puede conectar con indignidad." },
    ],
    tree: [
      { id: "aurora", name: "Aurora", tag: "causante", state: "dead", x: 50, y: 10 },
      { id: "rafael", name: "Rafael", tag: "quemó testamento", state: "excluded", x: 38, y: 55 },
      { id: "clara", name: "Clara", tag: "hija", state: "alive", x: 62, y: 55 },
    ],
    choices: [
      {
        label: "Demandar declaración de indignidad contra Rafael.",
        correct: true,
        article: "art. 968 N° 5",
        concept: "Indignidad",
        feedback:
          "Correcto. Es indigno de suceder quien dolosamente detiene u oculta un testamento del difunto, y el dolo se presume por el mero hecho (art. 968 N° 5); quemarlo es, en la práctica, ocultarlo para siempre. Quemar testamentos no es duelo: es pésima estrategia probatoria.",
      },
      {
        label: "Declarar incapacidad automática sin juicio.",
        correct: false,
        article: "art. 974",
        concept: "Indignidad",
        feedback:
          "Incorrecto. Esto apunta a indignidad y requiere declaración judicial. El Código no tiene botón rojo de odio familiar.",
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
      "Debe perseguirse la declaración judicial de indignidad si se acreditan los presupuestos. La indignidad priva de suceder como sanción civil.",
  },
  {
    id: "donacion-fantasma",
    title: "La donación fantasma",
    theme: "Primer acervo imaginario",
    difficulty: 4,
    module: "acervos",
    dossier:
      "Antes de morir, Norma donó un departamento a su hijo favorito. En la partición, el favorito dice que ese departamento 'ya no cuenta porque tiene buena energía'. La planilla se ríe.",
    cast: [
      { name: "Norma", role: "Causante", status: "muerta" },
      { name: "Darío", role: "Hijo donatario", status: "legitimario" },
      { name: "Eva", role: "Hija", status: "legitimaria" },
    ],
    documents: [
      { title: "Escritura de donación", body: "Norma donó a Darío un departamento dos años antes de morir." },
      { title: "Inventario", body: "El acervo líquido sin agregar la donación reduce notoriamente la legítima de Eva." },
      { title: "Nota contable", body: "Donación a legitimario: revisar primer acervo imaginario." },
    ],
    tree: [
      { id: "norma", name: "Norma", tag: "causante", state: "dead", x: 50, y: 10 },
      { id: "dario", name: "Darío", tag: "donatario", state: "alive", x: 38, y: 58 },
      { id: "eva", name: "Eva", tag: "legitimaria", state: "represented", x: 62, y: 58 },
    ],
    choices: [
      {
        label: "Agregar la donación para formar primer acervo imaginario.",
        correct: true,
        article: "art. 1185",
        concept: "Primer acervo imaginario",
        feedback:
          "Correcto. Donación a legitimario: se considera para calcular. La donación fantasma acaba de aparecer en la cámara térmica del art. 1185.",
      },
      {
        label: "Ignorar la donación porque salió del patrimonio antes de morir.",
        correct: false,
        article: "art. 1185",
        concept: "Acervos",
        feedback:
          "Incorrecto. Precisamente por eso existe el acervo imaginario. El Código tiene memoria y rencor contable.",
      },
      {
        label: "Aplicar segundo acervo imaginario por ser donación a legitimario.",
        correct: false,
        article: "art. 1186",
        concept: "Segundo acervo",
        feedback:
          "Incorrecto. El segundo mira donaciones excesivas a terceros. Darío es legitimario: primer acervo.",
      },
    ],
    resolution:
      "La donación hecha a Darío debe considerarse en el primer acervo imaginario para calcular correctamente legítimas.",
  },
  {
    id: "conyuge-neon",
    title: "El cónyuge del neón",
    theme: "Cónyuge con hijos",
    difficulty: 2,
    module: "intestada",
    dossier:
      "Elena muere intestada. Sobreviven su cónyuge civil y dos hijos. Un hermano llega con lentes de sol a exigir cuota. Nadie sabe quién lo invitó.",
    cast: [
      { name: "Elena", role: "Causante", status: "muerta" },
      { name: "Marco", role: "Cónyuge", status: "vivo" },
      { name: "Niña y Leo", role: "Hijos", status: "vivos" },
      { name: "Héctor", role: "Hermano", status: "excluido" },
    ],
    documents: [
      { title: "Estado civil", body: "Cónyuge sobreviviente vigente. Dos hijos vivos." },
      { title: "Declaración de Héctor", body: "Soy hermano y traje mi propio lápiz. Eso debe valer algo." },
      { title: "Pista", body: "El primer orden con hijos excluye órdenes posteriores." },
    ],
    tree: [
      { id: "elena", name: "Elena", tag: "causante", state: "dead", x: 50, y: 10 },
      { id: "marco", name: "Marco", tag: "cónyuge", state: "alive", x: 28, y: 48 },
      { id: "hijos", name: "Niña / Leo", tag: "hijos", state: "represented", x: 55, y: 50 },
      { id: "hector", name: "Héctor", tag: "hermano", state: "excluded", x: 78, y: 76 },
    ],
    choices: [
      {
        label: "Heredan cónyuge e hijos; el hermano queda excluido.",
        correct: true,
        article: "arts. 988 a 995",
        concept: "Órdenes intestados",
        feedback:
          "Correcto. Existiendo hijos y cónyuge, el hermano no entra. Lentes de sol no son título sucesorio.",
      },
      {
        label: "Dividir entre cónyuge, hijos y hermano por igualdad familiar.",
        correct: false,
        article: "arts. 988 a 995",
        concept: "Órdenes",
        feedback:
          "Incorrecto. La igualdad no significa barra libre hereditaria. Los órdenes excluyen a los posteriores.",
      },
      {
        label: "Excluir al cónyuge porque hay hijos.",
        correct: false,
        article: "arts. 988 a 995",
        concept: "Cónyuge",
        feedback:
          "Incorrecto. El cónyuge concurre con hijos según reglas. No lo borres como archivo temporal.",
      },
    ],
    resolution:
      "En sucesión intestada concurren cónyuge e hijos en el primer orden aplicable; el hermano queda excluido por existir orden preferente.",
  },
  {
    id: "heredero-deudas",
    title: "El heredero con deudas",
    theme: "Beneficio de inventario",
    difficulty: 2,
    module: "aceptacion",
    dossier:
      "Rubén hereda a su padre y encuentra tres bienes, nueve acreedores y una carpeta llamada 'no abrir hasta después del funeral'. Quiere aceptar sin perder su vida financiera.",
    cast: [
      { name: "Padre de Rubén", role: "Causante", status: "muerto" },
      { name: "Rubén", role: "Heredero", status: "vivo" },
      { name: "Acreedores", role: "Coro cyberpunk", status: "hambrientos" },
    ],
    documents: [
      { title: "Inventario preliminar", body: "Bienes: 3. Deudas: muchas, algunas con tipografía agresiva." },
      { title: "Consulta", body: "Rubén desea aceptar, pero limitar responsabilidad." },
      { title: "Pista", body: "El beneficio de inventario existe para este tipo de noche." },
    ],
    tree: [
      { id: "causante", name: "Padre", tag: "causante", state: "dead", x: 50, y: 15 },
      { id: "ruben", name: "Rubén", tag: "heredero", state: "represented", x: 50, y: 58 },
    ],
    choices: [
      {
        label: "Aceptar con beneficio de inventario.",
        correct: true,
        article: "art. 1247",
        concept: "Beneficio de inventario",
        feedback:
          "Correcto. El beneficio limita responsabilidad. Rubén hereda bienes, no una suscripción premium al desastre.",
      },
      {
        label: "Aceptar pura y simplemente para demostrar confianza.",
        correct: false,
        article: "art. 1247",
        concept: "Beneficio",
        feedback:
          "Incorrecto. La confianza es preciosa; los acreedores también la embargan con cariño.",
      },
      {
        label: "Pedir reforma de testamento.",
        correct: false,
        article: "art. 1216",
        concept: "Reforma",
        feedback:
          "Incorrecto. No hay lesión de legítimas por testamento; hay pasivo hereditario mirando fijo desde la esquina.",
      },
    ],
    resolution:
      "Rubén debe aceptar con beneficio de inventario si quiere limitar su responsabilidad por deudas hereditarias.",
  },
  {
    id: "particion-no-transfiere",
    title: "La partición que no transfiere",
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
      { title: "Pista", body: "Art. 1344: efecto declarativo y retroactivo de la partición." },
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
          "Correcto. La partición declara derechos; no transfiere entre comuneros. El dominio no hizo escala con café en los hermanos.",
      },
      {
        label: "Tratar la adjudicación como compraventa entre coherederos.",
        correct: false,
        article: "art. 1344",
        concept: "Partición",
        feedback:
          "Incorrecto. La partición no es compraventa con playlist triste. Tiene efecto declarativo.",
      },
      {
        label: "Pedir petición de herencia contra Valeria.",
        correct: false,
        article: "art. 1264",
        concept: "Petición",
        feedback:
          "Incorrecto. Nadie niega calidad hereditaria; se consulta el efecto de la adjudicación particional.",
      },
    ],
    resolution:
      "La adjudicación particional tiene efecto declarativo y retroactivo. Valeria se entiende haber sucedido directamente al causante en el bien adjudicado.",
  },
];
