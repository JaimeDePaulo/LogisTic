import { Product, Entry, Exit, User } from '../types';

export const mockUsers: User[] = [
  { id: 'u1', name: 'Admin Principal', email: 'admin@logistock.com', password: 'admin', role: 'admin', createdAt: '2024-01-01' },
  { id: 'u2', name: 'Operador João', email: 'joao@logistock.com', password: 'user', role: 'user', createdAt: '2024-02-15' },
];

export const mockProducts: Product[] = [
  { id: '1', name: 'Arroz Agulha 1kg', category: 'Alimentar', quantity: 150, unit: 'un', expiryDate: '2026-12-31', minStock: 50 },
  { id: '2', name: 'Cimento Portland 50kg', category: 'Construção', quantity: 20, unit: 'saco', minStock: 30 },
  { id: '3', name: 'Leite UHT 1L', category: 'Alimentar', quantity: 12, unit: 'un', expiryDate: '2026-05-15', minStock: 24 },
  { id: '4', name: 'Tijolo Cerâmico', category: 'Construção', quantity: 500, unit: 'un', minStock: 100 },
  { id: '5', name: 'Óleo Vegetal 1L', category: 'Alimentar', quantity: 45, unit: 'un', expiryDate: '2026-08-20', minStock: 20 },
  { id: '6', name: 'Vara de Aço 12mm', category: 'Construção', quantity: 5, unit: 'un', minStock: 15 },
];

export const mockEntries: Entry[] = [
  { id: 'e1', productId: '1', quantity: 100, date: '2026-04-01', supplier: 'Alimentos Lda', responsible: 'João Silva' },
  { id: 'e2', productId: '2', quantity: 50, date: '2026-04-05', supplier: 'Construções Fortes', responsible: 'Maria Santos' },
];

export const mockExits: Exit[] = [
  { id: 's1', productId: '1', quantity: 20, date: '2026-04-10', destination: 'Loja Central', responsible: 'João Silva' },
  { id: 's2', productId: '4', quantity: 100, date: '2026-04-12', destination: 'Obra X', responsible: 'Carlos Lima' },
];
