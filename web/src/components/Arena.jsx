import React from 'react';
import * as THREE from 'three';

function Arena({ gamemode }) {
  const isHoops = gamemode === 'hoops';

  // Arena dimensions
  const width = isHoops ? 8900 / 3 : 4096;
  const length = isHoops ? 3581 : 5120;
  const height = isHoops ? 1820 : 2048;

  return (
    <group>
      {/* Floor */}
      <mesh receiveShadow position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width * 2, length * 2.5, 50, 50]} />
        <meshStandardMaterial
          color="#2c3e50"
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>

      {/* Floor grid */}
      <gridHelper
        args={[length * 2, 40, '#34495e', '#1a252f']}
        position={[0, 1, 0]}
      />

      {/* Walls */}
      <group>
        {/* Side walls */}
        <mesh position={[-width, height / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[20, height, length * 2]} />
          <meshStandardMaterial
            color="#34495e"
            roughness={0.7}
            metalness={0.3}
          />
        </mesh>
        <mesh position={[width, height / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[20, height, length * 2]} />
          <meshStandardMaterial
            color="#34495e"
            roughness={0.7}
            metalness={0.3}
          />
        </mesh>

        {/* Back walls */}
        {!isHoops && (
          <>
            <mesh position={[0, height / 2, -length]} castShadow receiveShadow>
              <boxGeometry args={[width * 2, height, 20]} />
              <meshStandardMaterial
                color="#2980b9"
                emissive="#2980b9"
                emissiveIntensity={0.2}
                roughness={0.6}
                metalness={0.4}
              />
            </mesh>
            <mesh position={[0, height / 2, length]} castShadow receiveShadow>
              <boxGeometry args={[width * 2, height, 20]} />
              <meshStandardMaterial
                color="#e67e22"
                emissive="#e67e22"
                emissiveIntensity={0.2}
                roughness={0.6}
                metalness={0.4}
              />
            </mesh>
          </>
        )}

        {/* Ceiling */}
        <mesh
          position={[0, height, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          receiveShadow
        >
          <planeGeometry args={[width * 2, length * 2]} />
          <meshStandardMaterial
            color="#1a1a1a"
            roughness={0.9}
            metalness={0.1}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* Corner lights */}
      <pointLight position={[width * 0.8, height * 0.7, length * 0.8]} intensity={0.5} color="#3498db" />
      <pointLight position={[-width * 0.8, height * 0.7, length * 0.8]} intensity={0.5} color="#3498db" />
      <pointLight position={[width * 0.8, height * 0.7, -length * 0.8]} intensity={0.5} color="#e67e22" />
      <pointLight position={[-width * 0.8, height * 0.7, -length * 0.8]} intensity={0.5} color="#e67e22" />
    </group>
  );
}

export default Arena;
