# Game Hosting Monorepo Design

## Overview

Personal website for hosting multiple browser-based games with these goals:
- Enable non-coder to build games using Claude Code from browser
- Each game in isolated subdirectory with reasonable independence
- Cloudflare Pages deployment with preview builds for PRs
- Branch protection requiring builds to pass before merge
- TypeScript everywhere with strict type checking

## Architecture: Vite + pnpm Workspaces

### Why This Approach

**Vite** provides:
- Excellent developer experience with fast HMR
- First-class TypeScript support
- Handles both vanilla TS and framework-based (React/Vue) games
- Simple mental model: each package is just a web app

**pnpm workspaces** provides:
- Efficient dependency management
- True package isolation (each game is conceptual package)
- Shared base configuration with per-package customization
- Fast installs and builds

### Alternatives Considered

**Next.js multi-zones**: Too heavy for client-side games, adds unnecessary complexity (SSR, routing abstractions)

**Custom esbuild setup**: More work upfront, harder for Claude Code to understand custom build system

**Flat structure with shared dependencies**: Less isolation, games not treated as independent packages

## Project Structure

```
eruch.rocks/
├── package.json                 # Root workspace config
├── pnpm-workspace.yaml          # Defines packages/* as workspace
├── tsconfig.json                # Shared TypeScript base config (strict mode)
├── .gitignore                   # Excludes dist/, node_modules/
├── CLAUDE.md                    # Instructions for Claude Code
├── docs/
│   └── plans/                   # Design documents
├── packages/
│   ├── homepage/                # Landing page Vite app
│   │   ├── package.json
│   │   ├── tsconfig.json        # Extends root config
│   │   ├── vite.config.ts
│   │   ├── index.html
│   │   └── src/
│   │       ├── main.ts
│   │       └── style.css
│   └── example-game/            # Example game structure
│       ├── package.json
│       ├── tsconfig.json
│       ├── vite.config.ts
│       ├── index.html
│       └── src/
│           ├── main.ts
│           └── game.ts
└── dist/                        # Build output (gitignored)
    ├── index.html               # Homepage at root
    ├── example-game/            # Games in subdirectories
    │   └── index.html
    └── future-game/
        └── index.html
```

## Build System

### Root Scripts

```json
{
  "scripts": {
    "dev": "pnpm --parallel --recursive dev",
    "build": "pnpm --recursive build",
    "typecheck": "pnpm --recursive typecheck",
    "clean": "rm -rf dist && pnpm --recursive clean"
  }
}
```

### Per-Package Build

Each package has:
- `"build": "vite build"` - outputs to `../../dist/[package-name]/`
- `"dev": "vite"` - local development server
- `"typecheck": "tsc --noEmit"` - validates types without building

Homepage package outputs to `../../dist/` (root) while games output to subdirectories.

### Deployment (Cloudflare Pages)

Manual configuration in Cloudflare dashboard:
- Build command: `pnpm install && pnpm run build`
- Build output directory: `dist`
- Node version: 18 or 20
- Preview deploys enabled for all PRs

Routing works automatically: `eruch.rocks/game-name/` serves `dist/game-name/index.html`

## TypeScript Configuration

### Root tsconfig.json (Strict Mode)

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

All strict flags enabled to catch:
- Unused variables/parameters
- Implicit any types
- Potential null/undefined access
- Missing return statements
- Missing override keywords

### Per-Package Config

```json
{
  "extends": "../../tsconfig.json",
  "include": ["src"]
}
```

Simple extension of root config with package-specific includes.

## CLAUDE.md Instructions

Guide Claude Code to:
1. Always run `pnpm typecheck` before committing
2. Understand monorepo layout and where games live
3. Follow template when creating new games
4. Use development workflow correctly
5. Avoid bypassing type safety (`@ts-ignore`, `any`)
6. Keep games independent (no cross-package dependencies)

### New Game Template

```
packages/game-name/
├── package.json       # With name, build, dev, typecheck scripts
├── tsconfig.json      # Extends root config
├── vite.config.ts     # Outputs to ../../dist/game-name/
├── index.html         # Entry point
└── src/
    └── main.ts        # Game code
```

## Initial Scaffolding

### Homepage Package
- Minimal landing page with basic styling
- Placeholder content for customization
- Links to example game

### Example Game Package
- Simple interactive game (demonstrates patterns)
- Shows vanilla TypeScript structure
- Demonstrates user input, game state, rendering loop
- Serves as reference for new games

### Root Configuration
- package.json with workspace scripts
- tsconfig.json with strict mode
- pnpm-workspace.yaml
- .gitignore (dist/, node_modules/, etc.)
- CLAUDE.md with clear instructions

## Testing Plan

Before considering scaffold complete:
1. `pnpm install` - verify workspace setup
2. `pnpm typecheck` - verify TypeScript config
3. `pnpm build` - verify all packages build
4. Check `dist/` structure (homepage at root, games in subdirectories)
5. `pnpm dev` in each package - verify dev servers work
6. Commit with clear message

## Safety Guardrails

1. **TypeScript strict mode**: Catches common errors at compile time
2. **Branch protection**: Requires builds to pass before merge
3. **Preview deploys**: See changes before merging
4. **Independent packages**: Build failures in one game don't affect others (shared deps, but isolated build configs)
5. **Clear CLAUDE.md**: Guides Claude Code to follow patterns

## Workflow Example

User asks Claude: "Make me a snake game"

Claude will:
1. Create `packages/snake/` with proper structure
2. Implement game with proper TypeScript types
3. Run `pnpm typecheck` before committing
4. Create PR with preview deploy
5. User plays with preview, merges when satisfied

Branch protection prevents merge if typecheck fails, catching errors early.
