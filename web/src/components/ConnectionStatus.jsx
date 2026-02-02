import React from 'react';
import './ConnectionStatus.css';

function ConnectionStatus({ connected }) {
  if (connected) return null;

  return (
    <div className="connection-status">
      <div className="status-icon">⚠️</div>
      <div className="status-content">
        <h3>Waiting for Connection</h3>
        <p>
          Send game data to <strong>UDP port 9273</strong> to start visualization
        </p>
        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
}

export default ConnectionStatus;
