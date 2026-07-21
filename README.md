# 🧮 Math Game

A browser-based math practice game for building arithmetic, fraction, and equation skills. Choose your difficulty, pick problem types, and track your progress!

![Screenshot](./screenshot.png)

## Features

- **Three difficulty levels**
  - Easy: Numbers 1–10
  - Medium: Numbers 10–50
  - Hard: Numbers 50–100

- **Three problem types**
  - **Whole Numbers**: Addition, subtraction, multiplication, division
  - **Fractions**: Fraction addition and subtraction (e.g. ½ + ⅓)
  - **Equations**: Solve for x (e.g. x + 5 = 12)

- **Customizable rounds**
  - Choose 5, 10, or 20 problems per round
  - Mix and match problem types

- **Instant feedback**
  - Correct/incorrect indicator after each answer
  - Progress tracking with score board

- **Results screen**
  - Score percentage, correct/incorrect counts
  - Encouraging messages based on performance
  - Play again with same settings

## Tech Stack

| Layer | Technology |
|-------|-----------|
| UI | React 19 + TypeScript |
| Routing | React Router v8 |
| Build | Vite 8 |
| Styling | CSS (custom properties) |
| Linting | Biome |

## Getting Started

### Prerequisites

- Node.js 24+
- [pnpm](https://pnpm.io/) (recommended)

### Install & Run

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build & Preview

```bash
# Production build
pnpm build

# Preview production build
pnpm preview
```

### Code Quality

```bash
# Lint
pnpm lint

# Format
pnpm format
```

## Project Structure

```
math-game/
├── src/
│   ├── components/
│   │   ├── FractionInput.tsx      # Fraction answer input
│   │   ├── MathProblemDisplay.tsx # Problem rendering + feedback
│   │   ├── ScoreBoard.tsx         # Score progress indicator
│   │   └── useMathGame.ts         # Game logic hook
│   ├── pages/
│   │   ├── HomePage.tsx           # Difficulty & category selection
│   │   ├── GamePage.tsx           # Active game screen
│   │   └── ResultsPage.tsx        # Score summary
│   ├── App.tsx                    # Router setup
│   ├── index.css                  # Global styles
│   ├── main.tsx                   # Entry point
│   ├── types.ts                   # Shared types
│   └── vite-env.d.ts              # Vite type declarations
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── biome.json
```

## Game Flow

1. **Home Page** — Select difficulty, problem types, and round length
2. **Game Page** — Solve problems one at a time with instant feedback
3. **Results Page** — View score and play again

## License

MIT
