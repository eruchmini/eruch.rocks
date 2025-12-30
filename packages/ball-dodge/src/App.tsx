// ABOUTME: Main application component managing game state
// ABOUTME: Orchestrates game UI and component composition
import React from 'react';
import BallDodgeGame from './components/BallDodgeGame';
import './index.css';

function App(): React.ReactElement {
  return <BallDodgeGame />;
}

export default App;
