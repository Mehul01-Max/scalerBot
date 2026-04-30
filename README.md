# ScalerBot — Persona-Based AI Chatbot

> Talk to Scaler's founders — **Anshuman Singh**, **Abhimanyu Saxena**, and **Kshitij Mishra** — through an AI chatbot that captures their real voice, philosophy, and communication style.

🔗 **Live Demo:** [https://scalerbot.vercel.app](https://scalerbot.vercel.app) <!-- Replace with your actual deployed URL -->

---

## Screenshots

| Anshuman Singh | Abhimanyu Saxena | Kshitij Mishra |
|:-:|:-:|:-:|
| ![Anshuman](screenshot/Screenshot%202026-04-30%20at%2019.18.21.png) | ![Abhimanyu](screenshot/Screenshot%202026-04-30%20at%2019.18.39.png) | ![Kshitij](screenshot/Screenshot%202026-04-30%20at%2019.19.13.png) |

---

## Features

- **Three distinct personas** — Each with a deeply researched system prompt containing persona description, few-shot examples, chain-of-thought instructions, output formatting, and strict constraints.
- **Persona switcher** — Tabs to switch between Anshuman, Abhimanyu, and Kshitij. Switching resets the conversation.
- **Suggestion chips** — Quick-start questions per persona to kick off a conversation.
- **Typing indicator** — Animated dots while the LLM generates a response.
- **Graceful error handling** — User-friendly toast notifications on API failures.
- **Responsive design** — Works seamlessly on desktop and mobile.
- **Dark-mode UI** — Clean, modern interface built with vanilla CSS.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite |
| Backend | Node.js + Express 5 |
| LLM API | OpenRouter (GPT model) |
| Styling | Vanilla CSS (dark mode, glassmorphism) |
| Deployment | Vercel (frontend) / Railway (backend) |

---

## Project Structure

```
ScalerBot/
├── backend/
│   ├── index.js                   # Express server with /chat and /changePersona endpoints
│   ├── AshumanSystemPrompt.js     # Anshuman Singh's system prompt
│   ├── AbhimanyuSystemPrompt.js   # Abhimanyu Saxena's system prompt
│   ├── KshitijSystemPrompt.js     # Kshitij Mishra's system prompt
│   ├── .env.example               # Environment variable template (no real keys)
│   ├── .gitignore
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx                # Main chat UI component
│   │   ├── api.js                 # API client (sendMessage, changePersona)
│   │   ├── personas.js            # Persona metadata, colors, suggestion chips
│   │   ├── index.css              # Full design system
│   │   └── main.jsx               # React entry point
│   ├── index.html
│   ├── .gitignore
│   └── package.json
├── screenshot/                    # UI screenshots for all three personas
├── prompts.md                     # All system prompts with annotations
├── reflection.md                  # 300–500 word reflection
└── README.md                      # This file
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- An API key from [OpenRouter](https://openrouter.ai/) (or any OpenAI-compatible provider)

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/ScalerBot.git
cd ScalerBot
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file by copying the example:

```bash
cp .env.example .env
```

Open `.env` and paste your real API key:

```
OPENROUTER_API_KEY=sk-or-v1-your-key-here
```

Start the backend server:

```bash
node index.js
# Server runs at http://localhost:3000
```

### 3. Set up the frontend

In a new terminal:

```bash
cd frontend
npm install
npm run dev
# App runs at http://localhost:5173
```

The frontend will connect to the backend at `http://localhost:3000` by default. To change this, set the `VITE_API_URL` environment variable.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/chat` | Send a message. Body: `{ "query": "your message" }`. Returns `{ "response": { "role": "assistant", "content": "..." } }` |
| `PUT` | `/changePersona/:persona` | Switch persona (`Anshuman`, `Abhimanyu`, or `Kshitij`). Resets conversation history. |

---

## Key Design Decisions

1. **System prompts are backend-only** — The actual prompt text lives in the backend so it cannot be inspected or manipulated by the client.
2. **Conversation state on the server** — The `messages` array is maintained server-side so the full conversation context is sent to the LLM on every call.
3. **OpenRouter as LLM gateway** — Provides access to multiple models through a single API, making it easy to swap models without code changes.

---

## Documentation

- [`prompts.md`](prompts.md) — All three system prompts with detailed annotations explaining every design choice.
- [`reflection.md`](reflection.md) — 300–500 word reflection on the development process, GIGO lessons, and improvement ideas.

---

## License

This project was built as part of **Assignment 01 — Prompt Engineering** at **Scaler Academy**.
# scalerbot
# scalerBot
