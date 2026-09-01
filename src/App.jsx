import React, { useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import Header from './components/Header';
import airportScenario from './data/scenarios/airport.json';

const AppContent = () => {
  const { state, dispatch } = useGame();
  const [gameStarted, setGameStarted] = useState(false);

  const handleStart = () => {
    dispatch({
      type: 'LOAD_SCENARIO',
      payload: {
        scenarioId: airportScenario.scenario_id,
        data: airportScenario,
      },
    });
    setGameStarted(true);
  };

  const handleReset = () => {
    if (window.confirm('Restart the scenario?')) {
      dispatch({ type: 'RESET_GAME' });
      setGameStarted(false);
      handleStart();
    }
  };

  const handleToggleSubtitles = () => {
    dispatch({ type: 'TOGGLE_SUBTITLES' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950">
      {gameStarted && (
        <Header
          onToggleSubtitles={handleToggleSubtitles}
          onReset={handleReset}
        />
      )}
      <div className="container mx-auto px-2">
        {!gameStarted ? <StartScreen onStart={handleStart} /> : <GameScreen />}
      </div>
      <footer className="text-center text-gray-500 text-xs p-4 border-t border-white/5 mt-4">
        🇩🇪 German A1 for Pakistanis • Built with React + Vite • Deployed on GitHub Pages
      </footer>
    </div>
  );
};

function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}

export default App;
