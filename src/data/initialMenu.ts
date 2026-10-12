import type { MenuItem, CafeSettings } from '../types/index.js';
import type { MenuCategoryId } from './categories.js';
import { DEFAULT_RECIPES } from './rawMaterials.js';

// Default store settings. Saved to MongoDB on first run, then edited from
// Menu & Stock -> Store & Receipt Config.
export const INITIAL_CAFE_SETTINGS: CafeSettings = {
  cafeName: 'NU Cafe',
  tagline: 'Taste The Tastiest · Sip. Relax. Repeat',
  address: '',
  phone: '',
  gstin: '',
  upiId: '',
  // Printed menu prices are final prices, so no tax is added by default
  taxPercent: 0,
  currencySymbol: '₹',
  enableSound: true,
  receiptFooterMessage: 'Thank you for visiting NU Cafe! Sip. Relax. Repeat.',
};

const img = (name: string) => `/images/menu/${name}.jpg`;

const DEFAULT_DESCRIPTIONS: Record<MenuCategoryId, string> = {
  combos: 'Combo offer.',
  lime: 'Freshly squeezed lime cooler, served chilled.',
  juice: 'Fresh fruit juice, made to order.',
  mojito: 'Sparkling mint mojito with crushed ice.',
  mocktail: 'Signature fruit mocktail, served chilled.',
  falooda: 'Classic dessert, freshly prepared.',
  sharjah: 'Kerala-style Sharjah shake with banana and milk.',
  shake: 'Thick and creamy milkshake.',
  'bubble-tea': 'Milk tea with chewy tapioca pearls.',
  tea: 'Freshly brewed, served hot.',
  snacks: 'Crispy, freshly fried snack.',
  burgers: 'Freshly made to order.',
};

const item = (
  id: string,
  name: string,
  category: MenuCategoryId,
  price: number,
  image: string,
  extra: Partial<MenuItem> = {}
): MenuItem => ({
  id,
  name,
  category,
  price,
  description: DEFAULT_DESCRIPTIONS[category],
  image: img(image),
  isVeg: true,
  isAvailable: true,
  recipe: DEFAULT_RECIPES[id],
  ...extra,
});

const nonVeg = { isVeg: false };

// NU Cafe menu (from "nu cafe menu new (1).pdf")
export const INITIAL_MENU_ITEMS: MenuItem[] = [
  // --- LIME ---
  item('lime-normal', 'Normal Lime', 'lime', 20, 'lime'),
  item('lime-soda', 'Soda Lime', 'lime', 25, 'soda-lime'),
  item('lime-ginger', 'Ginger Lime', 'lime', 25, 'lime'),
  item('lime-orange', 'Orange Lime', 'lime', 30, 'orange-juice'),
  item('lime-pineapple', 'Pineapple Lime', 'lime', 30, 'lime'),
  item('lime-grape', 'Grape Lime', 'lime', 30, 'mocktail'),
  item('lime-watermelon', 'Watermelon Lime', 'lime', 30, 'watermelon-juice'),
  item('lime-blue', 'Blue Lime', 'lime', 30, 'blue-mojito'),
  item('lime-nu-special', 'NU Café Special Lime', 'lime', 40, 'soda-lime', {
    isPopular: true,
    description: 'Our signature house lime cooler.',
  }),

  // --- FRESH JUICE ---
  item('juice-orange', 'Orange Juice', 'juice', 70, 'orange-juice'),
  item('juice-watermelon', 'Watermelon Juice', 'juice', 50, 'watermelon-juice'),
  item('juice-pineapple', 'Pineapple Juice', 'juice', 70, 'juice'),
  item('juice-grape', 'Grape Juice', 'juice', 70, 'pomegranate-juice'),
  item('juice-anaar', 'Anaar Juice', 'juice', 80, 'pomegranate-juice', {
    description: 'Fresh pomegranate juice.',
  }),
  item('juice-apple', 'Apple Juice', 'juice', 90, 'juice'),
  item('juice-melon-mint', 'Melon Mint', 'juice', 80, 'watermelon-juice'),
  item('juice-musambi', 'Musambi Juice', 'juice', 80, 'orange-juice', {
    description: 'Fresh sweet lime (citrus) juice.',
  }),
  item('juice-milk-sarbath', 'Milk Sarbath', 'juice', 50, 'avil-milk'),
  item('juice-avil-milk', 'Avil Milk (Normal)', 'juice', 50, 'avil-milk', {
    description: 'Banana, milk and roasted avil (beaten rice).',
  }),
  item('juice-avil-milk-ice-cream', 'Avil Milk with Ice Cream', 'juice', 60, 'avil-milk', {
    description: 'Avil milk topped with a scoop of ice cream.',
  }),

  // --- MOJITOS ---
  item('mojito-green-apple', 'Green Apple Mojito', 'mojito', 100, 'mojito'),
  item('mojito-blueberry', 'Blueberry Mojito', 'mojito', 100, 'blue-mocktail'),
  item('mojito-passion-fruit', 'Passion Fruit Mojito', 'mojito', 100, 'mojito'),
  item('mojito-blue-mint', 'Blue Mint Mojito', 'mojito', 100, 'blue-mojito'),
  item('mojito-strawberry', 'Strawberry Mojito', 'mojito', 100, 'mocktail'),

  // --- MOCKTAILS ---
  item('mocktail-blueberry', 'Blueberry Mocktail', 'mocktail', 120, 'blue-mocktail'),
  item('mocktail-green-apple', 'Green Apple Mocktail', 'mocktail', 120, 'mojito'),
  item('mocktail-passion-fruit', 'Passion Fruit Mocktail', 'mocktail', 120, 'mocktail'),
  item('mocktail-blue-mint', 'Blue Mint Mocktail', 'mocktail', 120, 'blue-mojito'),
  item('mocktail-strawberry', 'Strawberry Mocktail', 'mocktail', 120, 'mocktail'),

  // --- FALOODA & SALAD ---
  item('falooda-normal', 'Normal Falooda', 'falooda', 120, 'falooda'),
  item('falooda-royal', 'Royal Falooda', 'falooda', 150, 'falooda', { isPopular: true }),
  item('fruit-salad', 'Fruit Salad', 'falooda', 80, 'fruit-salad', {
    description: 'Fresh seasonal fruits.',
  }),

  // --- SHARJAH ---
  item('sharjah-normal', 'Normal Sharjah', 'sharjah', 60, 'sharjah'),
  item('sharjah-chocolate', 'Chocolate Sharjah', 'sharjah', 70, 'sharjah'),
  item('sharjah-vanilla', 'Vanilla Sharjah', 'sharjah', 70, 'sharjah'),
  item('sharjah-pista', 'Pista Sharjah', 'sharjah', 70, 'sharjah'),
  item('sharjah-butterscotch', 'Butterscotch Sharjah', 'sharjah', 70, 'sharjah'),
  item('sharjah-strawberry', 'Strawberry Sharjah', 'sharjah', 70, 'sharjah'),
  item('sharjah-mango', 'Mango Sharjah', 'sharjah', 70, 'sharjah'),

  // --- SHAKES ---
  item('shake-arabian', 'NU Café Special Arabian Shake', 'shake', 150, 'shake', {
    isPopular: true,
    description: 'Our signature Arabian shake.',
  }),
  item('shake-chocolate', 'Chocolate Shake', 'shake', 100, 'shake'),
  item('shake-strawberry', 'Strawberry Shake', 'shake', 90, 'shake'),
  item('shake-pista', 'Pista Shake', 'shake', 100, 'shake'),
  item('shake-vanilla', 'Vanilla Shake', 'shake', 90, 'shake'),
  item('shake-butterscotch', 'Butterscotch Shake', 'shake', 90, 'shake'),
  item('shake-spanish-delight', 'Spanish Delight Shake', 'shake', 100, 'shake'),
  item('shake-mango', 'Mango Shake', 'shake', 90, 'avil-milk'),
  item('shake-oreo', 'Oreo Shake', 'shake', 90, 'oreo-shake'),
  item('shake-protein', 'Protein Shake', 'shake', 120, 'protein-shake'),
  item('shake-avocado', 'Avocado Shake', 'shake', 100, 'avocado-shake'),
  item('shake-kitkat', 'KitKat Shake', 'shake', 100, 'oreo-shake'),
  item('shake-karikkin', 'Karikkin Shake', 'shake', 60, 'tender-coconut-shake', {
    description: 'Tender coconut shake.',
  }),
  item('shake-karikkin-ice-cream', 'Karikkin Shake with Ice Cream', 'shake', 80, 'tender-coconut-shake', {
    description: 'Tender coconut shake topped with ice cream.',
  }),
  item('shake-cold-coffee', 'Cold Coffee', 'shake', 60, 'cold-coffee', {
    description: 'Chilled blended coffee.',
  }),

  // --- BUBBLE TEA ---
  item('bubble-matcha', 'Matcha Lite Bubble Tea', 'bubble-tea', 130, 'bubble-tea'),
  item('bubble-chocolate', 'Chocolate Bubble Tea', 'bubble-tea', 130, 'bubble-tea'),
  item('bubble-thai', 'Thai Bubble Tea', 'bubble-tea', 130, 'bubble-tea'),
  item('bubble-taro', 'Taro Bubble Tea', 'bubble-tea', 130, 'bubble-tea'),

  // --- SPECIAL TEA & COFFEE ---
  item('tea-normal', 'Normal Tea', 'tea', 15, 'tea'),
  item('tea-masala', 'Masala Tea', 'tea', 30, 'tea'),
  item('tea-signature', 'Signature Tea', 'tea', 30, 'tea', { isPopular: true }),
  item('tea-cardamom', 'Cardamom Tea', 'tea', 25, 'tea'),
  item('tea-cinnamon', 'Cinnamon Tea', 'tea', 25, 'tea'),
  item('tea-ginger', 'Ginger Tea', 'tea', 25, 'tea'),
  item('coffee-bru', 'Bru Coffee', 'tea', 20, 'black-coffee'),
  item('coffee-nescafe', 'Nescafe', 'tea', 25, 'black-coffee'),
  item('tea-horlicks-boost', 'Horlicks / Boost', 'tea', 25, 'tea'),
  item('tea-chocolate', 'Chocolate Tea', 'tea', 30, 'tea'),
  item('tea-black', 'Black Tea', 'tea', 10, 'black-tea'),
  item('coffee-black', 'Black Coffee', 'tea', 10, 'black-coffee'),
  item('tea-lemon', 'Lemon Tea', 'tea', 15, 'lemon-tea'),
  item('tea-mint', 'Mint Tea', 'tea', 15, 'green-tea'),
  item('tea-ginger-black', 'Ginger Black Tea', 'tea', 15, 'black-tea'),
  item('tea-cardamom-black', 'Cardamom Black Tea', 'tea', 15, 'black-tea'),
  item('tea-honey-lemon-black', 'Honey Lemon Black Tea', 'tea', 30, 'lemon-tea'),
  item('tea-green', 'Green Tea', 'tea', 20, 'green-tea'),

  // --- SNACKS (Specials) ---
  item('snack-chicken-nuggets', 'Chicken Nuggets', 'snacks', 99, 'chicken-nuggets', nonVeg),
  item('snack-cheese-balls', 'Cheese Balls (Chicken)', 'snacks', 99, 'cheese-balls', nonVeg),
  item('snack-chicken-strips', 'Chicken Strips', 'snacks', 99, 'chicken-strips', nonVeg),
  item('snack-momos', 'Momos', 'snacks', 99, 'momos', {
    isVeg: undefined,
    description: 'Steamed dumplings served with spicy chutney.',
  }),
  item('snack-fried-chicken', 'Fried Chicken', 'snacks', 630, 'fried-chicken', {
    ...nonVeg,
    isPopular: true,
    description: 'Crispy golden fried chicken.',
  }),

  // --- BURGERS & WRAPS (Specials) ---
  item('burger-zinger', 'Zinger Burger', 'burgers', 100, 'burger', { ...nonVeg, isSpicy: true }),
  item('burger-zinger-cheese', 'Zinger Cheese Burger', 'burgers', 140, 'burger', {
    ...nonVeg,
    isSpicy: true,
  }),
  item('burger-beef', 'Beef Burger', 'burgers', 150, 'burger', nonVeg),
  item('burger-loaded-cheese', 'Loaded Cheese Burger', 'burgers', 160, 'burger', {
    ...nonVeg,
    isPopular: true,
  }),
  item('wrap-with-chai', 'Wrap with Chai', 'burgers', 100, 'wrap', {
    isVeg: undefined,
    description: 'Freshly rolled wrap served with a cup of chai.',
  }),
];
