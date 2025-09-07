import { loadDB, saveDB, uid, fmtDate, escapeCSV } from './utils.js';

export function renderReceiptView(container, modalAPI){
  // render receipt form + inventory table into container (element)
  container.innerHTML = `
    <div class="panel">
      <h3>Penerimaan Barang</h3>
      <div class="grid-2" style="margin-top:10px">
        <div class="field"><label>Kode Barang</label><input id="rcpCode" placeholder="BRG-001"></div>
        <div class="field"><label>Nama Barang</label><input id="rcpName" placeholder="Cat Tembok 10L"></div>
        <div class="field"><label>Kuantitas</label><input id="rcpQty" type="number" min="1" value="1"></div>
        <div style="align-self:end"><button id="rcpAdd" class="btn">Tambah Penerimaan</button></div>
      </div>
    </div>
    <div class="panel">
      <h3>Inventori</h3>
      <div class="table-wrap"><table id="tblInventory"><thead><tr><th>No</th><th>Kode</th><th>Nama</th><th>Qty</th><th>Aksi</th></tr></thead><tbody></tbody></table></div>
    </div>
  `;
  const db = loadDB();
  function renderInventory(){
    const tbody = container.querySelector('#tblInventory tbody');
    tbody.innerHTML = '';
    loadDB().inventory.forEach((it,i)=>{
      const tr = document.createElement('tr');
      const cls = it.qty <=5 ? 'b-danger' : (it.qty<15 ? 'b-warn':'b-ok');
      tr.innerHTML = `<td>${i+1}</td><td>${it.code}</td><td>${it.name}</td><td><span class="badge ${cls}">${it.qty}</span></td>
        <td><div class="tools"><button class="btn ghost" data-edit="${it.code}">Edit</button><button class="btn secondary" data-del="${it.code}">Hapus</button></div></td>`;
      tbody.appendChild(tr);
    });
  }
  // add event
  container.querySelector('#rcpAdd').addEventListener('click', ()=>{
    const code = container.querySelector('#rcpCode').value.trim();
    const name = container.querySelector('#rcpName').value.trim();
    const qty = Number(container.querySelector('#rcpQty').value) || 0;
    if(!code||!name||qty<=0) return alert('Lengkapi data penerimaan.');
    const db = loadDB();
    let itm = db.inventory.find(x=>x.code===code);
    if(!itm){ itm = {code,name,qty}; db.inventory.push(itm); } else { itm.name=name; itm.qty = Number(itm.qty||0)+qty; }
    db.receipts.push({id:uid(),date:new Date().toISOString(),code,name,qty,note:'Receipt'});
    saveDB(db);
    container.querySelector('#rcpCode').value=''; container.querySelector('#rcpName').value=''; container.querySelector('#rcpQty').value=1;
    renderInventory();
  });
  // table actions (edit/delete)
  container.addEventListener('click', (e)=>{
    const edit = e.target.closest('[data-edit]');
    const del = e.target.closest('[data-del]');
    if(edit){
      const code = edit.getAttribute('data-edit');
      const db = loadDB(); const itm = db.inventory.find(x=>x.code===code);
      modalAPI.showModal('Edit Barang', `<div class="field"><label>Kode</label><input id="mCode" value="${itm.code}" disabled></div>
        <div class="field"><label>Nama</label><input id="mName" value="${itm.name}"></div><div class="field"><label>Qty</label><input id="mQty" type="number" value="${itm.qty}"></div>`, ()=>{
        const db2 = loadDB(); const it2 = db2.inventory.find(x=>x.code===code);
        it2.name = document.getElementById('mName').value.trim();
        it2.qty = Number(document.getElementById('mQty').value) || 0;
        saveDB(db2); modalAPI.closeModal(); renderInventory();
      });
    } else if(del){
      const code = del.getAttribute('data-del');
      if(!confirm('Hapus barang ini?')) return;
      const db = loadDB(); db.inventory = db.inventory.filter(x=>x.code!==code); saveDB(db); renderInventory();
    }
  });
  renderInventory();
}
