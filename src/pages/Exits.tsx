import React, { useState } from 'react';
import { ArrowUpCircle, Plus, Calendar, User, MapPin, AlertCircle } from 'lucide-react';
import { mockProducts, mockExits } from '../lib/mockData';
import { cn } from '../lib/utils';

export default function Exits() {
  const [formData, setFormData] = useState({
    productId: '',
    quantity: '',
    date: new Date().toISOString().split('T')[0],
    destination: '',
    responsible: ''
  });

  const selectedProduct = mockProducts.find(p => p.id === formData.productId);
  const isStockInsufficient = selectedProduct && Number(formData.quantity) > selectedProduct.quantity;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isStockInsufficient) {
      alert('Stock insuficiente!');
      return;
    }
    console.log('Nova saída:', formData);
    alert('Saída registada com sucesso!');
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Saídas de Stock</h1>
        <p className="text-slate-500">Registe o envio de produtos para clientes ou obras.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Exit Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 sticky top-24">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Plus className="w-5 h-5 text-orange-600" />
              Nova Saída
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Produto</label>
                <select 
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                  value={formData.productId}
                  onChange={(e) => setFormData({...formData, productId: e.target.value})}
                >
                  <option value="">Seleccionar produto...</option>
                  {mockProducts.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (Disp: {p.quantity})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Quantidade</label>
                <input 
                  type="number" 
                  required
                  min="1"
                  className={cn(
                    "w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:ring-2 outline-none transition-all",
                    isStockInsufficient ? "border-red-500 focus:ring-red-500/20" : "border-slate-200 focus:ring-blue-500/20"
                  )}
                  placeholder="0"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                />
                {isStockInsufficient && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Quantidade superior ao stock disponível ({selectedProduct?.quantity})
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Data</label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="date" 
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Responsável</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text" 
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                      placeholder="Nome"
                      value={formData.responsible}
                      onChange={(e) => setFormData({...formData, responsible: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Destino</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                    placeholder="Ex: Obra Central, Cliente X"
                    value={formData.destination}
                    onChange={(e) => setFormData({...formData, destination: e.target.value})}
                  />
                </div>
              </div>
              <button 
                type="submit"
                disabled={isStockInsufficient}
                className={cn(
                  "w-full font-semibold py-3 rounded-xl shadow-lg transition-all",
                  isStockInsufficient 
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none" 
                    : "bg-orange-600 hover:bg-orange-700 text-white shadow-orange-200"
                )}
              >
                Registar Saída
              </button>
            </form>
          </div>
        </div>

        {/* History Table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Histórico de Saídas</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Produto</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Qtd</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Destino</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Data</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Responsável</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {mockExits.map((exit) => {
                    const product = mockProducts.find(p => p.id === exit.productId);
                    return (
                      <tr key={exit.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="text-sm font-semibold text-slate-900">{product?.name}</span>
                        </td>
                        <td className="px-6 py-4 text-sm font-mono text-orange-600 font-bold">
                          -{exit.quantity}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">{exit.destination}</td>
                        <td className="px-6 py-4 text-sm text-slate-500">{exit.date}</td>
                        <td className="px-6 py-4 text-sm text-slate-500">{exit.responsible}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
