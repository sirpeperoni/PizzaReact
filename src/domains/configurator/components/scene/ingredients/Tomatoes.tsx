import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { InstanceData } from './positioning';

interface TomatoesProps {
  instances: InstanceData[];
  yBase: number;
}

export const Tomatoes = ({ instances, yBase }: TomatoesProps) => {
  const groupRef = useRef<THREE.Group>(null!);
  const yRef = useRef(2.0);

  useFrame((_state, delta) => {
    yRef.current = THREE.MathUtils.lerp(yRef.current, 0, 1 - Math.exp(-8 * delta));
    if (groupRef.current) groupRef.current.position.y = yBase + yRef.current- 0.115;
  });

  return (
    <group ref={groupRef} position={[0, yBase, 0]}>
      {instances.map((inst, i) => (
        <mesh key={i} position={[inst.x, 0.03, inst.z]} rotation={[0, inst.rotation, 0]} scale={[inst.scale, inst.scale * 0.5, inst.scale]} castShadow>
          <sphereGeometry args={[0.12, 12, 12]} />
          <meshStandardMaterial color='#e74c3c' roughness={0.3} metalness={0.05} />
        </mesh>
      ))}
    </group>
  );
};
