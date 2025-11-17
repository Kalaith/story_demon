# ✍️ StoryDemon (Demon Writer)

A playful writing app that gamifies the writing process by adding a mischievous demon that tries to discourage you while you write! Turn your inner critic into a clickable game mechanic.

## 🎮 How It Works

The app features a clean writing interface where you can freely type your text. As you write, your word count updates in real-time. Every 10-20 seconds (increasingly faster as you write more), a little demon pops up at a random location on the screen and delivers a discouraging comment like "This is terrible writing!" or "Nobody will read this...".

You can click on the demon to squash it, which makes it disappear and adds to your "Demons Squashed" score. The demon won't interrupt your typing - it's just an overlay that you can choose to deal with or ignore if you're in a flow state.

## ✨ Features

### Core Features
- **Real-time Word Counting**: Track your progress as you write
- **Demon Spawning System**: Demons appear with increasing frequency as you write more
- **Interactive Demons**: Click to squash demons and track your score
- **Dynamic Spawn Rate**: The more you write, the more frequently demons appear (resets when you squash one)
- **Cursor Preservation**: Clicking a demon returns focus to your text at the exact cursor position

### Session Management
- **Auto-save**: Your writing is automatically saved to local storage
- **History System**: View and load previous writing sessions
- **Session Persistence**: Never lose your work - everything is saved automatically
- **Start New Session**: Save current work and start fresh with one click

### Additional Features
- **Copy to Clipboard**: One-click copy of your entire text
- **Finish Summary**: View your writing session stats with word count, demons squashed, and a calculated score
- **Toast Notifications**: Get feedback when sessions are saved
- **Dark Mode Support**: Automatically adapts to your system theme

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Modern web browser

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd story_demon
```

2. Navigate to the frontend directory:
```bash
cd frontend
```

3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## 📜 Available Scripts

All scripts should be run from the `frontend` directory:

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors automatically
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking
- `npm run test` - Run tests in watch mode
- `npm run test:run` - Run tests once
- `npm run ci` - Run full CI pipeline (lint, type-check, test, build)

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── game/          # Game-specific components
│   │   │   └── Demon.tsx
│   │   └── ui/            # Reusable UI components
│   │       ├── HistoryModal.tsx
│   │       ├── SummaryModal.tsx
│   │       └── Toast.tsx
│   ├── data/              # Static data and configuration
│   │   ├── demonComments.ts
│   │   └── gameConfig.ts
│   ├── hooks/             # Custom React hooks
│   │   ├── useCopyText.ts
│   │   ├── useDemonScheduler.ts
│   │   └── useWordCount.ts
│   ├── pages/             # Page components
│   │   └── StoryDemonPage.tsx
│   ├── stores/            # Zustand state management
│   │   ├── gameStore.ts
│   │   └── toastStore.ts
│   ├── styles/            # CSS styles
│   │   └── story-demon.css
│   ├── types/             # TypeScript type definitions
│   │   └── game.ts
│   ├── App.tsx            # Main app component (routing)
│   └── main.tsx           # Application entry point
```

## 🛠️ Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Zustand** - State management with persistence
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **date-fns** - Date formatting utilities
- **uuid** - Unique ID generation

## 🎯 How It Works

### Demon Spawning System

- **Base Rate**: Demons spawn every 10-20 seconds initially
- **Dynamic Rate**: Each word written reduces spawn delay by 50ms
- **Minimum Rate**: Never spawns faster than every 3-6 seconds
- **Reset on Squash**: When you squash a demon, the spawn rate resets to base

### Scoring System

- **Word Count**: Real-time tracking of words written
- **Demons Squashed**: Track how many demons you've defeated
- **Multiplier**: 1.0x base + 0.1x per demon squashed
- **Total Score**: Words × Multiplier

### Data Persistence

- All data is stored in browser localStorage
- Auto-saves every 30 seconds
- Auto-saves on page unload
- Auto-saves on every text change
- History keeps last 50 sessions

## 🎨 Design System

The app uses a custom design system with CSS variables for:
- Colors (with dark mode support)
- Typography
- Spacing
- Border radius
- Shadows
- Animations

All styles are defined in `src/styles/story-demon.css` and follow a consistent design token system.

## 📝 Development Standards

This project follows the WebHatchery Frontend Standards. See `standards-frontend.md` for detailed guidelines on:
- Code organization
- Component patterns
- State management
- TypeScript usage
- Testing practices

## 🤝 Contributing

1. Follow the project's coding standards
2. Write tests for new features
3. Ensure all linting and type checks pass
4. Update documentation as needed

## 📄 License

Private project - All rights reserved

## 🙏 Acknowledgments

Created as a fun way to gamify the writing process and help writers overcome their inner critic by making it a playful, interactive experience.

