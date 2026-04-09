# 🐓 Poultry Expert AI Chat

An AI-powered poultry farming consultant chat application built with React, Redux, and the Mistral AI Agent API. Get expert advice on disease diagnosis, medicine guides, feed & nutrition, farm management, chick care, and egg production.

## 🚀 Features

### Core Functionality
- **AI-Powered Conversations**: Chat with a specialized poultry expert AI using Mistral's advanced language model
- **Multi-Conversation Support**: Create, switch between, and manage multiple chat sessions
- **Persistent State**: All messages and conversations are stored in Redux state during the session
- **Context Preservation**: Conversation history is maintained across turns for coherent, contextual responses

### User Interface
- **Responsive Design**: Optimized for desktop and mobile devices
- **Dark/Light Theme**: Toggle between themes with persistent local storage
- **Ambient Background**: Subtle animated background for enhanced visual appeal
- **Welcome Screen**: Feature cards and suggestion chips for quick start
- **Typing Indicator**: Visual feedback during AI response generation
- **Toast Notifications**: User-friendly alerts for actions and errors

### Message Features
- **Rich Text Rendering**: Markdown support with syntax highlighting for code blocks
- **Mathematical Expressions**: KaTeX rendering for mathematical formulas in responses
- **Message Actions**: Copy, share, and download individual messages
- **Share Modal**: Generate shareable links for conversations with social sharing options

### Poultry-Specific Features
- **Disease Diagnosis**: Identify and get treatment plans for common poultry diseases
- **Medicine Guide**: Dosage recommendations and treatment protocols
- **Feed & Nutrition**: Advice on optimal feed formulations and nutritional requirements
- **Farm Management**: Housing, temperature control, and environmental tips
- **Chick Care**: Guidance from newborn care to adult poultry management
- **Egg Production**: Strategies to maximize yield and quality

## 🏗️ Architecture

The application follows a modern React architecture with the following components:

### Frontend Framework
- **React 18**: Latest React with hooks and concurrent features
- **Redux Toolkit**: Simplified state management with actions and reducers
- **React Router**: Client-side routing (if needed for future expansion)

### State Management
- **Redux Store**: Centralized state for conversations, messages, and UI state
- **Actions & Reducers**: Predictable state updates with action creators
- **Persistent Sessions**: In-memory state persistence during user sessions

### API Integration
- **Mistral AI Agent**: Specialized poultry expert model for domain-specific responses
- **RESTful API**: Clean API layer for conversation start/continue operations
- **Error Handling**: Robust error handling for API failures and network issues

### UI Components
- **Modular Components**: Reusable UI components organized by feature
- **Custom Hooks**: Encapsulated logic for chat operations and state management
- **CSS-in-JS**: Styled components with CSS variables for theming
- **Animations**: Framer Motion for smooth transitions and micro-interactions

### Utilities
- **Markdown Processing**: Custom markdown renderer with syntax highlighting
- **Helper Functions**: Utility functions for ID generation, time formatting, and data manipulation
- **Constants**: Centralized configuration for API keys, suggestions, and feature data

## 📁 Project Structure

```
poultry-chat-app/
├── public/
│   └── index.html                 # Main HTML template
├── src/
│   ├── api/
│   │   └── mistralApi.js          # Mistral API integration layer
│   ├── components/
│   │   ├── Chat/
│   │   │   ├── ChatArea.jsx       # Main chat container component
│   │   │   ├── ChatHeader.jsx     # Chat header with title and actions
│   │   │   ├── ChatInput.jsx      # Message input with send functionality
│   │   │   ├── MessageBubble.jsx  # Individual message display with actions
│   │   │   ├── MessageList.jsx    # Scrollable list of messages
│   │   │   └── WelcomeScreen.jsx  # Initial welcome screen with features
│   │   ├── Modals/
│   │   │   └── ShareModal.jsx     # Share conversation modal
│   │   ├── Sidebar/
│   │   │   └── Sidebar.jsx        # Conversation list and navigation
│   │   └── UI/
│   │       ├── AmbientBackground.jsx  # Animated background component
│   │       ├── Icons.jsx          # Custom icon components
│   │       ├── SuggestionChips.jsx # Quick suggestion buttons
│   │       ├── Toast.jsx          # Notification toast component
│   │       └── TypingIndicator.jsx # AI typing animation
│   ├── constants/
│   │   └── index.js               # API config, suggestions, feature cards
│   ├── hooks/
│   │   └── useChat.js             # Custom hook for chat logic
│   ├── store/
│   │   ├── index.js               # Redux store configuration
│   │   ├── actions/
│   │   │   └── chatActions.js     # Redux action creators
│   │   └── reducers/
│   │       └── chatReducer.js     # Redux state reducer
│   ├── styles/
│   │   └── global.css             # Global styles and animations
│   ├── utils/
│   │   ├── helpers.js             # Utility functions
│   │   └── markdown.js            # Markdown rendering utilities
│   ├── App.jsx                    # Root React component
│   └── index.js                   # React application entry point
├── .env                           # Environment variables (API keys)
├── .env.example                   # Environment template
├── .gitignore                     # Git ignore rules
├── package.json                   # Dependencies and scripts
└── README.md                      # This file
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- Mistral AI API key and Agent ID

### 1. Clone the Repository
```bash
git clone <repository-url>
cd poultry-chat-app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Copy the environment template and configure your API credentials:

```bash
cp .env.example .env
```

Edit `.env` with your Mistral API details:
```env
REACT_APP_MISTRAL_API_KEY=your_mistral_api_key_here
REACT_APP_MISTRAL_AGENT_ID=your_agent_id_here
```

### 4. Start Development Server
```bash
npm start
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### 5. Build for Production
```bash
npm run build
```

## 🚀 Usage

### Getting Started
1. **Welcome Screen**: View feature cards and click suggestion chips for quick queries
2. **New Chat**: Click "New Chat" in the sidebar to start a conversation
3. **Ask Questions**: Type poultry-related questions in the input field
4. **View Responses**: AI responses appear with rich formatting and actions

### Key Interactions
- **Theme Toggle**: Use the theme switcher in the sidebar
- **Conversation Management**: Switch between conversations using the sidebar
- **Message Actions**: Hover over messages to access copy, share, and download options
- **Share Conversations**: Use the share button to generate shareable links

### Example Queries
- "How do I treat coccidiosis in broiler chickens?"
- "What's the best vaccination schedule for layers?"
- "How can I improve feed conversion ratio?"
- "What temperature should I maintain in the poultry house?"

## 🔧 Development

### Available Scripts
- `npm start` - Start development server
- `npm run build` - Create production build
- `npm run dev` - Start with Netlify dev (if configured)

### Code Quality
- ESLint configuration for code linting
- React best practices and hooks rules
- Consistent code formatting

### API Integration
The app integrates with Mistral AI's Agent API:
- **Agent ID**: Specialized poultry expert model
- **Version**: Latest agent version for optimal responses
- **Context**: Full conversation history maintained

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Mistral AI for providing the advanced language model
- React and Redux communities for excellent documentation
- Poultry farming experts for domain knowledge validation

---

Built with ❤️ for poultry farmers worldwide
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
