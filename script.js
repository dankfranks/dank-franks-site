// ==========================================
// 1. GLOBAL HELPERS & CANVAS LIGHTS
// ==========================================
const getCssVar = (name, fallback = 'rgba(0,0,0,0)') => {
  const val = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return val || fallback;
};

// Canvas orb objects initialized with safe color fallbacks
const lights = [
  { x: 0.15, y: 0.25, baseR: 160, color: getCssVar('--orb-1', 'rgba(235, 94, 40, 0.85)'), dx: 0.0004, dy: 0.0006, scaleAngle: 0 },
  { x: 0.75, y: 0.2,  baseR: 240, color: getCssVar('--orb-2', 'rgba(235, 120, 30, 0.65)'), dx: -0.0003, dy: 0.0005, scaleAngle: 2 },
  { x: 0.5,  y: 0.75, baseR: 280, color: getCssVar('--orb-3', 'rgba(0, 180, 216, 0.75)'), dx: 0.0005, dy: -0.0004, scaleAngle: 4 },
  { x: 0.1,  y: 0.1,  baseR: 280, color: getCssVar('--orb-3', 'rgba(0, 180, 216, 0.75)'), dx: 0.0005, dy: -0.0004, scaleAngle: 4 },
  { x: 0.85, y: 0.8,  baseR: 130, color: getCssVar('--orb-4', 'rgba(0, 220, 255, 0.9)'), dx: -0.0006, dy: -0.0003, scaleAngle: 1 },
  { x: 0.85, y: 0.3,  baseR: 50,  color: getCssVar('--orb-4', 'rgba(0, 220, 255, 0.9)'), dx: 0.0002, dy: -0.0003, scaleAngle: 8 },
  { x: 0.3,  y: 0.8,  baseR: 75,  color: getCssVar('--orb-1', 'rgba(235, 94, 40, 0.85)'), dx: 0.0001, dy: 0.0005, scaleAngle: 5 },
  { x: 0.05, y: 0.3,  baseR: 75,  color: getCssVar('--orb-4', 'rgba(0, 220, 255, 0.9)'), dx: -0.0001, dy: 0.0006, scaleAngle: 7 },
  { x: 0.2,  y: 0.8,  baseR: 190, color: getCssVar('--orb-5', 'rgba(0, 150, 214, 0.7)'), dx: 0.0003, dy: -0.0005, scaleAngle: 3 }
];

// ==========================================
// 2. HUD PRESET SWITCHER
// ==========================================
function setPreset(themeName) {
  document.documentElement.setAttribute('data-theme', themeName);
  localStorage.setItem('hud-preset', themeName);

  const presetButtons = document.querySelectorAll('.preset-btn');
  presetButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.preset === themeName);
  });

  if (typeof lights !== 'undefined' && lights.length >= 9) {
    lights[0].color = getCssVar('--orb-1', 'rgba(235, 94, 40, 0.85)');
    lights[1].color = getCssVar('--orb-2', 'rgba(235, 120, 30, 0.65)');
    lights[2].color = getCssVar('--orb-3', 'rgba(0, 180, 216, 0.75)');
    lights[3].color = getCssVar('--orb-3', 'rgba(0, 180, 216, 0.75)');
    lights[4].color = getCssVar('--orb-4', 'rgba(0, 220, 255, 0.9)');
    lights[5].color = getCssVar('--orb-4', 'rgba(0, 220, 255, 0.9)');
    lights[6].color = getCssVar('--orb-1', 'rgba(235, 94, 40, 0.85)');
    lights[7].color = getCssVar('--orb-4', 'rgba(0, 220, 255, 0.9)');
    lights[8].color = getCssVar('--orb-5', 'rgba(0, 150, 214, 0.7)');
  }
}

// ==========================================
// 3. SINGLE DOM INITIALIZATION BLOCK
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  // --- A. PRESETS INIT ---
  const presetButtons = document.querySelectorAll('.preset-btn');
  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => setPreset(btn.dataset.preset));
  });

  const savedTheme = localStorage.getItem('hud-preset') || 'cyber';
  setPreset(savedTheme);

  // --- B. CANVAS ANIMATION ENGINE ---
  const canvas = document.getElementById('light-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');

    function resize() {
      const banner = document.querySelector('.hud-header-banner');
      if (banner && canvas) {
        canvas.width = banner.clientWidth;
        canvas.height = banner.clientHeight;
      }
    }

    window.addEventListener('resize', resize);
    resize();

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      lights.forEach(light => {
        light.x += light.dx;
        light.y += light.dy;

        if (light.x < 0.05 || light.x > 0.95) light.dx *= -1;
        if (light.y < 0.05 || light.y > 0.95) light.dy *= -1;

        light.scaleAngle += 0.015;
        const radius = light.baseR * (1 + 0.2 * Math.sin(light.scaleAngle));

        const px = light.x * canvas.width;
        const py = light.y * canvas.height;

        const grad = ctx.createRadialGradient(px, py, 0, px, py, radius);
        grad.addColorStop(0, light.color);
        grad.addColorStop(1, 'transparent');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(animate);
    }
    animate();
  }

  // --- C. BANNER SLIDER ENGINE ---
  const slides = document.querySelectorAll('.slider-track .slide');
  const prevBtn = document.getElementById('hudPrevBtn');
  const nextBtn = document.getElementById('hudNextBtn');
  let currentIndex = 0;

  if (slides.length > 0) {
    function updateSlides(index) {
      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
      });
    }

    nextBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      currentIndex = (currentIndex + 1) % slides.length;
      updateSlides(currentIndex);
    });

    prevBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateSlides(currentIndex);
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const lightbox = document.getElementById('hud-lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const lightboxClose = document.getElementById('lightboxClose');

  let currentGallery = [];
  let currentIndex = 0;

  // Function to render active index into the HUD lightbox
  const updateLightboxContent = (index) => {
    if (currentGallery.length === 0) return;
    currentIndex = (index + currentGallery.length) % currentGallery.length; // Loop around boundaries
    const activeItem = currentGallery[currentIndex];

    if (lightboxImg && activeItem.src) {
      lightboxImg.src = activeItem.src;
    }
    if (lightboxCaption) {
      lightboxCaption.textContent = activeItem.caption;
    }
  };

  // Lightbox Trigger Event Listener
  document.querySelectorAll('.lightbox-trigger').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();

      // Group by data-gallery so prev/next only cycles within the same
      // set. Triggers with no data-gallery stand alone (group of one).
      const groupKey = trigger.getAttribute('data-gallery');
      const allTriggers = Array.from(document.querySelectorAll('.lightbox-trigger'));
      const galleryGroup = groupKey
        ? allTriggers.filter((item) => item.getAttribute('data-gallery') === groupKey)
        : [trigger];

      currentGallery = galleryGroup.map(item => ({
        src: item.getAttribute('href') || item.getAttribute('data-fullsrc') || item.querySelector('img')?.src,
        caption: item.getAttribute('data-caption') || ''
      }));

      currentIndex = galleryGroup.indexOf(trigger);

      if (currentIndex !== -1) {
        updateLightboxContent(currentIndex);
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
      }
    });
  });

  // Lightbox Arrow Controls
  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      updateLightboxContent(currentIndex - 1);
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      updateLightboxContent(currentIndex + 1);
    });
  }

  // Close Lightbox Actions
  const closeLightbox = () => {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    if (lightboxImg) lightboxImg.src = '';
  };

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard Shortcuts
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'ArrowLeft') updateLightboxContent(currentIndex - 1);
    if (e.key === 'ArrowRight') updateLightboxContent(currentIndex + 1);
    if (e.key === 'Escape') closeLightbox();
  });
});


document.addEventListener('DOMContentLoaded', () => {
  const scrollTopBtn = document.getElementById('scrollTopBtn');

  if (scrollTopBtn) {
    // Show/hide button based on vertical scroll offset
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    });

    // Smooth scroll to top on click
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});

// Circuit Canvas Initialization
document.addEventListener('DOMContentLoaded', () => {

// 2. --- DOUBLE-CLICK RESET FOR ALL HUD SLIDERS ---
  document.querySelectorAll('input[type="range"]').forEach(slider => {
    slider.addEventListener('dblclick', (e) => {
      e.preventDefault();
      // Grabs initial 'value' attribute from HTML markup
      const defaultValue = slider.getAttribute('value') ?? slider.min ?? 0;
      slider.value = defaultValue;
      slider.dispatchEvent(new Event('input'));
    });
  });
  const canvas = document.getElementById('circuit-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  const GRID_SIZE = 40;     // Grid cell size in pixels
  const MAX_PULSES = 24;    // Active animated paths on screen
  const PULSE_SPEED = 2;    // Movement speed (px per frame)
  const TRAIL_LENGTH = 100; // Length of the glowing line tail

  let width, height, cols, rows;
  let pulses = [];

  // Helper to grab computed CSS variable hex/rgb strings
  function getThemeColor(varName, defaultColor) {
    const color = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
    return color || defaultColor;
  }

  function resize() {
  width = canvas.width = window.innerWidth;
  // Span full scrollable height of the document
  height = canvas.height = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    window.innerHeight
  );
  
  cols = Math.floor(width / GRID_SIZE);
  rows = Math.floor(height / GRID_SIZE);
 }
  class Pulse {
    constructor() {
      this.reset();
    }

    reset() {
  this.gx = Math.floor(Math.random() * cols);
  this.gy = Math.floor(Math.random() * rows);
  this.x = this.gx * GRID_SIZE;
  this.y = this.gy * GRID_SIZE;
  
  this.dir = Math.floor(Math.random() * 4);
  this.history = [];
  this.life = 0;
  this.maxLife = Math.floor(Math.random() * 200) + 300;
  this.isDying = false; // Track trim-out phase
}

    update() {
  // Read Knob 1: Length
  const lengthInput = document.getElementById('hud-knob-length');
  const dynamicTrailLength = lengthInput ? parseFloat(lengthInput.value) : 100;

  // Read Knob 2: Speed
  const speedInput = document.getElementById('hud-knob-speed');
  const parsedSpeed = speedInput ? parseFloat(speedInput.value) : 0;
  const currentSpeed = (!isNaN(parsedSpeed) && parsedSpeed >= 0) ? parsedSpeed : 0;

  // Completely pause movement if speed is 0
  if (currentSpeed === 0) return;

  // Use effective speed for math to prevent division by zero
  const safeSpeed = Math.max(currentSpeed, 0.01);

  if (!this.isDying) {
    if (this.life > this.maxLife || this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
      this.isDying = true;
      if (pulses.length < MAX_PULSES * 1.5) {
        pulses.push(new Pulse());
      }
    }
  }

  if (this.isDying) {
    this.history.pop();
    this.history.pop();

    if (this.history.length === 0) {
      const index = pulses.indexOf(this);
      if (index > -1) {
        pulses.splice(index, 1);
      }
      return;
    }
  } else {
    this.history.unshift({ x: this.x, y: this.y });
    
    // Use safeSpeed so maxPoints remains finite
    const maxPoints = Math.max(Math.floor(dynamicTrailLength / safeSpeed), 2);
    while (this.history.length > maxPoints) {
      this.history.pop();
    }

    if (this.dir === 0) this.x += currentSpeed;
    if (this.dir === 1) this.y += currentSpeed;
    if (this.dir === 2) this.x -= currentSpeed;
    if (this.dir === 3) this.y -= currentSpeed;

    if (Math.abs(this.x % GRID_SIZE) < currentSpeed && Math.abs(this.y % GRID_SIZE) < currentSpeed) {
      this.x = Math.round(this.x / GRID_SIZE) * GRID_SIZE;
      this.y = Math.round(this.y / GRID_SIZE) * GRID_SIZE;

      if (Math.random() < 0.4) {
        const turn = Math.random() < 0.5 ? -1 : 1;
        this.dir = (this.dir + turn + 4) % 4;
      }
    }

    this.life++;
  }
    }

  draw() {
    if (this.history.length < 2) return;

    // Read Slider Width live (defaults to 0; hides lines when width is 0)
    const widthInput = document.getElementById('hud-line-width');
    const strokeWidth = widthInput ? parseFloat(widthInput.value) : 0;
    if (isNaN(strokeWidth) || strokeWidth <= 0) return;

    // Use primary accent theme color
    const strokeColor = getThemeColor('--stroke-color', '#00F0FF');

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(this.history[0].x, this.history[0].y);

    for (let i = 1; i < this.history.length; i++) {
      ctx.lineTo(this.history[i].x, this.history[i].y);
    }

    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Check if Earth preset/theme is active on the body
    const isEarthPreset = document.documentElement.getAttribute('data-theme') === 'earth';

    if (isEarthPreset) {
  ctx.shadowColor = 'rgba(0,0,0,0)';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
} else {
  ctx.shadowColor = strokeColor;
  ctx.shadowBlur = strokeWidth * 2.5;
}

    ctx.stroke();
    ctx.restore();
  }
}

  // Draw static grid lines (transparent as configured)
  function drawBackgroundGrid() {
    const borderColor = getThemeColor('--border', '#d6cfc4');

    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.0; 

    for (let x = 0; x <= width; x += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    for (let y = 0; y <= height; y += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    ctx.globalAlpha = 1.0;
  }

  function init() {
    resize();
    pulses = [];
    for (let i = 0; i < MAX_PULSES; i++) {
      pulses.push(new Pulse());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    drawBackgroundGrid();

    pulses.forEach(pulse => {
      pulse.update();
      pulse.draw();
    });

    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', resize);
  init();
  animate();
}); // <-- Closes the "Circuit Canvas Initialization" DOMContentLoaded (this page has
    // no #circuit-canvas element, so it used to `return` early and everything below
    // — including the zoom magnifier setup — was nested inside it and never ran.

// --- SVG KNOB RENDERER & INTERACTION CONTROLLER ---
function updateKnobSVG(knobWrapper) {
  const input = knobWrapper.querySelector('input');
  const path = knobWrapper.querySelector('.knob-wedge');
  if (!input || !path) return;

  const min = parseFloat(input.min) ?? 0;
  const max = parseFloat(input.max) ?? 10;
  const val = parseFloat(input.value) ?? min;

  let pct = (val - min) / (max - min);
  pct = Math.max(0, Math.min(1, pct));
  
  // Cap at 359.99 to prevent 360-degree SVG arc collapse
  const angleDeg = Math.min(pct * 360, 359.99);

  // Render a vertical line at 0 degrees
  if (angleDeg <= 0) {
    path.setAttribute('d', 'M 0 0 L 0 -20');
    return;
  }

  const rad = (angleDeg - 90) * (Math.PI / 180);
  const x = Math.cos(rad) * 20;
  const y = Math.sin(rad) * 20;
  const largeArcFlag = angleDeg > 180 ? 1 : 0;

  path.setAttribute('d', `M 0 0 L 0 -20 A 20 20 0 ${largeArcFlag} 1 ${x} ${y} Z`);
}

// Track active dragging knob centrally to prevent multiple listener conflicts
let activeKnobInput = null;
let activeKnobWrapper = null;
let startY = 0;
let startVal = 0;

document.querySelectorAll('.svg-knob').forEach(knobWrapper => {
  const input = knobWrapper.querySelector('input');
  if (!input) return;

  const sync = () => updateKnobSVG(knobWrapper);
  input.addEventListener('input', sync);
  sync();

  const handleDragStart = (e) => {
    e.preventDefault();
    activeKnobInput = input;
    startY = e.clientY;
    startVal = parseFloat(input.value) || 0;
    document.body.style.cursor = 'ns-resize';
  };

  knobWrapper.addEventListener('mousedown', handleDragStart);
  input.addEventListener('mousedown', handleDragStart);

  // --- DOUBLE CLICK RESET FOR KNOBS ---
  const handleReset = (e) => {
    e.preventDefault();
    // Read the original value attribute defined in HTML (or fallback to min)
    const defaultValue = input.getAttribute('value') ?? input.min ?? 0;
    input.value = defaultValue;
    input.dispatchEvent(new Event('input'));
  };

  knobWrapper.addEventListener('dblclick', handleReset);
  input.addEventListener('dblclick', handleReset);

  knobWrapper.addEventListener('wheel', (e) => {
    e.preventDefault();
    const min = parseFloat(input.min) ?? 0;
    const max = parseFloat(input.max) ?? 10;
    const step = parseFloat(input.step) || 0.1;
    const currentVal = parseFloat(input.value) ?? min;
    const delta = e.deltaY < 0 ? step : -step;

    input.value = Math.max(min, Math.min(max, currentVal + delta));
    input.dispatchEvent(new Event('input'));
  }, { passive: false });
});

// Single global drag listener for all knobs
window.addEventListener('mousemove', (e) => {
  if (!activeKnobInput) return;
  e.preventDefault();

  const deltaY = startY - e.clientY;
  
  // Safely parse min and max without || fallback breaking 0
  const minAttr = parseFloat(activeKnobInput.min);
  const maxAttr = parseFloat(activeKnobInput.max);
  const min = !isNaN(minAttr) ? minAttr : 0;
  const max = !isNaN(maxAttr) ? maxAttr : 10;
  
  const totalDragPixels = 600; 
  const valueRange = max - min;
  
  let newVal = startVal + (deltaY / totalDragPixels) * valueRange;
  newVal = Math.max(min, Math.min(max, newVal));

  activeKnobInput.value = newVal;
  activeKnobInput.dispatchEvent(new Event('input'));
});

window.addEventListener('mouseup', () => {
  if (activeKnobInput) {
    activeKnobInput = null;
    activeKnobWrapper = null;
    document.body.style.cursor = 'default';
  }
});

// --- PAN-AND-ZOOM HOVER (left "Render" image) ---
document.addEventListener('DOMContentLoaded', () => {
  const zoomContainers = document.querySelectorAll('.frame-zoom');

  zoomContainers.forEach((container) => {
    const img = container.querySelector('.zoom-img');
    if (!img) return;

    container.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();

      // Cursor position as a percentage inside the frame
      const x = Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100));
      const y = Math.min(100, Math.max(0, ((e.clientY - rect.top) / rect.height) * 100));

      // Anchor the zoom on that point — CSS scale + transition does the
      // rest, so the magnified area smoothly follows the cursor.
      img.style.transformOrigin = `${x}% ${y}%`;
    });

    container.addEventListener('mouseleave', () => {
      // Ease back to center so the next hover starts fresh
      img.style.transformOrigin = '50% 50%';
    });
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const sliders = document.querySelectorAll('.compare-slider');

  sliders.forEach((slider) => {
    const viewport = slider.querySelector('.compare-viewport');
    const range = slider.querySelector('.compare-range');
    if (!viewport || !range) return;

    const setPosition = (val) => {
      viewport.style.setProperty('--compare-pos', `${val}%`);
    };

    // Update on both live drag (input) and click jump (change)
    ['input', 'change'].forEach((evt) => {
      range.addEventListener(evt, () => setPosition(range.value));
    });

    // Initialize default state
    setPosition(range.value);
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  // Updated selector from dotlottie-player to lottie-player
  const lottiePlayers = document.querySelectorAll('.lottie-3x3-grid lottie-player');

  // Helper function to set sources based on toggle state
  const updateLottieSources = (isLightMode) => {
    lottiePlayers.forEach((player) => {
      const darkSrc = player.getAttribute('data-dark');
      const lightSrc = player.getAttribute('data-light');
      const targetSrc = isLightMode ? lightSrc : darkSrc;

      if (targetSrc) {
        // Sets the attribute AND triggers the lottie player reload
        player.setAttribute('src', targetSrc);
        if (typeof player.load === 'function') {
          player.load(targetSrc);
        }
      }
    });
  };

  // 1. Initialize default state on initial page load
  const isInitiallyLight = themeToggleBtn ? themeToggleBtn.checked : false;
  updateLottieSources(isInitiallyLight);
  document.body.classList.toggle('light-mode', isInitiallyLight);

  // 2. Listen for toggle changes
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('change', (e) => {
      const isLightMode = e.target.checked;
      
      // Toggle body class for CSS variables/overrides
      document.body.classList.toggle('light-mode', isLightMode);

      // Update Lottie animations
      updateLottieSources(isLightMode);
    });
  }
}); // <-- Closes the theme-toggle DOMContentLoaded. Everything below was
    // previously trapped inside it, which meant onYouTubeIframeAPIReady
    // wasn't actually a global function (the YouTube API couldn't find it),
    // and the gallery-slider DOMContentLoaded below never fired at all
    // (see the note further down for why that specifically breaks things).

// Load YouTube Iframe API
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

let player;
let isPlaying = true;

function onYouTubeIframeAPIReady() {
  player = new YT.Player('ytVideoIframe', {
    events: {
      'onReady': onPlayerReady
    }
  });
}

function onPlayerReady(event) {
  event.target.mute();
  event.target.playVideo();

  const overlay = document.getElementById('ytVideoOverlay');
  if (overlay) {
    overlay.addEventListener('click', () => {
      if (isPlaying) {
        player.pauseVideo();
        overlay.classList.add('is-paused');
        isPlaying = false;
      } else {
        player.playVideo();
        overlay.classList.remove('is-paused');
        isPlaying = true;
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const galleryContainer = document.getElementById('galleryContainer');
  const lightbox = document.getElementById('hud-lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lbPrev = document.getElementById('lightboxPrev');
  const lbNext = document.getElementById('lightboxNext');
  const lbClose = document.getElementById('lightboxClose');

  if (!galleryContainer) return;

  const thumbs = Array.from(galleryContainer.querySelectorAll('.gallery-thumb-strip .thumb-item'));
  const mainImg = galleryContainer.querySelector('#galleryMainImg');
  const galleryPrev = galleryContainer.querySelector('#galleryPrevBtn');
  const galleryNext = galleryContainer.querySelector('#galleryNextBtn');

  let activeIndex = 0;

  // --- SINGLE SOURCE OF TRUTH DISPLAY UPDATE ---
  const updateGalleryState = (index) => {
    if (!thumbs.length) return;
    
    // Keep index in bounds (loop around)
    activeIndex = (index + thumbs.length) % thumbs.length;
    const selectedThumb = thumbs[activeIndex];

    const targetSrc = selectedThumb.getAttribute('data-full') || selectedThumb.getAttribute('src');
    const targetCaption = selectedThumb.getAttribute('data-caption') || '';

    // Update Inline View
    if (mainImg) {
      mainImg.src = targetSrc;
      mainImg.alt = targetCaption || 'Gallery Image';
    }

    thumbs.forEach(t => t.classList.remove('active'));
    selectedThumb.classList.add('active');

    // Update Lightbox if actively open
    if (lightbox && lightbox.classList.contains('active')) {
      if (lightboxImg) lightboxImg.src = targetSrc;
      if (lightboxCaption) lightboxCaption.textContent = targetCaption;
    }
  };

  // --- INLINE PAGE CONTROLS ---
  thumbs.forEach((thumb, i) => {
    thumb.addEventListener('click', (e) => {
      e.stopPropagation();
      updateGalleryState(i);
    });
  });

  galleryPrev?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    updateGalleryState(activeIndex - 1);
  });

  galleryNext?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    updateGalleryState(activeIndex + 1);
  });

  // --- OPEN LIGHTBOX ON MAIN IMAGE CLICK ---
  mainImg?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    updateGalleryState(activeIndex);
    lightbox?.classList.add('active');
    lightbox?.setAttribute('aria-hidden', 'false');
  });

  // --- LIGHTBOX CONTROLS ---
  lbPrev?.addEventListener('click', (e) => {
    e.stopPropagation();
    updateGalleryState(activeIndex - 1);
  });

  lbNext?.addEventListener('click', (e) => {
    e.stopPropagation();
    updateGalleryState(activeIndex + 1);
  });

  lbClose?.addEventListener('click', () => {
    lightbox?.classList.remove('active');
    lightbox?.setAttribute('aria-hidden', 'true');
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox?.classList.contains('active')) return;
    if (e.key === 'ArrowLeft') updateGalleryState(activeIndex - 1);
    if (e.key === 'ArrowRight') updateGalleryState(activeIndex + 1);
    if (e.key === 'Escape') {
      lightbox.classList.remove('active');
      lightbox.setAttribute('aria-hidden', 'true');
    }
  });
});