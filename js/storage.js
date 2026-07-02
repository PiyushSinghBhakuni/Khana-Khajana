// =============================================
//  KHANA KHAJANA — Cloud Storage (Firestore)
//  Collections:  users     /users/{userId}
//                kitchens  /kitchens/{kitchenId}
// =============================================

// ---------- USERS ----------

async function getUsers() {
  const snap = await db.collection('users').get();
  const result = {};
  snap.forEach(doc => { result[doc.id] = doc.data(); });
  return result;
}

async function saveUser(user) {
  await db.collection('users').doc(user.id).set(user);
}

// ---------- KITCHENS ----------

async function getKitchens() {
  const snap = await db.collection('kitchens').get();
  const result = {};
  snap.forEach(doc => { result[doc.id] = doc.data(); });
  return result;
}

async function getKitchen(kitchenId) {
  const doc = await db.collection('kitchens').doc(kitchenId).get();
  return doc.exists ? doc.data() : null;
}

async function saveKitchen(kitchen) {
  await db.collection('kitchens').doc(kitchen.id).set(kitchen);
}

async function deleteKitchen(kitchenId) {
  await db.collection('kitchens').doc(kitchenId).delete();
}

// ---------- PASSWORD HASH ----------
// Simple non-cryptographic hash — fine for a local/demo app.
// For production use, integrate Firebase Authentication instead.

function hashPass(p) {
  let h = 5381;
  for (let i = 0; i < p.length; i++) {
    h = ((h << 5) + h) ^ p.charCodeAt(i);
    h >>>= 0;
  }
  return 'H' + h.toString(36);
}

// ---------- REAL-TIME LISTENER ----------
// Watches the current kitchen for changes made by other members
// (new votes, poll started, member joined, etc.)

let _kitchenListener = null;

function subscribeToKitchen(kitchenId) {
  unsubscribeFromKitchen();
  _kitchenListener = db.collection('kitchens').doc(kitchenId)
    .onSnapshot(doc => {
      if (!doc.exists) return;
      const fresh = doc.data();
      // Only re-render if something actually changed
      if (JSON.stringify(fresh) !== JSON.stringify(state.currentKitchen)) {
        state.currentKitchen = fresh;
        render();
      }
    }, err => console.error('Kitchen listener error:', err));
}

function unsubscribeFromKitchen() {
  if (_kitchenListener) { _kitchenListener(); _kitchenListener = null; }
}
