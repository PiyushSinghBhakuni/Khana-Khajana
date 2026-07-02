# 🍽️ Khana Khajana

**Khana Khajana** is a cloud-based kitchen inventory and meal management web application that helps families, roommates, and shared households organize groceries, plan meals, and make food-related decisions collaboratively.

The application stores all data in **Firebase Cloud Firestore**, allowing users to access and synchronize information across multiple devices in real time.

---

## 🚀 Live Demo

🌐 https://khana-khajana-b9c4c.web.app

---

## 📖 Problem Statement

Managing groceries and deciding daily meals in a shared household is often confusing. Different people purchase ingredients independently, food gets wasted, and deciding what to cook becomes difficult.

There is no centralized system where everyone can:

- Track available ingredients
- Plan meals
- Vote for today's food
- Estimate food quantity
- Access updated information from multiple devices

---

## 💡 Solution

Khana Khajana provides a centralized cloud-based platform where all household members can collaboratively manage their kitchen inventory.

The application allows users to:

- Maintain a common inventory
- Record purchased items
- Vote for meals
- Track food quantity
- Synchronize all information using Firebase Cloud Firestore

---

# ✨ Features

- 👤 User Registration
- 🔐 User Login
- ☁️ Cloud Synchronization using Firebase Firestore
- 🍅 Kitchen Inventory Management
- 🥗 Meal Planning
- 🗳️ Daily Food Voting
- 🍽️ Food Quantity Tracking
- 📱 Responsive User Interface
- 🌍 Multi-device Data Access

---

# 🛠️ Tech Stack

### Frontend

- HTML5
- CSS3
- JavaScript (ES6)

### Backend

- Firebase Cloud Firestore

### Hosting

- Firebase Hosting

### Version Control

- Git
- GitHub

---

# 📂 Project Structure

```
Khana-Khajana
│
├── css/
│   └── style.css
│
├── js/
│   ├── actions.js
│   ├── app.js
│   ├── firebase-config.js
│   ├── pages.js
│   ├── state.js
│   ├── storage.js
│   ├── tabs.js
│   └── utils.js
│
├── firebase.json
├── firestore.rules
├── firestore.indexes.json
├── index.html
└── README.md
```

---

# ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/PiyushSinghBhakuni/Khana-Khajana.git
```

Move into the project directory

```bash
cd Khana-Khajana
```

---

# 🔥 Firebase Setup

1. Create a Firebase Project.
2. Enable Cloud Firestore.
3. Create a Firestore Database.
4. Replace the Firebase configuration inside

```
js/firebase-config.js
```

with your own Firebase credentials.

Example

```javascript
const firebaseConfig = {
    apiKey: "...",
    authDomain: "...",
    projectId: "...",
    storageBucket: "...",
    messagingSenderId: "...",
    appId: "..."
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
window.db = db;
```

---

# ▶️ Running the Project

Simply open

```
index.html
```

in your browser

or deploy using Firebase Hosting

```bash
firebase deploy
```

---

# ☁️ Deployment

The application is deployed using Firebase Hosting.

Deploy command

```bash
firebase deploy
```

---

# 📱 Application Workflow

```
User Registration
        │
        ▼
User Login
        │
        ▼
Kitchen Inventory
        │
        ▼
Meal Suggestions
        │
        ▼
Food Voting
        │
        ▼
Food Quantity Management
        │
        ▼
Cloud Firestore Synchronization
```

---

# 📸 Screenshots

## Landing Page

<img width="1710" height="1112" alt="Screenshot 2026-07-03 at 12 22 45 AM" src="https://github.com/user-attachments/assets/1a22bd27-fb67-496c-961d-12ab77366260" />

---

## Login

<img width="1710" height="1112" alt="Screenshot 2026-07-03 at 12 21 32 AM" src="https://github.com/user-attachments/assets/155e6557-0b13-460e-b6e7-e0fa619b4127" />

---

## Inventory Dashboard

<img width="1710" height="1112" alt="Screenshot 2026-07-03 at 12 18 39 AM" src="https://github.com/user-attachments/assets/e802bd8b-1066-4038-8fe2-9161ddcf71ad" />

---

## Meal Voting

<img width="1710" height="1112" alt="Screenshot 2026-07-03 at 12 16 02 AM" src="https://github.com/user-attachments/assets/ae87c8cb-d611-437c-a513-fe31f662fd30" />

---

# 🚧 Challenges Faced

- Migrating from Local Storage to Firebase Cloud Firestore
- Managing cloud synchronization
- Designing reusable JavaScript modules
- Handling asynchronous Firestore operations
- Deploying the application using Firebase Hosting

---

# 📚 Learning Outcomes

Through this project I learned:

- Firebase Cloud Firestore
- Cloud Database Design
- CRUD Operations
- Firebase Hosting
- JavaScript ES6
- Git & GitHub
- Cloud Deployment

---

# 🔮 Future Improvements

- Firebase Authentication
- Push Notifications
- Barcode Scanner
- Grocery Expense Tracking
- AI-based Meal Recommendation
- Nutrition Analysis
- Offline Support
- Dark Mode

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a new branch

```bash
git checkout -b feature-name
```

3. Commit your changes

```bash
git commit -m "Added new feature"
```

4. Push

```bash
git push origin feature-name
```

5. Open a Pull Request

---

# 👨‍💻 Author

**Piyush Singh Bhakuni**

GitHub:
https://github.com/PiyushSinghBhakuni

LinkedIn:
*(Add your LinkedIn profile)*

---

# 📄 License

This project is licensed under the MIT License.

---

## ⭐ If you found this project useful, don't forget to star the repository.
