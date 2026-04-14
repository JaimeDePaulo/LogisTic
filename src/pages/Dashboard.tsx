import { 
  Package, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  AlertTriangle, 
  Clock,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from 'recharts';
import { cn } from '../lib/utils';

const stats = [
  { 
    label: 'Total de Produtos', 
    value: '1,284', 
    icon: Package, 
    color: 'blue', 
    trend: '+12%', 
    trendUp: true 
  },
  { 
    label: 'Entradas (Mês)', 
    value: '450', 
    icon: ArrowDownCircle, 
    color: 'green', 
    trend: '+5%', 
    trendUp: true 
  },
  { 
    label: 'Saídas (Mês)', 
    value: '320', 
    icon: ArrowUpCircle, 
    color: 'orange', 
    trend: '-2%', 
    trendUp: false 
  },
  { 
    label: 'Estoque Baixo', 
    value: '12', 
    icon: AlertTriangle, 
    color: 'red', 
    trend: '+3', 
    trendUp: false 
  },
  { 
    label: 'Próximos da Validade', 
    value: '8', 
    icon: Clock, 
    color: 'amber', 
    trend: 'Estável', 
    trendUp: true 
  },
];

const barData = [
  { name: 'Jan', entradas: 400, saidas: 240 },
  { name: 'Fev', entradas: 300, saidas: 139 },
  { name: 'Mar', entradas: 200, saidas: 980 },
  { name: 'Abr', entradas: 278, saidas: 390 },
  { name: 'Mai', entradas: 189, saidas: 480 },
  { name: 'Jun', entradas: 239, saidas: 380 },
];

const pieData = [
  { name: 'Alimentar', value: 400 },
  { name: 'Construção', value: 300 },
];

const COLORS = ['#2563eb', '#10b981'];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500">Bem-vindo de volta ao seu painel de controlo logístico.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className={cn(
                "p-3 rounded-2xl",
                stat.color === 'blue' && "bg-blue-50 text-blue-600",
                stat.color === 'green' && "bg-emerald-50 text-emerald-600",
                stat.color === 'orange' && "bg-orange-50 text-orange-600",
                stat.color === 'red' && "bg-red-50 text-red-600",
                stat.color === 'amber' && "bg-amber-50 text-amber-600",
              )}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={cn(
                "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
                stat.trendUp ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
              )}>
                {stat.trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {stat.trend}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bar Chart */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-900">Entradas vs Saídas</h3>
            <select className="bg-slate-50 border-none text-sm rounded-lg px-3 py-1 outline-none">
              <option>Últimos 6 Meses</option>
              <option>Este Ano</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="entradas" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={30} />
                <Bar dataKey="saidas" fill="#10b981" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-8">Distribuição por Categoria</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity Table (Brief) */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">Actividade Recente</h3>
          <button className="text-blue-600 text-sm font-semibold hover:underline">Ver tudo</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Produto</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Quantidade</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Data</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Responsável</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { product: 'Arroz Agulha 1kg', type: 'Entrada', qty: '+100', date: '12 Abr 2024', user: 'João Silva' },
                { product: 'Cimento Portland', type: 'Saída', qty: '-20', date: '11 Abr 2024', user: 'Maria Santos' },
                { product: 'Leite UHT 1L', type: 'Entrada', qty: '+50', date: '10 Abr 2024', user: 'Carlos Lima' },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{row.product}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      row.type === 'Entrada' ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-600"
                    )}>
                      {row.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-slate-600">{row.qty}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{row.date}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{row.user}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
