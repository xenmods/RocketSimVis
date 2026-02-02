import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import Scene from './components/Scene';
import InfoPanel from './components/InfoPanel';
import RewardsPanel from './components/RewardsPanel';
import ConnectionStatus from './components/ConnectionStatus';
import { useGameState } from './hooks/useGameState';
import './App.css';

function App() {
  const { gameState, connected, fps } = useGameState();
  const [spectateIndex, setSpectateIndex] = useState(-1);

  const handleCanvasClick = () => {
    if (!gameState.cars || gameState.cars.length === 0) return;

    const nextIndex = spectateIndex + 1;
    setSpectateIndex(nextIndex >= gameState.cars.length ? -1 : nextIndex);
  };

  return (
    <div className="app">
      <ConnectionStatus connected={connected} />

      <Canvas
        camera={{ position: [0, -4000, 1000], fov: 75 }}
        onClick={handleCanvasClick}
        gl={{ antialias: true, alpha: false }}
        shadows
      >
        <Scene gameState={gameState} spectateIndex={spectateIndex} />
      </Canvas>

      <InfoPanel
        gameState={gameState}
        connected={connected}
        fps={fps}
        spectateIndex={spectateIndex}
      />

      {gameState.cars && gameState.cars.some(car => car.rewards && car.rewards.length > 0) && (
        <RewardsPanel
          cars={gameState.cars}
          spectateIndex={spectateIndex}
        />
      )}

      <div className="controls-hint">
        Click to switch camera • P for ball cam • Mouse to rotate
      </div>
    </div>
  );
}

export default App;
