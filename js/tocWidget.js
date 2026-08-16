// Hovering table-of-contents widget.
// Scans every <h2> inside <main>, builds a fixed vertical nav on the right
// edge (dot + label per section), and highlights whichever section is
// currently in view. No markup changes needed on each page — just call
// initTocWidget() once from main.js and link css/toc.css in <head>.

function slugify(text) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip accents (ç, ã, é, etc.)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function initTocWidget() {
  const headings = Array.from(document.querySelectorAll('main h2, main h3'));

  // Not worth showing a nav for one section or none.
  if (headings.length < 2) return;

  // Make sure every heading has a stable id to link/scroll to.
  headings.forEach((h) => {
    if (!h.id) h.id = slugify(h.textContent);
  });

  const nav = document.createElement('nav');
  nav.className = 'toc-widget';
  nav.setAttribute('aria-label', 'Navegação por tópicos');

  const list = document.createElement('ul');
  list.className = 'toc-widget__list';
  nav.appendChild(list);

  const linkByHeadingId = new Map();

  headings.forEach((h) => {
    const isSubheading = h.tagName === 'H3';

    const li = document.createElement('li');
    if (isSubheading) li.classList.add('toc-widget__item--h3');

    const a = document.createElement('a');
    a.className = 'toc-widget__link';
    a.href = `#${h.id}`;
    a.addEventListener('click', (event) => {
      event.preventDefault();
      h.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Keep the URL hash in sync without re-triggering the browser's
      // instant jump-to-anchor behavior.
      history.pushState(null, '', `#${h.id}`);
    });

    const dot = document.createElement('span');
    dot.className = 'toc-widget__dot';

    const label = document.createElement('span');
    label.className = 'toc-widget__label';
    label.textContent = h.textContent;

    a.appendChild(dot);
    a.appendChild(label);
    li.appendChild(a);
    list.appendChild(li);

    linkByHeadingId.set(h.id, a);
  });

  document.body.appendChild(nav);

  // Scrollspy: highlight whichever heading's section is currently on screen.
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const link = linkByHeadingId.get(entry.target.id);
        if (!link) return;
        link.classList.toggle('is-active', entry.isIntersecting);
      });
    },
    {
      // Counts a section as "active" once it crosses the upper third of
      // the viewport, so the highlight changes a bit before the reader
      // reaches the very top of the section.
      rootMargin: '-10% 0px -70% 0px',
    }
  );

  headings.forEach((h) => observer.observe(h));
}