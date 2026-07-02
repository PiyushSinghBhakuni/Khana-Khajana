# 🍽️ Khana Khajana
> Kitchen Inventory Manager — manage dishes, run daily polls, and track what your family eats. Synced across all devices via Firebase.

---

## 📁 Project Structure

```
khana-khajana/
├── index.html               ← Main entry point
├── README.md                ← This file
├── css/
│   └── style.css            ← All styles
└── js/
    ├── firebase-config.js   ← ⚠️ Paste your Firebase credentials here
    ├── storage.js           ← Firestore read/write + real-time listener
    ├── state.js             ← Global app state & constants
    ├── utils.js             ← Toast, alert, render, header
    ├── pages.js             ← Landing, Auth, Char Picker, Kitchen Choice pages
    ├── tabs.js              ← Kitchen tabs: Home, Menu, Poll, History, Settings
    ├── actions.js           ← All user actions (auth, kitchen, dishes, poll)
    └── app.js               ← Entry point
```

---

## 🔥 Firebase Setup (Free — 5 minutes)

You need a free Firebase project to enable cloud sync across devices.

### Step 1 — Create a Firebase Project
1. Go to https://console.firebase.google.com
2. Click **"Add project"**
3. Name it `khana-khajana` → Continue → Create project

### Step 2 — Register a Web App
1. On the project homepage, click the **`</>`** (Web) icon
2. Give it a nickname (e.g. `khana-web`) → Click **Register app**
3. You'll see a `firebaseConfig` object — **keep this page open**

### Step 3 — Paste Credentials
Open `js/firebase-config.js` and replace each placeholder with the real value from Step 2:

```js
const firebaseConfig = {
  apiKey:            "AIzaSy...",
  authDomain:        "khana-khajana.firebaseapp.com",
  projectId:         "khana-khajana",
  storageBucket:     "khana-khajana.appspot.com",
  messagingSenderId: "123456789",
  appId:             "1:123456789:web:abc123"
};
```

### Step 4 — Enable Firestore Database
1. In the Firebase console left menu: **Build → Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (allows all reads/writes for 30 days)
4. Select any region → **Enable**

> **After 30 days**, go to Firestore → Rules and replace the rules with:
> ```
> rules_version = '2';
> service cloud.firestore {
>   match /databases/{database}/documents {
>     match /{document=**} {
>       allow read, write: if true;
>     }
>   }
> }
> ```

### Step 5 — Run the App
That's it! Open `index.html` with Live Server in VS Code, or host it anywhere.

---

## 🚀 Running in VS Code

1. Install the **Live Server** extension (`ritwickdey.LiveServer`)
2. Open the `khana-khajana/` folder in VS Code
3. Right-click `index.html` → **Open with Live Server**
4. App opens at `http://127.0.0.1:5500`

> ⚠️ Don't open `index.html` directly as `file://` — Firebase requires HTTP.
> Always use Live Server or a hosted URL.

---

## 🌐 Free Hosting Options

### Netlify Drop (fastest — no account needed)
1. Go to https://app.netlify.com/drop
2. Drag and drop the entire `khana-khajana/` folder
3. Get a live public URL in seconds

### GitHub Pages
1. Push the folder to a GitHub repo
2. Go to **Settings → Pages → Deploy from branch**
3. Select `main` / root → Save

---

## ✨ Features

| Feature | Details |
|---|---|
| ☁️ Cloud sync | All data stored in Firebase — works across every device |
| 🔴 Real-time | Kitchen updates (votes, new members, poll) sync live |
| 👤 Multi-user auth | Register / Login with hashed passwords |
| 🎭 Avatar picker | 16 emoji avatars to choose from |
| 🏠 Kitchen system | Create or join kitchens with a shared password |
| 👑 Host controls | Transfer host, reset scores, declare poll winners |
| 🍛 Dish menu | Add/remove dishes with auto emoji |
| 🗳️ Smart poll | Daily poll picks top-scoring dishes automatically |
| 📊 Scoring algo | Winner −25 pts · All others +10 pts each round |
| 📜 History | Full log of every meal cooked |
| 🚪 Leave kitchen | Members can leave; last member deletes kitchen |

---

## 🧠 Scoring Algorithm

- Every dish starts at **100 points**
- When a dish wins the poll and is marked as cooked → **−25 pts**
- Every other dish in the kitchen → **+10 pts** (max 100)
- Daily poll options = the **top 4 highest-scoring** dishes
- Dishes not cooked for a long time naturally bubble up to the top

---

## 💾 Data Structure (Firestore)

```
/users/{userId}
  id, username, passHash, char, createdAt

/kitchens/{kitchenId}
  id, name, passHash, hostId, createdAt
  members: { [userId]: { id, username, char } }
  dishes:  { [dishId]: { id, name, emoji, points, timesCooked, lastCooked } }
  currentPoll: { date, options[], votes{}, winner }
  lastMade: { dish, time }
  history: [ { dish, emoji, time, votes, dishId } ]
```
