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
