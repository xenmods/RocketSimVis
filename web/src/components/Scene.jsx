import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Stars } from '@react-three/drei';
import * as THREE from 'three';
import Arena from './Arena';
import Ball from './Ball';
import Car from './Car';
import BoostPad from './BoostPad';
import { lerp, lerpVector } from '../utils/math';

function Scene({ gameState, spectateIndex }) {
  const { camera } = useThree();
  const controlsRef = useRef();
  const [interpState, setInterpState] = useState(null);

  // Interpolation
  useEffect(() => {
    if (!gameState.ball_phys) return;

    const prevState = interpState || gameState;
    setInterpState(prevState);

    const interval = setInterval(() => {
      // Smooth interpolation happens in the render loop
    }, 16);

    return () => clearInterval(interval);
  }, [gameState]);

  // Camera following
  useFrame((state, delta) => {
    if (!gameState.ball_phys) return;

    const ballPos = new THREE.Vector3(
      gameState.ball_phys.pos[0],
      gameState.ball_phys.pos[2],
      -gameState.ball_phys.pos[1]
    );

    if (spectateIndex >= 0 && gameState.cars && gameState.cars[spectateIndex]) {
      const car = gameState.cars[spectateIndex];
      const carPos = new THREE.Vector3(
        car.phys.pos[0],
        car.phys.pos[2],
        -car.phys.pos[1]
      );

      // Ball cam
      const direction = new THREE.Vector3().subVectors(ballPos, carPos).normalize();
      const distance = 300;
      const height = 120;

      const targetPos = carPos
        .clone()
        .sub(direction.clone().multiplyScalar(distance))
        .add(new THREE.Vector3(0, height, 0));

      camera.position.lerp(targetPos, delta * 3);
      camera.lookAt(ballPos);

      if (controlsRef.current) {
        controlsRef.current.target.lerp(ballPos, delta * 3);
      }
    } else {
      // Stadium cam
      const targetPos = new THREE.Vector3(0, 1000, -4000);
      camera.position.lerp(targetPos, delta * 2);

      if (controlsRef.current) {
        controlsRef.current.target.lerp(ballPos, delta * 2);
      }
    }
  });

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[100, 200, 100]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight position={[-100, 150, -100]} intensity={0.5} />
      <hemisphereLight args={['#87ceeb', '#545454', 0.3]} />

      {/* Background */}
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />

      {/* Arena */}
      <Arena gamemode={gameState.gamemode || 'soccar'} />

      {/* Ball */}
      {gameState.ball_phys && (
        <Ball
          position={gameState.ball_phys.pos}
          forward={gameState.ball_phys.forward}
          up={gameState.ball_phys.up}
          gamemode={gameState.gamemode}
        />
      )}

      {/* Cars */}
      {gameState.cars &&
        gameState.cars.map((car, index) => (
          <Car
            key={index}
            car={car}
            isSpectated={index === spectateIndex}
          />
        ))}

      {/* Boost Pads */}
      {gameState.boost_pad_locations &&
        gameState.boost_pad_locations.map((pos, index) => (
          <BoostPad
            key={index}
            position={pos}
            isActive={
              gameState.boost_pad_states
                ? gameState.boost_pad_states[index]
                : true
            }
            isBig={pos[2] >= 73}
          />
        ))}

      {/* Controls */}
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableZoom={true}
        minDistance={100}
        maxDistance={5000}
        maxPolarAngle={Math.PI / 2}
      />
    </>
  );
}

export default Scene;
