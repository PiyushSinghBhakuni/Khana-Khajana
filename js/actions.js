// =============================================
//  KHANA KHAJANA — Actions (Firestore async)
// =============================================

// ---- AUTH ----

async function submitAuth() {
  clearAlert();
  const un  = (document.getElementById('un')?.value  || '').trim();
  const pw  =  document.getElementById('pw')?.value  || '';
  const pw2 =  document.getElementById('pw2')?.value || '';

  if (!un || !pw) return setAlert('Please fill all fields.');

  await run(async () => {
    const users = await getUsers();

    if (state.authMode === 'register') {
      if (pw.length < 4) { setAlert('Password must be at least 4 characters.'); return; }
      if (pw !== pw2)    { setAlert('Passwords do not match.'); return; }

      const exists = Object.values(users).find(
        u => u.username.toLowerCase() === un.toLowerCase()
      );
      if (exists) { setAlert('Username already taken. Choose another.'); return; }

      const id = 'u_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
      const newUser = { id, username: un, passHash: hashPass(pw), char: '🧑‍🍳', createdAt: Date.now() };
      await saveUser(newUser);

      state._pendingUser = newUser;
      state._tempChar    = '🧑‍🍳';
      state.page         = 'charPicker';
      render();

    } else {
      const user = Object.values(users).find(
        u => u.username.toLowerCase() === un.toLowerCase()
      );
      if (!user || user.passHash !== hashPass(pw)) {
        setAlert('Invalid username or password.');
        return;
      }
      state.currentUser = user;
      state.page        = 'kitchenChoice';
      render();
    }
  });
}

async function confirmChar() {
  await run(async () => {
    const user  = state._pendingUser;
    if (!user) return;
    user.char = state._tempChar || '🧑‍🍳';
    await saveUser(user);
    state.currentUser  = user;
    state._pendingUser = null;
    state._tempChar    = null;
    clearAlert();
    state.page = 'kitchenChoice';
    render();
  });
}

function logout() {
  unsubscribeFromKitchen();
  state.currentUser    = null;
  state.currentKitchen = null;
  state.kitchenTab     = 'home';
  state.authMode       = null;
  state._tempChar      = '🧑‍🍳';
  state._pendingUser   = null;
  clearAlert();
  state.page = 'landing';
  showToast('Logged out. See you soon! 👋');
  render();
}

// ---- KITCHEN ----

async function createKitchen() {
  clearAlert();
  const kn  = (document.getElementById('kn')?.value  || '').trim();
  const kp  =  document.getElementById('kp')?.value  || '';
  const kp2 =  document.getElementById('kp2')?.value || '';

  if (!kn || !kp) return setAlert('Please fill all fields.');
  if (kp.length < 4) return setAlert('Password must be at least 4 characters.');
  if (kp !== kp2)    return setAlert('Passwords do not match.');

  await run(async () => {
    const kitchens = await getKitchens();
    const exists   = Object.values(kitchens).find(
      k => k.name.toLowerCase() === kn.toLowerCase()
    );
    if (exists) { setAlert('Kitchen name already taken. Try another name.'); return; }

    const id = 'k_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
    const u  = state.currentUser;
    const kitchen = {
      id,
      name:     kn,
      passHash: hashPass(kp),
      hostId:   u.id,
      members:  { [u.id]: { id: u.id, username: u.username, char: u.char } },
      dishes:   {},
      currentPoll: null,
      lastMade:    null,
      history:     [],
      createdAt:   Date.now()
    };
    await saveKitchen(kitchen);
    state.currentKitchen = kitchen;
    state.page           = 'kitchen';
    state.kitchenTab     = 'home';
    subscribeToKitchen(id);
    showToast('Kitchen created! You are the host 👑');
    render();
  });
}

async function joinKitchen() {
  clearAlert();
  const kn = (document.getElementById('kn')?.value || '').trim();
  const kp =  document.getElementById('kp')?.value || '';

  if (!kn || !kp) return setAlert('Please fill all fields.');

  await run(async () => {
    const kitchens = await getKitchens();
    const kitchen  = Object.values(kitchens).find(
      k => k.name.toLowerCase() === kn.toLowerCase()
    );
    if (!kitchen)                           { setAlert('Kitchen not found. Check the name and try again.'); return; }
    if (kitchen.passHash !== hashPass(kp))  { setAlert('Wrong password. Please try again.'); return; }

    const u = state.currentUser;
    kitchen.members[u.id] = { id: u.id, username: u.username, char: u.char };
    if (!kitchen.history) kitchen.history = [];

    await saveKitchen(kitchen);
    state.currentKitchen = kitchen;
    state.page           = 'kitchen';
    state.kitchenTab     = 'home';
    subscribeToKitchen(kitchen.id);
    showToast(`Joined ${kitchen.name}! 🏠`);
    render();
  });
}

async function leaveKitchen() {
  const k           = state.currentKitchen;
  const uid         = state.currentUser.id;
  const memberCount = Object.keys(k.members || {}).length;

  if (k.hostId === uid && memberCount > 1) {
    return setAlert('You are the host! Transfer host power to someone else before leaving.', 'error');
  }
  if (!confirm(`Leave "${k.name}"? You can rejoin anytime with the password.`)) return;

  await run(async () => {
    const fresh = await getKitchen(k.id);
    if (fresh) {
      delete fresh.members[uid];
      if (Object.keys(fresh.members).length === 0) {
        await deleteKitchen(fresh.id);
      } else {
        await saveKitchen(fresh);
      }
    }
    unsubscribeFromKitchen();
    state.currentKitchen = null;
    state.kitchenTab     = 'home';
    clearAlert();
    state.page = 'kitchenChoice';
    showToast('You left the kitchen.');
    render();
  });
}

async function transferHost(newHostId) {
  if (!confirm('Are you sure you want to transfer host powers? You will become a regular member.')) return;

  await run(async () => {
    const k    = await getKitchen(state.currentKitchen.id);
    k.hostId   = newHostId;
    await saveKitchen(k);
    state.currentKitchen = k;
    const newHost = k.members[newHostId];
    showToast(`${newHost?.username} is now the host 👑`);
    render();
  });
}

async function resetScores() {
  if (!confirm('Reset all dish scores to 100? This cannot be undone.')) return;

  await run(async () => {
    const k = await getKitchen(state.currentKitchen.id);
    Object.values(k.dishes || {}).forEach(d => { d.points = 100; });
    k.currentPoll = null;
    await saveKitchen(k);
    state.currentKitchen = k;
    showToast('All scores reset to 100 pts!');
    render();
  });
}

// ---- DISHES ----

async function addDish() {
  const input = document.getElementById('dish-input');
  const name  = (input?.value || '').trim();
  if (!name) return;
  if (name.length < 2) return setAlert('Dish name is too short.');

  await run(async () => {
    const k = await getKitchen(state.currentKitchen.id);
    if (!k.dishes) k.dishes = {};

    const exists = Object.values(k.dishes).find(
      d => d.name.toLowerCase() === name.toLowerCase()
    );
    if (exists) { setAlert(`"${name}" is already in the menu!`); return; }

    const id    = 'd_' + Date.now() + '_' + Math.random().toString(36).slice(2, 5);
    const emoji = FOOD_EMOJIS[Math.floor(Math.random() * FOOD_EMOJIS.length)];
    k.dishes[id] = { id, name, emoji, points: 100, timesCooked: 0, lastCooked: null };

    await saveKitchen(k);
    state.currentKitchen = k;
    if (input) input.value = '';
    showToast(`"${name}" added to menu! 🍛`);
    render();
  });
}

async function removeDish(dishId) {
  if (!confirm('Remove this dish from the menu?')) return;

  await run(async () => {
    const k    = await getKitchen(state.currentKitchen.id);
    const name = k.dishes[dishId]?.name;
    delete k.dishes[dishId];
    await saveKitchen(k);
    state.currentKitchen = k;
    showToast(`"${name}" removed.`);
    render();
  });
}

// ---- POLL ----

async function startPoll() {
  await run(async () => {
    const k       = await getKitchen(state.currentKitchen.id);
    const dishes  = Object.values(k.dishes || {});
    if (dishes.length < 2) { setAlert('Add at least 2 dishes first!'); return; }

    // Algorithm: top 4 dishes by points (highest = cooked least recently)
    const sorted = [...dishes].sort((a, b) => b.points - a.points);
    const top    = sorted.slice(0, Math.min(4, sorted.length));

    k.currentPoll = {
      date:    new Date().toDateString(),
      options: top.map(d => d.id),
      votes:   {},
      winner:  null
    };
    await saveKitchen(k);
    state.currentKitchen = k;
    showToast('Poll started! Let everyone vote 🗳️');
    render();
  });
}

async function castVote(dishId) {
  await run(async () => {
    const k = await getKitchen(state.currentKitchen.id);
    if (!k.currentPoll) return;
    if (k.currentPoll.votes[state.currentUser.id]) { setAlert('You have already voted!', 'info'); return; }
    if (k.currentPoll.winner) return;

    k.currentPoll.votes[state.currentUser.id] = dishId;
    await saveKitchen(k);
    state.currentKitchen = k;
    showToast('Vote cast! 🗳️');
    render();
  });
}

async function declareWinner() {
  await run(async () => {
    const k    = await getKitchen(state.currentKitchen.id);
    const poll = k.currentPoll;
    if (!poll) return;

    const voteCounts = {};
    Object.values(poll.votes).forEach(v => {
      voteCounts[v] = (voteCounts[v] || 0) + 1;
    });
    if (Object.keys(voteCounts).length === 0) { setAlert('No votes yet! Wait for members to vote.'); return; }

    // Sort by votes; break ties by highest dish points
    const sorted = Object.entries(voteCounts).sort((a, b) => {
      if (b[1] !== a[1]) return b[1] - a[1];
      return (k.dishes[b[0]]?.points || 0) - (k.dishes[a[0]]?.points || 0);
    });
    k.currentPoll.winner = sorted[0][0];

    await saveKitchen(k);
    state.currentKitchen = k;
    const winDish = k.dishes[k.currentPoll.winner];
    showToast(`Winner: ${winDish?.emoji} ${winDish?.name} 🏆`);
    render();
  });
}

async function markAsCooked() {
  await run(async () => {
    const k    = await getKitchen(state.currentKitchen.id);
    const poll = k.currentPoll;
    if (!poll?.winner) return;

    const dish = k.dishes[poll.winner];
    if (!dish) return;

    const totalVotes = Object.values(poll.votes || {}).length;

    // Update winning dish
    dish.timesCooked = (dish.timesCooked || 0) + 1;
    dish.lastCooked  = Date.now();
    dish.points      = Math.max(0, dish.points - 25);

    // All other dishes gain 10 pts (capped at 100)
    Object.values(k.dishes).forEach(d => {
      if (d.id !== dish.id) d.points = Math.min(100, d.points + 10);
    });

    // Log to history
    if (!k.history) k.history = [];
    k.history.push({
      dish:   dish.name,
      emoji:  dish.emoji,
      time:   Date.now(),
      votes:  totalVotes,
      dishId: dish.id
    });

    k.lastMade    = { dish: dish.name, time: Date.now() };
    k.currentPoll = null;

    await saveKitchen(k);
    state.currentKitchen = k;
    showToast(`"${dish.name}" cooked! Scores updated 📊`);
    render();
  });
}
