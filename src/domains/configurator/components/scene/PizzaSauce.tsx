import type { SauceVariant } from '../../types/configurator.types';

interface PizzaSauceProps {
  sauce: SauceVariant;
  yBase: number;
}

const SAUCE_COLORS: Record<SauceVariant, string> = {
  tomato: '#c0392b',
  cream: '#f0d9b5',
  pesto: '#4a7c3f',
};

export const PizzaSauce = ({ sauce, yBase }: PizzaSauceProps) => (
  <mesh position={[0, yBase, 0]} receiveShadow>
    <cylinderGeometry args={[1.35, 1.35, 0.02, 64]} />
    <meshStandardMaterial color={SAUCE_COLORS[sauce]} roughness={0.8} />
  </mesh>
);
