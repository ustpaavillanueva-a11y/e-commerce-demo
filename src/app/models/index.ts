export interface Login {
  LoginID: number;
  email: string;
  password: string;
  createdAt: string;
}

export interface User {
  UserID: number;
  LoginID: number;
  firstName: string;
  lastName: string;
  middleName?: string;
  contactNumber: string;
  address: string;
  role: 'admin' | 'user' | 'customer';
  createdAt: string;
}

export interface Product {
  ProductID: number;
  name: string;
  description: string;
  imageUrl: string;
  stock: number;
  price?: number;
  createdAt: string;
}

export interface Order {
  OrderID: number;
  userID: number;
  totalAmount: number;
  orderDate: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
}

export interface OrderItem {
  OrderItemID: number;
  orderID: number;
  productID: number;
  quantity: number;
  price: number;
}
