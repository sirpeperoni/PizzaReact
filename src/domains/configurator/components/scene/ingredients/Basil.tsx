import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { InstanceData } from './positioning';

interface BasilProps {
  instances: InstanceData[];
  yBase: number;
}

export const Basil = ({ instances, yBase }: BasilProps) => {
  const groupRef = useRef<THREE.Group>(null!);
  const yRef = useRef(2.0);

  useFrame((_state, delta) => {
    yRef.current = THREE.MathUtils.lerp(yRef.current, 0, 1 - Math.exp(-8 * delta));
    if (groupRef.current) groupRef.current.position.y = yBase + yRef.current - 0.015;
  });

  return (
    <group ref={groupRef} position={[0, yBase, 0]}>
      {instances.map((inst, i) => (
        <mesh
          key={i}
          position={[inst.x, 0.01, inst.z]}
          rotation={[0, inst.rotation, 0.1]}
          scale={[inst.scale, inst.scale * 0.2, inst.scale]}
          castShadow>
          <sphereGeometry args={[0.14, 8, 4]} />
          <meshStandardMaterial color='#2ecc71' roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
};
