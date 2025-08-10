export const PRIVACY_TEXT = `
<h4>Resumen</h4>
<p>Docente Ágil prioriza la privacidad del usuario. Esta política describe qué datos se recolectan, para qué se usan y cómo ejercer tus derechos.</p>
<h4>Datos que recolectamos</h4>
<ul>
  <li>Datos de autenticación: correo electrónico (Firebase Authentication).</li>
  <li>Contenido generado por el usuario: planificaciones, informes, eventos y entradas de bitácora (almacenados localmente en tu navegador; opcionalmente en la nube si habilitás Firestore en el futuro).</li>
</ul>
<h4>Uso de datos</h4>
<ul>
  <li>Proveer funcionalidades de la aplicación (acceso, guardado, exportación a PDF).</li>
  <li>Mejorar la experiencia de usuario y desarrollo de nuevas funciones.</li>
</ul>
<h4>Base legal</h4>
<p>Consentimiento del usuario y ejecución del servicio solicitado.</p>
<h4>Conservación</h4>
<p>Los datos locales permanecen en tu dispositivo hasta que los elimines. Los datos en Firebase se conservan según tu configuración del proyecto.</p>
<h4>Compartición</h4>
<p>No compartimos tus datos con terceros salvo proveedores técnicos (Firebase) conforme a su propia política y términos.</p>
<h4>Seguridad</h4>
<p>Recomendamos no almacenar información sensible. Mantené tus credenciales seguras.</p>
<h4>Derechos</h4>
<p>Acceso, rectificación y supresión. Podés eliminar entradas desde la app o escribirnos para soporte.</p>
<h4>Contacto</h4>
<p>Contacto del responsable: soporte@docente-agil.example</p>
`;

export const INFORME_DESCRIPCIONES = [
  // --- Excelente (25)
  {id:'ex1',cat:'excelente',txt:'Demuestra un compromiso constante con el aprendizaje y la mejora continua.'},
  {id:'ex2',cat:'excelente',txt:'Mantiene una participación activa y respetuosa en clase.'},
  {id:'ex3',cat:'excelente',txt:'Entrega trabajos con alto nivel de detalle y rigor académico.'},
  {id:'ex4',cat:'excelente',txt:'Muestra autonomía para investigar y resolver problemas.'},
  {id:'ex5',cat:'excelente',txt:'Colabora con sus pares y promueve un clima de aula positivo.'},
  {id:'ex6',cat:'excelente',txt:'Gestiona el tiempo de forma eficiente y cumple plazos sin recordatorios.'},
  {id:'ex7',cat:'excelente',txt:'Integra recursos tecnológicos con criterio y sentido pedagógico.'},
  {id:'ex8',cat:'excelente',txt:'Argumenta sus ideas con sólidos fundamentos.'},
  {id:'ex9',cat:'excelente',txt:'Presenta sus trabajos con prolijidad y creatividad.'},
  {id:'ex10',cat:'excelente',txt:'Escucha activamente y aporta ideas pertinentes.'},
  {id:'ex11',cat:'excelente',txt:'Demuestra pensamiento crítico y capacidad de síntesis.'},
  {id:'ex12',cat:'excelente',txt:'Respeta normas de convivencia y acuerdos del grupo.'},
  {id:'ex13',cat:'excelente',txt:'Realiza preguntas desafiantes que enriquecen la clase.'},
  {id:'ex14',cat:'excelente',txt:'Integra contenidos de diferentes áreas en sus producciones.'},
  {id:'ex15',cat:'excelente',txt:'Evidencia mejora sostenida respecto a evaluaciones previas.'},
  {id:'ex16',cat:'excelente',txt:'Muestra liderazgo positivo en trabajos grupales.'},
  {id:'ex17',cat:'excelente',txt:'Organiza y documenta correctamente sus procesos de trabajo.'},
  {id:'ex18',cat:'excelente',txt:'Aprovecha retroalimentaciones para perfeccionar sus producciones.'},
  {id:'ex19',cat:'excelente',txt:'Demuestra dominio de conceptos clave del curso.'},
  {id:'ex20',cat:'excelente',txt:'Mantiene asistencia y puntualidad ejemplares.'},
  {id:'ex21',cat:'excelente',txt:'Participa en actividades extra clase vinculadas a la asignatura.'},
  {id:'ex22',cat:'excelente',txt:'Resuelve consignas complejas con creatividad.'},
  {id:'ex23',cat:'excelente',txt:'Fomenta el trabajo colaborativo y la inclusión de sus compañeros.'},
  {id:'ex24',cat:'excelente',txt:'Utiliza fuentes confiables y cita adecuadamente.'},
  {id:'ex25',cat:'excelente',txt:'Demuestra metacognición al explicar sus estrategias de aprendizaje.'},

  // --- Bueno (25)
  {id:'bu1',cat:'bueno',txt:'Cumple con las tareas asignadas en tiempo y forma.'},
  {id:'bu2',cat:'bueno',txt:'Participa en clase de manera frecuente.'},
  {id:'bu3',cat:'bueno',txt:'Manifiesta una actitud respetuosa hacia docentes y compañeros.'},
  {id:'bu4',cat:'bueno',txt:'Organiza sus materiales y mantiene orden en el trabajo.'},
  {id:'bu5',cat:'bueno',txt:'Muestra comprensión adecuada de los contenidos trabajados.'},
  {id:'bu6',cat:'bueno',txt:'Acepta sugerencias de mejora y las implementa.'},
  {id:'bu7',cat:'bueno',txt:'Colabora con su equipo y asume responsabilidades.'},
  {id:'bu8',cat:'bueno',txt:'Realiza preguntas cuando necesita aclaraciones.'},
  {id:'bu9',cat:'bueno',txt:'Evidencia progresos sostenidos a lo largo del período.'},
  {id:'bu10',cat:'bueno',txt:'Respeta los tiempos de trabajo y las consignas.'},
  {id:'bu11',cat:'bueno',txt:'Utiliza recursos digitales de forma pertinente.'},
  {id:'bu12',cat:'bueno',txt:'Se muestra receptivo a aprender de los errores.'},
  {id:'bu13',cat:'bueno',txt:'Mantiene una conducta adecuada en la mayoría de las clases.'},
  {id:'bu14',cat:'bueno',txt:'Participa en instancias de evaluación con compromiso.'},
  {id:'bu15',cat:'bueno',txt:'Demuestra curiosidad por ampliar conocimientos.'},
  {id:'bu16',cat:'bueno',txt:'Presenta trabajos claros y comprensibles.'},
  {id:'bu17',cat:'bueno',txt:'Propone ideas para mejorar el trabajo grupal.'},
  {id:'bu18',cat:'bueno',txt:'Hace un uso responsable de los dispositivos.'},
  {id:'bu19',cat:'bueno',txt:'Mantiene buena relación con sus pares.'},
  {id:'bu20',cat:'bueno',txt:'Se adapta a diferentes dinámicas de clase.'},
  {id:'bu21',cat:'bueno',txt:'Maneja correctamente la terminología básica de la asignatura.'},
  {id:'bu22',cat:'bueno',txt:'Sigue instrucciones y consulta cuando tiene dudas.'},
  {id:'bu23',cat:'bueno',txt:'Demuestra habilidades de comunicación adecuadas.'},
  {id:'bu24',cat:'bueno',txt:'Gestiona el tiempo de forma aceptable.'},
  {id:'bu25',cat:'bueno',txt:'Evidencia responsabilidad en el cuidado de materiales.'},

  // --- A mejorar (25)
  {id:'am1',cat:'amejorar',txt:'Necesita mejorar la gestión del tiempo para cumplir con los plazos.'},
  {id:'am2',cat:'amejorar',txt:'Conviene reforzar hábitos de estudio y planificación.'},
  {id:'am3',cat:'amejorar',txt:'Se sugiere mayor participación en las discusiones de clase.'},
  {id:'am4',cat:'amejorar',txt:'Requiere profundizar en conceptos clave para afianzar aprendizajes.'},
  {id:'am5',cat:'amejorar',txt:'Debe mejorar la claridad y prolijidad en la presentación de trabajos.'},
  {id:'am6',cat:'amejorar',txt:'Le beneficiaría pedir apoyo cuando surgen dificultades.'},
  {id:'am7',cat:'amejorar',txt:'Sería positivo que revise instrucciones antes de entregar.'},
  {id:'am8',cat:'amejorar',txt:'Necesita sostener la atención durante explicaciones extensas.'},
  {id:'am9',cat:'amejorar',txt:'Se recomienda practicar la argumentación de sus ideas.'},
  {id:'am10',cat:'amejorar',txt:'Debería participar más activamente en trabajos grupales.'},
  {id:'am11',cat:'amejorar',txt:'Conviene mejorar la organización de sus materiales.'},
  {id:'am12',cat:'amejorar',txt:'Debe cuidar la asistencia y puntualidad.'},
  {id:'am13',cat:'amejorar',txt:'Le falta consistencia en el cumplimiento de tareas.'},
  {id:'am14',cat:'amejorar',txt:'Podría beneficiarse de estrategias de lectura comprensiva.'},
  {id:'am15',cat:'amejorar',txt:'Es necesario revisar ortografía y redacción.'},
  {id:'am16',cat:'amejorar',txt:'Debería solicitar realimentación para mejorar productos.'},
  {id:'am17',cat:'amejorar',txt:'Conviene practicar el uso de terminología específica.'},
  {id:'am18',cat:'amejorar',txt:'Le cuesta priorizar tareas en actividades de largo plazo.'},
  {id:'am19',cat:'amejorar',txt:'Debe mejorar la concentración en entornos con distracciones.'},
  {id:'am20',cat:'amejorar',txt:'Se sugiere asistir a instancias de apoyo cuando estén disponibles.'},
  {id:'am21',cat:'amejorar',txt:'Requiere mejorar la escucha activa de consignas.'},
  {id:'am22',cat:'amejorar',txt:'Necesita mayor constancia en el estudio domiciliario.'},
  {id:'am23',cat:'amejorar',txt:'Conviene reforzar el respeto por los tiempos de los demás.'},
  {id:'am24',cat:'amejorar',txt:'Le beneficiaría planificar metas semanales realistas.'},
  {id:'am25',cat:'amejorar',txt:'Debe mejorar la calidad de las fuentes utilizadas.'},

  // --- Dificultan (25)
  {id:'di1',cat:'dificultan',txt:'Llega tarde de forma reiterada, afectando el inicio de actividades.'},
  {id:'di2',cat:'dificultan',txt:'Interrumpe la clase con comentarios fuera de lugar.'},
  {id:'di3',cat:'dificultan',txt:'Presenta conductas que distraen a sus compañeros.'},
  {id:'di4',cat:'dificultan',txt:'No respeta turnos de palabra o acuerdos básicos de convivencia.'},
  {id:'di5',cat:'dificultan',txt:'Entrega tareas incompletas o fuera de plazo con frecuencia.'},
  {id:'di6',cat:'dificultan',txt:'Muestra resistencia a seguir instrucciones establecidas.'},
  {id:'di7',cat:'dificultan',txt:'Su inasistencia perjudica la continuidad de los aprendizajes.'},
  {id:'di8',cat:'dificultan',txt:'No utiliza adecuadamente los recursos tecnológicos asignados.'},
  {id:'di9',cat:'dificultan',txt:'Se niega a trabajar en equipo o asumir responsabilidades.'},
  {id:'di10',cat:'dificultan',txt:'Manifiesta desinterés constante por las actividades propuestas.'},
  {id:'di11',cat:'dificultan',txt:'Usa lenguaje inadecuado que afecta la convivencia.'},
  {id:'di12',cat:'dificultan',txt:'Se observan copias o plagio en algunas entregas.'},
  {id:'di13',cat:'dificultan',txt:'Reacciona de forma impulsiva ante correcciones.'},
  {id:'di14',cat:'dificultan',txt:'Dificultades sostenidas para concentrarse en tareas simples.'},
  {id:'di15',cat:'dificultan',txt:'Presenta reiteradas faltas de respeto hacia compañeros.'},
  {id:'di16',cat:'dificultan',txt:'No trae materiales necesarios pese a recordatorios.'},
  {id:'di17',cat:'dificultan',txt:'Rechaza instancias de apoyo o mediación.'},
  {id:'di18',cat:'dificultan',txt:'Se niega a entregar evaluaciones o abandona actividades.'},
  {id:'di19',cat:'dificultan',txt:'Provoca conflictos que rompen el clima de trabajo.'},
  {id:'di20',cat:'dificultan',txt:'Manipula dispositivos ajenos sin permiso.'},
  {id:'di21',cat:'dificultan',txt:'No respeta los tiempos de los demás en exposiciones/discusiones.'},
  {id:'di22',cat:'dificultan',txt:'Ocasiona ruidos o bromas que imposibilitan avanzar.'},
  {id:'di23',cat:'dificultan',txt:'Se ausenta del aula sin autorización.'},
  {id:'di24',cat:'dificultan',txt:'No realiza correcciones pese a múltiples devoluciones.'},
  {id:'di25',cat:'dificultan',txt:'Descuida el cuidado del mobiliario o el espacio común.'},
];
