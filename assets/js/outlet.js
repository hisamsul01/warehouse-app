import { loadDB, saveDB } from './utils.js';

export function renderOutletsView(container, modalAPI){
  container.innerHTML = `
    <div class="panel">
      <h3>Outlet</h3>
      <div class="row" style="gap:8px;margin-top:8px">
        <div class="field" style="flex:1"><label>Kode</label><input id="outCode"></div>
        <div class="field" style="flex:2"><label>Nama</label><input id="outName"></div>
        <div style="align-self:end"><button id="outAdd" class="btn">Tambah Outlet</button></div>
      </div>
    </div>
    <div class="panel"><h3>Daftar Outlet</h3><div class="table-wrap"><table id="tblOutlets"><thead><tr><th>No</th><th>Kode</th><th>Nama</th><th>Aksi</th></tr></thead><tbody></tbody></table></div></div>
  `;
  function render(){
    const tbody = container.querySelector('#tblOutlets tbody'); tbody.innerHTML='';
    const db = loadDB();
    db.outlets.forEach((o,i)=>{
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${i+1}</td><td>${o.code}</td><td>${o.name}</td><td><div class="tools"><button class="btn ghost" data-edit="${o.code}">Edit</button><button class="btn secondary" data-del="${o.code}">Hapus</button></div></td>`;
      tbody.appendChild(tr);
    });
  }
  container.querySelector('#outAdd').addEventListener('click', ()=>{
    const code = container.querySelector('#outCode').value.trim(), name = container.querySelector('#outName').value.trim();
    if(!code||!name) return alert('Isi kode & nama');
    const db = loadDB(); if(db.outlets.some(x=>x.code===code)) return alert('Kode sudah ada');
    db.outlets.push({code,name}); saveDB(db); container.querySelector('#outCode').value=''; container.querySelector('#outName').value=''; render();
  });
  container.addEventListener('click', (e)=>{
    const edit = e.target.closest('[data-edit]'), del = e.target.closest('[data-del]');
    if(edit){
      const code = edit.getAttribute('data-edit'); const db = loadDB(); const o = db.outlets.find(x=>x.code===code);
      modalAPI.showModal('Edit Outlet', `<div class="field"><label>Kode</label><input id="oCode" value="${o.code}" disabled></div><div class="field"><label>Nama</label><input id="oName" value="${o.name}"></div>`, ()=>{
        const db2 = loadDB(); const oo = db2.outlets.find(x=>x.code===code); oo.name = document.getElementById('oName').value.trim(); saveDB(db2); modalAPI.closeModal(); render();
      });
    } else if(del){
      const code = del.getAttribute('data-del'); if(!confirm('Hapus outlet?')) return; const db = loadDB(); db.outlets = db.outlets.filter(x=>x.code!==code); saveDB(db); render();
    }
  });
  render();
}
