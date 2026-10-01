const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');

toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!open));
  toggle.setAttribute('aria-label', open ? 'Ouvrir le menu' : 'Fermer le menu');
  nav.classList.toggle('open', !open);
});

nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Ouvrir le menu');
}));

const revealElements = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealElements.forEach((element) => observer.observe(element));

// A direct anchor-link load (or any instant/large scroll) can jump straight
// past a .reveal element before the observer ever records it as intersecting,
// leaving it permanently invisible. This sweep catches anything already
// on-screen and reveals it immediately, independent of the observer.
function revealOnscreenNow() {
  revealElements.forEach((element) => {
    if (element.classList.contains('visible')) return;
    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      element.classList.add('visible');
      observer.unobserve(element);
    }
  });
}

revealOnscreenNow();
window.addEventListener('load', revealOnscreenNow);
window.addEventListener('hashchange', () => setTimeout(revealOnscreenNow, 50));

// A fast wheel/trackpad flick can also skip the observer for the elements it
// jumps over in a single frame, so keep sweeping (lightly, via rAF) while any
// elements remain unrevealed.
let revealTicking = false;
window.addEventListener('scroll', () => {
  if (revealTicking) return;
  revealTicking = true;
  requestAnimationFrame(() => {
    revealOnscreenNow();
    revealTicking = false;
  });
}, { passive: true });
window.addEventListener('resize', revealOnscreenNow);
