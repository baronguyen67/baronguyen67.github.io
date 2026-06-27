// ===== Mobile nav toggle =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Close menu after clicking a link (mobile)
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// ===== Reveal on scroll =====
const revealEls = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window && revealEls.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => observer.observe(el));
} else {
  // Fallback: just show everything
  revealEls.forEach(el => el.classList.add('is-visible'));
}

// ===== Contact form (front-end only placeholder) =====
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // NOTE: Hiện tại form này chưa gửi email thật.
    // Để gửi được, kết nối với Formspree / EmailJS (xem hướng dẫn kèm theo).
    formStatus.textContent = 'Form demo — chưa kết nối dịch vụ gửi email. Xem hướng dẫn để bật chức năng gửi thật.';
    contactForm.reset();
  });
}
