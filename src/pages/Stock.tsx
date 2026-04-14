import { mockProducts } from '../lib/mockData';
import { cn } from '../lib/utils';
import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

export default function Stock() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Estoque Actual</h1>
        <p className="text-slate-500">Monitorização dinâmica dos níveis de inventário.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Produto</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Categoria</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Quantidade</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Mínimo</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Acção Recomendada</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockProducts.map((product) => {
                const isCritical = product.quantity <= product.minStock / 2;
                const isLow = product.quantity <= product.minStock && !isCritical;
                
                return (
                  <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-slate-900">{product.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-slate-500">{product.category}</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono font-bold text-slate-700">
                      {product.quantity} {product.unit}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      {product.minStock} {product.unit}
                    </td>
                    <td className="px-6 py-4">
                      {isCritical ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-600">
                          <XCircle className="w-3 h-3" />
                          Crítico
                        </span>
                      ) : isLow ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600">
                          <AlertTriangle className="w-3 h-3" />
                          Baixo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600">
                          <CheckCircle2 className="w-3 h-3" />
                          OK
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {isCritical || isLow ? (
                        <button className="text-xs font-bold text-blue-600 hover:text-blue-700 underline decoration-2 underline-offset-4">
                          Solicitar Reabastecimento
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Nenhuma acção necessária</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
