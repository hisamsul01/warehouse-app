// helpers: load/save localStorage, format date, CSV export
export const DB_KEY = 'whm.modular.v1';
export function initDB(seed){
  if(!localStorage.getItem(DB_KEY)){
    localStorage.setItem(DB_KEY, JSON.stringify(seed || {
      user:{username:'admin',password:'admin',showWidgets:true,lang:'id'},
      outlets:[{code:'OT-01',name:'Outlet Utama'}],
      inventory:[{code:'BRG-001',name:'Cat Tembok 10L',qty:12}],
      receipts:[], transfers:[]
    }));
  }
}
export function loadDB(){ return JSON.parse(localStorage.getItem(DB_KEY)); }
export function saveDB(obj){ localStorage.setItem(DB_KEY, JSON.stringify(obj)); }
export function uid(){ return 'id'+Math.random().toString(36).slice(2,9); }
export function fmtDate(iso){ return new Date(iso).toLocaleString(); }
export function exportCSVFile(filename, rows){
  const blob = new Blob([rows.join('\n')], {type:'text/csv'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
}
export function escapeCSV(s){ if(s==null) return ''; s = String(s); return /[",\n]/.test(s) ? `"${s.replace(/"/g,'""')}"` : s; }
