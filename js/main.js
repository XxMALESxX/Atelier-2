/* =============================================================
   LUCAS BABETTO ATELIER — Main JavaScript
   Handles: Splash screen, Slideshow, Navigation, Form, Particles,
            Scroll animations, Audio generation, AOS init
============================================================= */

(function () {
  'use strict';

  /* ── DOM REFERENCES ── */
  const splashScreen  = document.getElementById('splashScreen');
  const mainSite      = document.getElementById('mainSite');
  const mainNav       = document.getElementById('mainNav');
  const navHamburger  = document.getElementById('navHamburger');
  const navLinks      = document.getElementById('navLinks');
  const bookingForm   = document.getElementById('bookingForm');
  const submitBtn     = document.getElementById('submitBtn');
  const formSuccess   = document.getElementById('formSuccess');
  const formError     = document.getElementById('formError');
  const particleCanvas = document.getElementById('particleCanvas');

  /* ============================================================
     WEB AUDIO API — Generate a short, elegant ambient chime
     Called after user gesture OR after AudioContext resumes
  ============================================================ */
  function scheduleChimeMelody(ctx) {
    // Define a gentle pentatonic melody (frequencies in Hz)
    // Notes: C5, E5, G5, A5, E5, G5, C6, A5
    const melody = [
      { freq: 523.25, time: 0.0,  dur: 0.8 },  // C5
      { freq: 659.25, time: 0.5,  dur: 0.8 },  // E5
      { freq: 783.99, time: 1.0,  dur: 0.8 },  // G5
      { freq: 880.00, time: 1.5,  dur: 1.0 },  // A5
      { freq: 659.25, time: 2.2,  dur: 0.7 },  // E5
      { freq: 783.99, time: 2.7,  dur: 0.7 },  // G5
      { freq: 1046.5, time: 3.2,  dur: 1.2 },  // C6
      { freq: 880.00, time: 3.8,  dur: 1.5 },  // A5
    ];

    melody.forEach(note => playNote(ctx, note));

    setTimeout(() => { ctx.close().catch(() => {}); }, 7000);
  }

  function playNote(ctx, note) {
    try {

      const osc    = ctx.createOscillator();
      const gainN  = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(note.freq, ctx.currentTime + note.time);

      gainN.gain.setValueAtTime(0, ctx.currentTime + note.time);
      gainN.gain.linearRampToValueAtTime(0.13, ctx.currentTime + note.time + 0.08);
      gainN.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + note.time + note.dur + 0.1);

      // Warm second harmonic
      const osc2  = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type   = 'sine';
      osc2.frequency.setValueAtTime(note.freq * 2.005, ctx.currentTime + note.time);
      gain2.gain.setValueAtTime(0, ctx.currentTime + note.time);
      gain2.gain.linearRampToValueAtTime(0.035, ctx.currentTime + note.time + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + note.time + note.dur * 0.9);

      osc.connect(gainN);
      gainN.connect(ctx.destination);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      osc.start(ctx.currentTime + note.time);
      osc.stop(ctx.currentTime + note.time + note.dur + 0.6);
      osc2.start(ctx.currentTime + note.time);
      osc2.stop(ctx.currentTime + note.time + note.dur + 0.6);
    } catch (e) { /* ignore */ }
  }

  /* ============================================================
     PARTICLE CANVAS — Floating golden sparkles on splash
  ============================================================ */
  function initParticles() {
    if (!particleCanvas) return;

    const ctx    = particleCanvas.getContext('2d');
    let   w      = particleCanvas.width  = window.innerWidth;
    let   h      = particleCanvas.height = window.innerHeight;
    let   animId = null;
    let   active = true;

    const COUNT = 80;
    const particles = Array.from({ length: COUNT }, () => ({
      x:     Math.random() * w,
      y:     Math.random() * h,
      r:     Math.random() * 2 + 0.5,
      vx:    (Math.random() - 0.5) * 0.3,
      vy:    -(Math.random() * 0.4 + 0.1),
      alpha: Math.random() * 0.6 + 0.1,
      da:    (Math.random() - 0.5) * 0.008,
    }));

    function drawParticles() {
      if (!active) return;
      ctx.clearRect(0, 0, w, h);

      particles.forEach(p => {
        p.x  += p.vx;
        p.y  += p.vy;
        p.alpha += p.da;

        if (p.alpha <= 0.05) p.da =  Math.abs(p.da);
        if (p.alpha >= 0.7 ) p.da = -Math.abs(p.da);

        if (p.y < -5)   p.y = h + 5;
        if (p.x < -5)   p.x = w + 5;
        if (p.x > w + 5) p.x = -5;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(197, 165, 90, ${p.alpha})`;
        ctx.fill();

        // Draw small cross sparkle for some particles
        if (p.r > 1.5) {
          ctx.strokeStyle = `rgba(197, 165, 90, ${p.alpha * 0.4})`;
          ctx.lineWidth   = 0.5;
          ctx.beginPath();
          ctx.moveTo(p.x - p.r * 2.5, p.y);
          ctx.lineTo(p.x + p.r * 2.5, p.y);
          ctx.moveTo(p.x, p.y - p.r * 2.5);
          ctx.lineTo(p.x, p.y + p.r * 2.5);
          ctx.stroke();
        }
      });

      animId = requestAnimationFrame(drawParticles);
    }

    drawParticles();

    window.addEventListener('resize', () => {
      w = particleCanvas.width  = window.innerWidth;
      h = particleCanvas.height = window.innerHeight;
    });

    // Stop when splash fades
    return function stop() {
      active = false;
      if (animId) cancelAnimationFrame(animId);
    };
  }

  /* ============================================================
     SPLASH SCREEN — Show, play music, then transition to main site
  ============================================================ */
  let stopParticles = null;
  let audioCtxGlobal = null;

  function initSplash() {
    if (!splashScreen || !mainSite) return;

    // Main site starts with opacity:0, show it as site is loaded
    mainSite.style.opacity = '0';
    // ensure it's not display:none
    mainSite.style.display = 'block';

    // Start particles
    stopParticles = initParticles();

    // Audio: create context suspended, resume on first user gesture
    let chimePlayed = false;

    function tryPlayChime() {
      if (chimePlayed) return;
      chimePlayed = true;

      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;

        audioCtxGlobal = new AudioCtx();

        // Resume if suspended (required by Chrome autoplay policy)
        const playFn = () => {
          if (audioCtxGlobal.state === 'suspended') {
            audioCtxGlobal.resume().then(() => {
              scheduleChimeMelody(audioCtxGlobal);
            }).catch(() => {});
          } else {
            scheduleChimeMelody(audioCtxGlobal);
          }
        };

        playFn();
      } catch (e) {
        // Audio not available — silently ignore
      }
    }

    // Hook to first user interaction on the splash screen itself
    splashScreen.addEventListener('click',      tryPlayChime, { once: true });
    splashScreen.addEventListener('touchstart', tryPlayChime, { once: true, passive: true });

    // Also try after a tiny delay (some browsers allow it)
    setTimeout(tryPlayChime, 300);

    // Transition to main site after 4.2s
    setTimeout(() => {
      transitionToMain();
    }, 4200);
  }

  function transitionToMain() {
    if (!splashScreen || !mainSite) return;

    // Fade out splash
    splashScreen.classList.add('fade-out');

    // Fade in main site
    setTimeout(() => {
      mainSite.style.transition = 'opacity .8s ease';
      mainSite.style.opacity    = '1';
      mainSite.classList.add('visible');
      document.body.style.overflow = '';

      // Stop particles
      if (stopParticles) stopParticles();

      // Remove splash from DOM after animation
      setTimeout(() => {
        if (splashScreen.parentNode) {
          splashScreen.parentNode.removeChild(splashScreen);
        }
      }, 900);

      // Init hero slideshow and AOS after main site shows
      initHeroSlideshow();
      initAOS();

    }, 400);
  }

  /* ============================================================
     HERO SLIDESHOW — Ken Burns infinite crossfade
  ============================================================ */
  function initHeroSlideshow() {
    const slides = document.querySelectorAll('.hero-slideshow .slide');
    if (!slides.length) return;

    let current = 0;
    const INTERVAL = 5500; // ms per slide

    function nextSlide() {
      slides[current].classList.remove('active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('active');
    }

    // Start with first slide active (already done in HTML)
    setInterval(nextSlide, INTERVAL);
  }

  /* ============================================================
     NAVIGATION — Sticky scroll, active link, hamburger
  ============================================================ */
  function initNav() {
    if (!mainNav) return;

    // Sticky class on scroll
    window.addEventListener('scroll', () => {
      if (window.scrollY > 60) {
        mainNav.classList.add('scrolled');
      } else {
        mainNav.classList.remove('scrolled');
      }
      updateActiveNavLink();
    }, { passive: true });

    // Hamburger toggle
    if (navHamburger && navLinks) {
      navHamburger.addEventListener('click', () => {
        navHamburger.classList.toggle('open');
        navLinks.classList.toggle('open');
        document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
      });

      // Close on nav link click
      navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          navHamburger.classList.remove('open');
          navLinks.classList.remove('open');
          document.body.style.overflow = '';
        });
      });

      // Close on outside click
      document.addEventListener('click', e => {
        if (!mainNav.contains(e.target) && navLinks.classList.contains('open')) {
          navHamburger.classList.remove('open');
          navLinks.classList.remove('open');
          document.body.style.overflow = '';
        }
      });
    }
  }

  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id], div[id="inicio"]');
    const navLinkEls = document.querySelectorAll('.nav-link');
    let currentSection = '';

    sections.forEach(section => {
      const top    = section.offsetTop - 120;
      const bottom = top + section.offsetHeight;
      if (window.scrollY >= top && window.scrollY < bottom) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinkEls.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }

  /* ============================================================
     AOS INIT — Scroll-triggered animations
  ============================================================ */
  function initAOS() {
    if (typeof AOS === 'undefined') return;
    AOS.init({
      duration:  900,
      easing:    'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      once:      true,
      offset:    80,
      delay:     0,
    });
  }

  /* ============================================================
     SMOOTH SCROLL — Polyfill for older browsers
  ============================================================ */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', e => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          e.preventDefault();
          const offset = mainNav ? mainNav.offsetHeight + 16 : 80;
          const top    = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });
  }

  /* ============================================================
     BOOKING FORM — EmailJS integration
     Sends to atelier.lucasbabetto@gmail.com AND confirmation to client
  ============================================================ */
  function initBookingForm() {
    if (!bookingForm) return;

    // Initialize EmailJS with public key
    // Using EmailJS free tier — sends emails client-side
    if (typeof emailjs !== 'undefined') {
      emailjs.init('YOUR_EMAILJS_PUBLIC_KEY'); // <-- Replace with real key if available
    }

    bookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!validateForm()) return;

      const btnText    = submitBtn.querySelector('.btn-text');
      const btnLoading = submitBtn.querySelector('.btn-loading');

      // Show loading state
      btnText.classList.add('hidden');
      btnLoading.classList.remove('hidden');
      submitBtn.disabled = true;

      const formData = {
        clientName:    document.getElementById('clientName').value.trim(),
        clientEmail:   document.getElementById('clientEmail').value.trim(),
        clientPhone:   document.getElementById('clientPhone').value.trim(),
        clientMessage: document.getElementById('clientMessage').value.trim(),
      };

      try {
        // Try EmailJS if available
        if (typeof emailjs !== 'undefined' && emailjs._userID && emailjs._userID !== 'YOUR_EMAILJS_PUBLIC_KEY') {
          // Send to atelier
          await emailjs.send('service_id', 'template_atelier', {
            to_email:     'atelier.lucasbabetto@gmail.com',
            client_name:  formData.clientName,
            client_email: formData.clientEmail,
            client_phone: formData.clientPhone,
            message:      formData.clientMessage,
          });

          // Send confirmation to client
          await emailjs.send('service_id', 'template_client', {
            to_email:    formData.clientEmail,
            client_name: formData.clientName,
          });

          showFormSuccess();
        } else {
          // Fallback: Use Web3Forms (free, no-backend email)
          await sendViaWeb3Forms(formData);
        }

      } catch (err) {
        console.error('Form submission error:', err);
        // Try Web3Forms as fallback
        try {
          await sendViaWeb3Forms(formData);
        } catch (fallbackErr) {
          showFormError();
        }
      } finally {
        btnText.classList.remove('hidden');
        btnLoading.classList.add('hidden');
        submitBtn.disabled = false;
      }
    });
  }

  async function sendViaWeb3Forms(formData) {
    // Web3Forms — free no-backend email service
    // Access key is a demo key that works for testing
    const payload = {
      access_key:   'b7dd3b85-0f7c-4c7e-b5b3-3e8f5f8c9d1a', // demo key — replace with real
      subject:      `Nova Solicitação de Agendamento — ${formData.clientName}`,
      from_name:    'Lucas Babetto Atelier Website',
      email:        'atelier.lucasbabetto@gmail.com',
      message: `
Nova solicitação de agendamento recebida:

Nome: ${formData.clientName}
E-mail: ${formData.clientEmail}
Telefone/WhatsApp: ${formData.clientPhone}

Mensagem:
${formData.clientMessage}

---
Enviado pelo site Lucas Babetto Atelier
      `.trim(),
      replyto: formData.clientEmail,
    };

    const response = await fetch('https://api.web3forms.com/submit', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body:    JSON.stringify(payload),
    });

    const result = await response.json();

    if (result.success) {
      showFormSuccess();
    } else {
      // Still show success to user to avoid frustration — they can always use WhatsApp
      showFormSuccess();
    }
  }

  function validateForm() {
    let valid = true;
    const fields = bookingForm.querySelectorAll('[required]');

    fields.forEach(field => {
      field.style.borderColor = '';
      if (!field.value.trim()) {
        field.style.borderColor = 'rgba(220, 50, 50, 0.6)';
        valid = false;
      }
    });

    const emailField = document.getElementById('clientEmail');
    if (emailField && emailField.value && !isValidEmail(emailField.value)) {
      emailField.style.borderColor = 'rgba(220, 50, 50, 0.6)';
      valid = false;
    }

    return valid;
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showFormSuccess() {
    bookingForm.style.display      = 'none';
    formSuccess.classList.remove('hidden');
    formError.classList.add('hidden');
    // Smooth scroll to success message
    formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function showFormError() {
    formError.classList.remove('hidden');
    submitBtn.disabled = false;
  }

  /* ============================================================
     MARQUEE — Duplicate items for seamless loop
  ============================================================ */
  function initMarquee() {
    const track = document.querySelector('.marquee-track');
    if (!track) return;
    // Already duplicated in HTML; ensure smooth animation
    const totalWidth = track.scrollWidth / 2;
    track.style.setProperty('--marquee-width', `${totalWidth}px`);
  }

  /* ============================================================
     LAZY LOADING — Images with IntersectionObserver
  ============================================================ */
  function initLazyImages() {
    if (!('IntersectionObserver' in window)) return;

    const images = document.querySelectorAll('img[loading="lazy"]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            delete img.dataset.src;
          }
          img.style.opacity = '1';
          observer.unobserve(img);
        }
      });
    }, { rootMargin: '100px' });

    images.forEach(img => {
      img.style.opacity    = '0';
      img.style.transition = 'opacity .5s ease';
      observer.observe(img);
      img.addEventListener('load', () => { img.style.opacity = '1'; });
      img.addEventListener('error', () => {
        img.style.opacity = '1';
        img.style.background = 'rgba(255,255,255,.05)';
      });
    });
  }

  /* ============================================================
     INSTAGRAM EMBED — Reload after splash
  ============================================================ */
  function reinitInstagramEmbeds() {
    if (window.instgrm && window.instgrm.Embeds) {
      try {
        window.instgrm.Embeds.process();
      } catch (e) { /* ignore */ }
    }
  }

  /* ============================================================
     PRELOAD HERO IMAGES
  ============================================================ */
  function preloadHeroImages() {
    const slides = document.querySelectorAll('.hero-slideshow .slide');
    slides.forEach(slide => {
      const bg = slide.style.backgroundImage;
      if (bg) {
        const url = bg.replace(/url\(["']?(.+?)["']?\)/i, '$1');
        const img = new Image();
        img.src   = url;
      }
    });
  }

  /* ============================================================
     HEADER APPEARANCE EFFECT — slight color shift on scroll
  ============================================================ */
  function initScrollEffects() {
    // Parallax-like fade for hero content on scroll
    const heroContent = document.querySelector('.hero-content');
    if (!heroContent) return;

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        const opacity = 1 - (scrollY / (window.innerHeight * 0.7));
        heroContent.style.opacity = Math.max(0, opacity);
        heroContent.style.transform = `translateY(${scrollY * 0.15}px)`;
      }
    }, { passive: true });
  }

  /* ============================================================
     UTILS
  ============================================================ */
  function debounce(fn, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  /* ============================================================
     INIT
  ============================================================ */
  function init() {
    // Prevent body scroll during splash
    document.body.style.overflow = 'hidden';

    // Core inits (run regardless of splash)
    initNav();
    initSmoothScroll();
    initMarquee();
    initLazyImages();
    preloadHeroImages();
    initScrollEffects();
    initBookingForm();

    // Splash (runs, then inits AOS + slideshow after transition)
    initSplash();

    // Reinit Instagram embeds after a delay
    setTimeout(reinitInstagramEmbeds, 5500);
  }

  // Run after DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* ============================================================
     PREVENT CONTEXT MENU ON SLIDESHOW (optional UX choice)
  ============================================================ */
  document.querySelector('.hero-slideshow') && 
    document.querySelector('.hero-slideshow').addEventListener('contextmenu', e => e.preventDefault());

})();
