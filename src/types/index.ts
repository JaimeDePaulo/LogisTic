export type Category = 'Alimentar' | 'Construção';

export interface Product {
  id: string;
  name: string;
  category: Category;
  quantity: number;
  unit: string;
  expiryDate?: string;
  minStock: number;
}

export interface Entry {
  id: string;
  productId: string;
  quantity: number;
  date: string;
  supplier: string;
  responsible: string;
  notes?: string;
}

export interface Exit {
  id: string;
  productId: string;
  quantity: number;
  date: string;
  destination: string;
  responsible: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'user';
  createdAt: string;
}
