// Click-to-enlarge image lightbox, wiki-style.
// Wires every <img> inside <main> to open a dimmed full-screen overlay
// showing it at full size, with its alt text as a caption. Closes on
// backdrop click, the × button, or Escape.

export function initLightbox() {
  const images = Array.from(document.querySelectorAll('main img'));
  if (images.length === 0) return;

  // Build the overlay once and reuse it for every image.
  const overlay = document.createElement('div');
  overlay.className = 'lightbox';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-hidden', 'true');

  const closeBtn = document.createElement('button');
  closeBtn.className = 'lightbox__close';
  closeBtn.setAttribute('aria-label', 'Fechar');
  closeBtn.textContent = '×';

  const img = document.createElement('img');
  img.className = 'lightbox__img';

  const caption = document.createElement('p');
  caption.className = 'lightbox__caption';

  overlay.appendChild(closeBtn);
  overlay.appendChild(img);
  overlay.appendChild(caption);
  document.body.appendChild(overlay);

  function open(src, alt) {
    img.src = src;
    img.alt = alt || '';
    caption.textContent = alt || '';
    caption.hidden = !alt;
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
  }

  function close() {
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
  }

  images.forEach((sourceImg) => {
    sourceImg.addEventListener('click', () => {
      open(sourceImg.currentSrc || sourceImg.src, sourceImg.alt);
    });
  });

  // Click anywhere on the dimmed backdrop (but not the image itself) closes it.
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) close();
  });

  closeBtn.addEventListener('click', close);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && overlay.classList.contains('is-open')) {
      close();
    }
  });
}