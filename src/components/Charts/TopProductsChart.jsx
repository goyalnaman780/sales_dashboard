import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell 
} from 'recharts';
import { Package } from 'lucide-react';

export default function TopProductsChart({ orders }) {
  // Aggregate revenue by product name
  const productMap = {};
  orders.forEach(o => {
    const name = o.product_name || 'Unknown Product';
    if (!productMap[name]) {
      productMap[name] = { name, revenue: 0, units: 0 };
    }
    productMap[name].revenue += Number(o.amount) || 0;
    productMap[name].units += Number(o.quantity) || 1;
  });

  const chartData = Object.values(productMap)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5); // Top 5

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-panel p-2.5 rounded-xl border border-slate-700 shadow-xl text-xs space-y-1">
          <p className="font-bold text-slate-200">{data.name}</p>
          <p className="text-emerald-400 font-semibold">Total Sales: ${data.revenue.toLocaleString()}</p>
          <p className="text-indigo-400 font-medium">Units Sold: {data.units}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel glass-card-hover rounded-2xl p-6 border border-slate-800 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Package className="w-4 h-4 text-emerald-400" />
          <h3 className="font-bold text-slate-100 text-lg">Top 5 Best-Selling Products</h3>
        </div>
        <p className="text-xs text-slate-400">Ranked by total revenue generated</p>
      </div>

      <div className="w-full h-64 mt-4">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={chartData}
              margin={{ top: 5, right: 20, left: 40, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
              <XAxis 
                type="number" 
                stroke="#64748b" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(v) => `$${v >= 1000 ? `${(v/1000).toFixed(1)}k` : v}`}
              />
              <YAxis 
                type="category" 
                dataKey="name" 
                stroke="#94a3b8" 
                fontSize={11} 
                tickLine={false} 
                axisLine={false}
                width={110}
                tickFormatter={(val) => val.length > 16 ? `${val.substring(0, 14)}...` : val}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="revenue" radius={[0, 6, 6, 0]}>
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`bar-${index}`} 
                    fill={index === 0 ? '#10b981' : index === 1 ? '#6366f1' : '#8b5cf6'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-500 text-sm">
            No product sales data available
          </div>
        )}
      </div>
    </div>
  );
}
