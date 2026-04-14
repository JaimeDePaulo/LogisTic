import { Product, Entry, Exit, User } from '../types';

export const mockUsers: User[] = [
  { id: 'u1', uid: 'u1', name: 'Admin Principal', email: 'admin@logistock.com', password: 'admin', role: 'admin', createdAt: '2024-01-01' },
  { id: 'u2', uid: 'u2', name: 'Operador João', email: 'joao@logistock.com', password: 'user', role: 'user', createdAt: '2024-02-15' },
];

export const mockProducts: Product[] = [
  { id: '1', name: 'Arroz Agulha 1kg', category: 'Alimentar', quantity: 150, unit: 'un', expiryDate: '2026-12-31', minStock: 50 },
  { id: '2', name: 'Cimento Portland 50kg', category: 'Construção', quantity: 20, unit: 'saco', minStock: 30 },
];

export const mockEntries: Entry[] = [
  { id: 'e1', productId: '1', quantity: 100, date: '2026-04-01', supplier: 'Alimentos Lda', responsible: 'João Silva' },
];

export const mockExits: Exit[] = [
  { id: 's1', productId: '1', quantity: 20, date: '2026-04-10', destination: 'Loja Central', responsible: 'João Silva' },
];
