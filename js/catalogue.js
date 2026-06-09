/* ── STATE ── */
let allProducts = [];
let lang = 'en';
let filter = 'all';
let certFilter = 'all';

const UI = {
  en: { all:'All', spice:'Spices', herb:'Herbs', tea:'Teas', blend:'Blends', details:'Details', quotation:'Request Quotation', origin:'Origin & Certification', applications:'Applications', quality:'Quality & Standards', shelf:'Shelf Life', footer:"Don't see what you need? <a href='mailto:info@erboristi.ch'>Contact us</a> — we source on request.", variants:'Variants & Packaging', form:'Form', packing:'Packaging options', certLabel:'Cert:', noResults:'No products match this filter combination.' },
  de: { all:'Alle', spice:'Gewürze', herb:'Kräuter', tea:'Tees', blend:'Mischungen', details:'Details', quotation:'Angebot anfragen', origin:'Herkunft & Zertifizierung', applications:'Anwendungen', quality:'Qualität & Standards', shelf:'Haltbarkeit', footer:"Nicht gefunden? <a href='mailto:info@erboristi.ch'>Kontaktieren Sie uns</a> — wir beschaffen auf Anfrage.", variants:'Varianten & Verpackung', form:'Form', packing:'Verpackungsoptionen', certLabel:'Zert.:', noResults:'Keine Produkte entsprechen dieser Filterkombination.' },
  it: { all:'Tutti', spice:'Spezie', herb:'Erbe', tea:'Tè', blend:'Miscele', details:'Dettagli', quotation:'Richiedi preventivo', origin:'Origine & Certificazione', applications:'Applicazioni', quality:'Qualità & Standard', shelf:'Conservazione', footer:"Non trovi quello che cerchi? <a href='mailto:info@erboristi.ch'>Contattaci</a> — approvvigioniamo su richiesta.", variants:'Varianti & Confezionamento', form:'Forma', packing:'Opzioni di confezionamento', certLabel:'Cert.:', noResults:'Nessun prodotto corrisponde a questa combinazione di filtri.' },
  fr: { all:'Tous', spice:'Épices', herb:'Herbes', tea:'Thés', blend:'Mélanges', details:'Détails', quotation:'Demander un devis', origin:'Origine & Certification', applications:'Applications', quality:'Qualité & Standards', shelf:'Conservation', footer:"Vous ne trouvez pas? <a href='mailto:info@erboristi.ch'>Contactez-nous</a> — nous sourceons sur demande.", variants:'Variantes & Conditionnement', form:'Forme', packing:'Options de conditionnement', certLabel:'Cert.:', noResults:'Aucun produit ne correspond à cette combinaison de filtres.' }
};



function t(field) {
  if (!field) return '';
  if (typeof field === 'string') return field;
  if (Array.isArray(field)) return field[0];
  return field[lang] || field['en'] || '';
}
function tList(field) {
  if (!field) return [];
  if (Array.isArray(field)) return field;
  return field[lang] || field['en'] || [];
}

function getFiltered() {
  return allProducts.filter(p => {
    const catOk  = filter === 'all' || p.category === filter;
    const certOk = certFilter === 'all' || p.cert.includes(certFilter);
    return catOk && certOk;
  });
}

function render() {
  const u = UI[lang];
  const items = getFiltered();
  document.querySelectorAll('.filter-btn').forEach(b => { if (UI[lang][b.dataset.filter]) b.textContent = UI[lang][b.dataset.filter]; });
  document.getElementById('certLabel').textContent = u.certLabel;
  document.getElementById('catalogueFooter').innerHTML = u.footer;
  const grid = document.getElementById('productGrid');
  if (!items.length) {
    grid.innerHTML = `<p class="empty">${u.noResults}</p>`;
    return;
  }
  grid.innerHTML = items.map((p, i) => `
    <div class="card" onclick="openOverlay('${p.id}')" style="animation-delay:${i*0.05}s">
      <div class="card-tags">${p.cert.map(c=>`<span class="card-tag">${c}</span>`).join('')}</div>
      <div class="card-image-wrap">
        <img class="card-image" src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1515023115689-589c33041d3c?w=600&q=80'">
      </div>
      <div class="card-body">
        <p class="card-latin">${p.latin}</p>
        <h3 class="card-name">${t(p.name)}</h3>
        <p class="card-desc">${t(p.desc)}</p>
        <div class="card-meta">
          ${p.origin.map(o=>`<span class="meta-pill origin">${o}</span>`).join('')}
          ${p.cert.map(c=>`<span class="meta-pill cert ${c===certFilter?'active-cert':''}">${c}</span>`).join('')}
        </div>
        <div class="card-footer">
          <span class="card-variants">${p.variants.map(v=>v.form).join(' · ')}</span>
          <button class="card-cta">${u.details} <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 6h8M6 2l4 4-4 4"/></svg></button>
        </div>
      </div>
    </div>`).join('');
}

function openOverlay(id) {
  const p = allProducts.find(x => x.id === id);
  if (!p) return;
  const u = UI[lang];
  document.getElementById('overlayImg').src = p.image;
  document.getElementById('overlayImg').alt = p.name;
  document.getElementById('overlayContent').innerHTML = `
    <p class="overlay-latin">${p.latin}</p>
    <h2 class="overlay-name">${t(p.name)}</h2>
    <div class="overlay-section"><p>${t(p.desc)}</p></div>
    <div class="overlay-section">
      <h4>${u.origin}</h4>
      <div class="overlay-pills">
        ${p.origin.map(o=>`<span class="meta-pill origin">${o}</span>`).join('')}
        ${p.cert.map(c=>`<span class="meta-pill cert">${c}</span>`).join('')}
      </div>
    </div>
    <div class="overlay-section">
      <h4>${u.variants}</h4>
      <table class="variants-table">
        <thead><tr><th>${u.form}</th><th>${u.packing}</th></tr></thead>
        <tbody>${p.variants.map(v=>`<tr><td>${v.form}</td><td>${v.packaging.join(', ')}</td></tr>`).join('')}</tbody>
      </table>
    </div>
    <div class="overlay-section">
      <h4>${u.applications}</h4>
      <ul>${tList(p.applications).map(a=>`<li>${a}</li>`).join('')}</ul>
    </div>
    <div class="overlay-section">
      <h4>${u.quality}</h4>
      <ul>${tList(p.quality).map(q=>`<li>${q}</li>`).join('')}</ul>
    </div>
    <div class="overlay-section"><h4>${u.shelf}</h4><p>${t(p.shelf)}</p></div>
    <a class="overlay-cta" href="mailto:info@erboristi.ch?subject=${encodeURIComponent('Quotation: '+t(p.name))}">
      ${u.quotation} <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 6h8M6 2l4 4-4 4"/></svg>
    </a>`;
  document.getElementById('overlayBg').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeOverlay(e) { if (e.target===document.getElementById('overlayBg')) closeOverlayDirect(); }
function closeOverlayDirect() { document.getElementById('overlayBg').classList.remove('open'); document.body.style.overflow=''; }
function filterCat(cat, btn) { filter=cat; document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); render(); }
function filterCert(cert, btn) { certFilter=cert; document.querySelectorAll('.cert-filter-btn').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); render(); }
function setLang(l, btn) { lang=l; document.querySelectorAll('.lang-btn').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); render(); }
document.addEventListener('keydown', e => { if(e.key==='Escape') closeOverlayDirect(); });

render();

async function loadProducts() {
  try {
    const res = await fetch('data/products.json');
    allProducts = await res.json();
    render();
  } catch(e) {
    document.getElementById('productGrid').innerHTML = '<p class="empty">Could not load products.</p>';
    console.error(e);
  }
}

loadProducts();
