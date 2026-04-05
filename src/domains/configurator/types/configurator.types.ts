export type DoughVariant = 'thin' | 'traditional';
export type SauceVariant = 'tomato' | 'cream' | 'pesto';
export type PizzaSize = 'small' | 'medium' | 'large';
export type IngredientKey = 'pepperoni' | 'mushrooms' | 'olives' | 'peppers' | 'tomatoes' | 'basil';

export interface ConfiguratorState {
  dough: DoughVariant;
  sauce: SauceVariant;
  cheeseAmount: number;
  ingredients: Record<IngredientKey, boolean>;
  size: PizzaSize;
}

export interface ConfiguratorActions {
  setDough: (dough: DoughVariant) => void;
  setSauce: (sauce: SauceVariant) => void;
  setCheeseAmount: (amount: number) => void;
  toggleIngredient: (key: IngredientKey) => void;
  setSize: (size: PizzaSize) => void;
  resetAll: () => void;
}

export const INGREDIENT_KEYS: IngredientKey[] = ['pepperoni', 'mushrooms', 'olives', 'peppers', 'tomatoes', 'basil'];

export const INGREDIENT_LABELS: Record<IngredientKey, string> = {
  pepperoni: 'Пепперони',
  mushrooms: 'Грибы',
  olives: 'Оливки',
  peppers: 'Перец',
  tomatoes: 'Помидоры',
  basil: 'Базилик',
};

export const INGREDIENT_PRICES: Record<IngredientKey, number> = {
  pepperoni: 120,
  mushrooms: 80,
  olives: 70,
  peppers: 60,
  tomatoes: 50,
  basil: 40,
};

export const BASE_PRICES: Record<DoughVariant, number> = {
  thin: 299,
  traditional: 349,
};

export const SIZE_MULTIPLIERS: Record<PizzaSize, number> = {
  small: 0.85,
  medium: 1.0,
  large: 1.2,
};
