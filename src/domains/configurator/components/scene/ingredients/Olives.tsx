import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { InstanceData } from './positioning';

interface OlivesProps {
  instances: InstanceData[];
  yBase: number;
}

export const Olives = ({ instances, yBase }: OlivesProps) => {
  const groupRef = useRef<THREE.Group>(null!);
  const yRef = useRef(2.0);

  useFrame((_state, delta) => {
    yRef.current = THREE.MathUtils.lerp(yRef.current, 0, 1 - Math.exp(-8 * delta));
    if (groupRef.current) groupRef.current.position.y = yBase + yRef.current - 0.085;;
  });

  return (
    <group ref={groupRef} position={[0, yBase, 0]}>
      {instances.map((inst, i) => (
        <mesh key={i} position={[inst.x, 0.02, inst.z]} rotation={[Math.PI / 2, inst.rotation, 0]} scale={inst.scale} castShadow>
          <torusGeometry args={[0.09, 0.04, 8, 16]} />
          <meshStandardMaterial color='#2c2c2c' roughness={0.4} metalness={0.1} />
        </mesh>
      ))}
    </group>
  );
};
