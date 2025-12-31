// ABOUTME: Shared type definitions for game entities
// ABOUTME: Defines interfaces for player, explosions, particles, and other game objects

export interface Player {
  x: number;
  y: number;
  radius: number;
  speed: number;
}

export interface Explosion {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  growSpeed: number;
  active: boolean;
}

export interface ImpactParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  spawnTime: number;
  life: number;
  isFlash?: boolean;
}

export interface DangerZone {
  x: number;
  y: number;
  radius: number;
  spawnTime: number;
  warningTime: number;
}

export interface MuzzleFlash {
  x: number;
  y: number;
  angle: number;
  spawnTime: number;
}

export interface SmokeParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  spawnTime: number;
  life: number;
}

export interface Blast {
  x: number;
  y: number;
  angle: number;
  radius: number;
  speed: number;
  spawnTime: number;
  tracking: boolean;
  ownerId: string;
}

export interface OtherBlast {
  x: number;
  y: number;
  angle: number;
  radius: number;
  speed: number;
  ownerId: string;
  createdAt: number;
}

export interface Powerup {
  x: number;
  y: number;
  type: string;
  radius: number;
  speed: number;
}

export interface ActivePowerup {
  type: string;
  endTime: number;
}

export interface NetworkBallData {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius?: number;
  speed: number;
  isShield: boolean;
  isTracking: boolean;
  isBouncing: boolean;
  isPurple: boolean;
  bounceCount: number;
}
