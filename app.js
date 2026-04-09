/**
 * app.js — JavaScript 互動邏輯
 * 管理：游標動畫、選單開關、內頁切換、目錄高亮、滾動進度
 * 修改這個檔案來調整互動行為
 */

/* ==========================================
   游標（僅桌機 pointer:fine）
   ========================================== */
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursor-ring');

if (cursor && ring) {
  let mx = 0, my = 0;   // 滑鼠位置
  let rx = 0, ry = 0;   // 光圈位置（有延遲跟隨）

  // 更新滑鼠位置
  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  // 光圈緩慢跟隨（0.12 = 跟隨速度，數字越小越慢）
  (function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateRing);
  })();

  // 滑鼠移到可互動元素時游標放大
  document.querySelectorAll('a, button, .sk, .wk, .stat, .deco-box').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('expand');
      ring.classList.add('expand');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('expand');
      ring.classList.remove('expand');
    });
  });
}

/* ==========================================
   漢堡選單
   ========================================== */
let menuOpen = false;

function toggleMenu() {
  menuOpen = !menuOpen;
  document.getElementById('menu-btn').classList.toggle('open', menuOpen);
  document.getElementById('drawer').classList.toggle('open', menuOpen);
}

// 點選抽屜以外的地方關閉
document.addEventListener('click', e => {
  const drawer = document.getElementById('drawer');
  const btn    = document.getElementById('menu-btn');
  if (menuOpen && !drawer.contains(e.target) && !btn.contains(e.target)) {
    toggleMenu();
  }
});

/* ==========================================
   內頁（長形卷軸）
   ========================================== */
let innerOpen = false;

/**
 * 開啟內頁並跳到指定章節
 * @param {string} sec - 章節 ID：about / skills / works / contact
 */
function openInner(sec) {
  innerOpen = true;
  document.getElementById('inner-page').classList.add('open');
  if (menuOpen) toggleMenu();  // 關閉選單
  setTimeout(() => scrollToSec(sec), 80);
}

// 關閉內頁
function closeInner() {
  innerOpen = false;
  document.getElementById('inner-page').classList.remove('open');
}

/* ==========================================
   章節滾動與目錄高亮
   ========================================== */
const SECTIONS = ['about', 'skills', 'works', 'contact'];

/**
 * 滾動到指定章節
 * @param {string} id - 章節 ID
 */
function scrollToSec(id) {
  const el      = document.getElementById('sec-' + id);
  const content = document.getElementById('inner-content');
  if (el && content) {
    // 80px 偏移讓章節標題不被關閉按鈕蓋住
    content.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
  }
  updateToc(id);
}

/**
 * 更新目錄高亮
 * @param {string} activeId - 目前章節 ID
 */
function updateToc(activeId) {
  document.querySelectorAll('.toc-item').forEach(a => {
    // 從 onclick 屬性抓取章節 ID
    const match = a.getAttribute('onclick')?.match(/'([^']+)'/);
    const id = match ? match[1] : null;
    a.classList.toggle('active', id === activeId);
  });
}

// 滾動時自動偵測目前章節 + 更新進度條
const innerContent = document.getElementById('inner-content');
if (innerContent) {
  innerContent.addEventListener('scroll', () => {
    // 進度條
    const max = innerContent.scrollHeight - innerContent.clientHeight;
    document.getElementById('progress').style.width =
      (innerContent.scrollTop / max * 100) + '%';

    // 目錄高亮
    let current = 'about';
    SECTIONS.forEach(id => {
      const el = document.getElementById('sec-' + id);
      if (el && innerContent.scrollTop >= el.offsetTop - 200) {
        current = id;
      }
    });
    updateToc(current);
  });
}

/* ==========================================
   鍵盤快捷鍵
   ========================================== */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (innerOpen)   closeInner();
    else if (menuOpen) toggleMenu();
  }
});
