#!/usr/bin/env python3
"""Test script to send sample data to RocketSimVis Web"""

import socket
import json
import time
import math

UDP_IP = "127.0.0.1"
UDP_PORT = 9273

sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

def send_test_data():
    """Send test game state data"""
    t = time.time()
    
    # Moving ball in a circle
    ball_x = math.cos(t) * 1000
    ball_y = math.sin(t) * 1000
    ball_z = 200 + math.sin(t * 2) * 100
    
    game_state = {
        "ball_phys": {
            "pos": [ball_x, ball_y, ball_z],
            "vel": [-math.sin(t) * 500, math.cos(t) * 500, math.cos(t * 2) * 200],
            "ang_vel": [1, 2, 3],
            "forward": [1, 0, 0],
            "up": [0, 0, 1]
        },
        "cars": [
            {
                "team_num": 0,
                "phys": {
                    "pos": [ball_x - 300, ball_y - 300, 20],
                    "vel": [0, 0, 0],
                    "ang_vel": [0, 0, 0],
                    "forward": [1, 0, 0],
                    "up": [0, 0, 1]
                },
                "boost_amount": 50 + math.sin(t) * 50,
                "on_ground": True,
                "is_demoed": False,
                "is_boosting": math.sin(t) > 0,
                "rewards": [
                    {"name": "ball_touch", "value": 0.1},
                    {"name": "goal_distance", "value": -0.05}
                ],
                "total_reward": 0.05
            },
            {
                "team_num": 1,
                "phys": {
                    "pos": [ball_x + 300, ball_y + 300, 20],
                    "vel": [0, 0, 0],
                    "ang_vel": [0, 0, 0],
                    "forward": [-1, 0, 0],
                    "up": [0, 0, 1]
                },
                "boost_amount": 75,
                "on_ground": True,
                "is_demoed": False,
                "is_boosting": False,
                "rewards": [
                    {"name": "ball_touch", "value": 0.2},
                    {"name": "goal_distance", "value": -0.03}
                ],
                "total_reward": 0.17
            }
        ],
        "boost_pad_locations": [
            [0, -4240, 70], [-1792, -4184, 70], [1792, -4184, 70],
            [-3072, -4096, 73], [3072, -4096, 73]
        ],
        "boost_pad_states": [True, False, True, True, False],
        "gamemode": "soccar",
        "custom_info": [
            ["Episode", "42"],
            ["Step", str(int(t * 10))],
            ["Test Mode", "Active"]
        ]
    }
    
    sock.sendto(json.dumps(game_state).encode('utf-8'), (UDP_IP, UDP_PORT))

if __name__ == "__main__":
    print("🎮 Sending test data to RocketSimVis Web...")
    print(f"📡 Target: {UDP_IP}:{UDP_PORT}")
    print("Press Ctrl+C to stop\n")
    
    try:
        while True:
            send_test_data()
            time.sleep(0.016)  # ~60 FPS
    except KeyboardInterrupt:
        print("\n✅ Test stopped")
