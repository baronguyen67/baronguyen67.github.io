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

// ===== Skills section =====
const skillsSection = document.getElementById('skills');
if (skillsSection) {
  const style = document.createElement('style');
  style.textContent = `
    #skills { position: relative; overflow: hidden; }
    #skills::before { content:""; position:absolute; width:520px; height:520px; top:5%; right:-220px; border-radius:50%; background:radial-gradient(circle, rgba(91,163,160,.10), rgba(91,163,160,0) 68%); pointer-events:none; animation:skills-orbit 9s ease-in-out infinite alternate; }
    #skills .xp-proof-grid { perspective:1000px; }
    #skills .xp-proof-card { --mouse-x:50%; --mouse-y:50%; position:relative; overflow:hidden; opacity:0; transform:translateY(28px) scale(.985); transition:opacity .6s ease, transform .6s cubic-bezier(.2,.75,.2,1), border-color .25s ease, box-shadow .25s ease, background .25s ease; }
    #skills.skills-ready .xp-proof-card { opacity:1; transform:translateY(0) scale(1); }
    #skills.skills-ready .xp-proof-card:nth-child(1){transition-delay:.05s} #skills.skills-ready .xp-proof-card:nth-child(2){transition-delay:.14s} #skills.skills-ready .xp-proof-card:nth-child(3){transition-delay:.23s} #skills.skills-ready .xp-proof-card:nth-child(4){transition-delay:.32s}
    #skills .xp-proof-card::before { content:""; position:absolute; inset:0; opacity:0; pointer-events:none; background:radial-gradient(260px circle at var(--mouse-x) var(--mouse-y), rgba(130,196,193,.13), transparent 68%); transition:opacity .25s ease; }
    #skills .xp-proof-card::after { content:""; position:absolute; left:0; top:0; width:2px; height:0; background:linear-gradient(to bottom,#82c4c1,#d9742b); transition:height .35s ease; }
    #skills .xp-proof-card:hover { transform:translateY(-7px); border-color:rgba(130,196,193,.58); box-shadow:0 18px 42px rgba(0,0,0,.25); background:linear-gradient(145deg,rgba(31,35,43,1),rgba(27,31,38,1)); }
    #skills .xp-proof-card:hover::before{opacity:1} #skills .xp-proof-card:hover::after{height:100%}
    #skills .xp-proof-step{display:inline-block;transition:transform .28s ease,color .28s ease,text-shadow .28s ease}
    #skills .xp-proof-card:hover .xp-proof-step{transform:translateX(5px);color:#82c4c1;text-shadow:0 0 16px rgba(130,196,193,.35)}
    @keyframes skills-orbit{from{transform:translate3d(0,0,0) scale(1)}to{transform:translate3d(-70px,45px,0) scale(1.08)}}
    @media(prefers-reduced-motion:reduce){#skills::before{animation:none!important}#skills .xp-proof-card{opacity:1!important;transform:none!important;transition:none!important}}
  `;
  document.head.appendChild(style);

  const cards = skillsSection.querySelectorAll('.xp-proof-card');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { skillsSection.classList.add('skills-ready'); io.unobserve(e.target); } });
    }, { threshold: 0.22 });
    io.observe(skillsSection);
  } else skillsSection.classList.add('skills-ready');

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${((e.clientX-r.left)/r.width)*100}%`);
      card.style.setProperty('--mouse-y', `${((e.clientY-r.top)/r.height)*100}%`);
    });
    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--mouse-x','50%');
      card.style.setProperty('--mouse-y','50%');
    });
  });
}

// ===== Education section — rebuilt with clean classes =====
const educationSection = document.getElementById('education');
if (educationSection) {
  const head = educationSection.querySelector('.section-head');
  if (head) {
    const eyebrow = head.querySelector('.eyebrow');
    const title = head.querySelector('h2');
    if (eyebrow) eyebrow.textContent = 'Academic Journey';
    if (title) title.textContent = 'Three learning environments that shaped how I work';
    let intro = head.querySelector('.edu-intro');
    if (!intro) {
      intro = document.createElement('p');
      intro.className = 'section-intro edu-intro';
      head.appendChild(intro);
    }
    intro.textContent = 'International business foundations, English immersion, and graduate-level development — each environment added a different layer to how I communicate, analyze, and work across cultures.';
  }

  const timeline = educationSection.querySelector('.edu-timeline');
  if (timeline) {
    timeline.className = 'academic-journey';
    timeline.innerHTML = `
      <article class="academic-card academic-current" data-step="01">
        <div class="academic-logo"><img src="images/logo-ntut.png" alt="NTUT Taipei Tech logo"></div>
        <div class="academic-content">
          <div class="academic-topline"><span class="academic-kicker">Current direction</span><span class="academic-badge badge-current">Current</span></div>
          <div class="academic-meta">Sep 2026 – Present · Taipei, Taiwan</div>
          <h3>MBA</h3>
          <p class="academic-school">National Taipei University of Technology (NTUT / Taipei Tech)</p>
          <p class="academic-desc">Building broader knowledge in business, digital transformation, operations, and analytical decision-making.</p>
          <div class="academic-chips"><span>Graduate Study</span><span>Business Operations</span><span>Digital Transformation</span></div>
        </div>
      </article>

      <article class="academic-card academic-foundation" data-step="02">
        <div class="academic-logo"><img src="images/logo-providence.png" alt="Providence University logo"></div>
        <div class="academic-content">
          <div class="academic-topline"><span class="academic-kicker">Academic foundation</span><span class="academic-badge badge-foundation">Foundation</span></div>
          <div class="academic-meta">2022 – 2026 · Graduated · Taichung, Taiwan</div>
          <h3>BBA · International Business Administration</h3>
          <p class="academic-school">Providence University (靜宜大學)</p>
          <p class="academic-desc">Built an international business foundation through academic training, cross-cultural involvement, student-program support, and multilingual exposure.</p>
          <div class="academic-chips"><span>International Business</span><span>Cross-cultural Experience</span><span>Program Support</span></div>
        </div>
      </article>

      <article class="academic-card academic-global" data-step="03">
        <div class="academic-logo"><img src="images/logo-evacademy.png" alt="EV Academy logo"></div>
        <div class="academic-content">
          <div class="academic-topline"><span class="academic-kicker">International immersion</span><span class="academic-badge badge-global">Global Exposure</span></div>
          <div class="academic-meta">Summer 2023 · 6 Weeks · Cebu, Philippines</div>
          <h3>Intensive English Program</h3>
          <p class="academic-school">EV Academy</p>
          <p class="academic-desc">Strengthened English communication through full-immersion study with international classmates in a multicultural environment.</p>
          <div class="academic-chips"><span>English Immersion</span><span>International Environment</span><span>Communication Growth</span></div>
        </div>
      </article>
    `;
  }

  const style = document.createElement('style');
  style.textContent = `
    #education { position:relative; overflow:hidden; }
    #education::before { content:""; position:absolute; width:560px; height:560px; left:-250px; top:90px; border-radius:50%; background:radial-gradient(circle,rgba(91,163,160,.08),transparent 70%); pointer-events:none; }
    #education .section-head{max-width:820px} #education .edu-intro{max-width:760px;margin-top:1rem;color:var(--ink-dim);line-height:1.75}
    #education .academic-journey{position:relative;display:grid;gap:1.6rem;margin-top:2rem}
    #education .academic-journey::before{content:"";position:absolute;left:38px;top:30px;bottom:30px;width:1px;background:linear-gradient(to bottom,rgba(130,196,193,.48),rgba(255,255,255,.10),rgba(217,116,43,.36));z-index:0}
    #education .academic-card{--ex:50%;--ey:50%;position:relative;z-index:1;display:grid;grid-template-columns:84px 1fr;gap:1.45rem;align-items:start;padding:1.7rem 1.8rem;border:1px solid rgba(255,255,255,.10);border-radius:18px;background:linear-gradient(145deg,rgba(31,35,43,.98),rgba(25,29,36,.97));box-shadow:0 14px 34px rgba(0,0,0,.18);overflow:hidden;opacity:0;transform:translateY(24px) scale(.99);transition:opacity .55s ease,transform .45s cubic-bezier(.2,.8,.2,1),border-color .28s ease,box-shadow .28s ease}
    #education.edu-ready .academic-card{opacity:1;transform:translateY(0) scale(1)}
    #education.edu-ready .academic-card:nth-child(2){transition-delay:.10s} #education.edu-ready .academic-card:nth-child(3){transition-delay:.20s}
    #education .academic-card::before{content:attr(data-step);position:absolute;right:1.25rem;bottom:.75rem;font-family:var(--font-mono);font-size:4rem;line-height:1;color:rgba(255,255,255,.045);pointer-events:none}
    #education .academic-card::after{content:"";position:absolute;inset:0;pointer-events:none;opacity:0;background:radial-gradient(320px circle at var(--ex) var(--ey),rgba(130,196,193,.12),transparent 64%);transition:opacity .28s ease}
    #education .academic-card:hover{transform:translateY(-7px);border-color:rgba(232,163,95,.38);box-shadow:0 22px 48px rgba(0,0,0,.30)} #education .academic-card:hover::after{opacity:1}
    #education .academic-current{border-color:rgba(130,196,193,.46);box-shadow:0 16px 36px rgba(28,83,80,.14)}
    #education .academic-logo{position:relative;z-index:2;width:68px;height:68px;padding:7px;border-radius:16px;background:#fff;display:grid;place-items:center;overflow:hidden;box-shadow:0 8px 24px rgba(0,0,0,.22);transition:transform .3s ease,box-shadow .3s ease}
    #education .academic-logo img{width:100%;height:100%;object-fit:contain}
    #education .academic-current .academic-logo{box-shadow:0 0 0 1px rgba(130,196,193,.24),0 10px 26px rgba(91,163,160,.15)}
    #education .academic-foundation .academic-logo{box-shadow:0 0 0 1px rgba(232,163,95,.20),0 10px 26px rgba(232,163,95,.08)}
    #education .academic-card:hover .academic-logo{transform:translateY(-4px) scale(1.03)}
    #education .academic-content{position:relative;z-index:2;min-width:0}
    #education .academic-topline{display:flex;align-items:center;justify-content:space-between;gap:1rem;margin-bottom:.25rem}
    #education .academic-kicker{font-family:var(--font-mono);font-size:.66rem;letter-spacing:.11em;text-transform:uppercase;color:var(--ink-faint)}
    #education .academic-badge{display:inline-flex;align-items:center;padding:.36rem .64rem;border-radius:999px;font-family:var(--font-mono);font-size:.65rem;letter-spacing:.08em;text-transform:uppercase;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.045);white-space:nowrap}
    #education .badge-current{color:var(--teal-soft);background:rgba(130,196,193,.11);border-color:rgba(130,196,193,.25)}
    #education .badge-foundation{color:#e8b77e;background:rgba(232,163,95,.10);border-color:rgba(232,163,95,.23)}
    #education .badge-global{color:#d9dbe0;background:rgba(255,255,255,.055);border-color:rgba(255,255,255,.12)}
    #education .academic-meta{font-family:var(--font-mono);font-size:.82rem;color:var(--teal-soft);margin-bottom:.42rem}
    #education .academic-content h3{margin:.35rem 0 .35rem;font-family:var(--font-display);font-size:1.42rem;line-height:1.25;color:var(--ink)}
    #education .academic-school{margin:0 0 .7rem;color:#d8aa82;font-size:.98rem}
    #education .academic-desc{margin:0;max-width:760px;color:var(--ink-dim);line-height:1.7}
    #education .academic-chips{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:1rem}
    #education .academic-chips span{display:inline-flex;align-items:center;padding:.4rem .66rem;border-radius:999px;border:1px solid rgba(255,255,255,.10);background:rgba(255,255,255,.03);color:var(--ink-dim);font-size:.78rem;transition:transform .22s ease,color .22s ease,border-color .22s ease}
    #education .academic-card:hover .academic-chips span{transform:translateY(-1px);color:var(--ink);border-color:rgba(130,196,193,.19)}
    @media(max-width:760px){#education .academic-journey::before{display:none}#education .academic-card{grid-template-columns:1fr}#education .academic-topline{align-items:flex-start;flex-direction:column}#education .academic-badge{width:fit-content}#education .academic-card::before{font-size:3rem}}
    @media(prefers-reduced-motion:reduce){#education .academic-card{opacity:1!important;transform:none!important;transition:none!important}#education .academic-logo,#education .academic-chips span{transition:none!important}}
  `;
  document.head.appendChild(style);

  const cards = educationSection.querySelectorAll('.academic-card');
  cards.forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--ex', `${((e.clientX-r.left)/r.width)*100}%`);
      card.style.setProperty('--ey', `${((e.clientY-r.top)/r.height)*100}%`);
    });
    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--ex','50%');
      card.style.setProperty('--ey','50%');
    });
  });

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { educationSection.classList.add('edu-ready'); io.unobserve(e.target); } });
    }, { threshold: 0.18 });
    io.observe(educationSection);
  } else educationSection.classList.add('edu-ready');
}

// ===== Activities section =====
const activitiesSection = document.getElementById('activities');
if (activitiesSection) {
  const style = document.createElement('style');
  style.textContent = `
    #activities .section-head{max-width:760px} #activities .section-head::after{content:'Selected experiences in language, coordination, and cross-cultural involvement.';display:block;margin-top:1rem;max-width:690px;color:var(--ink-dim);font-size:1rem;line-height:1.7}
    #activities .gallery-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1.4rem;align-items:stretch}
    #activities .gallery-item{--mx:50%;--my:50%;position:relative;margin:0;min-height:365px;overflow:hidden;border:1px solid rgba(255,255,255,.10);border-radius:14px;background:#1a1d23;box-shadow:0 10px 30px rgba(0,0,0,.16);isolation:isolate;opacity:0;transform:translateY(26px) scale(.985);transition:opacity .55s ease,transform .45s cubic-bezier(.2,.8,.2,1),border-color .3s ease,box-shadow .3s ease}
    #activities .gallery-item.activity-visible{opacity:1;transform:translateY(0) scale(1)} #activities .gallery-item:hover{transform:translateY(-7px) scale(1.01);border-color:rgba(232,163,95,.46);box-shadow:0 22px 48px rgba(0,0,0,.32)}
    #activities .gallery-img{position:absolute;inset:0;width:100%;height:100%;overflow:hidden} #activities .gallery-img::after{content:'';position:absolute;inset:0;z-index:1;background:linear-gradient(to top,rgba(9,11,15,.96) 0%,rgba(9,11,15,.72) 28%,rgba(9,11,15,.25) 55%,rgba(9,11,15,.04) 82%);pointer-events:none}
    #activities .gallery-img img{width:100%;height:100%;object-fit:cover;filter:saturate(.86) contrast(1.03) brightness(.96);transition:transform .7s cubic-bezier(.2,.8,.2,1),filter .45s ease} #activities .gallery-item:hover .gallery-img img{transform:scale(1.065);filter:saturate(1) contrast(1.04) brightness(1.02)}
    #activities .gallery-item figcaption{position:absolute;z-index:2;left:1.25rem;right:1.25rem;bottom:1.2rem;padding:0;color:var(--ink);font-family:var(--font-body);font-size:1rem;font-weight:600;line-height:1.42;text-shadow:0 2px 10px rgba(0,0,0,.62);transition:transform .3s ease}
    #activities .gallery-item figcaption::before{display:block;width:fit-content;margin-bottom:.62rem;padding:.34rem .56rem;border:1px solid rgba(130,196,193,.34);border-radius:999px;background:rgba(17,20,25,.58);backdrop-filter:blur(8px);color:var(--teal-soft);font-family:var(--font-mono);font-size:.62rem;line-height:1;letter-spacing:.11em;font-weight:500}
    #activities .gallery-item:nth-child(1) figcaption::before{content:'LANGUAGE'} #activities .gallery-item:nth-child(2) figcaption::before{content:'INTERPRETING'} #activities .gallery-item:nth-child(3) figcaption::before{content:'CULTURAL EXCHANGE'} #activities .gallery-item:nth-child(4) figcaption::before{content:'PROGRAM SUPPORT'} #activities .gallery-item:nth-child(5) figcaption::before{content:'OPERATIONS SUPPORT'} #activities .gallery-item:nth-child(6) figcaption::before{content:'COMMUNITY'}
    #activities .gallery-item:hover figcaption{transform:translateY(-4px)} #activities .gallery-item::after{content:'';position:absolute;z-index:3;inset:0;pointer-events:none;opacity:0;background:radial-gradient(300px circle at var(--mx) var(--my),rgba(91,163,160,.12),transparent 62%);transition:opacity .3s ease} #activities .gallery-item:hover::after{opacity:1}
    @media(max-width:900px){#activities .gallery-grid{grid-template-columns:repeat(2,minmax(0,1fr))}} @media(max-width:620px){#activities .gallery-grid{grid-template-columns:1fr}#activities .gallery-item{min-height:330px}}
  `;
  document.head.appendChild(style);

  const cards = activitiesSection.querySelectorAll('.gallery-item');
  cards.forEach((card,index) => {
    card.style.transitionDelay = `${index*75}ms`;
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx',`${((e.clientX-r.left)/r.width)*100}%`);
      card.style.setProperty('--my',`${((e.clientY-r.top)/r.height)*100}%`);
    });
  });

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('activity-visible'); io.unobserve(e.target); } });
    }, { threshold: 0.14 });
    cards.forEach(card => io.observe(card));
  } else cards.forEach(card => card.classList.add('activity-visible'));
}

// ===== Contact form =====
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const submitBtn = contactForm ? contactForm.querySelector('button[type="submit"]') : null;

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(contactForm);
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }
    formStatus.textContent = '';
    formStatus.className = 'form-status';
    try {
      const response = await fetch('https://formspree.io/f/xjgqewdb', { method:'POST', body:data, headers:{'Accept':'application/json'} });
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
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Send message →'; }
    }
  });
}
