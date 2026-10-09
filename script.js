/* ---------- Helper GA4 ---------- */
function track(eventName, contentId) {
  if (typeof gtag !== 'function') return;
  gtag('event', eventName, {
    content_type: contentId || 'sin_id',
    page_location: window.location.href,
    page_title: document.title
  });
}

/* ---------- Menú móvil ---------- */
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
function setMenu(open) {
  navLinks.classList.toggle('open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
}
menuToggle.addEventListener('click', () => setMenu(!navLinks.classList.contains('open')));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('click', e => {
  if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) setMenu(false);
});

/* ---------- Tabs Distribución ---------- */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    document.getElementById(btn.dataset.tab).classList.add('active');
    track('select_content', 'distribucion_tab_' + btn.dataset.tab);
  });
});

/* ---------- Galería: mostrar más ---------- */
const galleryGrid = document.getElementById('galleryGrid');
const galleryMore = document.getElementById('galleryMore');
galleryGrid.classList.add('collapsed');
galleryMore.addEventListener('click', () => {
  galleryGrid.classList.remove('collapsed');
  galleryMore.parentElement.hidden = true;
  track('select_content', 'galeria_ver_todas');
});

/* ---------- Lightbox con navegación y swipe ---------- */
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
const lbCaption = document.getElementById('lbCaption');
const lbCount = document.getElementById('lbCount');
const lbPrev = document.getElementById('lbPrev');
const lbNext = document.getElementById('lbNext');
let lbItems = [];
let lbIndex = 0;

function lbShow(i) {
  lbIndex = (i + lbItems.length) % lbItems.length;
  const fig = lbItems[lbIndex];
  const img = fig.querySelector('img');
  lbImg.src = img.currentSrc || img.src;
  lbImg.alt = img.alt;
  const cap = fig.dataset.caption || (fig.querySelector('figcaption') || {}).textContent || img.alt;
  lbCaption.textContent = cap;
  const multi = lbItems.length > 1;
  lbCount.textContent = multi ? (lbIndex + 1) + ' / ' + lbItems.length : '';
  lbPrev.hidden = lbNext.hidden = !multi;
}
function lbOpen(fig) {
  // Navega dentro del mismo grupo: galería completa, o la imagen individual (planos, amenidades)
  lbItems = galleryGrid.contains(fig)
    ? Array.from(galleryGrid.querySelectorAll('figure'))
    : [fig];
  lightbox.hidden = false;
  document.body.classList.add('no-scroll');
  lbShow(lbItems.indexOf(fig));
  if (fig.dataset.gaContent) track('select_content', fig.dataset.gaContent);
}
function lbClose() {
  lightbox.hidden = true;
  document.body.classList.remove('no-scroll');
  lbImg.removeAttribute('src');
}
document.querySelectorAll('[data-lightbox]').forEach(fig => {
  fig.addEventListener('click', () => lbOpen(fig));
});
document.getElementById('lbClose').addEventListener('click', lbClose);
lbPrev.addEventListener('click', e => { e.stopPropagation(); lbShow(lbIndex - 1); });
lbNext.addEventListener('click', e => { e.stopPropagation(); lbShow(lbIndex + 1); });
lightbox.addEventListener('click', e => { if (e.target === lightbox) lbClose(); });
document.addEventListener('keydown', e => {
  if (lightbox.hidden) return;
  if (e.key === 'Escape') lbClose();
  if (e.key === 'ArrowLeft') lbShow(lbIndex - 1);
  if (e.key === 'ArrowRight') lbShow(lbIndex + 1);
});
let touchX = null;
lightbox.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
lightbox.addEventListener('touchend', e => {
  if (touchX === null || lbItems.length < 2) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 45) lbShow(lbIndex + (dx < 0 ? 1 : -1));
  touchX = null;
});

/* ---------- Barra fija en celular (aparece al pasar el hero) ---------- */
const mobileBar = document.getElementById('mobileBar');
const heroCta = document.querySelector('.hero-cta');
const contacto = document.getElementById('contacto');
if ('IntersectionObserver' in window) {
  let heroVisible = true, contactVisible = false;
  const update = () => mobileBar.classList.toggle('show', !heroVisible && !contactVisible);
  new IntersectionObserver(([en]) => { heroVisible = en.isIntersecting; update(); }).observe(heroCta);
  new IntersectionObserver(([en]) => { contactVisible = en.isIntersecting; update(); }).observe(contacto);
} else {
  mobileBar.classList.add('show');
}

/* ---------- Ficha: imprimir y compartir ---------- */
function toast(msg) {
  let t = document.querySelector('.toast');
  if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 2200);
}
document.getElementById('printFicha').addEventListener('click', () => window.print());
document.getElementById('shareLink').addEventListener('click', async () => {
  const url = window.location.href.split('#')[0];
  const og = document.querySelector('meta[property="og:title"]');
  const data = { title: document.title, text: og ? og.content : document.title, url };
  try {
    if (navigator.share) { await navigator.share(data); return; }
    await navigator.clipboard.writeText(url);
    toast('Link copiado');
  } catch (err) {
    if (err && err.name === 'AbortError') return;
    window.prompt('Copia el link:', url);
  }
});

/* ---------- FAQ analytics ---------- */
document.querySelectorAll('.faq-item').forEach(item => {
  item.addEventListener('toggle', () => {
    if (item.open) track('select_content', 'faq_' + item.querySelector('summary').textContent.trim());
  });
});

/* ============================================================
   GA4 — EVENTOS DE CONVERSIÓN
   Cualquier elemento con data-ga-event dispara un evento GA4
   usando data-ga-content como identificador del elemento.
   ============================================================ */
document.querySelectorAll('[data-ga-event]').forEach(el => {
  el.addEventListener('click', () => track(el.dataset.gaEvent, el.dataset.gaContent));
});

/* ============================================================
   GA4 — SCROLL TRACKING (25% / 50% / 75% / 100%)
   ============================================================ */
(function scrollTracking(){
  const thresholds = [25, 50, 75, 100];
  const fired = {};
  function onScroll(){
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return;
    const percent = Math.round((scrollTop / docHeight) * 100);
    thresholds.forEach(t => {
      if (percent >= t && !fired[t]) {
        fired[t] = true;
        if (typeof gtag === 'function') {
          gtag('event', 'scroll_depth', { percent_scrolled: t, page_location: window.location.href });
        }
      }
    });
  }
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => { onScroll(); ticking = false; });
      ticking = true;
    }
  }, { passive: true });
})();
