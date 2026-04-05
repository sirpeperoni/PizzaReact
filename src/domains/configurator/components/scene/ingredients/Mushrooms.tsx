import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { InstanceData } from './positioning';

interface MushroomsProps {
  instances: InstanceData[];
  yBase: number;
}

export const Mushrooms = ({ instances, yBase }: MushroomsProps) => {
  const groupRef = useRef<THREE.Group>(null!);
  const yRef = useRef(2.0);

  useFrame((_state, delta) => {
    yRef.current = THREE.MathUtils.lerp(yRef.current, 0, 1 - Math.exp(-8 * delta));
    if (groupRef.current) groupRef.current.position.y = yBase + yRef.current - 0.11;
  });

  return (
    <group ref={groupRef} position={[0, yBase, 0]}>
      {instances.map((inst, i) => (
        <group key={i} position={[inst.x, 0, inst.z]} rotation={[0, inst.rotation, 0]} scale={inst.scale}>
          {/* Cap */}
          <mesh position={[0, 0.09, 0]} castShadow>
            <sphereGeometry args={[0.12, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color='#8b6347' roughness={0.8} />
          </mesh>
          {/* Stem */}
          <mesh position={[0, 0.03, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.06, 0.1, 8]} />
            <meshStandardMaterial color='#c8a97a' roughness={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  );
};
