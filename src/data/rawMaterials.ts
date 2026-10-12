import type { MaterialUnit, RawMaterial, RecipeLine } from '../types';

export const MATERIAL_UNITS: MaterialUnit[] = ['kg', 'g', 'L', 'ml', 'pcs', 'scoop'];

export const UNIT_LABELS: Record<MaterialUnit, string> = {
  kg: 'kg (kilogram)',
  g: 'g (gram)',
  L: 'L (litre)',
  ml: 'ml (millilitre)',
  pcs: 'pcs (pieces)',
  scoop: 'scoop',
};

// How many of the second unit make one of the first, for units that convert
const CONVERSIONS: Partial<Record<MaterialUnit, Partial<Record<MaterialUnit, number>>>> = {
  kg: { g: 1000 },
  g: { kg: 0.001 },
  L: { ml: 1000 },
  ml: { L: 0.001 },
};

/**
 * Factor to multiply amounts by when switching units (kg -> g is 1000), or
 * null when the units can't be converted (e.g. kg -> pcs).
 */
export function unitConversionFactor(from: MaterialUnit, to: MaterialUnit): number | null {
  if (from === to) return 1;
  return CONVERSIONS[from]?.[to] ?? null;
}

/** Rounds away float noise such as 0.35 * 1000 = 350.00000000000006. */
export const roundAmount = (value: number) => Math.round(value * 1e6) / 1e6;

// Starting raw materials. Stock starts at 0 - enter real stock in
// Menu & Stock -> Raw Materials.
export const DEFAULT_RAW_MATERIALS: RawMaterial[] = (
  [
    // Fruits
    ['lemon', 'Lemon', 'pcs', 20],
    ['pineapple', 'Pineapple', 'kg', 2],
    ['watermelon', 'Watermelon', 'kg', 3],
    ['orange', 'Orange', 'kg', 2],
    ['grapes', 'Grapes', 'kg', 1],
    ['pomegranate', 'Pomegranate (Anaar)', 'kg', 1],
    ['apple', 'Apple', 'kg', 1],
    ['musambi', 'Musambi', 'kg', 2],
    ['muskmelon', 'Muskmelon', 'kg', 1],
    ['banana', 'Banana', 'pcs', 12],
    ['avocado', 'Avocado', 'kg', 0.5],
    ['tender-coconut', 'Tender Coconut', 'pcs', 5],
    // Dairy
    ['milk', 'Milk', 'L', 5],
    ['ice-cream', 'Ice Cream', 'scoop', 10],
    // Basics
    ['sugar', 'Sugar', 'kg', 2],
    ['soda', 'Soda', 'ml', 2000],
    ['mint', 'Mint Leaves', 'g', 100],
    ['ginger', 'Ginger', 'g', 100],
    ['avil', 'Avil (Beaten Rice)', 'kg', 0.5],
    // Syrups
    ['nannari-syrup', 'Nannari Syrup', 'ml', 300],
    ['blue-curacao', 'Blue Curacao Syrup', 'ml', 200],
    ['green-apple-syrup', 'Green Apple Syrup', 'ml', 200],
    ['blueberry-syrup', 'Blueberry Syrup', 'ml', 200],
    ['passion-fruit-syrup', 'Passion Fruit Syrup', 'ml', 200],
    ['strawberry-syrup', 'Strawberry Syrup', 'ml', 200],
    // Shake add-ins
    ['oreo', 'Oreo Biscuits', 'pcs', 12],
    ['kitkat', 'KitKat', 'pcs', 5],
    ['protein-powder', 'Protein Powder', 'g', 200],
    // Tea & coffee
    ['tea-powder', 'Tea Powder', 'g', 250],
    ['tea-masala', 'Tea Masala', 'g', 50],
    ['cardamom', 'Cardamom', 'g', 20],
    ['cinnamon', 'Cinnamon', 'g', 20],
    ['honey', 'Honey', 'ml', 200],
    ['green-tea-bag', 'Green Tea Bags', 'pcs', 10],
    ['bru-coffee', 'Bru Coffee Powder', 'g', 100],
    ['nescafe', 'Nescafe Powder', 'g', 100],
    ['horlicks-boost', 'Horlicks / Boost', 'g', 250],
    ['chocolate-powder', 'Chocolate Powder', 'g', 250],
    // Bubble tea
    ['tapioca-pearls', 'Tapioca Pearls', 'g', 500],
    ['matcha-powder', 'Matcha Powder', 'g', 100],
    ['thai-tea-mix', 'Thai Tea Mix', 'g', 100],
    ['taro-powder', 'Taro Powder', 'g', 100],
    // Burgers & wraps
    ['burger-bun', 'Burger Bun', 'pcs', 10],
    ['zinger-fillet', 'Zinger Chicken Fillet', 'pcs', 10],
    ['beef-patty', 'Beef Patty', 'pcs', 10],
    ['cheese-slice', 'Cheese Slice', 'pcs', 20],
    ['tortilla', 'Tortilla Wrap', 'pcs', 10],
    ['lettuce', 'Lettuce', 'g', 200],
    ['mayonnaise', 'Mayonnaise', 'g', 500],
    // Snacks
    ['frozen-nuggets', 'Chicken Nuggets (frozen)', 'pcs', 30],
    ['frozen-cheese-balls', 'Chicken Cheese Balls (frozen)', 'pcs', 30],
    ['frozen-strips', 'Chicken Strips (frozen)', 'pcs', 30],
    ['frozen-momos', 'Momos (frozen)', 'pcs', 30],
    ['chicken', 'Chicken (for frying)', 'kg', 2],
    ['frying-oil', 'Frying Oil', 'L', 2],
  ] as [string, string, MaterialUnit, number][]
).map(([id, name, unit, lowStockLevel]) => ({ id, name, unit, stock: 0, lowStockLevel }));

const r = (lines: Record<string, number>): RecipeLine[] =>
  Object.entries(lines).map(([materialId, quantity]) => ({ materialId, quantity }));

const SUGAR = { sugar: 0.02 };
const lime = (extra: Record<string, number> = {}) => r({ lemon: 1, ...SUGAR, ...extra });
const mojito = (syrup: string) => r({ lemon: 1, mint: 5, soda: 200, [syrup]: 30, ...SUGAR });
const mocktail = (syrup: string) => r({ lemon: 1, soda: 150, [syrup]: 40, ...SUGAR });
const sharjah = r({ banana: 1, milk: 0.2, 'ice-cream': 1, ...SUGAR });
const shake = (extra: Record<string, number> = {}) =>
  r({ milk: 0.25, 'ice-cream': 2, ...SUGAR, ...extra });
const milkTea = (extra: Record<string, number> = {}) =>
  r({ 'tea-powder': 5, milk: 0.1, sugar: 0.015, ...extra });
const blackTea = (extra: Record<string, number> = {}) =>
  r({ 'tea-powder': 4, sugar: 0.015, ...extra });
const bubbleTea = (extra: Record<string, number>) =>
  r({ 'tapioca-pearls': 50, milk: 0.2, ...SUGAR, ...extra });
const burger = (extra: Record<string, number>) =>
  r({ 'burger-bun': 1, lettuce: 15, mayonnaise: 20, ...extra });

// Starting recipes (one serving), keyed by menu item id. These are estimates -
// adjust them per item in Menu & Stock -> Recipe.
export const DEFAULT_RECIPES: Record<string, RecipeLine[]> = {
  'lime-normal': lime(),
  'lime-soda': lime({ soda: 200 }),
  'lime-ginger': lime({ ginger: 10 }),
  'lime-orange': lime({ orange: 0.15 }),
  'lime-pineapple': lime({ pineapple: 0.15 }),
  'lime-grape': lime({ grapes: 0.1 }),
  'lime-watermelon': lime({ watermelon: 0.2 }),
  'lime-blue': lime({ 'blue-curacao': 30 }),
  'lime-nu-special': lime({ mint: 5, ginger: 5, soda: 200 }),

  'juice-orange': r({ orange: 0.5, ...SUGAR }),
  'juice-watermelon': r({ watermelon: 0.4, ...SUGAR }),
  'juice-pineapple': r({ pineapple: 0.35, sugar: 0.03 }),
  'juice-grape': r({ grapes: 0.3, sugar: 0.03 }),
  'juice-anaar': r({ pomegranate: 0.4 }),
  'juice-apple': r({ apple: 0.35 }),
  'juice-melon-mint': r({ muskmelon: 0.35, mint: 5, ...SUGAR }),
  'juice-musambi': r({ musambi: 0.5 }),
  'juice-milk-sarbath': r({ milk: 0.25, 'nannari-syrup': 30, ...SUGAR }),
  'juice-avil-milk': r({ milk: 0.25, banana: 1, avil: 0.03, ...SUGAR }),
  'juice-avil-milk-ice-cream': r({ milk: 0.25, banana: 1, avil: 0.03, 'ice-cream': 1, ...SUGAR }),

  'mojito-green-apple': mojito('green-apple-syrup'),
  'mojito-blueberry': mojito('blueberry-syrup'),
  'mojito-passion-fruit': mojito('passion-fruit-syrup'),
  'mojito-blue-mint': mojito('blue-curacao'),
  'mojito-strawberry': mojito('strawberry-syrup'),

  'mocktail-blueberry': mocktail('blueberry-syrup'),
  'mocktail-green-apple': mocktail('green-apple-syrup'),
  'mocktail-passion-fruit': mocktail('passion-fruit-syrup'),
  'mocktail-blue-mint': r({ lemon: 1, soda: 150, 'blue-curacao': 40, mint: 5, ...SUGAR }),
  'mocktail-strawberry': mocktail('strawberry-syrup'),

  'falooda-normal': r({ milk: 0.2, 'ice-cream': 1, ...SUGAR }),
  'falooda-royal': r({ milk: 0.25, 'ice-cream': 2, ...SUGAR }),

  'sharjah-normal': sharjah,
  'sharjah-chocolate': sharjah,
  'sharjah-vanilla': sharjah,
  'sharjah-pista': sharjah,
  'sharjah-butterscotch': sharjah,
  'sharjah-strawberry': sharjah,
  'sharjah-mango': sharjah,

  'shake-arabian': shake(),
  'shake-chocolate': shake(),
  'shake-strawberry': shake(),
  'shake-pista': shake(),
  'shake-vanilla': shake(),
  'shake-butterscotch': shake(),
  'shake-spanish-delight': shake(),
  'shake-mango': shake(),
  'shake-oreo': shake({ oreo: 4 }),
  'shake-protein': shake({ 'protein-powder': 30 }),
  'shake-avocado': shake({ avocado: 0.15 }),
  'shake-kitkat': shake({ kitkat: 1 }),
  'shake-karikkin': r({ 'tender-coconut': 1, milk: 0.15, ...SUGAR }),
  'shake-karikkin-ice-cream': r({ 'tender-coconut': 1, milk: 0.15, 'ice-cream': 1, ...SUGAR }),
  'shake-cold-coffee': r({ milk: 0.25, 'ice-cream': 1, 'bru-coffee': 5, ...SUGAR }),

  'fruit-salad': r({ apple: 0.1, banana: 1, grapes: 0.05, pomegranate: 0.05 }),

  'tea-normal': milkTea(),
  'tea-masala': milkTea({ 'tea-masala': 2 }),
  'tea-signature': milkTea({ 'tea-masala': 1, cardamom: 1, ginger: 3 }),
  'tea-cardamom': milkTea({ cardamom: 1 }),
  'tea-cinnamon': milkTea({ cinnamon: 1 }),
  'tea-ginger': milkTea({ ginger: 5 }),
  'coffee-bru': r({ 'bru-coffee': 3, milk: 0.12, sugar: 0.015 }),
  'coffee-nescafe': r({ nescafe: 3, milk: 0.12, sugar: 0.015 }),
  'tea-horlicks-boost': r({ 'horlicks-boost': 20, milk: 0.15 }),
  'tea-chocolate': milkTea({ 'chocolate-powder': 10 }),
  'tea-black': blackTea(),
  'coffee-black': r({ 'bru-coffee': 3, sugar: 0.015 }),
  'tea-lemon': blackTea({ lemon: 0.5 }),
  'tea-mint': blackTea({ mint: 3 }),
  'tea-ginger-black': blackTea({ ginger: 5 }),
  'tea-cardamom-black': blackTea({ cardamom: 1 }),
  'tea-honey-lemon-black': r({ 'tea-powder': 4, lemon: 0.5, honey: 15 }),
  'tea-green': r({ 'green-tea-bag': 1 }),

  'bubble-matcha': bubbleTea({ 'matcha-powder': 10 }),
  'bubble-chocolate': bubbleTea({ 'chocolate-powder': 15 }),
  'bubble-thai': bubbleTea({ 'thai-tea-mix': 15 }),
  'bubble-taro': bubbleTea({ 'taro-powder': 20 }),

  'snack-chicken-nuggets': r({ 'frozen-nuggets': 6, 'frying-oil': 0.05 }),
  'snack-cheese-balls': r({ 'frozen-cheese-balls': 6, 'frying-oil': 0.05 }),
  'snack-chicken-strips': r({ 'frozen-strips': 5, 'frying-oil': 0.05 }),
  'snack-momos': r({ 'frozen-momos': 8 }),
  'snack-fried-chicken': r({ chicken: 1, 'frying-oil': 0.2 }),

  'burger-zinger': burger({ 'zinger-fillet': 1, 'frying-oil': 0.05 }),
  'burger-zinger-cheese': burger({ 'zinger-fillet': 1, 'cheese-slice': 1, 'frying-oil': 0.05 }),
  'burger-beef': burger({ 'beef-patty': 1 }),
  'burger-loaded-cheese': burger({ 'zinger-fillet': 1, 'cheese-slice': 2, 'frying-oil': 0.05 }),
  'wrap-with-chai': r({
    tortilla: 1,
    'zinger-fillet': 1,
    lettuce: 15,
    mayonnaise: 20,
    'frying-oil': 0.05,
    'tea-powder': 5,
    milk: 0.1,
    sugar: 0.015,
  }),
};

/**
 * How many servings of an item the current stock can make, or null when the
 * item has no recipe (its stock isn't tracked).
 */
export function servingsAvailable(
  recipe: RecipeLine[] | undefined,
  materials: RawMaterial[]
): number | null {
  if (!recipe || recipe.length === 0) return null;
  let servings = Infinity;
  for (const line of recipe) {
    const material = materials.find((m) => m.id === line.materialId);
    if (!material) continue;
    // Small epsilon so 0.7 kg / 0.35 kg counts as 2 despite float rounding
    servings = Math.min(servings, Math.floor(material.stock / line.quantity + 1e-9));
  }
  return servings === Infinity ? null : Math.max(0, servings);
}

/** Formats an amount with its unit, e.g. "0.35 kg", "200 ml", "1 pcs". */
export const formatQuantity = (quantity: number, unit: MaterialUnit) =>
  `${Number(quantity.toFixed(3))} ${unit}`;
