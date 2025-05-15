// User types
export interface User {
  id: string;
  email: string;
  fullName: string;
  role: "admin" | "manager" | "staff";
  avatarUrl?: string;
  createdAt: string;
}

// Fashion business types
export interface FashionDesign {
  id: string;
  name: string;
  description: string;
  designerId: string;
  designImages: string[];
  category: string;
  status: "draft" | "in-review" | "approved" | "archived";
  technicalSpecs?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FashionInventoryItem {
  id: string;
  name: string;
  type: "Fabric" | "Accessory" | "Thread" | "Tool" | "Other";
  quantity: number;
  unit: string;
  reorderPoint: number;
  costPerUnit: number;
  supplierId?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FashionOrder {
  id: string;
  customerId: string;
  items: FashionOrderItem[];
  totalAmount: number;
  status: "pending" | "in-progress" | "ready" | "delivered" | "cancelled";
  paymentStatus: "pending" | "partial" | "paid";
  dueDate: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FashionOrderItem {
  id: string;
  orderId: string;
  designId?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  measurements?: Record<string, string | number>;
  status: "pending" | "pattern-making" | "cutting" | "sewing" | "finishing" | "completed";
  notes?: string;
}

// Food business types
export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  available: boolean;
  imageUrl?: string;
  ingredients?: string[];
  nutritionalInfo?: Record<string, string | number>;
  allergens?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface FoodInventoryItem {
  id: string;
  name: string;
  type: string;
  quantity: number;
  unit: string;
  reorderPoint: number;
  costPerUnit: number;
  expiryDate?: string;
  supplierId?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FoodOrder {
  id: string;
  customerId?: string;
  customerName: string;
  customerPhone?: string;
  items: FoodOrderItem[];
  totalAmount: number;
  status: "pending" | "preparing" | "ready-for-pickup" | "out-for-delivery" | "delivered" | "cancelled";
  paymentStatus: "pending" | "paid";
  orderType: "dine-in" | "takeaway" | "delivery";
  deliveryAddress?: string;
  deliveryFee?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FoodOrderItem {
  id: string;
  orderId: string;
  menuItemId: string;
  menuItemName: string;
  quantity: number;
  unitPrice: number;
  notes?: string;
}

// Shared customer type
export interface Customer {
  id: string;
  fullName: string;
  email?: string;
  phone?: string;
  address?: string;
  type: "individual" | "business";
  businessName?: string;
  notes?: string;
  fashionCustomer: boolean;
  foodCustomer: boolean;
  measurements?: Record<string, string | number>;
  preferences?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

// Financial types
export interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  businessType: "fashion" | "food" | "shared";
  categoryId: string;
  description: string;
  paymentMethod: string;
  reference?: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  businessType: "fashion" | "food" | "shared";
  description?: string;
}

export interface IncomeCategory {
  id: string;
  name: string;
  businessType: "fashion" | "food" | "shared";
  description?: string;
}

export interface CustomOrderFormData {
  name: string;
  email: string;
  phone: string;
  orderType: "dress" | "top" | "skirt" | "pants" | "suit" | "other";
  otherOrderType?: string;
  description: string;
  size: "xs" | "s" | "m" | "l" | "xl" | "xxl" | "custom";
  customSize?: {
    bust?: number;
    waist?: number;
    hip?: number;
    height?: number;
    shoulder?: number;
  };
  budget: number;
  timeline: "standard" | "rush" | "flexible";
  referenceImages: File[];
  fabricPreferences?: string;
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  additionalNotes?: string;
}
