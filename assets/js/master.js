import { loadDB, saveDB } from './utils.js';

export function renderMasterItems(container, modalAPI){
  container.innerHTML = `
    <div class="panel">
      <h3>Master Barang</h3>
      <div class="row" style="gap:8px;margin-top:8px">
        <div class="field" style="flex:1"><label>Kode</label><input id="itCode"></div>
        <div class="field" style="flex:2"><label>Nama</label><input id="itName"></div>
        <div style="align-self:end"><button id="itAdd" class="btn">Tambah Barang</button></div>
      </div>
    </div>
    <div class="panel"><h3>Daftar Barang</h3><div class="table-wrap"><table id="tblItems"><thead><tr><th>No</th><th>Kode</th><th>Nama</th><th>Qty</th><th>Aksi</th></tr></thead><tbody></tbody></table></div></div>
  `;
  function render(){
    const tbody = container.querySelector('#tblItems tbody'); tbody.innerHTML='';
    const db = loadDB();
    db.inventory.forEach((it,i)=>{
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${i+1}</td><td>${it.code}</td><td>${it.name}</td><td>${it.qty}</td>
        <td><div class="tools"><button class="btn ghost" data-edit="${it.code}">Edit</button><button class="btn secondary" data-del="${it.code}">Hapus</button></div></td>`;
      tbody.appendChild(tr);
    });
  }
  container.querySelector('#itAdd').addEventListener('click', ()=>{
    const code = container.querySelector('#itCode').value.trim(), name = container.querySelector('#itName').value.trim();
    if(!code||!name) return alert('Isi kode & nama');
    const db = loadDB();
    if(db.inventory.some(x=>x.code===code)) return alert('Kode sudah ada');
    db.inventory.push({code,name,qty:0}); saveDB(db); container.querySelector('#itCode').value=''; container.querySelector('#itName').value=''; render();
  });
  container.addEventListener('click', (e)=>{
    const edit = e.target.closest('[data-edit]');
    const del = e.target.closest('[data-del]');
    if(edit){
      const code = edit.getAttribute('data-edit');
      const db = loadDB(); const it = db.inventory.find(x=>x.code===code);
      modalAPI.showModal('Edit Barang', `<div class="field"><label>Kode</label><input id="muCode" value="${it.code}" disabled></div><div class="field"><label>Nama</label><input id="muName" value="${it.name}"></div><div class="field"><label>Qty</label><input id="muQty" type="number" value="${it.qty}"></div>`, ()=>{
        const db2 = loadDB(); const it2 = db2.inventory.find(x=>x.code===code);
        it2.name = document.getElementById('muName').value.trim(); it2.qty = Number(document.getElementById('muQty').value)||0;
        saveDB(db2); modalAPI.closeModal(); render();
      });
    } else if(del){
      const code = del.getAttribute('data-del');
      if(!confirm('Hapus barang?')) return;
      const db = loadDB(); db.inventory = db.inventory.filter(x=>x.code!==code); saveDB(db); render();
    }
  });
  render();
}
