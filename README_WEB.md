# RocketSimVis Web

A modern, web-based 3D visualizer for [RocketSim](https://github.com/ZealanL/RocketSim) with beautiful graphics and real-time data streaming.

![RocketSimVis Web](https://img.shields.io/badge/WebGL-3D-blue)
![React](https://img.shields.io/badge/React-18-blue)
![Three.js](https://img.shields.io/badge/Three.js-Latest-green)

## Features

- 🎮 **Real-time 3D Visualization** - Smooth, hardware-accelerated rendering using Three.js and WebGL
- 🎨 **Beautiful Graphics** - Modern UI with gradient effects, animations, and professional styling
- 📊 **Comprehensive UI** - Info panel, rewards tracking, and live statistics
- 🎥 **Dynamic Camera System** - Multiple camera modes with smooth transitions
- 🚀 **Low Latency** - WebSocket-based data streaming for real-time updates
- 📱 **Responsive Design** - Works on desktop and mobile devices
- ⚡ **High Performance** - Optimized rendering with efficient state management

## Quick Start

### Installation

```bash
# Install dependencies
npm install

# Install client dependencies
cd web && npm install && cd ..
```

### Running in Development

```bash
# Start both server and client (recommended)
npm run dev

# Or start them separately:
npm run dev:server  # Starts WebSocket/UDP server on port 3000
npm run dev:client  # Starts Vite dev server on port 5173
```

The visualizer will be available at `http://localhost:5173`

### Production Build

```bash
# Build the client
npm run build

# Run the production server
npm start
```

The server will serve the built client at `http://localhost:3000`

## How It Works

1. **UDP Server** - Listens on port `9273` for game state data (same as Python version)
2. **WebSocket Bridge** - Forwards UDP data to connected web clients in real-time
3. **React + Three.js Client** - Renders the 3D scene and UI in the browser

## Sending Data

Use the same UDP format as the Python version. Send JSON data to `localhost:9273`:

```json
{
  "ball_phys": {
    "pos": [x, y, z],
    "vel": [vx, vy, vz],
    "ang_vel": [ax, ay, az],
    "forward": [fx, fy, fz],
    "up": [ux, uy, uz]
  },
  "cars": [
    {
      "team_num": 0,
      "phys": { ... },
      "boost_amount": 50,
      "on_ground": true,
      "is_demoed": false,
      "rewards": [
        { "name": "goal", "value": 1.0 }
      ],
      "total_reward": 1.0
    }
  ],
  "boost_pad_locations": [[x, y, z], ...],
  "boost_pad_states": [true, false, ...],
  "gamemode": "soccar",
  "custom_info": [
    ["Episode", "123"],
    ["Training Step", "45678"]
  ]
}
```

## Controls

- **Left Click** - Switch between player cameras and arena cam
- **Mouse Drag** - Rotate camera (when not following a player)
- **Mouse Wheel** - Zoom in/out
- **P Key** - Focus on closest player to ball

## Architecture

```
┌─────────────────────┐
│   Game (RocketSim) │
│   Sends UDP Data    │
└──────────┬──────────┘
           │ UDP Port 9273
           ▼
┌─────────────────────┐
│   Node.js Server    │
│  • UDP Listener     │
│  • WebSocket Server │
│  • Static File Host │
└──────────┬──────────┘
           │ WebSocket
           ▼
┌─────────────────────┐
│   React Client      │
│  • Three.js Scene   │
│  • UI Components    │
│  • State Management │
└─────────────────────┘
```

## Customization

### Graphics Settings

Edit `web/src/components/Scene.jsx` to adjust:
- Lighting intensity and colors
- Shadow quality
- Camera FOV and positioning

### UI Styling

Edit CSS files in `web/src/components/` to customize:
- Colors and themes
- Panel layouts
- Animations

### Camera Behavior

Modify `web/src/components/Scene.jsx` `useFrame` hook to change:
- Follow distance
- Camera height
- Smooth following speed

## Performance Tips

- Reduce shadow quality for better performance on lower-end devices
- Adjust `maxDistance` in OrbitControls for viewport culling
- Lower the number of stars in the background

## Troubleshooting

**Connection Issues:**
- Ensure server is running on port 3000
- Check browser console for WebSocket errors
- Verify UDP port 9273 is not blocked by firewall

**Low FPS:**
- Reduce shadow quality
- Lower particle counts
- Check browser hardware acceleration is enabled

**Data Not Updating:**
- Verify game is sending to correct UDP port
- Check server console for parsing errors
- Ensure JSON format matches specification

## Comparison with Python Version

| Feature | Python | Web |
|---------|--------|-----|
| Platform | Desktop Only | Any Device with Browser |
| Setup | Python + Dependencies | Node.js Only |
| Graphics | OpenGL | WebGL |
| UI Framework | PyQt5 | React |
| Performance | Native | Near-Native |
| Distribution | Executable | URL |

## License

Same as the original RocketSimVis project.

## Credits

Built on top of [RocketSimVis](https://github.com/ZealanL/RocketSimVis) by ZealanL.

Web version uses:
- [Three.js](https://threejs.org/) - 3D rendering
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) - React renderer for Three.js
- [React Three Drei](https://github.com/pmndrs/drei) - Useful helpers for R3F
- [Vite](https://vitejs.dev/) - Build tool
