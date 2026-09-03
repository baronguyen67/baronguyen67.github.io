// ===== Mobile nav toggle =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

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
  revealEls.forEach(el => el.classList.add('is-visible'));
}

// ===== Skills section — recruiter-friendly motion =====
const skillsSection = document.getElementById('skills');

if (skillsSection) {
  const skillMotionStyle = document.createElement('style');
  skillMotionStyle.textContent = `
    #skills {
      position: relative;
      overflow: hidden;
    }

    #skills::before {
      content: "";
      position: absolute;
      width: 520px;
      height: 520px;
      top: 5%;
      right: -220px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(91,163,160,.10) 0%, rgba(91,163,160,0) 68%);
      pointer-events: none;
      animation: skills-orbit 9s ease-in-out infinite alternate;
    }

    #skills .xp-proof-grid {
      perspective: 1000px;
    }

    #skills .xp-proof-card {
      --mouse-x: 50%;
      --mouse-y: 50%;
      position: relative;
      overflow: hidden;
      opacity: 0;
      transform: translateY(28px) scale(.985);
      transition:
        opacity .6s ease,
        transform .6s cubic-bezier(.2,.75,.2,1),
        border-color .25s ease,
        box-shadow .25s ease,
        background .25s ease;
      will-change: transform;
    }

    #skills.skills-ready .xp-proof-card {
      opacity: 1;
      transform: translateY(0) scale(1);
    }

    #skills.skills-ready .xp-proof-card:nth-child(1) { transition-delay: .05s; }
    #skills.skills-ready .xp-proof-card:nth-child(2) { transition-delay: .14s; }
    #skills.skills-ready .xp-proof-card:nth-child(3) { transition-delay: .23s; }
    #skills.skills-ready .xp-proof-card:nth-child(4) { transition-delay: .32s; }

    #skills .xp-proof-card::before {
      content: "";
      position: absolute;
      inset: 0;
      opacity: 0;
      pointer-events: none;
      background: radial-gradient(260px circle at var(--mouse-x) var(--mouse-y), rgba(130,196,193,.13), transparent 68%);
      transition: opacity .25s ease;
    }

    #skills .xp-proof-card::after {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      width: 2px;
      height: 0;
      background: linear-gradient(to bottom, #82c4c1, #d9742b);
      transition: height .35s ease;
    }

    #skills .xp-proof-card:hover {
      transform: translateY(-7px);
      border-color: rgba(130,196,193,.58);
      box-shadow: 0 18px 42px rgba(0,0,0,.25), 0 0 0 1px rgba(130,196,193,.05);
      background: linear-gradient(145deg, rgba(31,35,43,1), rgba(27,31,38,1));
    }

    #skills .xp-proof-card:hover::before { opacity: 1; }
    #skills .xp-proof-card:hover::after { height: 100%; }

    #skills .xp-proof-step {
      display: inline-block;
      transition: transform .28s ease, color .28s ease, text-shadow .28s ease;
    }

    #skills .xp-proof-card:hover .xp-proof-step {
      transform: translateX(5px);
      color: #82c4c1;
      text-shadow: 0 0 16px rgba(130,196,193,.35);
    }

    #skills .xp-proof-card h4 {
      transition: color .25s ease, transform .25s ease;
    }

    #skills .xp-proof-card:hover h4 {
      color: #fff;
      transform: translateX(2px);
    }

    @keyframes skills-orbit {
      from { transform: translate3d(0,0,0) scale(1); }
      to { transform: translate3d(-70px,45px,0) scale(1.08); }
    }

    @media (prefers-reduced-motion: reduce) {
      #skills::before { animation: none !important; }
      #skills .xp-proof-card {
        opacity: 1 !important;
        transform: none !important;
        transition: none !important;
      }
    }
  `;
  document.head.appendChild(skillMotionStyle);

  const skillCards = skillsSection.querySelectorAll('.xp-proof-card');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!reduceMotion && 'IntersectionObserver' in window) {
    const skillsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          skillsSection.classList.add('skills-ready');
          skillsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.22 });

    skillsObserver.observe(skillsSection);
  } else {
    skillsSection.classList.add('skills-ready');
  }

  skillCards.forEach(card => {
    card.addEventListener('mousemove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mouse-x', `${x}%`);
      card.style.setProperty('--mouse-y', `${y}%`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--mouse-x', '50%');
      card.style.setProperty('--mouse-y', '50%');
    });
  });
}

// ===== Activities section — professional card gallery =====
const activitiesSection = document.getElementById('activities');

if (activitiesSection) {
  const activityStyle = document.createElement('style');
  activityStyle.textContent = `
    #activities .section-head {
      max-width: 760px;
    }

    #activities .section-head::after {
      content: 'Selected experiences in language, coordination, and cross-cultural involvement.';
      display: block;
      margin-top: 1rem;
      max-width: 690px;
      color: var(--ink-dim);
      font-size: 1rem;
      line-height: 1.7;
    }

    #activities .gallery-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 1.4rem;
      align-items: stretch;
    }

    #activities .gallery-item {
      --mx: 50%;
      --my: 50%;
      position: relative;
      margin: 0;
      min-height: 365px;
      overflow: hidden;
      border: 1px solid rgba(255,255,255,.10);
      border-radius: 14px;
      background: #1a1d23;
      box-shadow: 0 10px 30px rgba(0,0,0,.16);
      isolation: isolate;
      opacity: 0;
      transform: translateY(26px) scale(.985);
      transition:
        opacity .55s ease,
        transform .45s cubic-bezier(.2,.8,.2,1),
        border-color .3s ease,
        box-shadow .3s ease;
    }

    #activities .gallery-item.activity-visible {
      opacity: 1;
      transform: translateY(0) scale(1);
    }

    #activities .gallery-item:hover {
      transform: translateY(-7px) scale(1.01);
      border-color: rgba(232,163,95,.46);
      box-shadow: 0 22px 48px rgba(0,0,0,.32);
    }

    #activities .gallery-img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

    #activities .gallery-img::after {
      content: '';
      position: absolute;
      inset: 0;
      z-index: 1;
      background:
        linear-gradient(to top, rgba(9,11,15,.96) 0%, rgba(9,11,15,.72) 28%, rgba(9,11,15,.25) 55%, rgba(9,11,15,.04) 82%);
      pointer-events: none;
    }

    #activities .gallery-img img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: saturate(.86) contrast(1.03) brightness(.96);
      transition: transform .7s cubic-bezier(.2,.8,.2,1), filter .45s ease;
    }

    #activities .gallery-item:hover .gallery-img img {
      transform: scale(1.065);
      filter: saturate(1) contrast(1.04) brightness(1.02);
    }

    #activities .gallery-item figcaption {
      position: absolute;
      z-index: 2;
      left: 1.25rem;
      right: 1.25rem;
      bottom: 1.2rem;
      padding: 0;
      color: var(--ink);
      font-family: var(--font-body);
      font-size: 1rem;
      font-weight: 600;
      line-height: 1.42;
      letter-spacing: 0;
      text-shadow: 0 2px 10px rgba(0,0,0,.62);
      transition: transform .3s ease;
    }

    #activities .gallery-item figcaption::before {
      display: block;
      width: fit-content;
      margin-bottom: .62rem;
      padding: .34rem .56rem;
      border: 1px solid rgba(130,196,193,.34);
      border-radius: 999px;
      background: rgba(17,20,25,.58);
      backdrop-filter: blur(8px);
      color: var(--teal-soft);
      font-family: var(--font-mono);
      font-size: .62rem;
      line-height: 1;
      letter-spacing: .11em;
      font-weight: 500;
    }

    #activities .gallery-item:nth-child(1) figcaption::before { content: 'LANGUAGE'; }
    #activities .gallery-item:nth-child(2) figcaption::before { content: 'INTERPRETING'; }
    #activities .gallery-item:nth-child(3) figcaption::before { content: 'CULTURAL EXCHANGE'; }
    #activities .gallery-item:nth-child(4) figcaption::before { content: 'PROGRAM SUPPORT'; }
    #activities .gallery-item:nth-child(5) figcaption::before { content: 'OPERATIONS SUPPORT'; }
    #activities .gallery-item:nth-child(6) figcaption::before { content: 'COMMUNITY'; }

    #activities .gallery-item:hover figcaption {
      transform: translateY(-4px);
    }

    #activities .gallery-item::after {
      content: '';
      position: absolute;
      z-index: 3;
      inset: 0;
      pointer-events: none;
      opacity: 0;
      background: radial-gradient(300px circle at var(--mx) var(--my), rgba(91,163,160,.12), transparent 62%);
      transition: opacity .3s ease;
    }

    #activities .gallery-item:hover::after {
      opacity: 1;
    }

    @media (max-width: 900px) {
      #activities .gallery-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (max-width: 620px) {
      #activities .gallery-grid {
        grid-template-columns: 1fr;
      }
      #activities .gallery-item {
        min-height: 330px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      #activities .gallery-item {
        opacity: 1 !important;
        transform: none !important;
        transition: none !important;
      }
      #activities .gallery-img img,
      #activities .gallery-item figcaption {
        transition: none !important;
      }
    }
  `;
  document.head.appendChild(activityStyle);

  const activityCards = activitiesSection.querySelectorAll('.gallery-item');
  const reduceActivityMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  activityCards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 75}ms`;

    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mx', `${x}%`);
      card.style.setProperty('--my', `${y}%`);
    });
  });

  if (!reduceActivityMotion && 'IntersectionObserver' in window) {
    const activityObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('activity-visible');
          activityObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14 });

    activityCards.forEach(card => activityObserver.observe(card));
  } else {
    activityCards.forEach(card => card.classList.add('activity-visible'));
  }
}

// ===== Contact form — Formspree =====
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const submitBtn = contactForm ? contactForm.querySelector('button[type="submit"]') : null;

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = new FormData(contactForm);

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
    }
    formStatus.textContent = '';
    formStatus.className = 'form-status';

    try {
      const response = await fetch('https://formspree.io/f/xjgqewdb', {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        formStatus.textContent = '✓ Message sent! I\'ll get back to you soon.';
        formStatus.classList.add('success');
        contactForm.reset();
      } else {
        const json = await response.json();
        const msg = json.errors ? json.errors.map(e => e.message).join(', ') : 'Something went wrong.';
        formStatus.textContent = '✗ ' + msg;
        formStatus.classList.add('error');
      }
    } catch (err) {
      formStatus.textContent = '✗ Network error — please try again or email me directly.';
      formStatus.classList.add('error');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send message →';
      }
    }
  });
}
