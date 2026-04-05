interface PizzaCheeseProps {
  amount: number;
  yBase: number;
}

export const PizzaCheese = ({ amount, yBase }: PizzaCheeseProps) => {
  const height = 0.01 + (amount / 100) * 0.08;
  const opacity = 0.3 + (amount / 100) * 0.7;
  const roughness = 1.0 - (amount / 100) * 0.6;

  return (
    <mesh position={[0, yBase, 0]}>
      <cylinderGeometry args={[1.3, 1.3, height, 64]} />
      <meshStandardMaterial color='#f4d03f' roughness={roughness} transparent opacity={opacity} />
    </mesh>
  );
};
