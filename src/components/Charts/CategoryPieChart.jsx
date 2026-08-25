import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { PieChart as PieIcon } from 'lucide-react';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];

export default function CategoryPieChart({ orders }) {
  // Group by category
  const categoryMap = {};
  orders.forEach(o => {
    const cat = o.category || 'Uncategorized';
    categoryMap[cat] = (categoryMap[cat] || 0) + (Number(o.amount) || 0);
  });

  const chartData = Object.entries(categoryMap).map(([name, value]) => ({
    name,
    value: Math.round(value)
  })).sort((a, b) => b.value - a.value);

  const totalRevenue = chartData.reduce((acc, curr) => acc + curr.value, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = totalRevenue > 0 ? ((data.value / totalRevenue) * 100).toFixed(1) : 0;
      return (
        <div className="glass-panel p-2.5 rounded-xl border border-slate-700 shadow-xl text-xs space-y-1">
          <p className="font-bold text-slate-200">{data.name}</p>
          <p className="text-emerald-400 font-semibold">${data.value.toLocaleString()}</p>
          <p className="text-slate-400 text-[11px]">{percentage}% of total sales</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel glass-card-hover rounded-2xl p-6 border border-slate-800 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <PieIcon className="w-4 h-4 text-purple-400" />
          <h3 className="font-bold text-slate-100 text-lg">Sales by Category</h3>
        </div>
        <p className="text-xs text-slate-400">Revenue breakdown by product type</p>
      </div>

      <div className="w-full h-64 mt-4 relative">
        {chartData.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                      stroke="#0f172a"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle"
                  formatter={(value) => <span className="text-xs text-slate-300 font-medium">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Label inside Donut */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
              <span className="text-xs text-slate-400 uppercase tracking-widest font-semibold text-[10px]">Categories</span>
              <span className="text-lg font-bold text-white">{chartData.length}</span>
            </div>
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-500 text-sm">
            No category data available
          </div>
        )}
      </div>
    </div>
  );
}
