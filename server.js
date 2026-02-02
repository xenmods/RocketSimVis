const express = require('express');
const { WebSocketServer } = require('ws');
const dgram = require('dgram');
const path = require('path');

const app = express();
const PORT = 3000;
const UDP_PORT = 9273;

// Serve static files
app.use(express.static(path.join(__dirname, 'web/dist')));

const server = app.listen(PORT, () => {
  console.log(`🚀 RocketSimVis Web Server running on http://localhost:${PORT}`);
  console.log(`📡 Listening for UDP data on port ${UDP_PORT}`);
});

// WebSocket server
const wss = new WebSocketServer({ server });

let clients = new Set();

wss.on('connection', (ws) => {
  console.log('✅ Client connected');
  clients.add(ws);

  ws.on('close', () => {
    console.log('❌ Client disconnected');
    clients.delete(ws);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
    clients.delete(ws);
  });
});

// UDP server to receive game state
const udpServer = dgram.createSocket('udp4');

udpServer.on('message', (msg, rinfo) => {
  try {
    const data = JSON.parse(msg.toString());

    // Broadcast to all connected WebSocket clients
    clients.forEach((client) => {
      if (client.readyState === 1) { // OPEN
        client.send(JSON.stringify(data));
      }
    });
  } catch (error) {
    console.error('Error parsing UDP message:', error.message);
  }
});

udpServer.on('error', (err) => {
  console.error('UDP server error:', err);
  udpServer.close();
});

udpServer.on('listening', () => {
  const address = udpServer.address();
  console.log(`📡 UDP server listening on ${address.address}:${address.port}`);
});

udpServer.bind(UDP_PORT);

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down...');
  udpServer.close();
  server.close();
  process.exit(0);
});
