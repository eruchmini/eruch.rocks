# Ball Dodge Game

A multiplayer ball dodge game with boss battles, upgrades, and dynamic music.

## Features

- 🎮 Real-time multiplayer gameplay via WebSocket
- 👾 Epic boss battles with special attacks
- ⚡ Upgrade system (speed, multi-shot, explosions, tracking)
- 🎵 Dynamic background music and sound effects
- 💥 Particle effects and visual polish
- 🎯 Multiple ball types (tracking, bouncing, shield)

## Development

This game is part of the eruch.rocks monorepo.

**Run development server:**
```bash
cd packages/ball-dodge
pnpm dev
```

**Build for production:**
```bash
pnpm build
```

**Type check:**
```bash
pnpm typecheck
```

## Deployment

Game is deployed at: https://eruchrocks.eruchmini2.workers.dev/ball-dodge/

## Controls

- **WASD** or **Arrow Keys**: Move player
- **Mouse Click**: Shoot at cursor position
- **Music Toggle**: Toggle sound on/off

## Game Mechanics

- Dodge falling balls to survive
- Shoot balls to gain points
- Collect blue balls for shields
- Reach 500 points to trigger boss battle
- Earn upgrade points every 100 points

## Project Structure

```
src/
├── components/          # React UI components
├── game/
│   ├── classes/        # Game entity classes
│   ├── audio/          # Sound and music systems
│   ├── multiplayer/    # WebSocket multiplayer
│   ├── particles/      # Particle effect systems
│   └── constants.ts    # Game configuration
├── App.tsx             # App entry point
└── index.tsx           # React entry point
```
