// Presentation controls. The CV content and its original skill levels stay in HTML.
document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const readMore = document.getElementById('read-more');
  const more = document.getElementById('about-more');
  if (readMore && more) {
    more.style.display = 'none';
    readMore.addEventListener('click', () => {
      const expanded = readMore.getAttribute('aria-expanded') !== 'true';
      readMore.setAttribute('aria-expanded', String(expanded));
      more.style.display = expanded ? 'block' : 'none';
      readMore.textContent = expanded ? 'Show less' : 'Read more';
    });
  }

  const header = document.querySelector('.site-header');
  const menu = document.querySelector('.menu-toggle');
  menu?.addEventListener('click', () => {
    const expanded = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(expanded));
    header.classList.toggle('menu-open', expanded);
  });
  document.querySelectorAll('.case-nav a').forEach(link => link.addEventListener('click', () => {
    menu?.setAttribute('aria-expanded', 'false');
    header.classList.remove('menu-open');
  }));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu?.getAttribute('aria-expanded') === 'true') {
      menu.setAttribute('aria-expanded', 'false');
      header.classList.remove('menu-open');
      menu.focus();
    }
  });

  const animateProgress = progress => {
    const target = Math.max(0, Math.min(100, Number(progress.dataset.target) || 0));
    const fill = progress.querySelector('.progress__fill');
    if (!fill) return;
    progress.setAttribute('aria-valuenow', String(target));
    const label = progress.closest('.progress-wrap')?.querySelector('.label')?.textContent.trim();
    if (label) progress.setAttribute('aria-label', label);
    fill.style.transition = reduceMotion.matches ? 'none' : `width ${Number(progress.dataset.duration) || 900}ms cubic-bezier(.22,.9,.29,1)`;
    requestAnimationFrame(() => { fill.style.width = `${target}%`; });
  };

  if ('IntersectionObserver' in window && !reduceMotion.matches) {
    document.documentElement.classList.add('js-ready');
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      entry.target.querySelectorAll('.progress').forEach(animateProgress);
      observer.unobserve(entry.target);
    }), { threshold: 0.04 });
    document.querySelectorAll('.left > .expWrapper,.skill-wrapper,.teams-wrapper,.edu,.langs-wrapper,.talent-wrapper,.recog-wrapper').forEach(element => {
      element.classList.add('reveal');
      observer.observe(element);
    });
  } else {
    document.querySelectorAll('.progress').forEach(animateProgress);
  }

  // Ensure print includes every section and the existing progress values.
  window.addEventListener('beforeprint', () => {
    document.querySelectorAll('.reveal').forEach(element => element.classList.add('is-visible'));
    document.querySelectorAll('.progress').forEach(animateProgress);
  });
  let queued = false;
  window.addEventListener('scroll', () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      header?.classList.toggle('scrolled', window.scrollY > 40);
      queued = false;
    });
  }, { passive: true });
});
