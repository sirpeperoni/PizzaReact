import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { PizzaModel } from './PizzaModel';

const TablePlatform = () => (
  <mesh position={[0, -0.34, 0]} receiveShadow>
    <cylinderGeometry args={[2.2, 2.2, 0.08, 64]} />
    <meshStandardMaterial color='#5c3d1e' roughness={0.9} />
  </mesh>
);

export const PizzaScene = () => (
  <Canvas
    shadows
    camera={{ position: [0, 3, 5], fov: 45 }}
    style={{ height: '60vh', width: '100%', background: '#1a1a2e' }}>
    <ambientLight intensity={0.6} />
    <directionalLight
      position={[4, 6, 3]}
      intensity={1.2}
      castShadow
      shadow-mapSize-width={1024}
      shadow-mapSize-height={1024}
      shadow-camera-far={20}
      shadow-camera-left={-4}
      shadow-camera-right={4}
      shadow-camera-top={4}
      shadow-camera-bottom={-4}
    />
    <pointLight position={[-3, 2, -2]} intensity={0.8} color='#ff9955' />
    <OrbitControls
      minPolarAngle={Math.PI / 9}
      maxPolarAngle={(Math.PI * 4) / 9}
      autoRotate
      autoRotateSpeed={0.5}
      enablePan={false}
    />
    <TablePlatform />
    <PizzaModel />
  </Canvas>
);
