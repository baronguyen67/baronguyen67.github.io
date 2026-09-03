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
  // Inject only the styles needed for this interactive section so the
  // portfolio's existing global stylesheet stays untouched.
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
      background:
        radial-gradient(
          260px circle at var(--mouse-x) var(--mouse-y),
          rgba(130,196,193,.13),
          transparent 68%
        );
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

    #skills .xp-proof-card strong {
      position: relative;
      z-index: 1;
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

  // Stagger the cards when the section actually comes into view.
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

  // Subtle mouse-follow spotlight. No strong 3D tilt, which keeps the section
  // polished and professional while still feeling interactive.
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
