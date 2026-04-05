import type { DoughVariant } from '../../types/configurator.types';

interface PizzaBaseProps {
  dough: DoughVariant;
}

const DOUGH_CONFIG: Record<DoughVariant, { height: number; color: string; edgeColor: string }> = {
  thin: { height: 0.08, color: '#e8d5a3', edgeColor: '#c9a96e' },
  traditional: { height: 0.15, color: '#d4a43a', edgeColor: '#b8860b' },
};

export const PizzaBase = ({ dough }: PizzaBaseProps) => {
  const { height, color } = DOUGH_CONFIG[dough];

  return (
    <mesh receiveShadow castShadow>
      <cylinderGeometry args={[1.5, 1.5, height, 64]} />
      <meshStandardMaterial color={color} roughness={0.85} />
    </mesh>
  );
};
