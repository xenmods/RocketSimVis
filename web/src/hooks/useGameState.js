import { useState, useEffect, useRef } from 'react';

export function useGameState() {
  const [gameState, setGameState] = useState({
    ball_phys: null,
    cars: [],
    boost_pad_locations: [],
    boost_pad_states: [],
    gamemode: 'soccar',
    custom_info: [],
  });
  const [connected, setConnected] = useState(false);
  const [fps, setFps] = useState(0);
  const wsRef = useRef(null);
  const lastUpdateRef = useRef(Date.now());
  const fpsCounterRef = useRef(0);

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.hostname}:3000`;

    const connectWebSocket = () => {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('✅ Connected to server');
        setConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setGameState(data);

          // Calculate FPS
          fpsCounterRef.current++;
          const now = Date.now();
          if (now - lastUpdateRef.current >= 1000) {
            setFps(fpsCounterRef.current);
            fpsCounterRef.current = 0;
            lastUpdateRef.current = now;
          }
        } catch (error) {
          console.error('Error parsing game state:', error);
        }
      };

      ws.onclose = () => {
        console.log('❌ Disconnected from server');
        setConnected(false);
        // Attempt to reconnect after 3 seconds
        setTimeout(connectWebSocket, 3000);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return { gameState, connected, fps };
}
