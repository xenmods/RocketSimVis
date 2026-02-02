# 🚀 Quick Start Guide - RocketSimVis Web

## First Time Setup

```bash
# Install server dependencies
npm install

# Install client dependencies
cd web && npm install && cd ..
```

## Running the Visualizer

### Option 1: Development Mode (Recommended for Development)
```bash
npm run dev
```
This starts:
- WebSocket/UDP server on `http://localhost:3000`
- Vite dev server on `http://localhost:5173` (with hot reload)

**Open your browser to: http://localhost:5173**

### Option 2: Production Mode
```bash
npm start
```
This builds the client and serves it from the Node.js server.

**Open your browser to: http://localhost:3000**

## Sending Game Data

The visualizer listens for UDP data on **port 9273** (same as Python version).

### Using the Python Client Helper

If you have the existing Python visualizer setup, you can use:

```python
import rocketsimvis_rlgym_sim_client as rsv

# In your training loop
rsv.send_state_to_rocketsimvis(game_state)
```

### Manual UDP Sending

```python
import socket
import json

sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

game_state = {
    "ball_phys": {
        "pos": [0, 0, 100],
        "vel": [0, 0, 0],
        "ang_vel": [0, 0, 0]
    },
    "cars": [],
    "gamemode": "soccar"
}

sock.sendto(json.dumps(game_state).encode('utf-8'), ('127.0.0.1', 9273))
```

## What You Should See

1. **Connection Status** - Shows "LIVE" when connected
2. **3D Arena** - Full Rocket League arena with lighting
3. **Info Panel** (top-left) - FPS, game mode, ball speed, etc.
4. **Rewards Panel** (top-right) - Player rewards (if sent in data)
5. **Controls Hint** (bottom) - Interaction instructions

## Controls

- **Click** - Switch between player cameras and arena cam
- **Mouse Drag** - Rotate camera view
- **Mouse Wheel** - Zoom in/out
- **P Key** - Auto-focus on player closest to ball

## Troubleshooting

### "Waiting for Connection" Message
- Make sure the server is running (`npm run dev` or `npm start`)
- Check that game data is being sent to UDP port 9273
- Look at server console for incoming data

### Black Screen or No 3D Scene
- Check browser console (F12) for errors
- Ensure your browser supports WebGL
- Try a different browser (Chrome/Firefox recommended)

### Low FPS
- Close other browser tabs
- Check if hardware acceleration is enabled in browser
- Reduce graphics quality in browser settings

### Server Won't Start
- Make sure port 3000 and 9273 are not in use
- Run `npm install` again to ensure all dependencies are installed
- Check Node.js version (14+ required)

## Architecture

```
┌─────────────────┐
│  Your Game/Bot  │
└────────┬────────┘
         │ UDP (Port 9273)
         ▼
┌─────────────────┐
│  Node.js Server │  ← WebSocket Bridge
│  (Port 3000)    │
└────────┬────────┘
         │ WebSocket
         ▼
┌─────────────────┐
│  Web Browser    │  ← You open this
│  (localhost:    │
│   5173 or 3000) │
└─────────────────┘
```

## Next Steps

1. **Customize Graphics** - Edit `web/src/components/Scene.jsx`
2. **Change Colors** - Edit CSS files in `web/src/components/`
3. **Add Features** - Extend the React components
4. **Deploy** - Build and host on any web server

Enjoy your web-based RocketSim visualizer! 🎮✨
