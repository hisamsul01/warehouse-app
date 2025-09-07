import { loadDB } from './utils.js';
import { exportCSVFile, escapeCSV, fmtDate } from './utils.js';

export function renderReportsView(container){
  container.innerHTML = `
    <div class="panel">
      <h3>Laporan Transaksi</h3>
      <div class="row" style="align-items:center;gap:8px">
        <div class="field" style="flex:1"><label>Jenis</label><select id="repType"><option value="all">Semua</option><option value="receipt">Penerimaan</option><option value="transfer">Transfer</option></select></div>
        <div class="field" style="flex:2"><label>Pencarian</label><input id="repSearch" placeholder="Cari kode/nama/outlet..."></div>
        <div class="right tools"><button id="csvExport" class="btn ghost">Export CSV</button><button id="printBtn" class="btn">Print to PDF</button></div>
      </div>
    </div>
    <div class="panel"><div class="table-wrap"><table id="tblReports"><thead><tr><th>No</th><th>Tanggal</th><th>Jenis</th><th>Kode</th><th>Nama</th><th>Qty</th><th>Outlet</th></tr></thead><tbody></tbody></table></div></div>
    <div class="panel"><h3>Ringkasan Pengeluaran</h3><div class="table-wrap"><table id="tblExpenses"><thead><tr><th>Outlet</th><th>Total Qty</th></tr></thead><tbody></tbody></table></div></div>
  `;
  function collect(){
    const db = loadDB();
    const r = db.receipts.map(x=>({...x,type:'receipt'}));
    const t = db.transfers.map(x=>({...x,type:'transfer'}));
    return [...r,...t].sort((a,b)=>new Date(b.date)-new Date(a.date));
  }
  function renderReports(){
    const tbody = container.querySelector('#tblReports tbody'); tbody.innerHTML='';
    const rows = collect(); const tf = container.querySelector('#repType').value; const q = container.querySelector('#repSearch').value.trim().toLowerCase();
    let out = rows.filter(r=> tf==='all' ? true : r.type===tf);
    if(q) out = out.filter(r=> (r.code+' '+r.name+' '+(r.outlet||'')).toLowerCase().includes(q));
    out.forEach((r,i)=>{ const tr=document.createElement('tr'); tr.innerHTML = `<td>${i+1}</td><td>${fmtDate(r.date)}</td><td>${r.type}</td><td>${r.code}</td><td>${r.name}</td><td>${r.qty}</td><td>${r.outlet||'-'}</td>`; tbody.appendChild(tr); });
  }
  function renderExpenses(){
    const tbody = container.querySelector('#tblExpenses tbody'); tbody.innerHTML='';
    const db = loadDB(); const agg = {};
    db.transfers.forEach(t=> agg[t.outlet] = (agg[t.outlet]||0) + Number(t.qty));
    db.outlets.forEach(o=>{ const tr=document.createElement('tr'); tr.innerHTML = `<td>${o.code} — ${o.name}</td><td>${agg[o.code]||0}</td>`; tbody.appendChild(tr); });
  }
  container.querySelector('#repType').addEventListener('change', renderReports);
  container.querySelector('#repSearch').addEventListener('input', renderReports);
  container.querySelector('#csvExport').addEventListener('click', ()=>{
    const rows = [['Tanggal','Jenis','Kode','Nama','Qty','Outlet']];
    container.querySelectorAll('#tblReports tbody tr').forEach(tr=>{
      const cols = Array.from(tr.children).slice(1).map(td=>escapeCSV(td.textContent.trim())); // skip No
      rows.push(cols);
    });
    const csvLines = rows.map(r=> r.join(','));
    exportCSVFile('reports.csv', csvLines);
  });
  container.querySelector('#printBtn').addEventListener('click', ()=> window.print());
  renderReports(); renderExpenses();
}
