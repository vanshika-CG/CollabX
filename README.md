<div align="center">

# 🚀 CollabX
### Study Together • Learn Smarter • Stay Productive

<img src="https://img.shields.io/badge/MERN-FullStack-green?style=for-the-badge"/>
<img src="https://img.shields.io/badge/Realtime-Socket.io-black?style=for-the-badge"/>
<img src="https://img.shields.io/badge/WebRTC-Video-blue?style=for-the-badge"/>
<img src="https://img.shields.io/badge/AI-Flashcards-purple?style=for-the-badge"/>

---

✨ **Collaborative Study Platform built for modern learners**

Create study rooms, chat in real time, draw together, attend video sessions, generate AI quizzes, and stay productive.

</div>

---

# 🌟 Why CollabX?

CollabX transforms studying into a **real-time collaborative experience**.

Instead of switching between apps for:
- Calls 📞
- Notes 📝
- Timers ⏱️
- Whiteboards 🎨
- Scheduling 📅

Everything exists in **one intelligent workspace**.

---

# ✨ Features

## 👥 Virtual Study Rooms
- Create public/private rooms
- Join active sessions
- Track members in real-time
- Room administration support

---

## 💬 Live Chat System
- Instant communication
- Socket-powered updates
- Persistent message history
- MongoDB storage

---

## 🎨 Collaborative Whiteboard
- Multi-user drawing
- Excalidraw integration
- Save and restore sessions
- Real-time synchronization

---

## 📹 Video Conferencing
- Multi-peer WebRTC calls
- Group sessions
- Participant controls
- Live connection handling

---

## 🧠 AI Quiz + OCR Engine
- Generate flashcards automatically
- Extract content from PDFs
- OCR using uploaded documents
- Gamified learning

---

## ⏱️ Pomodoro Productivity
- Shared timer
- Focus sessions
- Break scheduling
- Room synchronization

---

## 📝 Collaborative Notes
- Shared notebooks
- Persistent storage
- Edit & manage content

---

## 📅 Study Scheduler
- Calendar support
- Task planning
- Deadline management

---

## 🔐 Authentication
- JWT Authentication
- Google OAuth
- Encrypted passwords

---

# 🛠 Tech Stack

<table>

<tr>
<td><strong>Frontend</strong></td>
<td>

React  
Vite  
Tailwind CSS  
Socket.io Client  
Excalidraw  
Simple Peer  

</td>
</tr>

<tr>
<td><strong>Backend</strong></td>
<td>

Node.js  
Express.js  
MongoDB  
Socket.io  
JWT  
Bcrypt  

</td>
</tr>

<tr>
<td><strong>AI Tools</strong></td>
<td>

Tesseract.js  
PDF Parse  

</td>
</tr>

</table>

---

# 📂 Project Structure

```text
CollabX
│
├── backend
│   ├── controllers
│   ├── database
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── socket
│   └── server.js
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── context
│   │   ├── pages
│   │   └── main.jsx
│
└── README.md
```

---

# ⚙️ Installation

## 1️⃣ Clone Repository

```bash
git clone <repository-url>

cd collabx
```

---

## 2️⃣ Backend Setup

```bash
cd backend

npm install
```

Create `.env`

```env
PORT=5000

MONGO_URI=your_mongodb_uri

JWT_SECRET=your_secret

GOOGLE_CLIENT_ID=your_client_id
```

Start Backend

```bash
npm run dev
```

---

## 3️⃣ Frontend Setup

```bash
cd frontend

npm install
```

Create `.env`

```env
VITE_API_URL=http://localhost:5000

VITE_GOOGLE_CLIENT_ID=your_client_id
```

Run Frontend

```bash
npm run dev
```

---

# 🧪 Core Technologies

| Feature | Technology |
|---------|------------|
| Chat | Socket.io |
| Video | WebRTC |
| Whiteboard | Excalidraw |
| Authentication | JWT + OAuth |
| AI | OCR + Quiz Generation |
| Storage | MongoDB |

---

# 📸 Preview

```text
Dashboard
   ↓
Study Room
   ↓
Chat + Whiteboard
   ↓
Video Session
   ↓
AI Quiz
```

---

# 🚀 Future Improvements

- Mobile Application
- AI Study Assistant
- Screen Sharing
- Analytics Dashboard
- Cloud Deployment
- Voice Notes

---

# 🤝 Contributing

```bash
Fork → Clone → Build → Commit → Pull Request
```

---

<div align="center">

### 💙 Built with passion for collaborative learning

⭐ Star the repository if you like it

</div>
