/* ==========================================================================
   Interactive Greeting Website Interaction Scripts
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initParticleSystem();
  initThemeToggle();
  initSkvortsovScrollAnimations();
  initWelcomeCelebrate();
  initInstaScrollPill();
});

function initWelcomeCelebrate() {
  const celebrateBtn = document.getElementById('celebrate-btn');
  if (!celebrateBtn) return;
  celebrateBtn.addEventListener('click', () => {
    triggerHaptic([20, 50, 20]);
    triggerConfettiBurst();
  });
}

function initInstaScrollPill() {
  const pill = document.getElementById('insta-scroll-pill');
  if (!pill) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 120) {
      pill.classList.add('visible');
    } else {
      pill.classList.remove('visible');
    }
  });
}

/* --- Minimal Scroll Reveal Controller --- */
function initSkvortsovScrollAnimations() {
  const revealElements = document.querySelectorAll('[data-scroll-reveal]');
  
  if (!revealElements.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -8% 0px',
    threshold: 0.1
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, observerOptions);

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });
}

/* --- Initial Splash Screen Preloader --- */
function initPreloader() {
  const preloader = document.getElementById('initial-loader');
  if (!preloader) return;

  setTimeout(() => {
    preloader.classList.add('fade-out');
    setTimeout(() => {
      preloader.remove();
    }, 650);
  }, 900);
}

/* --- Navigation Active Link Tracking (Desktop, Mobile Drawer & Bottom Bar) --- */
function initNavigation() {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');
  const drawerLinks = document.querySelectorAll('.drawer-link');
  const bottomNavItems = document.querySelectorAll('.bottom-nav-item');

  function updateActiveNav() {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (window.scrollY >= (sectionTop - 180)) {
        current = section.getAttribute('id');
      }
    });

    // Top desktop menu links
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').slice(1) === current) {
        link.classList.add('active');
      }
    });

    // Mobile side drawer links
    drawerLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').slice(1) === current) {
        link.classList.add('active');
      }
    });

    // Mobile bottom navigation items
    bottomNavItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('data-target') === current) {
        item.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav);
  updateActiveNav();
}

/* --- Interactive Particle Background --- */
function initParticleSystem() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let particlesArray = [];
  let mouse = {
    x: null,
    y: null,
    radius: 120
  };

  // Adjust canvas size
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Track mouse
  window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Particle Class
  class Particle {
    constructor(x, y, directionX, directionY, size, color) {
      this.x = x;
      this.y = y;
      this.directionX = directionX;
      this.directionY = directionY;
      this.size = size;
      this.color = color;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
      ctx.fillStyle = this.color;
      ctx.fill();
    }

    update() {
      // Check boundaries
      if (this.x > canvas.width || this.x < 0) {
        this.directionX = -this.directionX;
      }
      if (this.y > canvas.height || this.y < 0) {
        this.directionY = -this.directionY;
      }

      // Mouse collision / push effect
      if (mouse.x != null && mouse.y != null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius + this.size) {
          if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
            this.x += 3;
          }
          if (mouse.x > this.x && this.x > this.size * 10) {
            this.x -= 3;
          }
          if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
            this.y += 3;
          }
          if (mouse.y > this.y && this.y > this.size * 10) {
            this.y -= 3;
          }
        }
      }

      // Move particle
      this.x += this.directionX;
      this.y += this.directionY;
      this.draw();
    }
  }

  // Populate particles
  function initParticles() {
    particlesArray = [];
    let numberOfParticles = (canvas.width * canvas.height) / 9000;
    numberOfParticles = Math.min(numberOfParticles, 120); // cap particles
    
    // Choose particle colors based on active theme
    const isLightTheme = document.body.classList.contains('light-theme');
    const color = isLightTheme ? 'rgba(6, 78, 59, 0.08)' : 'rgba(16, 185, 129, 0.15)';

    for (let i = 0; i < numberOfParticles; i++) {
      let size = (Math.random() * 3) + 1;
      let x = (Math.random() * ((innerWidth - size * 2) - size * 2)) + size * 2;
      let y = (Math.random() * ((innerHeight - size * 2) - size * 2)) + size * 2;
      let directionX = (Math.random() * 0.4) - 0.2;
      let directionY = (Math.random() * 0.4) - 0.2;

      particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
  }

  // Draw connecting lines
  function connect() {
    let opacityValue = 1;
    const isLightTheme = document.body.classList.contains('light-theme');
    
    for (let a = 0; a < particlesArray.length; a++) {
      for (let b = a; b < particlesArray.length; b++) {
        let dx = particlesArray[a].x - particlesArray[b].x;
        let dy = particlesArray[a].y - particlesArray[b].y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 120) {
          opacityValue = 1 - (distance / 120);
          ctx.strokeStyle = isLightTheme 
            ? `rgba(6, 78, 59, ${opacityValue * 0.06})` 
            : `rgba(16, 185, 129, ${opacityValue * 0.08})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
          ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
          ctx.stroke();
        }
      }
    }
  }

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
    }
    connect();
  }

  // Watch for theme changes to reset particle colors
  window.addEventListener('theme-changed', initParticles);

  initParticles();
  animate();
}

/* --- Theme Toggler & Automatic System Preference Detection --- */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  const systemDarkQuery = window.matchMedia('(prefers-color-scheme: dark)');

  function applyTheme(themeName) {
    if (themeName === 'dark') {
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
      document.documentElement.classList.remove('light-theme');
      document.documentElement.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
      document.documentElement.classList.remove('dark-theme');
      document.documentElement.classList.add('light-theme');
    }
    // Trigger custom event to notify particle system
    window.dispatchEvent(new Event('theme-changed'));
  }

  // Determine initial theme:
  // 1. If user previously manually selected a theme, use saved preference.
  // 2. Otherwise (first boot/visit on device), automatically detect system OS theme preference.
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark' || savedTheme === 'light') {
    applyTheme(savedTheme);
  } else {
    // First boot: Auto-detect device system theme
    const systemTheme = systemDarkQuery.matches ? 'dark' : 'light';
    applyTheme(systemTheme);
  }

  // Listen for real-time OS system theme changes (if user hasn't manually overridden)
  if (systemDarkQuery.addEventListener) {
    systemDarkQuery.addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    const isCurrentlyLight = document.body.classList.contains('light-theme');
    const newTheme = isCurrentlyLight ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  });
}

/* --- Personalized Card Builder --- */
function initCardBuilder() {
  const form = document.getElementById('greeting-form');
  const nameInput = document.getElementById('junior-name');
  const deptSelect = document.getElementById('junior-dept');
  const msgInput = document.getElementById('welcome-message');
  const themeRadios = document.querySelectorAll('input[name="card-theme"]');
  const themeOptions = document.querySelectorAll('.theme-option');

  // Preview elements
  const previewCard = document.getElementById('greeting-card-preview');
  const previewName = document.getElementById('preview-name');
  const previewDept = document.getElementById('preview-dept');
  const previewMsg = document.getElementById('preview-message');

  const downloadBtn = document.getElementById('download-card');
  const celebrateBtn = document.getElementById('celebrate-btn');

  if (!form || !previewCard) return;

  // Sync Input Elements Live
  function updatePreview() {
    previewName.textContent = nameInput.value.trim() || 'Your Name';
    previewDept.textContent = deptSelect.value || 'Select Branch';
    previewMsg.textContent = msgInput.value.trim() 
      ? `"${msgInput.value.trim()}"` 
      : '"Welcome to the journey of a lifetime. The future is code."';
  }

  nameInput.addEventListener('input', updatePreview);
  deptSelect.addEventListener('change', updatePreview);
  msgInput.addEventListener('input', updatePreview);

  // Theme option clicks
  themeOptions.forEach(option => {
    option.addEventListener('click', () => {
      themeOptions.forEach(opt => opt.classList.remove('active'));
      option.classList.add('active');

      const radio = option.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;
        
        // Remove previous themes and add new theme class
        const currentTheme = radio.value;
        previewCard.className = `greeting-card ${currentTheme}`;
      }
    });
  });

  // Submit Card
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    updatePreview();
    triggerConfettiBurst();

    // Scroll to preview smoothly on smaller viewports
    if (window.innerWidth < 992) {
      previewCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

  // Confetti trigger
  celebrateBtn.addEventListener('click', () => {
    triggerHaptic([20, 50, 20]);
    triggerConfettiBurst();
  });

  // Save Card / Print View Card
  downloadBtn.addEventListener('click', () => {
    triggerHaptic(15);
    // Dynamically inject custom print styles for the greeting card to avoid print dialog cluttering
    let printStyle = document.getElementById('card-print-style');
    if (!printStyle) {
      printStyle = document.createElement('style');
      printStyle.id = 'card-print-style';
      printStyle.innerHTML = `
        @media print {
          body * {
            visibility: hidden !important;
          }
          #greeting-card-preview, #greeting-card-preview * {
            visibility: visible !important;
          }
          #greeting-card-preview {
            position: absolute !important;
            left: 50% !important;
            top: 50% !important;
            transform: translate(-50%, -50%) scale(1.3) !important;
            box-shadow: none !important;
            border: 2px solid #ccc !important;
          }
        }
      `;
      document.head.appendChild(printStyle);
    }
    window.print();
  });
}

function triggerConfettiBurst() {
  if (typeof confetti === 'function') {
    // First burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Secondary delayed burst
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
    }, 200);

    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });
    }, 400);
  }
}

/* --- Advice Cards Flip (Mobile Click support) --- */
function initAdviceFlip() {
  const cards = document.querySelectorAll('.flip-card');
  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Toggle class so mobile users who tap can see the card reverse
      card.classList.toggle('flipped');
    });
  });
}

/* --- Digital Guestbook Management --- */
function initGuestbook() {
  const form = document.getElementById('guestbook-form');
  const feed = document.getElementById('guestbook-feed');
  if (!form || !feed) return;

  const defaultNotes = [
    {
      id: 1,
      name: "Marcus Aurelius",
      role: "Senior",
      message: "Welcome, freshers! Make mistakes early, learn quickly, and don't hesitate to pull in seniors when debugging hard algorithms. Happy Coding!",
      mood: "💻",
      likes: 12,
      date: "July 28, 2026",
      isUserAdded: false
    },
    {
      id: 2,
      name: "Chloe Vance",
      role: "Junior",
      message: "Incredibly excited to join the tech stack! The interactive welcoming board is so cool. Looking forward to our first team building sync!",
      mood: "🚀",
      likes: 7,
      date: "July 29, 2026",
      isUserAdded: false
    },
    {
      id: 3,
      name: "Elena Rostova",
      role: "Alumni",
      message: "You're entering an incredibly supportive hub. Keep your focus high, keep building pet projects, and always maintain your curiosity. Best of luck!",
      mood: "🔥",
      likes: 15,
      date: "July 29, 2026",
      isUserAdded: false
    }
  ];

  // Fetch or initialize local storage
  let savedNotes = localStorage.getItem('guestbook_notes');
  if (!savedNotes) {
    localStorage.setItem('guestbook_notes', JSON.stringify(defaultNotes));
    savedNotes = JSON.stringify(defaultNotes);
  }

  let notes = JSON.parse(savedNotes);

  function renderNotes() {
    if (notes.length === 0) {
      feed.innerHTML = `
        <div class="empty-feed">
          <i class="fa-solid fa-box-open"></i>
          <p>No greeting notes pinned yet. Be the first to pin one!</p>
        </div>
      `;
      return;
    }

    feed.innerHTML = '';
    // Display latest first
    const reversedNotes = [...notes].reverse();

    reversedNotes.forEach(note => {
      const roleClass = note.role === 'Junior' ? 'role-junior' : (note.role === 'Senior' ? 'role-senior' : 'role-alumni');
      const noteElement = document.createElement('div');
      noteElement.className = 'note-item';
      
      let actionsHTML = `
        <div class="note-actions">
          <button class="note-action-btn btn-like" onclick="likeNote(${note.id})" aria-label="Like message">
            <i class="fa-regular fa-thumbs-up"></i> <span>${note.likes}</span>
          </button>
      `;

      // Allow deletion only for user-added notes to prevent breaking the mock dashboard feel
      if (note.isUserAdded) {
        actionsHTML += `
          <button class="note-action-btn btn-delete" onclick="deleteNote(${note.id})" aria-label="Delete message">
            <i class="fa-solid fa-trash-can"></i> Delete
          </button>
        `;
      }
      
      actionsHTML += `</div>`;

      noteElement.innerHTML = `
        <div class="note-header">
          <div class="note-author-info">
            <span class="note-name">${escapeHTML(note.name)}</span>
            <span class="note-role ${roleClass}">${note.role}</span>
          </div>
          <span class="note-date">${note.date}</span>
        </div>
        <p class="note-text">${escapeHTML(note.message)}</p>
        <div class="note-footer">
          <span class="note-mood">${note.mood}</span>
          ${actionsHTML}
        </div>
      `;

      feed.appendChild(noteElement);
    });
  }

  // Submit Note Form
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameVal = document.getElementById('gb-name').value.trim();
    const roleVal = document.getElementById('gb-role').value;
    const msgVal = document.getElementById('gb-message').value.trim();
    const emojiVal = document.querySelector('input[name="gb-emoji"]:checked').value;

    const newNote = {
      id: Date.now(),
      name: nameVal,
      role: roleVal,
      message: msgVal,
      mood: emojiVal,
      likes: 0,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      isUserAdded: true
    };

    notes.push(newNote);
    localStorage.setItem('guestbook_notes', JSON.stringify(notes));
    
    // Play splash confetti
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 40,
        angle: 90,
        spread: 60,
        origin: { y: 0.8 }
      });
    }

    renderNotes();
    form.reset();
  });

  // Expose like and delete functions globally
  window.likeNote = function(id) {
    notes = notes.map(note => {
      if (note.id === id) {
        return { ...note, likes: note.likes + 1 };
      }
      return note;
    });
    localStorage.setItem('guestbook_notes', JSON.stringify(notes));
    renderNotes();
  };

  window.deleteNote = function(id) {
    notes = notes.filter(note => note.id !== id);
    localStorage.setItem('guestbook_notes', JSON.stringify(notes));
    renderNotes();
  };

  // Helper function to prevent XSS
  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }

  renderNotes();
}

/* --- FAQ Accordion Interactivity --- */
function initFAQAccordion() {
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const content = header.nextElementSibling;
      const isActive = item.classList.contains('active');

      // Close all accordion items
      document.querySelectorAll('.accordion-item').forEach(el => {
        el.classList.remove('active');
        el.querySelector('.accordion-content').style.maxHeight = null;
      });

      // If clicked item wasn't active, open it
      if (!isActive) {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + "px";
        triggerHaptic(10);
      }
    });
  });
}

/* --- Mobile Drawer Side Menu Navigation --- */
function initMobileDrawer() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const closeBtn = document.getElementById('drawer-close-btn');
  const drawer = document.getElementById('mobile-drawer');
  const backdrop = document.getElementById('drawer-backdrop');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  if (!drawer || !backdrop) return;

  function openDrawer() {
    drawer.classList.add('active');
    backdrop.classList.add('active');
    if (toggleBtn) toggleBtn.classList.add('active');
    document.body.style.overflow = 'hidden';
    triggerHaptic(15);
  }

  function closeDrawer() {
    drawer.classList.remove('active');
    backdrop.classList.remove('active');
    if (toggleBtn) toggleBtn.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      if (drawer.classList.contains('active')) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });
  }

  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('active')) {
      closeDrawer();
    }
  });
}

/* --- Native Mobile Web Share API --- */
function initMobileShare() {
  const shareBtn = document.getElementById('share-card-btn');
  if (!shareBtn) return;

  shareBtn.addEventListener('click', async () => {
    triggerHaptic([15, 30, 15]);

    const name = document.getElementById('preview-name')?.textContent || 'Junior';
    const dept = document.getElementById('preview-dept')?.textContent || 'Engineering';
    const quote = document.getElementById('preview-message')?.textContent || '';

    const shareData = {
      title: `${name}'s Official Welcome Card`,
      text: `🎉 Hi everyone! Check out my official Welcome Card for ${dept}: ${quote} #HubForJuniors`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        showMobileToast('<i class="fa-solid fa-circle-check"></i> Shared successfully!');
      } catch (err) {
        if (err.name !== 'AbortError') {
          fallbackCopyToClipboard(shareData.text);
        }
      }
    } else {
      fallbackCopyToClipboard(shareData.text);
    }
  });
}

function fallbackCopyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showMobileToast('<i class="fa-solid fa-copy"></i> Greeting card copied to clipboard!');
  }).catch(() => {
    showMobileToast('<i class="fa-solid fa-sparkles"></i> Welcome Card is ready to share!');
  });
}

/* --- Mobile Toast Notification Helper --- */
function showMobileToast(messageHTML) {
  let toast = document.querySelector('.mobile-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'mobile-toast';
    document.body.appendChild(toast);
  }

  toast.innerHTML = messageHTML;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}

/* --- Mobile Haptic Feedback Helper --- */
function triggerHaptic(pattern = 15) {
  if ('vibrate' in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch (e) {
      // Ignore if not supported or restricted by browser permissions
    }
  }
}

/* ==========================================================================
   Achievement Gallery — Data Injector
   Reads from achievements-data.js and populates title/desc on each card.
   ========================================================================== */
(function injectAchievementData() {
  if (typeof achievementsData === 'undefined') return;

  achievementsData.forEach(function (item) {
    var card = document.querySelector('[data-achievement-id="' + item.id + '"]');
    if (!card) return;

    var titleEl = card.querySelector('.achievement-gallery-title');
    var descEl  = card.querySelector('.achievement-gallery-desc');
    var overlay = card.querySelector('.achievement-gallery-overlay');

    if (titleEl) titleEl.textContent = item.title || '';
    if (descEl)  descEl.textContent  = item.desc  || '';

    // If no title AND no desc, hide the text overlay (photo-only mode)
    if (!item.title && !item.desc && overlay) {
      overlay.style.display = 'none';
    }
  });
})();
