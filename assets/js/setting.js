import { loadDB, saveDB } from './utils.js';

export function renderSettingsView(container){
  const db = loadDB();
  container.innerHTML = `
    <div class="panel"><h3>Pengaturan</h3>
      <div class="grid-2">
        <div class="field"><label>Username</label><input id="setUser" value="${db.user.username || ''}"></div>
        <div class="field"><label>Password</label><input id="setPass" type="password" placeholder="••••••"></div>
        <div class="row" style="align-items:center"><input id="setWidgets" type="checkbox" ${db.user.showWidgets !== false ? 'checked' : ''}><label for="setWidgets" style="margin-left:8px">Tampilkan Widget Dashboard</label></div>
        <div style="align-self:end"><button id="setSave" class="btn">Simpan</button></div>
      </div>
      <div id="saveNote" class="muted" style="margin-top:8px"></div>
    </div>
  `;
  container.querySelector('#setSave').addEventListener('click', ()=>{
    const db2 = loadDB();
    const u = container.querySelector('#setUser').value.trim(); const p = container.querySelector('#setPass').value;
    if(u) db2.user.username = u; if(p) db2.user.password = p; db2.user.showWidgets = container.querySelector('#setWidgets').checked;
    saveDB(db2); container.querySelector('#saveNote').textContent = 'Tersimpan.'; document.getElementById('currentUser').textContent = '👤 ' + db2.user.username;
  });
}
