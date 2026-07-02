// =============================================
//  KHANA KHAJANA — Page Builders
// =============================================

function buildLanding() {
  return `
    <div class="card">
      <div class="card-title">Welcome! 🙏</div>
      <div class="card-sub">
        Your smart kitchen companion for managing meals and daily
        food polls with your family or team — synced across all devices.
      </div>
      <div class="choice-grid">
        <div class="choice-tile" onclick="gotoAuth('register')">
          <div class="tile-icon">✨</div>
          <div class="tile-label">New User</div>
          <div class="tile-desc">Create your account</div>
        </div>
        <div class="choice-tile" onclick="gotoAuth('login')">
          <div class="tile-icon">🔑</div>
          <div class="tile-label">Login</div>
          <div class="tile-desc">Already registered</div>
        </div>
      </div>
    </div>
    <div style="text-align:center;font-size:12px;color:var(--text-muted);padding-bottom:16px">
      ☁️ Data is synced to the cloud — accessible from any device
    </div>
  `;
}

function buildAuth() {
  const isReg = state.authMode === 'register';
  return `
    <button class="back-btn" onclick="nav('landing')">← Back</button>
    <div class="card">
      <div class="card-title">${isReg ? 'Create Account' : 'Welcome Back'}</div>
      <div class="card-sub">
        ${isReg
          ? 'Join Khana Khajana and start managing your kitchen.'
          : 'Sign in to continue to your kitchen.'}
      </div>
      <div class="field">
        <label>Username</label>
        <input id="un" type="text" placeholder="e.g. ananya_cook"
          autocomplete="off" onkeydown="if(event.key==='Enter') submitAuth()">
      </div>
      <div class="field">
        <label>Password</label>
        <input id="pw" type="password" placeholder="Secure password"
          onkeydown="if(event.key==='Enter') submitAuth()">
      </div>
      ${isReg ? `
        <div class="field">
          <label>Confirm Password</label>
          <input id="pw2" type="password" placeholder="Repeat password"
            onkeydown="if(event.key==='Enter') submitAuth()">
        </div>` : ''}
      <button class="btn btn-primary" onclick="submitAuth()"
        ${state.loading ? 'disabled' : ''}>
        ${state.loading ? '<span class="spinner"></span>' : ''}
        ${isReg ? 'Create Account' : 'Login'}
      </button>
      <div class="divider"><span>OR</span></div>
      <button class="btn btn-secondary"
        onclick="gotoAuth('${isReg ? 'login' : 'register'}')">
        ${isReg ? 'Already have an account? Login' : 'New user? Register'}
      </button>
    </div>
  `;
}

function buildCharPicker() {
  const sel = state._tempChar || '🧑‍🍳';
  return `
    <div class="card">
      <div class="card-title">Pick Your Avatar 🎭</div>
      <div class="card-sub">Choose a character that represents you in the kitchen!</div>
      <div class="char-grid">
        ${AVATARS.map(c => `
          <div class="char-opt${sel === c ? ' sel' : ''}"
            onclick="selectChar('${c}')">${c}</div>
        `).join('')}
      </div>
      <div style="text-align:center;margin-top:20px">
        <div style="font-size:52px;margin-bottom:8px">${sel}</div>
        <div style="font-size:14px;color:var(--text-muted)">Your chosen avatar</div>
      </div>
      <button class="btn btn-primary" style="margin-top:20px"
        onclick="confirmChar()" ${state.loading ? 'disabled' : ''}>
        ${state.loading ? '<span class="spinner"></span>' : ''}
        Looks Good! Continue →
      </button>
    </div>
  `;
}

function buildKitchenChoice() {
  const u = state.currentUser;
  return `
    <div class="card">
      <div style="font-size:13px;color:var(--text-muted);margin-bottom:6px">Logged in as</div>
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:4px">
        <span style="font-size:32px">${u.char}</span>
        <div>
          <div style="font-weight:700;font-size:17px">${u.username}</div>
          <div style="font-size:12px;color:var(--text-muted)">Choose your kitchen below</div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-title">Your Kitchen</div>
      <div class="card-sub">Start cooking together by joining or creating a kitchen.</div>
      <div class="choice-grid">
        <div class="choice-tile" onclick="nav('kitchenAuth')">
          <div class="tile-icon">🏠</div>
          <div class="tile-label">Join Kitchen</div>
          <div class="tile-desc">Enter an existing one</div>
        </div>
        <div class="choice-tile" onclick="nav('kitchenCreate')">
          <div class="tile-icon">🍳</div>
          <div class="tile-label">New Kitchen</div>
          <div class="tile-desc">Create &amp; become host</div>
        </div>
      </div>
    </div>
    <button class="btn btn-ghost btn-sm" onclick="logout()">Logout</button>
  `;
}

function buildKitchenAuth() {
  return `
    <button class="back-btn" onclick="nav('kitchenChoice')">← Back</button>
    <div class="card">
      <div class="card-title">Join Kitchen 🏠</div>
      <div class="card-sub">
        Enter the kitchen name and password to join your family's kitchen.
      </div>
      <div class="field">
        <label>Kitchen Name</label>
        <input id="kn" type="text" placeholder="e.g. Sharma Kitchen" autocomplete="off">
      </div>
      <div class="field">
        <label>Kitchen Password</label>
        <input id="kp" type="password" placeholder="Kitchen secret password"
          onkeydown="if(event.key==='Enter') joinKitchen()">
      </div>
      <button class="btn btn-primary" onclick="joinKitchen()"
        ${state.loading ? 'disabled' : ''}>
        ${state.loading ? '<span class="spinner"></span>' : ''}
        Enter Kitchen
      </button>
    </div>
  `;
}

function buildKitchenCreate() {
  return `
    <button class="back-btn" onclick="nav('kitchenChoice')">← Back</button>
    <div class="card">
      <div class="card-title">Create Kitchen 🍳</div>
      <div class="card-sub">
        You'll be the host of this kitchen and can manage members and polls.
      </div>
      <div class="field">
        <label>Kitchen Name</label>
        <input id="kn" type="text" placeholder="e.g. Sharma Family Kitchen" autocomplete="off">
      </div>
      <div class="field">
        <label>Set Kitchen Password</label>
        <input id="kp" type="password" placeholder="Others will use this to join">
      </div>
      <div class="field">
        <label>Confirm Password</label>
        <input id="kp2" type="password" placeholder="Repeat password"
          onkeydown="if(event.key==='Enter') createKitchen()">
      </div>
      <button class="btn btn-primary" onclick="createKitchen()"
        ${state.loading ? 'disabled' : ''}>
        ${state.loading ? '<span class="spinner"></span>' : ''}
        🎉 Create Kitchen
      </button>
    </div>
  `;
}
