import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function BoostPad({ position, isActive, isBig }) {
  const meshRef = useRef();
  const glowRef = useRef();

  const pos = new THREE.Vector3(position[0], position[2], -position[1]);
  const radius = isBig ? 38 : 21;
  const height = isBig ? 11 : 8;

  useFrame((state) => {
    if (meshRef.current && isActive) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 2;
    }
    if (glowRef.current && isActive) {
      const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.2 + 0.8;
      glowRef.current.scale.setScalar(1 + pulse * 0.1);
      glowRef.current.material.opacity = pulse * 0.5;
    }
  });

  return (
    <group position={pos}>
      {/* Base platform */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[radius, radius, 2, 32]} />
        <meshStandardMaterial
          color={isActive ? '#333333' : '#1a1a1a'}
          roughness={0.7}
          metalness={0.3}
        />
      </mesh>

      {/* Boost pad */}
      {isActive && (
        <>
          <mesh ref={meshRef} position={[0, height, 0]}>
            <cylinderGeometry args={[radius * 0.8, radius * 0.8, height, 32]} />
            <meshStandardMaterial
              color="#ffaa00"
              emissive="#ff8800"
              emissiveIntensity={0.5}
              roughness={0.3}
              metalness={0.7}
            />
          </mesh>

          {/* Glow effect */}
          <mesh
            ref={glowRef}
            position={[0, height, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <ringGeometry args={[radius * 0.9, radius * 1.2, 32]} />
            <meshBasicMaterial
              color="#ffaa00"
              transparent
              opacity={0.5}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Point light */}
          <pointLight
            position={[0, height, 0]}
            intensity={isBig ? 1 : 0.5}
            distance={200}
            color="#ffaa00"
          />
        </>
      )}
    </group>
  );
}

export default BoostPad;
