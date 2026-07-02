// =============================================
//  KHANA KHAJANA — Utilities
// =============================================

function showToast(msg) {
  document.querySelectorAll('.toast').forEach(t => t.remove());
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => {
    t.style.transition = 'opacity 0.3s';
    t.style.opacity = '0';
    setTimeout(() => t.remove(), 300);
  }, 2200);
}

function setAlert(msg, type = 'error') {
  state.alert = { msg, type };
  render();
}

function clearAlert() { state.alert = null; }

function showLoading(msg = 'Please wait...') {
  document.getElementById('app').innerHTML = `
    ${buildHeader()}
    <div class="main" style="display:flex;align-items:center;justify-content:center;min-height:50vh">
      <div style="text-align:center">
        <div class="spinner" style="width:28px;height:28px;border-width:3px;border-color:rgba(232,114,12,0.3);border-top-color:var(--saffron);margin:0 auto 14px"></div>
        <div style="color:var(--text-muted);font-size:14px;font-weight:600">${msg}</div>
      </div>
    </div>
  `;
}

function render() {
  document.getElementById('app').innerHTML = buildApp();
}

function buildApp() {
  return `
    ${buildHeader()}
    <div class="main">
      ${state.alert ? `<div class="alert alert-${state.alert.type}">${state.alert.msg}</div>` : ''}
      ${buildPage()}
    </div>
  `;
}

function buildHeader() {
  if (state.currentKitchen) {
    return `
      <div class="pattern-header">
        <div class="brand" style="padding-bottom:8px">
          <div class="brand-title">🍽️ Khana Khajana</div>
          <div class="brand-sub">Kitchen Inventory Manager</div>
        </div>
        <div class="header-bar">
          <div class="header-kitchen-name">
            ${state.currentKitchen.name} &nbsp;•&nbsp; ${state.currentUser?.username}
          </div>
          <button class="header-logout-btn" onclick="logout()">Logout</button>
        </div>
      </div>
    `;
  }
  return `
    <div class="pattern-header">
      <div class="brand">
        <div class="brand-title">🍽️ Khana Khajana</div>
        <div class="brand-sub">Kitchen Inventory Manager</div>
      </div>
    </div>
  `;
}

function buildPage() {
  switch (state.page) {
    case 'loading':       return buildLoadingPage();
    case 'landing':       return buildLanding();
    case 'auth':          return buildAuth();
    case 'charPicker':    return buildCharPicker();
    case 'kitchenChoice': return buildKitchenChoice();
    case 'kitchenAuth':   return buildKitchenAuth();
    case 'kitchenCreate': return buildKitchenCreate();
    case 'kitchen':       return buildKitchenPage();
    default: return '';
  }
}

function buildLoadingPage() {
  return `
    <div style="display:flex;align-items:center;justify-content:center;min-height:60vh">
      <div style="text-align:center">
        <div style="font-size:52px;margin-bottom:16px">🍽️</div>
        <div class="spinner" style="width:28px;height:28px;border-width:3px;border-color:rgba(232,114,12,0.3);border-top-color:var(--saffron);margin:0 auto 14px"></div>
        <div style="color:var(--text-muted);font-size:14px;font-weight:600">Connecting to cloud...</div>
      </div>
    </div>
  `;
}

function nav(page)   { clearAlert(); state.page = page; render(); }
function setTab(tab) { clearAlert(); state.kitchenTab = tab; render(); }
function gotoAuth(mode) { clearAlert(); state.authMode = mode; state.page = 'auth'; render(); }
function selectChar(c) { state._tempChar = c; render(); }

function ptsClass(pts) {
  if (pts >= 75) return 'pts-high';
  if (pts >= 40) return 'pts-mid';
  return 'pts-low';
}

function fmtDate(ts) {
  return new Date(ts).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  });
}

// Wraps async actions — shows spinner, catches errors
async function run(fn) {
  try {
    state.loading = true;
    await fn();
  } catch (e) {
    console.error(e);
    setAlert('Something went wrong. Please check your internet connection and try again.');
  } finally {
    state.loading = false;
  }
}
