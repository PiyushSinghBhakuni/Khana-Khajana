// =============================================
//  KHANA KHAJANA — Kitchen Tab Builders
// =============================================

function buildKitchenPage() {
  const k      = state.currentKitchen;
  const u      = state.currentUser;
  const isHost = k.hostId === u.id;
  return `
    <div class="nav-tabs">
      <button class="nav-tab${state.kitchenTab==='home'      ?' active':''}" onclick="setTab('home')">🏠 Home</button>
      <button class="nav-tab${state.kitchenTab==='inventory' ?' active':''}" onclick="setTab('inventory')">📦 Menu</button>
      <button class="nav-tab${state.kitchenTab==='poll'      ?' active':''}" onclick="setTab('poll')">🗳️ Poll</button>
      <button class="nav-tab${state.kitchenTab==='history'   ?' active':''}" onclick="setTab('history')">📜 History</button>
      <button class="nav-tab${state.kitchenTab==='settings'  ?' active':''}" onclick="setTab('settings')">⚙️</button>
    </div>
    ${state.kitchenTab==='home'      ? buildHomeTab(k,u,isHost)      : ''}
    ${state.kitchenTab==='inventory' ? buildInventoryTab(k,u,isHost) : ''}
    ${state.kitchenTab==='poll'      ? buildPollTab(k,u,isHost)      : ''}
    ${state.kitchenTab==='history'   ? buildHistoryTab(k)            : ''}
    ${state.kitchenTab==='settings'  ? buildSettingsTab(k,u,isHost)  : ''}
  `;
}

// ---- HOME ----
function buildHomeTab(k, u, isHost) {
  const members = Object.values(k.members || {});
  const dishes  = Object.values(k.dishes  || {});
  const poll    = k.currentPoll;
  const hasPoll = poll && poll.date === new Date().toDateString();
  return `
    <div class="card">
      <div class="section-header">
        <div class="section-title">${k.name}</div>
        ${isHost
          ? `<span style="background:var(--turmeric);color:#fff;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:700">👑 Host</span>`
          : `<span style="background:var(--saffron-light);color:var(--saffron-dark);padding:4px 12px;border-radius:20px;font-size:12px;font-weight:700">Member</span>`}
      </div>
      <div style="font-size:13px;color:var(--text-muted);margin-bottom:20px">
        ${members.length} member${members.length!==1?'s':''}
        &nbsp;•&nbsp;
        ${dishes.length} dish${dishes.length!==1?'es':''} in menu
      </div>
      <div style="font-size:13px;font-weight:700;color:var(--warm-gray);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:10px">Members</div>
      <div class="members-grid">
        ${members.map(m=>`
          <div class="member-avatar">
            <div class="avatar-circle${m.id===k.hostId?' host-badge':''}">${m.char}</div>
            <div class="avatar-name">${m.username}</div>
          </div>
        `).join('')}
      </div>
      ${k.lastMade
        ?`<div class="alert alert-info" style="margin-top:16px">
            🍽️ Last cooked: <strong>${k.lastMade.dish}</strong> — ${fmtDate(k.lastMade.time)}
          </div>`:''}
      ${hasPoll && !poll.winner
        ?`<div class="alert alert-success" style="margin-top:12px">
            🗳️ A poll is active today! Go to the Poll tab to vote.
          </div>`:''}
    </div>
  `;
}

// ---- INVENTORY ----
function buildInventoryTab(k, u, isHost) {
  const dishes = Object.values(k.dishes||{}).sort((a,b)=>b.points-a.points);
  return `
    <div class="card">
      <div class="section-header">
        <div class="section-title">Dish Menu 🍛</div>
        <span style="font-size:13px;color:var(--text-muted)">${dishes.length} dish${dishes.length!==1?'es':''}</span>
      </div>
      <div style="font-size:13px;color:var(--text-muted);margin-bottom:16px">
        Add dishes to your kitchen. They appear in polls based on score —
        highest score = not cooked for the longest time.
      </div>
      <div class="dish-input-row">
        <input id="dish-input" type="text"
          placeholder="e.g. Dal Makhani, Paneer Butter Masala"
          onkeydown="if(event.key==='Enter') addDish()">
        <button class="btn btn-primary btn-sm" onclick="addDish()"
          ${state.loading?'disabled':''}>
          ${state.loading?'<span class="spinner"></span>':''}+ Add
        </button>
      </div>
      <div class="dish-list">
        ${dishes.length===0
          ?`<div style="text-align:center;color:var(--text-muted);padding:32px 0;font-size:14px">
              No dishes yet!<br>Add your family's favorites 🥘
            </div>`
          :dishes.map(d=>`
            <div class="dish-item">
              <div style="display:flex;align-items:center;gap:10px;flex:1;min-width:0">
                <span style="font-size:22px">${d.emoji}</span>
                <div style="min-width:0">
                  <div class="dish-name" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${d.name}</div>
                  <div class="dish-pts">
                    ${d.timesCooked>0?`Cooked ${d.timesCooked}x`:'Never cooked'}
                    ${d.lastCooked?' • '+new Date(d.lastCooked).toLocaleDateString('en-IN',{day:'numeric',month:'short'}):''}
                  </div>
                </div>
              </div>
              <div style="display:flex;align-items:center;gap:8px;flex-shrink:0">
                <span class="pts-badge ${ptsClass(d.points)}">${d.points} pts</span>
                ${isHost?`<button class="btn btn-danger btn-sm" style="padding:6px 10px"
                    onclick="removeDish('${d.id}')">✕</button>`:''}
              </div>
            </div>
          `).join('')}
      </div>
      <div style="margin-top:16px;padding-top:16px;border-top:1px solid var(--border);font-size:12px;color:var(--text-muted);line-height:1.6">
        💡 <strong>Scoring:</strong> Dishes start at 100 pts.
        When made, the winner loses 25 pts; all others gain 10 pts.
        The poll always picks the top-scoring dishes.
      </div>
    </div>
  `;
}

// ---- POLL ----
function buildPollTab(k, u, isHost) {
  const dishes    = k.dishes||{};
  const allDishes = Object.values(dishes);

  if (allDishes.length < 2) {
    return `
      <div class="card empty-state">
        <div class="empty-icon">🥘</div>
        <div class="card-title">No Dishes Yet</div>
        <div class="card-sub">Add at least 2 dishes in the Menu tab to start daily polls!</div>
        <button class="btn btn-primary" style="margin-top:8px" onclick="setTab('inventory')">Go to Menu →</button>
      </div>
    `;
  }

  const poll         = k.currentPoll;
  const today        = new Date().toDateString();
  const hasPollToday = poll && poll.date === today;

  if (!hasPollToday) {
    return `
      <div class="card empty-state">
        <div class="empty-icon">🗳️</div>
        <div class="card-title">No Poll Today</div>
        <div class="card-sub">
          ${isHost
            ?"Start a poll so everyone can vote on today's meal!"
            :"Ask your host to start today's poll!"}
        </div>
        ${isHost?`<button class="btn btn-primary" style="margin-top:8px" onclick="startPoll()"
            ${state.loading?'disabled':''}>
            ${state.loading?'<span class="spinner"></span>':''}🎲 Start Today's Poll
          </button>`:''}
      </div>
    `;
  }

  const options    = poll.options.map(id=>dishes[id]).filter(Boolean);
  const myVote     = poll.votes?.[u.id];
  const totalVotes = Object.values(poll.votes||{}).length;
  const canVote    = !myVote && !poll.winner;
  const showResults= !!myVote || !!poll.winner;

  return `
    <div class="card">
      <div class="section-header">
        <div class="section-title">Today's Poll 🗳️</div>
        ${poll.winner
          ?`<span style="background:var(--turmeric);color:#fff;padding:4px 10px;border-radius:20px;font-size:12px;font-weight:700">Closed</span>`
          :`<span style="background:var(--cardamom-light);color:var(--cardamom);padding:4px 10px;border-radius:20px;font-size:12px;font-weight:700">🟢 Live</span>`}
      </div>
      <div style="font-size:13px;color:var(--text-muted);margin-bottom:20px">
        ${totalVotes} vote${totalVotes!==1?'s':''} cast
        ${canVote?' — tap a dish to vote!':''}
      </div>

      ${poll.winner?`
        <div class="alert alert-success" style="margin-bottom:20px;text-align:center;font-size:15px">
          🏆 Today's winner: <strong>${dishes[poll.winner]?.emoji} ${dishes[poll.winner]?.name}</strong>
        </div>`:''}

      ${options.map(d=>{
        const voteCount = Object.values(poll.votes||{}).filter(v=>v===d.id).length;
        const pct       = totalVotes>0?Math.round((voteCount/totalVotes)*100):0;
        const isSelected= myVote===d.id;
        const isWinner  = poll.winner===d.id;
        return `
          <div class="poll-option
            ${isSelected?' selected':''}
            ${isWinner  ?' winner'  :''}
            ${!canVote  ?' no-click':''}"
            onclick="${canVote?`castVote('${d.id}')` :''}">
            <span style="font-size:30px">${d.emoji}</span>
            <div style="flex:1;min-width:0">
              <div style="font-weight:700;font-size:15px">${d.name}</div>
              <div style="font-size:12px;color:var(--text-muted);margin-top:1px">${d.points} pts</div>
              ${showResults?`
                <div class="vote-bar"><div class="vote-fill" style="width:${pct}%"></div></div>
                <div class="vote-count">${voteCount} vote${voteCount!==1?'s':''} (${pct}%)</div>
              `:''}
            </div>
            ${isSelected?`<span style="font-size:20px">✅</span>`:''}
            ${isWinner  ?`<span style="font-size:22px">🏆</span>`:''}
          </div>
        `;
      }).join('')}

      ${isHost && !poll.winner && totalVotes>0
        ?`<button class="btn btn-success" style="margin-top:8px" onclick="declareWinner()"
            ${state.loading?'disabled':''}>
            ${state.loading?'<span class="spinner"></span>':''}🏆 Declare Winner
          </button>`:''}
      ${isHost && !poll.winner && totalVotes===0
        ?`<div style="text-align:center;font-size:13px;color:var(--text-muted);margin-top:8px">
            Waiting for members to vote...
          </div>`:''}
      ${poll.winner && isHost
        ?`<button class="btn btn-primary" style="margin-top:12px" onclick="markAsCooked()"
            ${state.loading?'disabled':''}>
            ${state.loading?'<span class="spinner"></span>':''}✅ Mark as Cooked &amp; Close Poll
          </button>`:''}
      ${poll.winner && !isHost
        ?`<div style="text-align:center;font-size:13px;color:var(--text-muted);margin-top:12px">
            Waiting for host to confirm cooking...
          </div>`:''}
    </div>
  `;
}

// ---- HISTORY ----
function buildHistoryTab(k) {
  const history = (k.history||[]).slice().reverse();
  return `
    <div class="card">
      <div class="section-title" style="margin-bottom:16px">Cooking History 📜</div>
      ${history.length===0
        ?`<div style="text-align:center;color:var(--text-muted);padding:32px 0;font-size:14px">
            No history yet!<br>Start a poll and cook something 🍳
          </div>`
        :history.map(h=>`
          <div class="history-item">
            <div style="display:flex;align-items:center;gap:10px">
              <span style="font-size:24px">${h.emoji}</span>
              <div>
                <div style="font-weight:700;font-size:14px">${h.dish}</div>
                <div style="font-size:12px;color:var(--text-muted)">${h.votes} vote${h.votes!==1?'s':''} in poll</div>
              </div>
            </div>
            <div style="font-size:12px;color:var(--text-muted);text-align:right">${fmtDate(h.time)}</div>
          </div>
        `).join('')}
    </div>
  `;
}

// ---- SETTINGS ----
function buildSettingsTab(k, u, isHost) {
  const members = Object.values(k.members||{}).filter(m=>m.id!==k.hostId);
  const dishes  = Object.values(k.dishes ||{});
  return `
    <div class="card">
      <div class="section-title" style="margin-bottom:16px">Your Profile</div>
      <div style="display:flex;align-items:center;gap:14px">
        <span style="font-size:44px">${u.char}</span>
        <div>
          <div style="font-weight:700;font-size:17px">${u.username}</div>
          <div style="font-size:13px;color:var(--text-muted)">
            ${isHost?'👑 Kitchen Host':'👤 Member'} in ${k.name}
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="section-title" style="margin-bottom:16px">Kitchen Info</div>
      <div style="font-size:14px;color:var(--text-muted);display:flex;flex-direction:column;gap:10px">
        <div>📛 Name: <strong style="color:var(--text)">${k.name}</strong></div>
        <div>👥 Members: <strong style="color:var(--text)">${Object.keys(k.members||{}).length}</strong></div>
        <div>🍛 Dishes: <strong style="color:var(--text)">${dishes.length}</strong></div>
        <div>📜 Meals cooked: <strong style="color:var(--text)">${(k.history||[]).length}</strong></div>
      </div>
    </div>

    ${isHost && members.length>0?`
      <div class="card">
        <div class="section-title" style="margin-bottom:4px">Transfer Host Power 👑</div>
        <div style="font-size:13px;color:var(--text-muted);margin-bottom:16px">Pass hosting privileges to another member</div>
        ${members.map(m=>`
          <div class="transfer-row">
            <div style="display:flex;align-items:center;gap:10px">
              <span style="font-size:24px">${m.char}</span>
              <span style="font-weight:600;font-size:15px">${m.username}</span>
            </div>
            <button class="btn btn-secondary btn-sm" onclick="transferHost('${m.id}')">Make Host</button>
          </div>
        `).join('')}
      </div>`:''}

    ${isHost?`
      <div class="card">
        <div class="section-title" style="margin-bottom:4px;color:var(--rose)">Reset Scores</div>
        <div style="font-size:13px;color:var(--text-muted);margin-bottom:16px">Reset all dish scores to 100 pts and clear the active poll</div>
        <button class="btn btn-danger btn-sm" onclick="resetScores()"
          ${state.loading?'disabled':''}>
          ${state.loading?'<span class="spinner"></span>':''}🔄 Reset All Scores
        </button>
      </div>`:''}

    <div class="card">
      <div class="section-title" style="margin-bottom:16px;color:var(--rose)">Leave Kitchen</div>
      <div style="font-size:13px;color:var(--text-muted);margin-bottom:16px">You can rejoin anytime using the kitchen name and password.</div>
      <button class="btn btn-danger btn-sm" onclick="leaveKitchen()"
        ${state.loading?'disabled':''}>
        ${state.loading?'<span class="spinner"></span>':''}🚪 Leave ${k.name}
      </button>
    </div>
  `;
}
