import React from 'react';
import './InfoPanel.css';

function InfoPanel({ gameState, connected, fps, spectateIndex }) {
  const blueCount = gameState.cars?.filter(car => car.team_num === 0).length || 0;
  const orangeCount = gameState.cars?.filter(car => car.team_num === 1).length || 0;

  const ballSpeed =
    gameState.ball_phys?.vel
      ? Math.sqrt(
          gameState.ball_phys.vel[0] ** 2 +
            gameState.ball_phys.vel[1] ** 2 +
            gameState.ball_phys.vel[2] ** 2
        ) *
        (9 / 250)
      : 0;

  return (
    <div className="info-panel fade-in">
      <div className="info-header">
        <h2>RocketSimVis Web</h2>
        <div className={`status-indicator ${connected ? 'connected' : 'disconnected'}`}>
          <div className="pulse"></div>
          {connected ? 'LIVE' : 'OFFLINE'}
        </div>
      </div>

      <div className="info-content">
        <div className="info-item">
          <span className="label">Render FPS:</span>
          <span className="value">{fps}</span>
        </div>

        <div className="info-item">
          <span className="label">Game Mode:</span>
          <span className="value">
            {gameState.gamemode?.replace('_', ' ').toUpperCase() || 'N/A'}
          </span>
        </div>

        {(blueCount > 0 || orangeCount > 0) && (
          <div className="info-item">
            <span className="label">Match:</span>
            <span className="value">
              <span className="team-blue">{blueCount}</span>
              {' vs '}
              <span className="team-orange">{orangeCount}</span>
            </span>
          </div>
        )}

        <div className="info-item">
          <span className="label">Ball Speed:</span>
          <span className="value">{ballSpeed.toFixed(0)} km/h</span>
        </div>

        {spectateIndex >= 0 && (
          <div className="info-item">
            <span className="label">Spectating:</span>
            <span className="value">Player {spectateIndex}</span>
          </div>
        )}

        {gameState.custom_info?.map(([key, value], index) => (
          <div key={index} className="info-item">
            <span className="label">{key}:</span>
            <span className="value">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default InfoPanel;
