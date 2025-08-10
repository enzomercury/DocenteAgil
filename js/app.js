import { firebaseConfig } from './config.js';
import { INFORME_DESCRIPCIONES, PRIVACY_TEXT } from './data.js';

// ====== Firebase Auth (Módulos CDN) ======
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import {
  getAuth, onAuthStateChanged, signInWithEmailAndPassword,
  createUserWithEmailAndPassword, signOut
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ====== Util ======
const $ = sel => document.querySelector(sel);
const $$ = sel => document.querySelectorAll(sel);
const yearEl = $('#year'); if (yearEl) yearEl.textContent = new Date().getFullYear();

const uidKey = () => auth.currentUser ? auth.currentUser.uid : 'guest';
const ls = {
  get: (k, def=null) => JSON.parse(localStorage.getItem(k) || JSON.stringify(def)),
  set: (k, v) => localStorage.setItem(k, JSON.stringify(v)),
};
const ns = (key) => `da_${uidKey()}_${key}`;

// ====== Auth UI ======
const authDialog = $('#authDialog');
const btnLoginOpen = $('#btnLoginOpen');
const btnLogout = $('#btnLogout');
const authUserEmail = $('#authUserEmail');

const tabLogin = $('#tabLogin');
const tabRegister = $('#tabRegister');
const authLogin = $('#authLogin');
const authRegister = $('#authRegister');
const authMsg = $('#authMsg');

btnLoginOpen.addEventListener('click', () => authDialog.showModal());
btnLogout.addEventListener('click', () => signOut(auth));

tabLogin.addEventListener('click', () => {
  tabLogin.className = 'px-3 py-2 rounded-lg bg-brand.green text-white';
  tabRegister.className = 'px-3 py-2 rounded-lg bg-gray-200';
  authLogin.classList.remove('hidden');
  authRegister.classList.add('hidden');
  authMsg.textContent = '';
});

tabRegister.addEventListener('click', () => {
  tabRegister.className = 'px-3 py-2 rounded-lg bg-brand.green text-white';
  tabLogin.className = 'px-3 py-2 rounded-lg bg-gray-200';
  authRegister.classList.remove('hidden');
  authLogin.classList.add('hidden');
  authMsg.textContent = '';
});

$('#btnDoLogin').addEventListener('click', async () => {
  authMsg.textContent = '';
  try {
    await signInWithEmailAndPassword(auth, $('#loginEmail').value, $('#loginPass').value);
    authDialog.close();
  } catch (e) {
    authMsg.textContent = e.message;
  }
});

$('#btnDoRegister').addEventListener('click', async () => {
  authMsg.textContent = '';
  try {
    await createUserWithEmailAndPassword(auth, $('#regEmail').value, $('#regPass').value);
    authDialog.close();
  } catch (e) {
    authMsg.textContent = e.message;
  }
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    authUserEmail.textContent = user.email;
    authUserEmail.classList.remove('hidden');
    btnLogout.classList.remove('hidden');
    btnLoginOpen.classList.add('hidden');
    refreshBitacora();
    renderCalendar();
  } else {
    authUserEmail.classList.add('hidden');
    btnLogout.classList.add('hidden');
    btnLoginOpen.classList.remove('hidden');
    refreshBitacora();
    renderCalendar();
  }
});

// ====== Política de privacidad ======
$('#privacyContent').innerHTML = PRIVACY_TEXT;

// ====== Planificador ======
const planFields = {
  tipo: () => $('#planType').value,
  asignatura: () => $('#pf_asignatura').value.trim(),
  tema: () => $('#pf_tema').value.trim(),
  curso: () => $('#pf_curso').value.trim(),
  profesor: () => $('#pf_profesor').value.trim(),
  contenidos: () => $('#pf_contenidos').value.trim(),
  metas: () => $('#pf_metas').value.trim(),
  compGen: () => $('#pf_comp_gen').value.trim(),
  compEsp: () => $('#pf_comp_esp').value.trim(),
  otro: () => $('#pf_otro').value.trim(),
};

function buildPlanHTML() {
  return `
  <div id="planDoc">
    <h2 style="margin:0 0 8px 0">Planificación ${planFields.tipo().toUpperCase()}</h2>
    <p><strong>Asignatura:</strong> ${planFields.asignatura()}</p>
    <p><strong>Tema:</strong> ${planFields.tema()}</p>
    <p><strong>Curso:</strong> ${planFields.curso()}</p>
    <p><strong>Profesor/a:</strong> ${planFields.profesor()}</p>
    <h3>Contenidos</h3><pre>${planFields.contenidos()}</pre>
    <h3>Metas de aprendizaje</h3><pre>${planFields.metas()}</pre>
    <h3>Competencias generales</h3><pre>${planFields.compGen()}</pre>
    <h3>Competencias específicas</h3><pre>${planFields.compEsp()}</pre>
    <h3>Otro</h3><pre>${planFields.otro()}</pre>
  </div>`;
}

$('#btnPlanPreview').addEventListener('click', () => {
  $('#planPreviewContent').innerHTML = buildPlanHTML();
  $('#planPreview').classList.remove('hidden');
});

$('#btnPlanPDF').addEventListener('click', () => {
  const element = document.createElement('div');
  element.innerHTML = buildPlanHTML();
  html2pdf().set({ filename: `Plan_${planFields.asignatura()}_${planFields.tipo()}.pdf`}).from(element).save();
});

$('#btnPlanBitacora').addEventListener('click', () => {
  const entries = ls.get(ns('bitacora'), []);
  entries.unshift({
    id: crypto.randomUUID(),
    type: 'plan',
    title: `Plan: ${planFields.asignatura()} (${planFields.tipo()})`,
    html: buildPlanHTML(),
    ts: Date.now()
  });
  ls.set(ns('bitacora'), entries);
  refreshBitacora();
});

// ====== IA Planificador (mock + endpoint opcional) ======
function mockIAPlanSuggestions(prompt) {
  const base = [
    'Apertura con activación de saberes previos (5-7 min).',
    'Lectura guiada con subrayado y glosario colaborativo (10-12 min).',
    'Actividad práctica en equipos con roles rotativos (15-20 min).',
    'Cierre metacognitivo con ticket de salida (3-5 min).'
  ];
  const adapt = [];
  const p = `${planFields.asignatura()} | ${planFields.tema()} | ${planFields.curso()} | ${prompt}`.toLowerCase();
  if (p.includes('baja visión')) adapt.push('Proveer materiales con alto contraste, tipografía ampliada y lectura en voz alta.');
  if (p.includes('tdah')) adapt.push('Fragmentar consignas y tiempos breves con pausas activas.');
  if (p.includes('tea')) adapt.push('Estructurar la clase con anticipadores visuales y lenguaje literal.');
  if (p.includes('historia')) adapt.push('Usar línea de tiempo visual y análisis de fuentes primarias simples.');
  if (p.includes('computación')) adapt.push('Prototipar en seudocódigo y testear en parejas (programación por pares).');

  return `
  <h4>Sugerencia de secuencia</h4>
  <ol>${base.map(s=>`<li>${s}</li>`).join('')}</ol>
  ${adapt.length?`<h4>Adaptaciones</h4><ul>${adapt.map(a=>`<li>${a}</li>`).join('')}</ul>`:''}
  <h4>Evaluación</h4>
  <ul>
    <li>Rúbrica breve (criterios: comprensión, participación, producto).</li>
    <li>Autoevaluación de proceso (2 ítems).</li>
  </ul>`;
}

async function runIAPlan() {
  const ep = $('#iaEndpoint').value.trim();
  const key = $('#iaApiKey').value.trim();
  const userPrompt = $('#iaPromptPlan').value.trim();

  $('#iaPlanOutput').innerHTML = '<p class="text-gray-500">Generando sugerencias…</p>';

  // Si hay endpoint, intentamos usarlo (debe aceptar POST {prompt, context} y devolver {html})
  if (ep && key) {
    try {
      const body = {
        prompt: userPrompt,
        context: {
          asignatura: planFields.asignatura(),
          tema: planFields.tema(),
          curso: planFields.curso()
        }
      };
      const res = await fetch(ep, {
        method:'POST',
        headers: { 'Content-Type':'application/json', 'Authorization': `Bearer ${key}` },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error('Error en endpoint IA');
      const data = await res.json();
      $('#iaPlanOutput').innerHTML = data.html || '<p>No hubo respuesta de IA.</p>';
      return;
    } catch (e) {
      $('#iaPlanOutput').innerHTML = `<p class="text-red-600 text-sm">Fallo endpoint IA. Uso del generador local.</p>` + mockIAPlanSuggestions(userPrompt);
      return;
    }
  }

  // Mock local por defecto
  $('#iaPlanOutput').innerHTML = mockIAPlanSuggestions(userPrompt);
}
$('#btnAskIAPlan').addEventListener('click', runIAPlan);

// ====== Generador de Informes ======
const informeList = $('#informeList');
const searchInforme = $('#searchInforme');
const filterInforme = $('#filterInforme');
const informeLibre = $('#informeLibre');

function renderInformesList() {
  const term = searchInforme.value.trim().toLowerCase();
  const filter = filterInforme.value;
  const items = INFORME_DESCRIPCIONES.filter(d => {
    const matchTxt = d.txt.toLowerCase().includes(term);
    const matchCat = filter === 'all' ? true : d.cat === filter;
    return matchTxt && matchCat;
  });
  informeList.innerHTML = items.map(d => `
    <label class="flex items-start gap-2 p-3 bg-white rounded-xl shadow-soft">
      <input type="checkbox" data-id="${d.id}"/>
      <div>
        <div class="text-xs uppercase text-gray-500">${d.cat}</div>
        <div class="">${d.txt}</div>
      </div>
    </label>
  `).join('');
}
renderInformesList();

searchInforme.addEventListener('input', renderInformesList);
filterInforme.addEventListener('change', renderInformesList);

function buildInformeHTML() {
  const checked = [...informeList.querySelectorAll('input[type="checkbox"]:checked')]
    .map(ch => {
      const id = ch.dataset.id;
      const d = INFORME_DESCRIPCIONES.find(x => x.id === id);
      return d ? d.txt : '';
    }).filter(Boolean);
  const libre = informeLibre.value.trim();
  return `
    <div id="informeDoc">
      <h2 style="margin:0 0 8px 0">Informe del estudiante</h2>
      <h3>Descripciones seleccionadas</h3>
      <ul>${checked.map(t=>`<li>${t}</li>`).join('')}</ul>
      ${libre?`<h3>Observaciones del docente</h3><p>${libre}</p>`:''}
    </div>
  `;
}

$('#btnInformePreview').addEventListener('click', () => {
  $('#informePreviewContent').innerHTML = buildInformeHTML();
  $('#informePreview').classList.remove('hidden');
});

$('#btnInformePDF').addEventListener('click', () => {
  const element = document.createElement('div');
  element.innerHTML = buildInformeHTML();
  html2pdf().set({ filename: 'Informe_estudiante.pdf'}).from(element).save();
});

$('#btnInformeBitacora').addEventListener('click', () => {
  const entries = ls.get(ns('bitacora'), []);
  entries.unshift({
    id: crypto.randomUUID(),
    type: 'informe',
    title: `Informe ${new Date().toLocaleDateString()}`,
    html: buildInformeHTML(),
    ts: Date.now()
  });
  ls.set(ns('bitacora'), entries);
  refreshBitacora();
});

// ====== Calendario ======
let calCurrent = new Date(); // mes actual
const calendarTitle = $('#calendarTitle');
const calendarGrid = $('#calendarGrid');
const eventDialog = $('#eventDialog');
const ev_date = $('#ev_date');
const ev_time = $('#ev_time');
const ev_title = $('#ev_title');
const ev_notes = $('#ev_notes');
const ev_save = $('#ev_save');
const ev_delete = $('#ev_delete');
let editingEventId = null; // si edito evento existente

function getEvents() {
  return ls.get(ns('events'), []);
}
function setEvents(arr) {
  ls.set(ns('events'), arr);
}
function renderCalendar() {
  const year = calCurrent.getFullYear();
  const month = calCurrent.getMonth();
  const first = new Date(year, month, 1);
  const start = (first.getDay()+6)%7; // lunes=0
  const days = new Date(year, month+1, 0).getDate();
  calendarTitle.textContent = calCurrent.toLocaleString('es-UY',{month:'long', year:'numeric'});

  calendarGrid.innerHTML = '';
  for (let i=0; i<start; i++) {
    calendarGrid.innerHTML += `<div class="h-24 border rounded-xl bg-gray-50"></div>`;
  }
  const events = getEvents();
  for (let d=1; d<=days; d++) {
    const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const dayEvents = events.filter(e => e.date === dateStr);
    calendarGrid.innerHTML += `
      <div class="h-24 border rounded-xl bg-white p-2 flex flex-col">
        <div class="text-xs text-gray-500">${d}</div>
        <div class="mt-1 flex-1 overflow-auto space-y-1">
          ${dayEvents.map(ev=>`<button data-ev="${ev.id}" class="w-full text-left text-xs px-2 py-1 rounded bg-brand.blueSoft hover:bg-brand.blue/10">${ev.time?ev.time+' - ':''}${ev.title}</button>`).join('')}
        </div>
        <button data-date="${dateStr}" class="mt-1 text-xs px-2 py-1 rounded bg-brand.green text-white">+ Evento</button>
      </div>
    `;
  }

  // Handlers
  [...calendarGrid.querySelectorAll('button[data-date]')].forEach(btn => {
    btn.addEventListener('click', () => {
      editingEventId = null;
      ev_date.value = btn.dataset.date;
      ev_time.value = '';
      ev_title.value = '';
      ev_notes.value = '';
      ev_delete.classList.add('hidden');
      eventDialog.showModal();
    });
  });

  [...calendarGrid.querySelectorAll('button[data-ev]')].forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.ev;
      const ev = getEvents().find(e => e.id === id);
      if (!ev) return;
      editingEventId = ev.id;
      ev_date.value = ev.date;
      ev_time.value = ev.time || '';
      ev_title.value = ev.title;
      ev_notes.value = ev.notes || '';
      ev_delete.classList.remove('hidden');
      eventDialog.showModal();
    });
  });
}
$('#prevMonth').addEventListener('click', ()=>{ calCurrent.setMonth(calCurrent.getMonth()-1); renderCalendar(); });
$('#nextMonth').addEventListener('click', ()=>{ calCurrent.setMonth(calCurrent.getMonth()+1); renderCalendar(); });

ev_save.addEventListener('click', () => {
  const arr = getEvents();
  if (editingEventId) {
    const idx = arr.findIndex(e => e.id === editingEventId);
    if (idx>=0) arr[idx] = { ...arr[idx], date:ev_date.value, time:ev_time.value, title:ev_title.value, notes:ev_notes.value };
  } else {
    arr.push({ id: crypto.randomUUID(), date: ev_date.value, time: ev_time.value, title: ev_title.value, notes: ev_notes.value });
  }
  setEvents(arr);
  eventDialog.close();
  renderCalendar();
});
ev_delete.addEventListener('click', () => {
  if (!editingEventId) return;
  setEvents(getEvents().filter(e => e.id !== editingEventId));
  eventDialog.close();
  renderCalendar();
});

// ====== Bitácora ======
const bitacoraList = $('#bitacoraList');
const bitacoraTitulo = $('#bitacoraTitulo');
$('#btnAddEntry').addEventListener('click', () => {
  const title = bitacoraTitulo.value.trim();
  if (!title) return;
  const entries = ls.get(ns('bitacora'), []);
  entries.unshift({
    id: crypto.randomUUID(),
    type: 'custom',
    title,
    html: `<div><h2>${title}</h2><p>(Entrada creada por el docente)</p></div>`,
    ts: Date.now()
  });
  ls.set(ns('bitacora'), entries);
  bitacoraTitulo.value = '';
  refreshBitacora();
});

function refreshBitacora() {
  const entries = ls.get(ns('bitacora'), []);
  if (!entries.length) {
    bitacoraList.innerHTML = `<div class="col-span-2 text-sm text-gray-500">No hay entradas aún.</div>`;
    return;
  }
  bitacoraList.innerHTML = entries.map(e => `
    <div class="border rounded-2xl p-4 bg-white shadow-soft">
      <div class="flex items-start justify-between gap-2">
        <div>
          <div class="text-xs uppercase text-gray-500">${e.type}</div>
          <h4 class="font-semibold">${e.title}</h4>
          <div class="text-xs text-gray-500">${new Date(e.ts).toLocaleString()}</div>
        </div>
        <div class="flex gap-2">
          <button data-pdf="${e.id}" class="px-3 py-1.5 rounded-lg bg-brand.blue text-white text-xs">PDF</button>
          <button data-view="${e.id}" class="px-3 py-1.5 rounded-lg bg-gray-200 text-xs">Ver</button>
          <button data-del="${e.id}" class="px-3 py-1.5 rounded-lg bg-red-100 text-red-600 text-xs">Borrar</button>
        </div>
      </div>
      <details class="mt-2">
        <summary class="text-sm text-gray-600 cursor-pointer">Mostrar contenido</summary>
        <div class="mt-2 prose max-w-none">${e.html}</div>
      </details>
    </div>
  `).join('');

  // PDF, Ver, Borrar
  [...bitacoraList.querySelectorAll('button[data-pdf]')].forEach(btn=>{
    btn.addEventListener('click', () => {
      const id = btn.dataset.pdf;
      const e = entries.find(x=>x.id===id);
      if (!e) return;
      const element = document.createElement('div');
      element.innerHTML = e.html;
      html2pdf().set({ filename: `${e.title}.pdf`}).from(element).save();
    });
  });
  [...bitacoraList.querySelectorAll('button[data-view]')].forEach(btn=>{
    btn.addEventListener('click', () => {
      const id = btn.dataset.view;
      const e = entries.find(x=>x.id===id);
      if (!e) return;
      const w = window.open('', '_blank');
      w.document.write(`<html><head><title>${e.title}</title></head><body>${e.html}</body></html>`);
      w.document.close();
    });
  });
  [...bitacoraList.querySelectorAll('button[data-del]')].forEach(btn=>{
    btn.addEventListener('click', () => {
      const id = btn.dataset.del;
      const filtered = entries.filter(x=>x.id!==id);
      ls.set(ns('bitacora'), filtered);
      refreshBitacora();
    });
  });
}

// Inicializaciones
refreshBitacora();
renderCalendar();

// ====== Asistente de Inclusión ======
function buildInclusionAdvice({edad, condicion, asignatura, contexto}) {
  const tips = [];
  if (condicion === 'TEA') {
    tips.push('Estructurar la clase con anticipadores visuales y rutinas claras.');
    tips.push('Usar instrucciones cortas, literales y por pasos.');
    tips.push('Ofrecer apoyos visuales y tiempo extra para transiciones.');
  }
  if (condicion === 'TDAH') {
    tips.push('Fragmentar tareas y tiempos; alternar actividades breves.');
    tips.push('Ubicar cerca del docente, reducir distractores, acuerdos de señales.');
  }
  if (condicion === 'Baja visión') {
    tips.push('Alto contraste, tipografías grandes, lectores de pantalla y descripciones verbales.');
  }
  if (condicion === 'Hipoacusia') {
    tips.push('Mantener contacto visual, apoyo visual escrito, chequear comprensión.');
  }
  if (condicion === 'Dislexia') {
    tips.push('Fuente legible, tiempo extra, evaluar oralmente o con apoyos.');
  }
  if (condicion === 'Motora') {
    tips.push('Ajustar materiales y tiempos; permitir usos alternativos de dispositivos.');
  }

  if ((asignatura||'').toLowerCase().includes('comput')) {
    tips.push('Proponer seudocódigo, bloques o ayudas escalonadas para algoritmos.');
    tips.push('Parejas programador-observador con rotación de roles.');
  }
  if ((asignatura||'').toLowerCase().includes('historia')) {
    tips.push('Líneas de tiempo visuales, mapas y fuentes simplificadas con glosario.');
  }

  return `
    <h4>Perfil</h4>
    <ul>
      <li><strong>Edad:</strong> ${edad||'-'}</li>
      <li><strong>Condición:</strong> ${condicion||'-'}</li>
      <li><strong>Asignatura:</strong> ${asignatura||'-'}</li>
    </ul>
    ${contexto?`<h4>Contexto</h4><p>${contexto}</p>`:''}
    <h4>Estrategias sugeridas</h4>
    <ul>${tips.map(t=>`<li>${t}</li>`).join('') || '<li>Ajustes generales de accesibilidad y apoyos visuales.</li>'}</ul>
    <h4>Evaluación</h4>
    <ul>
      <li>Flexibilizar tiempos y formatos de respuesta.</li>
      <li>Rúbrica clara con criterios simples y ejemplos.</li>
    </ul>
  `;
}

$('#btnInclusionIA').addEventListener('click', () => {
  const payload = {
    edad: $('#inc_edad').value,
    condicion: $('#inc_condicion').value,
    asignatura: $('#inc_asignatura').value,
    contexto: $('#inc_contexto').value
  };
  $('#inclusionOutput').innerHTML = buildInclusionAdvice(payload);
});
$('#btnInclusionPDF').addEventListener('click', () => {
  const element = document.createElement('div');
  element.innerHTML = `<div id="incDoc">${$('#inclusionOutput').innerHTML}</div>`;
  html2pdf().set({ filename: 'Inclusion_consejos.pdf'}).from(element).save();
});
