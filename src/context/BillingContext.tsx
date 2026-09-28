import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  MenuItem,
  CartItem,
  Bill,
  OrderType,
  PaymentMethod,
  OrderStatus,
  CafeSettings,
  ActiveTab,
  CustomOptionChoice,
} from '../types';
import { INITIAL_MENU_ITEMS, INITIAL_CAFE_SETTINGS } from '../data/initialMenu';
import { sound } from '../utils/audio';

interface HeldOrder {
  id: string;
  timestamp: string;
  items: CartItem[];
  orderType: OrderType;
  tableNumber?: string;
  customerName?: string;
  note?: string;
}

interface BillingContextType {
  // Navigation & View
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;

  // Settings
  settings: CafeSettings;
  updateSettings: (newSettings: Partial<CafeSettings>) => void;

  // Menu items
  menuItems: MenuItem[];
  updateMenuItem: (item: MenuItem) => void;
  toggleItemAvailability: (id: string) => void;
  addMenuItem: (item: MenuItem) => void;
  resetMenuToDefault: () => void;

  // Active Cart State
  cart: CartItem[];
  orderType: OrderType;
  setOrderType: (type: OrderType) => void;
  tableNumber: string;
  setTableNumber: (table: string) => void;
  customerName: string;
  setCustomerName: (name: string) => void;
  customerPhone: string;
  setCustomerPhone: (phone: string) => void;
  orderNote: string;
  setOrderNote: (note: string) => void;

  // Cart operations
  addToCart: (item: MenuItem, choice?: CustomOptionChoice, note?: string) => void;
  updateCartQuantity: (cartItemId: string, newQty: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartItemNote: (cartItemId: string, note: string) => void;
  clearCart: () => void;

  // Calculation values
  subtotal: number;
  taxPercent: number;
  setTaxPercent: (tax: number) => void;
  taxAmount: number;
  discountType: 'percentage' | 'fixed';
  setDiscountType: (type: 'percentage' | 'fixed') => void;
  discountValue: number;
  setDiscountValue: (val: number) => void;
  discountAmount: number;
  grandTotal: number;

  // Held orders
  heldOrders: HeldOrder[];
  holdCurrentOrder: () => void;
  resumeHeldOrder: (heldId: string) => void;
  deleteHeldOrder: (heldId: string) => void;

  // Settlement & Orders History
  bills: Bill[];
  settleOrder: (
    paymentMethod: PaymentMethod,
    cashReceived?: number,
    changeDue?: number
  ) => Bill;
  updateOrderStatus: (billId: string, status: OrderStatus) => void;
  
  // Modals & Popups
  activeBillForReceipt: Bill | null;
  setActiveBillForReceipt: (bill: Bill | null) => void;
  customizingItem: MenuItem | null;
  setCustomizingItem: (item: MenuItem | null) => void;
  isPaymentModalOpen: boolean;
  setIsPaymentModalOpen: (open: boolean) => void;
  isHoldModalOpen: boolean;
  setIsHoldModalOpen: (open: boolean) => void;

  // Helper stats
  todayStats: {
    revenue: number;
    orderCount: number;
    cashTotal: number;
    cardTotal: number;
    upiTotal: number;
    itemsSold: number;
  };
}

const BillingContext = createContext<BillingContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_MENU = 'crunchbrew_menu_items_v2';
const LOCAL_STORAGE_KEY_BILLS = 'crunchbrew_bills_v2';
const LOCAL_STORAGE_KEY_SETTINGS = 'crunchbrew_settings_v2';
const LOCAL_STORAGE_KEY_HELD = 'crunchbrew_held_orders_v2';
const LOCAL_STORAGE_KEY_TOKEN = 'crunchbrew_token_counter_v2';

// Seed some initial recent bills so reports and KDS look alive from minute 1
function getInitialBills(): Bill[] {
  const now = new Date();
  const makePastDate = (minutesAgo: number) =>
    new Date(now.getTime() - minutesAgo * 60000).toISOString();

  return [
    {
      id: 'bill-1021',
      orderNumber: 1021,
      tokenNumber: 18,
      createdAt: makePastDate(38),
      orderType: 'dine-in',
      tableNumber: 'Table 4',
      customerName: 'Marcus Cole',
      customerPhone: '9845012345',
      items: [
        {
          cartItemId: 'c-1',
          menuItemId: 'b1',
          name: 'Ember Double Smash Burger',
          basePrice: 8.99,
          unitPrice: 8.99,
          quantity: 2,
          category: 'burgers',
        },
        {
          cartItemId: 'c-2',
          menuItemId: 't1',
          name: 'Signature Royal Karak Chai',
          basePrice: 2.49,
          unitPrice: 2.49,
          quantity: 2,
          category: 'tea',
          note: 'Extra Kadak',
        },
        {
          cartItemId: 'c-3',
          menuItemId: 's1',
          name: 'Loaded Cheesy Jalapeno Fries',
          basePrice: 4.99,
          unitPrice: 4.99,
          quantity: 1,
          category: 'sides',
        },
      ],
      subtotal: 27.95,
      taxPercent: 5,
      taxAmount: 1.40,
      discountType: 'percentage',
      discountValue: 0,
      discountAmount: 0,
      total: 29.35,
      paymentMethod: 'card',
      status: 'completed',
    },
    {
      id: 'bill-1022',
      orderNumber: 1022,
      tokenNumber: 19,
      createdAt: makePastDate(24),
      orderType: 'takeaway',
      customerName: 'Sarah Jenkins',
      customerPhone: '9871234567',
      items: [
        {
          cartItemId: 'c-4',
          menuItemId: 'c2',
          name: '4 Pc Broasted Crunch Box',
          basePrice: 12.99,
          unitPrice: 13.49,
          quantity: 1,
          category: 'broasted',
          selectedChoice: { name: 'Spicy Crunch', extraPrice: 0.50 },
        },
        {
          cartItemId: 'c-5',
          menuItemId: 'j1',
          name: 'Fresh Squeezed Valencia Orange',
          basePrice: 4.29,
          unitPrice: 4.29,
          quantity: 2,
          category: 'juices',
        },
      ],
      subtotal: 22.07,
      taxPercent: 5,
      taxAmount: 1.10,
      discountType: 'percentage',
      discountValue: 5,
      discountAmount: 1.10,
      total: 22.07,
      paymentMethod: 'upi',
      status: 'ready',
    },
    {
      id: 'bill-1023',
      orderNumber: 1023,
      tokenNumber: 20,
      createdAt: makePastDate(12),
      orderType: 'dine-in',
      tableNumber: 'Table 7',
      customerName: 'David Lee',
      customerPhone: '9920193847',
      items: [
        {
          cartItemId: 'c-6',
          menuItemId: 'b2',
          name: 'Spicy Crispy Zinger Burger',
          basePrice: 8.49,
          unitPrice: 8.49,
          quantity: 1,
          category: 'burgers',
        },
        {
          cartItemId: 'c-7',
          menuItemId: 'c5',
          name: 'Fiery Broasted Hot Wings (6 Pcs)',
          basePrice: 7.99,
          unitPrice: 7.99,
          quantity: 1,
          category: 'broasted',
        },
        {
          cartItemId: 'c-8',
          menuItemId: 'j3',
          name: 'Passion Fruit Mint Mojito Cooler',
          basePrice: 4.49,
          unitPrice: 4.49,
          quantity: 1,
          category: 'juices',
        },
        {
          cartItemId: 'c-9',
          menuItemId: 't1',
          name: 'Signature Royal Karak Chai',
          basePrice: 2.49,
          unitPrice: 2.49,
          quantity: 1,
          category: 'tea',
        },
      ],
      subtotal: 23.46,
      taxPercent: 5,
      taxAmount: 1.17,
      discountType: 'percentage',
      discountValue: 0,
      discountAmount: 0,
      total: 24.63,
      paymentMethod: 'cash',
      cashReceived: 30,
      changeDue: 5.37,
      status: 'preparing',
    },
  ];
}

export const BillingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('pos');

  // Load Settings
  const [settings, setSettings] = useState<CafeSettings>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY_SETTINGS);
      return stored ? { ...INITIAL_CAFE_SETTINGS, ...JSON.parse(stored) } : INITIAL_CAFE_SETTINGS;
    } catch {
      return INITIAL_CAFE_SETTINGS;
    }
  });

  // Sound sync
  useEffect(() => {
    sound.setEnabled(settings.enableSound);
  }, [settings.enableSound]);

  // Load Menu Items
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY_MENU);
      return stored ? JSON.parse(stored) : INITIAL_MENU_ITEMS;
    } catch {
      return INITIAL_MENU_ITEMS;
    }
  });

  // Load Bills
  const [bills, setBills] = useState<Bill[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY_BILLS);
      return stored ? JSON.parse(stored) : getInitialBills();
    } catch {
      return getInitialBills();
    }
  });

  // Load Held orders
  const [heldOrders, setHeldOrders] = useState<HeldOrder[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY_HELD);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Token Counter
  const [tokenCounter, setTokenCounter] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY_TOKEN);
      return stored ? parseInt(stored, 10) : 21;
    } catch {
      return 21;
    }
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_MENU, JSON.stringify(menuItems));
    } catch (e) {
      console.warn('Failed to save menu items', e);
    }
  }, [menuItems]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_BILLS, JSON.stringify(bills));
    } catch (e) {
      console.warn('Failed to save bills', e);
    }
  }, [bills]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save settings', e);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_HELD, JSON.stringify(heldOrders));
    } catch (e) {
      console.warn('Failed to save held orders', e);
    }
  }, [heldOrders]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_TOKEN, tokenCounter.toString());
    } catch (e) {
      console.warn('Failed to save token counter', e);
    }
  }, [tokenCounter]);

  // Current Active Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderType, setOrderType] = useState<OrderType>('dine-in');
  const [tableNumber, setTableNumber] = useState<string>('Table 1');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [orderNote, setOrderNote] = useState<string>('');

  // Discount & Tax calculations
  const [taxPercent, setTaxPercent] = useState<number>(settings.taxPercent || 5.0);
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(0);

  // Popups and Modals
  const [activeBillForReceipt, setActiveBillForReceipt] = useState<Bill | null>(null);
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [isHoldModalOpen, setIsHoldModalOpen] = useState<boolean>(false);

  // Computed Cart Numbers
  const subtotal = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

  let discountAmount = 0;
  if (discountType === 'percentage') {
    discountAmount = (subtotal * Math.min(100, Math.max(0, discountValue))) / 100;
  } else {
    discountAmount = Math.min(subtotal, Math.max(0, discountValue));
  }

  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = (taxableAmount * taxPercent) / 100;
  const grandTotal = Math.max(0, taxableAmount + taxAmount);

  // Cart operations
  const addToCart = (
    item: MenuItem,
    choice?: CustomOptionChoice,
    note?: string
  ) => {
    const extraPrice = choice ? choice.extraPrice : 0;
    const unitPrice = item.price + extraPrice;

    setCart((prev) => {
      // Find if an identical item + choice already exists
      const existingIndex = prev.findIndex(
        (ci) =>
          ci.menuItemId === item.id &&
          ci.selectedChoice?.name === choice?.name &&
          (ci.note || '') === (note || '')
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + 1,
        };
        return next;
      }

      const newCartItem: CartItem = {
        cartItemId: 'item_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        menuItemId: item.id,
        name: item.name,
        basePrice: item.price,
        selectedChoice: choice,
        unitPrice,
        quantity: 1,
        note,
        category: item.category,
      };
      return [...prev, newCartItem];
    });

    sound.playBeep();
  };

  const updateCartQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity: newQty } : item
      )
    );
    sound.playClick();
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
    sound.playClick();
  };

  const updateCartItemNote = (cartItemId: string, note: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.cartItemId === cartItemId ? { ...item, note } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setDiscountValue(0);
    setCustomerName('');
    setCustomerPhone('');
    setOrderNote('');
  };

  // Hold current order
  const holdCurrentOrder = () => {
    if (cart.length === 0) return;
    const newHold: HeldOrder = {
      id: 'hold_' + Date.now(),
      timestamp: new Date().toISOString(),
      items: [...cart],
      orderType,
      tableNumber: orderType === 'dine-in' ? tableNumber : undefined,
      customerName: customerName || undefined,
      note: orderNote || undefined,
    };
    setHeldOrders((prev) => [newHold, ...prev]);
    clearCart();
    sound.playClick();
  };

  const resumeHeldOrder = (heldId: string) => {
    const found = heldOrders.find((h) => h.id === heldId);
    if (!found) return;
    setCart(found.items);
    setOrderType(found.orderType);
    if (found.tableNumber) setTableNumber(found.tableNumber);
    if (found.customerName) setCustomerName(found.customerName);
    if (found.note) setOrderNote(found.note);

    setHeldOrders((prev) => prev.filter((h) => h.id !== heldId));
    setIsHoldModalOpen(false);
    sound.playBeep();
  };

  const deleteHeldOrder = (heldId: string) => {
    setHeldOrders((prev) => prev.filter((h) => h.id !== heldId));
    sound.playClick();
  };

  // Settle & complete order
  const settleOrder = (
    paymentMethod: PaymentMethod,
    cashReceived?: number,
    changeDue?: number
  ): Bill => {
    const orderNum = bills.length > 0 ? Math.max(...bills.map((b) => b.orderNumber)) + 1 : 1001;
    const currentToken = tokenCounter;
    setTokenCounter((prev) => (prev >= 99 ? 1 : prev + 1));

    const newBill: Bill = {
      id: 'bill-' + Date.now(),
      orderNumber: orderNum,
      tokenNumber: currentToken,
      createdAt: new Date().toISOString(),
      orderType,
      tableNumber: orderType === 'dine-in' ? tableNumber : undefined,
      customerName: customerName.trim() || undefined,
      customerPhone: customerPhone.trim() || undefined,
      items: [...cart],
      subtotal,
      taxPercent,
      taxAmount,
      discountType,
      discountValue,
      discountAmount,
      total: grandTotal,
      paymentMethod,
      cashReceived,
      changeDue,
      status: 'preparing',
      notes: orderNote.trim() || undefined,
    };

    setBills((prev) => [newBill, ...prev]);
    sound.playSuccessChime();

    // Prepare for next order
    clearCart();
    setIsPaymentModalOpen(false);
    setActiveBillForReceipt(newBill);

    return newBill;
  };

  // Update kitchen order status
  const updateOrderStatus = (billId: string, status: OrderStatus) => {
    setBills((prev) =>
      prev.map((b) => (b.id === billId ? { ...b, status } : b))
    );
    sound.playClick();
  };

  // Menu item modification
  const updateMenuItem = (updatedItem: MenuItem) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
  };

  const toggleItemAvailability = (id: string) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
      )
    );
    sound.playClick();
  };

  const addMenuItem = (item: MenuItem) => {
    setMenuItems((prev) => [item, ...prev]);
  };

  const resetMenuToDefault = () => {
    setMenuItems(INITIAL_MENU_ITEMS);
    localStorage.removeItem(LOCAL_STORAGE_KEY_MENU);
  };

  const updateSettings = (newSettings: Partial<CafeSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  // Compute Today's Stats
  const todayDateString = new Date().toDateString();
  const todayBills = bills.filter(
    (b) => new Date(b.createdAt).toDateString() === todayDateString && b.status !== 'cancelled'
  );

  const revenue = todayBills.reduce((acc, b) => acc + b.total, 0);
  const cashTotal = todayBills
    .filter((b) => b.paymentMethod === 'cash')
    .reduce((acc, b) => acc + b.total, 0);
  const cardTotal = todayBills
    .filter((b) => b.paymentMethod === 'card')
    .reduce((acc, b) => acc + b.total, 0);
  const upiTotal = todayBills
    .filter((b) => b.paymentMethod === 'upi')
    .reduce((acc, b) => acc + b.total, 0);
  const itemsSold = todayBills.reduce(
    (acc, b) => acc + b.items.reduce((sum, item) => sum + item.quantity, 0),
    0
  );

  return (
    <BillingContext.Provider
      value={{
        activeTab,
        setActiveTab,
        settings,
        updateSettings,
        menuItems,
        updateMenuItem,
        toggleItemAvailability,
        addMenuItem,
        resetMenuToDefault,
        cart,
        orderType,
        setOrderType,
        tableNumber,
        setTableNumber,
        customerName,
        setCustomerName,
        customerPhone,
        setCustomerPhone,
        orderNote,
        setOrderNote,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        updateCartItemNote,
        clearCart,
        subtotal,
        taxPercent,
        setTaxPercent,
        taxAmount,
        discountType,
        setDiscountType,
        discountValue,
        setDiscountValue,
        discountAmount,
        grandTotal,
        heldOrders,
        holdCurrentOrder,
        resumeHeldOrder,
        deleteHeldOrder,
        bills,
        settleOrder,
        updateOrderStatus,
        activeBillForReceipt,
        setActiveBillForReceipt,
        customizingItem,
        setCustomizingItem,
        isPaymentModalOpen,
        setIsPaymentModalOpen,
        isHoldModalOpen,
        setIsHoldModalOpen,
        todayStats: {
          revenue,
          orderCount: todayBills.length,
          cashTotal,
          cardTotal,
          upiTotal,
          itemsSold,
        },
      }}
    >
      {children}
    </BillingContext.Provider>
  );
};

export const useBilling = () => {
  const context = useContext(BillingContext);
  if (!context) {
    throw new Error('useBilling must be used within a BillingProvider');
  }
  return context;
};
