const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const userTheme = localStorage.getItem('theme');
if ((userTheme === 'dark') || (!userTheme && prefersDark)) {
  document.documentElement.classList.add('dark');
}

const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
}

const headerEl = document.querySelector('.site-header');
function updateHeaderOverlay(){
  if (!headerEl) return;
  const atTop = window.scrollY <= 4;
  headerEl.classList.toggle('at-top', atTop);
}
updateHeaderOverlay();
window.addEventListener('scroll', updateHeaderOverlay, {passive:true});

const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.getElementById('nav-menu');
if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const open = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
  navMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navMenu.classList.remove('open')));
}

// Mouse-follow underline across nav
const navMenuEl = document.querySelector('.nav-menu');
if (navMenuEl) {
  navMenuEl.addEventListener('mousemove', (e) => {
    const r = navMenuEl.getBoundingClientRect();
    const ux = ((e.clientX - r.left) / r.width) * 100;
    navMenuEl.style.setProperty('--ux', ux + '%');
  });
}

// Remove per-link handlers if present
document.querySelectorAll('.nav-menu a').forEach((link)=>{
  link.onmousemove = null;
  link.onmouseleave = null;
});

const observer = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (e.isIntersecting) {
      e.target.animate([
        {opacity: 0, transform: 'translateY(12px)'},
        {opacity: 1, transform: 'translateY(0)'}
      ], {duration: 500, easing: 'ease-out', fill: 'forwards'});
      observer.unobserve(e.target);
    }
  }
}, {threshold: .12});

for (const el of document.querySelectorAll('.section, .project-card, .timeline-item, .skill-card, .card')) {
  observer.observe(el);
}

// Mouse-follow highlight for buttons/cards (cursor-centered)
function attachFollowGradient(elements){
  elements.forEach((el)=>{
    const update = (e)=>{
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const px = (x/rect.width)*100;
      const py = (y/rect.height)*100;
      el.style.setProperty('--px', `${px}%`);
      el.style.setProperty('--py', `${py}%`);
    };
    el.addEventListener('mouseenter', update);
    el.addEventListener('mousemove', update);
    el.addEventListener('mouseleave', ()=>{
      el.style.removeProperty('--px');
      el.style.removeProperty('--py');
    });
  });
}

const primaryButtons = document.querySelectorAll('.btn.primary');
if (primaryButtons.length) attachFollowGradient(primaryButtons);

const gradientButtons = document.querySelectorAll('.btn:not(.primary)');
if (gradientButtons.length) attachFollowGradient(gradientButtons);

// Reattach for all hoverable cards to be safe
const hoverCards2 = document.querySelectorAll('.card, .timeline-item, .skill-card, .project-card');
if (hoverCards2.length) {
  hoverCards2.forEach((el)=>{
    const handler = (e)=>{
      const rect = el.getBoundingClientRect();
      const px = ((e.clientX - rect.left)/rect.width)*100;
      const py = ((e.clientY - rect.top)/rect.height)*100;
      el.style.setProperty('--px', `${px}%`);
      el.style.setProperty('--py', `${py}%`);
    };
    el.addEventListener('pointermove', handler);
    el.addEventListener('mousemove', handler);
    el.addEventListener('mouseleave', ()=>{
      el.style.removeProperty('--px');
      el.style.removeProperty('--py');
    });
  });
} 