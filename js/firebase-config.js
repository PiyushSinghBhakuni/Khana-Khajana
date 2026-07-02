// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAf_q0NWG2FfpCn1NjnPu_EM0h0oXzbdt8",
  authDomain: "khana-khajana-b9c4c.firebaseapp.com",
  projectId: "khana-khajana-b9c4c",
  storageBucket: "khana-khajana-b9c4c.firebasestorage.app",
  messagingSenderId: "425013791292",
  appId: "1:425013791292:web:411bcdb2fde9b89c1ed139"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();

// Make db global
window.db = db;