export type ItemCategory = 
  | 'all'
  | 'burgers'
  | 'broasted'
  | 'tea'
  | 'juices'
  | 'sides'
  | 'desserts';

export interface CustomOptionChoice {
  name: string;
  extraPrice: number;
}

export interface MenuItem {
  id: string;
  name: string;
  category: ItemCategory;
  price: number;
  description: string;
  image?: string;
  isVeg?: boolean;
  isSpicy?: boolean;
  isPopular?: boolean;
  isAvailable: boolean;
  customizationGroup?: {
    title: string;
    choices: CustomOptionChoice[];
  };
}

export interface CartItem {
  cartItemId: string; // unique instance in cart
  menuItemId: string;
  name: string;
  basePrice: number;
  selectedChoice?: CustomOptionChoice;
  unitPrice: number;
  quantity: number;
  note?: string;
  category: ItemCategory;
}

export type OrderType = 'dine-in' | 'takeaway' | 'delivery';
export type PaymentMethod = 'cash' | 'card' | 'upi' | 'split';
export type OrderStatus = 'preparing' | 'ready' | 'completed' | 'cancelled';

export interface Bill {
  id: string;
  orderNumber: number;
  tokenNumber: number;
  createdAt: string;
  orderType: OrderType;
  tableNumber?: string;
  customerName?: string;
  customerPhone?: string;
  items: CartItem[];
  subtotal: number;
  taxPercent: number;
  taxAmount: number;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  discountAmount: number;
  total: number;
  paymentMethod: PaymentMethod;
  cashReceived?: number;
  changeDue?: number;
  status: OrderStatus;
  notes?: string;
}

export interface CafeSettings {
  cafeName: string;
  tagline: string;
  address: string;
  phone: string;
  gstin: string;
  upiId: string;
  taxPercent: number;
  currencySymbol: string;
  enableSound: boolean;
  receiptFooterMessage: string;
}

export type ActiveTab = 'pos' | 'kds' | 'history' | 'analytics' | 'menu';
