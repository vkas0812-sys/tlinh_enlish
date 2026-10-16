const THEMES = {
  primary: { top: '#93C5FD', mid: '#60A5FA', base: '#F87171', desc: '#CBD5E1', trace: '#1E293B' },
  vietnam_notebook: { top: '#BAE6FD', mid: '#7DD3FC', base: '#2563EB', desc: '#E0F2FE', trace: '#1E3A8A' },
  slate: { top: '#CBD5E1', mid: '#94A3B8', base: '#1E293B', desc: '#E2E8F0', trace: '#1E293B' },
  candy: { top: '#FBCFE8', mid: '#F472B6', base: '#BE185D', desc: '#FCE7F3', trace: '#831843' }
};

const state = {
  mode: 'workbook',
  selectedPage: '1',
  font: 'PrintDashed',
  fontSize: 38,
  ruling: '4line',
  theme: 'primary',
  showArrows: true,
  showCharacters: true,
  showGarden: true,
  customText: 'The quick brown fox jumps over the lazy dog.\nBright yellow sun shines high in the blue sky.\nI love reading English storybooks every day.\nShe sells sweet apples and fresh oranges.\nThank you very much, teacher! Have a great day.'
};

// Render a single HW line SVG
function renderHwSvg(text, isTrace = true, isEmpty = false) {
  const th = THEMES[state.theme] || THEMES.primary;
  const is4Line = state.ruling === '4line';

  let linesMarkup = '';
  let textMarkup = '';

  if (is4Line) {
    // Primary 4-line
    linesMarkup = `
      <line x1="0" y1="5" x2="440" y2="5" stroke="${th.top}" stroke-width="1.2" />
      <line x1="0" y1="15" x2="440" y2="15" stroke="${th.mid}" stroke-width="1.2" stroke-dasharray="4,4" />
      <line x1="0" y1="26" x2="440" y2="26" stroke="${th.base}" stroke-width="1.8" />
      <line x1="0" y1="33" x2="440" y2="33" stroke="${th.desc}" stroke-width="1.0" stroke-dasharray="3,3" />
    `;
  } else {
    // User's custom 2-line: mid at 13, base at 26
    linesMarkup = `
      <line x1="0" y1="13" x2="440" y2="13" stroke="${isEmpty ? '#CBD5E1' : '#94A3B8'}" stroke-width="1.2" stroke-dasharray="4,4" />
      <line x1="0" y1="26" x2="440" y2="26" stroke="${th.base}" stroke-width="1.8" />
    `;
  }

  if (text && !isEmpty) {
    const fill = isTrace ? th.trace : '#0F172A';
    textMarkup = `<text x="12" y="26" class="font-trace" style="font-family: '${state.font}', sans-serif; font-size: ${state.fontSize}px; fill: ${fill};">${text}</text>`;
  }

  return `
    <div class="hw-line">
      <svg viewBox="0 0 440 36" preserveAspectRatio="none">
        ${linesMarkup}
        ${textMarkup}
      </svg>
    </div>
  `;
}

// Render 1 Ms Linh Worksheet Page
function renderWorkbookSheet(pdata) {
  const items = pdata.items;

  let rowsHtml = '';
  let unscrambleHtml = '';
  let missingHtml = '';

  items.forEach(item => {
    const iconSvg = ICONS_MAP[item.icon] || '';
    const wordLabel = state.showArrows ? item.arrows : item.word;

    rowsHtml += `
      <div class="trace-row">
        <div class="row-left">
          <div class="animal-avatar">${iconSvg}</div>
          <span class="arrow">→</span>
          <div class="model-word">${wordLabel}</div>
        </div>
        <div class="row-lines">
          ${renderHwSvg(item.word, true, false)}
          ${renderHwSvg('', false, true)}
        </div>
      </div>
    `;

    unscrambleHtml += `
      <div class="ex-item">
        <div class="ex-avatar">${iconSvg}</div>
        <span class="scramble-word">${item.scramble}</span>
        <div class="solid-write-line"></div>
      </div>
    `;

    missingHtml += `
      <div class="ex-item">
        <div class="ex-avatar">${iconSvg}</div>
        <div class="missing-container">
          <span class="missing-letters">${item.missing}</span>
          <div class="missing-base-line"></div>
        </div>
      </div>
    `;
  });

  // Decorative characters
  const boyHtml = state.showCharacters ? `<div class="char-boy">${DECOR_SVGS.boy}</div>` : '';
  const girlHtml = state.showCharacters ? `<div class="char-girl">${DECOR_SVGS.girl}</div>` : '';
  const gardenHtml = state.showGarden ? `<div class="bottom-garden-container">${DECOR_SVGS.garden}</div>` : '';

  return `
    <div class="page-sheet" data-page-id="${pdata.id}">
      <div class="corner-cluster corner-tl">${DECOR_SVGS.corner}</div>
      <div class="corner-cluster corner-tr">${DECOR_SVGS.corner}</div>

      <div class="cloud cloud-1"></div>
      <div class="cloud cloud-2"></div>
      <div class="star star-1">✦</div>
      <div class="star star-2">✦</div>
      <div class="star star-3">✦</div>
      <div class="star star-4">✦</div>

      ${boyHtml}
      ${girlHtml}

      <div class="top-badge-container">
        <div class="top-pill">
          <span class="star-icon">★</span>
          <span>${pdata.badge}</span>
          <span class="star-icon">★</span>
        </div>
      </div>

      <div class="brand-header">
        <span class="brand-name">MS LINH ENGLISH</span>
        <span class="brand-sub">Global Success</span>
      </div>

      <div class="sec-vocab-container">
        <div class="vocab-pill">I. VOCABULARY • ${pdata.unit_title}</div>
        <div class="vocab-card">
          <div class="vocab-title-bar">
            <span class="ex-num-title">1. Trace and Write</span>
            <div class="solid-title-line"></div>
          </div>
          <div class="vocab-rows-list">
            ${rowsHtml}
          </div>
        </div>
      </div>

      <div class="bottom-exercises">
        <div class="ex-col">
          <div class="ex-col-title">2. Unscramble the Words</div>
          <div class="ex-list">${unscrambleHtml}</div>
        </div>
        <div class="ex-col">
          <div class="ex-col-title">3. Find the Missing Letter</div>
          <div class="ex-list">${missingHtml}</div>
        </div>
      </div>

      <div class="footer-section">
        <div class="footer-great-job">
          <svg width="42" height="24" viewBox="0 0 100 60" style="vertical-align:middle; margin-right:4px;">
            <path d="M20,45 Q10,45 15,30 Q20,15 35,20 Q45,5 65,15 Q80,10 85,25 Q95,30 90,45 Z" fill="#BAE6FD" stroke="#38BDF8" stroke-width="2.5"/>
          </svg>
          <span class="job-text">Great Job!</span>
          <span class="job-star">⭐</span>
        </div>
        ${gardenHtml}
      </div>
    </div>
  `;
}

// Render InkFlow Sentences Page
function renderSentencesSheet() {
  const lines = state.customText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  let cardsHtml = '';

  lines.forEach((lineText, idx) => {
    cardsHtml += `
      <div class="sentence-card">
        <div class="card-tag">
          <span class="circle"></span>
          <span>Sentence ${idx + 1} — Trace &amp; Write</span>
        </div>
        ${renderHwSvg(lineText, true, false)}
        ${renderHwSvg('', false, true)}
      </div>
    `;
  });

  return `
    <div class="page-sheet">
      <div class="corner-cluster corner-tl">${DECOR_SVGS.corner}</div>
      <div class="corner-cluster corner-tr">${DECOR_SVGS.corner}</div>

      <div class="top-badge-container">
        <div class="top-pill">★ MS LINH PRIMARY HANDWRITING ★</div>
      </div>

      <div class="brand-header">
        <span class="brand-name">Daily Handwriting Sentences</span>
      </div>

      <div style="flex: 1; display: flex; flex-direction: column; gap: 8px; margin-top: 4px;">
        ${cardsHtml}
      </div>

      <div class="footer-section">
        <div class="footer-great-job">
          <span class="job-text">Keep Up The Great Work! ⭐</span>
        </div>
        ${state.showGarden ? `<div class="bottom-garden-container">${DECOR_SVGS.garden}</div>` : ''}
      </div>
    </div>
  `;
}

// Render Alphabet Sheet
function renderAlphabetSheet() {
  const alphaPairs = [
    ["Aa", "Apple"], ["Bb", "Ball"], ["Cc", "Cat"], ["Dd", "Duck"],
    ["Ee", "Elephant"], ["Ff", "Fish"], ["Gg", "Goat"], ["Hh", "Horse"],
    ["Ii", "Iguana"], ["Jj", "Jellyfish"], ["Kk", "Kite"], ["Ll", "Lion"]
  ];

  let gridHtml = '';
  alphaPairs.forEach(([pair, word]) => {
    gridHtml += `
      <div class="alpha-item">
        <div class="alpha-top">
          <span class="alpha-letter">${pair}</span>
          <span class="alpha-sample">Word: <b>${word}</b></span>
        </div>
        ${renderHwSvg(pair + ' ' + word, true, false)}
        ${renderHwSvg('', false, true)}
      </div>
    `;
  });

  return `
    <div class="page-sheet">
      <div class="corner-cluster corner-tl">${DECOR_SVGS.corner}</div>
      <div class="corner-cluster corner-tr">${DECOR_SVGS.corner}</div>

      <div class="top-badge-container">
        <div class="top-pill">★ ALPHABET MASTERY • A - L ★</div>
      </div>

      <div class="brand-header">
        <span class="brand-name">Alphabet Handwriting Practice</span>
      </div>

      <div class="alpha-grid" style="flex: 1; margin-top: 6px;">
        ${gridHtml}
      </div>

      <div class="footer-section">
        <div class="footer-great-job">
          <span class="job-text">Super Handwriting! ⭐</span>
        </div>
        ${state.showGarden ? `<div class="bottom-garden-container">${DECOR_SVGS.garden}</div>` : ''}
      </div>
    </div>
  `;
}

// Render Workspace
function render() {
  const panel = document.getElementById('preview-panel');
  panel.innerHTML = '';

  if (state.mode === 'workbook') {
    if (state.selectedPage === 'all') {
      WORKSHEETS_DATA.forEach(p => {
        panel.innerHTML += renderWorkbookSheet(p);
      });
    } else {
      const pId = parseInt(state.selectedPage);
      const target = WORKSHEETS_DATA.find(p => p.id === pId) || WORKSHEETS_DATA[0];
      panel.innerHTML = renderWorkbookSheet(target);
    }
  } else if (state.mode === 'sentences' || state.mode === 'custom') {
    panel.innerHTML = renderSentencesSheet();
  } else if (state.mode === 'alphabet') {
    panel.innerHTML = renderAlphabetSheet();
  }
}

// Event Listeners
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.mode = btn.getAttribute('data-mode');

    document.getElementById('sec-workbook-pages').style.display = (state.mode === 'workbook') ? 'flex' : 'none';
    document.getElementById('sec-custom-input').style.display = (state.mode === 'sentences' || state.mode === 'custom') ? 'flex' : 'none';

    render();
  });
});

document.getElementById('select-workbook-page').addEventListener('change', (e) => {
  state.selectedPage = e.target.value;
  render();
});

document.getElementById('select-font').addEventListener('change', (e) => {
  state.font = e.target.value;
  render();
});

document.getElementById('slider-font-size').addEventListener('input', (e) => {
  state.fontSize = parseInt(e.target.value);
  document.getElementById('val-font-size').textContent = state.fontSize + ' px';
  render();
});

document.getElementById('select-ruling').addEventListener('change', (e) => {
  state.ruling = e.target.value;
  render();
});

document.getElementById('select-theme').addEventListener('change', (e) => {
  state.theme = e.target.value;
  render();
});

document.getElementById('check-arrows').addEventListener('change', (e) => {
  state.showArrows = e.target.checked;
  render();
});

document.getElementById('check-characters').addEventListener('change', (e) => {
  state.showCharacters = e.target.checked;
  render();
});

document.getElementById('check-garden').addEventListener('change', (e) => {
  state.showGarden = e.target.checked;
  render();
});

document.getElementById('text-input').addEventListener('input', (e) => {
  state.customText = e.target.value;
  render();
});

document.getElementById('btn-print').addEventListener('click', () => {
  window.print();
});

// Initialize
document.getElementById('text-input').value = state.customText;
render();
