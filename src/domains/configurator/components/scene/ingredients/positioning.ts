import type { IngredientKey } from '../../../types/configurator.types';

export interface InstanceData {
  x: number;
  z: number;
  rotation: number;
  scale: number;
}

function mulberry32(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seedFromKey(key: IngredientKey): number {
  return [...key].reduce((h, c) => (Math.imul(31, h) + c.charCodeAt(0)) | 0, 0) >>> 0;
}

const INGREDIENT_ORDER: IngredientKey[] = ['pepperoni', 'mushrooms', 'olives', 'peppers', 'tomatoes', 'basil'];

const INGREDIENT_COUNTS: Record<IngredientKey, number> = {
  pepperoni: 10,
  mushrooms: 9,
  olives: 8,
  peppers: 12,
  tomatoes: 8,
  basil: 8,
};

const TOTAL = INGREDIENT_ORDER.reduce((sum, key) => sum + INGREDIENT_COUNTS[key], 0);

// Golden angle phyllotaxis — positions spiral outward evenly across the disc
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

function buildPhyllotaxisPool(): Array<{ x: number; z: number }> {
  const MIN_R = 0.28;
  const MAX_R = 1.08;
  return Array.from({ length: TOTAL }, (_, i) => {
    const r = MIN_R + (MAX_R - MIN_R) * Math.sqrt((i + 0.5) / TOTAL);
    const angle = i * GOLDEN_ANGLE;
    return { x: Math.cos(angle) * r, z: Math.sin(angle) * r };
  });
}

// Round-robin assignment: position i goes to the next ingredient that still needs slots.
// Because phyllotaxis spreads points evenly across the disc, each ingredient ends up
// with positions scattered all over the pizza rather than clustered in one zone.
function buildIngredientPositions(): Record<IngredientKey, Array<{ x: number; z: number }>> {
  const pool = buildPhyllotaxisPool();
  const assigned = Object.fromEntries(INGREDIENT_ORDER.map(k => [k, [] as Array<{ x: number; z: number }>])) as Record<
    IngredientKey,
    Array<{ x: number; z: number }>
  >;
  const remaining = { ...INGREDIENT_COUNTS };

  let poolIdx = 0;
  while (poolIdx < TOTAL) {
    for (const key of INGREDIENT_ORDER) {
      if (remaining[key] > 0 && poolIdx < TOTAL) {
        assigned[key].push(pool[poolIdx]);
        remaining[key]--;
        poolIdx++;
      }
    }
  }

  return assigned;
}

const INGREDIENT_POSITIONS = buildIngredientPositions();

export function generateInstances(key: IngredientKey): InstanceData[] {
  const rng = mulberry32(seedFromKey(key));
  return INGREDIENT_POSITIONS[key].map(pos => ({
    x: pos.x,
    z: pos.z,
    rotation: rng() * Math.PI * 2,
    scale: 0.85 + rng() * 0.3,
  }));
}
