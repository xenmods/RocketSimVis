import React from 'react';
import './RewardsPanel.css';

function RewardsPanel({ cars, spectateIndex }) {
  const playersToShow =
    spectateIndex >= 0 && cars[spectateIndex]
      ? [cars[spectateIndex]]
      : cars.filter(car => car.rewards && car.rewards.length > 0);

  if (playersToShow.length === 0) return null;

  return (
    <div className="rewards-panel fade-in">
      <div className="rewards-header">
        <h3>Player Rewards</h3>
        <span className="rewards-subtitle">Instant & Cumulative</span>
      </div>

      <div className="rewards-content">
        {playersToShow.map((car, idx) => (
          <PlayerRewards key={idx} car={car} />
        ))}
      </div>
    </div>
  );
}

function PlayerRewards({ car }) {
  const teamName = car.team_num === 0 ? 'Blue' : 'Orange';
  const teamClass = car.team_num === 0 ? 'team-blue' : 'team-orange';

  // Calculate cumulative rewards
  const cumulativeRewards = {};
  let cumulativeTotal = 0;

  if (car.cumulative_rewards) {
    Object.entries(car.cumulative_rewards).forEach(([name, value]) => {
      cumulativeRewards[name] = value;
      cumulativeTotal += value;
    });
  }

  // Calculate instant total
  const instantTotal = car.total_reward || 0;

  // Get max absolute values for scaling
  const maxAbsInstant = Math.max(
    0.1,
    ...car.rewards.map(r => Math.abs(r.value))
  );
  const maxAbsCumulative = Math.max(
    0.1,
    ...Object.values(cumulativeRewards).map(v => Math.abs(v))
  );

  return (
    <div className="player-rewards">
      <div className={`player-header ${teamClass}`}>
        <span className="player-name">
          Player {car.car_id !== undefined ? car.car_id : '?'} ({teamName})
        </span>
      </div>

      <div className="totals-row">
        <div className="total-item">
          <span className="total-label">Instant:</span>
          <span className={`total-value ${instantTotal >= 0 ? 'positive' : 'negative'}`}>
            {instantTotal >= 0 ? '+' : ''}{instantTotal.toFixed(3)}
          </span>
        </div>
        <div className="total-item">
          <span className="total-label">Episode:</span>
          <span className={`total-value ${cumulativeTotal >= 0 ? 'positive' : 'negative'}`}>
            {cumulativeTotal >= 0 ? '+' : ''}{cumulativeTotal.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="rewards-list">
        {car.rewards.map((reward, idx) => {
          const cumulativeValue = cumulativeRewards[reward.name] || 0;
          return (
            <RewardBar
              key={idx}
              name={reward.name}
              instantValue={reward.value}
              cumulativeValue={cumulativeValue}
              maxAbsInstant={maxAbsInstant}
              maxAbsCumulative={maxAbsCumulative}
            />
          );
        })}
      </div>
    </div>
  );
}

function RewardBar({ name, instantValue, cumulativeValue, maxAbsInstant, maxAbsCumulative }) {
  const instantPercent = (instantValue / maxAbsInstant) * 100;
  const cumulativePercent = (cumulativeValue / maxAbsCumulative) * 100;

  return (
    <div className="reward-bar">
      <div className="reward-name">{name}</div>

      <div className="reward-bars">
        {/* Instant bar */}
        <div className="bar-container">
          <div className="bar-center-line"></div>
          <div
            className={`bar-fill instant ${instantValue >= 0 ? 'positive' : 'negative'}`}
            style={{
              width: `${Math.abs(instantPercent)}%`,
              [instantValue >= 0 ? 'left' : 'right']: '50%',
            }}
          />
          <span className="bar-value instant">
            {instantValue >= 0 ? '+' : ''}{instantValue.toFixed(3)}
          </span>
        </div>

        {/* Cumulative bar */}
        <div className="bar-container">
          <div className="bar-center-line"></div>
          <div
            className={`bar-fill cumulative ${cumulativeValue >= 0 ? 'positive' : 'negative'}`}
            style={{
              width: `${Math.abs(cumulativePercent)}%`,
              [cumulativeValue >= 0 ? 'left' : 'right']: '50%',
            }}
          />
          <span className="bar-value cumulative">
            {cumulativeValue >= 0 ? '+' : ''}{cumulativeValue.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default RewardsPanel;
