import { create } from 'zustand';
import { combine, devtools } from 'zustand/middleware';
import type { ConfiguratorState, ConfiguratorActions, DoughVariant, SauceVariant, IngredientKey, PizzaSize } from '../types/configurator.types';

const initialState: ConfiguratorState = {
  dough: 'traditional',
  sauce: 'tomato',
  cheeseAmount: 50,
  ingredients: {
    pepperoni: false,
    mushrooms: false,
    olives: false,
    peppers: false,
    tomatoes: false,
    basil: false,
  },
  size: 'medium',
};

export const useConfiguratorStore = create<ConfiguratorState & ConfiguratorActions>()(
  devtools(
    combine(initialState, set => ({
      setDough: (dough: DoughVariant) => set({ dough }),
      setSauce: (sauce: SauceVariant) => set({ sauce }),
      setCheeseAmount: (cheeseAmount: number) => set({ cheeseAmount }),
      toggleIngredient: (key: IngredientKey) =>
        set(state => ({ ingredients: { ...state.ingredients, [key]: !state.ingredients[key] } })),
      setSize: (size: PizzaSize) => set({ size }),
      resetAll: () => set(initialState),
    })),
    { name: 'configurator-store' },
  ),
);
