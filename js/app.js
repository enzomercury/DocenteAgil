// js/app.js
import { firebaseConfig } from './config.js?v=6';
import { INFORME_DESCRIPCIONES } from './data.js?v=6';

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import {
  getAuth, onAuthStateChanged, signInWithEmailAndPassword,
  createUserWithEmailAndPassword, signOut
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ==== helpers ====
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);
const yearEl = $('#year'); if (yearEl) yearEl.textContent = new Date().getFullYear();
const uidKey = () => auth.currentUser ? auth.currentUser.uid : 'guest';
const ls = { get:(k,d=null)=>JSON.parse(localStorage.getItem(k)||JSON.stringify(d)), set:(k,v)=>localStorage.setItem(k,JSON.stringify(v)) };
const ns = k => `da_${uidKey()}_${k}`;

/**
 * Genera PDF sin “página en blanco”: monta el contenido offscreen
 * para que html2canvas pueda medir correctamente.
 */
function saveAsPDF(contentEl, filename){
  const h2p = (window && window.html2pdf) ? window.html2pdf : null;
  if(!h2p){ alert('La librería de PDF no cargó. Recargá la página.'); return; }

  // 1) Asegurar un nodo Element (si viene string, convertir)
  let node = contentEl;
  if (typeof contentEl === 'string'){
    const wrap = document.createElement('div');
    wrap.innerHTML = contentEl;
    node = wrap.firstElementChild || wrap;
  }

  // 2) Montar offscreen para que html2canvas calcule tamaño
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-10000px';
  container.style.top = '0';
  // ancho A4 aproximado a 96dpi
  container.style.width = '794px';
  container.style.background = '#ffffff';
  container.style.padding = '24px';
  container.style.boxSizing = 'border-box';
  container.appendChild(node);
  document.body.appendChild(container);

  const opt = {
    filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
    jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' }
  };

  // 3) Generar y limpiar
  h2p().set(opt).from(container).save()
    .then(()=> container.remove())
    .catch(err => {
      console.error('PDF error:', err);
      container.remove();
      alert('No pude generar el PDF. Mirá la consola para más detalles.');
    });
}

// ==== auth ui ====
const authDialog = $('#authDialog');
$('#btnLoginOpen').addEventListener('click', ()=>authDialog.showModal());
$('#btnLogout').addEventListener('click', ()=>signOut(auth));

const tabLogin = $('#tabLogin'), tabRegister = $('#tabRegister');
const authLogin = $('#authLogin'), authRegister = $('#authRegister'), authMsg = $('#authMsg');

tabLogin.addEventListener('click', ()=>{
  tabLogin.className='px-3 py-2 rounded-lg bg-brand-green text-white';
  tabRegister.className='px-3 py-2 rounded-lg bg-gray-200';
  authLogin.classList.remove('hidden'); authRegister.classList.add('hidden'); authMsg.textContent='';
});
tabRegister.addEventListener('click', ()=>{
  tabRegister.className='px-3 py-2 rounded-lg bg-brand-green text-white';
  tabLogin.className='px-3 py-2 rounded-lg bg-gray-200';
  authRegister.classList.remove('hidden'); authLogin.classList.add('hidden'); authMsg.textContent='';
});

$('#btnDoLogin').addEventListener('click', async ()=>{
  authMsg.textContent='';
  try { await signInWithEmailAndPassword(auth, $('#loginEmail').value, $('#loginPass').value); authDialog.close(); }
  catch(e){ authMsg.textContent = e.message; }
});
$('#btnDoRegister').addEventListener('click', async ()=>{
  authMsg.textContent='';
  try { await createUserWithEmailAndPassword(auth, $('#regEmail').value, $('#regPass').value); authDialog.close(); }
  catch(e){ authMsg.textContent = e.message; }
});

onAuthStateChanged(auth, (user)=>{
  const email = $('#authUserEmail'), out = $('#btnLogout'), inb = $('#btnLoginOpen');
  if (user){ email.textContent=user.email; email.classList.remove('hidden'); out.classList.remove('hidden'); inb.classList.add('hidden'); }
  else { email.classList.add('hidden'); out.classList.add('hidden'); inb.classList.remove('hidden'); }
  refreshBitacora(); renderCalendar(); renderInformesList();
});

// ==== planificador ====
const planFields = {
  tipo: ()=>$('#planType').value,
  asignatura: ()=>$('#pf_asignatura').value.trim(),
  tema: ()=>$('#pf_tema').value.trim(),
  curso: ()=>$('#pf_curso').value.trim(),
  profesor: ()=>$('#pf_profesor').value.trim(),
  contenidos: ()=>$('#pf_contenidos').value.trim(),
  metas: ()=>$('#pf_metas').value.trim(),
  compGen: ()=>$('#pf_comp_gen').value.trim(),
  compEsp: ()=>$('#pf_comp_esp').value.trim(),
  otro: ()=>$('#pf_otro').value.trim(),
};
function buildPlanHTML(){
  return `
  <div id="planDoc" style="font-family:Inter,system-ui">
    <h2 style="margin:0 0 8px 0;color:#1B9C85">Planificación ${planFields.tipo().toUpperCase()}</h2>
    <p><strong>Asignatura:</strong> ${planFields.asignatura()}</p>
    <p><strong>Tema:</strong> ${planFields.tema()}</p>
    <p><strong>Curso:</strong> ${planFields.curso()}</p>
    <p><strong>Docente:</strong> ${planFields.profesor()}</p>
    <h3>Contenidos</h3><pre>${planFields.contenidos()}</pre>
    <h3>Metas de aprendizaje</h3><pre>${planFields.metas()}</pre>
    <h3>Competencias generales</h3><pre>${planFields.compGen()}</pre>
    <h3>Competencias específicas</h3><pre>${planFields.compEsp()}</pre>
    <h3>Otro</h3><pre>${planFields.otro()}</pre>
  </div>`;
}
$('#btnPlanPreview').addEventListener('click', ()=>{
  $('#planPreviewContent').innerHTML = buildPlanHTML();
  $('#planPreview').classList.remove('hidden');
});
$('#btnPlanPDF').addEventListener('click', ()=>{
  const el = document.createElement('div'); el.innerHTML = buildPlanHTML();
  saveAsPDF(el, `Plan_${planFields.asignatura()}_${planFields.tipo()}.pdf`);
});
$('#btnPlanBitacora').addEventListener('click', ()=>{
  const entries = ls.get(ns('bitacora'), []);
  entries.unshift({ id:crypto.randomUUID(), type:'plan', title:`Plan: ${planFields.asignatura()} (${planFields.tipo()})`, html:buildPlanHTML(), ts:Date.now() });
  ls.set(ns('bitacora'), entries); refreshBitacora();
});

// IA planificador (mock + endpoint opcional)
function mockIAPlanSuggestions(prompt){
  const base=[ 'Apertura con activación de saberes previos (5–7 min).','Lectura guiada con glosario colaborativo (10–12 min).','Práctica en equipos con roles (15–20 min).','Cierre con ticket de salida (3–5 min).'];
  const adapt=[]; const p=`${planFields.asignatura()}|${planFields.tema()}|${planFields.curso()}|${prompt}`.toLowerCase();
  if(p.includes('baja visión')) adapt.push('Materiales con alto contraste, tipografía ampliada y lectura en voz alta.');
  if(p.includes('tdah')) adapt.push('Tareas fragmentadas, tiempos breves y pausas activas.');
  if(p.includes('tea')) adapt.push('Rutina clara, anticipadores visuales y lenguaje literal.');
  if(p.includes('historia')) adapt.push('Línea de tiempo visual y análisis de fuentes simples.');
  if(p.includes('comput')) adapt.push('Seudocódigo y programación por pares (roles rotativos).');
  return `
    <h3>Secuencia sugerida</h3><ol>${base.map(s=>`<li>${s}</li>`).join('')}</ol>
    ${adapt.length?`<h3>Adaptaciones</h3><ul>${adapt.map(a=>`<li>${a}</li>`).join('')}</ul>`:''}
    <h3>Evaluación</h3><ul><li>Rúbrica breve (comprensión, participación, producto).</li><li>Autoevaluación del proceso (2 ítems).</li></ul>`;
}
async function runIAPlan(){
  const ep=$('#iaEndpoint').value.trim(); const key=$('#iaApiKey').value.trim(); const up=$('#iaPromptPlan').value.trim();
  $('#iaPlanOutput').innerHTML='<p class="text-gray-500">Generando sugerencias…</p>';
  if(ep && key){
    try{
      const res=await fetch(ep,{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${key}`},body:JSON.stringify({prompt:up,context:{asignatura:planFields.asignatura(),tema:planFields.tema(),curso:planFields.curso()}})});
      if(!res.ok) throw new Error('Endpoint IA');
      const data=await res.json(); $('#iaPlanOutput').innerHTML = data.html || '<p>Sin respuesta de IA.</p>'; return;
    }catch(e){
      $('#iaPlanOutput').innerHTML = `<p class="text-red-600 text-sm">Fallo endpoint IA. Uso del generador local.</p>` + mockIAPlanSuggestions(up); return;
    }
  }
  $('#iaPlanOutput').innerHTML = mockIAPlanSuggestions(up);
}
$('#btnAskIAPlan').addEventListener('click', runIAPlan);

// ==== informes ====
const informeList = $('#informeList');
const searchInforme = $('#searchInforme');
const filterInforme = $('#filterInforme');
const informeLibre = $('#informeLibre');
const informeAlumno = $('#informeAlumno');
const informeInstitucion = $('#informeInstitucion');

function renderInformesList(){
  const term = searchInforme.value.trim().toLowerCase();
  const filter = filterInforme.value;
  const items = (INFORME_DESCRIPCIONES || []).filter(d=>{
    const matchTxt = d.txt.toLowerCase().includes(term);
    const matchCat = filter==='all' ? true : d.cat===filter;
    return matchTxt && matchCat;
  });
  informeList.innerHTML = items.map(d=>`
    <label class="flex items-start gap-2 p-3 bg-white rounded-xl shadow-soft border border-brand-blue/10">
      <input type="checkbox" data-id="${d.id}"/>
      <div>
        <div class="text-[10px] tracking-wide uppercase text-brand-blue font-semibold">${d.cat}</div>
        <div>${d.txt}</div>
      </div>
    </label>
  `).join('');
}
searchInforme.addEventListener('input', renderInformesList);
filterInforme.addEventListener('change', renderInformesList);

// build y acciones informe
function buildInformeHTML(){
  const checked = [...informeList.querySelectorAll('input[type="checkbox"]:checked')].map(ch=>{
    const d = INFORME_DESCRIPCIONES.find(x=>x.id===ch.dataset.id);
    return d?d.txt:'';
  }).filter(Boolean);
  const libre = informeLibre.value.trim();
  const alumno = informeAlumno.value.trim();
  const inst = informeInstitucion.value.trim();
  return `
    <div id="informeDoc" style="font-family:Inter,system-ui">
      <h2 style="margin:0 0 8px 0;color:#2563EB">Informe del estudiante</h2>
      ${alumno||inst?`<p><strong>Estudiante:</strong> ${alumno||'-'} &nbsp; | &nbsp; <strong>Institución:</strong> ${inst||'-'}</p>`:''}
      <h3>Descripciones seleccionadas</h3>
      <ul>${checked.map(t=>`<li>${t}</li>`).join('') || '<li>(Sin descripciones seleccionadas)</li>'}</ul>
      ${libre?`<h3>Observaciones del docente</h3><p>${libre}</p>`:''}
    </div>
  `;
}
$('#btnInformePreview').addEventListener('click', ()=>{
  $('#informePreviewContent').innerHTML = buildInformeHTML();
  $('#informePreview').classList.remove('hidden');
});
$('#btnInformePDF').addEventListener('click', ()=>{
  const el=document.createElement('div'); el.innerHTML = buildInformeHTML();
  saveAsPDF(el, 'Informe_estudiante.pdf');
});
$('#btnInformeBitacora').addEventListener('click', ()=>{
  const entries = ls.get(ns('bitacora'), []);
  entries.unshift({ id:crypto.randomUUID(), type:'informe', title:`Informe ${new Date().toLocaleDateString()}`, html:buildInformeHTML(), ts:Date.now() });
  ls.set(ns('bitacora'), entries); refreshBitacora();
});

// ==== calendario ====
let calCurrent = new Date();
const calendarTitle = $('#calendarTitle'), calendarGrid = $('#calendarGrid');
const eventDialog = $('#eventDialog');
const ev_date=$('#ev_date'), ev_time=$('#ev_time'), ev_title=$('#ev_title'), ev_notes=$('#ev_notes']);
const ev_save=$('#ev_save'), ev_delete=$('#ev_delete']);
let editingEventId = null;

function getEvents(){ return ls.get(ns('events'), []); }
function setEvents(a){ ls.set(ns('events'), a); }

function renderCalendar(){
  const year=calCurrent.getFullYear(), month=calCurrent.getMonth();
  const first=new Date(year,month,1), start=(first.getDay()+6)%7, days=new Date(year,month+1,0).getDate();
  calendarTitle.textContent = calCurrent.toLocaleString('es-UY',{month:'long', year:'numeric'});
  calendarGrid.innerHTML='';

  for(let i=0;i<start;i++) calendarGrid.innerHTML += `<div class="h-24 border rounded-xl bg-gray-50"></div>`;

  const events=getEvents();
  for(let d=1; d<=days; d++){
    const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const dayEvents = events.filter(e=>e.date===dateStr);
    calendarGrid.innerHTML += `
      <div class="h-24 border rounded-xl bg-white p-2 relative overflow-hidden">
        <div class="text-xs text-gray-500">${d}</div>
        <button data-date="${dateStr}" class="absolute top-2 right-2 text-xs w-6 h-6 rounded-full bg-brand-green text-white flex items-center justify-center" title="Agregar">+</button>
        <div class="mt-6 h-[70%] overflow-auto space-y-1">
          ${dayEvents.map(ev=>`<button data-ev="${ev.id}" class="w-full text-left text-xs px-2 py-1 rounded bg-brand-blue/10 hover:bg-brand-blue/20">${ev.time?ev.time+' - ':''}${ev.title}</button>`).join('')}
        </div>
      </div>
    `;
  }

  [...calendarGrid.querySelectorAll('button[data-date]')].forEach(btn=>{
    btn.addEventListener('click', ()=>{
      editingEventId = null;
      ev_date.value = btn.dataset.date; ev_time.value=''; ev_title.value=''; ev_notes.value='';
      ev_delete.classList.add('hidden'); eventDialog.showModal();
    });
  });
  [...calendarGrid.querySelectorAll('button[data-ev]')].forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const id=btn.dataset.ev; const ev=getEvents().find(e=>e.id===id); if(!ev) return;
      editingEventId = ev.id; ev_date.value=ev.date; ev_time.value=ev.time||''; ev_title.value=ev.title; ev_notes.value=ev.notes||'';
      ev_delete.classList.remove('hidden'); eventDialog.showModal();
    });
  });
}
$('#prevMonth').addEventListener('click', ()=>{ calCurrent.setMonth(calCurrent.getMonth()-1); renderCalendar(); });
$('#nextMonth').addEventListener('click', ()=>{ calCurrent.setMonth(calCurrent.getMonth()+1); renderCalendar(); });

ev_save.addEventListener('click', ()=>{
  const arr=getEvents();
  if(editingEventId){ const i=arr.findIndex(e=>e.id===editingEventId); if(i>=0) arr[i]={...arr[i],date:ev_date.value,time:ev_time.value,title:ev_title.value,notes:ev_notes.value}; }
  else{ arr.push({id:crypto.randomUUID(),date:ev_date.value,time:ev_time.value,title:ev_title.value,notes:ev_notes.value}); }
  setEvents(arr); eventDialog.close(); renderCalendar();
});
ev_delete.addEventListener('click', ()=>{
  if(!editingEventId) return;
  setEvents(getEvents().filter(e=>e.id!==editingEventId));
  eventDialog.close(); renderCalendar();
});

// ==== bitácora ====
const bitacoraList = $('#bitacoraList');
const bitacoraTitulo = $('#bitacoraTitulo');
const bitacoraContenido = $('#bitacoraContenido');

$('#btnAddEntry').addEventListener('click', ()=>{
  const title=bitacoraTitulo.value.trim(); const body=bitacoraContenido.value.trim();
  if(!title && !body) return;
  const entries = ls.get(ns('bitacora'), []);
  entries.unshift({ id:crypto.randomUUID(), type:'custom', title:title||'Entrada', html:`<div><h2>${title||'Entrada'}</h2><p>${body||'(Sin contenido)'}</p></div>`, ts:Date.now() });
  ls.set(ns('bitacora'), entries);
  bitacoraTitulo.value=''; bitacoraContenido.value='';
  refreshBitacora();
});
function refreshBitacora(){
  const entries = ls.get(ns('bitacora'), []);
  if(!entries.length){ bitacoraList.innerHTML=`<div class="col-span-2 text-sm text-gray-500">No hay entradas aún.</div>`; return; }
  bitacoraList.innerHTML = entries.map(e=>`
    <div class="border rounded-2xl p-4 bg-white shadow-soft">
      <div class="flex items-start justify-between gap-2">
        <div>
          <div class="text-xs uppercase text-gray-500">${e.type}</div>
          <h4 class="font-semibold">${e.title}</h4>
          <div class="text-xs text-gray-500">${new Date(e.ts).toLocaleString()}</div>
        </div>
        <div class="flex gap-2">
          <button data-pdf="${e.id}" class="px-3 py-1.5 rounded-lg bg-brand-blue text-white text-xs">PDF</button>
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

  const entriesRef = entries; // cierre
  [...bitacoraList.querySelectorAll('button[data-pdf]')].forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const e = entriesRef.find(x=>x.id===btn.dataset.pdf); if(!e) return;
      const el=document.createElement('div'); el.innerHTML=e.html; saveAsPDF(el, `${e.title}.pdf`);
    });
  });
  [...bitacoraList.querySelectorAll('button[data-view]')].forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const e = entriesRef.find(x=>x.id===btn.dataset.view); if(!e) return;
      const w=window.open('','_blank'); w.document.write(`<html><head><title>${e.title}</title></head><body>${e.html}</body></html>`); w.document.close();
    });
  });
  [...bitacoraList.querySelectorAll('button[data-del]')].forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const filtered = entriesRef.filter(x=>x.id!==btn.dataset.del);
      ls.set(ns('bitacora'), filtered); refreshBitacora();
    });
  });
}
refreshBitacora();
renderCalendar();
renderInformesList();

// ==== inclusión IA ====
function buildInclusionAdvice({edad, condicion, asignatura, contexto}){
  const tips=[];
  if(condicion==='TEA'){ tips.push('Estructurar la clase con anticipadores visuales y rutinas claras.','Usar instrucciones cortas, literales y por pasos.','Ofrecer apoyos visuales y tiempo extra para transiciones.'); }
  if(condicion==='TDAH'){ tips.push('Fragmentar tareas y tiempos; alternar actividades breves.','Ubicar cerca del docente, reducir distractores y usar señales acordadas.'); }
  if(condicion==='Baja visión'){ tips.push('Alto contraste, tipografías grandes, lectores de pantalla y descripciones verbales.'); }
  if(condicion==='Hipoacusia'){ tips.push('Contacto visual, apoyo escrito, y chequeo frecuente de comprensión.'); }
  if(condicion==='Dislexia'){ tips.push('Fuente legible, tiempo extra, y alternativas de evaluación (oral/assistive tech).'); }
  if(condicion==='Motora'){ tips.push('Ajustar materiales y tiempos; permitir usos alternativos de dispositivos.'); }
  if((asignatura||'').toLowerCase().includes('comput')){ tips.push('Proponer seudocódigo y bloques; programación por pares.'); }
  if((asignatura||'').toLowerCase().includes('historia')){ tips.push('Usar líneas de tiempo, mapas y fuentes simplificadas con glosario.'); }

  return `
    <h3>Perfil</h3>
    <ul><li><strong>Edad:</strong> ${edad||'-'}</li><li><strong>Condición:</strong> ${condicion||'-'}</li><li><strong>Asignatura:</strong> ${asignatura||'-'}</li></ul>
    ${contexto?`<h3>Contexto</h3><p>${contexto}</p>`:''}
    <h3>Estrategias sugeridas</h3>
    <ul>${tips.map(t=>`<li>${t}</li>`).join('') || '<li>Ajustes generales de accesibilidad y apoyos visuales.</li>'}</ul>
    <h3>Evaluación</h3>
    <ul><li>Flexibilizar tiempos y formatos de respuesta.</li><li>Rúbrica clara con criterios simples y ejemplos.</li></ul>
  `;
}
$('#btnInclusionIA').addEventListener('click', ()=>{
  const payload = { edad:$('#inc_edad').value, condicion:$('#inc_condicion').value, asignatura:$('#inc_asignatura').value, contexto:$('#inc_contexto').value };
  $('#inclusionOutput').innerHTML = buildInclusionAdvice(payload);
});
$('#btnInclusionPDF').addEventListener('click', ()=>{
  const el=document.createElement('div'); el.innerHTML=`<div id="incDoc">${$('#inclusionOutput').innerHTML}</div>`;
  saveAsPDF(el, 'Inclusion_consejos.pdf');
});
