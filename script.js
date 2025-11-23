
// script.js - Read more toggle for About Me
document.addEventListener('DOMContentLoaded', function(){
  const btn = document.getElementById('read-more');
  const more = document.getElementById('about-more');

  // If there's no extra content, hide the button
  if(!more || more.innerHTML.trim() === ''){
    btn.style.display = 'none';
    return;
  }

  let expanded = true;
  // Initially collapse (show only first paragraph), since we already show lead separately
  more.style.display = 'none';
  expanded = false;
  btn.textContent = 'Read more';

  btn.addEventListener('click', function(){
    expanded = !expanded;
    if(expanded){
      more.style.display = 'block';
      btn.textContent = 'Show less';
    } else {
      more.style.display = 'none';
      btn.textContent = 'Read more';
      // Scroll to about top to keep UX tidy on mobile
      document.querySelector('.about').scrollIntoView({behavior:'smooth'});
    }
  });
});


// Utility: clamp number to 0..100
    const clamp = v => Math.max(0, Math.min(100, Number(v) || 0));

    // Animate all progress bars on DOMContentLoaded
    window.addEventListener('DOMContentLoaded', () => {
      const progressEls = document.querySelectorAll('.progress');

      progressEls.forEach(progress => {
        const fill = progress.querySelector('.progress__fill');
        if (!fill) return; // skip if structure unexpected

        const target = clamp(progress.dataset.target);
        const duration = Number(progress.dataset.duration) || 1200;

        // set per-bar transition duration
        fill.style.transition = `width ${duration}ms cubic-bezier(.22,.9,.29,1)`;

        // helper to update one bar (sets width, text and aria)
        function setProgress(percent){
          const p = clamp(percent);
          fill.style.width = p + '%';
          // optionally hide text if too small to avoid overflow
          progress.setAttribute('aria-valuenow', String(Math.round(p)));
        }

        // ensure starting at 0 then trigger to target in next animation frame
        setProgress(0);
        // double rAF ensures layout applied then transition runs reliably
        requestAnimationFrame(() => requestAnimationFrame(() => setProgress(target)));
      });
    });

    // Optional global API if other scripts want to update a specific bar:
    // usage: window.simpleProgressBar.update(progressElementOrSelector, value)
    window.simpleProgressBar = {
      update(elOrSelector, value){
        let el = elOrSelector;
        if (typeof elOrSelector === 'string') el = document.querySelector(elOrSelector);
        if (!el) return;
        const progress = el.classList && el.classList.contains('progress') ? el : el.closest('.progress');
        if (!progress) return;
        const fill = progress.querySelector('.progress__fill');
        if (!fill) return;
        const val = clamp(value);
        fill.style.width = val + '%';
        fill.textContent = Math.round(val) + '%';
        progress.setAttribute('aria-valuenow', String(Math.round(val)));
      }
    };
