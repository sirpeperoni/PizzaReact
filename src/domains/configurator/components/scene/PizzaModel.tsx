import { useMemo } from 'react';
import { useConfiguratorStore } from '../../stores/configuratorStore';
import { PizzaBase } from './PizzaBase';
import { PizzaSauce } from './PizzaSauce';
import { PizzaCheese } from './PizzaCheese';
import { Pepperoni } from './ingredients/Pepperoni';
import { Mushrooms } from './ingredients/Mushrooms';
import { Olives } from './ingredients/Olives';
import { Peppers } from './ingredients/Peppers';
import { Tomatoes } from './ingredients/Tomatoes';
import { Basil } from './ingredients/Basil';
import { generateInstances } from './ingredients/positioning';
import type { PizzaSize } from '../../types/configurator.types';

const SIZE_SCALES: Record<PizzaSize, number> = {
  small: 0.85,
  medium: 1.0,
  large: 1.2,
};

export const PizzaModel = () => {
  const { dough, sauce, cheeseAmount, ingredients, size } = useConfiguratorStore();

  const doughH = dough === 'thin' ? 0.08 : 0.15;
  const cheeseH = 0.01 + (cheeseAmount / 100) * 0.08;
  const sauceY = doughH / 2 + 0.01;
  const cheeseY = doughH / 2 + 0.02 + cheeseH / 2;
  const ingredientY = doughH / 2 + 0.02 + cheeseH + 0.01;

  const pepperoniInst = useMemo(() => generateInstances('pepperoni'), []);
  const mushroomsInst = useMemo(() => generateInstances('mushrooms'), []);
  const olivesInst = useMemo(() => generateInstances('olives'), []);
  const peppersInst = useMemo(() => generateInstances('peppers'), []);
  const tomatoesInst = useMemo(() => generateInstances('tomatoes'), []);
  const basilInst = useMemo(() => generateInstances('basil'), []);
  
  return (
    <group scale={SIZE_SCALES[size]}>
      <PizzaBase dough={dough} />
      <PizzaSauce sauce={sauce} yBase={sauceY} />
      <PizzaCheese amount={cheeseAmount} yBase={cheeseY} />
      {ingredients.pepperoni && <Pepperoni instances={pepperoniInst} yBase={ingredientY + 0.013} />}
      {ingredients.mushrooms && <Mushrooms instances={mushroomsInst} yBase={ingredientY + 0.02} />}
      {ingredients.olives && <Olives instances={olivesInst} yBase={ingredientY + 0.04} />}
      {ingredients.peppers && <Peppers instances={peppersInst} yBase={ingredientY + 0.03} />}
      {ingredients.tomatoes && <Tomatoes instances={tomatoesInst} yBase={ingredientY + 0.06} />}
      {ingredients.basil && <Basil instances={basilInst} yBase={ingredientY + 0.015} />}
    </group>
  );
};
