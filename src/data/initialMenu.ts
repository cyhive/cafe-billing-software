import { MenuItem, CafeSettings } from '../types';

export const BROASTED_IMAGE = '/images/crispy_broasted_chicken_1790574522659.jpg';
export const BURGER_IMAGE = '/images/gourmet_smash_burger_1790574537123.jpg';
export const TEA_IMAGE = '/images/karak_chai_tea_1790574551408.jpg';
export const JUICE_IMAGE = '/images/fresh_cafe_juices_1790574562697.jpg';
export const LOADED_FRIES_IMAGE = '/images/vecteezy_delicious-loaded-french-fries-with-melted-cheese-and-sauce_53565580.jpg';
export const PERI_FRIES_IMAGE = '/images/peri_peri_fries.jpg';
export const GARLIC_DIP_IMAGE = '/images/garlic_toum_dip.jpg';
export const ONION_RINGS_IMAGE = '/images/onion_rings.jpg';
export const WAFFLE_IMAGE = '/images/nutella_waffle.jpg';
export const SHAKE_IMAGE = '/images/biscoff_shake.jpg';
export const BROWNIE_IMAGE = '/images/brownie_gelato.jpg';
export const INITIAL_CAFE_SETTINGS: CafeSettings = {
  cafeName: 'Crunch & Brew Cafe',
  tagline: 'Artisanal Burgers · Broasted Chicken · Karak & Fresh Juices',
  address: 'Shop 14, Downtown Avenue, Food District',
  phone: '+1 (555) 789-2345',
  gstin: '27AABCU9603R1ZM',
  upiId: 'crunchbrew@upi',
  taxPercent: 5.0,
  currencySymbol: '₹',
  enableSound: true,
  receiptFooterMessage: 'Thank you for visiting Crunch & Brew! Have a flavorful day!',
};

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  // --- BURGERS ---
  {
    id: 'b1',
    name: 'Ember Double Smash Burger',
    category: 'burgers',
    price: 8.99,
    description: 'Two smashed prime beef patties, melted cheddar, grilled onions, house secret sauce in toasted brioche bun.',
    image: BURGER_IMAGE,
    isPopular: true,
    isAvailable: true,
    customizationGroup: {
      title: 'Make it a Combo / Add-ons',
      choices: [
        { name: 'Standard (Single)', extraPrice: 0 },
        { name: 'Extra Cheese Slice', extraPrice: 1.00 },
        { name: 'Double Bacon & Cheddar', extraPrice: 2.50 },
        { name: 'Make Combo (Fries + Soda)', extraPrice: 3.50 }
      ]
    }
  },
  {
    id: 'b2',
    name: 'Spicy Crispy Zinger Burger',
    category: 'burgers',
    price: 8.49,
    description: 'Crispy hand-breaded chicken breast fillet, spicy Nashville mayo, fresh shredded iceberg lettuce and pickles.',
    image: BURGER_IMAGE,
    isSpicy: true,
    isPopular: true,
    isAvailable: true,
    customizationGroup: {
      title: 'Spice Level',
      choices: [
        { name: 'Medium Spicy', extraPrice: 0 },
        { name: 'Extra Fiery Ghost Spice', extraPrice: 0.50 },
        { name: 'Add Melted Swiss Cheese', extraPrice: 1.20 },
        { name: 'Combo with Peri-Peri Fries', extraPrice: 3.80 }
      ]
    }
  },
  {
    id: 'b3',
    name: 'Truffle Mushroom Swiss Burger',
    category: 'burgers',
    price: 9.99,
    description: 'Angus beef patty topped with sautéed wild button mushrooms, melted Swiss cheese and black truffle garlic aioli.',
    image: BURGER_IMAGE,
    isPopular: false,
    isAvailable: true,
  },
  {
    id: 'b4',
    name: 'Crispy Paneer Royale (Veg)',
    category: 'burgers',
    price: 7.99,
    description: 'Crispy seasoned cottage cheese steak, spiced tandoori mint mayo, crisp purple cabbage slaw in artisanal bun.',
    image: BURGER_IMAGE,
    isVeg: true,
    isAvailable: true,
  },

  // --- BROASTED CHICKEN ---
  {
    id: 'c1',
    name: '2 Pc Crispy Broasted Meal',
    category: 'broasted',
    price: 7.49,
    description: '2 pcs pressure-fried golden crispy broasted chicken, warm dinner roll, garlic toum dip, and crunchy golden fries.',
    image: BROASTED_IMAGE,
    isPopular: true,
    isAvailable: true,
    customizationGroup: {
      title: 'Broasted Flavor',
      choices: [
        { name: 'Original Herb Recipe', extraPrice: 0 },
        { name: 'Spicy Masala Crust', extraPrice: 0.50 },
        { name: 'Extra Large Garlic Dip & Bun', extraPrice: 1.50 }
      ]
    }
  },
  {
    id: 'c2',
    name: '4 Pc Broasted Crunch Box',
    category: 'broasted',
    price: 12.99,
    description: '4 golden juicy broasted chicken pieces with 2 dips (Garlic Toum & Spicy Dip), seasoned fries and creamy coleslaw.',
    image: BROASTED_IMAGE,
    isPopular: true,
    isAvailable: true,
    customizationGroup: {
      title: 'Flavor Selection',
      choices: [
        { name: 'Original Crispy', extraPrice: 0 },
        { name: 'Spicy Crunch', extraPrice: 0.50 },
        { name: 'Half & Half (2 Orig / 2 Spicy)', extraPrice: 0.50 }
      ]
    }
  },
  {
    id: 'c3',
    name: '8 Pc Family Broasted Bucket',
    category: 'broasted',
    price: 22.99,
    description: 'Feast of 8 large broasted pieces, 4 soft butter rolls, large fries, 3 signature dips, and large tangy coleslaw.',
    image: BROASTED_IMAGE,
    isPopular: true,
    isAvailable: true,
    customizationGroup: {
      title: 'Bucket Preparation',
      choices: [
        { name: 'All Original Crispy', extraPrice: 0 },
        { name: 'All Spicy Broasted', extraPrice: 1.00 },
        { name: 'Half Original / Half Spicy', extraPrice: 1.00 }
      ]
    }
  },
  {
    id: 'c4',
    name: 'Crispy Broasted Chicken Tenders (5 Pcs)',
    category: 'broasted',
    price: 8.49,
    description: 'Tender chicken breast strips coated in crunchy broasted crust served with smoked honey mustard.',
    image: BROASTED_IMAGE,
    isAvailable: true,
  },
  {
    id: 'c5',
    name: 'Fiery Broasted Hot Wings (6 Pcs)',
    category: 'broasted',
    price: 7.99,
    description: 'Crispy tossed jumbo wings with peri-peri glaze and cool ranch dipping sauce.',
    image: BROASTED_IMAGE,
    isSpicy: true,
    isAvailable: true,
  },
  {
    id: 'c6',
    name: 'Crunchy Broasted Popcorn Bites',
    category: 'broasted',
    price: 5.99,
    description: 'Bite-sized seasoned chicken nuggets fried to ultra-crisp perfection with sweet chili dip.',
    image: BROASTED_IMAGE,
    isAvailable: true,
  },

  // --- TEA & CHAI ---
  {
    id: 't1',
    name: 'Signature Royal Karak Chai',
    category: 'tea',
    price: 2.49,
    description: 'Slow-simmered rich black tea steeped with evaporated milk, crushed green cardamom pods, and a saffron kiss.',
    image: TEA_IMAGE,
    isVeg: true,
    isPopular: true,
    isAvailable: true,
    customizationGroup: {
      title: 'Sweetness & Milk',
      choices: [
        { name: 'Regular Sweet', extraPrice: 0 },
        { name: 'Less Sugar (Half Sweet)', extraPrice: 0 },
        { name: 'Sugar-Free (Jaggery or No Sugar)', extraPrice: 0 },
        { name: 'Extra Strong Kadak', extraPrice: 0.30 }
      ]
    }
  },
  {
    id: 't2',
    name: 'Desi Masala Dum Chai',
    category: 'tea',
    price: 2.79,
    description: 'Handcrafted spiced tea infused with fresh crushed ginger root, cloves, cinnamon stick, and black pepper.',
    image: TEA_IMAGE,
    isVeg: true,
    isSpicy: false,
    isPopular: true,
    isAvailable: true,
    customizationGroup: {
      title: 'Ginger / Spice Strength',
      choices: [
        { name: 'Balanced Spice', extraPrice: 0 },
        { name: 'Extra Ginger Kick', extraPrice: 0.20 },
        { name: 'Less Sweet', extraPrice: 0 }
      ]
    }
  },
  {
    id: 't3',
    name: 'Kashmiri Pink Tea (Noon Chai)',
    category: 'tea',
    price: 3.49,
    description: 'Authentic brewed green tea leaves aerated to silky pastel pink with milk, crushed pistachios, and slivered almonds.',
    image: TEA_IMAGE,
    isVeg: true,
    isAvailable: true,
  },
  {
    id: 't4',
    name: 'Fresh Honey Ginger Lemon Tea',
    category: 'tea',
    price: 2.99,
    description: 'Pure brewed black tea with freshly pressed ginger, squeezed lemon juice, and organic wild honeycomb.',
    image: TEA_IMAGE,
    isVeg: true,
    isAvailable: true,
  },
  {
    id: 't5',
    name: 'Cardamom Saffron Milk Tea',
    category: 'tea',
    price: 2.99,
    description: 'Silky whole milk tea scented with pure Kashmiri saffron strands and fresh green cardamom powder.',
    image: TEA_IMAGE,
    isVeg: true,
    isAvailable: true,
  },
  {
    id: 't6',
    name: 'Iced Peach Lemonade Chai',
    category: 'tea',
    price: 3.99,
    description: 'Chilled steeped black tea shaken over ice with fresh white peach puree and citrus zest.',
    image: TEA_IMAGE,
    isVeg: true,
    isAvailable: true,
  },

  // --- JUICES & COOLERS ---
  {
    id: 'j1',
    name: 'Fresh Squeezed Valencia Orange',
    category: 'juices',
    price: 4.29,
    description: '100% pure cold-pressed Valencia oranges. No added sugar, no concentrates, packed with natural vitamin C.',
    image: JUICE_IMAGE,
    isVeg: true,
    isPopular: true,
    isAvailable: true,
    customizationGroup: {
      title: 'Ice Preference',
      choices: [
        { name: 'With Crushed Ice', extraPrice: 0 },
        { name: 'No Ice (Pure Juice)', extraPrice: 0.50 }
      ]
    }
  },
  {
    id: 'j2',
    name: 'Royal Alphonso Mango Smoothie',
    category: 'juices',
    price: 4.79,
    description: 'Velvety chilled puree of sun-ripened Alphonso mangoes blended with cream and crushed ice.',
    image: JUICE_IMAGE,
    isVeg: true,
    isPopular: true,
    isAvailable: true,
    customizationGroup: {
      title: 'Size & Toppings',
      choices: [
        { name: 'Regular Glass (350ml)', extraPrice: 0 },
        { name: 'Large Stein (500ml)', extraPrice: 1.20 },
        { name: 'Add Chia / Basil Seeds', extraPrice: 0.50 }
      ]
    }
  },
  {
    id: 'j3',
    name: 'Passion Fruit Mint Mojito Cooler',
    category: 'juices',
    price: 4.49,
    description: 'Muddled fresh spearmint leaves, Persian lime, real passion fruit seeds, and effervescent sparkling soda.',
    image: JUICE_IMAGE,
    isVeg: true,
    isPopular: true,
    isAvailable: true,
  },
  {
    id: 'j4',
    name: 'Signature Avocado Honey Shake',
    category: 'juices',
    price: 5.49,
    description: 'Creamy Hass avocado blended with chilled milk, drizzled with raw mountain honey and topped with crushed pistachios.',
    image: JUICE_IMAGE,
    isVeg: true,
    isPopular: true,
    isAvailable: true,
    customizationGroup: {
      title: 'Milk Option',
      choices: [
        { name: 'Whole Milk', extraPrice: 0 },
        { name: 'Oat Milk (Dairy-Free)', extraPrice: 0.80 },
        { name: 'Almond Milk', extraPrice: 0.80 }
      ]
    }
  },
  {
    id: 'j5',
    name: 'Classic Fresh Lime Mint Splash',
    category: 'juices',
    price: 3.29,
    description: 'Zesty hand-pressed green lime juice with fresh garden mint sprigs, black salt, and chilled soda.',
    image: JUICE_IMAGE,
    isVeg: true,
    isAvailable: true,
  },
  {
    id: 'j6',
    name: 'Watermelon Basil Chiller',
    category: 'juices',
    price: 3.99,
    description: 'Sweet seedless crimson watermelon juice cold-muddled with fresh basil and a hint of Himalayan pink salt.',
    image: JUICE_IMAGE,
    isVeg: true,
    isAvailable: true,
  },

  // --- SIDES & EXTRAS ---
  {
    id: 's1',
    name: 'Loaded Cheesy Jalapeno Fries',
    category: 'sides',
    image: LOADED_FRIES_IMAGE,
    price: 4.99,
    description: 'Golden skin-on fries smothered in hot aged cheddar cheese sauce, pickled jalapeno coins and crispy fried onions.',
    isVeg: true,
    isAvailable: true,
  },
  {
    id: 's2',
    name: 'Crispy Peri-Peri Fries',
    category: 'sides',
    image: PERI_FRIES_IMAGE,
    price: 3.49,
    description: 'Crunchy golden potato fries tossed in our signature smoky African peri-peri seasoning dust.',
    isVeg: true,
    isSpicy: true,
    isAvailable: true,
  },
  {
    id: 's3',
    name: 'Authentic Garlic Toum Dip (2 oz)',
    category: 'sides',
    image: GARLIC_DIP_IMAGE,
    price: 1.19,
    description: 'Traditional Lebanese-style whipped garlic emulsion. Creamy, tangy, and perfect with broasted chicken.',
    isVeg: true,
    isAvailable: true,
  },
  {
    id: 's4',
    name: 'Crunchy Golden Onion Rings',
    category: 'sides',
    image: ONION_RINGS_IMAGE,
    price: 4.29,
    description: 'Thick-cut sweet white onions in seasoned beer batter fried to crunchy perfection with chipotle mayo.',
    isVeg: true,
    isAvailable: true,
  },

  // --- DESSERTS ---
  {
    id: 'd1',
    name: 'Warm Belgian Nutella Waffle',
    category: 'desserts',
    image: WAFFLE_IMAGE,
    price: 5.99,
    description: 'Crispy pearl-sugar Belgian waffle drenched in warm Nutella hazelnut spread, banana slices, and crushed hazelnuts.',
    isVeg: true,
    isPopular: true,
    isAvailable: true,
  },
  {
    id: 'd2',
    name: 'Lotus Biscoff Thick Shake',
    category: 'desserts',
    image: SHAKE_IMAGE,
    price: 5.49,
    description: 'Creamy Madagascar vanilla gelato blended with genuine spiced Belgian speculoos spread and biscuit crumble.',
    isVeg: true,
    isAvailable: true,
  },
  {
    id: 'd3',
    name: 'Sizzling Hot Brownie with Vanilla Gelato',
    category: 'desserts',
    image: BROWNIE_IMAGE,
    price: 6.29,
    description: 'Fudgy Belgian dark chocolate brownie warmed through, topped with a scoop of vanilla gelato and warm chocolate ganache.',
    isVeg: true,
    isAvailable: true,
  }
];
