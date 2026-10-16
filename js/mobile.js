// Mobile helpers: collapsible controls and fit-to-width A4 preview.
(function () {
  const mq = window.matchMedia('screen and (max-width: 820px)');
  const panel = document.querySelector('aside.controls-panel');
  const preview = document.getElementById('preview-panel');
  const printBtn = document.getElementById('btn-print');
  const fullPrintLabel = printBtn.innerHTML;

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'mobile-toggle';
  toggle.innerHTML = '<span>⚙️ Tùy chỉnh trang vở</span><span class="chev">▼</span>';
  toggle.addEventListener('click', () => document.body.classList.toggle('controls-open'));
  panel.parentNode.insertBefore(toggle, panel);

  const A4_PX = 210 * 96 / 25.4; // 210mm in CSS pixels
  function fit() {
    if (mq.matches) {
      const avail = window.innerWidth - 16;
      preview.style.setProperty('--fit', Math.min(1, avail / A4_PX).toFixed(4));
      printBtn.innerHTML = '🖨️ In / PDF';
    } else {
      preview.style.removeProperty('--fit');
      printBtn.innerHTML = fullPrintLabel;
    }
  }
  window.addEventListener('resize', fit);
  window.addEventListener('beforeprint', () => preview.style.setProperty('--fit', '1'));
  window.addEventListener('afterprint', fit);
  fit();
})();
