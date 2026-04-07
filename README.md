# 🐓 Poultry Expert AI Chat

An AI-powered poultry farming consultant chat application built with React, Redux, and the Mistral AI Agent API.

---

## Project Structure

```
poultry-chat-app/
├── public/
│   └── index.html
├── src/
│   ├── api/
│   │   └── mistralApi.js          # Mistral API layer (start/continue conversations)
│   ├── components/
│   │   ├── Chat/
│   │   │   ├── ChatArea.jsx       # Main chat column orchestrator
│   │   │   ├── ChatHeader.jsx     # Top header bar
│   │   │   ├── ChatInput.jsx      # Textarea + send button
│   │   │   ├── MessageBubble.jsx  # Individual message with actions
│   │   │   ├── MessageList.jsx    # Scrollable message list
│   │   │   └── WelcomeScreen.jsx  # Empty-state welcome + feature cards
│   │   ├── Modals/
│   │   │   └── ShareModal.jsx     # Share link + social share modal
│   │   ├── Sidebar/
│   │   │   └── Sidebar.jsx        # Conversation list + new chat
│   │   └── UI/
│   │       ├── AmbientBackground.jsx
│   │       ├── Icons.jsx
│   │       ├── SuggestionChips.jsx
│   │       ├── Toast.jsx
│   │       └── TypingIndicator.jsx
│   ├── constants/
│   │   └── index.js               # API config, suggestions, feature cards
│   ├── hooks/
│   │   └── useChat.js             # Core send/receive logic hook
│   ├── store/
│   │   ├── index.js               # Redux createStore
│   │   ├── actions/
│   │   │   └── chatActions.js     # Action types + creators
│   │   └── reducers/
│   │       └── chatReducer.js     # Chat state reducer
│   ├── styles/
│   │   └── global.css             # Global styles, animations, markdown CSS
│   ├── utils/
│   │   ├── helpers.js             # generateId, formatTime, download, copy, share URL
│   │   └── markdown.js            # Lightweight Markdown → HTML renderer
│   ├── App.jsx                    # Root component
│   └── index.js                   # React entry point
├── .env                           # API keys (not committed)
├── .env.example                   # Template for env setup
├── .gitignore
└── package.json
```

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env` and fill in your keys:

```bash
cp .env.example .env
```

```env
REACT_APP_MISTRAL_API_KEY=your_key_here
REACT_APP_MISTRAL_AGENT_ID=your_agent_id_here
```

### 3. Start development server

```bash
npm start
```

App runs at [http://localhost:3000](http://localhost:3000)

### 4. Build for production

```bash
npm run build
```

---

## Features

- **Multi-conversation sidebar** – Create, switch, and delete conversations
- **Persistent Redux state** – All messages stored per conversation for the session
- **Mistral Agent integration** – Conversation context preserved across follow-up turns
- **Markdown rendering** – Bold, italic, headers, lists, blockquotes, inline code
- **Message actions** – Copy, Share (link + WhatsApp/Email/Twitter), Download .txt, Like
- **Typing indicator** – Animated dots while the agent responds
- **Suggestion chips** – Quick-start questions on welcome and in-chat
- **Auto-titling** – Conversations titled from the first user message
- **Toast notifications** – Feedback for copy/download actions
- **Responsive sidebar** – Collapsible with toggle button
- **Poultry-themed UI** – Deep green palette, Playfair Display + Nunito fonts, ambient animations

---

## Tech Stack

| Layer       | Technology          |
|-------------|---------------------|
| UI          | React 18            |
| State       | Redux + react-redux |
| API         | Mistral AI `/v1/conversations` |
| Styling     | CSS-in-JS + global CSS |
| Fonts       | Google Fonts (Playfair Display, Nunito) |
