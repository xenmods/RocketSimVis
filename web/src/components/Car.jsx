import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Car({ car, isSpectated }) {
  const meshRef = useRef();
  const boostTrailRef = useRef([]);

  const isBlue = car.team_num === 0;
  const color = isBlue ? '#3498db' : '#e67e22';
  const emissiveColor = isBlue ? '#2980b9' : '#d35400';

  // Convert position
  const pos = new THREE.Vector3(
    car.phys.pos[0],
    car.phys.pos[2],
    -car.phys.pos[1]
  );

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.lerp(pos, 0.3);

      // Rotation
      if (car.phys.forward && car.phys.up) {
        const fwd = new THREE.Vector3(
          car.phys.forward[0],
          car.phys.forward[2],
          -car.phys.forward[1]
        );
        const upVec = new THREE.Vector3(
          car.phys.up[0],
          car.phys.up[2],
          -car.phys.up[1]
        );
        const right = new THREE.Vector3().crossVectors(upVec, fwd);

        const matrix = new THREE.Matrix4();
        matrix.makeBasis(fwd, right, upVec);
        meshRef.current.quaternion.setFromRotationMatrix(matrix);
      }
    }
  });

  if (car.is_demoed) {
    return null;
  }

  return (
    <group ref={meshRef}>
      {/* Car body - Octane style */}
      <group>
        {/* Main body */}
        <mesh castShadow>
          <boxGeometry args={[118, 36, 84]} />
          <meshStandardMaterial
            color={color}
            emissive={emissiveColor}
            emissiveIntensity={car.boost_amount > 0 ? 0.3 : 0.1}
            roughness={0.3}
            metalness={0.7}
          />
        </mesh>

        {/* Roof */}
        <mesh position={[10, 20, 0]} castShadow>
          <boxGeometry args={[60, 20, 80]} />
          <meshStandardMaterial
            color={color}
            emissive={emissiveColor}
            emissiveIntensity={car.boost_amount > 0 ? 0.3 : 0.1}
            roughness={0.3}
            metalness={0.7}
          />
        </mesh>

        {/* Wheels */}
        {[
          [40, -15, 30],
          [40, -15, -30],
          [-40, -15, 30],
          [-40, -15, -30],
        ].map((wheelPos, i) => (
          <mesh key={i} position={wheelPos} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[12, 12, 10, 16]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
          </mesh>
        ))}

        {/* Boost flames */}
        {car.boost_amount > 0 && car.is_boosting && (
          <group position={[-60, 0, 0]}>
            <mesh>
              <coneGeometry args={[15, 40, 8]} />
              <meshBasicMaterial
                color="#ffaa00"
                transparent
                opacity={0.8}
              />
            </mesh>
            <pointLight intensity={1} distance={200} color="#ffaa00" />
          </group>
        )}

        {/* Spectate highlight */}
        {isSpectated && (
          <mesh scale={1.3}>
            <boxGeometry args={[118, 36, 84]} />
            <meshBasicMaterial
              color="#ffffff"
              transparent
              opacity={0.2}
              wireframe
            />
          </mesh>
        )}
      </group>

      {/* Boost meter indicator */}
      {car.boost_amount > 0 && (
        <sprite position={[0, 60, 0]} scale={[car.boost_amount * 0.8, 8, 1]}>
          <spriteMaterial
            color={car.boost_amount > 50 ? '#ffaa00' : '#ff4444'}
            transparent
            opacity={0.7}
          />
        </sprite>
      )}
    </group>
  );
}

export default Car;
