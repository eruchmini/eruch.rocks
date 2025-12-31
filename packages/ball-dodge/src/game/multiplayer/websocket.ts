// ABOUTME: WebSocket client for multiplayer functionality
// ABOUTME: Manages real-time communication and game state synchronization
import { GAME_CONFIG } from '../constants';
import { FallingBall } from '../classes/FallingBall';
import { NetworkBallData } from '../types';

interface BaseMessage {
  type: string;
  id: string;
}

interface RequestSyncMessage extends BaseMessage {
  type: 'request_sync';
}

interface SyncResponseMessage extends BaseMessage {
  type: 'sync_response';
  requesterId: string;
  balls: NetworkBallData[];
  gameMasterId: string;
}

interface GameMasterAnnounceMessage extends BaseMessage {
  type: 'game_master_announce';
}

interface BallSpawnMessage extends BaseMessage {
  type: 'ball_spawn';
  ball: NetworkBallData;
}

interface BallUpdateMessage extends BaseMessage {
  type: 'ball_update';
  balls: NetworkBallData[];
}

interface BallDestroyMessage extends BaseMessage {
  type: 'ball_destroy';
  ballId: string;
}

interface PositionMessage extends BaseMessage {
  type: 'position';
  x: number;
  y: number;
  hasShield: boolean;
}

interface BlastMessage extends BaseMessage {
  type: 'blast';
  x: number;
  y: number;
  angle: number;
}

interface PlayerDiedMessage extends BaseMessage {
  type: 'player_died';
}

type NetworkMessage =
  | RequestSyncMessage
  | SyncResponseMessage
  | GameMasterAnnounceMessage
  | BallSpawnMessage
  | BallUpdateMessage
  | BallDestroyMessage
  | PositionMessage
  | BlastMessage
  | PlayerDiedMessage;

interface OtherPlayer {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  hasShield: boolean;
  lastUpdate: number;
}

export class MultiplayerManager {
  ws: WebSocket | null;
  playerIdRef: { current: string };
  isGameMasterRef: { current: boolean };
  gameMasterIdRef: { current: string | null };
  ballsRef: { current: FallingBall[] };
  otherPlayersRef: { current: Record<string, OtherPlayer> };
  otherBlastsRef: { current: Array<{ x: number; y: number; angle: number; radius: number; speed: number; ownerId: string; createdAt: number }> };
  canvas: HTMLCanvasElement;
  setIsGameMaster: (value: boolean) => void;
  syncTimeoutRef: { current: ReturnType<typeof setTimeout> | null };

  constructor(
    playerIdRef: { current: string },
    isGameMasterRef: { current: boolean },
    gameMasterIdRef: { current: string | null },
    ballsRef: { current: FallingBall[] },
    otherPlayersRef: { current: Record<string, OtherPlayer> },
    otherBlastsRef: { current: Array<{ x: number; y: number; angle: number; radius: number; speed: number; ownerId: string; createdAt: number }> },
    canvas: HTMLCanvasElement,
    setIsGameMaster: (value: boolean) => void
  ) {
    this.ws = null;
    this.playerIdRef = playerIdRef;
    this.isGameMasterRef = isGameMasterRef;
    this.gameMasterIdRef = gameMasterIdRef;
    this.ballsRef = ballsRef;
    this.otherPlayersRef = otherPlayersRef;
    this.otherBlastsRef = otherBlastsRef;
    this.canvas = canvas;
    this.setIsGameMaster = setIsGameMaster;
    this.syncTimeoutRef = { current: null };
  }

  connect(): void {
    try {
      this.ws = new WebSocket(GAME_CONFIG.MULTIPLAYER.WS_URL);

      this.ws.onopen = () => {
        console.log('Connected to multiplayer server!');

        // Request game sync
        this.send({
          type: 'request_sync',
          id: this.playerIdRef.current
        });

        // If no one responds within timeout, become game master
        this.syncTimeoutRef.current = setTimeout(() => {
          console.log('No game master found, becoming game master!');
          this.isGameMasterRef.current = true;
          this.setIsGameMaster(true);
          this.gameMasterIdRef.current = this.playerIdRef.current;

          // Announce we're the game master
          this.send({
            type: 'game_master_announce',
            id: this.playerIdRef.current
          });
        }, GAME_CONFIG.MULTIPLAYER.SYNC_TIMEOUT);
      };

      this.ws.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);

          // Ignore our own messages
          if (data.id === this.playerIdRef.current) return;

          this.handleMessage(data);
        } catch (err) {
          console.error('Error parsing message:', err);
        }
      };

      this.ws.onerror = (err) => {
        console.log('WebSocket error (may be sandboxed):', err);
      };

      this.ws.onclose = () => {
        console.log('Disconnected from multiplayer server');
      };
    } catch (err) {
      console.log('Could not connect to multiplayer (sandboxed environment)');
      // If we can't connect, become game master by default
      this.isGameMasterRef.current = true;
      this.setIsGameMaster(true);
      this.gameMasterIdRef.current = this.playerIdRef.current;
    }
  }

  handleMessage(data: NetworkMessage): void {
    switch (data.type) {
      case 'request_sync':
        this.handleRequestSync(data);
        break;

      case 'sync_response':
        this.handleSyncResponse(data);
        break;

      case 'game_master_announce':
        this.handleGameMasterAnnounce(data);
        break;

      case 'ball_spawn':
        this.handleBallSpawn(data);
        break;

      case 'ball_update':
        this.handleBallUpdate(data);
        break;

      case 'ball_destroy':
        this.handleBallDestroy(data);
        break;

      case 'position':
        this.handlePosition(data);
        break;

      case 'blast':
        this.handleBlast(data);
        break;

      case 'player_died':
        this.handlePlayerDied(data);
        break;
    }
  }

  handleRequestSync(data: RequestSyncMessage): void {
    // Someone is asking for sync, if we're game master, send them the state
    if (this.isGameMasterRef.current) {
      this.send({
        type: 'sync_response',
        id: this.playerIdRef.current,
        requesterId: data.id,
        balls: this.ballsRef.current.map(ball => ball.toNetworkData()),
        gameMasterId: this.playerIdRef.current
      });
    }
  }

  handleSyncResponse(data: SyncResponseMessage): void {
    // Only process if this sync is for us
    if (data.requesterId === this.playerIdRef.current) {
      console.log('Received game state from game master:', data.id);
      if (this.syncTimeoutRef.current) {
        clearTimeout(this.syncTimeoutRef.current);
      }
      this.isGameMasterRef.current = false;
      this.setIsGameMaster(false);
      this.gameMasterIdRef.current = data.gameMasterId;

      // Sync balls
      this.ballsRef.current = data.balls.map((ballData: NetworkBallData) =>
        FallingBall.fromNetworkData(ballData, this.canvas)
      );
    }
  }

  handleGameMasterAnnounce(data: GameMasterAnnounceMessage): void {
    this.gameMasterIdRef.current = data.id;
    if (this.syncTimeoutRef.current) {
      clearTimeout(this.syncTimeoutRef.current);
    }
  }

  handleBallSpawn(data: BallSpawnMessage): void {
    // Only clients should process this
    if (!this.isGameMasterRef.current) {
      const ball = FallingBall.fromNetworkData(data.ball, this.canvas);
      this.ballsRef.current.push(ball);
    }
  }

  handleBallUpdate(data: BallUpdateMessage): void {
    // Only clients should process this
    if (!this.isGameMasterRef.current) {
      data.balls.forEach((ballData: NetworkBallData) => {
        const ball = this.ballsRef.current.find((b: FallingBall) => b.id === ballData.id);
        if (ball) {
          // Store server position as target for smooth interpolation
          if (!ball.serverX) {
            // First update - initialize
            ball.serverX = ballData.x;
            ball.serverY = ballData.y;
            ball.x = ballData.x;
            ball.y = ballData.y;
          } else {
            // Update target position
            ball.serverX = ballData.x;
            ball.serverY = ballData.y;
          }

          // Update velocities for dead reckoning
          ball.vx = ballData.vx;
          ball.vy = ballData.vy;

          // Store timestamp for interpolation
          (ball as FallingBall & { lastServerUpdate?: number }).lastServerUpdate = Date.now();
        }
      });
    }
  }

  handleBallDestroy(data: BallDestroyMessage): void {
    // Remove ball by ID
    const index = this.ballsRef.current.findIndex((b: FallingBall) => b.id === data.ballId);
    if (index !== -1) {
      this.ballsRef.current.splice(index, 1);
    }
  }

  handlePosition(data: PositionMessage): void {
    const existing = this.otherPlayersRef.current[data.id];

    // If player doesn't exist yet, initialize with direct position
    if (!existing) {
      this.otherPlayersRef.current[data.id] = {
        x: data.x,
        y: data.y,
        targetX: data.x,
        targetY: data.y,
        hasShield: data.hasShield,
        lastUpdate: Date.now()
      };
    } else {
      // Update target position for interpolation
      this.otherPlayersRef.current[data.id] = {
        ...existing,
        targetX: data.x,
        targetY: data.y,
        hasShield: data.hasShield,
        lastUpdate: Date.now()
      };
    }
  }

  handleBlast(data: BlastMessage): void {
    this.otherBlastsRef.current.push({
      x: data.x,
      y: data.y,
      angle: data.angle,
      radius: GAME_CONFIG.BLAST.RADIUS,
      speed: GAME_CONFIG.BLAST.SPEED,
      ownerId: data.id,
      createdAt: Date.now()
    });
  }

  handlePlayerDied(data: PlayerDiedMessage): void {
    delete this.otherPlayersRef.current[data.id];

    // If game master died, assign new game master
    if (data.id === this.gameMasterIdRef.current) {
      const remainingPlayers = Object.keys(this.otherPlayersRef.current);
      if (remainingPlayers.length > 0) {
        // Someone else becomes game master
        this.gameMasterIdRef.current = remainingPlayers[0] || null;
      } else {
        // We become game master
        this.isGameMasterRef.current = true;
        this.setIsGameMaster(true);
        this.gameMasterIdRef.current = this.playerIdRef.current;
        console.log('Previous game master left, we are now game master!');
      }
    }
  }

  send(data: Record<string, unknown>): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  broadcastPosition(x: number, y: number, hasShield: boolean): void {
    this.send({
      type: 'position',
      id: this.playerIdRef.current,
      x,
      y,
      hasShield
    });
  }

  broadcastBlast(x: number, y: number, angle: number): void {
    this.send({
      type: 'blast',
      id: this.playerIdRef.current,
      x,
      y,
      angle
    });
  }

  broadcastBallSpawn(ball: FallingBall): void {
    this.send({
      type: 'ball_spawn',
      id: this.playerIdRef.current,
      ball: ball.toNetworkData()
    });
  }

  broadcastBallUpdate(balls: FallingBall[]): void {
    this.send({
      type: 'ball_update',
      id: this.playerIdRef.current,
      balls: balls.map((ball: FallingBall) => ({
        id: ball.id,
        x: ball.x,
        y: ball.y,
        vx: ball.vx,
        vy: ball.vy
      }))
    });
  }

  broadcastBallDestroy(ballId: string): void {
    this.send({
      type: 'ball_destroy',
      id: this.playerIdRef.current,
      ballId
    });
  }

  broadcastPlayerDied(): void {
    this.send({
      type: 'player_died',
      id: this.playerIdRef.current
    });
  }

  disconnect(): void {
    if (this.syncTimeoutRef.current) {
      clearTimeout(this.syncTimeoutRef.current);
    }
    if (this.ws) {
      this.ws.close();
    }
  }

  isConnected(): boolean {
    return !!(this.ws && this.ws.readyState === WebSocket.OPEN);
  }
}
