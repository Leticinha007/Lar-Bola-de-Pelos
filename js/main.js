/* =========================================================
   LAR BOLA DE PELOS — Main JavaScript
   ========================================================= */

/* ---------------------------------------------------------
   SUPABASE — busca gatos
   --------------------------------------------------------- */
function mapGato(g) {
  return {
    id:       g.id,
    name:     g.nome,
    age:      g.idade,
    gender:   g.genero,
    size:     g.porte,
    desc:     g.descricao,
    tags:     g.tags || [],
    available: g.disponivel,
    modo:     g.modo,
    photoUrl: g.foto_url,
    emoji: '🐱',
    bg: 'linear-gradient(135deg, #1E8080 0%, #4DD9D0 100%)',
  };
}

async function fetchCats(modo = null) {
  const db = window._db;
  if (!db) { console.warn('Supabase não configurado'); return []; }

  let q = db.from('gatos').select('*').eq('disponivel', true).order('criado_em', { ascending: false });
  if (modo) q = q.or(`modo.eq.${modo},modo.eq.ambos`);

  const { data, error } = await q;
  if (error) { console.error(error); return []; }
  return data.map(mapGato);
}

/* ---------------------------------------------------------
   NAVIGATION
   --------------------------------------------------------- */
function initNav() {
  const navbar     = document.querySelector('.navbar');
  const hamburger  = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileClose = document.querySelector('.mobile-close');
  if (!navbar) return;

  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function closeMenu() {
    hamburger?.classList.remove('open');
    mobileMenu?.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
    mobileClose?.addEventListener('click', closeMenu);
    mobileMenu.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', closeMenu));
  }

  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* ---------------------------------------------------------
   BACK TO TOP
   --------------------------------------------------------- */
function initBackTop() {
  const btn = document.querySelector('.back-top');
  if (!btn) return;
  window.addEventListener('scroll', () => btn.classList.toggle('show', window.scrollY > 500), { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ---------------------------------------------------------
   COUNTER ANIMATION
   --------------------------------------------------------- */
function animateCounter(el, target, duration = 1800) {
  const suffix = el.dataset.suffix || '';
  let start = null;
  const step = (ts) => {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target, parseInt(e.target.dataset.count), 2000);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => observer.observe(c));
}

/* ---------------------------------------------------------
   SCROLL REVEAL
   --------------------------------------------------------- */
function initScrollReveal() {
  const els = document.querySelectorAll('[data-reveal]');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
  els.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity .55s cubic-bezier(.4,0,.2,1) ${i * 0.07}s, transform .55s cubic-bezier(.4,0,.2,1) ${i * 0.07}s`;
    obs.observe(el);
  });
}

function reinitReveal() {
  const els = document.querySelectorAll('[data-reveal]');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.05 });
  els.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity .45s ease ${i * 0.07}s, transform .45s ease ${i * 0.07}s`;
    obs.observe(el);
  });
}

/* ---------------------------------------------------------
   CAT GRID RENDERING
   --------------------------------------------------------- */
const TAG_CLASS = {
  carinhosa: 'tag-carinhosa', brincalhona: 'tag-brincalhona',
  independente: 'tag-independente', sociavel: 'tag-sociavel',
  timida: 'tag-timida', docil: 'tag-docil',
  energetica: 'tag-energetica', reservada: 'tag-reservada',
};
const TAG_LABEL = {
  carinhosa: 'Carinhosa', brincalhona: 'Brincalhona',
  independente: 'Independente', sociavel: 'Sociável',
  timida: 'Tímida', docil: 'Dócil',
  energetica: 'Energética', reservada: 'Reservada',
};

function renderCats(container, cats, mode = 'adocao') {
  if (!container) return;

  if (!cats.length) {
    container.innerHTML = `
      <div class="no-cats">
        <i class="fa-solid fa-magnifying-glass"></i>
        <h3>Nenhum gatinho encontrado</h3>
        <p>Tente outro filtro — temos muitos gatinhos esperando por você!</p>
      </div>`;
    return;
  }

  const btnLabel = mode === 'adocao'
    ? (window.t ? window.t('cat.btn.adopt') : 'Quero Adotar')
    : (window.t ? window.t('cat.btn.sponsor') : 'Quero Apadrinhar');
  const btnClass = mode === 'adocao' ? '' : 'gold';
  const btnIcon  = mode === 'adocao' ? 'fa-heart' : 'fa-star';

  container.innerHTML = cats.map(cat => `
    <div class="cat-card" data-reveal>
      <div class="cat-photo" style="background: ${cat.bg};">
        ${cat.photoUrl
          ? `<img src="${cat.photoUrl}" alt="${cat.name}" class="cat-photo-img">`
          : `<span class="cat-emoji">${cat.emoji}</span>`}
        <div class="cat-overlay"></div>
        <button class="btn btn-sm btn-ghost cat-quick-btn">${btnLabel}</button>
        <span class="cat-gender ${cat.gender}">${cat.gender === 'femea' ? '♀ Fêmea' : '♂ Macho'}</span>
      </div>
      <div class="cat-info">
        <h3 class="cat-name">${cat.name}</h3>
        <div class="cat-meta">
          <span class="cat-meta-item"><i class="fa-regular fa-clock"></i> ${cat.age}</span>
          <span class="cat-meta-item"><i class="fa-solid fa-ruler"></i> ${cat.size}</span>
        </div>
        <p class="cat-desc">${cat.desc}</p>
        <div class="cat-tags">
          ${cat.tags.map(t => `<span class="cat-tag ${TAG_CLASS[t] || 'tag-default'}">${TAG_LABEL[t] || t}</span>`).join('')}
        </div>
      </div>
      <button class="cat-card-btn ${btnClass}">
        <i class="fa-solid ${btnIcon}"></i> ${btnLabel}
      </button>
    </div>
  `).join('');
}

function showCatsLoading(container) {
  if (!container) return;
  container.innerHTML = `
    <div class="cats-loading">
      <div class="loading-spinner"></div>
      <p>Carregando gatinhos...</p>
    </div>`;
}

/* ---------------------------------------------------------
   FILTER + FETCH
   --------------------------------------------------------- */
function parseAge(ageStr) {
  if (ageStr.includes('meses') || ageStr.includes('mês')) return parseInt(ageStr) || 6;
  return (parseInt(ageStr) || 1) * 12;
}

async function initFilters(modo = 'adocao') {
  const bar  = document.querySelector('.filter-bar');
  const grid = document.querySelector('.cats-grid');
  if (!bar || !grid) return;

  showCatsLoading(grid);
  const allCats = await fetchCats(modo);

  renderCats(grid, allCats, modo);
  reinitReveal();

  bar.addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    bar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;

    let filtered = allCats;
    if (filter === 'femea')   filtered = allCats.filter(c => c.gender === 'femea');
    if (filter === 'macho')   filtered = allCats.filter(c => c.gender === 'macho');
    if (filter === 'filhote') filtered = allCats.filter(c => parseAge(c.age) < 12);
    if (filter === 'adulto')  filtered = allCats.filter(c => parseAge(c.age) >= 12);

    renderCats(grid, filtered, modo);
    reinitReveal();
  });
}

/* ---------------------------------------------------------
   HOME — FEATURED CATS
   --------------------------------------------------------- */
async function initFeaturedCats() {
  const grid = document.querySelector('.featured-cats-grid');
  if (!grid) return;
  showCatsLoading(grid);
  const cats = await fetchCats();
  renderCats(grid, cats.slice(0, 3), 'adocao');
  reinitReveal();
}

/* ---------------------------------------------------------
   PIX COPY
   --------------------------------------------------------- */
function initPixCopy() {
  document.querySelectorAll('.pix-key, .pix-big-val').forEach(el => {
    el.addEventListener('click', () => {
      const text = el.querySelector('.pix-key-val')?.textContent || el.textContent;
      navigator.clipboard.writeText(text.trim()).then(() => {
        const copied = el.querySelector('.pix-copied');
        if (copied) {
          el.classList.add('copied');
          setTimeout(() => el.classList.remove('copied'), 2000);
        } else {
          const orig = el.textContent;
          el.textContent = '✓ Copiado!';
          el.style.color = 'var(--teal)';
          setTimeout(() => { el.textContent = orig; el.style.color = ''; }, 2000);
        }
      }).catch(() => {});
    });
  });
}

/* ---------------------------------------------------------
   CONTACT FORM — WhatsApp redirect
   --------------------------------------------------------- */
const SUBJECT_LABEL = {
  adocao:          'Quero adotar um gatinho',
  apadrinhamento:  'Quero apadrinhar um gatinho',
  doacao:          'Quero fazer uma doação',
  voluntario:      'Quero ser voluntário',
  duvida:          'Dúvidas gerais',
  outro:           'Outro assunto',
};

function initContactForm() {
  const form = document.querySelector('#contact-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const name    = form.querySelector('#name')?.value.trim()    || '';
    const email   = form.querySelector('#email')?.value.trim()   || '';
    const phone   = form.querySelector('#phone')?.value.trim()   || '';
    const subject = form.querySelector('#subject')?.value        || '';
    const message = form.querySelector('#message')?.value.trim() || '';

    const subjectLabel = SUBJECT_LABEL[subject] || subject;

    const lines = [
      '🐱 *Mensagem do site — Lar Bola de Pelos*',
      '',
      `*Nome:* ${name}`,
      `*E-mail:* ${email}`,
      phone ? `*WhatsApp/Tel:* ${phone}` : null,
      `*Assunto:* ${subjectLabel}`,
      '',
      '*Mensagem:*',
      message,
    ].filter(l => l !== null);

    const text = encodeURIComponent(lines.join('\n'));
    window.open(`https://wa.me/5581999204111?text=${text}`, '_blank', 'noopener');

    form.style.display = 'none';
    document.querySelector('.success-msg')?.classList.add('show');
  });
}

/* ---------------------------------------------------------
   INIT
   --------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initBackTop();
  initCounters();
  initScrollReveal();
  initPixCopy();
  initContactForm();
  document.querySelectorAll('.footer-year').forEach(el => el.textContent = new Date().getFullYear());

  const page = location.pathname.split('/').pop() || 'index.html';
  if (page === 'index.html' || page === '')  initFeaturedCats();
  if (page === 'adocao.html')               initFilters('adocao');
  if (page === 'apadrinhamento.html')        initFilters('apadrinhamento');
});
