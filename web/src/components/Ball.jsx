import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Ball({ position, forward, up, gamemode }) {
  const meshRef = useRef();
  const trailRef = useRef([]);
  const isPuck = gamemode === 'snowday';

  // Ball/puck dimensions
  const radius = isPuck ? 114.25 : 91.25;
  const height = isPuck ? 62.5 : null;

  // Convert position from RocketSim coordinates to Three.js
  const pos = new THREE.Vector3(position[0], position[2], -position[1]);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.lerp(pos, 0.3);

      // Rotation based on forward/up if provided
      if (forward && up) {
        const fwd = new THREE.Vector3(forward[0], forward[2], -forward[1]);
        const upVec = new THREE.Vector3(up[0], up[2], -up[1]);
        const right = new THREE.Vector3().crossVectors(upVec, fwd);

        const matrix = new THREE.Matrix4();
        matrix.makeBasis(fwd, right, upVec);
        meshRef.current.quaternion.setFromRotationMatrix(matrix);
      }
    }
  });

  return (
    <group ref={meshRef}>
      {/* Main ball/puck */}
      <mesh castShadow>
        {isPuck ? (
          <cylinderGeometry args={[radius, radius, height, 32]} />
        ) : (
          <sphereGeometry args={[radius, 32, 32]} />
        )}
        <meshStandardMaterial
          color={isPuck ? '#ffffff' : '#ff6b35'}
          emissive={isPuck ? '#cccccc' : '#ff4500'}
          emissiveIntensity={0.3}
          roughness={0.4}
          metalness={0.6}
        />
      </mesh>

      {/* Glow effect */}
      <mesh scale={1.2}>
        {isPuck ? (
          <cylinderGeometry args={[radius, radius, height, 32]} />
        ) : (
          <sphereGeometry args={[radius, 32, 32]} />
        )}
        <meshBasicMaterial
          color={isPuck ? '#88ccff' : '#ff8c00'}
          transparent
          opacity={0.15}
        />
      </mesh>

      {/* Ground circle indicator */}
      {pos.y > 100 && (
        <mesh position={[0, -pos.y + 5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius * 0.9, radius * 1.1, 32]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.4} />
        </mesh>
      )}

      {/* Point light for ball glow */}
      <pointLight
        intensity={0.5}
        distance={500}
        color={isPuck ? '#88ccff' : '#ff8c00'}
      />
    </group>
  );
}

export default Ball;
