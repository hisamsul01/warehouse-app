// UI helpers: sidebar, modal, routing glue
export function wireUI({onViewChange}){
  const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');
  menuToggle.addEventListener('click', ()=> sidebar.classList.toggle('show'));
  // submenu toggles
  document.querySelectorAll('.submenu-toggle').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      e.preventDefault(); btn.parentElement.classList.toggle('open');
    });
  });
  // nav links
  document.getElementById('nav').addEventListener('click', (e)=>{
    const a = e.target.closest('[data-view]');
    if(!a) return;
    e.preventDefault();
    if(window.innerWidth < 900) sidebar.classList.remove('show');
    const view = a.getAttribute('data-view');
    document.querySelectorAll('#nav [data-view]').forEach(x=> x.classList.toggle('active', x === a));
    onViewChange && onViewChange(view);
  });
  // modal controls
  const modal = document.getElementById('modalBackdrop');
  document.getElementById('modalCancel').addEventListener('click', ()=> closeModal());
  function showModal(title, html, onSave){
    modal.classList.remove('hidden');
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalBody').innerHTML = html;
    document.getElementById('modalOk').onclick = ()=>{
      onSave && onSave();
    };
  }
  function closeModal(){
    modal.classList.add('hidden');
    document.getElementById('modalBody').innerHTML = '';
    document.getElementById('modalOk').onclick = null;
  }
  return { showModal, closeModal };
}
