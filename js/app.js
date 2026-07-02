// =============================================
//  KHANA KHAJANA — App Entry Point
// =============================================

document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Quick connectivity check — attempt a lightweight Firestore read
    await db.collection('_ping').limit(1).get();
    state.page = 'landing';
  } catch (e) {
    // Firebase not configured yet or no internet
    console.error('Firebase init error:', e);
    state.page = 'landing';
    state.alert = {
      msg: '⚠️ Cloud database not connected. Open js/firebase-config.js and paste your Firebase credentials. See README.md for setup instructions.',
      type: 'error'
    };
  }
  render();
});
