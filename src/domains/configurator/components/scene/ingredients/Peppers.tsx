import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { InstanceData } from './positioning';

interface PeppersProps {
  instances: InstanceData[];
  yBase: number;
}

export const Peppers = ({ instances, yBase }: PeppersProps) => {
  const groupRef = useRef<THREE.Group>(null!);
  const yRef = useRef(2.0);

  useFrame((_state, delta) => {
    yRef.current = THREE.MathUtils.lerp(yRef.current, 0, 1 - Math.exp(-8 * delta));
    if (groupRef.current) groupRef.current.position.y = yBase + yRef.current- 0.055;
  });

  return (
    <group ref={groupRef} position={[0, yBase, 0]}>
      {instances.map((inst, i) => (
        <mesh key={i} position={[inst.x, 0.03, inst.z]} rotation={[0, inst.rotation, 0]} scale={inst.scale} castShadow>
          <boxGeometry args={[0.1, 0.06, 0.07]} />
          <meshStandardMaterial color='#27ae60' roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
};
