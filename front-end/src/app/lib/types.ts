export interface ApiList<T> {
  success: boolean;
  count?: number;
  data: T[];
}

export interface ApiOne<T> {
  success: boolean;
  data: T;
}

export interface UserDoc {
  _id: string;
  name: string;
  email: string;
  phone: string;
  military_number: string;
  role: 'admin' | 'unit';
  createdAt?: string;
  updatedAt?: string;
}

export interface WarehouseDoc {
  _id: string;
  name: string;
  location: string;
  user_id?: UserDoc;
  createdAt?: string;
}

export interface ProductDoc {
  _id: string;
  name: string;
  quantity: number;
  unit: 'kg' | 'g' | 'liter' | 'Tons' | 'piece' | 'box';
  category: string;
  min_quantity: number;
  warehouse_id?: WarehouseDoc;
  expiry_date?: string;
  createdAt?: string;
}

export interface ProductWarehouseDoc {
  _id: string;
  warehouse_id?: WarehouseDoc;
  product_id?: ProductDoc;
  quantity: number;
}

export interface SupplierDoc {
  _id: string;
  name: string;
  phone: string;
}

export interface OrderDoc {
  _id: string;
  date: string;
  total_price: number;
  status: 'pending' | 'approved' | 'completed' | 'cancelled';
  user_id?: UserDoc;
  supplier_id?: SupplierDoc;
}

export interface OrderItemDoc {
  _id: string;
  order_id?: OrderDoc;
  product_id?: ProductDoc;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface InventoryMovementDoc {
  _id: string;
  user_id?: UserDoc;
  product_id?: ProductDoc;
  change_type: 'in' | 'out';
  stock: number;
  reference_id?: WarehouseDoc;
  reference_type?: string;
  createdAt?: string;
}

export interface NotificationDoc {
  _id: string;
  title: string;
  type: string;
  message: string;
  is_read: boolean;
  user_id?: UserDoc;
  createdAt?: string;
}

