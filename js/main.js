// ===== 抽屜導航：點選項自動關閉 =====
const navItems = document.querySelectorAll('.navigation__item');
const navCheckbox = document.querySelector('.navigation__checkbox');
function closeNav() { if (navCheckbox) navCheckbox.checked = false; }
navItems.forEach(item => item.addEventListener('click', closeNav));

// ===== 語系切換（不裝套件） =====
// 初始化：讀 localStorage，預設 zh
(function initLang() {
  const saved = localStorage.getItem('lang') || 'zh';
  document.documentElement.setAttribute('data-lang', saved);
})();
document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-set-lang]');
  if (!btn) return;
  const lang = btn.dataset.setLang;
  document.documentElement.setAttribute('data-lang', lang);
  localStorage.setItem('lang', lang);
});

// ===== Modal Tabs：防止更換 hash 造成 :target 失效 =====
document.addEventListener('click', (e) => {
  const tab = e.target.closest('.modal__tab');
  if (!tab) return;

  // 阻止 <a href="#tab-xxx"> 改變 URL hash
  e.preventDefault();

  const modal = tab.closest('.modal'); // 只影響當前這個 modal
  const targetId = tab.dataset.target;

  // 切換 tab 樣式
  modal.querySelectorAll('.modal__tab').forEach(t => t.classList.remove('is-active'));
  tab.classList.add('is-active');

  // 切換 panel 顯示
  modal.querySelectorAll('.modal__panel').forEach(p => p.classList.remove('is-active'));
  const targetPanel = modal.querySelector('#' + targetId);
  if (targetPanel) targetPanel.classList.add('is-active');
});

// ===== Modal：按 ESC 關閉（跳回 #mywork 清掉 :target） =====
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const open = document.querySelector('.modal:target');
    if (open) window.location.hash = '#mywork';
  }
});

// ===== Load modals from external partial =====
document.documentElement.setAttribute('data-modals', 'loading');

async function loadModals() {
  try {
    const root = document.getElementById('modals-root');
    if (!root) return;
    const res = await fetch('partials/modals.html', { cache: 'no-cache' });
    if (!res.ok) throw new Error('Failed to fetch modals.html');
    const html = await res.text();
    root.innerHTML = html;

    // 若網址本來就帶著 #proj-xxx，載入後重觸發 :target
    if (location.hash && root.querySelector(location.hash)) {
      const h = location.hash;
      location.hash = '';          // 清一下
      location.hash = h;           // 再設定讓 :target 生效
    }
  } catch (e) {
    console.error(e);
  } finally {
    document.documentElement.setAttribute('data-modals', 'ready');
  }
}

document.addEventListener('DOMContentLoaded', loadModals);

// 語系按鈕：<button class="navigation__lang-btn" data-set-lang="en">EN</button>
const langBtns = document.querySelectorAll('.navigation__lang-btn');
const root = document.documentElement;

langBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const lang = btn.dataset.setLang;
    if (!lang || root.getAttribute('data-lang') === lang) return;

    // 加一個短暫狀態 class（可用來做全頁過渡或延長動畫）
    root.classList.add('lang-switching');
    root.setAttribute('data-lang', lang);

    // 依 CSS 變數時間清掉狀態（和 --i18n-dur 對齊即可）
    setTimeout(() => root.classList.remove('lang-switching'), 260);
  });
});