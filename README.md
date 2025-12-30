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
