// Fixed Composition Config based on precise template coordinate calibration
// New poster: Venture Capital Hackathon (1086x1448 original, 3:4 ratio)
// Circle measured from 4 circumference points: Top(539,666) Left(371,843) Bottom(541,1009) Right(715,855)
// Calculated center: (543, 838), radius: 172 in original coords
// Scale to 1080-wide: factor = 1080/1086 = 0.9945
const POSTER_DIMENSIONS = {
  canvasWidth: 1080,
  canvasHeight: 1440,

  // Custom template coordinates (Assets folder default-poster.png)
  custom: {
    portrait: {
      cx: 540,
      cy: 833,
      r: 171
    },
    name: {
      x: 540,
      y: 1055,
      maxWidth: 300,
      fontSize: 30,
      color: '#0b1329' // Deep navy
    },
    college: {
      x: 540,
      y: 1095,
      maxWidth: 300,
      fontSize: 20,
      color: '#4c1d95' // Rich dark purple
    },
    bottomTextMask: {
      x: 380,
      y: 1030,
      w: 320,
      h: 90
    }
  },

  // Fallback programmatic layout coordinates (for 1080x1440 canvas)
  fallback: {
    portrait: {
      cx: 540,
      cy: 550,
      r: 180
    },
    name: {
      x: 540,
      y: 880,
      maxWidth: 800,
      fontSize: 54,
      color: '#0b1329'
    },
    college: {
      x: 540,
      y: 950,
      maxWidth: 760,
      fontSize: 32,
      color: '#7c3aed'
    }
  }
};

// State management - Premium STUDLYF Ecosystem Identity Card (Soft Light Theme)
const state = {
  // Images
  studentImage: null,
  templateImage: null,
  isUsingCustomTemplate: false,

  // Student details
  studentName: 'Akash Kumar',
  studentCollege: 'IIT KHARAGPUR',

  // Keep original configuration coordinates/logic intact
  renderOrder: 'photo-below',
  photoX: 340,
  photoY: 180,
  photoW: 400,
  photoH: 400
};

// Canvas elements
const canvas = document.getElementById('renderCanvas');
const ctx = canvas.getContext('2d');
const canvasWrapper = document.getElementById('canvasWrapper');

// UI elements mapping
const elements = {
  studentName: document.getElementById('studentName'),
  studentCollege: document.getElementById('studentCollege'),
  portraitDropzone: document.getElementById('portraitDropzone'),
  portraitFile: document.getElementById('portraitFile'),
  thumbnailPreview: document.getElementById('thumbnailPreview'),
  uploadSuccess: document.getElementById('uploadSuccess'),

  // Actions
  downloadBtn: document.getElementById('downloadBtn'),
  linkedinFollowBtn: document.getElementById('linkedinFollowBtn')
};

// Fallback error handlers for logos
function handleHeroLogoError(img) {
  img.style.display = 'none';
}

function handleBowerLogoError(img) {
  img.style.display = 'none';
}

// Logo upload handler in main header area (fallback)
function handleHeaderLogoError(img) {
  img.style.display = 'none';
  const placeholder = document.getElementById('logoPlaceholder');
  if (placeholder) {
    placeholder.style.display = 'block';
  }
}

// Logo upload listener
const logoUpload = document.getElementById('logoUpload');
const logoImg = document.getElementById('logoImg');
if (logoUpload && logoImg) {
  logoUpload.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        logoImg.src = event.target.result;
        logoImg.style.display = 'block';
        const placeholder = document.getElementById('logoPlaceholder');
        if (placeholder) placeholder.style.display = 'none';
      };
      reader.readAsDataURL(file);
    }
  });
}

// Initialize Default Template - Loads custom default-poster.png or falls back to programmatic card
function generateDefaultTemplate() {
  const img = new Image();
  img.src = 'assets/posters/default-poster.png';
  img.onload = () => {
    state.templateImage = img;
    state.isUsingCustomTemplate = true;
    state.renderOrder = 'photo-above'; // Draw circular-clipped photo on top of the template
    requestRender();
  };
  img.onerror = () => {
    console.warn('Custom default-poster.png template not found. Drawing programmatic fallback...');
    state.isUsingCustomTemplate = false;
    state.renderOrder = 'photo-below';
    const offscreen = document.createElement('canvas');
    offscreen.width = POSTER_DIMENSIONS.canvasWidth;
    offscreen.height = POSTER_DIMENSIONS.canvasHeight;
    const oCtx = offscreen.getContext('2d');

    // 1. Soft blush light gradient on the canvas
    const cW = POSTER_DIMENSIONS.canvasWidth;
    const cH = POSTER_DIMENSIONS.canvasHeight;
    const grad = oCtx.createLinearGradient(0, 0, cW, cH);
    grad.addColorStop(0, '#fffcfd');
    grad.addColorStop(0.5, '#fdf6fb');
    grad.addColorStop(1, '#f5ebff');
    oCtx.fillStyle = grad;
    oCtx.fillRect(0, 0, cW, cH);

    // Soft design circles
    oCtx.fillStyle = 'rgba(236, 72, 153, 0.03)';
    oCtx.beginPath();
    oCtx.arc(cW, 0, 450, 0, Math.PI * 2);
    oCtx.fill();

    oCtx.fillStyle = 'rgba(124, 58, 237, 0.03)';
    oCtx.beginPath();
    oCtx.arc(0, cH, 500, 0, Math.PI * 2);
    oCtx.fill();

    // Subtle clean grid pattern
    oCtx.strokeStyle = 'rgba(124, 58, 237, 0.03)';
    oCtx.lineWidth = 1;
    const gridSize = 45;
    for (let x = 0; x < cW; x += gridSize) {
      oCtx.beginPath(); oCtx.moveTo(x, 0); oCtx.lineTo(x, cH); oCtx.stroke();
    }
    for (let y = 0; y < cH; y += gridSize) {
      oCtx.beginPath(); oCtx.moveTo(0, y); oCtx.lineTo(cW, y); oCtx.stroke();
    }

    // 2. Inner border
    oCtx.strokeStyle = 'rgba(236, 72, 153, 0.15)';
    oCtx.lineWidth = 4;
    oCtx.strokeRect(40, 40, cW - 80, cH - 80);

    // 3. Profile Image Area (centered, top-heavy)
    const px = state.photoX, py = state.photoY, pw = state.photoW, ph = state.photoH;
    oCtx.fillStyle = '#f8fafc';
    oCtx.fillRect(px, py, pw, ph);

    // Profile border shadow glow
    oCtx.strokeStyle = 'rgba(236, 72, 153, 0.15)';
    oCtx.lineWidth = 10;
    oCtx.strokeRect(px - 5, py - 5, pw + 10, ph + 10);

    // Profile border
    oCtx.strokeStyle = '#7c3aed';
    oCtx.lineWidth = 4;
    oCtx.strokeRect(px, py, pw, ph);

    // 4. Horizontal Separator line (Separating image from text area)
    oCtx.strokeStyle = 'rgba(236, 72, 153, 0.25)';
    oCtx.lineWidth = 2;
    oCtx.beginPath();
    oCtx.moveTo(280, 635);
    oCtx.lineTo(800, 635);
    oCtx.stroke();

    // 5. Header / Branding Detail (Top Center)
    oCtx.fillStyle = '#0b1329';
    oCtx.font = 'bold 46px "Outfit", sans-serif';
    oCtx.textAlign = 'center';
    oCtx.letterSpacing = '14px';
    oCtx.fillText('STUDLYF', 540, 120);

    // Bottom tags (Ecosystem passport highlights)
    oCtx.fillStyle = '#ec4899';
    oCtx.font = 'bold 20px "Outfit", sans-serif';
    oCtx.letterSpacing = '4px';
    oCtx.fillText('OFFICIAL MEMBER', 540, 940);

    oCtx.fillStyle = '#64748b';
    oCtx.font = 'normal 15px "Outfit", sans-serif';
    oCtx.letterSpacing = '2px';
    oCtx.fillText('STUDENT ECOSYSTEM', 540, 985);

    const fallbackImg = new Image();
    fallbackImg.src = offscreen.toDataURL();
    fallbackImg.onload = () => {
      state.templateImage = fallbackImg;
      requestRender();
    };
  };
}

// Default Portrait Placeholder
let defaultPortraitImg = null;
function generateDefaultPortrait() {
  const pCanvas = document.createElement('canvas');
  pCanvas.width = 400;
  pCanvas.height = 400;
  const pCtx = pCanvas.getContext('2d');

  const grad = pCtx.createRadialGradient(200, 200, 50, 200, 200, 250);
  grad.addColorStop(0, '#fbcfe8');
  grad.addColorStop(1, '#e8d5f5');
  pCtx.fillStyle = grad;
  pCtx.fillRect(0, 0, 400, 400);

  pCtx.strokeStyle = 'rgba(124, 58, 237, 0.2)';
  pCtx.lineWidth = 8;
  pCtx.beginPath();
  pCtx.arc(200, 160, 60, 0, Math.PI * 2);
  pCtx.stroke();

  pCtx.beginPath();
  pCtx.arc(200, 380, 130, Math.PI, 0);
  pCtx.stroke();

  pCtx.fillStyle = '#7c3aed';
  pCtx.font = 'bold 18px "Outfit", sans-serif';
  pCtx.textAlign = 'center';
  pCtx.letterSpacing = '1px';
  pCtx.fillText('UPLOAD PORTRAIT', 200, 260);

  const img = new Image();
  img.src = pCanvas.toDataURL();
  img.onload = () => {
    defaultPortraitImg = img;
    state.studentImage = img;
    requestRender();
  };
}

// Rendering pipeline loop
let renderRequested = false;
function requestRender() {
  if (!renderRequested) {
    renderRequested = true;
    requestAnimationFrame(renderCanvasFrame);
  }
}

function renderCanvasFrame() {
  renderRequested = false;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Active configuration based on template selection
  const cfg = state.isUsingCustomTemplate ? POSTER_DIMENSIONS.custom : POSTER_DIMENSIONS.fallback;

  function drawStudentPhoto() {
    if (!state.studentImage) return;

    ctx.save();

    // Draw circular clip
    const cx = cfg.portrait.cx;
    const cy = cfg.portrait.cy;
    const r = cfg.portrait.r;

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();

    const iw = state.studentImage.width;
    const ih = state.studentImage.height;
    const scale = Math.max((r * 2) / iw, (r * 2) / ih);
    const drawW = iw * scale;
    const drawH = ih * scale;

    ctx.drawImage(state.studentImage, cx - drawW / 2, cy - drawH / 2, drawW, drawH);
    ctx.restore();
  }

  function drawTemplate() {
    if (state.templateImage) {
      ctx.drawImage(state.templateImage, 0, 0, canvas.width, canvas.height);
    }
  }

  // Dual rendering order pipeline
  if (state.renderOrder === 'photo-below') {
    drawStudentPhoto();
    drawTemplate();
  } else {
    drawTemplate();
    drawStudentPhoto();
  }

  // Draw STUDENT NAME dynamically
  if (state.studentName) {
    ctx.save();

    if (state.isUsingCustomTemplate) {
      // Removed extra rectangular box masking at user request

      // Render new name centered inside the top half of the pink gradient panel
      ctx.fillStyle = cfg.name.color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      let currentFontSize = cfg.name.fontSize;
      ctx.font = `bold ${currentFontSize}px "Outfit", sans-serif`;

      const textVal = state.studentName;
      const maxTextWidth = cfg.name.maxWidth;
      let textMetrics = ctx.measureText(textVal);

      while (textMetrics.width > maxTextWidth && currentFontSize > 12) {
        currentFontSize -= 1;
        ctx.font = `bold ${currentFontSize}px "Outfit", sans-serif`;
        textMetrics = ctx.measureText(textVal);
      }

      ctx.fillText(textVal, cfg.name.x, cfg.name.y);
    } else {
      // Programmatic Center-aligned Name
      ctx.fillStyle = cfg.name.color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      let currentFontSize = cfg.name.fontSize;
      ctx.font = `bold ${currentFontSize}px "Outfit", sans-serif`;

      const textVal = state.studentName;
      const maxTextWidth = cfg.name.maxWidth;
      let textMetrics = ctx.measureText(textVal);

      while (textMetrics.width > maxTextWidth && currentFontSize > 18) {
        currentFontSize -= 2;
        ctx.font = `bold ${currentFontSize}px "Outfit", sans-serif`;
        textMetrics = ctx.measureText(textVal);
      }

      ctx.fillText(textVal, cfg.name.x, cfg.name.y);
    }
    ctx.restore();
  }

  // College name rendering removed per user request
}

// Dynamic state binders & listeners
function updateStateFromInputs() {
  state.studentName = elements.studentName.value;
  if (elements.studentCollege) state.studentCollege = elements.studentCollege.value;
  requestRender();
}

// Register input event listeners
const inputListeners = [elements.studentName, elements.studentCollege];

inputListeners.forEach(input => {
  if (input) {
    input.addEventListener('input', updateStateFromInputs);
    input.addEventListener('change', updateStateFromInputs);
  }
});

// Drag and Drop Files Processing
function handlePortraitImage(file) {
  if (!file || !file.type.startsWith('image/')) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      state.studentImage = img;
      elements.thumbnailPreview.src = e.target.result;
      elements.thumbnailPreview.classList.add('active');
      elements.uploadSuccess.classList.add('visible');
      updateStateFromInputs();
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// Dropzone click listeners
elements.portraitDropzone.addEventListener('click', () => elements.portraitFile.click());

elements.portraitFile.addEventListener('change', (e) => {
  if (e.target.files.length > 0) {
    handlePortraitImage(e.target.files[0]);
  }
});

// Dragover styles
['dragenter', 'dragover'].forEach(eventName => {
  elements.portraitDropzone.addEventListener(eventName, (e) => {
    e.preventDefault();
    elements.portraitDropzone.classList.add('dragover');
  }, false);
});

['dragleave', 'drop'].forEach(eventName => {
  elements.portraitDropzone.addEventListener(eventName, (e) => {
    e.preventDefault();
    elements.portraitDropzone.classList.remove('dragover');
  }, false);
});

elements.portraitDropzone.addEventListener('drop', (e) => {
  const dt = e.dataTransfer;
  const files = dt.files;
  if (files.length > 0) {
    handlePortraitImage(files[0]);
  }
});

// Export canvas image as PNG
if (elements.downloadBtn) {
  elements.downloadBtn.addEventListener('click', (e) => {
    e.preventDefault();
    try {
      // 1. Force a final synchronous render to ensure the canvas has all latest elements
      renderCanvasFrame();

      const cleanName = (state.studentName || 'member').replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const filename = `STUDLYF_Identity_${cleanName}.png`;

      // 2. Export using canvas.toBlob (preferred for performance and reliability)
      if (canvas.toBlob) {
        canvas.toBlob((blob) => {
          if (!blob) {
            console.error('Canvas toBlob failed.');
            return;
          }
          const blobUrl = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.download = filename;
          link.href = blobUrl;
          document.body.appendChild(link);
          link.click();

          setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
          }, 100);
        }, 'image/png', 1.0);
      } else {
        // Fallback for older browsers
        const dataUrl = canvas.toDataURL('image/png', 1.0);
        const link = document.createElement('a');
        link.download = filename;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        setTimeout(() => document.body.removeChild(link), 100);
      }
    } catch (err) {
      console.error("Export failed:", err);
      alert("Export failed due to browser security settings (CORS). If you are running this from a local file (file:///), browser security may block canvas exports. Please run the project using a local web server (e.g. VS Code Live Server).");
    }
  });
}

// Copy LinkedIn Post to Clipboard
const copyLinkedinBtn = document.getElementById('copyLinkedinBtn');
const linkedinPostContent = document.getElementById('linkedinPostContent');

if (copyLinkedinBtn && linkedinPostContent) {
  copyLinkedinBtn.addEventListener('click', async () => {
    try {
      const textToCopy = linkedinPostContent.innerText || linkedinPostContent.textContent;
      await navigator.clipboard.writeText(textToCopy.trim());

      const originalText = copyLinkedinBtn.innerText;
      copyLinkedinBtn.innerText = 'Copied! ✓';
      copyLinkedinBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)'; // Success green gradient

      setTimeout(() => {
        copyLinkedinBtn.innerText = originalText;
        copyLinkedinBtn.style.background = ''; // Revert to original styling
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      // Fallback for older browsers
      try {
        const textarea = document.createElement('textarea');
        textarea.value = linkedinPostContent.innerText.trim();
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);

        const originalText = copyLinkedinBtn.innerText;
        copyLinkedinBtn.innerText = 'Copied! ✓';
        copyLinkedinBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        setTimeout(() => {
          copyLinkedinBtn.innerText = originalText;
          copyLinkedinBtn.style.background = '';
        }, 2000);
      } catch (fallbackErr) {
        alert('Failed to copy to clipboard.');
      }
    }
  });
}

// Initial boot load
window.addEventListener('DOMContentLoaded', () => {
  generateDefaultTemplate();
  generateDefaultPortrait();
  updateStateFromInputs();
});
