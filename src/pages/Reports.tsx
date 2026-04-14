import { useState } from 'react';
import { FileText, Download, Filter, Calendar, Search, FileSpreadsheet } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Reports() {
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Relatórios</h1>
          <p className="text-slate-500">Gere e exporte relatórios detalhados de inventário e movimentação.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm">
            <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
            Excel
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-blue-200 transition-all">
            <FileText className="w-5 h-5" />
            PDF
          </button>
        </div>
      </div>

      {/* Report Filters */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Filter className="w-5 h-5 text-blue-600" />
          Filtros do Relatório
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Período Inicial</label>
            <div className="relative">
              <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="date" 
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                value={dateRange.start}
                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Período Final</label>
            <div className="relative">
              <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="date" 
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                value={dateRange.end}
                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Categoria</label>
            <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none">
              <option>Todas as Categorias</option>
              <option>Alimentar</option>
              <option>Construção</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Tipo de Movimento</label>
            <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none">
              <option>Todos os Movimentos</option>
              <option>Apenas Entradas</option>
              <option>Apenas Saídas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Report Preview Placeholder */}
      <div className="bg-slate-100/50 border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center">
        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4">
          <Search className="w-8 h-8 text-slate-300" />
        </div>
        <h4 className="text-lg font-bold text-slate-900 mb-2">Pré-visualização do Relatório</h4>
        <p className="text-slate-500 max-w-md mx-auto">
          Seleccione os filtros acima e clique em "Gerar Relatório" para ver os dados aqui antes de exportar.
        </p>
        <button className="mt-6 bg-slate-900 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-slate-800 transition-all">
          Gerar Relatório
        </button>
      </div>

      {/* Quick Reports List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'Inventário Total', desc: 'Estado actual de todos os produtos.', icon: FileText },
          { title: 'Movimentação Mensal', desc: 'Resumo de entradas e saídas do mês.', icon: Download },
          { title: 'Produtos Críticos', desc: 'Lista de produtos abaixo do stock mínimo.', icon: AlertCircle },
        ].map((report, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:border-blue-200 transition-colors group cursor-pointer">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <report.icon className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 mb-1">{report.title}</h4>
            <p className="text-sm text-slate-500">{report.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

import { AlertCircle } from 'lucide-react';
