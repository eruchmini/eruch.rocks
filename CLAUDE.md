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

## Deployment

The main branch deploys to: **https://eruchrocks.eruchmini2.workers.dev**

Cloudflare Pages is configured via `wrangler.jsonc`:
- Build command: `pnpm install && pnpm run build`
- Build output directory: `dist`
- Static assets are served from the `dist/` directory

Each PR gets a preview deployment for testing before merge.

## Development vs Production

**Important:** In development mode, each package runs its own dev server on different ports:
- Homepage: `http://localhost:5173`
- Clicker: `http://localhost:5174`

This means links between packages (like `/clicker/`) won't work in dev mode. You must test the production build to verify routing works correctly.

To test the production build locally:
```bash
pnpm build
# Then serve the dist/ directory with any static file server
```

## Example Reference

See `packages/clicker/` for a complete working example of a simple game.
