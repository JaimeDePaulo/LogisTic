import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit2, Trash2, Utensils, X, FileText, Download } from 'lucide-react';
import { collection, onSnapshot, query, where, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Product } from '../types';
import { cn } from '../lib/utils';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

export default function FoodProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    quantity: 0,
    unit: 'un',
    expiryDate: '',
    minStock: 10
  });

  useEffect(() => {
    const q = query(collection(db, 'products'), where('category', '==', 'Alimentar'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(productsData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'products');
    });

    return () => unsubscribe();
  }, []);

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Lista de Produtos Alimentares', 14, 15);
    
    const tableData = products.map(p => [
      p.name,
      p.quantity.toString(),
      p.unit,
      p.expiryDate || 'N/A',
      p.minStock.toString()
    ]);

    (doc as any).autoTable({
      head: [['Nome', 'Quantidade', 'Unidade', 'Validade', 'Stock Mín.']],
      body: tableData,
      startY: 20,
    });

    doc.save('produtos-alimentares.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(products.map(p => ({
      Nome: p.name,
      Quantidade: p.quantity,
      Unidade: p.unit,
      Validade: p.expiryDate || 'N/A',
      'Stock Mínimo': p.minStock
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Produtos");
    XLSX.writeFile(workbook, "produtos-alimentares.xlsx");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await updateDoc(doc(db, 'products', editingProduct.id), formData);
      } else {
        await addDoc(collection(db, 'products'), {
          ...formData,
          category: 'Alimentar'
        });
      }
      setIsModalOpen(false);
      setEditingProduct(null);
      setFormData({ name: '', quantity: 0, unit: 'un', expiryDate: '', minStock: 10 });
    } catch (error) {
      handleFirestoreError(error, editingProduct ? OperationType.UPDATE : OperationType.CREATE, 'products');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este produto?')) return;
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `products/${id}`);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Utensils className="w-6 h-6 text-emerald-600" />
            Produtos Alimentares
          </h1>
          <p className="text-slate-500">Gestão de stock de alimentos e bebidas.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={exportToPDF}
            className="bg-white hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl font-semibold border border-slate-200 flex items-center gap-2 transition-all"
          >
            <FileText className="w-4 h-4" />
            PDF
          </button>
          <button 
            onClick={exportToExcel}
            className="bg-white hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl font-semibold border border-slate-200 flex items-center gap-2 transition-all"
          >
            <Download className="w-4 h-4" />
            Excel
          </button>
          <button 
            onClick={() => {
              setEditingProduct(null);
              setFormData({ name: '', quantity: 0, unit: 'un', expiryDate: '', minStock: 10 });
              setIsModalOpen(true);
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-emerald-200 transition-all shrink-0"
          >
            <Plus className="w-5 h-5" />
            Novo Alimento
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Pesquisar alimentos..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Nome</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Quantidade</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Unidade</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Validade</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg font-bold uppercase">
                        {product.name.charAt(0)}
                      </div>
                      <span className="text-sm font-semibold text-slate-900">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-slate-600">
                    {product.quantity}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {product.unit}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {product.expiryDate || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => {
                          setEditingProduct(product);
                          setFormData({
                            name: product.name,
                            quantity: product.quantity,
                            unit: product.unit,
                            expiryDate: product.expiryDate || '',
                            minStock: product.minStock
                          });
                          setIsModalOpen(true);
                        }}
                        className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">
                {editingProduct ? 'Editar Produto' : 'Novo Produto Alimentar'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Nome do Produto</label>
                <input 
                  type="text" required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Quantidade</label>
                  <input 
                    type="number" required min="0"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
                    value={formData.quantity}
                    onChange={e => setFormData({...formData, quantity: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Unidade</label>
                  <input 
                    type="text" required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
                    value={formData.unit}
                    onChange={e => setFormData({...formData, unit: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Stock Mínimo</label>
                  <input 
                    type="number" required min="1"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
                    value={formData.minStock}
                    onChange={e => setFormData({...formData, minStock: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Validade</label>
                  <input 
                    type="date"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
                    value={formData.expiryDate}
                    onChange={e => setFormData({...formData, expiryDate: e.target.value})}
                  />
                </div>
              </div>
              <div className="pt-4">
                <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-200 transition-all">
                  {editingProduct ? 'Guardar Alterações' : 'Adicionar Produto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
