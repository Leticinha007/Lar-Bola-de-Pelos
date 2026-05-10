/* =========================================================
   LAR BOLA DE PELOS — Admin JavaScript
   ========================================================= */

const db = window._db;

let allCats   = [];
let editingId = null;
let pendingFile = null;
let currentPhotoUrl = null;

/* ---------------------------------------------------------
   AUTH
   --------------------------------------------------------- */
async function checkAuth() {
  const { data: { session } } = await db.auth.getSession();
  if (session) {
    showPanel(session.user.email);
  } else {
    showLogin();
  }
}

db.auth.onAuthStateChange((_event, session) => {
  if (session) showPanel(session.user.email);
  else showLogin();
});

function showLogin() {
  document.getElementById('loginWrap').style.display = 'flex';
  document.getElementById('adminWrap').classList.remove('show');
}

function showPanel(email) {
  document.getElementById('loginWrap').style.display = 'none';
  document.getElementById('adminWrap').classList.add('show');
  document.getElementById('adminEmail').textContent = email;
  loadCats();
}

/* Login form */
document.getElementById('loginForm').addEventListener('submit', async e => {
  e.preventDefault();
  const btn = document.getElementById('loginBtn');
  const err = document.getElementById('loginErr');
  err.classList.remove('show');
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Entrando...';

  const { error } = await db.auth.signInWithPassword({
    email:    document.getElementById('loginEmail').value,
    password: document.getElementById('loginPass').value,
  });

  if (error) {
    err.textContent = 'E-mail ou senha incorretos.';
    err.classList.add('show');
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-arrow-right-to-bracket"></i> Entrar';
  }
});

document.getElementById('logoutBtn').addEventListener('click', async () => {
  await db.auth.signOut();
});

/* ---------------------------------------------------------
   LOAD CATS
   --------------------------------------------------------- */
async function loadCats() {
  const { data, error } = await db
    .from('gatos')
    .select('*')
    .order('criado_em', { ascending: false });

  if (error) { console.error(error); return; }
  allCats = data;
  updateStats();
  renderTable(allCats);
}

function updateStats() {
  const disp  = allCats.filter(g => g.disponivel);
  const adot  = allCats.filter(g => g.modo === 'adocao'          || g.modo === 'ambos');
  const padr  = allCats.filter(g => g.modo === 'apadrinhamento'  || g.modo === 'ambos');
  document.getElementById('statTotal').textContent = allCats.length;
  document.getElementById('statDisp').textContent  = disp.length;
  document.getElementById('statAdot').textContent  = adot.length;
  document.getElementById('statPadr').textContent  = padr.length;
}

/* ---------------------------------------------------------
   RENDER TABLE
   --------------------------------------------------------- */
function renderTable(cats) {
  const tbody = document.getElementById('catTableBody');
  if (!cats.length) {
    tbody.innerHTML = `<tr><td colspan="5"><div class="empty-table">
      <i class="fa-solid fa-paw"></i><p>Nenhum gatinho cadastrado ainda.</p>
    </div></td></tr>`;
    return;
  }

  const modoLabel = { adocao: 'Adoção', apadrinhamento: 'Apadrinhar', ambos: 'Ambos' };
  const modoBadge = { adocao: 'badge-adocao', apadrinhamento: 'badge-apadri', ambos: 'badge-ambos' };

  tbody.innerHTML = cats.map(g => `
    <tr>
      <td>
        <div class="tcat-name-wrap">
          <div class="tcat-photo">
            ${g.foto_url ? `<img src="${g.foto_url}" alt="${g.nome}">` : '🐱'}
          </div>
          <div>
            <div class="tcat-name">${g.nome}</div>
            <div class="tcat-age">${g.idade} · ${g.porte}</div>
          </div>
        </div>
      </td>
      <td><span class="badge badge-${g.genero}">${g.genero === 'femea' ? '♀ Fêmea' : '♂ Macho'}</span></td>
      <td><span class="badge ${modoBadge[g.modo]}">${modoLabel[g.modo]}</span></td>
      <td><span class="badge ${g.disponivel ? 'badge-ok' : 'badge-off'}">${g.disponivel ? '✓ Disponível' : '✗ Indisponível'}</span></td>
      <td>
        <div class="tcat-actions" style="justify-content:flex-end;">
          <button class="act-btn edit" title="Editar" onclick="openModal('${g.id}')">
            <i class="fa-solid fa-pen"></i>
          </button>
          <button class="act-btn del" title="Excluir" onclick="deleteCat('${g.id}', '${g.nome}')">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

/* Search */
document.getElementById('searchInput').addEventListener('input', e => {
  const q = e.target.value.toLowerCase();
  renderTable(q ? allCats.filter(g => g.nome.toLowerCase().includes(q)) : allCats);
});

/* ---------------------------------------------------------
   MODAL
   --------------------------------------------------------- */
function openModal(id = null) {
  editingId       = id;
  pendingFile     = null;
  currentPhotoUrl = null;

  const modal    = document.getElementById('modal');
  const form     = document.getElementById('catForm');
  const title    = document.getElementById('modalTitle');

  form.reset();
  resetPhotoUI();
  document.getElementById('saveErr').classList.remove('show');

  if (id) {
    const g = allCats.find(c => c.id === id);
    title.textContent = `Editar — ${g.nome}`;
    document.getElementById('fNome').value     = g.nome;
    document.getElementById('fIdade').value    = g.idade;
    document.getElementById('fGenero').value   = g.genero;
    document.getElementById('fPorte').value    = g.porte;
    document.getElementById('fModo').value     = g.modo;
    document.getElementById('fDesc').value     = g.descricao || '';
    document.getElementById('fDisponivel').checked = g.disponivel;
    updateToggleLabel(g.disponivel);

    document.querySelectorAll('.tag-check').forEach(cb => {
      cb.checked = (g.tags || []).includes(cb.value);
    });

    if (g.foto_url) {
      currentPhotoUrl = g.foto_url;
      document.getElementById('photoPreview').src = g.foto_url;
      document.getElementById('previewWrap').classList.add('show');
    }
  } else {
    title.textContent = 'Novo Gatinho';
    updateToggleLabel(true);
  }

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modal').classList.remove('open');
  document.body.style.overflow = '';
  editingId = null;
  pendingFile = null;
}

document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('cancelBtn').addEventListener('click', closeModal);
document.getElementById('modal').addEventListener('click', e => {
  if (e.target === document.getElementById('modal')) closeModal();
});
document.getElementById('addCatBtn').addEventListener('click', () => openModal());

/* Toggle label */
document.getElementById('fDisponivel').addEventListener('change', e => updateToggleLabel(e.target.checked));
function updateToggleLabel(val) {
  document.getElementById('toggleLabel').textContent = val ? 'Disponível' : 'Indisponível';
}

/* ---------------------------------------------------------
   PHOTO UPLOAD UI
   --------------------------------------------------------- */
const photoInput   = document.getElementById('photoInput');
const photoDrop    = document.getElementById('photoDrop');
const previewWrap  = document.getElementById('previewWrap');
const photoPreview = document.getElementById('photoPreview');
const photoRemove  = document.getElementById('photoRemove');

photoInput.addEventListener('change', e => {
  const file = e.target.files[0];
  if (file) previewFile(file);
});

photoDrop.addEventListener('dragover', e => { e.preventDefault(); photoDrop.classList.add('drag'); });
photoDrop.addEventListener('dragleave', () => photoDrop.classList.remove('drag'));
photoDrop.addEventListener('drop', e => {
  e.preventDefault();
  photoDrop.classList.remove('drag');
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) previewFile(file);
});

photoRemove.addEventListener('click', () => {
  pendingFile     = null;
  currentPhotoUrl = null;
  photoInput.value = '';
  resetPhotoUI();
});

function previewFile(file) {
  pendingFile = file;
  const reader = new FileReader();
  reader.onload = ev => {
    photoPreview.src = ev.target.result;
    previewWrap.classList.add('show');
  };
  reader.readAsDataURL(file);
}

function resetPhotoUI() {
  previewWrap.classList.remove('show');
  photoPreview.src = '';
  document.getElementById('uploadBarWrap').classList.remove('show');
  document.getElementById('uploadBar').style.width = '0%';
}

/* ---------------------------------------------------------
   UPLOAD PHOTO TO STORAGE
   --------------------------------------------------------- */
async function uploadPhoto(file) {
  const ext  = file.name.split('.').pop().toLowerCase() || 'jpg';
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const barWrap = document.getElementById('uploadBarWrap');
  const bar     = document.getElementById('uploadBar');
  barWrap.classList.add('show');
  bar.style.width = '30%';

  const { error } = await db.storage.from('gatos').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type,
  });

  bar.style.width = '90%';
  if (error) { barWrap.classList.remove('show'); throw error; }

  const { data } = db.storage.from('gatos').getPublicUrl(path);
  bar.style.width = '100%';
  setTimeout(() => barWrap.classList.remove('show'), 600);
  return data.publicUrl;
}

/* ---------------------------------------------------------
   SAVE (CREATE / UPDATE)
   --------------------------------------------------------- */
document.getElementById('catForm').addEventListener('submit', async e => {
  e.preventDefault();
  const btn = document.getElementById('saveBtn');
  const err = document.getElementById('saveErr');
  err.classList.remove('show');
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Salvando...';

  try {
    let foto_url = currentPhotoUrl || null;
    if (pendingFile) {
      foto_url = await uploadPhoto(pendingFile);
    }

    const tags = [...document.querySelectorAll('.tag-check:checked')].map(cb => cb.value);

    const payload = {
      nome:       document.getElementById('fNome').value.trim(),
      idade:      document.getElementById('fIdade').value.trim(),
      genero:     document.getElementById('fGenero').value,
      porte:      document.getElementById('fPorte').value,
      modo:       document.getElementById('fModo').value,
      descricao:  document.getElementById('fDesc').value.trim(),
      tags,
      disponivel: document.getElementById('fDisponivel').checked,
      foto_url,
    };

    let error;
    if (editingId) {
      ({ error } = await db.from('gatos').update(payload).eq('id', editingId));
    } else {
      ({ error } = await db.from('gatos').insert(payload));
    }

    if (error) throw error;

    closeModal();
    await loadCats();
  } catch (ex) {
    err.textContent = ex.message || 'Erro ao salvar. Tente novamente.';
    err.classList.add('show');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Salvar';
  }
});

/* ---------------------------------------------------------
   DELETE
   --------------------------------------------------------- */
async function deleteCat(id, nome) {
  if (!confirm(`Tem certeza que quer excluir "${nome}"? Esta ação não pode ser desfeita.`)) return;

  const { error } = await db.from('gatos').delete().eq('id', id);
  if (error) { alert('Erro ao excluir: ' + error.message); return; }
  await loadCats();
}

/* ---------------------------------------------------------
   INIT
   --------------------------------------------------------- */
checkAuth();
