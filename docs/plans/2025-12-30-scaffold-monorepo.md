# Game Hosting Monorepo Scaffold Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Scaffold a complete pnpm workspace monorepo with Vite, TypeScript, homepage package, and example game package.

**Architecture:** pnpm workspaces with shared TypeScript config, each package is independent Vite app building to shared dist/ directory.

**Tech Stack:** pnpm, Vite 5, TypeScript 5 (strict mode), vanilla HTML/CSS/TS

---

## Task 1: Root Workspace Configuration

**Files:**
- Create: `pnpm-workspace.yaml`
- Create: `package.json`
- Modify: `.gitignore`

**Step 1: Create pnpm workspace config**

Create `pnpm-workspace.yaml`:

```yaml
packages:
  - 'packages/*'
```

**Step 2: Create root package.json**

Create `package.json`:

```json
{
  "name": "eruch.rocks",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "pnpm --parallel --recursive dev",
    "build": "pnpm --recursive build",
    "typecheck": "pnpm --recursive typecheck",
    "clean": "rm -rf dist && pnpm --recursive exec rm -rf dist"
  },
  "devDependencies": {
    "typescript": "^5.7.0",
    "vite": "^6.0.0"
  }
}
```

**Step 3: Update .gitignore**

The .gitignore already exists with basic entries. Verify it contains:

```
node_modules/
dist/
.DS_Store
*.log
.vite/
.worktrees/
```

**Step 4: Commit root workspace config**

```bash
git add pnpm-workspace.yaml package.json
git commit -m "feat: add root workspace configuration"
```

---

## Task 2: Shared TypeScript Configuration

**Files:**
- Create: `tsconfig.json`

**Step 1: Create strict TypeScript config**

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,

    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,

    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noImplicitOverride": true
  }
}
```

**Step 2: Commit TypeScript config**

```bash
git add tsconfig.json
git commit -m "feat: add strict TypeScript configuration"
```

---

## Task 3: Homepage Package Structure

**Files:**
- Create: `packages/homepage/package.json`
- Create: `packages/homepage/tsconfig.json`
- Create: `packages/homepage/vite.config.ts`
- Create: `packages/homepage/index.html`
- Create: `packages/homepage/src/main.ts`
- Create: `packages/homepage/src/style.css`

**Step 1: Create homepage package.json**

Create `packages/homepage/package.json`:

```json
{
  "name": "homepage",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc --noEmit && vite build",
    "typecheck": "tsc --noEmit"
  }
}
```

**Step 2: Create homepage TypeScript config**

Create `packages/homepage/tsconfig.json`:

```json
{
  "extends": "../../tsconfig.json",
  "include": ["src"]
}
```

**Step 3: Create homepage Vite config**

Create `packages/homepage/vite.config.ts`:

```typescript
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: '../../dist',
    emptyOutDir: true,
  },
})
```

**Step 4: Create homepage HTML**

Create `packages/homepage/index.html`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>eruch.rocks</title>
    <link rel="stylesheet" href="/src/style.css" />
  </head>
  <body>
    <div id="app">
      <h1>Welcome to eruch.rocks</h1>
      <p>A collection of silly games and experiments.</p>
      <nav>
        <h2>Games</h2>
        <ul id="game-list">
          <li><a href="/clicker/">Clicker Game</a> - Click to increase the counter</li>
        </ul>
      </nav>
    </div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

**Step 5: Create homepage TypeScript**

Create `packages/homepage/src/main.ts`:

```typescript
// ABOUTME: Entry point for the homepage that initializes the app.
// ABOUTME: Currently minimal, ready for customization.

console.log('Homepage loaded!')
```

**Step 6: Create homepage styles**

Create `packages/homepage/src/style.css`:

```css
:root {
  font-family: system-ui, -apple-system, sans-serif;
  line-height: 1.6;
  color: #213547;
  background-color: #ffffff;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

#app {
  max-width: 600px;
  width: 100%;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #1a1a1a;
}

h2 {
  font-size: 1.5rem;
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: #333;
}

p {
  margin-bottom: 2rem;
  color: #666;
}

nav ul {
  list-style: none;
}

nav li {
  margin-bottom: 0.75rem;
}

nav a {
  color: #0066cc;
  text-decoration: none;
  font-weight: 500;
}

nav a:hover {
  text-decoration: underline;
}
```

**Step 7: Commit homepage package**

```bash
git add packages/homepage/
git commit -m "feat: add homepage package"
```

---

## Task 4: Example Game Package (Clicker)

**Files:**
- Create: `packages/clicker/package.json`
- Create: `packages/clicker/tsconfig.json`
- Create: `packages/clicker/vite.config.ts`
- Create: `packages/clicker/index.html`
- Create: `packages/clicker/src/main.ts`
- Create: `packages/clicker/src/game.ts`
- Create: `packages/clicker/src/style.css`

**Step 1: Create clicker package.json**

Create `packages/clicker/package.json`:

```json
{
  "name": "clicker",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc --noEmit && vite build",
    "typecheck": "tsc --noEmit"
  }
}
```

**Step 2: Create clicker TypeScript config**

Create `packages/clicker/tsconfig.json`:

```json
{
  "extends": "../../tsconfig.json",
  "include": ["src"]
}
```

**Step 3: Create clicker Vite config**

Create `packages/clicker/vite.config.ts`:

```typescript
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: '../../dist/clicker',
    emptyOutDir: true,
  },
})
```

**Step 4: Create clicker HTML**

Create `packages/clicker/index.html`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Clicker Game</title>
    <link rel="stylesheet" href="/src/style.css" />
  </head>
  <body>
    <div id="app">
      <h1>Clicker Game</h1>
      <div id="game">
        <p>Score: <span id="score">0</span></p>
        <button id="click-button">Click Me!</button>
        <p class="stats">Clicks per second: <span id="cps">0.0</span></p>
      </div>
      <nav>
        <a href="/">← Back to Home</a>
      </nav>
    </div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

**Step 5: Create clicker game logic**

Create `packages/clicker/src/game.ts`:

```typescript
// ABOUTME: Core game logic for the clicker game.
// ABOUTME: Manages state, user input, and click rate tracking.

interface GameState {
  score: number
  clickTimes: number[]
}

export class ClickerGame {
  private state: GameState
  private scoreElement: HTMLElement
  private cpsElement: HTMLElement

  constructor(scoreElement: HTMLElement, cpsElement: HTMLElement) {
    this.state = {
      score: 0,
      clickTimes: [],
    }
    this.scoreElement = scoreElement
    this.cpsElement = cpsElement
  }

  click(): void {
    this.state.score++
    this.state.clickTimes.push(Date.now())

    // Keep only last second of clicks
    const oneSecondAgo = Date.now() - 1000
    this.state.clickTimes = this.state.clickTimes.filter(
      time => time > oneSecondAgo
    )

    this.updateDisplay()
  }

  private updateDisplay(): void {
    this.scoreElement.textContent = this.state.score.toString()
    this.cpsElement.textContent = this.state.clickTimes.length.toFixed(1)
  }

  startTracking(): void {
    setInterval(() => {
      const oneSecondAgo = Date.now() - 1000
      this.state.clickTimes = this.state.clickTimes.filter(
        time => time > oneSecondAgo
      )
      this.updateDisplay()
    }, 100)
  }
}
```

**Step 6: Create clicker entry point**

Create `packages/clicker/src/main.ts`:

```typescript
// ABOUTME: Entry point for the clicker game.
// ABOUTME: Initializes the game and sets up event listeners.

import { ClickerGame } from './game'

const scoreElement = document.getElementById('score')
const cpsElement = document.getElementById('cps')
const clickButton = document.getElementById('click-button')

if (!scoreElement || !cpsElement || !clickButton) {
  throw new Error('Required DOM elements not found')
}

const game = new ClickerGame(scoreElement, cpsElement)
game.startTracking()

clickButton.addEventListener('click', () => {
  game.click()
})
```

**Step 7: Create clicker styles**

Create `packages/clicker/src/style.css`:

```css
:root {
  font-family: system-ui, -apple-system, sans-serif;
  line-height: 1.6;
  color: #213547;
  background-color: #ffffff;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

#app {
  max-width: 400px;
  width: 100%;
  text-align: center;
}

h1 {
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #1a1a1a;
}

#game {
  background: #f5f5f5;
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

#game p {
  font-size: 1.25rem;
  margin-bottom: 1rem;
}

#score {
  font-weight: bold;
  color: #0066cc;
  font-size: 1.5rem;
}

#click-button {
  background: #0066cc;
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.25rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
  margin: 1rem 0;
}

#click-button:hover {
  background: #0052a3;
}

#click-button:active {
  transform: scale(0.95);
}

.stats {
  font-size: 0.9rem !important;
  color: #666;
}

#cps {
  font-weight: bold;
}

nav {
  margin-top: 1rem;
}

nav a {
  color: #0066cc;
  text-decoration: none;
}

nav a:hover {
  text-decoration: underline;
}
```

**Step 8: Commit clicker package**

```bash
git add packages/clicker/
git commit -m "feat: add clicker example game package"
```

---

## Task 5: CLAUDE.md Instructions

**Files:**
- Create: `CLAUDE.md`

**Step 1: Create CLAUDE.md**

Create `CLAUDE.md`:

```markdown
# eruch.rocks Development Guide

This is a pnpm workspace monorepo for hosting browser-based games. Each game is an independent package using Vite and TypeScript.

## Project Structure

```
packages/
├── homepage/     # Landing page at eruch.rocks/
└── clicker/      # Example game at eruch.rocks/clicker/
```

## Creating a New Game

New games go in `packages/game-name/` with this structure:

```
packages/game-name/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── index.html
└── src/
    └── main.ts
```

### package.json Template

```json
{
  "name": "game-name",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc --noEmit && vite build",
    "typecheck": "tsc --noEmit"
  }
}
```

### tsconfig.json Template

```json
{
  "extends": "../../tsconfig.json",
  "include": ["src"]
}
```

### vite.config.ts Template

```typescript
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: '../../dist/game-name',
    emptyOutDir: true,
  },
})
```

Replace `game-name` with the actual game name in both the outDir and package.json name.

## Development Workflow

**Run dev server for a specific game:**
```bash
cd packages/game-name
pnpm dev
```

**Run all dev servers in parallel:**
```bash
pnpm dev
```

**Typecheck all packages:**
```bash
pnpm typecheck
```

**Build all packages:**
```bash
pnpm build
```

## Important Rules

1. **Always run `pnpm typecheck` before committing**
2. **No `@ts-ignore` or `any` types without good reason**
3. **Keep games independent** - don't import code from other game packages
4. **All source files must start with ABOUTME comments** - two lines starting with `// ABOUTME: ` explaining what the file does
5. **Use strict TypeScript** - the config has all strict flags enabled

## Example Reference

See `packages/clicker/` for a complete working example of a simple game.
```

**Step 2: Commit CLAUDE.md**

```bash
git add CLAUDE.md
git commit -m "docs: add CLAUDE.md development guide"
```

---

## Task 6: Install Dependencies and Verify Setup

**Files:**
- None (installation and verification only)

**Step 1: Install dependencies**

Run: `pnpm install`

Expected: pnpm installs TypeScript and Vite in root, creates node_modules and pnpm-lock.yaml

**Step 2: Run typecheck**

Run: `pnpm typecheck`

Expected: TypeScript checks all packages, should pass with no errors

```
> homepage@1.0.0 typecheck /path/to/packages/homepage
> tsc --noEmit

> clicker@1.0.0 typecheck /path/to/packages/clicker
> tsc --noEmit
```

**Step 3: Run build**

Run: `pnpm build`

Expected: All packages build successfully, dist/ directory created with structure:

```
dist/
├── index.html          # Homepage
├── assets/             # Homepage assets
├── clicker/
│   ├── index.html      # Clicker game
│   └── assets/         # Clicker assets
```

**Step 4: Verify dist structure**

Run: `ls -R dist/`

Expected output showing homepage files at root and clicker in subdirectory

**Step 5: Test homepage dev server**

Run in separate terminal: `cd packages/homepage && pnpm dev`

Expected: Vite dev server starts, shows URL like `http://localhost:5173`

Visit the URL and verify homepage loads with link to clicker game

Stop the server with Ctrl+C

**Step 6: Test clicker dev server**

Run in separate terminal: `cd packages/clicker && pnpm dev`

Expected: Vite dev server starts on different port

Visit the URL and verify:
- Clicker game loads
- Button is clickable
- Score increments
- CPS updates
- Back link works (may 404 since homepage not running, that's ok)

Stop the server with Ctrl+C

**Step 7: Commit lock file**

```bash
git add pnpm-lock.yaml
git commit -m "chore: add pnpm lock file"
```

---

## Task 7: Final Verification and Documentation

**Files:**
- Modify: `README.md`

**Step 1: Update README**

Replace `README.md` content:

```markdown
# eruch.rocks

A personal website for hosting browser-based games and experiments.

## Structure

This is a pnpm workspace monorepo. Each game is an independent package built with Vite and TypeScript.

- **Homepage**: `packages/homepage/` - Landing page at root
- **Games**: `packages/*/` - Each game lives in its own package

## Development

**Install dependencies:**
```bash
pnpm install
```

**Run all dev servers:**
```bash
pnpm dev
```

**Run specific game:**
```bash
cd packages/game-name
pnpm dev
```

**Type check:**
```bash
pnpm typecheck
```

**Build for production:**
```bash
pnpm build
```

## Deployment

Built for Cloudflare Pages:
- **Build command**: `pnpm install && pnpm run build`
- **Build output directory**: `dist`
- **Node version**: 18+

## Creating New Games

See [CLAUDE.md](./CLAUDE.md) for detailed instructions on creating new games.
```

**Step 2: Run final typecheck**

Run: `pnpm typecheck`

Expected: All packages pass type checking

**Step 3: Run final build**

Run: `pnpm build`

Expected: Clean build with no errors

**Step 4: Verify git status**

Run: `git status`

Expected: Only README.md is modified, everything else committed

**Step 5: Commit README**

```bash
git add README.md
git commit -m "docs: update README with development instructions"
```

**Step 6: Final verification checklist**

Verify all these conditions:
- [ ] `pnpm install` completes successfully
- [ ] `pnpm typecheck` passes with no errors
- [ ] `pnpm build` succeeds and creates dist/ with correct structure
- [ ] Homepage dev server works and displays content
- [ ] Clicker game dev server works and game is playable
- [ ] All files committed to git
- [ ] CLAUDE.md provides clear instructions for creating new games
- [ ] README.md documents the project structure and workflow

---

## Success Criteria

The scaffold is complete when:

1. **Workspace configured**: pnpm-workspace.yaml, package.json, tsconfig.json in place
2. **Homepage works**: Builds and runs in dev mode
3. **Example game works**: Clicker game builds, runs, and is interactive
4. **Type checking passes**: All packages pass strict TypeScript checks
5. **Build succeeds**: `pnpm build` creates correct dist/ structure
6. **Documentation clear**: CLAUDE.md and README.md provide guidance
7. **All committed**: Everything checked into git with clear commit messages

## Notes

- The example game (clicker) demonstrates: user input, state management, DOM manipulation, TypeScript types
- The strict TypeScript config will catch common errors early
- Each package is independently buildable but shares base config
- The dist/ structure matches the URL structure for Cloudflare Pages
