import { initDB, loadDB } from './utils.js';
import { wireUI } from './ui.js';
import { renderReceiptView } from './gudang.js';
import { renderMasterItems } from './master.js';
import { renderOutletsView } from './outlet.js';
import { renderReportsView } from './laporan.js';
import { renderSettingsView } from './settings.js';

initDB(); // ensure seed
const modalAPI = wireUI({ onViewChange: (v)=> showView(v) });

// place to track DOM view containers
const VIEWS = {
  dashboard: document.getElementById('view-dashboard'),
  receipt: document.getElementById('view-receipt'),
  transfer: document.getElementById('view-transfer'),
  items: document.getElementById('view-items'),
  outlets: document.getElementById('view-outlets'),
  reports: document.getElementById('view-reports'),
  settings: document.getElementById('view-settings')
};

// minimal dashboard render
function renderDashboard(){
  const db = loadDB();
  VIEWS.dashboard.innerHTML = `
    <div class="cards">
      <div class="card"><div class="label">Jenis Barang</div><div class="value">${db.inventory.length}</div></div>
      <div class="card"><div class="label">Total Stok</div><div class="value">${db.inventory.reduce((a,b)=>a+Number(b.qty||0),0)}</div></div>
      <div class="card"><div class="label">Penerimaan</div><div class="value">${db.receipts.length}</div></div>
      <div class="card"><div class="label">Transfer</div><div class="value">${db.transfers.length}</div></div>
      <div class="card"><div class="label">Outlet</div><div class="value">${db.outlets.length}</div></div>
      <div class="card"><div class="label">Pengguna</div><div class="value">1</div></div>
    </div>
    <div class="panel"><h3>Aksi Cepat</h3><div class="tools" style="margin-top:8px"><button class="btn" data-go="receipt">Penerimaan</button><button class="btn" data-go="transfer">Transfer</button><button class="btn ghost" data-go="items">Master Barang</button><button class="btn ghost" data-go="reports">Laporan</button></div></div>
  `;
  VIEWS.dashboard.querySelectorAll('[data-go]').forEach(b=> b.addEventListener('click', ()=> showView(b.getAttribute('data-go'))));
}

function showView(name){
  Object.keys(VIEWS).forEach(k => VIEWS[k].classList.toggle('hidden', k !== name));
  // render lazy
  if(name === 'dashboard') renderDashboard();
  if(name === 'receipt') renderReceiptView(VIEWS.receipt, modalAPI);
  if(name === 'transfer') {
    // reuse receipt view for transfer or create UI here:
    VIEWS.transfer.innerHTML = `<div class="panel"><h3>Transfer</h3></div>`;
    // if you want full transfer form, you can implement similar to gudang and use outlets select
  }
  if(name === 'items') renderMasterItems(VIEWS.items, modalAPI);
  if(name === 'outlets') renderOutletsView(VIEWS.outlets, modalAPI);
  if(name === 'reports') renderReportsView(VIEWS.reports);
  if(name === 'settings') renderSettingsView(VIEWS.settings);
  // set URL hash
  location.hash = name;
}

// on start
const start = (location.hash || '#dashboard').replace('#','');
showView(start);
document.getElementById('year').textContent = new Date().getFullYear();
