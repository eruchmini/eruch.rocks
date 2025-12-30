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
