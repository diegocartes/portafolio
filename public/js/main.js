(function () {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const ICONS = {
    report: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><rect x="7" y="12" width="3" height="6"/><rect x="12" y="8" width="3" height="10"/><rect x="17" y="4" width="3" height="14"/></svg>',
    code: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
    plug: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 2v6M15 2v6M6 8h12v6a6 6 0 0 1-12 0V8zM12 20v2"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>'
  };

  function pad(n) { return String(n).padStart(2, '0'); }

  function bindText(data) {
    $$('[data-bind]').forEach((el) => {
      const key = el.dataset.bind;
      if (data[key] !== undefined) el.textContent = data[key];
    });
  }

  function renderMetrics(metricas) {
    const ul = $('#heroMetrics');
    if (!ul) return;
    ul.innerHTML = metricas.map((m) => `
      <li>
        <span class="metric__value">${m.valor}</span>
        <span class="metric__label">${m.etiqueta}</span>
      </li>
    `).join('');
  }

  function renderCompetencias(items) {
    const ul = $('#competenciasList');
    if (!ul) return;
    ul.innerHTML = items.map((c) => `<li>${c}</li>`).join('');
  }

  function renderTimeline(items) {
    const ol = $('#timeline');
    if (!ol) return;
    ol.innerHTML = items.map((job, i) => `
      <li class="work__item fade-in${i === 0 ? ' is-open' : ''}" data-index="${i}">
        <div class="work__head">
          <span class="work__num">${pad(i + 1)}</span>
          <div class="work__main">
            <span class="work__company">${job.empresa}</span>
            <h3 class="work__role">${job.cargo}</h3>
          </div>
          <span class="work__period">${job.periodo}</span>
          <span class="work__chev">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
          </span>
        </div>
        <ul class="work__list">
          ${job.logros.map((l) => `<li>${l}</li>`).join('')}
        </ul>
      </li>
    `).join('');

    $$('.work__item').forEach((item) => {
      item.addEventListener('click', (e) => {
        if (e.target.closest('a')) return;
        item.classList.toggle('is-open');
      });
    });
  }

  function renderOtras(items, mountId) {
    const ul = $('#' + mountId);
    if (!ul) return;
    ul.innerHTML = items.map((item) => `
      <li>
        <span class="otras-cargo">${item.cargo || item.rol}</span>
        <span class="otras-empresa">${item.empresa || item.institucion}</span>
        <span class="otras-periodo">${item.periodo}</span>
      </li>
    `).join('');
  }

  function renderSoftware(soft) {
    const intro = $('#softwareIntro');
    const grid = $('#softwareGrid');
    if (!intro || !grid) return;
    intro.textContent = soft.descripcion;
    grid.innerHTML = soft.areas.map((a, i) => `
      <article class="soft-card fade-in">
        <span class="soft-card__num">${pad(i + 1)} — Capacidad</span>
        <div class="soft-card__icon">${ICONS[a.icono] || ICONS.code}</div>
        <h3>${a.titulo}</h3>
        <p>${a.descripcion}</p>
        <ul class="soft-card__tags">
          ${a.tags.map((t) => `<li>${t}</li>`).join('')}
        </ul>
      </article>
    `).join('');
  }

  function renderHerramientas(items) {
    const grid = $('#herramientasGrid');
    if (!grid) return;
    grid.innerHTML = items.map((cat) => `
      <div class="tool-card fade-in">
        <h4>${cat.categoria}</h4>
        <ul>${cat.items.map((i) => `<li>${i}</li>`).join('')}</ul>
      </div>
    `).join('');
  }

  function renderFormacion(items) {
    const ul = $('#formacionList');
    if (!ul) return;
    ul.innerHTML = items.map((f) => `
      <li>
        <div class="edu-list__main">
          <span class="edu-list__title">${f.titulo}</span>
          <span class="edu-list__inst">${f.institucion}</span>
        </div>
        <span class="edu-list__date">${f.periodo}</span>
      </li>
    `).join('');
  }

  function renderCertificaciones(items) {
    const ul = $('#certsList');
    if (!ul) return;
    ul.innerHTML = items.map((c) => `
      <li>
        <div class="edu-list__main">
          <span class="edu-list__title">${c.nombre}</span>
          <span class="edu-list__inst">${c.institucion}</span>
        </div>
        <span class="edu-list__date">${c.anio}</span>
      </li>
    `).join('');
  }

  function setupNav() {
    const toggle = $('#navToggle');
    const menu = $('#navMenu');
    if (!toggle || !menu) return;
    toggle.addEventListener('click', () => menu.classList.toggle('is-open'));
    $$('#navMenu a').forEach((a) => {
      a.addEventListener('click', () => menu.classList.remove('is-open'));
    });
  }

  function setYear() {
    const el = $('#year');
    if (el) el.textContent = String(new Date().getFullYear());
  }

  function setupReveal() {
    const els = $$('.fade-in');
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    els.forEach((el) => io.observe(el));
  }

  function setupNavScroll() {
    const sections = $$('main section[id]');
    const links = $$('.nav__menu > a[href^="#"]');
    if (!sections.length || !links.length) return;

    const map = new Map(links.map((l) => [l.getAttribute('href').slice(1), l]));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const link = map.get(entry.target.id);
        if (!link) return;
        if (entry.isIntersecting) {
          links.forEach((l) => l.classList.remove('is-active'));
          link.classList.add('is-active');
        }
      });
    }, { rootMargin: '-40% 0px -50% 0px' });

    sections.forEach((s) => io.observe(s));
  }

  async function loadProfile() {
    try {
      const res = await fetch('/api/profile');
      if (!res.ok) throw new Error('Fetch failed');
      return await res.json();
    } catch (err) {
      console.warn('No se pudo cargar /api/profile.', err);
      return null;
    }
  }

  function hydrate(data) {
    if (!data) return;
    bindText(data);
    renderMetrics(data.metricas || []);
    renderCompetencias(data.competencias || []);
    renderTimeline(data.experiencia || []);
    renderOtras(data.otrasExperiencias || [], 'otrasList');
    renderSoftware(data.desarrolloSoftware || { descripcion: '', areas: [] });
    renderHerramientas(data.herramientas || []);
    renderFormacion(data.formacion || []);
    renderCertificaciones(data.certificaciones || []);
    renderOtras(data.docencia || [], 'docenciaList');
    setupReveal();
  }

  document.addEventListener('DOMContentLoaded', async () => {
    setupNav();
    setYear();
    setupNavScroll();
    const data = await loadProfile();
    hydrate(data);
  });
})();
