/* ========================
   PORTFOLIO SCRIPT
======================== */

// ── Navbar scroll effect ──
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  // Scrolled class
  navbar.classList.toggle('scrolled', window.scrollY > 50);

  // Active nav link
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.getAttribute('id');
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
  });
});

// ── Hamburger menu ──
const hamburger = document.getElementById('hamburger');
const navMenu = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  navMenu.classList.toggle('open');
  hamburger.classList.toggle('open');
});

// Close menu on link click
navMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navMenu.classList.remove('open'));
});

// ── Typed text effect ──
const phrases = [
  'Web Developer 🌐',
  'Problem Solver 🧩',
  'Tech Enthusiast 🚀'
];
let pi = 0, ci = 0, deleting = false;
const typedEl = document.getElementById('typed');

function type() {
  const phrase = phrases[pi];
  if (!deleting) {
    typedEl.textContent = phrase.slice(0, ++ci);
    if (ci === phrase.length) {
      deleting = true;
      setTimeout(type, 1800);
      return;
    }
  } else {
    typedEl.textContent = phrase.slice(0, --ci);
    if (ci === 0) {
      deleting = false;
      pi = (pi + 1) % phrases.length;
    }
  }
  setTimeout(type, deleting ? 60 : 100);
}
type();

// ── Animated counters ──
function animateCounter(el) {
  const target = +el.dataset.target;
  let count = 0;
  const step = Math.ceil(target / 40);
  const timer = setInterval(() => {
    count = Math.min(count + step, target);
    el.textContent = count;
    if (count >= target) clearInterval(timer);
  }, 40);
}

// ── Intersection Observer (scroll reveal + counters + skill bars) ──
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach(bar => bar.classList.add('animated'));
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

// Apply reveal to cards/sections
document.querySelectorAll(
  '.about-card, .skill-item, .project-card, .contact-link, .contact-form, .section-title, .section-label'
).forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

document.querySelectorAll('.stat-num').forEach(el => counterObserver.observe(el));
document.querySelectorAll('.skills-grid').forEach(el => skillObserver.observe(el));

// ── Contact form ──
const form = document.getElementById('contactForm');
const toast = document.getElementById('toast');

function showToast(msg, isError = false) {
  toast.textContent = msg;
  toast.style.background = isError
    ? 'linear-gradient(135deg,#ef4444,#dc2626)'
    : 'linear-gradient(135deg,#7c6dff,#f472b6)';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = document.getElementById('submitBtn');
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name || !email || !message) {
    showToast('⚠️ Please fill in all fields.', true);
    return;
  }

  btn.textContent = 'Sending…';
  btn.disabled = true;

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        access_key: 'ff80985d-12a9-44ae-a3f3-17a5d9d4e372',
        name: name,
        email: email,
        message: message
      })
    });

    const result = await response.json();
    if (response.status === 200) {
      showToast(`✅ Thanks ${name}! I'll be in touch soon.`);
      form.reset();
    } else {
      console.error(result);
      showToast('⚠️ Something went wrong. Please try again.', true);
    }
  } catch (error) {
    console.error(error);
    showToast('⚠️ Something went wrong. Please try again.', true);
  } finally {
    btn.textContent = 'Send Message 🚀';
    btn.disabled = false;
  }
});

// ── Smooth anchor scrolling ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── Cursor glow (desktop only) ──
if (window.matchMedia('(pointer: fine)').matches) {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position:fixed; width:300px; height:300px; border-radius:50%;
    background:radial-gradient(circle, rgba(124,109,255,0.06) 0%, transparent 70%);
    pointer-events:none; z-index:0; transition:transform 0.15s ease;
    transform:translate(-50%,-50%);
  `;
  document.body.appendChild(glow);
  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });
}
